import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase'
import { z } from 'zod'

const vectorSearchSchema = z.object({
  query: z.string().min(1),
  type: z.enum(['keywords', 'content']).default('keywords'),
  blog_id: z.string().uuid().optional(),
  match_threshold: z.number().min(0).max(1).default(0.8),
  match_count: z.number().min(1).max(50).default(10),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = vectorSearchSchema.parse(body)
    
    const supabase = createSupabaseServiceClient()
    
    // First, we need to generate an embedding for the search query
    // In a real implementation, you'd use OpenAI's embedding API
    // For now, we'll simulate with a placeholder embedding
    const queryEmbedding = new Array(1536).fill(0).map(() => Math.random())
    
    if (validatedData.type === 'keywords') {
      // Search for similar keywords using vector similarity
      const { data, error } = await supabase.rpc('match_keywords_semantic', {
        query_embedding: JSON.stringify(queryEmbedding),
        match_threshold: validatedData.match_threshold,
        match_count: validatedData.match_count,
      })
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({
        data,
        query: validatedData.query,
        type: 'keywords',
        match_threshold: validatedData.match_threshold,
      })
    } else {
      // Search for similar content posts (using same function as keywords for now)
      const { data, error } = await supabase.rpc('match_keywords_semantic', {
        query_embedding: JSON.stringify(queryEmbedding),
        match_threshold: validatedData.match_threshold,
        match_count: validatedData.match_count,
      })
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({
        data,
        query: validatedData.query,
        type: 'content',
        match_threshold: validatedData.match_threshold,
      })
    }
  } catch (error) {
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const type = searchParams.get('type') || 'keywords'
    const blogId = searchParams.get('blog_id')
    const matchThreshold = parseFloat(searchParams.get('match_threshold') || '0.8')
    const matchCount = parseInt(searchParams.get('match_count') || '10')
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }
    
    const validatedData = vectorSearchSchema.parse({
      query,
      type,
      blog_id: blogId,
      match_threshold: matchThreshold,
      match_count: matchCount,
    })
    
    // Perform the same search logic as POST
    const supabase = createSupabaseServiceClient()
    const queryEmbedding = new Array(1536).fill(0).map(() => Math.random())
    
    if (validatedData.type === 'keywords') {
      const { data, error } = await supabase.rpc('match_keywords_semantic', {
        query_embedding: JSON.stringify(queryEmbedding),
        match_threshold: validatedData.match_threshold,
        match_count: validatedData.match_count,
      })
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({
        data,
        query: validatedData.query,
        type: 'keywords',
        match_threshold: validatedData.match_threshold,
      })
    } else {
      const { data, error } = await supabase.rpc('match_keywords_semantic', {
        query_embedding: JSON.stringify(queryEmbedding),
        match_threshold: validatedData.match_threshold,
        match_count: validatedData.match_count,
      })
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({
        data,
        query: validatedData.query,
        type: 'content',
        match_threshold: validatedData.match_threshold,
      })
    }
  } catch (error) {
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