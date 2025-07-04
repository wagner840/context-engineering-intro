'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { useNotifications } from '@/store/ui-store'
import { useBlogStore } from '@/store/blog-store'

interface RealtimeEvent {
  table: string
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  old: Record<string, any> | null
  new: Record<string, any> | null
  timestamp: string
}

interface RealtimeContextType {
  isConnected: boolean
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
  subscribe: (table: string, callback: (event: RealtimeEvent) => void) => () => void
  unsubscribe: (table: string) => void
  events: RealtimeEvent[]
  clearEvents: () => void
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')
  const [events, setEvents] = useState<RealtimeEvent[]>([])
  const [subscriptions, setSubscriptions] = useState<Map<string, any>>(new Map())
  const [callbacks, setCallbacks] = useState<Map<string, Set<(event: RealtimeEvent) => void>>>(new Map())
  
  const { addNotification } = useNotifications()
  const { selectedBlog } = useBlogStore()
  const supabase = createSupabaseClient()

  const addEvent = useCallback((event: RealtimeEvent) => {
    setEvents(prev => [event, ...prev.slice(0, 99)]) // Keep last 100 events
  }, [])

  const clearEvents = useCallback(() => {
    setEvents([])
  }, [])

  const subscribe = useCallback((table: string, callback: (event: RealtimeEvent) => void) => {
    // Add callback to the set for this table
    setCallbacks(prev => {
      const newCallbacks = new Map(prev)
      if (!newCallbacks.has(table)) {
        newCallbacks.set(table, new Set())
      }
      newCallbacks.get(table)!.add(callback)
      return newCallbacks
    })

    // If this is the first subscription for this table, create the channel
    if (!subscriptions.has(table)) {
      const channel = supabase
        .channel(`realtime-${table}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
            filter: selectedBlog?.id ? `blog_id=eq.${selectedBlog.id}` : undefined,
          },
          (payload) => {
            const event: RealtimeEvent = {
              table,
              eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
              old: payload.old || null,
              new: payload.new || null,
              timestamp: new Date().toISOString(),
            }

            // Add to events list
            addEvent(event)

            // Call all callbacks for this table
            const tableCallbacks = callbacks.get(table)
            if (tableCallbacks) {
              tableCallbacks.forEach(cb => cb(event))
            }

            // Show notification for important events
            if (table === 'content_posts' || table === 'workflow_executions') {
              const action = payload.eventType.toLowerCase()
              const entityName = payload.new?.title || payload.new?.name || `${table} item`
              
              addNotification({
                type: 'info',
                title: `${table} ${action}d`,
                message: `${entityName} was ${action}d`,
              })
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true)
            setConnectionStatus('connected')
          } else if (status === 'CHANNEL_ERROR') {
            setConnectionStatus('error')
            addNotification({
              type: 'error',
              title: 'Realtime connection error',
              message: `Failed to subscribe to ${table} changes`,
            })
          }
        })

      setSubscriptions(prev => new Map(prev).set(table, channel))
    }

    // Return unsubscribe function
    return () => {
      setCallbacks(prev => {
        const newCallbacks = new Map(prev)
        const tableCallbacks = newCallbacks.get(table)
        if (tableCallbacks) {
          tableCallbacks.delete(callback)
          if (tableCallbacks.size === 0) {
            newCallbacks.delete(table)
            // Remove channel subscription if no more callbacks
            const channel = subscriptions.get(table)
            if (channel) {
              supabase.removeChannel(channel)
              setSubscriptions(prev => {
                const newSubs = new Map(prev)
                newSubs.delete(table)
                return newSubs
              })
            }
          }
        }
        return newCallbacks
      })
    }
  }, [supabase, subscriptions, callbacks, selectedBlog?.id, addEvent, addNotification])

  const unsubscribe = useCallback((table: string) => {
    const channel = subscriptions.get(table)
    if (channel) {
      supabase.removeChannel(channel)
      setSubscriptions(prev => {
        const newSubs = new Map(prev)
        newSubs.delete(table)
        return newSubs
      })
    }
    setCallbacks(prev => {
      const newCallbacks = new Map(prev)
      newCallbacks.delete(table)
      return newCallbacks
    })
  }, [supabase, subscriptions])

  // Initialize core subscriptions
  useEffect(() => {
    setConnectionStatus('connecting')
    
    // Subscribe to important tables
    const coreSubscriptions = [
      'content_posts',
      'main_keywords', 
      'workflow_executions',
      'blogs',
      'serp_results'
    ]

    const unsubscribeFunctions = coreSubscriptions.map(table => 
      subscribe(table, () => {}) // Empty callback for core subscriptions
    )

    return () => {
      unsubscribeFunctions.forEach(unsub => unsub())
    }
  }, [subscribe, selectedBlog?.id])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      subscriptions.forEach(channel => {
        supabase.removeChannel(channel)
      })
    }
  }, [supabase, subscriptions])

  // Monitor connection status
  useEffect(() => {
    const interval = setInterval(() => {
      if (subscriptions.size > 0) {
        setIsConnected(true)
        if (connectionStatus !== 'connected') {
          setConnectionStatus('connected')
        }
      } else {
        setIsConnected(false)
        if (connectionStatus === 'connected') {
          setConnectionStatus('disconnected')
        }
      }
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [subscriptions.size, connectionStatus])

  const value: RealtimeContextType = {
    isConnected,
    connectionStatus,
    subscribe,
    unsubscribe,
    events,
    clearEvents,
  }

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  )
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
}

// Specific hooks for common use cases
export function useRealtimeTable(
  table: string, 
  callback?: (event: RealtimeEvent) => void,
  enabled: boolean = true
) {
  const { subscribe } = useRealtime()
  
  useEffect(() => {
    if (!enabled || !callback) return

    const unsubscribe = subscribe(table, callback)
    return unsubscribe
  }, [table, callback, enabled, subscribe])
}

export function useRealtimeContentPosts(blogId: string, onUpdate?: (event: RealtimeEvent) => void) {
  const { subscribe } = useRealtime()
  
  useEffect(() => {
    if (!blogId) return

    const unsubscribe = subscribe('content_posts', (event) => {
      // Only handle events for the current blog
      if (event.new?.blog_id === blogId || event.old?.blog_id === blogId) {
        onUpdate?.(event)
      }
    })

    return unsubscribe
  }, [blogId, onUpdate, subscribe])
}

export function useRealtimeWorkflowExecutions(onUpdate?: (event: RealtimeEvent) => void) {
  const { subscribe } = useRealtime()
  
  useEffect(() => {
    const unsubscribe = subscribe('workflow_executions', (event) => {
      onUpdate?.(event)
    })

    return unsubscribe
  }, [onUpdate, subscribe])
}

export function useRealtimeKeywords(blogId: string, onUpdate?: (event: RealtimeEvent) => void) {
  const { subscribe } = useRealtime()
  
  useEffect(() => {
    if (!blogId) return

    const unsubscribe = subscribe('main_keywords', (event) => {
      // Only handle events for the current blog
      if (event.new?.blog_id === blogId || event.old?.blog_id === blogId) {
        onUpdate?.(event)
      }
    })

    return unsubscribe
  }, [blogId, onUpdate, subscribe])
}