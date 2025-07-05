import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useNotifications } from '@/store/ui-store'
import type { RealtimeChannel } from '@supabase/supabase-js'

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
      .on('postgres_changes' as any, { event, schema: 'public', table, filter }, (payload: any) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: [table] })
        
        // Show notification for important changes
        if (payload.eventType === 'INSERT') {
          addNotification({
            type: 'info',
            title: 'New Record',
            message: `New ${table.slice(0, -1)} created`,
          })
        }
      })
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
          queryClient.invalidateQueries({ queryKey: ['main-keywords', blogId] })
          queryClient.invalidateQueries({ queryKey: ['keyword-opportunities', blogId] })
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
          queryClient.invalidateQueries({ queryKey: ['content-posts', blogId] })
          queryClient.invalidateQueries({ queryKey: ['content-stats', blogId] })
          
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
          queryClient.invalidateQueries({ queryKey: ['serp-results', blogId] })
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
          queryClient.invalidateQueries({ queryKey: ['executions'] })
          queryClient.invalidateQueries({ queryKey: ['automation-overview'] })
          
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
          queryClient.invalidateQueries({ queryKey: ['executive-dashboard'] })
          queryClient.invalidateQueries({ queryKey: ['blogs'] })
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
          queryClient.invalidateQueries({ queryKey: ['executive-dashboard'] })
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
          queryClient.invalidateQueries({ queryKey: ['executive-dashboard'] })
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
  updateFn: (oldData: T | undefined, variables: Record<string, unknown>) => T | undefined
) {
  const queryClient = useQueryClient()

  const optimisticUpdate = (variables: Record<string, unknown>) => {
    queryClient.setQueryData<T>(queryKey, (oldData) => updateFn(oldData, variables))
  }

  const revert = () => {
    queryClient.invalidateQueries({ queryKey })
  }

  return { optimisticUpdate, revert }
}

// Hook for optimistic keyword updates
export function useOptimisticKeywords(blogId: string) {
  const queryClient = useQueryClient()

  const addKeyword = (keyword: Record<string, unknown>) => {
    queryClient.setQueryData(['main-keywords', blogId], (old: Record<string, unknown>[] = []) => [
      keyword,
      ...old
    ])
  }

  const updateKeyword = (keywordId: string, updates: Record<string, unknown>) => {
    queryClient.setQueryData(['main-keywords', blogId], (old: Record<string, unknown>[] = []) =>
      old.map(k => k.id === keywordId ? { ...k, ...updates } : k)
    )
  }

  const removeKeyword = (keywordId: string) => {
    queryClient.setQueryData(['main-keywords', blogId], (old: Record<string, unknown>[] = []) =>
      old.filter(k => k.id !== keywordId)
    )
  }

  const revertKeywords = () => {
    queryClient.invalidateQueries({ queryKey: ['main-keywords', blogId] })
  }

  return { addKeyword, updateKeyword, removeKeyword, revertKeywords }
}

// Hook for optimistic content updates
export function useOptimisticContent(blogId: string) {
  const queryClient = useQueryClient()

  const addPost = (post: Record<string, unknown>) => {
    queryClient.setQueryData(['content-posts', blogId], (old: Record<string, unknown>[] = []) => [
      post,
      ...old
    ])
  }

  const updatePost = (postId: string, updates: Record<string, unknown>) => {
    queryClient.setQueryData(['content-posts', blogId], (old: Record<string, unknown>[] = []) =>
      old.map(p => (p.id as string) === postId ? { ...p, ...updates } : p)
    )
  }

  const updatePostStatus = (postId: string, newStatus: string) => {
    queryClient.setQueryData(['content-posts', blogId], (old: Record<string, unknown>[] = []) =>
      old.map(p => (p.id as string) === postId ? { ...p, status: newStatus } : p)
    )
    
    // Update stats optimistically
    queryClient.setQueryData(['content-stats', blogId], (oldStats: Record<string, number>) => {
      if (!oldStats) return oldStats
      
      const updatedStats = { ...oldStats }
      updatedStats[newStatus] = (updatedStats[newStatus] || 0) + 1
      
      return updatedStats
    })
  }

  const removePost = (postId: string) => {
    queryClient.setQueryData(['content-posts', blogId], (old: Record<string, unknown>[] = []) =>
      old.filter(p => p.id !== postId)
    )
  }

  const revertContent = () => {
    queryClient.invalidateQueries({ queryKey: ['content-posts', blogId] })
    queryClient.invalidateQueries({ queryKey: ['content-stats', blogId] })
  }

  return { addPost, updatePost, updatePostStatus, removePost, revertContent }
}

// Hook for optimistic blog updates
export function useOptimisticBlogs() {
  const queryClient = useQueryClient()

  const updateBlog = (blogId: string, updates: Record<string, unknown>) => {
    queryClient.setQueryData(['blogs'], (old: Record<string, unknown>[] = []) =>
      old.map(b => b.id === blogId ? { ...b, ...updates } : b)
    )
    
    queryClient.setQueryData(['blog', blogId], (old: Record<string, unknown>) => 
      old ? { ...old, ...updates } : old
    )
  }

  const toggleBlogStatus = (blogId: string) => {
    queryClient.setQueryData(['blogs'], (old: { id: string, is_active: boolean }[] = []) =>
      old.map(b => b.id === blogId ? { ...b, is_active: !b.is_active } : b)
    )
  }

  const revertBlogs = () => {
    queryClient.invalidateQueries({ queryKey: ['blogs'] })
  }

  return { updateBlog, toggleBlogStatus, revertBlogs }
}