import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

/**
 * Create timestamp hash for data (prepares for OpenTimestamps)
 * 
 * This creates a SHA256 hash that can be used with OpenTimestamps
 * to prove data existed at a specific time using Bitcoin blockchain.
 * 
 * Full OpenTimestamps integration requires Python opentimestamps library
 * for blockchain submission. This endpoint creates the hash foundation.
 */
export async function POST(req: NextRequest) {
  try {
    const { data, type = 'text' } = await req.json()

    if (!data) {
      return NextResponse.json(
        { error: 'Data is required' },
        { status: 400 }
      )
    }

    // Create SHA256 hash of data (required for OpenTimestamps)
    const dataBuffer = typeof data === 'string' ? Buffer.from(data, 'utf-8') : Buffer.from(data)
    const hash = createHash('sha256').update(dataBuffer).digest('hex')
    const timestamp = new Date().toISOString()

    return NextResponse.json({
      success: true,
      hash: hash,
      timestamp: timestamp,
      type: type,
      message: 'Hash created successfully. This hash can be used with OpenTimestamps for blockchain proof.',
      instructions: 'To create full OpenTimestamps proof, submit this hash to an OpenTimestamps calendar server. The hash serves as proof that this data existed at the timestamp.',
    })
  } catch (error: any) {
    console.error('Timestamp error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create timestamp',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Verify OpenTimestamps proof
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const hash = searchParams.get('hash')

  if (!hash) {
    return NextResponse.json(
      { error: 'Hash is required' },
      { status: 400 }
    )
  }

  // Verification would require the proof file
  // For now, return hash info
  return NextResponse.json({
    hash: hash,
    message: 'To verify timestamp, provide the proof file from OpenTimestamps calendar',
  })
}
