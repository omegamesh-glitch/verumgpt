// ZegoCloud Integration for Enhanced TTS and Real-time Audio
// ZegoCloud provides high-quality voice services and real-time audio streaming

export interface ZegoCloudConfig {
  appID: number
  appSign: string
  token: string
  userID: string
  userName?: string
}

// ZegoCloud credentials
export const ZEGOCLOUD_CONFIG: ZegoCloudConfig = {
  appID: 191205211,
  appSign: 'd6d139f750cbda60a4679d273f6f9aad91637d6731094414f90d7323cf77e762',
  token: '04AAAAAGlmPBkADBQZGjSKWcJHpMEFxwCwQzgjXVrHgRhmArTYA/2crfi5oWn/PDMdo8fL8ahUIdPCYghYw+TI6IFlLFrlD3Qfc3KDGrEi2we49RsAt60Lwg6m47oRBa2e8NSJF0Ek5wMCnM7LgO446KsjRgoD2BPBw3SLwpPH+ydICeNGMngpngnBt9e7dRbsIZ07sdxbShUcmebHJHGFvY377gewkRH17tc2ZuI7IORXZfO7Ozwcj5NLrVC3626JPWL62FG3kFQB',
  userID: 'verum-user',
  userName: 'VERUM AI',
}

/**
 * Initialize ZegoCloud SDK for TTS and audio streaming
 * ZegoCloud provides high-quality voice synthesis and real-time audio capabilities
 */
export async function initializeZegoCloud(): Promise<boolean> {
  try {
    // Check if ZegoCloud SDK is available
    if (typeof window === 'undefined') {
      console.warn('⚠️ ZegoCloud: Window not available (server-side)')
      return false
    }

    // Dynamically load ZegoCloud SDK if not already loaded
    if (!(window as any).ZegoExpressEngine) {
      console.log('📦 Loading ZegoCloud SDK...')
      // Note: You'll need to add the ZegoCloud SDK script to your HTML
      // For now, we'll check if it's available
      return false
    }

    console.log('✅ ZegoCloud SDK available')
    return true
  } catch (error) {
    console.error('❌ ZegoCloud initialization error:', error)
    return false
  }
}

/**
 * Use ZegoCloud for enhanced TTS with better voice quality
 * This can provide more natural-sounding speech synthesis
 */
export async function zegoCloudTTS(text: string, config?: Partial<ZegoCloudConfig>): Promise<Blob | null> {
  try {
    const zegoConfig = { ...ZEGOCLOUD_CONFIG, ...config }
    
    // Use our backend API endpoint which handles ZegoCloud integration
    const response = await fetch('/api/zego-tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        appID: zegoConfig.appID,
        appSign: zegoConfig.appSign,
        token: zegoConfig.token,
        userID: zegoConfig.userID,
        voice: 'default', // ZegoCloud voice options
      }),
    })

    if (response.ok) {
      const audioBlob = await response.blob()
      return audioBlob
    }

    return null
  } catch (error) {
    console.error('❌ ZegoCloud TTS error:', error)
    return null
  }
}

/**
 * Check if ZegoCloud is available and configured
 */
export function isZegoCloudAvailable(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check if ZegoCloud SDK is loaded
  return !!(window as any).ZegoExpressEngine || 
         typeof (window as any).ZegoExpressEngine !== 'undefined'
}
