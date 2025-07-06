'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { BlogStats, KeywordStats, ContentStats } from '@/types/database-extended'
import { useBlog } from '@/contexts/blog-context'

export function useBlogStats() {
  const { activeBlog } = useBlog()
  const [blogStats, setBlogStats] = useState<BlogStats | null>(null)
  const [keywordStats, setKeywordStats] = useState<KeywordStats | null>(null)
  const [contentStats, setContentStats] = useState<ContentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStats = async () => {
    if (!activeBlog || activeBlog === 'all') return

    setLoading(true)
    setError(null)

    try {
      // Primeiro, buscar o blog real no Supabase pelo domain para pegar o ID correto
      // Usando API server-side que tem service role key para contornar RLS
      const blogResponse = await fetch(`/api/blogs?domain=${encodeURIComponent(activeBlog.domain)}`)
      
      if (!blogResponse.ok) {
        throw new Error(`HTTP ${blogResponse.status}: ${blogResponse.statusText}`)
      }
      
      const blogResult = await blogResponse.json()
      const blogData = blogResult.data?.[0] // Primeira entrada do array

      if (!blogData) {
        console.warn(`Blog com domain '${activeBlog.domain}' não encontrado no banco de dados`)
        
        // Definir estatísticas vazias em vez de erro
        setBlogStats({
          total_blogs: 0,
          keyword_variations: 0,
          content_posts: 0,
          opportunities: 0,
          media_assets: 0,
          published_posts: 0,
          draft_posts: 0,
          high_priority_opportunities: 0
        })
        
        setKeywordStats({
          total_keywords: 0,
          total_variations: 0,
          total_categories: 0,
          total_clusters: 0,
          used_keywords: 0,
          avg_search_volume: 0,
          avg_difficulty: 0
        })
        
        setContentStats({
          total_posts: 0,
          published_posts: 0,
          draft_posts: 0,
          scheduled_posts: 0,
          avg_word_count: 0,
          avg_reading_time: 0,
          avg_seo_score: 0
        })
        
        setLoading(false)
        return
      }

      const blogId = blogData.id

      // Buscar main_keywords para este blog
      const { data: mainKeywordsData, error: mainKeywordsError } = await supabase
        .from('main_keywords')
        .select('*')
        .eq('blog_id', blogId)

      if (mainKeywordsError) {
        console.error('Erro ao buscar main_keywords:', mainKeywordsError)
      }

      const mainKeywords = mainKeywordsData || []
      const mainKeywordIds = mainKeywords.map(k => k.id)

      // Buscar estatísticas principais com base nas main_keywords
      const [
        keywordVariationsResult,
        contentPostsResult,
        opportunitiesResult,
        keywordCategoriesResult,
        keywordClustersResult,
        mediaResult
      ] = await Promise.all([
        // Keyword variations baseadas nas main_keywords deste blog
        mainKeywordIds.length > 0 
          ? supabase.from('keyword_variations').select('id', { count: 'exact' }).in('main_keyword_id', mainKeywordIds)
          : Promise.resolve({ count: 0 }),
        
        // Content posts deste blog
        supabase.from('content_posts').select('*', { count: 'exact' }).eq('blog_id', blogId),
        
        // Using keyword_opportunities view instead
        supabase.from('keyword_opportunities').select('id', { count: 'exact' }).eq('blog_name', blogId),
        
        // Keyword categories baseadas nas main_keywords deste blog
        mainKeywordIds.length > 0
          ? supabase.from('keyword_categories').select('id', { count: 'exact' }).in('main_keyword_id', mainKeywordIds)
          : Promise.resolve({ count: 0 }),
        
        // Keyword clusters baseadas nas main_keywords deste blog
        mainKeywordIds.length > 0
          ? supabase.from('keyword_clusters').select('id', { count: 'exact' }).in('main_keyword_id', mainKeywordIds)
          : Promise.resolve({ count: 0 }),
        
        // Media assets deste blog
        supabase.from('media_assets').select('id', { count: 'exact' }).eq('blog_id', blogId)
      ])

      // Calcular estatísticas do blog
      const totalContentOpportunities = (contentOpportunitiesCategoriesResult.count || 0) + (contentOpportunitiesClustersResult.count || 0)
      const publishedPosts = contentPostsResult.data?.filter(p => p.status === 'published').length || 0
      const draftPosts = contentPostsResult.data?.filter(p => p.status === 'draft').length || 0

      setBlogStats({
        total_blogs: 1, // Sempre 1 quando um blog específico está selecionado
        keyword_variations: keywordVariationsResult.count || 0,
        content_posts: contentPostsResult.count || 0,
        opportunities: totalContentOpportunities,
        media_assets: mediaResult.count || 0,
        published_posts: publishedPosts,
        draft_posts: draftPosts,
        high_priority_opportunities: 0 // TODO: Calcular baseado na prioridade das oportunidades
      })

      // Estatísticas de keywords
      const usedKeywords = mainKeywords.filter(k => k.is_used).length
      const avgSearchVolume = mainKeywords.length > 0 
        ? mainKeywords.reduce((sum, k) => sum + (k.msv || 0), 0) / mainKeywords.length 
        : 0
      const avgDifficulty = mainKeywords.length > 0
        ? mainKeywords.reduce((sum, k) => sum + (k.kw_difficulty || 0), 0) / mainKeywords.length
        : 0

      setKeywordStats({
        total_keywords: mainKeywords.length,
        total_variations: keywordVariationsResult.count || 0,
        total_categories: keywordCategoriesResult.count || 0,
        total_clusters: keywordClustersResult.count || 0,
        used_keywords: usedKeywords,
        avg_search_volume: avgSearchVolume,
        avg_difficulty: avgDifficulty
      })

      // Estatísticas de conteúdo
      const posts = contentPostsResult.data || []
      const scheduledPosts = posts.filter(p => p.status === 'scheduled').length
      const avgWordCount = posts.length > 0
        ? posts.reduce((sum, p) => sum + (p.word_count || 0), 0) / posts.length
        : 0
      const avgReadingTime = posts.length > 0
        ? posts.reduce((sum, p) => sum + (p.reading_time || 0), 0) / posts.length
        : 0
      const avgSeoScore = posts.length > 0
        ? posts.reduce((sum, p) => sum + (p.seo_score || 0), 0) / posts.length
        : 0

      setContentStats({
        total_posts: posts.length,
        published_posts: publishedPosts,
        draft_posts: draftPosts,
        scheduled_posts: scheduledPosts,
        avg_word_count: avgWordCount,
        avg_reading_time: avgReadingTime,
        avg_seo_score: avgSeoScore
      })

    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err)
      setError('Erro ao carregar estatísticas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [activeBlog])

  return {
    blogStats,
    keywordStats,
    contentStats,
    loading,
    error,
    refetch: loadStats
  }
}