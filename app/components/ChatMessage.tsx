'use client'

import ReactMarkdown from 'react-markdown'
import { Sparkles, FileText, Image as ImageIcon } from 'lucide-react'
import TTSButton from './TTSButton'

interface ChatMessageProps {
  message: {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    pdfInfo?: {
      title: string
      pages: number
    }
    imageData?: string // Base64 image data
    imageUrl?: string // URL for DALL-E images
    imagePrompt?: string // The prompt used to generate the image
  }
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex gap-4 animate-slide-up ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.role === 'assistant' && (
        <div className="w-9 h-9 rounded-lg bg-white/95 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
          <Sparkles className="w-5 h-5 text-[#0a0a0a]" strokeWidth={1.5} />
        </div>
      )}
      
      <div className={`group max-w-[82%] rounded-2xl px-5 py-4 transition-all duration-300 ${
        message.role === 'user'
          ? 'bg-[#1f2933]/90 text-gray-100 backdrop-blur-sm'
          : 'bg-[#111827]/80 border border-gray-800/40 backdrop-blur-sm'
      }`}>
        {message.role === 'user' && message.pdfInfo && (
          <div className="mb-3 pb-3 border-b border-white/20">
            <div className="flex items-center gap-2 text-xs">
              <FileText className="w-3 h-3 text-white/90" />
              <span className="text-white/90">
                PDF: {message.pdfInfo.title} ({message.pdfInfo.pages} pages)
              </span>
            </div>
          </div>
        )}
        {/* Display generated image if present */}
        {(message.imageData || message.imageUrl) && (
          <div className="mb-3 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <ImageIcon className="w-3 h-3" />
              <span>Imagem gerada</span>
            </div>
            <div className="rounded-lg overflow-hidden bg-gray-100">
              <img
                src={message.imageData ? `data:image/png;base64,${message.imageData}` : message.imageUrl}
                alt={message.imagePrompt || 'Imagem gerada'}
                className="w-full h-auto max-w-full"
              />
            </div>
            {message.imagePrompt && (
              <p className="text-xs text-gray-500 mt-2 italic">
                "{message.imagePrompt}"
              </p>
            )}
          </div>
        )}
        
        <div className={`prose prose-sm max-w-none leading-relaxed ${
          message.role === 'user'
            ? 'prose-headings:text-gray-100 prose-p:text-gray-200 prose-strong:text-white prose-code:text-gray-200 prose-code:bg-gray-800/30'
            : 'prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-code:text-gray-300 prose-code:bg-gray-800/40'
        } prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-xs`}>
          <ReactMarkdown>
            {message.content}
          </ReactMarkdown>
        </div>
        {message.role === 'assistant' && (
          <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/timestamp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: message.content, type: 'message' }),
                  })
                  const data = await response.json()
                  if (data.success) {
                    alert(`Timestamp criado!\n\nHash: ${data.hash.substring(0, 16)}...\n\nEste hash prova autenticidade na blockchain.`)
                  }
                } catch (error) {
                  console.error('Timestamp error:', error)
                  alert('Erro ao criar timestamp')
                }
              }}
              className="px-2 py-1 text-xs text-gray-500 hover:text-[#10a37f] hover:bg-gray-900 rounded transition"
              title="Criar timestamp para prova de autenticidade"
            >
              🔐 Timestamp
            </button>
            <TTSButton text={message.content} />
          </div>
        )}
      </div>

      {message.role === 'user' && (
        <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-gray-300 text-xs font-semibold">U</span>
        </div>
      )}
    </div>
  )
}
