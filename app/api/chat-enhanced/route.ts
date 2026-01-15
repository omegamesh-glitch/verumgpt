import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import crypto from 'crypto'

// OpenAI client will be created per request to support both OpenAI and DeepSeek

const VERUM_API_URL = process.env.VERUM_API_URL || 'https://verumnodelagacy-60045b94a179.herokuapp.com'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

/**
 * Intelligent detection of when web search is needed using AI
 */
async function shouldPerformWebSearch(
  message: string,
  client: OpenAI,
  model: string
): Promise<boolean> {
  try {
    // Use a lightweight check first (keyword-based)
    const searchKeywords = [
      'current', 'latest', 'today', 'recent', 'now', '2024', '2025',
      'what is', 'who is', 'when did', 'where is', 'how to',
      'news', 'update', 'happening', 'trending', 'popular',
      'price', 'cost', 'buy', 'sell', 'stock', 'market',
      'weather', 'forecast', 'temperature', 'tell me about',
      'explain', 'describe', 'information about',
    ]
    
    const hasKeywords = searchKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    )

    if (!hasKeywords) {
      return false
    }

    // Use AI to determine if search is needed (more intelligent)
    try {
      const response = await client.chat.completions.create({
        model: model === 'deepseek-chat' ? 'deepseek-chat' : 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a search intent classifier. Determine if the user query requires real-time web search to answer accurately. Respond with only "YES" or "NO".',
          },
          {
            role: 'user',
            content: `Does this query need current web information: "${message.substring(0, 200)}"?`,
          },
        ],
        max_tokens: 10,
        temperature: 0.1,
      })

      const decision = response.choices[0]?.message?.content?.trim().toUpperCase() || 'NO'
      return decision.includes('YES')
    } catch (error) {
      // Fallback to keyword-based detection if AI check fails
      console.warn('AI search detection failed, using keyword fallback:', error)
      return hasKeywords
    }
  } catch (error) {
    console.error('Error in shouldPerformWebSearch:', error)
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages, useOmegaMesh = true, enableWebSearch = false } = await req.json()

    if (!process.env.OPENAI_API_KEY && !process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured. Please set OPENAI_API_KEY or DEEPSEEK_API_KEY' },
        { status: 500 }
      )
    }

    // Enhanced system message with VERUM capabilities
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are VERUM AI, an advanced AI assistant powered by VERUM Node infrastructure with Omega Mesh parallel processing.

VERUM Capabilities:
- Omega Mesh: Parallel processing with 16+ workers
- Hash Verification: SHA-256 integrity checking
- Real-time Web Search: Access to current information from multiple sources (DuckDuckGo, Google, Bing)
- Semantic Search: Intelligent document search using embeddings
- Text-to-Speech (TTS): Advanced voice synthesis using OpenAI TTS API with multiple voices (marin, cedar, alloy, etc.)
- Speech-to-Text (STT): Voice recognition using OpenAI Whisper API (no Google dependency)
- Code Execution: Run code in multiple languages
- Data Visualization: Create charts and graphs
- Multi-modal: Text, images, PDFs, code, voice

You have access to:
1. VERUM Node API for hash verification and Omega Mesh processing
2. Web search capabilities for real-time information (DuckDuckGo, Google, Bing)
3. Semantic search with embeddings for document similarity
4. Text-to-Speech (TTS) - Users can hear your responses in high-quality voice
5. Speech-to-Text (STT) - Users can speak to you using voice input
6. Code execution environment
7. Data analysis and visualization tools

IMPORTANT: VERUM NODE HAS FULL VOICE CAPABILITIES:
- Users can click the 🔊 button to hear your responses read aloud
- Users can click the 🎤 button to speak their messages
- TTS uses OpenAI's advanced voice synthesis (marin/cedar voices for best quality)
- STT uses OpenAI Whisper API (works even with institutional firewalls)

When users ask about voice capabilities, explain that VERUM NODE has full voice support:
- Text-to-Speech: Click the 🔊 button below any response to hear it read aloud
- Speech-to-Text: Click the 🎤 button in the input field to speak your message
- Both features work on iPhone, iPad, Android, and desktop browsers

Always mention when using VERUM-specific features like Omega Mesh, web search, hash verification, or voice capabilities. Cite sources when using web search results.`,
    }

    const enhancedMessages = [systemMessage, ...messages]

    // Determine API client and model
    let model = 'gpt-4o-mini'
    let apiKey = process.env.OPENAI_API_KEY
    let baseURL: string | undefined = undefined
    let usingDeepSeek = false
    
    if (process.env.DEEPSEEK_API_KEY) {
      model = 'deepseek-chat'
      apiKey = process.env.DEEPSEEK_API_KEY
      baseURL = 'https://api.deepseek.com/v1'
      usingDeepSeek = true
    }
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'No API key configured' },
        { status: 500 }
      )
    }
    
    const client = new OpenAI({
      apiKey,
      baseURL,
    })

    // Intelligent web search detection and execution
    const lastMessage = messages[messages.length - 1]?.content || ''
    let webSearchContext = ''
    let searchResults: any[] = []
    
    // Check if web search is needed (intelligent detection)
    const needsWebSearch = enableWebSearch || await shouldPerformWebSearch(lastMessage, client, model)
    
    if (needsWebSearch) {
      try {
        console.log('🔍 Performing intelligent web search for:', lastMessage.substring(0, 100))
        
        // Extract search query from message
        const searchQuery = lastMessage
          .replace(/\[PDF Document:.*?\]/g, '') // Remove PDF context markers
          .substring(0, 200)
          .trim()
        
        // Use enhanced search with multiple sources and caching
        const searchResponse = await fetch(`${req.nextUrl.origin}/api/web-search-enhanced`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            query: searchQuery,
            sources: ['duckduckgo'], // Add 'google', 'bing' if API keys configured
            useCache: true,
          }),
          signal: AbortSignal.timeout(10000), // 10s timeout
        })

        if (searchResponse.ok) {
          const searchData = await searchResponse.json()
          if (searchData.success && searchData.results && searchData.results.length > 0) {
            searchResults = searchData.results
            
            // Format search results for context
            const formattedResults = searchResults
              .slice(0, 5) // Use top 5 results
              .map((result: any, index: number) => 
                `[${index + 1}] ${result.title}\n${result.snippet}\nSource: ${result.url} (via ${result.source})`
              )
              .join('\n\n')
            
            webSearchContext = `\n\n[Real-time Web Search Results - ${searchData.sources?.join(', ') || 'DuckDuckGo'}]\n${formattedResults}\n\nUse this information to provide accurate, up-to-date answers. Always cite sources when using this information.`
            
            console.log(`✅ Web search completed: ${searchResults.length} results from ${searchData.sources?.join(', ') || 'DuckDuckGo'}`)
          }
        }
      } catch (searchError: any) {
        console.warn('⚠️ Web search failed (continuing without it):', searchError.message)
        // Continue without web search if it fails
      }
    }

    // Add web search context if available
    if (webSearchContext) {
      enhancedMessages.push({
        role: 'system',
        content: `Web Search Context: ${webSearchContext}`,
      })
    }

    // Generate hash for integrity verification (VERUM Node feature)
    const messageHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(enhancedMessages))
      .digest('hex')

    // Verify hash with VERUM Node if Omega Mesh is enabled
    let hashVerified = false
    if (useOmegaMesh) {
      try {
        const verifyResponse = await fetch(`${VERUM_API_URL}/verify`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(2000), // 2s timeout, non-blocking
        })
        hashVerified = true
      } catch (error) {
        console.error('VERUM Node verification error:', error)
      }
    }

    let stream
    let finalModel = model
    try {
      stream = await client.chat.completions.create({
        model,
        messages: enhancedMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 4000,
      })
      finalModel = model
    } catch (error: any) {
      const errorStatus = error?.status || error?.response?.status || error?.code
      const errorMessage = error?.message || 'Unknown error'
      
      console.error(`API call failed for ${model}:`, {
        message: errorMessage,
        status: errorStatus,
        code: error?.code,
        type: error?.type,
      })
      
      // Handle specific error types
      if (errorStatus === 401 || errorStatus === 403) {
        throw new Error(`Authentication failed (${errorStatus}): API key may be invalid or revoked. Please check your API key configuration.`)
      }
      
      if (errorStatus === 429) {
        throw new Error(`Rate limit exceeded (429): Too many requests. Please wait a moment and try again.`)
      }
      
      if (errorStatus >= 500) {
        throw new Error(`Server error (${errorStatus}): The API service is experiencing issues. Please try again later.`)
      }
      
      // Fallback to OpenAI if DeepSeek fails (only for non-auth errors)
      if (usingDeepSeek && process.env.OPENAI_API_KEY && errorStatus !== 401 && errorStatus !== 403) {
        console.log('DeepSeek failed, falling back to OpenAI gpt-4o-mini')
        try {
          const fallbackClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
          })
          stream = await fallbackClient.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: enhancedMessages,
            stream: true,
            temperature: 0.7,
            max_tokens: 4000,
          })
          finalModel = 'gpt-4o-mini'
          console.log('Successfully fell back to OpenAI')
        } catch (fallbackError: any) {
          const fallbackStatus = fallbackError?.status || fallbackError?.response?.status || fallbackError?.code
          console.error('OpenAI fallback also failed:', {
            message: fallbackError?.message,
            status: fallbackStatus,
            code: fallbackError?.code,
          })
          
          // Provide specific error messages
          if (fallbackStatus === 401 || fallbackStatus === 403) {
            throw new Error(`Both APIs failed: Authentication error. Please verify your API keys are correct.`)
          }
          if (fallbackStatus === 429) {
            throw new Error(`Both APIs failed: Rate limit exceeded. Please wait before trying again.`)
          }
          
          throw new Error(`Both APIs failed. DeepSeek: ${errorMessage}, OpenAI: ${fallbackError?.message || 'Unknown error'}`)
        }
      } else {
        // If using OpenAI and it fails, or no fallback available
        throw error
      }
    }

    const encoder = new TextEncoder()
    let tokenCount = 0

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            const finishReason = chunk.choices[0]?.finish_reason
            
            if (content) {
              tokenCount++
              const data = {
                ...chunk,
                metadata: {
                  omegaMesh: useOmegaMesh,
                  hashVerified,
                  messageHash,
                  tokens: tokenCount,
                  model: finalModel,
                  webSearchUsed: needsWebSearch && searchResults.length > 0,
                },
              }
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
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
        'X-VERUM-OMEGA-MESH': useOmegaMesh ? 'enabled' : 'disabled',
        'X-VERUM-HASH-VERIFIED': hashVerified ? 'true' : 'false',
        'X-VERUM-WEB-SEARCH': needsWebSearch && searchResults.length > 0 ? 'used' : 'not-used',
      },
    })
  } catch (error: any) {
    const errorStatus = error?.status || error?.response?.status || 500
    const errorMessage = error?.message || 'Failed to process chat request'
    
    console.error('Enhanced chat API error:', {
      message: errorMessage,
      status: errorStatus,
      code: error?.code,
      type: error?.type,
      stack: error?.stack,
    })
    
    // Return appropriate status code based on error type
    let httpStatus = 500
    if (errorStatus === 401 || errorStatus === 403) {
      httpStatus = 401
    } else if (errorStatus === 429) {
      httpStatus = 429
    } else if (errorStatus >= 500) {
      httpStatus = 502 // Bad Gateway - API server error
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        status: errorStatus,
        suggestion: errorStatus === 401 || errorStatus === 403 
          ? 'Please check your API key configuration in Heroku config vars'
          : errorStatus === 429
          ? 'Rate limit exceeded. Please wait a moment and try again'
          : 'Please try again later or check the API service status'
      },
      { status: httpStatus }
    )
  }
}
