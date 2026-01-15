'use client'

import { Copyright } from 'lucide-react'

export default function Footer() {

  return (
    <footer className="border-t border-gray-800/50 px-6 py-4 glass transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Copyright className="w-3 h-3" />
            <span>2025-2075 R.A.X. Fernandes</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
