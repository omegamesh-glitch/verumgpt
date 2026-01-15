import { NextRequest, NextResponse } from 'next/server'

interface SearchResult {
  title: string
  url: string
  snippet: string
}

/**
 * Intelligent web search using DuckDuckGo
 * No API key required - uses DuckDuckGo's HTML interface
 */
export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      )
    }

    console.log(`🔍 Searching web for: ${query}`)

    // Use DuckDuckGo Instant Answer API (free, no API key)
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    
    try {
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; VERUM-AI/1.0)',
        },
        signal: AbortSignal.timeout(10000), // 10s timeout
      })

      if (!response.ok) {
        throw new Error(`DuckDuckGo API returned ${response.status}`)
      }

      const data = await response.json()

      const results: SearchResult[] = []

      // Extract instant answer if available
      if (data.AbstractText) {
        results.push({
          title: data.Heading || data.AbstractSource || 'Instant Answer',
          url: data.AbstractURL || '',
          snippet: data.AbstractText,
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
            })
          }
        })
      }

      // Extract results from HTML search if instant answer is not enough
      if (results.length < 3) {
        try {
          const htmlSearchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
          const htmlResponse = await fetch(htmlSearchUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; VERUM-AI/1.0)',
            },
            signal: AbortSignal.timeout(10000),
          })

          if (htmlResponse.ok) {
            const html = await htmlResponse.text()
            
            // Simple HTML parsing for DuckDuckGo results
            const resultPattern = /<a class="result__a"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g
            const snippetPattern = /<a class="result__snippet"[^>]*>([^<]*)<\/a>/g
            
            const links: string[] = []
            const titles: string[] = []
            const snippets: string[] = []

            let match
            while ((match = resultPattern.exec(html)) !== null && links.length < 5) {
              links.push(match[1])
              titles.push(match[2])
            }

            const snippetMatch = html.match(/<a class="result__snippet"[^>]*>([^<]*)<\/a>/g)
            if (snippetMatch) {
              snippetMatch.slice(0, 5).forEach((snippet) => {
                const text = snippet.replace(/<[^>]*>/g, '').trim()
                if (text) snippets.push(text)
              })
            }

            // Combine results
            for (let i = 0; i < Math.min(links.length, 5); i++) {
              if (links[i] && titles[i]) {
                results.push({
                  title: titles[i],
                  url: links[i],
                  snippet: snippets[i] || titles[i],
                })
              }
            }
          }
        } catch (htmlError) {
          console.warn('HTML search fallback failed:', htmlError)
        }
      }

      // Fallback: Use a simple web search API if DuckDuckGo fails
      if (results.length === 0) {
        // Try alternative approach using DuckDuckGo's search endpoint
        const altUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&ia=web`
        results.push({
          title: `Search results for: ${query}`,
          url: altUrl,
          snippet: `Click to view search results for "${query}" on DuckDuckGo`,
        })
      }

      console.log(`✅ Found ${results.length} search results`)

      return NextResponse.json({
        success: true,
        query,
        results: results.slice(0, 5), // Limit to 5 results
        count: results.length,
      })
    } catch (error: any) {
      console.error('❌ Web search error:', error)
      
      // Return a fallback result
      return NextResponse.json({
        success: true,
        query,
        results: [{
          title: `Search: ${query}`,
          url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
          snippet: `Web search for "${query}" - please check DuckDuckGo directly`,
        }],
        count: 1,
        warning: 'Search API had issues, returning fallback result',
      })
    }
  } catch (error: any) {
    console.error('❌ Web search API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || 'Failed to perform web search' 
      },
      { status: 500 }
    )
  }
}
