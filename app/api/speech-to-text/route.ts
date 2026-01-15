/**
 * Speech-to-Text API Route
 * 
 * Uses OpenAI Whisper API for audio transcription
 * Integrates directly with chat - no separate tabs needed
 */

import { NextRequest, NextResponse } from 'next/server'
import { getOpenAIKey } from '@/app/utils/openai-helper'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    const apiKey = getOpenAIKey()
    if (!apiKey || apiKey.trim() === '') {
      console.error('❌ [OpenAI Whisper] OPENAI_API_KEY not configured')
      console.error('❌ [OpenAI Whisper] OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY)
      console.error('❌ [OpenAI Whisper] OPENAI_API_KEY_BACKUP exists:', !!process.env.OPENAI_API_KEY_BACKUP)
      return NextResponse.json(
        { 
          error: 'OPENAI_API_KEY not configured',
          message: 'Please configure OPENAI_API_KEY or OPENAI_API_KEY_BACKUP in Railway environment variables'
        },
        { status: 500 }
      )
    }
    
    console.log('✅ [OpenAI Whisper] API key configured (length:', apiKey.length, ')')

    // Convert File to Blob for OpenAI API
    const audioBlob = await audioFile.arrayBuffer()
    const audioBuffer = Buffer.from(audioBlob)

    // Create FormData for OpenAI Whisper API
    const openAIFormData = new FormData()
    const audioBlobForOpenAI = new Blob([audioBuffer], { type: audioFile.type || 'audio/webm' })
    openAIFormData.append('file', audioBlobForOpenAI, 'recording.webm')
    openAIFormData.append('model', 'whisper-1')
    openAIFormData.append('language', 'pt') // Portuguese

    console.log('🔊 [OpenAI Whisper] Transcribing audio...')

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: openAIFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [OpenAI Whisper] Error:', response.status, errorText)
      
      // Verificar se é erro de chave API
      if (response.status === 401 || response.status === 403) {
        console.error('❌ [OpenAI Whisper] Invalid API key or unauthorized')
        return NextResponse.json(
          { 
            error: 'Invalid OpenAI API key',
            message: 'Please check your OPENAI_API_KEY in Railway environment variables'
          },
          { status: 401 }
        )
      }
      
      if (response.status === 429) {
        console.error('❌ [OpenAI Whisper] Rate limit exceeded')
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            message: 'OpenAI API rate limit reached. Please try again later.'
          },
          { status: 429 }
        )
      }
      
      throw new Error(`OpenAI Whisper API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ [OpenAI Whisper] Transcription successful')

    return NextResponse.json({
      text: data.text || '',
      language: data.language || 'pt',
    })
  } catch (error: any) {
    console.error('❌ [OpenAI Whisper] Error:', error)
    
    // SECURITY: Sanitize error to never expose API keys
    const errorMessage = error?.message || 'Unknown error'
    const sanitizedError = errorMessage
      .replace(/sk-[a-zA-Z0-9_-]{20,}/g, '[API_KEY_REDACTED]')
      .replace(/Bearer\s+[a-zA-Z0-9_-]+/g, 'Bearer [REDACTED]')
    
    return NextResponse.json(
      {
        error: 'Failed to transcribe audio',
        details: sanitizedError
      },
      { status: 500 }
    )
  }
}
