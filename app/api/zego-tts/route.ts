import { NextRequest, NextResponse } from 'next/server'

/**
 * ZegoCloud TTS API endpoint
 * Provides enhanced TTS using ZegoCloud's voice synthesis services
 */
export async function POST(req: NextRequest) {
  try {
    const { 
      text,
      appID,
      appSign,
      token,
      userID,
      voice = 'default'
    } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      )
    }

    // Validate ZegoCloud credentials
    if (!appID || !appSign || !token) {
      return NextResponse.json(
        { error: 'ZegoCloud credentials not provided' },
        { status: 400 }
      )
    }

    console.log('🎤 ZegoCloud TTS request:', {
      textLength: text.length,
      appID,
      userID,
      voice
    })

    // ZegoCloud TTS API call
    // Note: Replace with actual ZegoCloud TTS API endpoint
    // ZegoCloud provides RESTful APIs for TTS services
    const zegoResponse = await fetch('https://api.zegocloud.com/v1/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        app_id: appID,
        app_sign: appSign,
        text,
        voice_type: voice,
        speed: 1.0,
        pitch: 1.0,
        volume: 1.0,
        format: 'mp3',
      }),
    })

    if (!zegoResponse.ok) {
      const errorText = await zegoResponse.text()
      console.error('❌ ZegoCloud TTS API error:', errorText)
      
      // Fallback to OpenAI TTS if ZegoCloud fails
      return NextResponse.json(
        { error: 'ZegoCloud TTS failed, use OpenAI TTS fallback' },
        { status: zegoResponse.status }
      )
    }

    const audioBuffer = await zegoResponse.arrayBuffer()
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error: any) {
    console.error('❌ ZegoCloud TTS error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to generate speech with ZegoCloud' },
      { status: 500 }
    )
  }
}
