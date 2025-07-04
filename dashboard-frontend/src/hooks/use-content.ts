import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useNotifications } from '@/store/ui-store'
import type { Database } from '@/types/database'

type ContentPost = Database['public']['Tables']['content_posts']['Row']
type ContentPostInsert = Database['public']['Tables']['content_posts']['Insert']
type ContentPostUpdate = Database['public']['Tables']['content_posts']['Update']
type ProductionPipelineItem = Database['public']['Views']['production_pipeline']['Row']

export const CONTENT_QUERY_KEYS = {
  all: ['content'] as const,
  posts: (blogId: string) => [...CONTENT_QUERY_KEYS.all, 'posts', blogId] as const,
  post: (id: string) => [...CONTENT_QUERY_KEYS.all, 'post', id] as const,
  pipeline: (blogId: string) => [...CONTENT_QUERY_KEYS.all, 'pipeline', blogId] as const,
  byStatus: (blogId: string, status: string) => [...CONTENT_QUERY_KEYS.posts(blogId), 'status', status] as const,
} as const

export function useContentPosts(blogId: string) {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: CONTENT_QUERY_KEYS.posts(blogId),
    queryFn: async (): Promise<ContentPost[]> => {
      const { data, error } = await supabase
        .from('content_posts')
        .select(`
          *,
          authors:author_id (
            id,
            name,
            email
          )
        `)
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
        title: 'Failed to fetch content posts',
        message: error.message,
      })
    },
  })
}

export function useContentPost(id: string) {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: CONTENT_QUERY_KEYS.post(id),
    queryFn: async (): Promise<ContentPost> => {
      const { data, error } = await supabase
        .from('content_posts')
        .select(`
          *,
          authors:author_id (
            id,
            name,
            email
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to fetch content post',
        message: error.message,
      })
    },
  })
}

export function useProductionPipeline(blogId: string) {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: CONTENT_QUERY_KEYS.pipeline(blogId),
    queryFn: async (): Promise<ProductionPipelineItem[]> => {
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
        .from('production_pipeline')
        .select('*')
        .eq('blog_name', blogData.name)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    enabled: !!blogId,
    staleTime: 1 * 60 * 1000, // 1 minute for pipeline
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to fetch production pipeline',
        message: error.message,
      })
    },
  })
}

export function useContentPostsByStatus(blogId: string, status: string) {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: CONTENT_QUERY_KEYS.byStatus(blogId, status),
    queryFn: async (): Promise<ContentPost[]> => {
      const { data, error } = await supabase
        .from('content_posts')
        .select(`
          *,
          authors:author_id (
            id,
            name,
            email
          )
        `)
        .eq('blog_id', blogId)
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    enabled: !!blogId && !!status,
    staleTime: 1 * 60 * 1000,
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to fetch content posts by status',
        message: error.message,
      })
    },
  })
}

export function useCreateContentPost() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async (post: ContentPostInsert): Promise<ContentPost> => {
      const { data, error } = await supabase
        .from('content_posts')
        .insert(post)
        .select(`
          *,
          authors:author_id (
            id,
            name,
            email
          )
        `)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEYS.posts(data.blog_id) })
      queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEYS.pipeline(data.blog_id) })
      addNotification({
        type: 'success',
        title: 'Content post created',
        message: `Successfully created: ${data.title}`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to create content post',
        message: error.message,
      })
    },
  })
}

export function useUpdateContentPost() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: ContentPostUpdate 
    }): Promise<ContentPost> => {
      const { data, error } = await supabase
        .from('content_posts')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          authors:author_id (
            id,
            name,
            email
          )
        `)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEYS.posts(data.blog_id) })
      queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEYS.pipeline(data.blog_id) })
      queryClient.setQueryData(CONTENT_QUERY_KEYS.post(data.id), data)
      addNotification({
        type: 'success',
        title: 'Content post updated',
        message: `Successfully updated: ${data.title}`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to update content post',
        message: error.message,
      })
    },
  })
}

export function useDeleteContentPost() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async (id: string): Promise<{ id: string; blogId: string }> => {
      // First get the post to know which blog to invalidate
      const { data: post, error: fetchError } = await supabase
        .from('content_posts')
        .select('blog_id')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      const { error } = await supabase
        .from('content_posts')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }

      return { id, blogId: post.blog_id }
    },
    onSuccess: ({ id, blogId }) => {
      queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEYS.posts(blogId) })
      queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEYS.pipeline(blogId) })
      queryClient.removeQueries({ queryKey: CONTENT_QUERY_KEYS.post(id) })
      addNotification({
        type: 'success',
        title: 'Content post deleted',
        message: 'Post has been successfully deleted',
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to delete content post',
        message: error.message,
      })
    },
  })
}

export function useUpdatePostStatus() {
  const updatePost = useUpdateContentPost()

  return useMutation({
    mutationFn: async ({ 
      id, 
      status 
    }: { 
      id: string; 
      status: string 
    }): Promise<ContentPost> => {
      const updates: ContentPostUpdate = { status }

      // Add timestamp for specific status changes
      if (status === 'published') {
        updates.published_at = new Date().toISOString()
      } else if (status === 'scheduled') {
        // This would need a scheduledAt parameter in a real implementation
      }

      return updatePost.mutateAsync({ id, updates })
    },
    onSuccess: updatePost.onSuccess,
    onError: updatePost.onError,
  })
}

export function useSchedulePost() {
  const updatePost = useUpdateContentPost()

  return useMutation({
    mutationFn: async ({ 
      id, 
      scheduledAt 
    }: { 
      id: string; 
      scheduledAt: string 
    }): Promise<ContentPost> => {
      return updatePost.mutateAsync({ 
        id, 
        updates: { 
          status: 'scheduled',
          scheduled_at: scheduledAt 
        } 
      })
    },
    onSuccess: updatePost.onSuccess,
    onError: updatePost.onError,
  })
}

export function usePublishPost() {
  const updatePost = useUpdateContentPost()

  return useMutation({
    mutationFn: async (id: string): Promise<ContentPost> => {
      return updatePost.mutateAsync({ 
        id, 
        updates: { 
          status: 'published',
          published_at: new Date().toISOString() 
        } 
      })
    },
    onSuccess: updatePost.onSuccess,
    onError: updatePost.onError,
  })
}

export function useContentStats(blogId: string) {
  const { data: posts } = useContentPosts(blogId)

  return {
    total: posts?.length || 0,
    draft: posts?.filter(p => p.status === 'draft').length || 0,
    review: posts?.filter(p => p.status === 'review').length || 0,
    scheduled: posts?.filter(p => p.status === 'scheduled').length || 0,
    published: posts?.filter(p => p.status === 'published').length || 0,
    archived: posts?.filter(p => p.status === 'archived').length || 0,
  }
}

export function useContentRealtime(blogId: string) {
  const queryClient = useQueryClient()

  return {
    subscribe: () => {
      const channel = supabase
        .channel('content_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'content_posts',
            filter: `blog_id=eq.${blogId}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEYS.posts(blogId) })
            queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEYS.pipeline(blogId) })
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }
}