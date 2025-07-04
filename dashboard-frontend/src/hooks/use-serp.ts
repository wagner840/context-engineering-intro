import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

type SerpResult = Database['public']['Tables']['serp_results']['Row']

export function useSerpResults(blogId: string) {
  return useQuery({
    queryKey: ['serp-results', blogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('serp_results')
        .select(`
          *,
          main_keywords (
            keyword,
            search_intent
          )
        `)
        .eq('blog_id', blogId)
        .order('position', { ascending: true })

      if (error) throw error
      return data as (SerpResult & {
        main_keywords?: {
          keyword: string
          search_intent: string
        }
      })[]
    },
    enabled: !!blogId,
  })
}

export function useSerpAnalysis(blogId: string) {
  const { data: serpResults } = useSerpResults(blogId)

  if (!serpResults) {
    return {
      totalKeywords: 0,
      topThreePositions: 0,
      topTenPositions: 0,
      topTwentyPositions: 0,
      avgPosition: 0,
      overallVisibilityScore: 0,
    }
  }

  const totalKeywords = serpResults.length
  const topThreePositions = serpResults.filter(r => r.position <= 3).length
  const topTenPositions = serpResults.filter(r => r.position <= 10).length
  const topTwentyPositions = serpResults.filter(r => r.position <= 20).length
  
  const avgPosition = serpResults.reduce((sum, r) => sum + r.position, 0) / totalKeywords
  
  // Calculate visibility score based on positions
  const visibilityScore = serpResults.reduce((sum, r) => {
    if (r.position <= 3) return sum + 100
    if (r.position <= 10) return sum + 70
    if (r.position <= 20) return sum + 40
    return sum + 10
  }, 0)
  
  const overallVisibilityScore = Math.round(visibilityScore / totalKeywords)

  return {
    totalKeywords,
    topThreePositions,
    topTenPositions,
    topTwentyPositions,
    avgPosition,
    overallVisibilityScore,
  }
}

export function useSerpResultDetails(resultId: string) {
  return useQuery({
    queryKey: ['serp-result-details', resultId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('serp_results')
        .select(`
          *,
          main_keywords (
            keyword,
            search_intent,
            msv,
            kw_difficulty,
            cpc
          )
        `)
        .eq('id', resultId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!resultId,
  })
}

export function useCompetitorAnalysis(blogId: string, keyword: string) {
  return useQuery({
    queryKey: ['competitor-analysis', blogId, keyword],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('serp_results')
        .select('*')
        .eq('keyword', keyword)
        .order('position', { ascending: true })
        .limit(20)

      if (error) throw error
      return data
    },
    enabled: !!blogId && !!keyword,
  })
}