import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import crypto from 'crypto'

const VERUM_API_URL = process.env.VERUM_API_URL || 'https://verumnodelagacy-60045b94a179.herokuapp.com'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

/**
 * GPT-5 optimized system prompt following the GPT-5 prompting guide
 * Structure: Role & Objective → Personality & Tone → Instructions → Tools → Conversation Flow
 */
const GPT5_SYSTEM_PROMPT = `# Role & Objective
You are VERUM AI, an advanced AI assistant powered by GPT-5 and VERUM Node infrastructure with Omega Mesh parallel processing.

Your goal is to provide accurate, helpful, and contextually appropriate responses while leveraging VERUM's advanced capabilities.

# Personality & Tone
## Personality
- Friendly, knowledgeable, and approachable expert assistant
- Proactive in gathering context when needed
- Calm and methodical in problem-solving

## Tone
- Warm, concise, confident, never fawning
- Professional but conversational
- Clear and direct communication

## Length
- Default: 2-4 sentences per response
- Expand when technical detail is needed
- Be brief for simple confirmations

## Language
- Respond in the same language as the user
- Use natural, conversational language
- Avoid jargon unless technical context requires it

# VERUM Capabilities
VERUM Node provides:
- Omega Mesh: Parallel processing with 16+ workers
- Hash Verification: SHA-256 integrity checking
- Real-time Web Search: Current information from multiple sources
- Semantic Search: Intelligent document search using embeddings
- Text-to-Speech (TTS): Advanced voice synthesis (marin, cedar, coral voices)
- Speech-to-Text (STT): Voice recognition using OpenAI Whisper API
- Image Generation: GPT Image 1.5 for high-quality image creation
- Code Execution: Run code in multiple languages
- Multi-modal: Text, images, PDFs, code, voice

# Instructions
## Tool Usage & Preambles
- Always begin by rephrasing the user's goal in a friendly, clear, and concise manner, before calling any tools
- Then, immediately outline a structured plan detailing each logical step you'll follow
- When calling tools, provide brief preambles: "Checking that now...", "Let me look that up...", "One moment..."
- As you execute, narrate each step succinctly and sequentially, marking progress clearly
- Finish by summarizing completed work distinctly from your upfront plan
- Be proactive: Don't ask for confirmation before obvious tool calls
- Only ask for clarification when truly blocked

## Context Gathering
- Think first: Decide ALL files/resources needed before tool calls
- Batch everything: Read multiple files in parallel when possible
- Stop early: Once you have enough context to act, proceed
- Avoid over-searching: Use targeted queries, not exhaustive exploration

## Code & Technical Responses
- For code: Use high verbosity - clear names, comments, maintainable solutions
- For explanations: Be concise but thorough
- Always verify code works before presenting

## Image Generation
- Detect when users want images: "create image", "generate image", "show me", "draw", "make a picture"
- Extract the image prompt from user request
- Generate images using GPT Image 1.5 with high quality
- Display images inline with responses

## Voice Capabilities
- Users can click 🔊 to hear responses (TTS)
- Users can click 🎤 to speak messages (STT)
- Mention voice features when relevant

## Web Search
- Use web search for current events, recent information, prices, weather
- Always cite sources when using search results
- Verify information when possible

## Persistence
- You are an agent - keep going until the user's query is completely resolved
- Only terminate when the problem is solved
- Never stop at uncertainty - research or deduce the most reasonable approach
- Do not ask for confirmation unless truly blocked

# Conversation Flow
## 1) Understanding
- Rephrase user's goal clearly before acting
- Identify what information/tools are needed
- Plan your approach briefly

## 2) Execution
- Execute tools proactively
- Provide progress updates: "Found X results...", "Checking Y..."
- Handle errors gracefully

## 3) Response
- Summarize findings clearly
- Provide actionable next steps if needed
- Confirm completion: "Is there anything else?"

# Safety & Escalation
- If you cannot help or encounter safety concerns, explain limitations clearly
- For complex issues beyond scope, suggest alternatives
- Always be honest about capabilities and limitations`

/**
 * Detect if user wants to generate an image
 */
function detectImageGenerationRequest(message: string): { wantsImage: boolean; prompt?: string } {
  const imageKeywords = [
    'create image', 'generate image', 'make image', 'draw', 'show me', 'picture of',
    'imagem de', 'criar imagem', 'gerar imagem', 'desenhar', 'mostre', 'foto de',
    'visualize', 'illustrate', 'render', 'sketch', 'design'
  ]
  
  const lowerMessage = message.toLowerCase()
  const hasKeyword = imageKeywords.some(keyword => lowerMessage.includes(keyword))
  
  if (!hasKeyword) {
    return { wantsImage: false }
  }
  
  // Extract prompt - remove command words
  let prompt = message
  for (const keyword of imageKeywords) {
    prompt = prompt.replace(new RegExp(keyword, 'gi'), '').trim()
  }
  
  // Clean up common prefixes
  prompt = prompt.replace(/^(a|an|the|uma|um|uma)\s+/i, '').trim()
  
  return { wantsImage: true, prompt: prompt || message }
}

export async function POST(req: NextRequest) {
  try {
    const { 
      messages, 
      useOmegaMesh = true, 
      enableWebSearch = false,
      reasoning_effort = 'medium',
      verbosity = 'low',
      previous_response_id,
    } = await req.json()

    const { getOpenAIKey, recordOpenAIError, resetOpenAIError } = await import('@/app/utils/openai-helper')
    const apiKey = getOpenAIKey()
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured' },
        { status: 500 }
      )
    }

    const isBackup = apiKey === process.env.OPENAI_API_KEY_BACKUP
    let client = new OpenAI({
      apiKey: apiKey,
    })

    // Check last message for image generation request
    const lastMessage = messages[messages.length - 1]?.content || ''
    const imageRequest = detectImageGenerationRequest(lastMessage)
    
    // If image generation requested, handle it separately
    if (imageRequest.wantsImage && imageRequest.prompt) {
      try {
        const imageResponse = await fetch(`${req.nextUrl.origin}/api/generate-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: imageRequest.prompt,
            quality: 'high',
            output_format: 'png',
          }),
        })

        if (imageResponse.ok) {
          const imageData = await imageResponse.json()
          if (imageData.success && imageData.images?.[0]?.b64_json) {
            return NextResponse.json({
              success: true,
              imageData: imageData.images[0].b64_json,
              imagePrompt: imageRequest.prompt,
              message: `I've generated an image based on your request: "${imageRequest.prompt}"`,
            })
          }
        }
      } catch (imageError) {
        console.error('Image generation failed:', imageError)
        // Continue with text response
      }
    }

    // Build messages with system prompt
    const systemMessage: ChatMessage = {
      role: 'system',
      content: GPT5_SYSTEM_PROMPT,
    }

    const enhancedMessages = [systemMessage, ...messages]

    // Web search detection (simplified for now)
    let webSearchContext = ''
    if (enableWebSearch) {
      try {
        const searchResponse = await fetch(`${req.nextUrl.origin}/api/web-search-enhanced`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            query: lastMessage.substring(0, 200),
            sources: ['duckduckgo'],
            useCache: true,
          }),
          signal: AbortSignal.timeout(10000),
        })

        if (searchResponse.ok) {
          const searchData = await searchResponse.json()
          if (searchData.success && searchData.results?.length > 0) {
            const formattedResults = searchData.results
              .slice(0, 5)
              .map((result: any, index: number) => 
                `[${index + 1}] ${result.title}\n${result.snippet}\nSource: ${result.url}`
              )
              .join('\n\n')
            
            webSearchContext = `\n\n[Web Search Results]\n${formattedResults}\n\nCite sources when using this information.`
          }
        }
      } catch (searchError) {
        console.warn('Web search failed:', searchError)
      }
    }

    if (webSearchContext) {
      enhancedMessages.push({
        role: 'system',
        content: webSearchContext,
      })
    }

    // Use Responses API for GPT-5 (if available) or fallback to Chat Completions
    try {
      // Try Responses API first (GPT-5)
      const responseParams: any = {
        model: 'gpt-5',
        input: enhancedMessages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      }
      
      if (reasoning_effort && ['low', 'medium', 'high'].includes(reasoning_effort)) {
        responseParams.reasoning_effort = reasoning_effort
      }
      
      if (verbosity && ['low', 'medium', 'high'].includes(verbosity)) {
        responseParams.verbosity = verbosity
      }
      
      if (previous_response_id) {
        responseParams.previous_response_id = previous_response_id
      }
      
      const response = await client.responses.create(responseParams)

      // Extract text from response
      let textContent = ''
      for (const item of response.output) {
        if (item.type === 'message' && item.status === 'completed') {
          const content = item.content?.[0]
          if (content?.type === 'output_text') {
            textContent += content.text
          }
        }
      }

      return NextResponse.json({
        success: true,
        content: textContent,
        response_id: response.id,
        usage: response.usage,
      })
    } catch (responsesError: any) {
      // Fallback to Chat Completions API (for GPT-4o-mini or if Responses API unavailable)
      console.log('Responses API not available, using Chat Completions:', responsesError.message)
      
      try {
        const stream = await client.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: enhancedMessages,
          stream: true,
          temperature: 0.7,
          max_tokens: 4000,
        })
        
        resetOpenAIError() // Reset on success

        const encoder = new TextEncoder()
        let fullContent = ''

        const readableStream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || ''
                const finishReason = chunk.choices[0]?.finish_reason
                
                if (content) {
                  fullContent += content
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                    choices: [{
                      delta: { content },
                    }],
                  })}\n\n`))
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
      } catch (streamError: any) {
        // If stream creation fails, throw to outer catch
        throw streamError
      }
    }
  } catch (error: any) {
    // SECURITY: Sanitize error to never expose API keys
    const errorMessage = error?.message || 'Unknown error'
    const errorDetails = error?.toString() || ''
    const sanitizedError = errorMessage
      .replace(/sk-[a-zA-Z0-9_-]{20,}/g, '[API_KEY_REDACTED]')
      .replace(/Bearer\s+[a-zA-Z0-9_-]+/g, 'Bearer [REDACTED]')
    const sanitizedDetails = errorDetails
      .replace(/sk-[a-zA-Z0-9_-]{20,}/g, '[API_KEY_REDACTED]')
      .replace(/Bearer\s+[a-zA-Z0-9_-]+/g, 'Bearer [REDACTED]')
    console.error('Chat GPT-5 API error:', sanitizedError)
    return NextResponse.json(
      { 
        error: sanitizedError || 'Failed to process chat request',
        details: sanitizedDetails,
      },
      { status: 500 }
    )
  }
}
