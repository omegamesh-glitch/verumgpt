/**
 * Advanced TTS Enhancement System
 * Implements natural voice, emotional expressivity, context-aware intonation
 */

export interface TTSConfig {
  voice: 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'fable' | 'nova' | 'onyx' | 'sage' | 'shimmer' | 'verse' | 'marin' | 'cedar'
  speed: number // 0.25 - 4.0
  pitch?: number
  emotion?: 'neutral' | 'happy' | 'sad' | 'excited' | 'calm' | 'friendly' | 'professional'
  context?: 'conversation' | 'narration' | 'instruction' | 'question' | 'explanation'
}

export interface EmotionalAnalysis {
  emotion: TTSConfig['emotion']
  intensity: number // 0-1
  keywords: string[]
}

/**
 * Analyze text for emotional content and context
 */
export function analyzeTextForTTS(text: string): EmotionalAnalysis {
  const lowerText = text.toLowerCase()
  
  // Happy indicators
  const happyKeywords = ['feliz', 'alegre', 'ótimo', 'excelente', 'incrível', 'maravilhoso', 'parabéns', 'sucesso', '🎉', '😊', '😄']
  const happyCount = happyKeywords.filter(kw => lowerText.includes(kw)).length
  
  // Excited indicators
  const excitedKeywords = ['uau', 'incrível', 'fantástico', 'surpreendente', 'amazing', 'wow', '🔥', '⚡']
  const excitedCount = excitedKeywords.filter(kw => lowerText.includes(kw)).length
  
  // Sad indicators
  const sadKeywords = ['triste', 'tristeza', 'problema', 'erro', 'falha', 'desculpa', 'lamento', '😢', '😞']
  const sadCount = sadKeywords.filter(kw => lowerText.includes(kw)).length
  
  // Professional indicators
  const professionalKeywords = ['importante', 'nota', 'atenção', 'observe', 'considere', 'recomendo', 'sugiro']
  const professionalCount = professionalKeywords.filter(kw => lowerText.includes(kw)).length
  
  // Question indicators
  const questionKeywords = ['?', 'como', 'por que', 'qual', 'quando', 'onde', 'quem']
  const isQuestion = text.includes('?') || questionKeywords.some(kw => lowerText.includes(kw))
  
  // Determine emotion
  let emotion: TTSConfig['emotion'] = 'neutral'
  let intensity = 0.3
  
  if (excitedCount > 0) {
    emotion = 'excited'
    intensity = Math.min(0.8, 0.4 + (excitedCount * 0.1))
  } else if (happyCount > 0) {
    emotion = 'happy'
    intensity = Math.min(0.7, 0.3 + (happyCount * 0.1))
  } else if (sadCount > 0) {
    emotion = 'sad'
    intensity = Math.min(0.6, 0.3 + (sadCount * 0.1))
  } else if (professionalCount > 0) {
    emotion = 'professional'
    intensity = 0.5
  } else if (isQuestion) {
    emotion = 'friendly'
    intensity = 0.4
  }
  
  return {
    emotion,
    intensity,
    keywords: [...happyKeywords, ...excitedKeywords, ...sadKeywords, ...professionalKeywords].filter(kw => lowerText.includes(kw)),
  }
}

/**
 * Detect context type from text
 */
export function detectContext(text: string): TTSConfig['context'] {
  const lowerText = text.toLowerCase()
  
  if (text.includes('?') || lowerText.includes('como') || lowerText.includes('por que')) {
    return 'question'
  }
  
  if (lowerText.includes('passo') || lowerText.includes('instrução') || lowerText.includes('faça') || lowerText.includes('siga')) {
    return 'instruction'
  }
  
  if (lowerText.includes('exemplo') || lowerText.includes('imagine') || lowerText.includes('história')) {
    return 'narration'
  }
  
  if (lowerText.includes('porque') || lowerText.includes('devido') || lowerText.includes('razão')) {
    return 'explanation'
  }
  
  return 'conversation'
}

/**
 * Select best voice based on emotion and context
 */
export function selectBestVoice(emotion: TTSConfig['emotion'], context: TTSConfig['context']): TTSConfig['voice'] {
  // Coral is great for friendly, natural conversations
  if (emotion === 'friendly' || emotion === 'happy') {
    return 'coral'
  }
  
  // Marin is excellent for professional, clear speech
  if (emotion === 'professional' || context === 'instruction') {
    return 'marin'
  }
  
  // Cedar is warm and expressive
  if (emotion === 'excited' || context === 'narration') {
    return 'cedar'
  }
  
  // Nova is versatile and natural
  if (context === 'question' || context === 'explanation') {
    return 'nova'
  }
  
  // Default to coral (most natural)
  return 'coral'
}

/**
 * Generate SSML-like instructions for OpenAI TTS
 */
export function generateTTSInstructions(
  text: string,
  emotion: TTSConfig['emotion'],
  context: TTSConfig['context'],
  intensity: number
): string {
  const instructions: string[] = []
  
  // Base instruction
  instructions.push('Speak in a natural, human-like voice.')
  
  // Emotion-based instructions
  switch (emotion) {
    case 'happy':
      instructions.push(`Express joy and enthusiasm with a warm, cheerful tone. Intensity: ${Math.round(intensity * 100)}%.`)
      break
    case 'excited':
      instructions.push(`Convey excitement and energy. Use dynamic intonation and slightly faster pace. Intensity: ${Math.round(intensity * 100)}%.`)
      break
    case 'sad':
      instructions.push(`Use a gentle, empathetic tone with softer delivery.`)
      break
    case 'professional':
      instructions.push('Maintain a clear, confident, and authoritative tone.')
      break
    case 'friendly':
      instructions.push('Use a warm, approachable, and conversational tone.')
      break
    case 'calm':
      instructions.push('Speak slowly and calmly with a soothing tone.')
      break
    default:
      instructions.push('Use a neutral, clear, and pleasant tone.')
  }
  
  // Context-based instructions
  switch (context) {
    case 'question':
      instructions.push('Use rising intonation at the end to indicate a question.')
      break
    case 'instruction':
      instructions.push('Speak clearly and deliberately. Pause briefly between steps.')
      break
    case 'narration':
      instructions.push('Use expressive storytelling voice with natural rhythm and pacing.')
      break
    case 'explanation':
      instructions.push('Speak clearly and methodically. Emphasize key points.')
      break
  }
  
  // Add natural pauses
  instructions.push('Use appropriate pauses for natural rhythm. Add brief pauses after commas and longer pauses after periods.')
  
  // Avoid robotic patterns
  instructions.push('Vary your intonation and pacing naturally. Avoid monotone or robotic delivery.')
  
  return instructions.join(' ')
}

/**
 * Enhance text with natural pauses and emphasis
 */
export function enhanceTextForTTS(text: string, context: TTSConfig['context']): string {
  let enhanced = text
  
  // Add pauses after punctuation
  enhanced = enhanced.replace(/\.\s+/g, '. ')
  enhanced = enhanced.replace(/,\s+/g, ', ')
  enhanced = enhanced.replace(/!\s+/g, '! ')
  enhanced = enhanced.replace(/\?\s+/g, '? ')
  
  // For questions, ensure question mark is clear
  if (context === 'question' && !enhanced.includes('?')) {
    // Don't add if it's not actually a question
  }
  
  // Remove excessive markdown that might confuse TTS
  enhanced = enhanced
    .replace(/```[\s\S]*?```/g, '[código]')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^\*]+)\*\*/g, '$1')
    .replace(/\*([^\*]+)\*/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\n{3,}/g, '\n\n')
  
  return enhanced.trim()
}

/**
 * Calculate optimal speed based on text length and context
 */
export function calculateOptimalSpeed(text: string, context: TTSConfig['context']): number {
  const length = text.length
  const wordCount = text.split(/\s+/).length
  
  // Longer texts: slightly faster to maintain engagement
  if (length > 1000) {
    return 1.1
  }
  
  // Instructions: slightly slower for clarity
  if (context === 'instruction') {
    return 0.9
  }
  
  // Questions: normal speed
  if (context === 'question') {
    return 1.0
  }
  
  // Default
  return 1.0
}

/**
 * Get complete TTS configuration based on text analysis
 */
export function getOptimalTTSConfig(text: string, userPreferences?: Partial<TTSConfig>): TTSConfig {
  const analysis = analyzeTextForTTS(text)
  const context = detectContext(text)
  const voice = selectBestVoice(analysis.emotion, context)
  const speed = calculateOptimalSpeed(text, context)
  const instructions = generateTTSInstructions(text, analysis.emotion, context, analysis.intensity)
  
  return {
    voice: userPreferences?.voice || voice,
    speed: userPreferences?.speed || speed,
    pitch: userPreferences?.pitch,
    emotion: analysis.emotion,
    context,
  }
}
