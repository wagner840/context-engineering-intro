import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useNotifications } from '@/store/ui-store'
import type { Database } from '@/types/database'

type Blog = Database['public']['Tables']['blogs']['Row']
type BlogInsert = Database['public']['Tables']['blogs']['Insert']
type BlogUpdate = Database['public']['Tables']['blogs']['Update']

export const BLOG_QUERY_KEYS = {
  all: ['blogs'] as const,
  lists: () => [...BLOG_QUERY_KEYS.all, 'list'] as const,
  list: (filters: string) => [...BLOG_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...BLOG_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...BLOG_QUERY_KEYS.details(), id] as const,
} as const

export function useBlogs() {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: BLOG_QUERY_KEYS.lists(),
    queryFn: async (): Promise<Blog[]> => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to fetch blogs',
        message: error.message,
      })
    },
  })
}

export function useBlog(id: string) {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: BLOG_QUERY_KEYS.detail(id),
    queryFn: async (): Promise<Blog> => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
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
        title: 'Failed to fetch blog',
        message: error.message,
      })
    },
  })
}

export function useCreateBlog() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async (blog: BlogInsert): Promise<Blog> => {
      const { data, error } = await supabase
        .from('blogs')
        .insert(blog)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.lists() })
      addNotification({
        type: 'success',
        title: 'Blog created',
        message: `Successfully created ${data.name}`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to create blog',
        message: error.message,
      })
    },
  })
}

export function useUpdateBlog() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: BlogUpdate }): Promise<Blog> => {
      const { data, error } = await supabase
        .from('blogs')
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
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.detail(data.id) })
      addNotification({
        type: 'success',
        title: 'Blog updated',
        message: `Successfully updated ${data.name}`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to update blog',
        message: error.message,
      })
    },
  })
}

export function useDeleteBlog() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('blogs')
        .update({ is_active: false })
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.lists() })
      addNotification({
        type: 'success',
        title: 'Blog deleted',
        message: 'Blog has been successfully deleted',
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to delete blog',
        message: error.message,
      })
    },
  })
}

export function useBlogRealtime() {
  const queryClient = useQueryClient()

  return {
    subscribe: () => {
      const channel = supabase
        .channel('blogs_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'blogs',
          },
          (payload) => {
            queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.lists() })
            
            if (payload.eventType === 'UPDATE' && payload.new) {
              queryClient.setQueryData(
                BLOG_QUERY_KEYS.detail(payload.new.id),
                payload.new
              )
            }
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }
}