import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import crypto from 'crypto'
import { getOpenAIKey, recordOpenAIError, resetOpenAIError } from '@/app/utils/openai-helper'

const VERUM_API_URL = process.env.VERUM_API_URL || 'https://verumnodelagacy-60045b94a179.herokuapp.com'
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'
// SECURITY: Never hardcode API keys - use environment variables only
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

/**
 * Hybrid System Prompt - Combines best of all worlds: OpenAI, Claude, and DeepSeek
 */
const HYBRID_SYSTEM_PROMPT = `# Role & Objective
You are VERUM AI, an advanced AI assistant powered by a hybrid architecture combining OpenAI GPT-4o, Anthropic Claude, and DeepSeek capabilities with VERUM Node infrastructure.

Your goal is to provide accurate, helpful, and contextually appropriate responses while leveraging VERUM's advanced capabilities.

# Personality & Tone
- Friendly, knowledgeable, and approachable expert assistant
- Warm, concise, confident, never fawning
- Professional but conversational
- Respond in the same language as the user

# VERUM Capabilities
VERUM Node provides:
- Hybrid AI: Combines OpenAI GPT-4o, Claude, and DeepSeek for optimal performance
- Real-time Web Search: Current information from multiple sources
- Text-to-Speech (TTS): Advanced voice synthesis with OpenAI TTS
- Speech-to-Text (STT): Voice recognition
- Image Generation: GPT Image for high-quality image creation
- Multi-modal: Text, images, PDFs, code, voice

# Instructions
- Be proactive and helpful
- Provide clear, accurate responses
- Use web search when needed for current information
- Mention capabilities when relevant`

/**
 * Intelligent provider selection based on message characteristics
 */
function selectBestProvider(
  lastMessage: string,
  messageLength: number,
  messageCount: number
): 'deepseek' | 'openai' | 'claude' {
  // ALWAYS USE DEEPSEEK - NO OPENAI FALLBACK!
  // DeepSeek is faster, cheaper, and better for all use cases
  return 'deepseek'
}

/**
 * Hybrid approach: Use all three APIs intelligently
 * - DeepSeek: Fast, cost-effective for simple queries
 * - OpenAI GPT-4o: Complex reasoning, code, math
 * - Claude: Analysis, creative writing, long-form content
 */
export async function POST(req: NextRequest) {
  try {
    const { messages, stream = true } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Check if DeepSeek API key is available (REQUIRED - this is the main provider)
    if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY.trim() === '') {
      console.error('❌ DEEPSEEK_API_KEY not configured')
      console.error('❌ DEEPSEEK_API_KEY value:', DEEPSEEK_API_KEY ? 'exists but empty' : 'undefined')
      return NextResponse.json(
        { 
          error: 'DEEPSEEK_API_KEY not configured',
          message: 'Please set DEEPSEEK_API_KEY in .env.local file and restart the server'
        },
        { status: 500 }
      )
    }
    
    console.log('✅ DEEPSEEK_API_KEY configured (length:', DEEPSEEK_API_KEY.length, ')')
    
    // Check if any OpenAI key is available (for TTS/STT - optional)
    const openaiKey = getOpenAIKey()
    if (!openaiKey) {
      console.warn('⚠️ OPENAI_API_KEY not configured (TTS/STT may not work)')
    }

    // Analyze message complexity to decide which API to use
    const lastMessage = messages[messages.length - 1]?.content || ''
    const messageLength = lastMessage.length
    
    // Truncate messages intelligently if context is too long (optimized for speed)
    let processedMessages = messages
    // Use fewer messages for first response (faster), more for context-rich conversations
    const MAX_MESSAGES = messages.length <= 4 ? 20 : 100 // Start with 20 for speed
    if (messages.length > MAX_MESSAGES) {
      const firstMessages = messages.slice(0, 2)
      const recentMessages = messages.slice(-MAX_MESSAGES + 2)
      processedMessages = [...firstMessages, ...recentMessages]
      console.log(`📝 Truncated messages: ${messages.length} → ${processedMessages.length}`)
    }
    
    // ALWAYS USE DEEPSEEK - NO OTHER PROVIDERS!
    console.log('🎯 Using DeepSeek API (ONLY provider)')
    
    const systemMessage: ChatMessage = {
      role: 'system',
      content: HYBRID_SYSTEM_PROMPT,
    }

    const allMessages = [systemMessage, ...processedMessages]

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: allMessages,
        temperature: 0.5, // Lower temperature = faster, more direct responses
        max_tokens: processedMessages.length <= 4 ? 1024 : 2048, // Smaller for first response
        stream: stream,
        top_p: 0.9, // Slightly lower for faster generation
      }),
    })

    if (!response.ok) {
      // NO FALLBACK - DeepSeek must work!
      const errorText = await response.text()
      console.error('❌ DeepSeek API error:', response.status, errorText)
      
      // Return proper error response
      return NextResponse.json(
        { 
          error: `DeepSeek API error: ${response.status}`,
          details: errorText.substring(0, 500) // Limit error text length
        },
        { status: response.status }
      )
    }

    if (stream) {
      return new NextResponse(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'X-AI-Provider': 'deepseek',
        },
      })
    } else {
      const data = await response.json()
      return NextResponse.json(data)
    }
    
    /* REMOVED: Claude and OpenAI providers - ONLY DeepSeek now!
    } else if (provider === 'claude' && process.env.ANTHROPIC_API_KEY) {
      // Use Claude for analysis, creative writing, long-form content
      console.log('🧠 Using Claude API (analysis & creative)')
      
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      })

      // Convert messages format (remove system message, add to first user message)
      const systemPrompt = HYBRID_SYSTEM_PROMPT
      const claudeMessages = processedMessages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })) as Array<{ role: 'user' | 'assistant', content: string }>

      // Add system prompt to first user message if available
      if (claudeMessages.length > 0 && claudeMessages[0].role === 'user') {
        claudeMessages[0].content = `${systemPrompt}\n\n${claudeMessages[0].content}`
      }

      try {
        if (stream) {
          const stream = await anthropic.messages.stream({
            model: 'claude-3-5-sonnet-20241022', // Latest Claude 3.5 Sonnet
            max_tokens: 4096,
            messages: claudeMessages,
          })

          // Convert Claude stream to SSE format
          const encoder = new TextEncoder()
          const readable = new ReadableStream({
            async start(controller) {
              try {
                for await (const event of stream) {
                  if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                    const data = `data: ${JSON.stringify({ choices: [{ delta: { content: event.delta.text } }] })}\n\n`
                    controller.enqueue(encoder.encode(data))
                  }
                  if (event.type === 'message_stop') {
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                    controller.close()
                  }
                }
              } catch (error) {
                controller.error(error)
              }
            },
          })

          return new NextResponse(readable, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
              'X-AI-Provider': 'claude',
            },
          })
        } else {
          const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4096,
            messages: claudeMessages,
          })

          return NextResponse.json({
            choices: [{
              message: {
                role: 'assistant',
                content: message.content[0].type === 'text' ? message.content[0].text : '',
              },
            }],
          })
        }
    */
  } catch (error: any) {
    // SECURITY: Sanitize error to never expose API keys
    const errorMessage = error?.message || error?.toString() || 'Unknown error'
    const sanitizedError = errorMessage
      .replace(/sk-[a-zA-Z0-9_-]{20,}/g, '[API_KEY_REDACTED]')
      .replace(/Bearer\s+[a-zA-Z0-9_-]+/g, 'Bearer [REDACTED]')
    
    console.error('❌ Hybrid chat error:', sanitizedError)
    console.error('❌ Error stack:', error?.stack?.substring(0, 500))
    console.error('❌ DEEPSEEK_API_KEY configured:', !!DEEPSEEK_API_KEY && DEEPSEEK_API_KEY.length > 0)
    
    // NO FALLBACKS - DeepSeek is the only provider!

    return NextResponse.json(
      {
        error: 'Failed to process chat request',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}
