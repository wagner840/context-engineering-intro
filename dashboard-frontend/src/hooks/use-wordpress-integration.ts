import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotifications } from '@/store/ui-store'

interface WordPressPost {
  id?: string
  blog_id: string
  title: string
  content: string
  excerpt?: string
  status: 'draft' | 'publish' | 'private'
  categories?: string[]
  tags?: string[]
  featured_image_url?: string
  meta_title?: string
  meta_description?: string
  target_keywords?: string[]
}

interface WordPressParams {
  blog_id: string
  status?: string
  limit?: number
  offset?: number
}

export function useWordPressPosts(params: WordPressParams) {
  return useQuery({
    queryKey: ['wordpress-posts', params.blog_id, params.status, params.limit, params.offset],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      searchParams.append('blog_id', params.blog_id)
      
      if (params.status) searchParams.append('status', params.status)
      if (params.limit) searchParams.append('limit', params.limit.toString())
      if (params.offset) searchParams.append('offset', params.offset.toString())

      const response = await fetch(`/api/wordpress/posts?${searchParams}`)

      if (!response.ok) {
        throw new Error('Failed to fetch WordPress posts')
      }

      return response.json()
    },
    enabled: !!params.blog_id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useWordPressPost(postId: string) {
  return useQuery({
    queryKey: ['wordpress-post', postId],
    queryFn: async () => {
      const response = await fetch(`/api/wordpress/posts/${postId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch WordPress post')
      }

      return response.json()
    },
    enabled: !!postId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useCreateWordPressPost() {
  const { addNotification } = useNotifications()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (post: WordPressPost) => {
      const response = await fetch('/api/wordpress/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create post')
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
      addNotification({
        type: 'success',
        title: 'Post created successfully',
        message: `"${variables.title}" has been created`,
      })

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['wordpress-posts', variables.blog_id] })
      queryClient.invalidateQueries({ queryKey: ['content-posts', variables.blog_id] })
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Failed to create post',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    },
  })
}

export function useUpdateWordPressPost() {
  const { addNotification } = useNotifications()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, post }: { postId: string; post: Partial<WordPressPost> }) => {
      const response = await fetch(`/api/wordpress/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update post')
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
      addNotification({
        type: 'success',
        title: 'Post updated successfully',
        message: 'Changes have been saved',
      })

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['wordpress-post', variables.postId] })
      queryClient.invalidateQueries({ queryKey: ['wordpress-posts'] })
      queryClient.invalidateQueries({ queryKey: ['content-posts'] })
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Failed to update post',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    },
  })
}

export function useDeleteWordPressPost() {
  const { addNotification } = useNotifications()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/wordpress/posts/${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete post')
      }

      return response.json()
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Post deleted successfully',
        message: 'Post has been removed',
      })

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['wordpress-posts'] })
      queryClient.invalidateQueries({ queryKey: ['content-posts'] })
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Failed to delete post',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    },
  })
}

export function useWordPressSync() {
  const { addNotification } = useNotifications()
  const queryClient = useQueryClient()

  const syncPost = useMutation({
    mutationFn: async ({ 
      postId, 
      blogId, 
      syncDirection = 'to_wordpress'
    }: { 
      postId: string
      blogId: string
      syncDirection?: 'to_wordpress' | 'from_wordpress'
    }) => {
      const response = await fetch(`/api/wordpress/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          blog_id: blogId,
          direction: syncDirection,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Sync failed')
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
      addNotification({
        type: 'success',
        title: 'Sync completed',
        message: `Post synchronized ${variables.syncDirection === 'to_wordpress' ? 'to' : 'from'} WordPress`,
      })

      queryClient.invalidateQueries({ queryKey: ['wordpress-posts', variables.blogId] })
      queryClient.invalidateQueries({ queryKey: ['content-posts', variables.blogId] })
      queryClient.invalidateQueries({ queryKey: ['wordpress-post', variables.postId] })
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Sync failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    },
  })

  const bulkSync = useMutation({
    mutationFn: async ({ 
      blogId, 
      syncDirection = 'to_wordpress',
      filters = {}
    }: { 
      blogId: string
      syncDirection?: 'to_wordpress' | 'from_wordpress'
      filters?: Record<string, any>
    }) => {
      const response = await fetch(`/api/wordpress/bulk-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blog_id: blogId,
          direction: syncDirection,
          filters,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Bulk sync failed')
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
      addNotification({
        type: 'success',
        title: 'Bulk sync completed',
        message: `${data.processed_count} posts synchronized`,
      })

      queryClient.invalidateQueries({ queryKey: ['wordpress-posts', variables.blogId] })
      queryClient.invalidateQueries({ queryKey: ['content-posts', variables.blogId] })
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Bulk sync failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    },
  })

  return {
    syncPost: syncPost.mutate,
    bulkSync: bulkSync.mutate,
    isLoading: syncPost.isPending || bulkSync.isPending,
    error: syncPost.error || bulkSync.error,
  }
}

export function useWordPressCategories(blogId: string) {
  return useQuery({
    queryKey: ['wordpress-categories', blogId],
    queryFn: async () => {
      const response = await fetch(`/api/wordpress/categories?blog_id=${blogId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }

      return response.json()
    },
    enabled: !!blogId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useWordPressTags(blogId: string) {
  return useQuery({
    queryKey: ['wordpress-tags', blogId],
    queryFn: async () => {
      const response = await fetch(`/api/wordpress/tags?blog_id=${blogId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch tags')
      }

      return response.json()
    },
    enabled: !!blogId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useWordPressMedia(blogId: string) {
  return useQuery({
    queryKey: ['wordpress-media', blogId],
    queryFn: async () => {
      const response = await fetch(`/api/wordpress/media?blog_id=${blogId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch media')
      }

      return response.json()
    },
    enabled: !!blogId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUploadWordPressMedia() {
  const { addNotification } = useNotifications()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      blogId, 
      file, 
      title, 
      altText 
    }: { 
      blogId: string
      file: File
      title?: string
      altText?: string 
    }) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('blog_id', blogId)
      
      if (title) formData.append('title', title)
      if (altText) formData.append('alt_text', altText)

      const response = await fetch('/api/wordpress/media', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
      addNotification({
        type: 'success',
        title: 'Media uploaded',
        message: `${variables.file.name} uploaded successfully`,
      })

      queryClient.invalidateQueries({ queryKey: ['wordpress-media', variables.blogId] })
    },
    onError: (error, variables) => {
      addNotification({
        type: 'error',
        title: 'Upload failed',
        message: `Failed to upload ${variables.file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    },
  })
}

// Utility hook for WordPress editor state
export function useWordPressEditor(postId?: string, blogId?: string) {
  const { data: post, isLoading: isLoadingPost } = useWordPressPost(postId || '')
  const createPost = useCreateWordPressPost()
  const updatePost = useUpdateWordPressPost()
  const deletePost = useDeleteWordPressPost()

  const savePost = (postData: WordPressPost) => {
    if (postId) {
      updatePost.mutate({ postId, post: postData })
    } else {
      createPost.mutate(postData)
    }
  }

  const removePost = () => {
    if (postId) {
      deletePost.mutate(postId)
    }
  }

  return {
    post: post?.data,
    isLoading: isLoadingPost || createPost.isPending || updatePost.isPending,
    isSaving: createPost.isPending || updatePost.isPending,
    isDeleting: deletePost.isPending,
    savePost,
    removePost,
    error: createPost.error || updatePost.error || deletePost.error,
  }
}