/**
 * Crypto Helper - Encryption/Decryption utilities for VERUM Node
 * 
 * Uses Node.js built-in crypto module (secure and fast)
 */

import { createCipheriv, createDecipheriv, randomBytes, createHash, pbkdf2Sync } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16 // 16 bytes for AES
const SALT_LENGTH = 64
const TAG_LENGTH = 16
const KEY_LENGTH = 32 // 32 bytes = 256 bits for AES-256
const ITERATIONS = 100000 // PBKDF2 iterations

/**
 * Generate encryption key from password
 */
function deriveKey(password: string, salt: Buffer): Buffer {
  return pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha256')
}

/**
 * Encrypt data using AES-256-GCM
 * 
 * @param text - Plain text to encrypt
 * @param password - Password for encryption (will be hashed)
 * @returns Encrypted data as base64 string (format: salt:iv:tag:encrypted)
 */
export function encrypt(text: string, password: string): string {
  try {
    // Generate random salt and IV
    const salt = randomBytes(SALT_LENGTH)
    const iv = randomBytes(IV_LENGTH)
    
    // Derive key from password
    const key = deriveKey(password, salt)
    
    // Create cipher
    const cipher = createCipheriv(ALGORITHM, key, iv)
    
    // Encrypt
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    // Get authentication tag
    const tag = cipher.getAuthTag()
    
    // Combine: salt:iv:tag:encrypted (all hex encoded)
    const result = [
      salt.toString('hex'),
      iv.toString('hex'),
      tag.toString('hex'),
      encrypted
    ].join(':')
    
    return result
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Decrypt data encrypted with encrypt()
 * 
 * @param encryptedData - Encrypted data (format: salt:iv:tag:encrypted)
 * @param password - Password used for encryption
 * @returns Decrypted plain text
 */
export function decrypt(encryptedData: string, password: string): string {
  try {
    // Split encrypted data
    const parts = encryptedData.split(':')
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted data format')
    }
    
    const [saltHex, ivHex, tagHex, encrypted] = parts
    
    // Convert hex strings to buffers
    const salt = Buffer.from(saltHex, 'hex')
    const iv = Buffer.from(ivHex, 'hex')
    const tag = Buffer.from(tagHex, 'hex')
    
    // Derive key from password (same as encryption)
    const key = deriveKey(password, salt)
    
    // Create decipher
    const decipher = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(tag)
    
    // Decrypt
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Invalid password or corrupted data'}`)
  }
}

/**
 * Hash data using SHA-256
 * 
 * @param data - Data to hash
 * @returns SHA-256 hash as hex string
 */
export function hash(data: string): string {
  return createHash('sha256').update(data, 'utf8').digest('hex')
}

/**
 * Generate random secure key
 * 
 * @param length - Key length in bytes (default: 32 = 256 bits)
 * @returns Random key as hex string
 */
export function generateKey(length: number = 32): string {
  return randomBytes(length).toString('hex')
}

/**
 * Hash password securely (for storage)
 * Uses PBKDF2 with SHA-256
 * 
 * @param password - Password to hash
 * @param salt - Optional salt (will generate if not provided)
 * @returns Object with hash and salt (both hex strings)
 */
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const saltBuffer = salt ? Buffer.from(salt, 'hex') : randomBytes(SALT_LENGTH)
  const hash = pbkdf2Sync(password, saltBuffer, ITERATIONS, KEY_LENGTH, 'sha256')
  
  return {
    hash: hash.toString('hex'),
    salt: saltBuffer.toString('hex'),
  }
}

/**
 * Verify password against hash
 * 
 * @param password - Password to verify
 * @param hash - Stored hash (hex string)
 * @param salt - Stored salt (hex string)
 * @returns True if password matches
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const result = hashPassword(password, salt)
    return result.hash === hash
  } catch {
    return false
  }
}

/**
 * Encrypt JSON object
 */
export function encryptJSON<T extends object>(obj: T, password: string): string {
  const jsonString = JSON.stringify(obj)
  return encrypt(jsonString, password)
}

/**
 * Decrypt JSON object
 */
export function decryptJSON<T extends object>(encryptedData: string, password: string): T {
  const decrypted = decrypt(encryptedData, password)
  return JSON.parse(decrypted) as T
}
