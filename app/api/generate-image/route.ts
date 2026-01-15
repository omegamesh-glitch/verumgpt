import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getOpenAIKey, recordOpenAIError, resetOpenAIError } from '@/app/utils/openai-helper'

export async function POST(req: NextRequest) {
  try {
    const { 
      prompt, 
      model = 'gpt-image-1.5', // Use GPT Image 1.5 (best quality, production-ready)
      size = 'auto', // Auto size for GPT Image models
      quality = 'high', // High quality for best results (can use 'low' for faster generation)
      output_format = 'png', // PNG for transparency support
      background = 'auto', // Auto background
      n = 1, // Number of images (1-10)
    } = await req.json()

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const apiKey = getOpenAIKey()
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const isBackup = apiKey === process.env.OPENAI_API_KEY_BACKUP
    let openai = new OpenAI({ apiKey })

    // Use GPT Image 1.5 for best quality (following the prompting guide)
    try {
      const response = await openai.images.generate({
        model: 'gpt-image-1.5',
        prompt: prompt.trim(),
        size: size as 'auto' | '1024x1024' | '1536x1024' | '1024x1536',
        quality: quality as 'high' | 'medium' | 'low',
        output_format: output_format as 'png' | 'jpeg' | 'webp',
        background: background as 'auto' | 'transparent' | 'opaque',
        n: Math.min(Math.max(1, n), 10), // Between 1 and 10
      })

      resetOpenAIError() // Reset on success
      
      // GPT Image models return base64 encoded images
      const images = response.data || []
    
    if (images.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      )
    }

      // Return all generated images
      const result = {
        success: true,
        images: images.map((img) => ({
          b64_json: img.b64_json,
        })),
        prompt,
        size: response.size || size,
        quality: response.quality || quality,
        output_format: response.output_format || output_format,
        background: response.background || background,
        usage: response.usage, // Token usage for GPT Image models
      }

      return NextResponse.json(result)
    } catch (openaiError: any) {
      // Check if it's an API key/quota error and we haven't tried backup yet
      const isKeyError = 
        openaiError?.status === 401 || 
        openaiError?.status === 429 ||
        openaiError?.message?.includes('insufficient_quota') ||
        openaiError?.message?.includes('invalid_api_key')

      if (isKeyError && !isBackup && process.env.OPENAI_API_KEY_BACKUP) {
        console.log('🔄 OpenAI image generation primary key failed, trying backup key...')
        recordOpenAIError(apiKey)
        
        try {
          openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY_BACKUP })
          const backupResponse = await openai.images.generate({
            model: 'gpt-image-1.5',
            prompt: prompt.trim(),
            size: size as 'auto' | '1024x1024' | '1536x1024' | '1024x1536',
            quality: quality as 'high' | 'medium' | 'low',
            output_format: output_format as 'png' | 'jpeg' | 'webp',
            background: background as 'auto' | 'transparent' | 'opaque',
            n: Math.min(Math.max(1, n), 10),
          })
          
          console.log('✅ Successfully using backup OpenAI key for image generation')
          resetOpenAIError()
          
          const images = backupResponse.data || []
          const result = {
            success: true,
            images: images.map((img) => ({
              b64_json: img.b64_json,
            })),
            prompt,
            size: backupResponse.size || size,
            quality: backupResponse.quality || quality,
            output_format: backupResponse.output_format || output_format,
            background: backupResponse.background || background,
            usage: backupResponse.usage,
          }

          return NextResponse.json(result)
        } catch (backupError) {
          console.error('❌ Backup OpenAI key also failed for image generation:', backupError)
          throw backupError
        }
      }
      
      throw openaiError
    }
  } catch (error: any) {
    // SECURITY: Sanitize error to never expose API keys
    const errorMessage = error?.message || 'Unknown error'
    const sanitizedError = errorMessage
      .replace(/sk-[a-zA-Z0-9_-]{20,}/g, '[API_KEY_REDACTED]')
      .replace(/Bearer\s+[a-zA-Z0-9_-]+/g, 'Bearer [REDACTED]')
    console.error('Image generation error:', sanitizedError)
    return NextResponse.json(
      { error: sanitizedError || 'Failed to generate image' },
      { status: 500 }
    )
  }
}
