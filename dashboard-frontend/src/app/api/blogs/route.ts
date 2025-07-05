import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase'
import { z } from 'zod'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

const blogSchema = z.object({
  name: z.string().min(1),
  domain: z.string().min(1),
  niche: z.string().optional(),
  description: z.string().optional(),
  wordpress_config: z.object({
    api_url: z.string().url(),
    username: z.string(),
    app_password: z.string(),
  }).optional(),
  n8n_config: z.object({
    webhook_url: z.string().url().optional(),
    workflow_id: z.string().optional(),
  }).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServiceClient()
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const domain = searchParams.get('domain')
    
    let query = supabase
      .from('blogs')
      .select('*')
    
    if (active === 'true') {
      query = query.eq('is_active', true)
    }
    
    if (domain) {
      query = query.eq('domain', domain)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
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
    const validatedData = blogSchema.parse(body)
    
    const supabase = createSupabaseServiceClient()
    
    const { data, error } = await supabase
      .from('blogs')
      .insert({
        ...validatedData,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ data }, { status: 201 })
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