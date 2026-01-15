'use client'

import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('PWA installed successfully')
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            🆓 Instalar VERUM NODE (100% GRATUITO)
          </h3>
          <p className="text-sm text-gray-600">
            Adicione VERUM NODE à sua tela inicial para acesso rápido e uso offline. Funciona como app nativo no iPhone/iPad - SEM precisar da App Store!
          </p>
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <p><strong>iPhone/iPad:</strong> Safari → Compartilhar → Adicionar à Tela Inicial</p>
            <p><strong>Android:</strong> Chrome → Menu → Adicionar à Tela Inicial</p>
            <p className="text-[#10a37f] font-semibold">✅ 100% Gratuito - Sem pagar $99!</p>
          </div>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="p-1 hover:bg-gray-100 rounded transition"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleInstall}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#10a37f] hover:bg-[#1a7f64] text-white rounded-lg transition text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Instalar Agora
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition text-sm"
        >
          Depois
        </button>
      </div>
    </div>
  )
}
