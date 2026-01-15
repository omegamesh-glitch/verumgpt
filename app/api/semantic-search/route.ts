import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import crypto from 'crypto'

interface SearchResult {
  title: string
  url: string
  snippet: string
  score?: number
}

interface CachedResult {
  query: string
  results: SearchResult[]
  timestamp: number
  embedding?: number[]
}

// In-memory cache (in production, use Redis or similar)
const searchCache = new Map<string, CachedResult>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour
const MAX_CACHE_SIZE = 1000

/**
 * Semantic search using OpenAI embeddings
 * Similar to the Python code provided - uses embeddings for semantic similarity
 */
export async function POST(req: NextRequest) {
  try {
    const { query, documents, useEmbeddings = true } = await req.json()

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      )
    }

    // Check cache first
    const cacheKey = crypto.createHash('sha256').update(query.toLowerCase().trim()).digest('hex')
    const cached = searchCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`📦 Cache hit for query: ${query.substring(0, 50)}`)
      return NextResponse.json({
        success: true,
        query,
        results: cached.results,
        count: cached.results.length,
        cached: true,
      })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // If documents provided, use semantic search with embeddings
    if (documents && Array.isArray(documents) && documents.length > 0 && useEmbeddings) {
      try {
        console.log(`🔍 Semantic search: ${documents.length} documents`)
        
        // Generate embedding for query
        const queryEmbedding = await client.embeddings.create({
          model: 'text-embedding-3-small',
          input: query,
        })

        // Generate embeddings for documents (batch if needed)
        const docEmbeddings = await client.embeddings.create({
          model: 'text-embedding-3-small',
          input: documents,
        })

        // Calculate cosine similarity
        const queryVector = queryEmbedding.data[0].embedding
        const similarities = docEmbeddings.data.map((doc, index) => {
          const docVector = doc.embedding
          const similarity = cosineSimilarity(queryVector, docVector)
          return {
            index,
            similarity,
            document: documents[index],
          }
        })

        // Sort by similarity and return top results
        const topResults = similarities
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, 5)
          .map((item) => ({
            title: `Document ${item.index + 1}`,
            url: '',
            snippet: typeof item.document === 'string' ? item.document.substring(0, 200) : String(item.document),
            score: item.similarity,
          }))

        // Cache results
        const result: CachedResult = {
          query,
          results: topResults,
          timestamp: Date.now(),
          embedding: queryVector,
        }
        
        // Manage cache size
        if (searchCache.size >= MAX_CACHE_SIZE) {
          const oldestKey = Array.from(searchCache.keys())[0]
          searchCache.delete(oldestKey)
        }
        searchCache.set(cacheKey, result)

        return NextResponse.json({
          success: true,
          query,
          results: topResults,
          count: topResults.length,
          cached: false,
        })
      } catch (error: any) {
        console.error('❌ Semantic search error:', error)
        return NextResponse.json(
          { success: false, error: error?.message || 'Semantic search failed' },
          { status: 500 }
        )
      }
    }

    // Fallback to regular search
    return NextResponse.json({
      success: false,
      error: 'No documents provided for semantic search',
    }, { status: 400 })
  } catch (error: any) {
    console.error('❌ Semantic search API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || 'Failed to perform semantic search' 
      },
      { status: 500 }
    )
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}
