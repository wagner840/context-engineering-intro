/**
 * Script para configurar automaticamente os blogs einsof7 e optemil
 * Com integrações bilaterais WordPress ↔ Supabase
 */

import { supabase } from '../lib/supabase'

interface BlogConfig {
  name: string
  domain: string
  niche: string
  description: string
  wordpress_url: string
  wordpress_username: string
  wordpress_password: string
  is_active: boolean
}

const BLOGS_CONFIG: BlogConfig[] = [
  {
    name: 'Einsof7',
    domain: 'einsof7.com',
    niche: 'Tecnologia e IA',
    description: 'Blog especializado em inteligência artificial, desenvolvimento e tecnologia avançada',
    wordpress_url: 'https://einsof7.com',
    wordpress_username: 'contatopawa@gmail.com',
    wordpress_password: 'B0lk 6UEQ kNEz aVgP KnFS WXJBd',
    is_active: true
  },
  {
    name: 'Optemil',
    domain: 'opetmil.com',
    niche: 'Marketing Digital',
    description: 'Blog focado em estratégias de marketing digital, otimização e crescimento online',
    wordpress_url: 'https://opetmil.com',
    wordpress_username: 'contatopawa@gmail.com',
    wordpress_password: '7FoB NxNd DNsU 7Mew O9Dr dLiY',
    is_active: true
  }
]

interface WordPressPost {
  id: number
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  status: string
  date: string
  modified: string
  slug: string
  link: string
  author: number
  featured_media: number
  categories: number[]
  tags: number[]
}

interface WordPressCategory {
  id: number
  name: string
  slug: string
  description: string
}

interface WordPressTag {
  id: number
  name: string
  slug: string
  description: string
}

export async function setupBlogs() {
  console.log('🚀 Iniciando configuração dos blogs...')
  
  for (const blogConfig of BLOGS_CONFIG) {
    try {
      console.log(`\n📝 Configurando blog: ${blogConfig.name}`)
      
      // 1. Verificar se o blog já existe (por domínio ou nome)
      const { data: existingBlogs } = await supabase
        .from('blogs')
        .select('*')
        .or(`domain.eq.${blogConfig.domain},name.eq.${blogConfig.name}`)

      const existingBlog = existingBlogs?.[0]

      let blog
      
      if (existingBlog) {
        console.log(`✅ Blog ${blogConfig.name} já existe, atualizando configurações...`)
        
        // Atualizar configurações existentes
        const { data: updatedBlog, error: updateError } = await supabase
          .from('blogs')
          .update({
            name: blogConfig.name,
            niche: blogConfig.niche,
            description: blogConfig.description,
            settings: {
              wordpress_url: blogConfig.wordpress_url,
              wordpress_username: blogConfig.wordpress_username,
              wordpress_app_password: blogConfig.wordpress_password,
              auto_sync: true,
              seo_enabled: true,
              realtime_sync: true
            },
            is_active: blogConfig.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingBlog.id)
          .select()
          .single()

        if (updateError) throw updateError
        blog = updatedBlog
      } else {
        console.log(`➕ Criando novo blog: ${blogConfig.name}`)
        
        // Criar novo blog
        const { data: newBlog, error: createError } = await supabase
          .from('blogs')
          .insert([{
            name: blogConfig.name,
            domain: blogConfig.domain,
            niche: blogConfig.niche,
            description: blogConfig.description,
            settings: {
              wordpress_url: blogConfig.wordpress_url,
              wordpress_username: blogConfig.wordpress_username,
              wordpress_app_password: blogConfig.wordpress_password,
              auto_sync: true,
              seo_enabled: true,
              realtime_sync: true
            },
            is_active: blogConfig.is_active
          }])
          .select()
          .single()

        if (createError) throw createError
        blog = newBlog
      }

      // 2. Testar conexão WordPress
      console.log(`🔌 Testando conexão WordPress para ${blogConfig.name}...`)
      const wpTestResult = await testWordPressConnection(blogConfig)
      
      if (!wpTestResult.success) {
        console.log(`❌ Erro na conexão WordPress: ${wpTestResult.error}`)
        continue
      }

      console.log(`✅ Conexão WordPress estabelecida para ${blogConfig.name}`)

      // 3. Sincronizar posts do WordPress
      console.log(`📥 Sincronizando posts do WordPress para ${blogConfig.name}...`)
      await syncWordPressToBlog(blog.id, blogConfig)

      // 4. Sincronizar categorias e tags
      console.log(`🏷️ Sincronizando categorias e tags para ${blogConfig.name}...`)
      await syncCategoriesAndTags(blog.id, blogConfig)

      // 5. Configurar palavras-chave exemplo
      console.log(`🔑 Configurando palavras-chave para ${blogConfig.name}...`)
      await setupSampleKeywords(blog.id, blogConfig)

      console.log(`✅ Blog ${blogConfig.name} configurado com sucesso!`)

    } catch (error) {
      console.error(`❌ Erro ao configurar blog ${blogConfig.name}:`, error)
    }
  }

  console.log('\n🎉 Configuração dos blogs concluída!')
}

async function testWordPressConnection(blogConfig: BlogConfig): Promise<{success: boolean, error?: string}> {
  try {
    const response = await fetch(`${blogConfig.wordpress_url}/wp-json/wp/v2/posts?per_page=1`)
    
    if (response.ok) {
      return { success: true }
    } else {
      return { success: false, error: `HTTP ${response.status}: ${response.statusText}` }
    }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

async function syncWordPressToBlog(blogId: string, blogConfig: BlogConfig) {
  try {
    // Buscar posts do WordPress
    const response = await fetch(`${blogConfig.wordpress_url}/wp-json/wp/v2/posts?per_page=20&_embed`)
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar posts: ${response.status}`)
    }

    const wpPosts: WordPressPost[] = await response.json()
    console.log(`📄 Encontrados ${wpPosts.length} posts no WordPress`)

    // Sincronizar cada post
    for (const wpPost of wpPosts) {
      const postData = {
        blog_id: blogId,
        title: wpPost.title.rendered.replace(/<[^>]*>/g, ''), // Remove HTML
        content: wpPost.content.rendered,
        excerpt: wpPost.excerpt.rendered.replace(/<[^>]*>/g, ''),
        status: wpPost.status,
        slug: wpPost.slug,
        wordpress_post_id: wpPost.id,
        published_at: wpPost.status === 'publish' ? wpPost.date : null,
        author_id: 'wordpress-sync', // Placeholder para autor
        word_count: wpPost.content.rendered.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length,
        reading_time: Math.ceil(wpPost.content.rendered.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length / 200),
        featured_image_url: null, // Pode ser extraído do _embedded se necessário
        seo_title: wpPost.title.rendered.replace(/<[^>]*>/g, ''),
        seo_description: wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
        focus_keyword: null,
        readability_score: null,
        seo_score: null,
        embedding: null
      }

      // Usar upsert para evitar duplicatas
      const { error } = await supabase
        .from('content_posts')
        .upsert(postData, { 
          onConflict: 'blog_id,wordpress_post_id',
          ignoreDuplicates: false 
        })

      if (error) {
        console.error(`Erro ao sincronizar post ${wpPost.title.rendered}:`, error)
      } else {
        console.log(`✅ Post sincronizado: ${wpPost.title.rendered.substring(0, 50)}...`)
      }
    }

  } catch (error) {
    console.error('Erro na sincronização de posts:', error)
  }
}

async function syncCategoriesAndTags(blogId: string, blogConfig: BlogConfig) {
  try {
    // Buscar categorias do WordPress
    const categoriesResponse = await fetch(`${blogConfig.wordpress_url}/wp-json/wp/v2/categories?per_page=50`)
    if (categoriesResponse.ok) {
      const wpCategories: WordPressCategory[] = await categoriesResponse.json()
      
      for (const wpCategory of wpCategories) {
        const categoryData = {
          blog_id: blogId,
          name: wpCategory.name,
          slug: wpCategory.slug,
          description: wpCategory.description,
          wordpress_category_id: wpCategory.id
        }

        await supabase
          .from('blog_categories')
          .upsert(categoryData, { 
            onConflict: 'blog_id,wordpress_category_id',
            ignoreDuplicates: false 
          })
      }
      
      console.log(`✅ ${wpCategories.length} categorias sincronizadas`)
    }

    // Buscar tags do WordPress
    const tagsResponse = await fetch(`${blogConfig.wordpress_url}/wp-json/wp/v2/tags?per_page=50`)
    if (tagsResponse.ok) {
      const wpTags: WordPressTag[] = await tagsResponse.json()
      
      for (const wpTag of wpTags) {
        const tagData = {
          blog_id: blogId,
          name: wpTag.name,
          slug: wpTag.slug,
          description: wpTag.description,
          wordpress_tag_id: wpTag.id
        }

        await supabase
          .from('blog_tags')
          .upsert(tagData, { 
            onConflict: 'blog_id,wordpress_tag_id',
            ignoreDuplicates: false 
          })
      }
      
      console.log(`✅ ${wpTags.length} tags sincronizadas`)
    }

  } catch (error) {
    console.error('Erro na sincronização de categorias/tags:', error)
  }
}

async function setupSampleKeywords(blogId: string, blogConfig: BlogConfig) {
  const sampleKeywords = blogConfig.niche === 'Tecnologia e IA' ? [
    {
      blog_id: blogId,
      keyword: 'inteligência artificial',
      msv: 5000,
      kw_difficulty: 65,
      cpc: 3.2,
      competition: 'HIGH' as const,
      search_intent: 'informational' as const,
      is_used: false,
      location: 'BR',
      language: 'pt-BR'
    },
    {
      blog_id: blogId,
      keyword: 'desenvolvimento web',
      msv: 3200,
      kw_difficulty: 45,
      cpc: 2.8,
      competition: 'MEDIUM' as const,
      search_intent: 'commercial' as const,
      is_used: false,
      location: 'BR',
      language: 'pt-BR'
    },
    {
      blog_id: blogId,
      keyword: 'machine learning python',
      msv: 1800,
      kw_difficulty: 70,
      cpc: 4.5,
      competition: 'HIGH' as const,
      search_intent: 'informational' as const,
      is_used: false,
      location: 'BR',
      language: 'pt-BR'
    }
  ] : [
    {
      blog_id: blogId,
      keyword: 'marketing digital',
      msv: 8000,
      kw_difficulty: 55,
      cpc: 2.5,
      competition: 'MEDIUM' as const,
      search_intent: 'commercial' as const,
      is_used: false,
      location: 'BR',
      language: 'pt-BR'
    },
    {
      blog_id: blogId,
      keyword: 'seo otimização',
      msv: 4500,
      kw_difficulty: 60,
      cpc: 3.1,
      competition: 'HIGH' as const,
      search_intent: 'informational' as const,
      is_used: false,
      location: 'BR',
      language: 'pt-BR'
    },
    {
      blog_id: blogId,
      keyword: 'google ads campanha',
      msv: 2100,
      kw_difficulty: 40,
      cpc: 4.2,
      competition: 'MEDIUM' as const,
      search_intent: 'commercial' as const,
      is_used: false,
      location: 'BR',
      language: 'pt-BR'
    }
  ]

  try {
    // Verificar se já existem keywords para este blog
    const { data: existingKeywords } = await supabase
      .from('main_keywords')
      .select('keyword')
      .eq('blog_id', blogId)

    const existingKeywordsList = existingKeywords?.map(k => k.keyword) || []

    // Inserir apenas keywords que não existem
    const newKeywords = sampleKeywords.filter(k => !existingKeywordsList.includes(k.keyword))

    if (newKeywords.length > 0) {
      const { error } = await supabase
        .from('main_keywords')
        .insert(newKeywords)

      if (error) throw error
      
      console.log(`✅ ${newKeywords.length} palavras-chave adicionadas`)
    } else {
      console.log(`ℹ️ Palavras-chave já existem para este blog`)
    }

  } catch (error) {
    console.error('Erro ao configurar palavras-chave:', error)
  }
}

// Função para executar o setup (para usar no navegador)
export async function runBlogSetup() {
  try {
    await setupBlogs()
    return { success: true, message: 'Blogs configurados com sucesso!' }
  } catch (error) {
    console.error('Erro no setup:', error)
    return { success: false, error: (error as Error).message }
  }
}