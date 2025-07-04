import { useState, useCallback } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase, findSimilarKeywords, findSimilarPosts } from '@/lib/supabase'
import { useNotifications } from '@/store/ui-store'
import { useDebounce } from './use-debounce'
import { Database } from '@/types/database'

type SemanticCluster = Database['public']['Tables']['semantic_clusters']['Row']

interface SimilarKeyword {
  id: string
  keyword: string
  similarity: number
}

interface SimilarPost {
  id: string
  title: string
  similarity: number
}

interface VectorSearchParams {
  query: string
  blogId: string
  similarityThreshold: number
  maxResults: number
  searchType: 'semantic' | 'hybrid' | 'all'
}

interface VectorSearchResult {
  keyword: string
  similarity: number
  cluster_name?: string
  search_volume?: number
  search_intent?: string
  is_used: boolean
  embedding?: number[]
}

export function useVectorSearch(blogId: string) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'keywords' | 'posts'>('keywords')
  const [isSearching, setIsSearching] = useState(false)
  const { addNotification } = useNotifications()

  const debouncedQuery = useDebounce(searchQuery, 500)

  const generateEmbedding = useCallback(async (text: string): Promise<number[]> => {
    try {
      // This would typically call OpenAI API to generate embeddings
      // For now, we'll return a mock embedding or throw an error
      const response = await fetch('/api/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate embedding')
      }

      const { embedding } = await response.json()
      return embedding
    } catch (error) {
      console.error('Error generating embedding:', error)
      throw new Error('Failed to generate embedding for search')
    }
  }, [])

  const vectorSearchQuery = useQuery({
    queryKey: ['vector-search', blogId, debouncedQuery, searchType],
    queryFn: async (): Promise<SimilarKeyword[] | SimilarPost[]> => {
      if (!debouncedQuery.trim()) {
        return []
      }

      setIsSearching(true)

      try {
        const embedding = await generateEmbedding(debouncedQuery)

        if (searchType === 'keywords') {
          return await findSimilarKeywords(embedding, 0.7, 20, blogId)
        } else {
          return await findSimilarPosts(embedding, 0.7, 20, blogId)
        }
      } catch (error) {
        throw error
      } finally {
        setIsSearching(false)
      }
    },
    enabled: !!debouncedQuery.trim() && !!blogId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Search failed',
        message: error.message,
      })
      setIsSearching(false)
    },
  })

  const search = useCallback((query: string, type: 'keywords' | 'posts' = 'keywords') => {
    setSearchQuery(query)
    setSearchType(type)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  return {
    search,
    clearSearch,
    searchQuery,
    searchType,
    setSearchType,
    results: vectorSearchQuery.data || [],
    isLoading: vectorSearchQuery.isLoading || isSearching,
    error: vectorSearchQuery.error,
    isSearching,
  }
}

export function useKeywordEmbeddings(blogId: string) {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: ['keyword-embeddings', blogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('keyword_variations')
        .select(`
          id,
          keyword,
          embedding,
          main_keywords!inner (
            blog_id
          )
        `)
        .eq('main_keywords.blog_id', blogId)
        .not('embedding', 'is', null)
        .limit(1000)

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    enabled: !!blogId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to fetch keyword embeddings',
        message: error.message,
      })
    },
  })
}

export function usePostEmbeddings(blogId: string) {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: ['post-embeddings', blogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_posts')
        .select('id, title, embedding')
        .eq('blog_id', blogId)
        .not('embedding', 'is', null)
        .limit(1000)

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    enabled: !!blogId,
    staleTime: 10 * 60 * 1000,
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to fetch post embeddings',
        message: error.message,
      })
    },
  })
}

export function useSemanticRecommendations(targetKeyword: string, blogId: string) {
  const { addNotification } = useNotifications()
  const debouncedKeyword = useDebounce(targetKeyword, 1000)

  return useQuery({
    queryKey: ['semantic-recommendations', blogId, debouncedKeyword],
    queryFn: async (): Promise<{
      similarKeywords: SimilarKeyword[]
      relatedPosts: SimilarPost[]
    }> => {
      try {
        const embedding = await fetch('/api/embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: debouncedKeyword }),
        }).then(res => res.json()).then(data => data.embedding)

        const [similarKeywords, relatedPosts] = await Promise.all([
          findSimilarKeywords(embedding, 0.8, 10, blogId),
          findSimilarPosts(embedding, 0.8, 5, blogId),
        ])

        return {
          similarKeywords,
          relatedPosts,
        }
      } catch (error) {
        throw new Error('Failed to get semantic recommendations')
      }
    },
    enabled: !!debouncedKeyword.trim() && !!blogId,
    staleTime: 10 * 60 * 1000,
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to get recommendations',
        message: error.message,
      })
    },
  })
}

export function useEmbeddingStats(blogId: string) {
  const keywordEmbeddings = useKeywordEmbeddings(blogId)
  const postEmbeddings = usePostEmbeddings(blogId)

  const stats = {
    keywordsWithEmbeddings: keywordEmbeddings.data?.length || 0,
    postsWithEmbeddings: postEmbeddings.data?.length || 0,
    totalKeywords: 0, // Would need to fetch total count
    totalPosts: 0, // Would need to fetch total count
    embeddingCoverage: {
      keywords: 0, // percentage
      posts: 0, // percentage
    },
    isLoading: keywordEmbeddings.isLoading || postEmbeddings.isLoading,
  }

  return stats
}

// New vector search functions for semantic search page
export function useAdvancedVectorSearch() {
  return useMutation({
    mutationFn: async (params: VectorSearchParams): Promise<VectorSearchResult[]> => {
      const { query, blogId, similarityThreshold, maxResults, searchType } = params
      
      // First, get the embedding for the search query
      const { data: embedding, error: embeddingError } = await supabase.functions.invoke('generate-embedding', {
        body: { text: query }
      })
      
      if (embeddingError) throw embeddingError
      
      // Perform vector similarity search
      const { data, error } = await supabase.rpc('vector_search_keywords', {
        query_embedding: embedding,
        blog_id_param: blogId,
        similarity_threshold: similarityThreshold,
        match_count: maxResults
      })
      
      if (error) throw error
      
      return data || []
    },
  })
}

export function useSemanticClusters(blogId: string) {
  return useQuery({
    queryKey: ['semantic-clusters', blogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('semantic_clusters')
        .select('*')
        .eq('blog_id', blogId)
        .order('keyword_count', { ascending: false })

      if (error) throw error
      return data as SemanticCluster[]
    },
    enabled: !!blogId,
  })
}

export function useClusterKeywords(clusterId: string) {
  return useQuery({
    queryKey: ['cluster-keywords', clusterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('main_keywords')
        .select(`
          *,
          keyword_variations (
            variation,
            msv,
            kw_difficulty
          )
        `)
        .eq('semantic_cluster_id', clusterId)
        .order('msv', { ascending: false, nullsLast: true })

      if (error) throw error
      return data
    },
    enabled: !!clusterId,
  })
}

export function useKeywordSimilarity(keyword1: string, keyword2: string) {
  return useQuery({
    queryKey: ['keyword-similarity', keyword1, keyword2],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('calculate_keyword_similarity', {
        keyword_1: keyword1,
        keyword_2: keyword2
      })
      
      if (error) throw error
      return data as number
    },
    enabled: !!keyword1 && !!keyword2,
  })
}

export function useGenerateEmbedding() {
  return useMutation({
    mutationFn: async (text: string): Promise<number[]> => {
      const { data, error } = await supabase.functions.invoke('generate-embedding', {
        body: { text }
      })
      
      if (error) throw error
      return data
    },
  })
}

export function useSimilarKeywords(keyword: string, blogId: string, limit = 10) {
  return useQuery({
    queryKey: ['similar-keywords', keyword, blogId, limit],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('find_similar_keywords', {
        target_keyword: keyword,
        blog_id_param: blogId,
        similarity_threshold: 0.7,
        match_count: limit
      })
      
      if (error) throw error
      return data || []
    },
    enabled: !!keyword && !!blogId,
  })
}

export function useClusterAnalysis(blogId: string) {
  const { data: clusters } = useSemanticClusters(blogId)
  
  if (!clusters) {
    return {
      totalClusters: 0,
      totalKeywords: 0,
      avgClusterSize: 0,
      largestCluster: null,
      clusterDistribution: [],
    }
  }

  const totalClusters = clusters.length
  const totalKeywords = clusters.reduce((sum, c) => sum + c.keyword_count, 0)
  const avgClusterSize = Math.round(totalKeywords / totalClusters)
  const largestCluster = clusters.sort((a, b) => b.keyword_count - a.keyword_count)[0]
  
  // Distribution by cluster size
  const sizeRanges = [
    { range: '1-5', min: 1, max: 5 },
    { range: '6-15', min: 6, max: 15 },
    { range: '16-30', min: 16, max: 30 },
    { range: '31+', min: 31, max: Infinity },
  ]
  
  const clusterDistribution = sizeRanges.map(range => ({
    range: range.range,
    count: clusters.filter(c => c.keyword_count >= range.min && c.keyword_count <= range.max).length
  }))

  return {
    totalClusters,
    totalKeywords,
    avgClusterSize,
    largestCluster,
    clusterDistribution,
  }
}