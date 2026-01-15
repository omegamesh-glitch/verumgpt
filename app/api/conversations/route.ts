import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

/**
 * OpenAI Conversations API
 * Manage conversation state across Response API calls
 */
export async function POST(req: NextRequest) {
  try {
    const { items = [], metadata = null } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Create conversation
    const conversation = await client.conversations.create({
      items: items.slice(0, 20), // Max 20 items
      metadata: metadata || undefined,
    })

    return NextResponse.json({
      success: true,
      conversation: {
        id: conversation.id,
        created_at: conversation.created_at,
        metadata: conversation.metadata,
      },
    })
  } catch (error: any) {
    console.error('Conversations API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error?.message || 'Failed to create conversation' 
      },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('id')

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID required' },
        { status: 400 }
      )
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Retrieve conversation
    const conversation = await client.conversations.retrieve(conversationId)

    return NextResponse.json({
      success: true,
      conversation: {
        id: conversation.id,
        created_at: conversation.created_at,
        metadata: conversation.metadata,
      },
    })
  } catch (error: any) {
    console.error('Get conversation error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error?.message || 'Failed to retrieve conversation' 
      },
      { status: 500 }
    )
  }
}
