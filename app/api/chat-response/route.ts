import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

/**
 * New OpenAI Response API endpoint
 * Supports: images, web_search_preview tool, conversations
 */
export async function POST(req: NextRequest) {
  try {
    const { 
      messages, 
      images = [],
      useWebSearch = false,
      conversationId = null,
      model = 'gpt-4o-mini',
    } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Check if we should use the new Response API (gpt-4.1 or newer models)
    const useResponseAPI = model.includes('gpt-4.1') || model.includes('gpt-5')
    
    if (useResponseAPI) {
      try {
        // Build input for Response API
        const input: any[] = messages.map((msg: any) => {
          const content: any[] = []
          
          // Add text content
          if (msg.content) {
            content.push({
              type: 'input_text',
              text: msg.content,
            })
          }
          
          // Add images if present
          if (msg.images && Array.isArray(msg.images)) {
            msg.images.forEach((img: string) => {
              content.push({
                type: 'input_image',
                image_url: img,
              })
            })
          }
          
          return {
            role: msg.role,
            content,
          }
        })

        // Add images from request if any
        if (images && Array.isArray(images) && images.length > 0) {
          const lastMessage = input[input.length - 1]
          if (lastMessage) {
            images.forEach((img: string) => {
              lastMessage.content.push({
                type: 'input_image',
                image_url: img,
              })
            })
          }
        }

        // Build tools array
        const tools: any[] = []
        if (useWebSearch) {
          tools.push({ type: 'web_search_preview' })
        }

        // Create response using new API
        const response = await client.responses.create({
          model: model || 'gpt-4.1',
          input,
          tools: tools.length > 0 ? tools : undefined,
        })

        // Wait for completion (polling)
        let completedResponse = response
        let attempts = 0
        const maxAttempts = 30 // 30 seconds max

        while (completedResponse.status !== 'completed' && attempts < maxAttempts) {
          if (completedResponse.status === 'failed') {
            throw new Error('Response API request failed')
          }

          await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
          
          if ((client as any).responses) {
            completedResponse = await (client as any).responses.retrieve(completedResponse.id)
          } else {
            throw new Error('Response API not available')
          }
          attempts++
        }

        if (completedResponse.status !== 'completed') {
          throw new Error('Response API request timed out')
        }

        // Extract output
        const output: any[] = []
        let textOutput = ''
        let webSearchUsed = false

        if (completedResponse.output) {
          for (const item of completedResponse.output) {
            if (item.type === 'message') {
              if (item.content && Array.isArray(item.content)) {
                item.content.forEach((contentItem: any) => {
                  if (contentItem.type === 'output_text') {
                    textOutput += contentItem.text + '\n'
                  }
                })
              }
            } else if (item.type === 'web_search_call') {
              webSearchUsed = true
            }
          }
        }

        return NextResponse.json({
          success: true,
          responseId: completedResponse.id,
          text: textOutput.trim(),
          webSearchUsed,
          model: completedResponse.model,
          completedAt: completedResponse.completed_at,
        })
      } catch (error: any) {
        console.error('Response API error:', error)
        // Fallback to regular chat API
        return fallbackToChatAPI(client, messages, model)
      }
    } else {
      // Use regular chat API for older models
      return fallbackToChatAPI(client, messages, model)
    }
  } catch (error: any) {
    console.error('Chat response API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error?.message || 'Failed to process request' 
      },
      { status: 500 }
    )
  }
}

/**
 * Fallback to regular chat completions API
 */
async function fallbackToChatAPI(
  client: OpenAI,
  messages: any[],
  model: string
) {
  const stream = await client.chat.completions.create({
    model: model || 'gpt-4o-mini',
    messages: messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content || (Array.isArray(msg.content) 
        ? msg.content.map((c: any) => c.text || c).join('\n')
        : String(msg.content)),
    })),
    stream: true,
    temperature: 0.7,
    max_tokens: 4000,
  })

  const encoder = new TextEncoder()
  let fullText = ''

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          const finishReason = chunk.choices[0]?.finish_reason
          
          if (content) {
            fullText += content
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
          }
          
          if (finishReason) {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
          }
        }
      } catch (error) {
        controller.error(error)
      }
    },
  })

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
