import { NextRequest, NextResponse } from 'next/server'
// @ts-ignore - pdf-parse doesn't have types
import pdfParse from 'pdf-parse'

// Limites para processamento em lote (Railway Pro - 32GB RAM)
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const MAX_PAGES = 1000
const MAX_BATCH_SIZE = 10 // Processar até 10 PDFs simultaneamente

interface PDFResult {
  filename: string
  success: boolean
  text?: string
  pages?: number
  error?: string
  info?: any
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('pdfs') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      )
    }

    if (files.length > MAX_BATCH_SIZE) {
      return NextResponse.json(
        { success: false, error: `Too many files. Maximum is ${MAX_BATCH_SIZE} files per batch.` },
        { status: 400 }
      )
    }

    console.log(`📚 Processing batch of ${files.length} PDFs...`)

    // Processar PDFs em paralelo (aproveitando 32 vCPU)
    const results: PDFResult[] = await Promise.all(
      files.map(async (file): Promise<PDFResult> => {
        try {
          // Validar tipo
          if (file.type !== 'application/pdf') {
            return {
              filename: file.name,
              success: false,
              error: 'Invalid file type. Please upload a PDF file.',
            }
          }

          // Validar tamanho
          if (file.size > MAX_FILE_SIZE) {
            return {
              filename: file.name,
              success: false,
              error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
            }
          }

          const arrayBuffer = await file.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          const data = await pdfParse(buffer)

          // Validar número de páginas
          if (data.numpages > MAX_PAGES) {
            return {
              filename: file.name,
              success: false,
              error: `PDF has too many pages (${data.numpages}). Maximum is ${MAX_PAGES} pages.`,
            }
          }

          const text = data.text.trim()

          if (!text || text.length === 0) {
            return {
              filename: file.name,
              success: false,
              error: 'PDF appears to be empty or contains no extractable text.',
            }
          }

          return {
            filename: file.name,
            success: true,
            text: text,
            pages: data.numpages,
            info: {
              title: data.info?.Title || file.name,
              author: data.info?.Author || 'Unknown',
              pages: data.numpages,
              size: file.size,
            },
          }
        } catch (error: any) {
          return {
            filename: file.name,
            success: false,
            error: error?.message || 'Failed to process PDF',
          }
        }
      })
    )

    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    console.log(`✅ Batch processed: ${successful} successful, ${failed} failed`)

    return NextResponse.json({
      success: true,
      total: files.length,
      successful,
      failed,
      results,
    })
  } catch (error: any) {
    console.error('❌ Batch PDF upload error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to process PDF batch',
      },
      { status: 500 }
    )
  }
}
