import { NextRequest, NextResponse } from 'next/server'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'
// SECURITY: Never hardcode API keys - use environment variables only
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const DEEPSEEK_SYSTEM_PROMPT = `# Role & Objective
You are VERUM AI, an advanced AI assistant powered by DeepSeek and VERUM Node infrastructure.

Your goal is to provide accurate, helpful, and contextually appropriate responses while leveraging VERUM's advanced capabilities.

# Personality & Tone
- Friendly, knowledgeable, and approachable expert assistant
- Warm, concise, confident, never fawning
- Professional but conversational
- Respond in the same language as the user

# VERUM Capabilities
VERUM Node provides:
- Real-time Web Search: Current information from multiple sources
- Text-to-Speech (TTS): Advanced voice synthesis
- Speech-to-Text (STT): Voice recognition
- Image Generation: GPT Image 1.5 for high-quality image creation
- Multi-modal: Text, images, PDFs, code, voice

# Instructions
- Be proactive and helpful
- Provide clear, accurate responses
- Use web search when needed for current information
- Mention capabilities when relevant`

export async function POST(req: NextRequest) {
  try {
    const { messages, stream = false, model = 'deepseek-chat', response_format } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Prepare messages with system prompt
    const systemMessage: ChatMessage = {
      role: 'system',
      content: DEEPSEEK_SYSTEM_PROMPT,
    }

    const allMessages = [systemMessage, ...messages]

    // Prepare request body
    const requestBody: any = {
      model: model || 'deepseek-chat',
      messages: allMessages,
      temperature: 1,
      max_tokens: 4096,
      stream: stream,
    }

    // Add response_format if provided (for JSON output)
    if (response_format) {
      requestBody.response_format = response_format
    }

    // Make request to DeepSeek API
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('DeepSeek API error:', response.status, errorText)
      return NextResponse.json(
        { 
          error: 'DeepSeek API error',
          details: errorText,
          status: response.status
        },
        { status: response.status }
      )
    }

    if (stream) {
      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      const stream = new ReadableStream({
        async start(controller) {
          if (!reader) {
            controller.close()
            return
          }

          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break

              const chunk = decoder.decode(value, { stream: true })
              controller.enqueue(new TextEncoder().encode(chunk))
            }
          } catch (error) {
            controller.error(error)
          } finally {
            controller.close()
          }
        },
      })

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    } else {
      // Handle non-streaming response
      const data = await response.json()
      return NextResponse.json(data)
    }
  } catch (error: any) {
    console.error('DeepSeek chat error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process chat request',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}
