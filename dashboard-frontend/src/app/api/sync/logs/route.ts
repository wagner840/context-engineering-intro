import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const blogId = searchParams.get('blog_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!blogId) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 })
    }

    const supabase = createSupabaseServiceClient()

    const { data, error } = await supabase
      .from('sync_logs')
      .select('*')
      .eq('blog_id', blogId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching sync logs:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Sync logs API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { blog_id, sync_type, status, details } = await request.json()

    if (!blog_id || !sync_type || !status) {
      return NextResponse.json({ 
        error: 'Missing required fields: blog_id, sync_type, status' 
      }, { status: 400 })
    }

    const supabase = createSupabaseServiceClient()

    const { data, error } = await supabase
      .from('sync_logs')
      .insert({
        blog_id,
        sync_type,
        status,
        details: details || {},
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating sync log:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Sync logs API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}