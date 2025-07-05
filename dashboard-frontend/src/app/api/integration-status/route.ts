import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Buscar todos os blogs primeiro para debug
    const { data: allBlogs } = await supabase
      .from('blogs')
      .select('*')

    console.log('Todos os blogs:', allBlogs?.map(b => ({ name: b.name, domain: b.domain })))

    // Buscar blogs configurados
    const { data: blogs, error: blogsError } = await supabase
      .from('blogs')
      .select('*')
      .or('domain.eq.einsof7.com,domain.eq.opetmil.com')

    if (blogsError) throw blogsError

    // Buscar posts sincronizados
    const { data: posts, error: postsError } = await supabase
      .from('content_posts')
      .select('blog_id, title, status, wordpress_post_id')
      .in('blog_id', blogs?.map(b => b.id) || [])

    if (postsError) throw postsError

    // Buscar palavras-chave
    const { data: keywords, error: keywordsError } = await supabase
      .from('main_keywords')
      .select('blog_id, keyword, is_used')
      .in('blog_id', blogs?.map(b => b.id) || [])

    if (keywordsError) throw keywordsError

    // Agrupar dados por blog
    const blogStats = blogs?.map(blog => {
      const blogPosts = posts?.filter(p => p.blog_id === blog.id) || []
      const blogKeywords = keywords?.filter(k => k.blog_id === blog.id) || []
      
      return {
        id: blog.id,
        name: blog.name,
        domain: blog.domain,
        niche: blog.niche,
        is_active: blog.is_active,
        wordpress_url: (blog.settings as any)?.wordpress_url,
        stats: {
          total_posts: blogPosts.length,
          published_posts: blogPosts.filter(p => p.status === 'publish').length,
          total_keywords: blogKeywords.length,
          used_keywords: blogKeywords.filter(k => k.is_used).length
        },
        last_updated: blog.updated_at
      }
    })

    // Teste de conectividade WordPress
    const wordpressStatus = await Promise.all(
      blogs?.map(async (blog) => {
        const settings = blog.settings as any
        const wpUrl = settings?.wordpress_url
        
        if (!wpUrl) {
          return { domain: blog.domain, status: 'not_configured' }
        }

        try {
          const response = await fetch(`${wpUrl}/wp-json/wp/v2/posts?per_page=1`, {
            method: 'GET'
          })
          
          return {
            domain: blog.domain,
            status: response.ok ? 'connected' : 'error',
            statusCode: response.status
          }
        } catch (error) {
          return {
            domain: blog.domain,
            status: 'connection_failed',
            error: (error as Error).message
          }
        }
      }) || []
    )

    return NextResponse.json({
      success: true,
      integration_status: {
        total_blogs: blogs?.length || 0,
        total_posts: posts?.length || 0,
        total_keywords: keywords?.length || 0,
        blogs: blogStats,
        wordpress_connectivity: wordpressStatus
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro ao verificar status da integração:', error)
    return NextResponse.json({
      success: false,
      error: (error as Error).message
    }, { status: 500 })
  }
}