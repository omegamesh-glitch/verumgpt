import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

interface SearchResult {
  title: string
  url: string
  snippet: string
  source: 'duckduckgo' | 'google' | 'bing'
}

interface CachedSearch {
  query: string
  results: SearchResult[]
  timestamp: number
}

// In-memory cache for search results
const searchCache = new Map<string, CachedSearch>()
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes
const MAX_CACHE_SIZE = 500

/**
 * Enhanced web search with multiple sources and caching
 * Supports DuckDuckGo, Google (via SerpAPI if configured), and Bing
 */
export async function POST(req: NextRequest) {
  try {
    const { query, sources = ['duckduckgo'], useCache = true } = await req.json()

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      )
    }

    // Check cache first
    const cacheKey = crypto.createHash('sha256').update(query.toLowerCase().trim()).digest('hex')
    if (useCache) {
      const cached = searchCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`📦 Cache hit for: ${query.substring(0, 50)}`)
        return NextResponse.json({
          success: true,
          query,
          results: cached.results,
          count: cached.results.length,
          cached: true,
          sources: Array.from(new Set(cached.results.map(r => r.source))),
        })
      }
    }

    console.log(`🔍 Enhanced search: ${query.substring(0, 100)}`)

    const allResults: SearchResult[] = []
    const sourcePromises: Promise<SearchResult[]>[] = []

    // Search DuckDuckGo (always available, no API key)
    if (sources.includes('duckduckgo')) {
      sourcePromises.push(searchDuckDuckGo(query))
    }

    // Search Google (if API key configured)
    if (sources.includes('google') && process.env.GOOGLE_SEARCH_API_KEY) {
      sourcePromises.push(searchGoogle(query))
    }

    // Search Bing (if API key configured)
    if (sources.includes('bing') && process.env.BING_SEARCH_API_KEY) {
      sourcePromises.push(searchBing(query))
    }

    // Execute all searches in parallel
    const results = await Promise.allSettled(sourcePromises)
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allResults.push(...result.value)
      } else {
        console.warn(`Search source ${index} failed:`, result.reason)
      }
    })

    // Remove duplicates and sort by relevance
    const uniqueResults = deduplicateResults(allResults)
    const finalResults = uniqueResults.slice(0, 10) // Top 10 results

    // Cache results
    if (useCache && finalResults.length > 0) {
      if (searchCache.size >= MAX_CACHE_SIZE) {
        // Remove oldest entry
        const oldestKey = Array.from(searchCache.keys())[0]
        searchCache.delete(oldestKey)
      }
      
      searchCache.set(cacheKey, {
        query,
        results: finalResults,
        timestamp: Date.now(),
      })
    }

    console.log(`✅ Found ${finalResults.length} results from ${Array.from(new Set(finalResults.map(r => r.source))).join(', ')}`)

    return NextResponse.json({
      success: true,
      query,
      results: finalResults,
      count: finalResults.length,
      cached: false,
      sources: Array.from(new Set(finalResults.map(r => r.source))),
    })
  } catch (error: any) {
    console.error('❌ Enhanced web search error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || 'Failed to perform web search' 
      },
      { status: 500 }
    )
  }
}

/**
 * Search DuckDuckGo (free, no API key)
 */
async function searchDuckDuckGo(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = []
  
  try {
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VERUM-AI/1.0)',
      },
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      throw new Error(`DuckDuckGo API returned ${response.status}`)
    }

    const data = await response.json()

    // Extract instant answer
    if (data.AbstractText) {
      results.push({
        title: data.Heading || data.AbstractSource || 'Instant Answer',
        url: data.AbstractURL || '',
        snippet: data.AbstractText,
        source: 'duckduckgo',
      })
    }

    // Extract related topics
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      data.RelatedTopics.slice(0, 5).forEach((topic: any) => {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(' - ')[0] || topic.Text.substring(0, 60),
            url: topic.FirstURL,
            snippet: topic.Text,
            source: 'duckduckgo',
          })
        }
      })
    }

    // HTML fallback for more results
    if (results.length < 5) {
      try {
        const htmlUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
        const htmlResponse = await fetch(htmlUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; VERUM-AI/1.0)',
          },
          signal: AbortSignal.timeout(8000),
        })

        if (htmlResponse.ok) {
          const html = await htmlResponse.text()
          const resultPattern = /<a class="result__a"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g
          
          let match
          let count = 0
          while ((match = resultPattern.exec(html)) !== null && count < 5) {
            results.push({
              title: match[2],
              url: match[1],
              snippet: match[2],
              source: 'duckduckgo',
            })
            count++
          }
        }
      } catch (htmlError) {
        console.warn('DuckDuckGo HTML fallback failed:', htmlError)
      }
    }
  } catch (error) {
    console.error('DuckDuckGo search error:', error)
  }

  return results.slice(0, 5)
}

/**
 * Search Google (requires SerpAPI key)
 */
async function searchGoogle(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = []
  
  try {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY || process.env.SERPAPI_KEY
    if (!apiKey) {
      return results
    }

    const searchUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${apiKey}&num=5`
    
    const response = await fetch(searchUrl, {
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`Google Search API returned ${response.status}`)
    }

    const data = await response.json()

    if (data.organic_results && Array.isArray(data.organic_results)) {
      data.organic_results.forEach((result: any) => {
        results.push({
          title: result.title || '',
          url: result.link || '',
          snippet: result.snippet || result.title || '',
          source: 'google',
        })
      })
    }
  } catch (error) {
    console.error('Google search error:', error)
  }

  return results
}

/**
 * Search Bing (requires Bing Search API key)
 */
async function searchBing(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = []
  
  try {
    const apiKey = process.env.BING_SEARCH_API_KEY
    if (!apiKey) {
      return results
    }

    const searchUrl = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=5`
    
    const response = await fetch(searchUrl, {
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`Bing Search API returned ${response.status}`)
    }

    const data = await response.json()

    if (data.webPages && data.webPages.value && Array.isArray(data.webPages.value)) {
      data.webPages.value.forEach((result: any) => {
        results.push({
          title: result.name || '',
          url: result.url || '',
          snippet: result.snippet || result.name || '',
          source: 'bing',
        })
      })
    }
  } catch (error) {
    console.error('Bing search error:', error)
  }

  return results
}

/**
 * Remove duplicate results based on URL
 */
function deduplicateResults(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>()
  const unique: SearchResult[] = []

  for (const result of results) {
    const url = result.url.toLowerCase().replace(/\/$/, '') // Normalize URLs
    if (!seen.has(url)) {
      seen.add(url)
      unique.push(result)
    }
  }

  return unique
}
