import { NextRequest } from 'next/server'

// Streaming TTS endpoint for real-time audio playback
export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'marin', model = 'tts-1', format = 'wav' } = await req.json()

    if (!text) {
      return new Response(JSON.stringify({ error: 'No text provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Use OpenAI TTS API with streaming
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        input: text,
        voice: voice,
        response_format: format, // Use wav or pcm for low latency
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI TTS streaming error:', response.status, errorText)
      return new Response(JSON.stringify({ error: `TTS API error: ${response.status}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Stream the audio response
    const contentTypeMap: Record<string, string> = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      pcm: 'audio/pcm',
      opus: 'audio/opus',
      aac: 'audio/aac',
      flac: 'audio/flac',
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': contentTypeMap[format] || 'audio/wav',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error: any) {
    console.error('TTS streaming error:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to stream speech',
      details: error?.message || 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
