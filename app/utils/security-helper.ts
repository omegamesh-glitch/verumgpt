/**
 * Security Helper - Prevents API key exposure
 * 
 * IMPORTANT: Never expose API keys in logs, responses, or error messages
 */

/**
 * Sanitize error messages to remove any potential API key exposure
 */
export function sanitizeError(error: any): string {
  if (!error) return 'Unknown error'
  
  const errorMessage = error.message || error.toString() || ''
  
  // Remove potential API key patterns (even partial)
  return errorMessage
    .replace(/sk-[a-zA-Z0-9_-]{20,}/g, '[API_KEY_REDACTED]')
    .replace(/Bearer\s+[a-zA-Z0-9_-]+/g, 'Bearer [REDACTED]')
    .replace(/api[_-]?key[=:]\s*[a-zA-Z0-9_-]+/gi, 'api_key=[REDACTED]')
    .replace(/authorization[=:]\s*[a-zA-Z0-9_-]+/gi, 'authorization=[REDACTED]')
}

/**
 * Safe logging - ensures API keys are never logged
 */
export function safeLog(message: string, data?: any) {
  let safeMessage = message
  let safeData = data
  
  if (data) {
    safeData = JSON.parse(JSON.stringify(data)) // Deep clone
    safeData = sanitizeObject(safeData)
  }
  
  console.log(safeMessage, safeData || '')
}

/**
 * Sanitize object to remove API keys
 */
function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    if (typeof obj === 'string') {
      return sanitizeError({ message: obj })
    }
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item))
  }
  
  const sanitized: any = {}
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase()
    
    // Skip API key fields
    if (
      lowerKey.includes('apikey') ||
      lowerKey.includes('api_key') ||
      lowerKey.includes('authorization') ||
      lowerKey.includes('token') ||
      lowerKey.includes('secret') ||
      lowerKey === 'password'
    ) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof value === 'string' && value.match(/sk-[a-zA-Z0-9_-]{20,}/)) {
      // Check if value contains API key pattern
      sanitized[key] = '[API_KEY_REDACTED]'
    } else {
      sanitized[key] = sanitizeObject(value)
    }
  }
  
  return sanitized
}

/**
 * Check if string contains API key pattern
 */
export function containsAPIKey(str: string): boolean {
  if (!str) return false
  return /sk-[a-zA-Z0-9_-]{20,}/.test(str) || /Bearer\s+[a-zA-Z0-9_-]{20,}/.test(str)
}
