import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase'
import { z } from 'zod'

const keywordSchema = z.object({
  blog_id: z.string().uuid(),
  keyword: z.string().min(1),
  search_volume: z.number().optional(),
  keyword_difficulty: z.number().min(0).max(100).optional(),
  cpc: z.number().optional(),
  competition: z.enum(['low', 'medium', 'high']).optional(),
  search_intent: z.enum(['informational', 'navigational', 'transactional', 'commercial']).optional(),
  language: z.string().default('en'),
  country: z.string().default('US'),
  variations: z.array(z.string()).optional(),
  related_keywords: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const blogId = searchParams.get('blog_id')
    const search = searchParams.get('search')
    const intent = searchParams.get('intent')
    const competition = searchParams.get('competition')
    const minVolume = searchParams.get('min_volume')
    const maxDifficulty = searchParams.get('max_difficulty')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    const supabase = createSupabaseServiceClient()
    
    let query = supabase
      .from('main_keywords')
      .select(`
        *,
        keyword_variations (
          variation,
          search_volume,
          difficulty
        ),
        blogs (
          name,
          url
        )
      `)
    
    if (blogId) {
      query = query.eq('blog_id', blogId)
    }
    
    if (search) {
      query = query.ilike('keyword', `%${search}%`)
    }
    
    if (intent) {
      query = query.eq('search_intent', intent)
    }
    
    if (competition) {
      query = query.eq('competition', competition)
    }
    
    if (minVolume) {
      query = query.gte('search_volume', parseInt(minVolume))
    }
    
    if (maxDifficulty) {
      query = query.lte('keyword_difficulty', parseInt(maxDifficulty))
    }
    
    const { data, error } = await query
      .order('search_volume', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = keywordSchema.parse(body)
    
    const supabase = createSupabaseServiceClient()
    
    // Check if keyword already exists for this blog
    const { data: existingKeyword } = await supabase
      .from('main_keywords')
      .select('id')
      .eq('blog_id', validatedData.blog_id)
      .eq('keyword', validatedData.keyword)
      .single()
    
    if (existingKeyword) {
      return NextResponse.json(
        { error: 'Keyword already exists for this blog' },
        { status: 409 }
      )
    }
    
    // Calculate opportunity score if we have the required data
    let opportunityScore = null
    if (validatedData.search_volume && validatedData.keyword_difficulty && validatedData.cpc) {
      const { data: score } = await supabase.rpc('calculate_keyword_opportunity_score', {
        msv: validatedData.search_volume,
        kw_difficulty: validatedData.keyword_difficulty,
        cpc: validatedData.cpc,
      })
      opportunityScore = score
    }
    
    // Insert main keyword
    const { data: keyword, error: keywordError } = await supabase
      .from('main_keywords')
      .insert({
        ...validatedData,
        opportunity_score: opportunityScore,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()
    
    if (keywordError) {
      return NextResponse.json({ error: keywordError.message }, { status: 500 })
    }
    
    // Insert variations if provided
    if (validatedData.variations && validatedData.variations.length > 0) {
      const variations = validatedData.variations.map((variation) => ({
        main_keyword_id: keyword.id,
        variation,
        search_volume: null,
        difficulty: null,
        created_at: new Date().toISOString(),
      }))
      
      await supabase
        .from('keyword_variations')
        .insert(variations)
    }
    
    return NextResponse.json({ data: keyword }, { status: 201 })
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