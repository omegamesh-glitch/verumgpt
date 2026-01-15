import { NextRequest, NextResponse } from 'next/server'
// @ts-ignore - pdf-parse doesn't have types
import pdfParse from 'pdf-parse'

// Limites otimizados para Railway Pro (32GB RAM)
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB (aumentado de 10MB)
const MAX_PAGES = 1000 // Aumentado de 100 para 1000 páginas
const MAX_CONCURRENT_PDFS = 10 // Processar até 10 PDFs simultaneamente

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('pdf') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload a PDF file.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    console.log(`📄 Processing PDF: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const data = await pdfParse(buffer)
    
    // Validate page count
    if (data.numpages > MAX_PAGES) {
      return NextResponse.json(
        { success: false, error: `PDF has too many pages (${data.numpages}). Maximum is ${MAX_PAGES} pages.` },
        { status: 400 }
      )
    }

    const text = data.text.trim()

    if (!text || text.length === 0) {
      return NextResponse.json(
        { success: false, error: 'PDF appears to be empty or contains no extractable text.' },
        { status: 400 }
      )
    }

    console.log(`✅ PDF processed: ${data.numpages} pages, ${text.length} characters (${(text.length / 1024).toFixed(2)}KB text)`)
    
    // Informações adicionais para Railway Pro
    const memoryUsage = process.memoryUsage()
    console.log(`💾 Memory: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB / ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`)

    return NextResponse.json({
      success: true,
      text: text,
      pages: data.numpages,
      info: {
        title: data.info?.Title || file.name,
        author: data.info?.Author || 'Unknown',
        pages: data.numpages,
        size: file.size,
      },
    })
  } catch (error: any) {
    console.error('❌ PDF upload error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || 'Failed to process PDF. The file may be corrupted or password-protected.' 
      },
      { status: 500 }
    )
  }
}
