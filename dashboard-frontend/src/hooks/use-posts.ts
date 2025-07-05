'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotifications } from '@/store/ui-store'
import { supabase } from '@/lib/supabase'
import { getWordPressClient } from '@/lib/wordpress'

export interface ContentPost {
  id: string
  blog_id: string
  title: string
  content: string
  excerpt: string
  status: 'draft' | 'pending' | 'publish' | 'private'
  featured_image?: string
  author?: string
  categories: string[]
  tags: string[]
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
  custom_fields?: Record<string, unknown>
  wordpress_id?: string
  wordpress_sync: boolean
  publish_date?: string
  created_at: string
  updated_at: string
}

export interface CreatePostData {
  blog_id: string
  title: string
  content: string
  excerpt: string
  status: 'draft' | 'pending' | 'publish' | 'private'
  featured_image?: string
  author?: string
  categories: string[]
  tags: string[]
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
  custom_fields?: Record<string, unknown>
  wordpress_sync: boolean
  publish_date?: string
}

export interface UpdatePostData extends CreatePostData {
  id: string
}

export const POSTS_QUERY_KEYS = {
  all: ['posts'] as const,
  blogPosts: (blogId: string) => [...POSTS_QUERY_KEYS.all, 'blog', blogId] as const,
  post: (id: string) => [...POSTS_QUERY_KEYS.all, 'post', id] as const,
  search: (query: string) => [...POSTS_QUERY_KEYS.all, 'search', query] as const,
} as const

// Função utilitária para converter string[] para number[]
function toNumberArray(arr: string[] | undefined): number[] {
  if (!arr) return []
  return arr.map((v) => Number(v)).filter((n) => !isNaN(n))
}

export function useBlogPosts(blogId: string | null) {

  return useQuery({
    queryKey: POSTS_QUERY_KEYS.blogPosts(blogId ?? 'all'),
    queryFn: async (): Promise<ContentPost[]> => {
      if (!blogId) {
        // Buscar todos os posts de todos os blogs
        const { data, error } = await supabase
          .from('content_posts')
          .select('*')
          .order('updated_at', { ascending: false })
        if (error) throw new Error(error.message)
        return data || []
      } else {
        // Buscar posts de um blog específico
        const { data, error } = await supabase
          .from('content_posts')
          .select('*')
          .eq('blog_id', blogId)
          .order('updated_at', { ascending: false })
        if (error) throw new Error(error.message)
        return data || []
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function usePost(id: string) {
  return useQuery({
    queryKey: POSTS_QUERY_KEYS.post(id),
    queryFn: async (): Promise<ContentPost | null> => {
      if (!id) return null;

      try {
        const { data, error } = await supabase
          .from("content_posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            return null; // Post não encontrado
          }
          throw new Error(error.message);
        }

        return data;
      } catch (error) {
        throw new Error(
          `Failed to fetch post: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async (postData: CreatePostData): Promise<ContentPost> => {
      try {
        // Criar post no Supabase
        const { data, error } = await supabase
          .from('content_posts')
          .insert([postData])
          .select()
          .single()

        if (error) {
          throw new Error(error.message)
        }

        // Sincronizar com WordPress se habilitado
        if (postData.wordpress_sync && postData.status === 'publish') {
          try {
            const wpClient = await getWordPressClient(postData.blog_id)
            const wpPayload = {
              title: { rendered: postData.title },
              content: { rendered: postData.content, protected: false },
              excerpt: { rendered: postData.excerpt || '', protected: false },
              status: postData.status,
              featured_media: postData.featured_image ? Number(postData.featured_image) : undefined,
              categories: toNumberArray(postData.categories),
              tags: toNumberArray(postData.tags),
              meta: {
                seo_title: postData.seo_title,
                seo_description: postData.seo_description,
                focus_keyword: postData.seo_keywords?.[0],
                ...postData.custom_fields,
              },
            }
            const wpPost = await wpClient.createPost(wpPayload)

            // Atualizar com WordPress ID
            const { data: updatedData, error: updateError } = await supabase
              .from('content_posts')
              .update({ wordpress_id: wpPost.id.toString() })
              .eq('id', data.id)
              .select()
              .single()

            if (updateError) {
              console.error('Erro ao atualizar WordPress ID:', updateError)
            }

            return updatedData || data
          } catch (wpError) {
            console.error('Erro na sincronização WordPress:', wpError)
            addNotification({
              type: 'warning',
              title: 'Post criado com aviso',
              message: 'Post criado localmente, mas não foi possível sincronizar com WordPress.',
            })
          }
        }

        return data
      } catch (error) {
        throw new Error(`Failed to create post: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.blogPosts(data.blog_id) })
      addNotification({
        type: 'success',
        title: 'Post criado',
        message: 'Post criado com sucesso',
      })
    },
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async (postData: UpdatePostData): Promise<ContentPost> => {
      try {
        // Atualizar post no Supabase
        const { data, error } = await supabase
          .from('content_posts')
          .update(postData)
          .eq('id', postData.id)
          .select()
          .single()

        if (error) {
          throw new Error(error.message)
        }

        // Sincronizar com WordPress se habilitado
        if (postData.wordpress_sync && data.wordpress_id) {
          try {
            const wpClient = await getWordPressClient(postData.blog_id)
            const wpPayload = {
              title: { rendered: postData.title },
              content: { rendered: postData.content, protected: false },
              excerpt: { rendered: postData.excerpt || '', protected: false },
              status: postData.status,
              featured_media: postData.featured_image ? Number(postData.featured_image) : undefined,
              categories: toNumberArray(postData.categories),
              tags: toNumberArray(postData.tags),
              meta: {
                seo_title: postData.seo_title,
                seo_description: postData.seo_description,
                focus_keyword: postData.seo_keywords?.[0],
                ...postData.custom_fields,
              },
            }
            await wpClient.updatePost(data.wordpress_id, wpPayload)
          } catch (wpError) {
            console.error('Erro na sincronização WordPress:', wpError)
            addNotification({
              type: 'warning',
              title: 'Post atualizado com aviso',
              message: 'Post atualizado localmente, mas não foi possível sincronizar com WordPress.',
            })
          }
        }

        return data
      } catch (error) {
        throw new Error(`Failed to update post: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.blogPosts(data.blog_id) })
      queryClient.setQueryData(POSTS_QUERY_KEYS.post(data.id), data)
      addNotification({
        type: 'success',
        title: 'Post atualizado',
        message: 'Post atualizado com sucesso',
      })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async (postId: string): Promise<void> => {
      try {
        // Buscar post para verificar WordPress ID
        const { data: post, error: fetchError } = await supabase
          .from('content_posts')
          .select('wordpress_id, blog_id, wordpress_sync')
          .eq('id', postId)
          .single()

        if (fetchError) {
          throw new Error(fetchError.message)
        }

        // Excluir do WordPress se sincronizado
        if (post.wordpress_sync && post.wordpress_id) {
          try {
            const wpClient = await getWordPressClient(post.blog_id)
            await wpClient.deletePost(post.wordpress_id)
          } catch (wpError) {
            console.error('Erro ao excluir do WordPress:', wpError)
            addNotification({
              type: 'warning',
              title: 'Post excluído com aviso',
              message: 'Post excluído localmente, mas não foi possível excluir do WordPress.',
            })
          }
        }

        // Excluir do Supabase
        const { error } = await supabase
          .from('content_posts')
          .delete()
          .eq('id', postId)

        if (error) {
          throw new Error(error.message)
        }
      } catch (error) {
        throw new Error(`Failed to delete post: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.all })
      addNotification({
        type: 'success',
        title: 'Post excluído',
        message: 'Post excluído com sucesso',
      })
    },
  })
}

export function useSearchPosts(query: string) {
  return useQuery({
    queryKey: POSTS_QUERY_KEYS.search(query),
    queryFn: async (): Promise<ContentPost[]> => {
      if (!query.trim()) {
        return [];
      }

      try {
        const { data, error } = await supabase
          .from("content_posts")
          .select("*")
          .or(
            `title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`
          )
          .order("updated_at", { ascending: false })
          .limit(50);

        if (error) {
          throw new Error(error.message);
        }

        return data || [];
      } catch (error) {
        throw new Error(
          `Failed to search posts: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    enabled: !!query.trim(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useBulkUpdatePosts() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async ({
      postIds,
      updates,
    }: {
      postIds: string[]
      updates: Partial<ContentPost>
    }): Promise<void> => {
      try {
        const { error } = await supabase
          .from('content_posts')
          .update(updates)
          .in('id', postIds)

        if (error) {
          throw new Error(error.message)
        }
      } catch (error) {
        throw new Error(`Failed to bulk update posts: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.all })
      addNotification({
        type: 'success',
        title: 'Posts atualizados',
        message: 'Posts atualizados em lote com sucesso',
      })
    },
  })
}

export function usePostStats(blogId: string) {
  return useQuery({
    queryKey: ['post-stats', blogId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('content_posts')
          .select('status, created_at')
          .eq('blog_id', blogId)

        if (error) {
          throw new Error(error.message)
        }

        const stats = {
          total: data.length,
          published: data.filter(p => p.status === 'publish').length,
          drafts: data.filter(p => p.status === 'draft').length,
          pending: data.filter(p => p.status === 'pending').length,
          private: data.filter(p => p.status === 'private').length,
          thisMonth: data.filter(p => {
            const postDate = new Date(p.created_at)
            const now = new Date()
            return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear()
          }).length,
        }

        return stats
      } catch (error) {
        throw new Error(`Failed to fetch post stats: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}