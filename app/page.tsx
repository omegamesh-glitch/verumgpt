'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Send, Loader2, Sparkles, FileText, X, Search, Settings as SettingsIcon, Image as ImageIcon, Mic, MicOff } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import dynamic from 'next/dynamic'
import ChatMessage from './components/ChatMessage'
import Footer from './components/Footer'

// Lazy load heavy components com loading states otimizados
const PWAInstallPrompt = dynamic(() => import('./components/PWAInstallPrompt'), { 
  ssr: false,
  loading: () => null, // Não mostrar loading para PWA prompt
})
const SettingsModal = dynamic(() => import('./components/SettingsModal'), { 
  ssr: false,
  loading: () => null, // Modal só aparece quando necessário
})
const HybridProcessingIndicator = dynamic(() => import('./components/HybridProcessingIndicator'), { 
  ssr: false,
  loading: () => null,
})

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  pdfContent?: string
  pdfInfo?: {
    title: string
    pages: number
  }
  imageData?: string // Base64 image data
  imageUrl?: string // URL for DALL-E images
  imagePrompt?: string // The prompt used to generate the image
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedPDF, setUploadedPDF] = useState<{ text: string; info: any } | null>(null)
  const [isUploadingPDF, setIsUploadingPDF] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [webSearchEnabled, setWebSearchEnabled] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [processingAI, setProcessingAI] = useState<'deepseek' | 'openai' | 'claude' | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const finalTranscriptRef = useRef<string>('')

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        await handlePDFUpload(acceptedFiles[0])
      }
    },
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0]
      if (rejection.errors[0]?.code === 'file-too-large') {
        alert('File too large. Maximum size is 10MB.')
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        alert('Invalid file type. Please upload a PDF file.')
      } else {
        alert('Failed to upload PDF. Please try again.')
      }
    },
    noClick: true,
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Force reload on service worker update (important for mobile PWA)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      let refreshing = false
      
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return
        refreshing = true
        // Force reload on mobile to get latest version
        window.location.reload()
      })

      // Check for updates immediately and frequently
      const checkForUpdates = () => {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.update().catch(() => {})
            // Force unregister and re-register if update fails
            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' })
            }
          })
        })
      }

      // Check immediately on load
      checkForUpdates()
      
      // Check every 10 seconds (more aggressive)
      const intervalId = setInterval(checkForUpdates, 10000)
      
      // Also check when page becomes visible (user returns to app)
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          checkForUpdates()
        }
      }
      document.addEventListener('visibilitychange', handleVisibilityChange)
      
      return () => {
        clearInterval(intervalId)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }, [])


  const handlePDFUpload = async (file: File) => {
    setIsUploadingPDF(true)
    try {
      const formData = new FormData()
      formData.append('pdf', file)

      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (data.success) {
        setUploadedPDF({
          text: data.text,
          info: data.info,
        })
        console.log(`✅ PDF uploaded: ${data.info.title} (${data.pages} pages)`)
      } else {
        alert(`Failed to upload PDF: ${data.error}`)
      }
    } catch (error: any) {
      console.error('PDF upload error:', error)
      alert(`Failed to upload PDF: ${error.message || 'Unknown error'}`)
    } finally {
      setIsUploadingPDF(false)
    }
  }

  const removePDF = () => {
    setUploadedPDF(null)
  }

  // Transcrição de voz integrada no chat
  const startTranscription = () => {
    if (isRecording) {
      stopTranscription()
      return
    }

    // Verificar se o navegador suporta Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'pt-BR' // Português brasileiro
      
      recognition.onstart = () => {
        setIsRecording(true)
        console.log('🎤 Transcrição iniciada')
        // Resetar transcript ao iniciar nova transcrição
        finalTranscriptRef.current = ''
      }
      
      recognition.onresult = (event: any) => {
        // Usar event.resultIndex - forma recomendada pela Web Speech API
        // event.resultIndex indica onde começam os NOVOS resultados desde o último evento
        let finalText = ''
        let interimText = ''
        
        // Processar apenas os novos resultados desde event.resultIndex
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript.trim()
          const isFinal = event.results[i].isFinal
          
          if (isFinal && transcript) {
            // Verificar se o texto já existe no acumulado para evitar duplicação
            const currentFinal = finalTranscriptRef.current.trim()
            if (!currentFinal.includes(transcript)) {
              // Novo texto: adicionar
              finalText += (finalText ? ' ' : '') + transcript
            }
          } else if (!isFinal && transcript) {
            // Resultados intermediários: usar apenas o último para preview
            interimText = transcript
          }
        }
        
        // Atualizar o transcript final acumulado apenas com texto novo
        if (finalText) {
          finalTranscriptRef.current += (finalTranscriptRef.current.trim() ? ' ' : '') + finalText
        }
        
        // Construir texto de exibição: texto final acumulado + interim atual
        const displayText = finalTranscriptRef.current.trim() + (interimText ? ' ' + interimText : '')
        
        if (displayText.trim()) {
          setInput(displayText.trim())
        }
      }
      
      recognition.onerror = (event: any) => {
        console.error('Erro na transcrição:', event.error)
        
        // Erros que não precisam de alerta
        if (event.error === 'no-speech' || event.error === 'aborted') {
          return
        }
        
        // Tratamento específico para erro de rede
        if (event.error === 'network') {
          console.log('🔄 Erro de rede na Web Speech API, tentando fallback com OpenAI Whisper...')
          stopTranscription()
          // Tentar usar MediaRecorder + OpenAI Whisper como fallback
          startMediaRecorder()
          return
        }
        
        // Outros erros
        let errorMessage = 'Erro na transcrição'
        switch (event.error) {
          case 'audio-capture':
            errorMessage = 'Não foi possível acessar o microfone. Verifique as permissões.'
            break
          case 'not-allowed':
            errorMessage = 'Permissão de microfone negada. Por favor, permita o acesso ao microfone.'
            break
          case 'service-not-allowed':
            errorMessage = 'Serviço de reconhecimento de voz não disponível.'
            break
          default:
            errorMessage = `Erro na transcrição: ${event.error}`
        }
        
        alert(errorMessage)
        stopTranscription()
      }
      
      recognition.onend = () => {
        if (isRecording) {
          // Reiniciar automaticamente se ainda estiver gravando
          try {
            recognition.start()
          } catch (e) {
            stopTranscription()
          }
        }
      }
      
      recognitionRef.current = recognition
      recognition.start()
    } else {
      // Fallback: usar MediaRecorder + OpenAI Whisper API
      startMediaRecorder()
    }
  }

  const stopTranscription = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
    }
    setIsRecording(false)
    // Resetar transcript ao parar
    finalTranscriptRef.current = ''
    console.log('🛑 Transcrição parada')
  }

  const startMediaRecorder = async () => {
    try {
      console.log('🎤 Iniciando gravação com MediaRecorder (fallback)...')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      const audioChunks: Blob[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data)
        }
      }
      
      mediaRecorder.onstop = async () => {
        if (audioChunks.length === 0) {
          console.warn('⚠️ Nenhum áudio gravado')
          setIsRecording(false)
          stream.getTracks().forEach(track => track.stop())
          return
        }
        
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
        console.log(`📦 Áudio gravado: ${audioBlob.size} bytes`)
        await transcribeAudio(audioBlob)
        
        // Parar o stream
        stream.getTracks().forEach(track => track.stop())
      }
      
      // Parar automaticamente após 30 segundos ou quando o usuário clicar novamente
      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
      console.log('✅ Gravação iniciada (MediaRecorder + OpenAI Whisper)')
      
      // Auto-stop após 30 segundos
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          console.log('⏱️ Parando gravação após 30 segundos...')
          mediaRecorderRef.current.stop()
        }
      }, 30000)
    } catch (error: any) {
      console.error('❌ Erro ao iniciar gravação:', error)
      let errorMessage = 'Erro ao acessar o microfone'
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Permissão de microfone negada. Por favor, permita o acesso ao microfone nas configurações do navegador.'
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'Nenhum microfone encontrado. Verifique se há um microfone conectado.'
      }
      alert(errorMessage)
      setIsRecording(false)
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true)
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Erro na transcrição')
      }
      
      const data = await response.json()
      if (data.text) {
        setInput(data.text)
        // Opcional: enviar automaticamente após transcrição
        // setTimeout(() => handleSend(), 500)
      }
    } catch (error) {
      console.error('Erro na transcrição:', error)
      alert('Erro ao transcrever áudio')
    } finally {
      setIsTranscribing(false)
      setIsRecording(false)
    }
  }


  const handleSend = async () => {
    if ((!input.trim() && !uploadedPDF) || isLoading) return

    // Build message content with PDF if available
    let messageContent = input.trim()
    if (uploadedPDF) {
      const pdfContext = `\n\n[PDF Document: ${uploadedPDF.info.title} (${uploadedPDF.info.pages} pages)]\n\n${uploadedPDF.text.substring(0, 5000)}${uploadedPDF.text.length > 5000 ? '...' : ''}`
      messageContent = messageContent ? `${messageContent}${pdfContext}` : `Please analyze this PDF document:${pdfContext}`
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
      pdfContent: uploadedPDF?.text,
      pdfInfo: uploadedPDF?.info,
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = messageContent
    setInput('')
    setUploadedPDF(null) // Clear PDF after sending
    setIsLoading(true)
    setProcessingAI(null) // Reset AI indicator
    
    // Detect if web search might be needed (optimized with useMemo-like approach)
    const searchKeywords = ['current', 'latest', 'today', 'recent', 'now', '2024', '2025', 'what is', 'who is', 'when did', 'where is', 'how to', 'news', 'update', 'happening', 'trending', 'popular', 'price', 'cost', 'buy', 'sell', 'stock', 'market', 'weather', 'forecast']
    const inputLower = currentInput.toLowerCase()
    const mightNeedSearch = webSearchEnabled && searchKeywords.some(keyword => 
      inputLower.includes(keyword.toLowerCase())
    )
    
    if (mightNeedSearch) {
      setIsSearching(true)
      // Reset after a delay (search happens in backend)
      setTimeout(() => setIsSearching(false), 1000) // Further reduced delay
    }

    const abortController = new AbortController()
    const timeoutId = setTimeout(() => abortController.abort(), 60000) // 60s timeout

    try {
      // Use Hybrid API (intelligently combines DeepSeek + OpenAI)
      const response = await fetch('/api/chat-hybrid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortController.signal,
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            {
              role: 'user',
              content: currentInput,
            },
          ],
          useOmegaMesh: true,
          enableWebSearch: webSearchEnabled,
          reasoning_effort: 'medium',
          verbosity: 'low',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to get response`)
      }

      // Detect which AI is being used from response headers (for performance indicator)
      const aiProvider = response.headers.get('X-AI-Provider')
      if (aiProvider === 'deepseek') {
        setProcessingAI('deepseek')
      } else if (aiProvider === 'openai') {
        setProcessingAI('openai')
      } else if (aiProvider === 'claude') {
        setProcessingAI('claude')
      }

      // Check if response is JSON (GPT-5 Responses API) or SSE stream
      const contentType = response.headers.get('content-type') || ''
      
      if (contentType.includes('application/json')) {
        // GPT-5 Responses API - JSON response
        const data = await response.json()
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content || data.message || '',
          timestamp: new Date(),
          imageData: data.imageData,
          imagePrompt: data.imagePrompt,
        }

        setMessages((prev) => [...prev, assistantMessage])
        clearTimeout(timeoutId)
        setIsLoading(false)
        setIsSearching(false)
        return
      }

      // SSE stream (fallback to chat-enhanced)
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])


      let buffer = ''
      let fullContent = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
              if (data === '[DONE]') {
              clearTimeout(timeoutId)
                setIsLoading(false)
                setProcessingAI(null)
              return
              }

            if (data) {
              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content || ''

                if (content) {
                  fullContent += content
                  setMessages((prev) => {
                    const updated = [...prev]
                    const lastMessage = updated[updated.length - 1]
                    if (lastMessage && lastMessage.role === 'assistant') {
                      lastMessage.content += content
                    }
                    return updated
                  })
                }
              } catch (e) {
                console.warn('Failed to parse SSE data:', e)
              }
            }
          }
        }
      }

      clearTimeout(timeoutId)
      setIsLoading(false)
      setIsSearching(false)
      setProcessingAI(null)
    } catch (error: any) {
      clearTimeout(timeoutId)
      setIsSearching(false)
      console.error('Chat error:', error)
      
      if (error.name === 'AbortError') {
        setMessages((prev) => {
          const updated = [...prev]
          const lastMessage = updated[updated.length - 1]
          if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.content) {
            lastMessage.content = 'Request timeout. Please try again.'
          }
          return updated
        })
      } else {
        setMessages((prev) => {
          const updated = [...prev]
          const lastMessage = updated[updated.length - 1]
          if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.content) {
            lastMessage.content = `Error: ${error.message || 'Failed to get response'}. Please try again.`
          }
          return updated
        })
      }
      
      setIsLoading(false)
      setProcessingAI(null)
    }
  }

  return (
    <div {...getRootProps()} className="h-screen flex flex-col bg-black transition-colors duration-300">
      <input {...getInputProps()} />
      <PWAInstallPrompt />
      
      {/* Hybrid Processing Indicator */}
      <HybridProcessingIndicator 
        isProcessing={isLoading} 
        usingDeepSeek={processingAI === 'deepseek'}
        usingOpenAI={processingAI === 'openai'}
        usingClaude={processingAI === 'claude'}
      />
      
      {/* Header - VERUM Refinado e Profissional */}
      <header className="sticky top-0 z-50 border-b border-gray-900/50 bg-[#0a0a0a]/95 backdrop-blur-md px-6 py-3.5 transition-all duration-300">
        <div className="relative flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3.5">
            {/* Logo VERUM - Mais elegante */}
            <div className="flex items-center gap-3.5">
              <div className="relative w-10 h-10 rounded-lg bg-white/95 flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-[#0a0a0a]" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white tracking-tight leading-tight">
                  VERUM NODE
                </h1>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-900/50 transition-all duration-200 active:scale-[0.97]"
              title="Settings"
            >
              <SettingsIcon className="w-4.5 h-4.5 text-gray-400" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setMessages([])}
              className="px-4 py-2 text-sm font-medium text-gray-300 border border-gray-800/50 rounded-lg hover:bg-gray-900/50 hover:border-gray-700 transition-all duration-200 active:scale-[0.97]"
            >
              New Chat
            </button>
          </div>
        </div>
      </header>

        {/* Messages */}
      <main className="flex-1 overflow-y-auto px-6 py-12 bg-[#0a0a0a] transition-colors duration-300">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-32 animate-slide-up">
              {/* Logo Central Refinado */}
              <div className="relative w-20 h-20 mx-auto mb-8 animate-fade-in">
                <div className="w-20 h-20 rounded-2xl bg-white/98 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-10 h-10 text-[#0a0a0a]" strokeWidth={1.5} />
                </div>
              </div>
              <h2 className="text-5xl font-semibold mb-4 text-white/95 tracking-tight animate-fade-in leading-tight">
                How can I help you today?
              </h2>
              <p className="text-base text-gray-400/90 mb-16 animate-fade-in font-light">
                Ask anything, upload a PDF, or search the web
              </p>
              <div className="mt-8 p-4 bg-gray-950/50 border border-gray-800/30 rounded-xl max-w-sm mx-auto animate-fade-in backdrop-blur-sm">
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  📱 Instalar no iPhone
                </p>
                <p className="text-xs text-gray-500/80 leading-relaxed">
                  Safari → Compartilhar → Adicionar à Tela Inicial
                </p>
              </div>
              <div className="mt-10 flex items-center justify-center gap-3 animate-fade-in">
                <button
                  onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 active:scale-[0.97] ${
                    webSearchEnabled
                      ? 'bg-[#10a37f] text-white shadow-lg shadow-[#10a37f]/20 hover:shadow-xl hover:shadow-[#10a37f]/30'
                      : 'bg-gray-900/50 text-gray-300 hover:bg-gray-800/50 border border-gray-800/50'
                  }`}
                >
                  <Search className="w-4 h-4" strokeWidth={2} />
                  Web Search {webSearchEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
              {isDragActive && (
                <div className="mt-8 p-8 border-2 border-dashed border-gray-800/50 rounded-xl bg-gray-950/30 backdrop-blur-sm animate-fade-in">
                  <p className="text-white/90 font-medium">Drop your PDF here</p>
                </div>
              )}
            </div>
          )}

              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                />
              ))}

              {isLoading && (
            <div className="flex items-center gap-3 text-gray-400/80 animate-fade-in">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" strokeWidth={2} />
              <span className="text-sm font-light">Thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input - VERUM Refinado */}
      <footer className="relative border-t border-gray-900/50 bg-[#0a0a0a]/95 backdrop-blur-md px-6 py-5">
        <div className="relative max-w-4xl mx-auto">
          {/* PDF Preview */}
          {uploadedPDF && (
            <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-between animate-slide-up"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-black dark:bg-white rounded">
                  <FileText className="w-3.5 h-3.5 text-white dark:text-black" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{uploadedPDF.info.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{uploadedPDF.info.pages} pages • {(uploadedPDF.info.size / 1024).toFixed(2)}KB</p>
                </div>
            </div>
              <button
                onClick={removePDF}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition"
                title="Remove PDF"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-500" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder={uploadedPDF ? "Ask about the PDF or type a message..." : "Message VERUM..."}
                rows={1}
                className="w-full px-5 py-4 pr-20 border border-gray-800/40 bg-gray-950/30 backdrop-blur-sm rounded-2xl resize-none focus:outline-none focus:border-[#10a37f]/60 focus:ring-2 focus:ring-[#10a37f]/20 text-white/95 placeholder-gray-500/70 transition-all duration-300"
                style={{
                  minHeight: '64px',
                  maxHeight: '200px',
                }}
              />
              <div className="absolute right-3 bottom-3 flex gap-1">
                <button
                  onClick={startTranscription}
                  disabled={isLoading || isTranscribing}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isRecording
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                  } ${isLoading || isTranscribing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={isRecording ? 'Parar gravação' : 'Iniciar transcrição de voz'}
                >
                  {isRecording ? (
                    <MicOff className="w-4 h-4" />
                  ) : isTranscribing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={async () => {
                    let imagePrompt = input.trim()
                    if (!imagePrompt) {
                      imagePrompt = window.prompt('Enter image description:') || ''
                    }
                    if (!imagePrompt) return
                    
                    setIsLoading(true)
                    try {
                      const response = await fetch('/api/generate-image', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: imagePrompt, quality: 'high' }),
                      })
                      
                      const data = await response.json()
                      if (data.success && data.images?.[0]?.b64_json) {
                        const imageMessage: Message = {
                          id: Date.now().toString(),
                          role: 'assistant',
                          content: `Generated image: ${imagePrompt}`,
                          timestamp: new Date(),
                          imageData: data.images[0].b64_json,
                          imagePrompt: imagePrompt,
                        }
                        setMessages((prev) => [...prev, imageMessage])
                      } else {
                        alert(data.error || 'Failed to generate image')
                      }
                    } catch (error) {
                      console.error('Image generation error:', error)
                      alert('Failed to generate image')
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                  disabled={isLoading}
                  className="p-2 hover:bg-gray-900 rounded transition disabled:opacity-50"
                  title="Generate Image"
                >
                  <ImageIcon className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => {
                    const input = document.querySelector('input[type="file"]') as HTMLInputElement
                    if (input) {
                      input.accept = 'application/pdf'
                      input.click()
                    }
                  }}
                  disabled={isUploadingPDF}
                  className="p-2 hover:bg-gray-900 rounded transition disabled:opacity-50"
                  title="Upload PDF"
                >
                  {isUploadingPDF ? (
                    <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={(!input.trim() && !uploadedPDF) || isLoading}
              className="p-3.5 bg-[#10a37f] text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center min-w-[48px] hover:bg-[#0d8f6e] hover:shadow-lg hover:shadow-[#10a37f]/30 active:scale-[0.97]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-3 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </footer>
      <Footer />

      {/* Settings Modal */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
// VERUM NODE - PWA Ready for Apple Store (Free)
