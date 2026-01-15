import { NextRequest, NextResponse } from 'next/server'

/**
 * ElevenLabs Text-to-Speech API Route
 * High-quality, natural voice synthesis using ElevenLabs
 */

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1'

export async function POST(req: NextRequest) {
  try {
    const { 
      text,
      voice_id,
      model_id = 'eleven_multilingual_v2', // Multilingual model
      stability = 0.5,
      similarity_boost = 0.75,
      style = 0.0,
      use_speaker_boost = true,
    } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      )
    }

    // Get API key from environment
    const apiKey = process.env.ELEVENLABS_API_KEY
    const defaultVoiceId = process.env.ELEVENLABS_VOICE_ID || '6edcf137fb406f20fe21f01df2d3604a164f52a3a1d709b2ffdbd7f99a1daf60'
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      )
    }

    const selectedVoiceId = voice_id || defaultVoiceId

    console.log('🎤 [ElevenLabs TTS] Generating speech...', {
      textLength: text.length,
      voiceId: selectedVoiceId,
      model: model_id,
    })

    // Clean text for better TTS
    let cleanText = text
      .replace(/```[\s\S]*?```/g, '[código]')
      .replace(/`[^`]+`/g, (match: string) => match.replace(/`/g, ''))
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*([^\*]+)\*\*/g, '$1')
      .replace(/\*([^\*]+)\*/g, '$1')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s{3,}/g, ' ')
      .trim()

    if (!cleanText || cleanText.length < 1) {
      return NextResponse.json(
        { error: 'No text to speak after cleaning' },
        { status: 400 }
      )
    }

    // ElevenLabs TTS API call
    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${selectedVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: model_id,
        voice_settings: {
          stability: Math.max(0, Math.min(1, stability)),
          similarity_boost: Math.max(0, Math.min(1, similarity_boost)),
          style: Math.max(0, Math.min(1, style)),
          use_speaker_boost: use_speaker_boost,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [ElevenLabs TTS] Error:', response.status, errorText)
      
      // Try fallback to OpenAI TTS if ElevenLabs fails
      if (process.env.OPENAI_API_KEY) {
        console.log('🔄 [ElevenLabs TTS] Falling back to OpenAI TTS...')
        const openaiResponse = await fetch(`${req.nextUrl.origin}/api/tts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: cleanText,
            voice: 'nova',
            model: 'tts-1-hd',
          }),
        })
        
        if (openaiResponse.ok) {
          const audioBuffer = await openaiResponse.arrayBuffer()
          return new NextResponse(audioBuffer, {
            headers: {
              'Content-Type': 'audio/mpeg',
              'Cache-Control': 'public, max-age=86400',
              'X-Fallback': 'openai',
            },
          })
        }
      }
      
      return NextResponse.json(
        { 
          error: 'ElevenLabs TTS API failed',
          details: errorText,
          status: response.status
        },
        { status: response.status }
      )
    }

    const audioBuffer = await response.arrayBuffer()
    
    console.log('✅ [ElevenLabs TTS] Speech generated successfully', {
      size: `${(audioBuffer.byteLength / 1024).toFixed(2)}KB`,
    })

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Content-Length': audioBuffer.byteLength.toString(),
        'X-Provider': 'elevenlabs',
      },
    })
  } catch (error: any) {
    // SECURITY: Never expose API keys in error messages
    const errorMessage = error?.message || 'Unknown error'
    const sanitizedError = errorMessage
      .replace(/sk-[a-zA-Z0-9_-]{20,}/g, '[API_KEY_REDACTED]')
      .replace(/xi-api-key:\s*[a-zA-Z0-9_-]+/gi, 'xi-api-key: [REDACTED]')
    
    console.error('❌ [ElevenLabs TTS] Error:', sanitizedError)
    return NextResponse.json(
      { 
        error: 'ElevenLabs TTS failed to generate speech',
        details: sanitizedError
      },
      { status: 500 }
    )
  }
}
