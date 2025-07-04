import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Database } from '@/types/database'
import { supabase } from '@/lib/supabase'

type Blog = Database['public']['Tables']['blogs']['Row']
type BlogInsert = Database['public']['Tables']['blogs']['Insert']
type BlogUpdate = Database['public']['Tables']['blogs']['Update']

interface BlogState {
  blogs: Blog[]
  selectedBlog: Blog | null
  loading: boolean
  error: string | null
  
  // Actions
  fetchBlogs: () => Promise<void>
  selectBlog: (blog: Blog) => void
  createBlog: (blog: BlogInsert) => Promise<Blog>
  updateBlog: (id: string, updates: BlogUpdate) => Promise<Blog>
  deleteBlog: (id: string) => Promise<void>
  clearError: () => void
  getBlogById: (id: string) => Blog | undefined
}

export const useBlogStore = create<BlogState>()(
  devtools(
    persist(
      (set, get) => ({
        blogs: [],
        selectedBlog: null,
        loading: false,
        error: null,

        fetchBlogs: async () => {
          set({ loading: true, error: null })
          try {
            const { data, error } = await supabase
              .from('blogs')
              .select('*')
              .eq('is_active', true)
              .order('created_at', { ascending: false })

            if (error) throw error

            set({ blogs: data, loading: false })
            
            // Auto-select first blog if none selected
            const currentSelected = get().selectedBlog
            if (!currentSelected && data.length > 0) {
              set({ selectedBlog: data[0] })
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch blogs',
              loading: false 
            })
          }
        },

        selectBlog: (blog) => {
          set({ selectedBlog: blog })
        },

        createBlog: async (blog) => {
          set({ loading: true, error: null })
          try {
            const { data, error } = await supabase
              .from('blogs')
              .insert(blog)
              .select()
              .single()

            if (error) throw error

            const currentBlogs = get().blogs
            set({ 
              blogs: [data, ...currentBlogs],
              loading: false 
            })

            return data
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to create blog',
              loading: false 
            })
            throw error
          }
        },

        updateBlog: async (id, updates) => {
          set({ loading: true, error: null })
          try {
            const { data, error } = await supabase
              .from('blogs')
              .update(updates)
              .eq('id', id)
              .select()
              .single()

            if (error) throw error

            const currentBlogs = get().blogs
            const updatedBlogs = currentBlogs.map(blog => 
              blog.id === id ? data : blog
            )

            const currentSelected = get().selectedBlog
            const updatedSelected = currentSelected?.id === id ? data : currentSelected

            set({ 
              blogs: updatedBlogs,
              selectedBlog: updatedSelected,
              loading: false 
            })

            return data
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to update blog',
              loading: false 
            })
            throw error
          }
        },

        deleteBlog: async (id) => {
          set({ loading: true, error: null })
          try {
            // Soft delete by setting is_active to false
            const { error } = await supabase
              .from('blogs')
              .update({ is_active: false })
              .eq('id', id)

            if (error) throw error

            const currentBlogs = get().blogs
            const filteredBlogs = currentBlogs.filter(blog => blog.id !== id)

            const currentSelected = get().selectedBlog
            const updatedSelected = currentSelected?.id === id ? 
              (filteredBlogs.length > 0 ? filteredBlogs[0] : null) : 
              currentSelected

            set({ 
              blogs: filteredBlogs,
              selectedBlog: updatedSelected,
              loading: false 
            })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to delete blog',
              loading: false 
            })
            throw error
          }
        },

        clearError: () => {
          set({ error: null })
        },

        getBlogById: (id) => {
          return get().blogs.find(blog => blog.id === id)
        }
      }),
      {
        name: 'blog-store',
        partialize: (state) => ({ 
          selectedBlog: state.selectedBlog 
        }),
      }
    ),
    {
      name: 'blog-store',
    }
  )
)