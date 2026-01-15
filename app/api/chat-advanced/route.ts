import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  try {
    const { messages, useAudio = false, tools = [] } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured' },
        { status: 500 }
      )
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    // Try GPT-Audio if requested and available
    if (useAudio) {
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
        console.warn('GPT-Audio not available, falling back to standard chat:', gptAudioError.message)
        // Continue to fallback below
      }
    }

    // Use Response API with tools if provided
    if (tools.length > 0) {
      try {
        const response = await client.responses.create({
          model: 'gpt-4.1',
          input: messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
          tools: tools,
          stream: false,
        })

        // Handle tool calls if any
        const toolCalls = response.output.filter((item: any) => item.type === 'function_call' || item.type === 'custom_tool_call')
        const messageItem: any = response.output.find((item: any) => item.type === 'message')
        let textResponse: string | null = null
        if (messageItem && messageItem.content && Array.isArray(messageItem.content) && messageItem.content[0]) {
          textResponse = messageItem.content[0].text || null
        }

        return NextResponse.json({
          success: true,
          text: textResponse || 'Response generated',
          toolCalls: toolCalls,
          model: 'gpt-4.1',
          hasTools: true,
        })
      } catch (responseApiError: any) {
        console.warn('Response API with tools failed, falling back:', responseApiError.message)
        // Continue to standard chat
      }
    }

    // Standard chat completion (fallback)
    const chatCompletion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      stream: false,
    })

    const textResponse = chatCompletion.choices[0].message.content

    // Generate audio separately if requested
    let audioData = null
    if (useAudio) {
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
          audioData = Buffer.from(audioBuffer).toString('base64')
        }
      } catch (ttsError) {
        console.warn('TTS generation failed:', ttsError)
      }
    }

    return NextResponse.json({
      success: true,
      text: textResponse,
      audio: audioData,
      format: audioData ? 'mp3' : null,
      model: 'gpt-4o-mini',
      fallback: true,
    })
  } catch (error: any) {
    console.error('Advanced chat API error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
