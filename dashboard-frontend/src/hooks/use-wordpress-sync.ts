'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotifications } from '@/store/ui-store'
import { supabase } from '@/lib/supabase'
import { getWordPressClient } from '@/lib/wordpress'

export interface SyncResult {
  success: boolean
  message: string
  details?: {
    synced: number
    errors: number
    errorDetails?: string[]
  }
}

export interface SyncStatus {
  isRunning: boolean
  progress: number
  currentTask: string
  results?: SyncResult
}

export function useWordPressSync(blogId: string) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isRunning: false,
    progress: 0,
    currentTask: '',
  })

  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  // Testar conexão WordPress
  const testConnection = useMutation({
    mutationFn: async () => {
      try {
        const client = await getWordPressClient(blogId)
        await client.getPosts({ per_page: 1 })
        return { success: true, message: 'Conexão estabelecida com sucesso' }
      } catch (error) {
        throw new Error(`Erro na conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
      }
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Conexão WordPress',
        message: 'Conexão testada com sucesso',
      })
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Erro na conexão',
        message: error.message,
      })
    },
  })

  // Sincronizar post específico para WordPress
  const syncPostToWordPress = useMutation({
    mutationFn: async (postId: string) => {
      try {
        // Buscar post do Supabase
        const { data: post, error } = await supabase
          .from('content_posts')
          .select('*')
          .eq('id', postId)
          .single()

        if (error) {
          throw new Error(`Erro ao buscar post: ${error.message}`)
        }

        const client = await getWordPressClient(blogId)

        if (post.wordpress_id) {
          // Atualizar post existente
          const wpPost = await client.updatePost(parseInt(post.wordpress_id), {
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            status: post.status,
            categories: [], // TODO: Mapear categorias
            tags: [], // TODO: Mapear tags
            meta: {
              seo_title: post.seo_title,
              seo_description: post.seo_description,
              focus_keyword: post.seo_keywords?.[0],
            },
          })

          return { success: true, message: 'Post atualizado no WordPress', wpPost }
        } else {
          // Criar novo post
          const wpPost = await client.createPost({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            status: post.status,
            categories: [],
            tags: [],
            meta: {
              seo_title: post.seo_title,
              seo_description: post.seo_description,
              focus_keyword: post.seo_keywords?.[0],
            },
          })

          // Atualizar post no Supabase com WordPress ID
          const { error: updateError } = await supabase
            .from('content_posts')
            .update({ wordpress_id: wpPost.id.toString() })
            .eq('id', postId)

          if (updateError) {
            console.error('Erro ao atualizar WordPress ID:', updateError)
          }

          return { success: true, message: 'Post criado no WordPress', wpPost }
        }
      } catch (error) {
        throw new Error(`Erro na sincronização: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      addNotification({
        type: 'success',
        title: 'Sincronização completa',
        message: 'Post sincronizado com WordPress',
      })
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Erro na sincronização',
        message: error.message,
      })
    },
  })

  // Sincronizar post específico do WordPress para Supabase
  const syncPostFromWordPress = useMutation({
    mutationFn: async (wordpressId: number) => {
      try {
        const client = await getWordPressClient(blogId)
        const wpPost = await client.getPost(wordpressId)

        // Verificar se post já existe
        const { data: existingPost } = await supabase
          .from('content_posts')
          .select('id')
          .eq('wordpress_id', wordpressId.toString())
          .eq('blog_id', blogId)
          .single()

        const postData = {
          blog_id: blogId,
          title: wpPost.title,
          content: wpPost.content,
          excerpt: wpPost.excerpt,
          status: wpPost.status,
          wordpress_id: wpPost.id.toString(),
          wordpress_sync: true,
          seo_title: wpPost.meta?.seo_title,
          seo_description: wpPost.meta?.seo_description,
          seo_keywords: wpPost.meta?.focus_keyword ? [wpPost.meta.focus_keyword] : [],
          categories: [],
          tags: [],
          publish_date: wpPost.date,
        }

        if (existingPost) {
          // Atualizar post existente
          const { data, error } = await supabase
            .from('content_posts')
            .update(postData)
            .eq('id', existingPost.id)
            .select()
            .single()

          if (error) {
            throw new Error(`Erro ao atualizar post: ${error.message}`)
          }

          return { success: true, message: 'Post atualizado do WordPress', post: data }
        } else {
          // Criar novo post
          const { data, error } = await supabase
            .from('content_posts')
            .insert([postData])
            .select()
            .single()

          if (error) {
            throw new Error(`Erro ao criar post: ${error.message}`)
          }

          return { success: true, message: 'Post importado do WordPress', post: data }
        }
      } catch (error) {
        throw new Error(`Erro na importação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      addNotification({
        type: 'success',
        title: 'Importação completa',
        message: 'Post importado do WordPress',
      })
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Erro na importação',
        message: error.message,
      })
    },
  })

  // Sincronização em lote - Supabase para WordPress
  const syncAllToWordPress = useMutation({
    mutationFn: async () => {
      setSyncStatus({
        isRunning: true,
        progress: 0,
        currentTask: 'Iniciando sincronização...',
      })

      try {
        // Buscar posts para sincronizar
        const { data: posts, error } = await supabase
          .from('content_posts')
          .select('id, title, wordpress_sync')
          .eq('blog_id', blogId)
          .eq('wordpress_sync', true)

        if (error) {
          throw new Error(`Erro ao buscar posts: ${error.message}`)
        }

        if (!posts || posts.length === 0) {
          return { success: true, message: 'Nenhum post para sincronizar', details: { synced: 0, errors: 0 } }
        }

        const total = posts.length
        let synced = 0
        let errors = 0
        const errorDetails: string[] = []

        for (let i = 0; i < posts.length; i++) {
          const post = posts[i]
          setSyncStatus(prev => ({
            ...prev,
            progress: Math.round((i / total) * 100),
            currentTask: `Sincronizando: ${post.title}`,
          }))

          try {
            await syncPostToWordPress.mutateAsync(post.id)
            synced++
          } catch (error) {
            errors++
            errorDetails.push(`${post.title}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
          }
        }

        const result = {
          success: errors === 0,
          message: errors === 0 
            ? `${synced} posts sincronizados com sucesso` 
            : `${synced} posts sincronizados, ${errors} com erro`,
          details: { synced, errors, errorDetails }
        }

        setSyncStatus({
          isRunning: false,
          progress: 100,
          currentTask: 'Concluído',
          results: result,
        })

        return result
      } catch (error) {
        setSyncStatus({
          isRunning: false,
          progress: 0,
          currentTask: 'Erro',
          results: {
            success: false,
            message: error instanceof Error ? error.message : 'Erro desconhecido',
          },
        })
        throw error
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      addNotification({
        type: result.success ? 'success' : 'warning',
        title: 'Sincronização em lote',
        message: result.message,
      })
    },
  })

  // Sincronização em lote - WordPress para Supabase
  const syncAllFromWordPress = useMutation({
    mutationFn: async () => {
      setSyncStatus({
        isRunning: true,
        progress: 0,
        currentTask: 'Buscando posts do WordPress...',
      })

      try {
        const client = await getWordPressClient(blogId)
        const wpPosts = await client.getPosts({ per_page: 100 })

        if (!wpPosts || wpPosts.length === 0) {
          return { success: true, message: 'Nenhum post encontrado no WordPress', details: { synced: 0, errors: 0 } }
        }

        const total = wpPosts.length
        let synced = 0
        let errors = 0
        const errorDetails: string[] = []

        for (let i = 0; i < wpPosts.length; i++) {
          const wpPost = wpPosts[i]
          setSyncStatus(prev => ({
            ...prev,
            progress: Math.round((i / total) * 100),
            currentTask: `Importando: ${wpPost.title}`,
          }))

          try {
            await syncPostFromWordPress.mutateAsync(wpPost.id)
            synced++
          } catch (error) {
            errors++
            errorDetails.push(`${wpPost.title}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
          }
        }

        const result = {
          success: errors === 0,
          message: errors === 0 
            ? `${synced} posts importados com sucesso` 
            : `${synced} posts importados, ${errors} com erro`,
          details: { synced, errors, errorDetails }
        }

        setSyncStatus({
          isRunning: false,
          progress: 100,
          currentTask: 'Concluído',
          results: result,
        })

        return result
      } catch (error) {
        setSyncStatus({
          isRunning: false,
          progress: 0,
          currentTask: 'Erro',
          results: {
            success: false,
            message: error instanceof Error ? error.message : 'Erro desconhecido',
          },
        })
        throw error
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      addNotification({
        type: result.success ? 'success' : 'warning',
        title: 'Importação em lote',
        message: result.message,
      })
    },
  })

  // Obter configurações de sincronização
  const { data: syncSettings } = useQuery({
    queryKey: ['sync-settings', blogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('wordpress_app_password, auto_sync_enabled')
        .eq('id', blogId)
        .single()

      if (error) {
        throw new Error(`Erro ao buscar configurações: ${error.message}`)
      }

      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    syncStatus,
    setSyncStatus,
    syncSettings,
    testConnection,
    syncPostToWordPress,
    syncPostFromWordPress,
    syncAllToWordPress,
    syncAllFromWordPress,
    isTestingConnection: testConnection.isPending,
    isSyncingPost: syncPostToWordPress.isPending || syncPostFromWordPress.isPending,
    isSyncingAll: syncAllToWordPress.isPending || syncAllFromWordPress.isPending,
  }
}

export function useWordPressConnection(blogId: string) {
  const { data: connectionStatus, refetch } = useQuery({
    queryKey: ['wordpress-connection', blogId],
    queryFn: async () => {
      try {
        const client = await getWordPressClient(blogId)
        await client.getPosts({ per_page: 1 })
        return { connected: true, error: null }
      } catch (error) {
        return { 
          connected: false, 
          error: error instanceof Error ? error.message : 'Erro desconhecido' 
        }
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  })

  return {
    connectionStatus,
    refetchConnection: refetch,
    isConnected: connectionStatus?.connected ?? false,
    connectionError: connectionStatus?.error,
  }
}