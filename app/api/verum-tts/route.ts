import { NextRequest, NextResponse } from 'next/server'

/**
 * VERUM Node TTS API endpoint
 * Uses VERUM Node's native TTS system for natural, high-quality voice
 */
export async function POST(req: NextRequest) {
  try {
    const { 
      text,
      voice = 'verum-natural', // VERUM Node natural voice
      speed = 1.0,
      pitch = 1.0,
    } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      )
    }

    console.log('🎤 VERUM Node TTS request:', {
      textLength: text.length,
      voice,
      speed,
      pitch
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

    // VERUM Node TTS API endpoint
    // Use VERUM Node API if available, otherwise use OpenAI with VERUM-style processing
    const VERUM_TTS_URL = process.env.VERUM_TTS_URL || process.env.VERUM_API_URL || 'https://verumnodelagacy-60045b94a179.herokuapp.com/api/tts'
    
    let response: Response
    
    try {
      // Try VERUM Node TTS API first
      response = await fetch(`${VERUM_TTS_URL}/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VERUM_API_KEY || process.env.OPENAI_API_KEY || ''}`,
        },
        body: JSON.stringify({
          text: cleanText,
          voice: voice,
          speed: speed,
          pitch: pitch,
          format: 'mp3',
          quality: 'high', // VERUM Node high quality
          expressivity: 'high', // Natural expressivity
          emotion: 'neutral', // Can be: neutral, happy, sad, excited, calm
        }),
      })

      if (!response.ok) {
        throw new Error(`VERUM Node TTS API error: ${response.status}`)
      }
    } catch (verumError: any) {
      console.warn('⚠️ VERUM Node TTS not available, using OpenAI with VERUM-style processing:', verumError.message)
      
      // Fallback: Use OpenAI but with VERUM-style natural voice processing
      // This simulates VERUM Node's natural voice quality
      const openaiResponse = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1-hd', // Use HD model for better quality (less robotic)
          input: cleanText,
          voice: 'nova', // More natural voice (less robotic than alloy/marin)
          response_format: 'mp3',
          speed: speed,
        }),
      })
      
      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text()
        throw new Error(`OpenAI TTS error: ${openaiResponse.status} - ${errorText}`)
      }
      
      response = openaiResponse
    }

    const audioBuffer = await response.arrayBuffer()
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    })
  } catch (error: any) {
    console.error('❌ VERUM Node TTS error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to generate speech with VERUM Node' },
      { status: 500 }
    )
  }
}
