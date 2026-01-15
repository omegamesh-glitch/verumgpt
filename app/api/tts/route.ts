/**
 * OpenAI Text-to-Speech API Route
 * 
 * This is the EXCLUSIVE TTS provider for VERUM NODE.
 * Uses OpenAI's Text-to-Speech API (tts-1-hd model).
 * 
 * NO ElevenLabs, NO Web Speech API, NO other providers.
 * Powered by OpenAI TTS API only.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getOpenAIKey, recordOpenAIError, resetOpenAIError } from '@/app/utils/openai-helper'

// Available OpenAI TTS voices
// Main voices: Alloy, Echo, Fable, Onyx, Nova, Shimmer
// Additional voices: Ash, Ballad, Coral, Sage, Verse, Marin, Cedar
const AVAILABLE_VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer', 'ash', 'ballad', 'coral', 'sage', 'verse', 'marin', 'cedar'] as const

export async function POST(req: NextRequest) {
  try {
    const { 
      text, 
      voice: requestedVoice,
      model = 'tts-1-hd', // HD model for best quality (most reliable)
      format = 'mp3', // MP3 is faster and more compatible
      speed: requestedSpeed,
      language = 'pt-BR',
      instructions: customInstructions,
      autoEnhance = false, // Disable by default for faster generation
    } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      )
    }

    // Skip enhancement for faster generation (unless explicitly requested)
    let voice = requestedVoice || 'coral'
    let speed = requestedSpeed || 1.0
    let cleanText = text
    
    // Only process enhancement if explicitly requested (adds latency)
    if (autoEnhance && !customInstructions) {
      // Lazy import enhancement functions only when needed
      const { analyzeTextForTTS, detectContext, selectBestVoice, enhanceTextForTTS, calculateOptimalSpeed } = await import('../../utils/ttsEnhancer')
      const emotion = analyzeTextForTTS(text)
      const context = detectContext(text)
      voice = requestedVoice || selectBestVoice(emotion.emotion, context)
      speed = requestedSpeed || calculateOptimalSpeed(text, context)
      cleanText = enhanceTextForTTS(text, context)
    }

    // Validate voice
    const selectedVoice = AVAILABLE_VOICES.includes(voice as any) ? voice : 'coral'

    if (!cleanText || cleanText.length < 1) {
      return NextResponse.json(
        { error: 'No text to speak after cleaning' },
        { status: 400 }
      )
    }

    // Use OpenAI TTS API (EXCLUSIVE PROVIDER) with advanced options and fallback
    console.log('🔊 [OpenAI TTS API] Generating speech with OpenAI TTS...')
    let apiKey = getOpenAIKey()
    let isBackup = apiKey === process.env.OPENAI_API_KEY_BACKUP
    
    let response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'tts-1-hd', // HD model for best quality (most reliable)
        input: cleanText,
        voice: selectedVoice,
        response_format: format, // mp3, wav, pcm, opus, aac, flac
        speed: Math.max(0.25, Math.min(4.0, speed)), // Clamp between 0.25 and 4.0
      }),
    })

    // Try backup key if primary fails
    if (!response.ok && !isBackup && process.env.OPENAI_API_KEY_BACKUP) {
      const errorText = await response.text()
      const isKeyError = response.status === 401 || response.status === 429 || errorText.includes('insufficient_quota')
      
      if (isKeyError) {
        console.log('🔄 [OpenAI TTS API] Primary key failed, trying backup key...')
        recordOpenAIError(apiKey)
        
        apiKey = process.env.OPENAI_API_KEY_BACKUP
        isBackup = true
        
        response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model || 'tts-1-hd',
            input: cleanText,
            voice: selectedVoice,
            response_format: format,
            speed: Math.max(0.25, Math.min(4.0, speed)),
          }),
        })
        
        if (response.ok) {
          console.log('✅ [OpenAI TTS API] Successfully using backup OpenAI key')
          resetOpenAIError()
        }
      }
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [OpenAI TTS API] Error:', response.status, errorText)
      throw new Error(`OpenAI TTS API error: ${response.status}`)
    }
    
    console.log('✅ [OpenAI TTS API] Speech generated successfully')
    resetOpenAIError() // Reset on success

    const audioBuffer = await response.arrayBuffer()
    
    // Determine content type based on format
    const contentTypeMap: Record<string, string> = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      pcm: 'audio/pcm',
      opus: 'audio/opus',
      aac: 'audio/aac',
      flac: 'audio/flac',
    }
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': contentTypeMap[format] || 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours (longer cache)
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    })
  } catch (error: any) {
    // SECURITY: Never expose API keys in error messages
    const errorMessage = error?.message || 'Unknown error'
    const sanitizedError = errorMessage
      .replace(/sk-[a-zA-Z0-9_-]{20,}/g, '[API_KEY_REDACTED]')
      .replace(/Bearer\s+[a-zA-Z0-9_-]+/g, 'Bearer [REDACTED]')
    
    console.error('❌ [OpenAI TTS API] Error:', sanitizedError)
    return NextResponse.json(
      { 
        error: 'OpenAI TTS API failed to generate speech',
        details: sanitizedError
      },
      { status: 500 }
    )
  }
}
