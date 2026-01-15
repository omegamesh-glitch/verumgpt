'use client'

/**
 * TTSButton Component
 * 
 * TEXT-TO-SPEECH PROVIDER: OpenAI TTS ONLY
 * - Uses OpenAI TTS API (tts-1-hd model, nova voice)
 * - NO ElevenLabs, NO Web Speech API, NO other providers
 * - Powered by OpenAI Text-to-Speech API
 */

import { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX, Loader2 } from 'lucide-react'

interface TTSButtonProps {
  text: string
  className?: string
}

export default function TTSButton({ text, className = '' }: TTSButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [ttsVoice, setTtsVoice] = useState('nova')
  const [ttsSpeed, setTtsSpeed] = useState(1.5)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  // REMOVED: speechSynthesisRef - NO Web Speech API fallback!
  const isProcessingRef = useRef(false)
  
  // Load TTS settings from localStorage on mount and sync with changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const loadSettings = () => {
      const savedVoice = localStorage.getItem('ttsVoice') || 'nova'
      const savedSpeed = parseFloat(localStorage.getItem('ttsSpeed') || '1.5')
      setTtsVoice(savedVoice)
      setTtsSpeed(savedSpeed)
    }
    
    // Load initial settings
    loadSettings()
    
    // Listen for storage changes (when settings are updated in another component)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ttsVoice' || e.key === 'ttsSpeed') {
        loadSettings()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom events (for same-window updates)
    const handleCustomStorageChange = () => {
      loadSettings()
    }
    
    window.addEventListener('ttsSettingsChanged', handleCustomStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('ttsSettingsChanged', handleCustomStorageChange)
    }
  }, [])

  // Platform detection (iOS, Android, Mobile, Desktop)
  const getPlatform = () => {
    if (typeof window === 'undefined') return 'desktop'
    const ua = navigator.userAgent
    const isIOS = /iPad|iPhone|iPod/.test(ua)
    const isAndroid = /Android/.test(ua)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
    const isDesktop = !isMobile
    
    if (isIOS) return 'ios'
    if (isAndroid) return 'android'
    if (isMobile) return 'mobile'
    if (isDesktop) return 'desktop'
    return 'desktop' // Default to desktop
  }

  /**
   * OpenAI TTS - EXCLUSIVE PROVIDER
   * This is the ONLY TTS provider used in this application.
   * Uses OpenAI's Text-to-Speech API with tts-1-hd model and nova voice.
   */
  const getOpenAITTS = async (text: string, platform: string) => {
    const startTime = performance.now()
    const textToConvert = text.substring(0, 5000)

    console.log(`🔊 [OpenAI TTS] ${platform}: Generating speech with OpenAI TTS API...`)

    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: textToConvert,
        voice: ttsVoice, // Use selected voice from settings
        model: 'tts-1-hd', // Best quality
        format: 'mp3',
        speed: 1.0,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`OpenAI TTS failed: ${response.status} ${errorText}`)
    }

    const blob = await response.blob()
    if (blob.size === 0) {
      throw new Error('OpenAI TTS returned empty audio')
    }

    const time = ((performance.now() - startTime) / 1000).toFixed(2)
    console.log(`✅ [OpenAI TTS] ${platform}: Speech generated successfully (${time}s)`)
    return { blob, source: 'openai', time }
  }

  // REMOVED: ElevenLabs TTS - Completely removed, using OpenAI TTS exclusively

  const handleTTS = async () => {
    console.log('🔊 TTS Button clicked, text length:', text?.length || 0)
    
    if (isPlaying) {
      console.log('⏹️ Stopping TTS')
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current = null
      }
      // Using OpenAI TTS only
      setIsPlaying(false)
      isProcessingRef.current = false
      return
    }

    if (!text || text.trim().length === 0) {
      alert('Nenhum texto para reproduzir')
      return
    }

    if (isProcessingRef.current) {
      console.log('⚠️ TTS already processing')
      return
    }

    isProcessingRef.current = true
    setIsLoading(true)
    console.log('🔄 Starting TTS...')
    
    const platform = getPlatform()
    console.log(`📱 Platform detected: ${platform}`)

    try {
      let ttsWorked = false

      // ========== iOS VERSION - OpenAI TTS ONLY ==========
      if (platform === 'ios') {
        try {
          console.log('🔊 [OpenAI TTS] iOS: Generating speech...')
          
          const result = await getOpenAITTS(text, 'iOS')
          
          console.log(`✅ [OpenAI TTS] iOS: Speech ready! Time: ${result.time}s`)
          
          const audioUrl = URL.createObjectURL(result.blob)
          const audio = new Audio(audioUrl)
          
          // iOS-specific optimizations
          audio.volume = 1.0
          audio.preload = 'auto'
          audio.setAttribute('playsinline', 'true')
          audio.setAttribute('webkit-playsinline', 'true')
          audio.setAttribute('x-webkit-airplay', 'allow')
          
          audioRef.current = audio
          
          audio.onended = () => {
            setIsPlaying(false)
            isProcessingRef.current = false
            URL.revokeObjectURL(audioUrl)
            audioRef.current = null
          }
          
          audio.onerror = () => {
            setIsPlaying(false)
            isProcessingRef.current = false
            URL.revokeObjectURL(audioUrl)
            audioRef.current = null
          }
          
          // iOS requires load() before play()
              audio.load()
          await new Promise(resolve => setTimeout(resolve, 100)) // Reduced delay for speed
          
          await audio.play()
              setIsPlaying(true)
              setIsLoading(false)
          ttsWorked = true
          return
        } catch (iosError: any) {
          console.error('❌ iOS race condition failed:', iosError?.message)
          throw new Error(`TTS failed: ${iosError?.message || 'Unknown error'}`)
        }
      }

      // ========== ANDROID/MOBILE VERSION - OpenAI TTS ONLY ==========
      if (platform === 'android' || platform === 'mobile') {
        try {
          console.log('🔊 [OpenAI TTS] Mobile: Generating speech...')
          
          const result = await getOpenAITTS(text, 'Mobile')
          
          console.log(`✅ [OpenAI TTS] Mobile: Speech ready! Time: ${result.time}s`)
          
          const audioUrl = URL.createObjectURL(result.blob)
          const audio = new Audio(audioUrl)
          audio.setAttribute('playsinline', 'true')
          audioRef.current = audio
          
          audio.onended = () => {
            setIsPlaying(false)
            isProcessingRef.current = false
            URL.revokeObjectURL(audioUrl)
            audioRef.current = null
          }
          
          audio.load()
          await new Promise(resolve => setTimeout(resolve, 100)) // Reduced delay for speed
          await audio.play()
          setIsPlaying(true)
          setIsLoading(false)
          return
        } catch (e: any) {
          console.error('❌ Mobile race condition failed:', e?.message)
          throw new Error(`TTS failed: ${e?.message || 'Unknown error'}`)
        }
      }

      // ========== DESKTOP VERSION - OpenAI TTS ONLY ==========
      if (platform === 'desktop') {
        try {
          console.log('🔊 [OpenAI TTS] Desktop: Generating speech...')
          
          const result = await getOpenAITTS(text, 'Desktop')
          
          console.log(`✅ [OpenAI TTS] Desktop: Speech ready! Time: ${result.time}s`)
          
          const audioUrl = URL.createObjectURL(result.blob)
          const audio = new Audio(audioUrl)
          
          audioRef.current = audio
          
          audio.onended = () => {
            setIsPlaying(false)
            isProcessingRef.current = false
            URL.revokeObjectURL(audioUrl)
            audioRef.current = null
          }

          audio.onerror = () => {
            setIsPlaying(false)
            isProcessingRef.current = false
            URL.revokeObjectURL(audioUrl)
            audioRef.current = null
          }
          
          await audio.play()
          setIsPlaying(true)
          setIsLoading(false)
          return
        } catch (desktopError: any) {
          console.error('❌ [OpenAI TTS] Desktop failed:', desktopError?.message)
          
          // OpenAI TTS failed
          throw new Error('OpenAI TTS failed. Please check your connection and API key.')
        }
      }
      
      throw new Error('Plataforma não suportada')
    } catch (error: any) {
      console.error('❌ [OpenAI TTS] Error:', error)
      setIsLoading(false)
      setIsPlaying(false)
      isProcessingRef.current = false
      alert(`Erro no OpenAI TTS: ${error?.message || 'Erro desconhecido'}\n\nTente novamente.`)
    }
  }

  return (
    <button
      onClick={handleTTS}
      disabled={isLoading || !text || text.trim().length === 0}
      className={`p-2 rounded-lg transition-all duration-200 ${
        isPlaying
          ? 'bg-[#10a37f] text-white hover:bg-[#1a7f64]'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
      } ${className} ${(!text || text.trim().length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isPlaying ? 'Parar áudio (OpenAI TTS)' : 'Reproduzir áudio com OpenAI TTS'}
      aria-label={isPlaying ? 'Parar reprodução de áudio OpenAI TTS' : 'Reproduzir texto em voz alta usando OpenAI TTS'}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isPlaying ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </button>
  )
}
