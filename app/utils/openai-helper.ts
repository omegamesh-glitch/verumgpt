/**
 * OpenAI API Key Helper with Automatic Fallback
 * 
 * Features:
 * 1. Automatic fallback: If primary key fails, uses backup key
 * 2. Manual override: Set OPENAI_USE_BACKUP=true to force backup key
 * 3. Error handling: Returns the best available key
 */

let lastErrorKey: string | null = null
let errorCount = 0
const ERROR_THRESHOLD = 3 // Switch to backup after 3 consecutive errors

export function getOpenAIKey(): string {
  // Manual override: force backup key
  if (process.env.OPENAI_USE_BACKUP === 'true') {
    return process.env.OPENAI_API_KEY_BACKUP || process.env.OPENAI_API_KEY || ''
  }

  // If primary key had errors recently, use backup
  if (lastErrorKey === process.env.OPENAI_API_KEY && errorCount >= ERROR_THRESHOLD) {
    console.log('🔄 Using backup OpenAI key due to recent errors')
    return process.env.OPENAI_API_KEY_BACKUP || process.env.OPENAI_API_KEY || ''
  }

  // Default: use primary key
  // SECURITY: Never log or expose the actual key value
  return process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_BACKUP || ''
}

/**
 * Record an error for the current key to enable automatic fallback
 */
export function recordOpenAIError(apiKey: string) {
  if (apiKey === process.env.OPENAI_API_KEY) {
    lastErrorKey = apiKey
    errorCount++
    console.log(`⚠️ OpenAI primary key error (${errorCount}/${ERROR_THRESHOLD})`)
    
    // Reset after some time (15 minutes)
    if (errorCount >= ERROR_THRESHOLD) {
      setTimeout(() => {
        errorCount = 0
        lastErrorKey = null
        console.log('✅ Resetting OpenAI key error counter')
      }, 15 * 60 * 1000)
    }
  }
}

/**
 * Reset error counter (call on success)
 */
export function resetOpenAIError() {
  if (errorCount > 0) {
    errorCount = 0
    lastErrorKey = null
  }
}

/**
 * Create OpenAI client with automatic fallback on errors
 */
export async function createOpenAIClientWithFallback() {
  const OpenAI = (await import('openai')).default
  let apiKey = getOpenAIKey()
  let isBackup = apiKey === process.env.OPENAI_API_KEY_BACKUP

  return {
    client: new OpenAI({ apiKey }),
    apiKey,
    isBackup,
    // Wrapper method that automatically falls back on error
    async executeWithFallback<T>(
      operation: (client: typeof OpenAI.prototype) => Promise<T>
    ): Promise<T> {
      try {
        const client = new OpenAI({ apiKey })
        const result = await operation(client)
        resetOpenAIError() // Reset on success
        return result
      } catch (error: any) {
        // Check if it's an API key/quota error
        const isKeyError = 
          error?.status === 401 || 
          error?.status === 429 ||
          error?.message?.includes('insufficient_quota') ||
          error?.message?.includes('invalid_api_key') ||
          error?.message?.includes('You exceeded your current quota')

        if (isKeyError && !isBackup && process.env.OPENAI_API_KEY_BACKUP) {
          console.log('🔄 OpenAI primary key failed, trying backup key...')
          recordOpenAIError(apiKey)
          
          // Retry with backup key
          apiKey = process.env.OPENAI_API_KEY_BACKUP
          isBackup = true
          const backupClient = new OpenAI({ apiKey })
          
          try {
            const result = await operation(backupClient)
            console.log('✅ Successfully using backup OpenAI key')
            return result
          } catch (backupError) {
            console.error('❌ Backup OpenAI key also failed:', backupError)
            throw backupError // Both keys failed
          }
        }
        
        // Not a key error or backup also failed, throw original error
        throw error
      }
    }
  }
}
