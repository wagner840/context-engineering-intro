import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useNotifications } from '@/store/ui-store'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

interface UseRealtimeOptions {
  table: string
  filter?: string
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  enabled?: boolean
}

export function useRealtime({ table, filter, event = '*', enabled = true }: UseRealtimeOptions) {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!enabled) return

    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table,
          filter,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          // Invalidate relevant queries
          queryClient.invalidateQueries([table])
          
          // Show notification for important changes
          if (payload.eventType === 'INSERT') {
            addNotification({
              type: 'info',
              title: 'New Record',
              message: `New ${table.slice(0, -1)} created`,
            })
          }
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [table, filter, event, enabled, queryClient, addNotification])

  return {
    unsubscribe: () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }
}

export function useBlogRealtime(blogId: string) {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  useEffect(() => {
    if (!blogId) return

    const channels: RealtimeChannel[] = []

    // Subscribe to main_keywords changes
    const keywordsChannel = supabase
      .channel(`keywords-${blogId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'main_keywords',
          filter: `blog_id=eq.${blogId}`,
        },
        () => {
          queryClient.invalidateQueries(['main-keywords', blogId])
          queryClient.invalidateQueries(['keyword-opportunities', blogId])
        }
      )
      .subscribe()

    // Subscribe to content_posts changes
    const postsChannel = supabase
      .channel(`posts-${blogId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_posts',
          filter: `blog_id=eq.${blogId}`,
        },
        (payload) => {
          queryClient.invalidateQueries(['content-posts', blogId])
          queryClient.invalidateQueries(['content-stats', blogId])
          
          if (payload.eventType === 'UPDATE') {
            const oldStatus = payload.old?.status
            const newStatus = payload.new?.status
            
            if (oldStatus !== newStatus && newStatus === 'published') {
              addNotification({
                type: 'success',
                title: 'Post Published',
                message: `"${payload.new?.title}" was published successfully`,
              })
            }
          }
        }
      )
      .subscribe()

    // Subscribe to serp_results changes
    const serpChannel = supabase
      .channel(`serp-${blogId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'serp_results',
          filter: `blog_id=eq.${blogId}`,
        },
        () => {
          queryClient.invalidateQueries(['serp-results', blogId])
        }
      )
      .subscribe()

    // Subscribe to automation_executions changes
    const automationChannel = supabase
      .channel(`automation-${blogId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'automation_executions',
          filter: `blog_id=eq.${blogId}`,
        },
        (payload) => {
          queryClient.invalidateQueries(['executions'])
          queryClient.invalidateQueries(['automation-overview'])
          
          if (payload.eventType === 'INSERT') {
            const status = payload.new?.status
            if (status === 'error') {
              addNotification({
                type: 'error',
                title: 'Automation Failed',
                message: `Workflow execution failed: ${payload.new?.workflow_name}`,
              })
            }
          }
        }
      )
      .subscribe()

    channels.push(keywordsChannel, postsChannel, serpChannel, automationChannel)

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel))
    }
  }, [blogId, queryClient, addNotification])
}

export function useExecutiveDashboardRealtime() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('executive-dashboard')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blogs',
        },
        () => {
          queryClient.invalidateQueries(['executive-dashboard'])
          queryClient.invalidateQueries(['blogs'])
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'main_keywords',
        },
        () => {
          queryClient.invalidateQueries(['executive-dashboard'])
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_posts',
        },
        () => {
          queryClient.invalidateQueries(['executive-dashboard'])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])
}

export function useOptimisticUpdate<T>(
  queryKey: (string | number)[],
  updateFn: (oldData: T | undefined, variables: any) => T | undefined
) {
  const queryClient = useQueryClient()

  const optimisticUpdate = (variables: any) => {
    queryClient.setQueryData<T>(queryKey, (oldData) => updateFn(oldData, variables))
  }

  const revert = () => {
    queryClient.invalidateQueries(queryKey)
  }

  return { optimisticUpdate, revert }
}

// Hook for optimistic keyword updates
export function useOptimisticKeywords(blogId: string) {
  const queryClient = useQueryClient()

  const addKeyword = (keyword: any) => {
    queryClient.setQueryData(['main-keywords', blogId], (old: any[] = []) => [
      keyword,
      ...old
    ])
  }

  const updateKeyword = (keywordId: string, updates: any) => {
    queryClient.setQueryData(['main-keywords', blogId], (old: any[] = []) =>
      old.map(k => k.id === keywordId ? { ...k, ...updates } : k)
    )
  }

  const removeKeyword = (keywordId: string) => {
    queryClient.setQueryData(['main-keywords', blogId], (old: any[] = []) =>
      old.filter(k => k.id !== keywordId)
    )
  }

  const revertKeywords = () => {
    queryClient.invalidateQueries(['main-keywords', blogId])
  }

  return { addKeyword, updateKeyword, removeKeyword, revertKeywords }
}

// Hook for optimistic content updates
export function useOptimisticContent(blogId: string) {
  const queryClient = useQueryClient()

  const addPost = (post: any) => {
    queryClient.setQueryData(['content-posts', blogId], (old: any[] = []) => [
      post,
      ...old
    ])
  }

  const updatePost = (postId: string, updates: any) => {
    queryClient.setQueryData(['content-posts', blogId], (old: any[] = []) =>
      old.map(p => p.id === postId ? { ...p, ...updates } : p)
    )
  }

  const updatePostStatus = (postId: string, newStatus: string) => {
    queryClient.setQueryData(['content-posts', blogId], (old: any[] = []) =>
      old.map(p => p.id === postId ? { ...p, status: newStatus } : p)
    )
    
    // Update stats optimistically
    queryClient.setQueryData(['content-stats', blogId], (oldStats: any) => {
      if (!oldStats) return oldStats
      
      const updatedStats = { ...oldStats }
      updatedStats[newStatus] = (updatedStats[newStatus] || 0) + 1
      
      return updatedStats
    })
  }

  const removePost = (postId: string) => {
    queryClient.setQueryData(['content-posts', blogId], (old: any[] = []) =>
      old.filter(p => p.id !== postId)
    )
  }

  const revertContent = () => {
    queryClient.invalidateQueries(['content-posts', blogId])
    queryClient.invalidateQueries(['content-stats', blogId])
  }

  return { addPost, updatePost, updatePostStatus, removePost, revertContent }
}

// Hook for optimistic blog updates
export function useOptimisticBlogs() {
  const queryClient = useQueryClient()

  const updateBlog = (blogId: string, updates: any) => {
    queryClient.setQueryData(['blogs'], (old: any[] = []) =>
      old.map(b => b.id === blogId ? { ...b, ...updates } : b)
    )
    
    queryClient.setQueryData(['blog', blogId], (old: any) => 
      old ? { ...old, ...updates } : old
    )
  }

  const toggleBlogStatus = (blogId: string) => {
    queryClient.setQueryData(['blogs'], (old: any[] = []) =>
      old.map(b => b.id === blogId ? { ...b, is_active: !b.is_active } : b)
    )
  }

  const revertBlogs = () => {
    queryClient.invalidateQueries(['blogs'])
  }

  return { updateBlog, toggleBlogStatus, revertBlogs }
}