import { NextRequest, NextResponse } from 'next/server'
import { encrypt, decrypt, hash, generateKey } from '@/app/utils/crypto-helper'

/**
 * Encryption/Decryption API endpoint
 * 
 * POST /api/encrypt
 * Body: { action: 'encrypt' | 'decrypt' | 'hash', data: string, password?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { action, data, password } = await req.json()

    if (!data) {
      return NextResponse.json(
        { error: 'Data is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'encrypt':
        if (!password) {
          return NextResponse.json(
            { error: 'Password is required for encryption' },
            { status: 400 }
          )
        }
        try {
          const encrypted = encrypt(data, password)
          return NextResponse.json({
            success: true,
            encrypted: encrypted,
            message: 'Data encrypted successfully',
          })
        } catch (error: any) {
          return NextResponse.json(
            { error: error.message || 'Encryption failed' },
            { status: 500 }
          )
        }

      case 'decrypt':
        if (!password) {
          return NextResponse.json(
            { error: 'Password is required for decryption' },
            { status: 400 }
          )
        }
        try {
          const decrypted = decrypt(data, password)
          return NextResponse.json({
            success: true,
            decrypted: decrypted,
            message: 'Data decrypted successfully',
          })
        } catch (error: any) {
          return NextResponse.json(
            { error: error.message || 'Decryption failed' },
            { status: 500 }
          )
        }

      case 'hash':
        try {
          const hashed = hash(data)
          return NextResponse.json({
            success: true,
            hash: hashed,
            algorithm: 'SHA-256',
            message: 'Data hashed successfully',
          })
        } catch (error: any) {
          return NextResponse.json(
            { error: error.message || 'Hashing failed' },
            { status: 500 }
          )
        }

      case 'generate-key':
        try {
          const key = generateKey()
          return NextResponse.json({
            success: true,
            key: key,
            length: 32,
            message: 'Key generated successfully',
          })
        } catch (error: any) {
          return NextResponse.json(
            { error: error.message || 'Key generation failed' },
            { status: 500 }
          )
        }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: encrypt, decrypt, hash, or generate-key' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('Crypto API error:', error)
    return NextResponse.json(
      { 
        error: 'Invalid request',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
