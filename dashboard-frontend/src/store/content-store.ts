import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Database } from '@/types/database'
import { supabase } from '@/lib/supabase'

type ContentPost = Database['public']['Tables']['content_posts']['Row']
type ContentPostInsert = Database['public']['Tables']['content_posts']['Insert']
type ContentPostUpdate = Database['public']['Tables']['content_posts']['Update']
type ProductionPipelineItem = Database['public']['Views']['production_pipeline']['Row']

type ContentStatus = 'draft' | 'review' | 'scheduled' | 'published' | 'archived'

interface ContentState {
  posts: ContentPost[]
  pipelineItems: ProductionPipelineItem[]
  selectedPost: ContentPost | null
  loading: boolean
  error: string | null
  filters: {
    status: ContentStatus | null
    author: string | null
    searchTerm: string
    dateRange: {
      start: string | null
      end: string | null
    }
  }

  // Actions
  fetchPosts: (blogId: string) => Promise<void>
  fetchPipelineItems: (blogId: string) => Promise<void>
  createPost: (post: ContentPostInsert) => Promise<ContentPost>
  updatePost: (id: string, updates: ContentPostUpdate) => Promise<ContentPost>
  deletePost: (id: string) => Promise<void>
  updatePostStatus: (id: string, status: ContentStatus) => Promise<void>
  schedulePost: (id: string, scheduledAt: string) => Promise<void>
  publishPost: (id: string) => Promise<void>
  selectPost: (post: ContentPost) => void
  setFilters: (filters: Partial<ContentState['filters']>) => void
  clearFilters: () => void
  clearError: () => void

  // Computed
  getFilteredPosts: () => ContentPost[]
  getPostsByStatus: (status: ContentStatus) => ContentPost[]
  getPostStats: () => {
    total: number
    draft: number
    review: number
    scheduled: number
    published: number
    archived: number
  }
  getPipelineStats: () => {
    byStatus: Record<ContentStatus, number>
    averageDaysInStatus: Record<ContentStatus, number>
  }
}

const initialFilters = {
  status: null,
  author: null,
  searchTerm: '',
  dateRange: {
    start: null,
    end: null,
  },
}

export const useContentStore = create<ContentState>()(
  devtools(
    (set, get) => ({
      posts: [],
      pipelineItems: [],
      selectedPost: null,
      loading: false,
      error: null,
      filters: initialFilters,

      fetchPosts: async (blogId: string) => {
        set({ loading: true, error: null })
        try {
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

          if (error) throw error
          set({ posts: data, loading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch posts',
            loading: false 
          })
        }
      },

      fetchPipelineItems: async (blogId: string) => {
        set({ loading: true, error: null })
        try {
          // First get the blog name to filter the view
          const { data: blogData, error: blogError } = await supabase
            .from('blogs')
            .select('name')
            .eq('id', blogId)
            .single()

          if (blogError) throw blogError

          const { data, error } = await supabase
            .from('production_pipeline')
            .select('*')
            .eq('blog_name', blogData.name)
            .order('created_at', { ascending: false })

          if (error) throw error
          set({ pipelineItems: data, loading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch pipeline items',
            loading: false 
          })
        }
      },

      createPost: async (post: ContentPostInsert) => {
        set({ loading: true, error: null })
        try {
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

          if (error) throw error

          const currentPosts = get().posts
          set({ 
            posts: [data, ...currentPosts],
            loading: false 
          })

          return data
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create post',
            loading: false 
          })
          throw error
        }
      },

      updatePost: async (id: string, updates: ContentPostUpdate) => {
        set({ loading: true, error: null })
        try {
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

          if (error) throw error

          const currentPosts = get().posts
          const updatedPosts = currentPosts.map(post => 
            post.id === id ? data : post
          )

          const currentSelected = get().selectedPost
          const updatedSelected = currentSelected?.id === id ? data : currentSelected

          set({ 
            posts: updatedPosts,
            selectedPost: updatedSelected,
            loading: false 
          })

          return data
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update post',
            loading: false 
          })
          throw error
        }
      },

      deletePost: async (id: string) => {
        set({ loading: true, error: null })
        try {
          const { error } = await supabase
            .from('content_posts')
            .delete()
            .eq('id', id)

          if (error) throw error

          const currentPosts = get().posts
          const filteredPosts = currentPosts.filter(post => post.id !== id)

          const currentSelected = get().selectedPost
          const updatedSelected = currentSelected?.id === id ? null : currentSelected

          set({ 
            posts: filteredPosts,
            selectedPost: updatedSelected,
            loading: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete post',
            loading: false 
          })
          throw error
        }
      },

      updatePostStatus: async (id: string, status: ContentStatus) => {
        try {
          await get().updatePost(id, { status })
        } catch (error) {
          throw error
        }
      },

      schedulePost: async (id: string, scheduledAt: string) => {
        try {
          await get().updatePost(id, { 
            status: 'scheduled',
            scheduled_at: scheduledAt 
          })
        } catch (error) {
          throw error
        }
      },

      publishPost: async (id: string) => {
        try {
          await get().updatePost(id, { 
            status: 'published',
            published_at: new Date().toISOString() 
          })
        } catch (error) {
          throw error
        }
      },

      selectPost: (post: ContentPost) => {
        set({ selectedPost: post })
      },

      setFilters: (newFilters: Partial<ContentState['filters']>) => {
        set({ 
          filters: { 
            ...get().filters, 
            ...newFilters 
          } 
        })
      },

      clearFilters: () => {
        set({ filters: initialFilters })
      },

      clearError: () => {
        set({ error: null })
      },

      // Computed getters
      getFilteredPosts: () => {
        const { posts, filters } = get()
        
        return posts.filter(post => {
          if (filters.status && post.status !== filters.status) {
            return false
          }
          if (filters.author && post.author_id !== filters.author) {
            return false
          }
          if (filters.searchTerm && !post.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
            return false
          }
          if (filters.dateRange.start && new Date(post.created_at) < new Date(filters.dateRange.start)) {
            return false
          }
          if (filters.dateRange.end && new Date(post.created_at) > new Date(filters.dateRange.end)) {
            return false
          }
          
          return true
        })
      },

      getPostsByStatus: (status: ContentStatus) => {
        return get().posts.filter(post => post.status === status)
      },

      getPostStats: () => {
        const posts = get().posts
        
        return {
          total: posts.length,
          draft: posts.filter(p => p.status === 'draft').length,
          review: posts.filter(p => p.status === 'review').length,
          scheduled: posts.filter(p => p.status === 'scheduled').length,
          published: posts.filter(p => p.status === 'published').length,
          archived: posts.filter(p => p.status === 'archived').length,
        }
      },

      getPipelineStats: () => {
        const pipelineItems = get().pipelineItems
        
        const byStatus = {
          draft: pipelineItems.filter(p => p.status === 'draft').length,
          review: pipelineItems.filter(p => p.status === 'review').length,
          scheduled: pipelineItems.filter(p => p.status === 'scheduled').length,
          published: pipelineItems.filter(p => p.status === 'published').length,
          archived: pipelineItems.filter(p => p.status === 'archived').length,
        } as Record<ContentStatus, number>

        const averageDaysInStatus = {
          draft: 0,
          review: 0,
          scheduled: 0,
          published: 0,
          archived: 0,
        } as Record<ContentStatus, number>

        // Calculate average days in status from pipeline view data
        Object.keys(byStatus).forEach(status => {
          const statusItems = pipelineItems.filter(p => p.status === status)
          if (statusItems.length > 0) {
            const totalDays = statusItems.reduce((sum, item) => 
              sum + (item.days_in_status || 0), 0
            )
            averageDaysInStatus[status as ContentStatus] = Math.round(totalDays / statusItems.length)
          }
        })

        return {
          byStatus,
          averageDaysInStatus,
        }
      }
    }),
    {
      name: 'content-store',
    }
  )
)