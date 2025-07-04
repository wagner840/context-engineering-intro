import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, calculateKeywordOpportunityScore } from '@/lib/supabase'
import { useNotifications } from '@/store/ui-store'
import type { Database } from '@/types/database'

type MainKeyword = Database['public']['Tables']['main_keywords']['Row']
type KeywordVariation = Database['public']['Tables']['keyword_variations']['Row']
type KeywordOpportunity = Database['public']['Views']['keyword_opportunities']['Row']
type MainKeywordInsert = Database['public']['Tables']['main_keywords']['Insert']
type KeywordVariationInsert = Database['public']['Tables']['keyword_variations']['Insert']

export const KEYWORD_QUERY_KEYS = {
  all: ['keywords'] as const,
  main: (blogId: string) => [...KEYWORD_QUERY_KEYS.all, 'main', blogId] as const,
  variations: (mainKeywordId: string) => [...KEYWORD_QUERY_KEYS.all, 'variations', mainKeywordId] as const,
  opportunities: (blogId: string) => [...KEYWORD_QUERY_KEYS.all, 'opportunities', blogId] as const,
  detail: (id: string) => [...KEYWORD_QUERY_KEYS.all, 'detail', id] as const,
} as const

export function useMainKeywords(blogId: string) {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: KEYWORD_QUERY_KEYS.main(blogId),
    queryFn: async (): Promise<MainKeyword[]> => {
      const { data, error } = await supabase
        .from('main_keywords')
        .select('*')
        .eq('blog_id', blogId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    enabled: !!blogId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to fetch keywords',
        message: error.message,
      })
    },
  })
}

export function useKeywordVariations(mainKeywordId: string) {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: KEYWORD_QUERY_KEYS.variations(mainKeywordId),
    queryFn: async (): Promise<KeywordVariation[]> => {
      const { data, error } = await supabase
        .from('keyword_variations')
        .select('*')
        .eq('main_keyword_id', mainKeywordId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    enabled: !!mainKeywordId,
    staleTime: 2 * 60 * 1000,
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to fetch keyword variations',
        message: error.message,
      })
    },
  })
}

export function useKeywordOpportunities(blogId: string) {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: KEYWORD_QUERY_KEYS.opportunities(blogId),
    queryFn: async (): Promise<KeywordOpportunity[]> => {
      // First get the blog name
      const { data: blogData, error: blogError } = await supabase
        .from('blogs')
        .select('name')
        .eq('id', blogId)
        .single()

      if (blogError) {
        throw new Error(blogError.message)
      }

      const { data, error } = await supabase
        .from('keyword_opportunities')
        .select('*')
        .eq('blog_name', blogData.name)
        .order('opportunity_score', { ascending: false })
        .limit(100)

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    enabled: !!blogId,
    staleTime: 5 * 60 * 1000, // 5 minutes for opportunities
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to fetch keyword opportunities',
        message: error.message,
      })
    },
  })
}

export function useCreateMainKeyword() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async (keyword: MainKeywordInsert): Promise<MainKeyword> => {
      const { data, error } = await supabase
        .from('main_keywords')
        .insert(keyword)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: KEYWORD_QUERY_KEYS.main(data.blog_id) })
      queryClient.invalidateQueries({ queryKey: KEYWORD_QUERY_KEYS.opportunities(data.blog_id) })
      addNotification({
        type: 'success',
        title: 'Keyword created',
        message: `Successfully created keyword: ${data.keyword}`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to create keyword',
        message: error.message,
      })
    },
  })
}

export function useCreateKeywordVariation() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async (variation: KeywordVariationInsert): Promise<KeywordVariation> => {
      const { data, error } = await supabase
        .from('keyword_variations')
        .insert(variation)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: KEYWORD_QUERY_KEYS.variations(data.main_keyword_id) 
      })
      addNotification({
        type: 'success',
        title: 'Keyword variation created',
        message: `Successfully created variation: ${data.keyword}`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to create keyword variation',
        message: error.message,
      })
    },
  })
}

export function useUpdateMainKeyword() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<MainKeyword> 
    }): Promise<MainKeyword> => {
      const { data, error } = await supabase
        .from('main_keywords')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: KEYWORD_QUERY_KEYS.main(data.blog_id) })
      queryClient.invalidateQueries({ queryKey: KEYWORD_QUERY_KEYS.opportunities(data.blog_id) })
      queryClient.setQueryData(KEYWORD_QUERY_KEYS.detail(data.id), data)
      addNotification({
        type: 'success',
        title: 'Keyword updated',
        message: `Successfully updated: ${data.keyword}`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to update keyword',
        message: error.message,
      })
    },
  })
}

export function useDeleteMainKeyword() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async (id: string): Promise<{ id: string; blogId: string }> => {
      // First get the keyword to know which blog to invalidate
      const { data: keyword, error: fetchError } = await supabase
        .from('main_keywords')
        .select('blog_id')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      const { error } = await supabase
        .from('main_keywords')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }

      return { id, blogId: keyword.blog_id }
    },
    onSuccess: ({ id, blogId }) => {
      queryClient.invalidateQueries({ queryKey: KEYWORD_QUERY_KEYS.main(blogId) })
      queryClient.invalidateQueries({ queryKey: KEYWORD_QUERY_KEYS.opportunities(blogId) })
      queryClient.removeQueries({ queryKey: KEYWORD_QUERY_KEYS.detail(id) })
      addNotification({
        type: 'success',
        title: 'Keyword deleted',
        message: 'Keyword has been successfully deleted',
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to delete keyword',
        message: error.message,
      })
    },
  })
}

export function useMarkKeywordAsUsed() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async ({ 
      id, 
      isUsed 
    }: { 
      id: string; 
      isUsed: boolean 
    }): Promise<MainKeyword> => {
      const { data, error } = await supabase
        .from('main_keywords')
        .update({ is_used: isUsed })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: KEYWORD_QUERY_KEYS.main(data.blog_id) })
      queryClient.invalidateQueries({ queryKey: KEYWORD_QUERY_KEYS.opportunities(data.blog_id) })
      addNotification({
        type: 'success',
        title: 'Keyword status updated',
        message: `Keyword marked as ${data.is_used ? 'used' : 'unused'}`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to update keyword status',
        message: error.message,
      })
    },
  })
}

export function useKeywordOpportunityScore(keyword: MainKeyword) {
  return useQuery({
    queryKey: ['keyword-opportunity-score', keyword.id],
    queryFn: () => calculateKeywordOpportunityScore(
      keyword.msv,
      keyword.kw_difficulty,
      keyword.cpc
    ),
    enabled: !!(keyword.msv && keyword.kw_difficulty && keyword.cpc),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useKeywordRealtime(blogId: string) {
  const queryClient = useQueryClient()

  return {
    subscribe: () => {
      const channel = supabase
        .channel('keywords_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'main_keywords',
            filter: `blog_id=eq.${blogId}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: KEYWORD_QUERY_KEYS.main(blogId) })
            queryClient.invalidateQueries({ queryKey: KEYWORD_QUERY_KEYS.opportunities(blogId) })
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'keyword_variations',
          },
          () => {
            queryClient.invalidateQueries({ queryKey: KEYWORD_QUERY_KEYS.all })
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }
}