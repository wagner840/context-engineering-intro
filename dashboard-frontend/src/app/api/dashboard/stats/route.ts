import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createSupabaseServiceClient()

    // Buscar total de blogs ativos
    const { count: totalBlogs } = await supabase
      .from('blogs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Buscar total de keyword variations (palavras-chave)
    const { count: totalKeywords } = await supabase
      .from('keyword_variations')
      .select('*', { count: 'exact', head: true })

    // Buscar total de posts de conteúdo
    const { count: totalPosts } = await supabase
      .from('content_posts')
      .select('*', { count: 'exact', head: true })

    // Buscar total de oportunidades (soma de categories e clusters)
    const { count: opportunitiesCategories } = await supabase
      .from('content_opportunities_categories')
      .select('*', { count: 'exact', head: true })

    const { count: opportunitiesClusters } = await supabase
      .from('content_opportunities_clusters')
      .select('*', { count: 'exact', head: true })

    const totalOpportunities = (opportunitiesCategories || 0) + (opportunitiesClusters || 0)

    const stats = {
      totalBlogs: totalBlogs || 0,
      totalKeywords: totalKeywords || 0,
      totalPosts: totalPosts || 0,
      totalOpportunities
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServiceClient()
    const { query } = await request.json()

    // Executar query customizada usando MCP do Supabase
    const { data, error } = await supabase.rpc('get_dashboard_metrics', {
      query_type: query
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error executing custom dashboard query:', error)
    return NextResponse.json(
      { error: 'Failed to execute query' },
      { status: 500 }
    )
  }
}