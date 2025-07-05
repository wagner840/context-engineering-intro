/**
 * Script para executar o setup dos blogs diretamente
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wayzhnpwphekjuznwqnr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndheXpobnB3cGhla2p1em53cW5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDU2NjAzOCwiZXhwIjoyMDY2MTQyMDM4fQ.vDP-wAldCUCmQhclreEp3jDEaPTSjAL0AAyr2euy1XQ'
const supabase = createClient(supabaseUrl, supabaseKey)

const BLOGS_CONFIG = [
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
    domain: 'optemil.com',
    niche: 'Marketing Digital',
    description: 'Blog focado em estratégias de marketing digital, otimização e crescimento online',
    wordpress_url: 'https://optemil.com',
    wordpress_username: 'contatopawa@gmail.com',
    wordpress_password: '7FoB NxNd DNsU 7Mew O9Dr dLiY',
    is_active: true
  }
]

async function testWordPressConnection(blogConfig) {
  try {
    const response = await fetch(`${blogConfig.wordpress_url}/wp-json/wp/v2/posts?per_page=1`)
    
    if (response.ok) {
      return { success: true }
    } else {
      return { success: false, error: `HTTP ${response.status}: ${response.statusText}` }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function setupBlogs() {
  console.log('🚀 Iniciando configuração dos blogs...')
  
  for (const blogConfig of BLOGS_CONFIG) {
    try {
      console.log(`\n📝 Configurando blog: ${blogConfig.name}`)
      
      // 1. Verificar se o blog já existe
      const { data: existingBlog } = await supabase
        .from('blogs')
        .select('*')
        .eq('domain', blogConfig.domain)
        .single()

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

      // 3. Sincronizar alguns posts do WordPress
      console.log(`📥 Buscando posts do WordPress para ${blogConfig.name}...`)
      
      try {
        const response = await fetch(`${blogConfig.wordpress_url}/wp-json/wp/v2/posts?per_page=5`)
        
        if (response.ok) {
          const wpPosts = await response.json()
          console.log(`📄 Encontrados ${wpPosts.length} posts no WordPress`)
          
          // Sincronizar cada post
          for (const wpPost of wpPosts) {
            const postData = {
              blog_id: blog.id,
              title: wpPost.title.rendered.replace(/<[^>]*>/g, ''), // Remove HTML
              content: wpPost.content.rendered,
              excerpt: wpPost.excerpt.rendered.replace(/<[^>]*>/g, ''),
              status: wpPost.status,
              slug: wpPost.slug,
              wordpress_post_id: wpPost.id,
              published_at: wpPost.status === 'publish' ? wpPost.date : null,
              author_id: 'wordpress-sync',
              word_count: wpPost.content.rendered.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length,
              reading_time: Math.ceil(wpPost.content.rendered.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length / 200)
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
        }
      } catch (error) {
        console.error('Erro na sincronização de posts:', error)
      }

      // 4. Configurar palavras-chave exemplo
      console.log(`🔑 Configurando palavras-chave para ${blogConfig.name}...`)
      
      const sampleKeywords = blogConfig.niche === 'Tecnologia e IA' ? [
        {
          blog_id: blog.id,
          keyword: 'inteligência artificial',
          msv: 5000,
          kw_difficulty: 65,
          cpc: 3.2,
          competition: 'HIGH',
          search_intent: 'informational',
          is_used: false,
          location: 'BR',
          language: 'pt-BR'
        },
        {
          blog_id: blog.id,
          keyword: 'desenvolvimento web',
          msv: 3200,
          kw_difficulty: 45,
          cpc: 2.8,
          competition: 'MEDIUM',
          search_intent: 'commercial',
          is_used: false,
          location: 'BR',
          language: 'pt-BR'
        }
      ] : [
        {
          blog_id: blog.id,
          keyword: 'marketing digital',
          msv: 8000,
          kw_difficulty: 55,
          cpc: 2.5,
          competition: 'MEDIUM',
          search_intent: 'commercial',
          is_used: false,
          location: 'BR',
          language: 'pt-BR'
        },
        {
          blog_id: blog.id,
          keyword: 'seo otimização',
          msv: 4500,
          kw_difficulty: 60,
          cpc: 3.1,
          competition: 'HIGH',
          search_intent: 'informational',
          is_used: false,
          location: 'BR',
          language: 'pt-BR'
        }
      ]

      // Verificar se já existem keywords para este blog
      const { data: existingKeywords } = await supabase
        .from('main_keywords')
        .select('keyword')
        .eq('blog_id', blog.id)

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

      console.log(`✅ Blog ${blogConfig.name} configurado com sucesso!`)

    } catch (error) {
      console.error(`❌ Erro ao configurar blog ${blogConfig.name}:`, error)
    }
  }

  console.log('\n🎉 Configuração dos blogs concluída!')
  
  // Verificar resultado final
  console.log('\n📊 Verificando configuração final...')
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .in('domain', ['einsof7.com', 'optemil.com'])
  
  console.log(`📝 Blogs configurados: ${blogs?.length || 0}`)
  blogs?.forEach(blog => {
    console.log(`   - ${blog.name} (${blog.domain}) - ${blog.is_active ? 'Ativo' : 'Inativo'}`)
  })

  const { data: posts } = await supabase
    .from('content_posts')
    .select('blog_id')
    .in('blog_id', blogs?.map(b => b.id) || [])

  const { data: keywords } = await supabase
    .from('main_keywords')
    .select('blog_id')
    .in('blog_id', blogs?.map(b => b.id) || [])

  console.log(`📄 Posts sincronizados: ${posts?.length || 0}`)
  console.log(`🔑 Palavras-chave configuradas: ${keywords?.length || 0}`)
}

// Executar o setup
setupBlogs().catch(console.error)