'use client'

import { useState, useEffect } from 'react'
import { 
  Settings as SettingsIconLucide, 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Key, 
  Layout, 
  Baby, 
  Mic, 
  Volume2, 
  Database, 
  FileText, 
  Shield, 
  HelpCircle, 
  Mail, 
  X,
  ChevronRight,
  Globe
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Alias to avoid naming conflict
const SettingsIconComponent = SettingsIconLucide

type Theme = 'light' | 'dark' | 'system'
type ApiProvider = 'openai' | 'deepseek'
type Language = 'en' | 'pt' | 'es' | 'fr' | 'de'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [theme, setTheme] = useState<Theme>('system')
  const [kidsMode, setKidsMode] = useState(false)
  const [widgetEnabled, setWidgetEnabled] = useState(true)
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiProvider, setApiProvider] = useState<ApiProvider>('openai')
  const [language, setLanguage] = useState<Language>('en')
  const [ttsSpeed, setTtsSpeed] = useState(1.5)
  const [ttsVoice, setTtsVoice] = useState('nova') // Default OpenAI TTS voice

  useEffect(() => {
    // Load settings from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme || 'system'
    const savedKidsMode = localStorage.getItem('kidsMode') === 'true'
    const savedWidget = localStorage.getItem('widgetEnabled') !== 'false'
    const savedLanguage = (localStorage.getItem('language') as Language) || 'en'
    const savedApiKey = localStorage.getItem('apiKey') || ''
    const savedTtsSpeed = parseFloat(localStorage.getItem('ttsSpeed') || '1.5')
    const savedTtsVoice = localStorage.getItem('ttsVoice') || 'nova'
    
    setTheme(savedTheme)
    setKidsMode(savedKidsMode)
    setWidgetEnabled(savedWidget)
    setLanguage(savedLanguage)
    setApiKey(savedApiKey)
    setTtsSpeed(savedTtsSpeed)
    setTtsVoice(savedTtsVoice)
    
    // Apply theme
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (selectedTheme: Theme) => {
    const root = document.documentElement
    if (selectedTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', prefersDark)
    } else {
      root.classList.toggle('dark', selectedTheme === 'dark')
    }
    localStorage.setItem('theme', selectedTheme)
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  const handleTtsSpeedChange = (speed: number) => {
    setTtsSpeed(speed)
    localStorage.setItem('ttsSpeed', speed.toString())
    // Dispatch custom event to notify other components of the change
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ttsSettingsChanged'))
    }
  }

  const handleTtsVoiceChange = (voice: string) => {
    setTtsVoice(voice)
    localStorage.setItem('ttsVoice', voice)
    // Dispatch custom event to notify other components of the change
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ttsSettingsChanged'))
    }
  }

  const handleKidsModeToggle = (enabled: boolean) => {
    setKidsMode(enabled)
    localStorage.setItem('kidsMode', enabled.toString())
  }

  const handleWidgetToggle = (enabled: boolean) => {
    setWidgetEnabled(enabled)
    localStorage.setItem('widgetEnabled', enabled.toString())
  }

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
    // Note: Language change would require i18n implementation
  }

  const handleApiKeyChange = (key: string) => {
    setApiKey(key)
    localStorage.setItem('apiKey', key)
  }

  const openTerms = () => {
    window.open('/terms', '_blank')
  }

  const openPrivacy = () => {
    window.open('/privacy', '_blank')
  }

  const openSupport = () => {
    window.location.href = 'mailto:rafael@verumnodelegacy.com.br?subject=VERUM Node - Support'
  }

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
  ]

  // ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#10a37f]/20 border border-[#10a37f]/30 flex items-center justify-center">
                <SettingsIconComponent className="w-5 h-5 text-[#10a37f]" />
              </div>
              <h2 className="font-bold text-white">Settings</h2>
            </div>
            <div className="flex items-center gap-3">
            <button
              onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
                <X className="w-5 h-5 text-gray-400" />
            </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-900">
            {/* Appearance - Theme */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-[#10a37f]" />
                <h3 className="text-lg font-semibold text-white">Appearance</h3>
              </div>
              <div className="space-y-3">
                <div className="text-gray-400 mb-3">Theme</div>
                <div className="grid grid-cols-3 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleThemeChange('light')}
                    className={`p-4 rounded-xl border-2 transition-all bg-gray-800 ${
                      theme === 'light'
                        ? 'border-white bg-white/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <Sun className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                    <div className="font-medium text-white">Light</div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleThemeChange('dark')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-[#10a37f] bg-[#10a37f]/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <Moon className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                    <div className="font-medium text-white">Dark</div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleThemeChange('system')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === 'system'
                        ? 'border-[#10a37f] bg-[#10a37f]/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <Monitor className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                    <div className="font-medium text-white">System</div>
                  </motion.button>
                </div>
              </div>
            </section>

            {/* Language */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-[#10a37f]" />
                <h3 className="text-lg font-semibold text-white">Language</h3>
              </div>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:border-gray-600"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </section>

            {/* API Configuration */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-5 h-5 text-[#10a37f]" />
                <h3 className="text-lg font-semibold text-white">API Configuration</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block font-medium text-gray-300 mb-2">
                    API Key (Optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => handleApiKeyChange(e.target.value)}
                      placeholder="sk-..."
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-[#10a37f]/50"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="px-4 py-2.5 rounded-lg border border-gray-700 bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                    >
                      {showApiKey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    Configure your own API key for personal use. Saved automatically.
                  </p>
                </div>
              </div>
            </section>

            {/* Widget */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layout className="w-5 h-5 text-[#10a37f]" />
                  <h3 className="text-lg font-semibold text-white">Widget</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={widgetEnabled}
                    onChange={(e) => handleWidgetToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#10a37f]/50 peer-checked:bg-[#10a37f] relative transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full after:border-0"></div>
                </label>
              </div>
              <p className="text-gray-400">
                Enable floating widget for quick access
              </p>
            </section>

            {/* Kids Mode */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Baby className="w-5 h-5 text-[#10a37f]" />
                  <h3 className="text-lg font-semibold text-white">Kids Mode</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={kidsMode}
                    onChange={(e) => handleKidsModeToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#10a37f]/50 peer-checked:bg-[#10a37f] relative transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full after:border-0"></div>
                </label>
              </div>
              <p className="text-gray-400">
                Filtered content and simplified interface for children
              </p>
            </section>

            {/* TTS (Text-to-Speech) */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Volume2 className="w-5 h-5 text-[#10a37f]" />
                <h3 className="text-lg font-semibold text-white">OpenAI TTS</h3>
              </div>
              <div className="space-y-3">
                {/* TTS Voice Selection */}
                <div className="p-3 rounded-lg border border-gray-700 bg-gray-800/50">
                  <label className="block text-sm font-medium text-white mb-2">
                    OpenAI TTS Voice
                  </label>
                  <select
                    value={ttsVoice}
                    onChange={(e) => handleTtsVoiceChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:border-gray-600"
                  >
                    <option value="alloy">Alloy</option>
                    <option value="echo">Echo</option>
                    <option value="fable">Fable</option>
                    <option value="onyx">Onyx</option>
                    <option value="nova">Nova (Recomendada)</option>
                    <option value="shimmer">Shimmer</option>
                    <option value="coral">Coral</option>
                    <option value="ash">Ash</option>
                    <option value="ballad">Ballad</option>
                    <option value="sage">Sage</option>
                    <option value="verse">Verse</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-2">
                    Escolha a voz do OpenAI TTS para síntese de fala
                  </p>
                </div>

                {/* TTS Speed */}
                <div className="p-3 rounded-lg border border-gray-700 bg-gray-800/50">
                  <label className="block text-sm font-medium text-white mb-2">
                    TTS Speed: {ttsSpeed.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={ttsSpeed}
                    onChange={(e) => handleTtsSpeedChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#10a37f]"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0.5x (Lento)</span>
                    <span>1.0x (Normal)</span>
                    <span>2.5x (Rápido)</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Padrão: 1.5x (rápido)
                  </p>
                </div>
              </div>
            </section>

            {/* Data Control */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-[#10a37f]" />
                <h3 className="text-lg font-semibold text-white">Data Control</h3>
              </div>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-colors">
                  <span className="text-sm text-white">Export Data</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-colors">
                  <span className="text-sm text-white">Clear History</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-red-800 bg-red-950/20 hover:bg-red-950/40 transition-colors">
                  <span className="text-sm text-red-400">Delete Account</span>
                  <ChevronRight className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </section>

            {/* Legal */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[#10a37f]" />
                <h3 className="text-lg font-semibold text-white">Legal</h3>
              </div>
              <div className="space-y-2">
                <button
                  onClick={openTerms}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-colors"
                >
                  <span className="text-sm text-white">Terms of Use</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={openPrivacy}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-colors"
                >
                  <span className="text-sm text-white">Privacy Policy</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </section>

            {/* Help & Support */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-[#10a37f]" />
                <h3 className="text-lg font-semibold text-white">Help & Support</h3>
              </div>
              <button
                onClick={openSupport}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-black" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-white">Contact</div>
                  <div className="text-xs text-gray-400">rafael@verumnodelegacy.com.br</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
            </section>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
