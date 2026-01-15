import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured' },
        { status: 500 }
      )
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    // Try GPT-Audio model (text + audio simultaneously)
    try {
      const completion = await client.chat.completions.create({
        model: 'gpt-audio',
        modalities: ['text', 'audio'],
        audio: {
          voice: 'alloy',
          format: 'wav',
        },
        messages: messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
        stream: false,
      })

      const choice = completion.choices[0]
      const textResponse = choice.message.content
      const audioData = choice.message.audio?.data

      return NextResponse.json({
        success: true,
        text: textResponse,
        audio: audioData, // Base64 encoded WAV
        format: 'wav',
        model: 'gpt-audio',
      })
    } catch (gptAudioError: any) {
      // Fallback to regular chat + separate TTS if GPT-Audio not available
      console.warn('GPT-Audio not available, falling back to standard chat:', gptAudioError.message)
      
      const chatCompletion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
      })

      const textResponse = chatCompletion.choices[0].message.content

      // Generate audio separately using TTS API
      let audioData = null
      try {
        const ttsResponse = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'tts-1',
            input: textResponse || '',
            voice: 'alloy',
          }),
        })

        if (ttsResponse.ok) {
          const audioBuffer = await ttsResponse.arrayBuffer()
          // Convert to base64
          const base64Audio = Buffer.from(audioBuffer).toString('base64')
          audioData = base64Audio
        }
      } catch (ttsError) {
        console.warn('TTS generation failed:', ttsError)
      }

      return NextResponse.json({
        success: true,
        text: textResponse,
        audio: audioData,
        format: audioData ? 'mp3' : null,
        model: 'gpt-4o-mini',
        fallback: true,
      })
    }
  } catch (error: any) {
    console.error('Chat audio API error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to generate chat with audio' },
      { status: 500 }
    )
  }
}
