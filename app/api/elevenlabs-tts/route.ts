import { NextRequest, NextResponse } from 'next/server'

/**
 * ElevenLabs Text-to-Speech API Route
 * High-quality, natural voice synthesis using ElevenLabs
 * Supports advanced features: SSML, audio tags, phonemes, emotion control
 * 
 * Best Practices:
 * - Use SSML <break> tags for natural pauses (up to 3s)
 * - Use audio tags [laughs], [whispers], [sarcastic] for emotion (v3)
 * - Use phoneme tags for pronunciation control
 * - Normalize text (numbers, dates, currencies) for better results
 */

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1'

/**
 * Normalize text for better TTS pronunciation
 * Converts numbers, dates, currencies to spoken format
 */
function normalizeTextForTTS(text: string): string {
  let normalized = text
  
  // Normalize phone numbers: 123-456-7890 → "one two three, four five six, seven eight nine zero"
  normalized = normalized.replace(/(\d{3})-(\d{3})-(\d{4})/g, (match, a, b, c) => {
    return `${a.split('').join(' ')} ${b.split('').join(' ')} ${c.split('').join(' ')}`
  })
  
  // Normalize currencies: $1,000 → "one thousand dollars"
  normalized = normalized.replace(/\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g, (match, num) => {
    const numStr = num.replace(/,/g, '')
    if (numStr.includes('.')) {
      const [dollars, cents] = numStr.split('.')
      return `${numberToWords(parseInt(dollars))} dollars and ${numberToWords(parseInt(cents))} cents`
    }
    return `${numberToWords(parseInt(numStr))} dollars`
  })
  
  // Normalize percentages: 100% → "one hundred percent"
  normalized = normalized.replace(/(\d+)%/g, (match, num) => {
    return `${numberToWords(parseInt(num))} percent`
  })
  
  // Normalize URLs: example.com → "example dot com"
  normalized = normalized.replace(/(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-\.\/]*)?/gi, (match) => {
    return match.replace(/\./g, ' dot ').replace(/\//g, ' slash ')
  })
  
  return normalized
}

/**
 * Simple number to words converter (basic implementation)
 */
function numberToWords(num: number): string {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
  
  if (num === 0) return 'zero'
  if (num < 10) return ones[num]
  if (num < 20) return teens[num - 10]
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '')
  if (num < 1000) {
    return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '')
  }
  if (num < 1000000) {
    return numberToWords(Math.floor(num / 1000)) + ' thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '')
  }
  return num.toString() // Fallback for very large numbers
}

export async function POST(req: NextRequest) {
  try {
    const { 
      text,
      voice_id,
      model_id = 'eleven_multilingual_v2', // Multilingual v2 for better normalization
      stability = 0.5,
      similarity_boost = 0.75,
      style = 0.0,
      use_speaker_boost = true,
      speed = 1.0, // Speed control (0.7 to 1.2)
      normalize = true, // Auto-normalize text
      enable_ssml = true, // Enable SSML support
    } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      )
    }

    // Get API key from environment
    const apiKey = process.env.ELEVENLABS_API_KEY
    const defaultVoiceId = process.env.ELEVENLABS_VOICE_ID || 'd7361a8e96f033e1ebff51d4a32e24cda3b4a265fdd6b3c69602f9ab411f3f32'
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      )
    }

    const selectedVoiceId = voice_id || defaultVoiceId

    console.log('🎤 [ElevenLabs TTS] Generating speech...', {
      textLength: text.length,
      voiceId: selectedVoiceId,
      model: model_id,
    })

    // Clean and normalize text for better TTS
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
    
    // Apply text normalization if enabled (for better pronunciation)
    if (normalize) {
      cleanText = normalizeTextForTTS(cleanText)
    }

    if (!cleanText || cleanText.length < 1) {
      return NextResponse.json(
        { error: 'No text to speak after cleaning' },
        { status: 400 }
      )
    }

    // ElevenLabs TTS API call
    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${selectedVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: model_id,
        voice_settings: {
          stability: Math.max(0, Math.min(1, stability)),
          similarity_boost: Math.max(0, Math.min(1, similarity_boost)),
          style: Math.max(0, Math.min(1, style)),
          use_speaker_boost: use_speaker_boost,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [ElevenLabs TTS] Error:', response.status, errorText)
      
      // Try fallback to OpenAI TTS if ElevenLabs fails
      if (process.env.OPENAI_API_KEY) {
        console.log('🔄 [ElevenLabs TTS] Falling back to OpenAI TTS...')
        const openaiResponse = await fetch(`${req.nextUrl.origin}/api/tts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: cleanText,
            voice: 'nova',
            model: 'tts-1-hd',
          }),
        })
        
        if (openaiResponse.ok) {
          const audioBuffer = await openaiResponse.arrayBuffer()
          return new NextResponse(audioBuffer, {
            headers: {
              'Content-Type': 'audio/mpeg',
              'Cache-Control': 'public, max-age=86400',
              'X-Fallback': 'openai',
            },
          })
        }
      }
      
      return NextResponse.json(
        { 
          error: 'ElevenLabs TTS API failed',
          details: errorText,
          status: response.status
        },
        { status: response.status }
      )
    }

    const audioBuffer = await response.arrayBuffer()
    
    // Extract metadata from response headers
    const characterCount = response.headers.get('x-character-count')
    const requestId = response.headers.get('request-id')
    const modelId = response.headers.get('x-model-id') || model_id
    
    console.log('✅ [ElevenLabs TTS] Speech generated successfully', {
      size: `${(audioBuffer.byteLength / 1024).toFixed(2)}KB`,
      characters: characterCount || 'unknown',
      requestId: requestId || 'unknown',
      model: modelId,
    })

    // Build response headers with metadata
    const responseHeaders: Record<string, string> = {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      'Content-Length': audioBuffer.byteLength.toString(),
      'X-Provider': 'elevenlabs',
    }
    
    // Add cost tracking headers if available
    if (characterCount) {
      responseHeaders['X-Character-Count'] = characterCount
    }
    if (requestId) {
      responseHeaders['X-Request-ID'] = requestId
    }
    if (modelId) {
      responseHeaders['X-Model-ID'] = modelId
    }

    return new NextResponse(audioBuffer, {
      headers: responseHeaders,
    })
  } catch (error: any) {
    // SECURITY: Never expose API keys in error messages
    const errorMessage = error?.message || 'Unknown error'
    const sanitizedError = errorMessage
      .replace(/sk-[a-zA-Z0-9_-]{20,}/g, '[API_KEY_REDACTED]')
      .replace(/xi-api-key:\s*[a-zA-Z0-9_-]+/gi, 'xi-api-key: [REDACTED]')
    
    console.error('❌ [ElevenLabs TTS] Error:', sanitizedError)
    return NextResponse.json(
      { 
        error: 'ElevenLabs TTS failed to generate speech',
        details: sanitizedError
      },
      { status: 500 }
    )
  }
}
