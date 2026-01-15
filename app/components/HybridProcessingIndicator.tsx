'use client'

import { Brain, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

interface HybridProcessingIndicatorProps {
  isProcessing: boolean
  usingDeepSeek?: boolean
  usingOpenAI?: boolean
  usingClaude?: boolean
}

export default function HybridProcessingIndicator({ 
  isProcessing, 
  usingDeepSeek, 
  usingOpenAI,
  usingClaude
}: HybridProcessingIndicatorProps) {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = /iPad|iPhone|iPod|Android/.test(navigator.userAgent)
      setIsMobile(checkMobile)
    }
  }, [])

  if (!isProcessing) return null
  
  // Hide on mobile to avoid clutter
  if (isMobile) return null

  const activeAI = usingDeepSeek ? 'DeepSeek' : usingClaude ? 'Claude AI' : usingOpenAI ? 'OpenAI GPT-4o' : 'VERUM Hybrid'

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 animate-slide-up">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 shadow-xl flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#10a37f] via-[#0d8f6e] to-[#1a7f64] flex items-center justify-center animate-spin">
          {usingDeepSeek ? (
            <Zap className="w-3.5 h-3.5 text-white" />
          ) : (
            <Brain className="w-3.5 h-3.5 text-white" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {activeAI} Processing...
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {usingDeepSeek 
              ? 'Fast & cost-effective' 
              : usingClaude
              ? 'Analysis & creative mode'
              : usingOpenAI 
              ? 'Complex reasoning mode' 
              : 'Hybrid AI thinking'}
          </span>
        </div>
        <div className="w-2 h-2 rounded-full bg-[#10a37f] animate-pulse" />
      </div>
    </div>
  )
}
