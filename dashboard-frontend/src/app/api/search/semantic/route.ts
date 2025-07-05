import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase'
import { z } from 'zod'
import OpenAI from 'openai'

const semanticSearchSchema = z.object({
  query: z.string().min(1),
  blog_id: z.string().uuid().optional(),
  similarity_threshold: z.number().min(0).max(1).default(0.7),
  limit: z.number().min(1).max(50).default(10),
})

let openai: OpenAI | null = null

// Initialize OpenAI only if API key is available
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

async function generateEmbedding(text: string): Promise<number[]> {
  if (!openai) {
    // Fallback: return a mock embedding for testing
    console.warn('OpenAI API key not configured, using mock embeddings')
    return new Array(1536).fill(0).map(() => Math.random())
  }

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    })

    return response.data[0].embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    // Fallback to mock embedding on error
    return new Array(1536).fill(0).map(() => Math.random())
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json()
    const validatedData = semanticSearchSchema.parse(body)
    
    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(validatedData.query)
    
    const supabase = createSupabaseServiceClient()
    
    // Perform vector similarity search using Supabase pgvector
    const { data: keywordMatches, error } = await supabase
      .rpc('match_keywords_semantic', {
        query_embedding: queryEmbedding,
        similarity_threshold: validatedData.similarity_threshold,
        match_count: validatedData.limit,
        target_blog_id: validatedData.blog_id,
      })
    
    if (error) {
      console.error('Supabase RPC error:', error)
      // Fallback to traditional search if vector search fails
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('main_keywords')
        .select(`
          *,
          keyword_variations (*)
        `)
        .ilike('keyword', `%${validatedData.query}%`)
        .limit(validatedData.limit)
      
      if (fallbackError) {
        return NextResponse.json({ error: fallbackError.message }, { status: 500 })
      }
      
      // Transform fallback data to match expected format
      const transformedData = fallbackData?.map(keyword => ({
        keyword: keyword.keyword,
        similarity: 0.8, // Mock similarity
        relevance_score: 75,
        search_volume: keyword.msv,
        competition: keyword.competition,
        search_intent: keyword.search_intent,
        related_topics: [],
        content_suggestions: [],
      })) || []
      
      return NextResponse.json({
        results: transformedData,
        query_embedding: queryEmbedding,
        total_found: transformedData.length,
        processing_time: (Date.now() - startTime) / 1000,
        fallback_used: true,
      })
    }
    
    const enhancedResults = await Promise.all(
      (keywordMatches || []).map(async (match: { keyword: string, search_intent: string, similarity: number, msv: number, competition: string }) => {
        // Generate content suggestions based on the keyword and search intent
        const contentSuggestions = generateContentSuggestions(
          match.keyword, 
          match.search_intent || 'informational'
        )
        
        // Extract related topics from the keyword context
        const relatedTopics = extractRelatedTopics(match.keyword, validatedData.query)
        
        return {
          keyword: match.keyword,
          similarity: match.similarity || 0.8,
          relevance_score: calculateRelevanceScore(match, validatedData.query),
          search_volume: match.msv,
          competition: match.competition,
          search_intent: match.search_intent,
          related_topics: relatedTopics,
          content_suggestions: contentSuggestions,
        }
      })
    )
    
    const processingTime = (Date.now() - startTime) / 1000
    
    return NextResponse.json({
      results: enhancedResults,
      query_embedding: queryEmbedding,
      total_found: enhancedResults.length,
      processing_time: processingTime,
    })
  } catch (error) {
    console.error('Semantic search error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateRelevanceScore(match: { similarity: number, keyword: string, msv: number }, originalQuery: string): number {
  let score = 60 // Base score
  
  // Boost score based on similarity
  if (match.similarity) {
    score += (match.similarity * 30)
  }
  
  // Boost if keyword contains query words
  const queryWords = originalQuery.toLowerCase().split(' ')
  const keywordWords = match.keyword.toLowerCase().split(' ')
  const matchingWords = queryWords.filter(word => 
    keywordWords.some((kw: string) => kw.includes(word) || word.includes(kw))
  )
  
  score += (matchingWords.length / queryWords.length) * 10
  
  // Boost based on search volume
  if (match.msv) {
    if (match.msv > 10000) score += 5
    else if (match.msv > 1000) score += 3
    else if (match.msv > 100) score += 1
  }
  
  return Math.min(Math.round(score), 100)
}

function extractRelatedTopics(keyword: string, originalQuery: string): string[] {
  const topics: string[] = []
  
  // Extract nouns and important words from both keyword and query
  const words = [...keyword.split(' '), ...originalQuery.split(' ')]
    .filter(word => word.length > 3)
    .map(word => word.toLowerCase())
  
  // Remove common stop words
  const stopWords = ['para', 'como', 'sobre', 'com', 'sem', 'mais', 'menos', 'muito', 'pouco']
  const filteredWords = words.filter(word => !stopWords.includes(word))
  
  // Get unique words as topics
  const uniqueWords = [...new Set(filteredWords)]
  topics.push(...uniqueWords.slice(0, 5))
  
  return topics
}

function generateContentSuggestions(keyword: string, searchIntent: string): string[] {
  const suggestions: string[] = []
  
  switch (searchIntent) {
    case 'informational':
      suggestions.push(
        `Guia completo sobre ${keyword}`,
        `${keyword}: o que você precisa saber`,
        `Dicas essenciais de ${keyword}`,
        `Como dominar ${keyword}`
      )
      break
      
    case 'commercial':
      suggestions.push(
        `Melhores opções de ${keyword}`,
        `${keyword}: comparação e análise`,
        `Como escolher ${keyword}`,
        `${keyword} vale a pena?`
      )
      break
      
    case 'transactional':
      suggestions.push(
        `Onde comprar ${keyword}`,
        `${keyword}: preços e promoções`,
        `Comprar ${keyword} online`,
        `${keyword} com desconto`
      )
      break
      
    default:
      suggestions.push(
        `Tudo sobre ${keyword}`,
        `${keyword}: dicas e truques`,
        `Como usar ${keyword}`,
        `Benefícios de ${keyword}`
      )
  }
  
  return suggestions.slice(0, 3)
}

export async function GET() {
  return NextResponse.json(
    { 
      error: 'Method not allowed. Use POST for semantic search.' 
    }, 
    { status: 405 }
  )
}