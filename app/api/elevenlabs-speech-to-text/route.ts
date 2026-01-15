import { NextRequest, NextResponse } from 'next/server'

/**
 * ElevenLabs Speech-to-Text API Route
 * High-quality audio transcription using ElevenLabs Scribe v2 model
 * 
 * Features:
 * - Language detection (auto or manual)
 * - Speaker diarization (who is speaking)
 * - Audio event tagging (laughter, applause, etc.)
 * - High accuracy transcription
 */

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1'

/**
 * Create conversation-style transcript from multichannel results
 * Groups words by speaker and sorts by timestamp
 */
function createConversationTranscript(transcripts: any[]): Array<{speaker: string, text: string, start: number, end: number}> {
  const allWords: Array<{text: string, start: number, end: number, speaker_id: string, channel: number}> = []
  
  // Collect all words from all channels
  for (const transcript of transcripts) {
    const channelIndex = transcript.channel_index || 0
    const speakerId = transcript.speaker_id || `speaker_${channelIndex}`
    
    if (transcript.words && Array.isArray(transcript.words)) {
      for (const word of transcript.words) {
        if (word.type === 'word' || !word.type) {
          allWords.push({
            text: word.text || word.word || '',
            start: word.start || 0,
            end: word.end || word.start || 0,
            speaker_id: speakerId,
            channel: channelIndex,
          })
        }
      }
    }
  }
  
  // Sort by timestamp
  allWords.sort((a, b) => a.start - b.start)
  
  // Group consecutive words by speaker
  const conversation: Array<{speaker: string, text: string, start: number, end: number}> = []
  let currentSpeaker: string | null = null
  let currentText: string[] = []
  let currentStart = 0
  let currentEnd = 0
  
  for (const word of allWords) {
    if (word.speaker_id !== currentSpeaker) {
      // Save previous segment
      if (currentText.length > 0 && currentSpeaker) {
        conversation.push({
          speaker: currentSpeaker,
          text: currentText.join(' '),
          start: currentStart,
          end: currentEnd,
        })
      }
      // Start new segment
      currentSpeaker = word.speaker_id
      currentText = [word.text]
      currentStart = word.start
      currentEnd = word.end
    } else {
      // Continue current segment
      currentText.push(word.text)
      currentEnd = word.end
    }
  }
  
  // Add the last segment
  if (currentText.length > 0 && currentSpeaker) {
    conversation.push({
      speaker: currentSpeaker,
      text: currentText.join(' '),
      start: currentStart,
      end: currentEnd,
    })
  }
  
  return conversation
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Get API key from environment
    const apiKey = process.env.ELEVENLABS_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      )
    }

    // Get optional parameters
    const modelId = formData.get('model_id') as string || 'scribe_v2'
    const languageCode = formData.get('language_code') as string || null // null = auto-detect
    const tagAudioEvents = formData.get('tag_audio_events') === 'true' || formData.get('tag_audio_events') === true
    const useMultiChannel = formData.get('use_multi_channel') === 'true' || formData.get('use_multi_channel') === true
    // If multichannel is enabled, diarize must be false
    const diarize = useMultiChannel ? false : (formData.get('diarize') === 'true' || formData.get('diarize') === true)
    const timestampsGranularity = formData.get('timestamps_granularity') as string || 'word' // word, sentence, paragraph

    console.log('🎤 [ElevenLabs STT] Transcribing audio...', {
      filename: audioFile.name,
      size: `${(audioFile.size / 1024).toFixed(2)}KB`,
      type: audioFile.type,
      model: modelId,
      language: languageCode || 'auto-detect',
      tagEvents: tagAudioEvents,
      diarize: diarize,
      multichannel: useMultiChannel,
      timestamps: timestampsGranularity,
    })

    // Convert File to Buffer/Blob for ElevenLabs API
    const audioBuffer = await audioFile.arrayBuffer()
    const audioBlob = new Blob([audioBuffer], { type: audioFile.type || 'audio/mpeg' })

    // Create FormData for ElevenLabs API
    const elevenLabsFormData = new FormData()
    elevenLabsFormData.append('file', audioBlob, audioFile.name || 'audio.mp3')
    
    // Build query parameters
    const queryParams = new URLSearchParams()
    queryParams.append('model_id', modelId)
    if (languageCode) {
      queryParams.append('language_code', languageCode)
    }
    if (tagAudioEvents) {
      queryParams.append('tag_audio_events', 'true')
    }
    if (useMultiChannel) {
      queryParams.append('use_multi_channel', 'true')
      // Multichannel mode requires diarize=false
      queryParams.append('diarize', 'false')
    } else if (diarize) {
      queryParams.append('diarize', 'true')
    }
    if (timestampsGranularity) {
      queryParams.append('timestamps_granularity', timestampsGranularity)
    }

    // ElevenLabs Speech-to-Text API call
    const response = await fetch(`${ELEVENLABS_API_URL}/speech-to-text?${queryParams.toString()}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
      },
      body: elevenLabsFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [ElevenLabs STT] Error:', response.status, errorText)
      
      // Try fallback to OpenAI Whisper if ElevenLabs fails
      if (process.env.OPENAI_API_KEY) {
        console.log('🔄 [ElevenLabs STT] Falling back to OpenAI Whisper...')
        const openaiResponse = await fetch(`${req.nextUrl.origin}/api/speech-to-text`, {
          method: 'POST',
          body: formData,
        })
        
        if (openaiResponse.ok) {
          const fallbackData = await openaiResponse.json()
          return NextResponse.json({
            ...fallbackData,
            provider: 'openai-whisper',
            fallback: true,
          })
        }
      }
      
      return NextResponse.json(
        { 
          error: 'ElevenLabs Speech-to-Text API failed',
          details: errorText,
          status: response.status
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Handle multichannel response format
    if (useMultiChannel && data.transcripts) {
      // Multichannel response: array of transcripts per channel
      console.log('✅ [ElevenLabs STT] Multichannel transcription successful', {
        channels: data.transcripts?.length || 0,
        language: data.language_code || 'unknown',
      })

      // Combine all channel transcripts into a single text
      const combinedText = data.transcripts
        .map((t: any) => t.text)
        .filter(Boolean)
        .join(' ')

      // Create conversation-style transcript
      const conversation = createConversationTranscript(data.transcripts)

      return NextResponse.json({
        text: combinedText,
        language: data.language_code || languageCode || 'auto-detected',
        provider: 'elevenlabs',
        model: modelId,
        multichannel: true,
        channels: data.transcripts.map((t: any) => ({
          channel: t.channel_index,
          speaker: t.speaker_id || `speaker_${t.channel_index}`,
          text: t.text,
          words: t.words || [],
        })),
        conversation: conversation, // Time-ordered conversation transcript
        transcripts: data.transcripts, // Full transcripts array
      })
    } else {
      // Single channel response: standard format
      console.log('✅ [ElevenLabs STT] Transcription successful', {
        textLength: data.text?.length || 0,
        language: data.language_code || data.language || 'unknown',
        hasEvents: !!data.audio_events,
        hasDiarization: !!data.speakers,
      })

      return NextResponse.json({
        text: data.text || '',
        language: data.language_code || data.language || languageCode || 'auto-detected',
        provider: 'elevenlabs',
        model: modelId,
        multichannel: false,
        // Include additional data if available
        ...(data.audio_events && { audio_events: data.audio_events }),
        ...(data.speakers && { speakers: data.speakers }),
        ...(data.segments && { segments: data.segments }),
        ...(data.words && { words: data.words }),
      })
    }
  } catch (error: any) {
    // SECURITY: Never expose API keys in error messages
    const errorMessage = error?.message || 'Unknown error'
    const sanitizedError = errorMessage
      .replace(/sk-[a-zA-Z0-9_-]{20,}/g, '[API_KEY_REDACTED]')
      .replace(/xi-api-key:\s*[a-zA-Z0-9_-]+/gi, 'xi-api-key: [REDACTED]')
    
    console.error('❌ [ElevenLabs STT] Error:', sanitizedError)
    return NextResponse.json(
      { 
        error: 'ElevenLabs Speech-to-Text failed',
        details: sanitizedError
      },
      { status: 500 }
    )
  }
}
