import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServiceClient()
    const { searchParams } = new URL(request.url)
    const blogId = searchParams.get('blog_id')

    if (!blogId) {
      // Buscar estatísticas agregadas por blog
      const { data: blogStats, error } = await supabase
        .from('executive_dashboard')
        .select('*')
        .order('blog_id')

      if (error) {
        throw error
      }

      return NextResponse.json({ data: blogStats })
    } else {
      // Buscar estatísticas de um blog específico
      const { data: blogData, error: blogError } = await supabase
        .from('blogs')
        .select(`
          *,
          content_posts(count),
          main_keywords(count),
          keyword_variations(count)
        `)
        .eq('id', blogId)
        .single()

      if (blogError) {
        throw blogError
      }

      // Buscar posts recentes
      const { data: recentPosts, error: postsError } = await supabase
        .from('content_posts')
        .select(`
          id,
          title,
          status,
          published_at,
          created_at,
          target_keywords
        `)
        .eq('blog_id', blogId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (postsError) {
        throw postsError
      }

      // Buscar oportunidades de conteúdo
      const { data: opportunities, error: oppError } = await supabase
        .from('keyword_opportunities')
        .select('*')
        .eq('blog_id', blogId)
        .order('opportunity_score', { ascending: false })
        .limit(10)

      if (oppError) {
        throw oppError
      }

      return NextResponse.json({
        blog: blogData,
        recentPosts,
        opportunities
      })
    }
  } catch (error) {
    console.error('Error fetching blog stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog stats' },
      { status: 500 }
    )
  }
}