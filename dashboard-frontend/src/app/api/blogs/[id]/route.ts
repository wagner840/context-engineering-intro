import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase'
import { z } from 'zod'

const updateBlogSchema = z.object({
  name: z.string().min(1).optional(),
  url: z.string().url().optional(),
  niche: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServiceClient()
    
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
      }
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateBlogSchema.parse(body)
    
    const supabase = createSupabaseServiceClient()
    
    const { data, error } = await supabase
      .from('blogs')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ data })
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServiceClient()
    
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', params.id)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}