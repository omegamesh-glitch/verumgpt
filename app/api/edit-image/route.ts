import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const prompt = formData.get('prompt') as string
    const images = formData.getAll('images') as File[]
    const input_fidelity = formData.get('input_fidelity') as string || 'low'
    const quality = formData.get('quality') as string || 'high'
    const output_format = formData.get('output_format') as string || 'png'
    const background = formData.get('background') as string || 'auto'

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Convert File objects to the format expected by OpenAI
    const imageFiles = await Promise.all(
      images.map(async (file) => {
        const buffer = await file.arrayBuffer()
        return new File([buffer], file.name, { type: file.type })
      })
    )

    // Use GPT Image 1.5 for editing (following the prompting guide)
    const response = await openai.images.edit({
      model: 'gpt-image-1.5',
      image: imageFiles,
      prompt: prompt.trim(),
      input_fidelity: input_fidelity as 'high' | 'low',
      quality: quality as 'high' | 'medium' | 'low',
      output_format: output_format as 'png' | 'jpeg' | 'webp',
      background: background as 'auto' | 'transparent' | 'opaque',
      n: 1,
    })

    const imageData = response.data?.[0]
    
    if (!imageData || !imageData.b64_json) {
      return NextResponse.json(
        { error: 'Failed to edit image' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      imageData: imageData.b64_json,
      prompt,
      size: response.size,
      quality: response.quality,
      output_format: response.output_format,
      background: response.background,
      usage: response.usage,
    })
  } catch (error: any) {
    console.error('Image edit error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to edit image' },
      { status: 500 }
    )
  }
}
