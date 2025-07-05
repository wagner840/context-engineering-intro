import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔍 Verificando blogs no Supabase...')
    
    // Buscar todos os blogs
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('id, name, domain, is_active')
    
    console.log('Blogs encontrados:', blogs)
    
    if (error) {
      console.error('Erro Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Contar posts e keywords
    const blogIds = blogs?.map(b => b.id) || []
    
    const [postsResult, keywordsResult] = await Promise.all([
      supabase.from('content_posts').select('id', { count: 'exact' }).in('blog_id', blogIds),
      supabase.from('main_keywords').select('id', { count: 'exact' }).in('blog_id', blogIds)
    ])

    return NextResponse.json({
      success: true,
      blogs_count: blogs?.length || 0,
      posts_count: postsResult.count || 0,
      keywords_count: keywordsResult.count || 0,
      blogs: blogs?.map(b => ({ name: b.name, domain: b.domain, active: b.is_active })) || [],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro geral:', error)
    return NextResponse.json({
      error: (error as Error).message
    }, { status: 500 })
  }
}