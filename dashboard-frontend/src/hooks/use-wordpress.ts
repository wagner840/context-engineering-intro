import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getWordPressClientForBlog, getWordPressClientByDomain } from '@/lib/wordpress'
import { useNotifications } from '@/store/ui-store'
import type { WordPressPost, WordPressCategory, WordPressTag, WordPressMedia } from '@/types/wordpress'
import type { Database } from '@/types/database'

type Blog = Database['public']['Tables']['blogs']['Row']

export function useWordPressPosts(blog: Blog) {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: ['wordpress-posts', blog.id],
    queryFn: async () => {
      try {
        const client = getWordPressClientForBlog(blog)
        return await client.getPosts({ per_page: 100 })
      } catch (error) {
        throw new Error(`Failed to fetch WordPress posts: ${error}`)
      }
    },
    enabled: !!blog.domain,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'WordPress API Error',
        message: error.message,
      })
    },
  })
}

export function useWordPressPost(blog: Blog, postId: number) {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: ['wordpress-post', blog.id, postId],
    queryFn: async () => {
      try {
        const client = getWordPressClientForBlog(blog)
        return await client.getPost(postId)
      } catch (error) {
        throw new Error(`Failed to fetch WordPress post: ${error}`)
      }
    },
    enabled: !!blog.domain && !!postId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'WordPress API Error',
        message: error.message,
      })
    },
  })
}

export function useWordPressCategories(blog: Blog) {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: ['wordpress-categories', blog.id],
    queryFn: async () => {
      try {
        const client = getWordPressClientForBlog(blog)
        return await client.getCategories({ per_page: 100 })
      } catch (error) {
        throw new Error(`Failed to fetch WordPress categories: ${error}`)
      }
    },
    enabled: !!blog.domain,
    staleTime: 10 * 60 * 1000, // 10 minutes
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'WordPress API Error',
        message: error.message,
      })
    },
  })
}

export function useWordPressTags(blog: Blog) {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: ['wordpress-tags', blog.id],
    queryFn: async () => {
      try {
        const client = getWordPressClientForBlog(blog)
        return await client.getTags({ per_page: 100 })
      } catch (error) {
        throw new Error(`Failed to fetch WordPress tags: ${error}`)
      }
    },
    enabled: !!blog.domain,
    staleTime: 10 * 60 * 1000, // 10 minutes
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'WordPress API Error',
        message: error.message,
      })
    },
  })
}

export function useCreateWordPressPost(blog: Blog) {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async (post: Partial<WordPressPost>) => {
      try {
        const client = getWordPressClientForBlog(blog)
        return await client.createPost(post)
      } catch (error) {
        throw new Error(`Failed to create WordPress post: ${error}`)
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['wordpress-posts', blog.id])
      addNotification({
        type: 'success',
        title: 'Post Created',
        message: `Successfully created post: ${data.title.rendered}`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to Create Post',
        message: error.message,
      })
    },
  })
}

export function useUpdateWordPressPost(blog: Blog) {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async ({ id, post }: { id: number; post: Partial<WordPressPost> }) => {
      try {
        const client = getWordPressClientForBlog(blog)
        return await client.updatePost(id, post)
      } catch (error) {
        throw new Error(`Failed to update WordPress post: ${error}`)
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['wordpress-posts', blog.id])
      queryClient.invalidateQueries(['wordpress-post', blog.id, data.id])
      addNotification({
        type: 'success',
        title: 'Post Updated',
        message: `Successfully updated post: ${data.title.rendered}`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to Update Post',
        message: error.message,
      })
    },
  })
}

export function useDeleteWordPressPost(blog: Blog) {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async ({ id, force = false }: { id: number; force?: boolean }) => {
      try {
        const client = getWordPressClientForBlog(blog)
        return await client.deletePost(id, force)
      } catch (error) {
        throw new Error(`Failed to delete WordPress post: ${error}`)
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['wordpress-posts', blog.id])
      addNotification({
        type: 'success',
        title: 'Post Deleted',
        message: `Successfully deleted post: ${data.title.rendered}`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to Delete Post',
        message: error.message,
      })
    },
  })
}

export function useSyncPostToWordPress(blog: Blog) {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async ({
      localPost,
      wordpressPostId,
    }: {
      localPost: {
        title: string
        content: string
        excerpt?: string
        status: string
        categories?: number[]
        tags?: number[]
        featured_media?: number
        meta?: {
          seo_title?: string
          seo_description?: string
          focus_keyword?: string
        }
      }
      wordpressPostId?: number
    }) => {
      try {
        const client = getWordPressClientForBlog(blog)
        return await client.syncPost(localPost, wordpressPostId)
      } catch (error) {
        throw new Error(`Failed to sync post to WordPress: ${error}`)
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['wordpress-posts', blog.id])
      if (data.id) {
        queryClient.invalidateQueries(['wordpress-post', blog.id, data.id])
      }
      addNotification({
        type: 'success',
        title: 'Post Synced',
        message: `Successfully synced post: ${data.title.rendered}`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to Sync Post',
        message: error.message,
      })
    },
  })
}

export function useCreateWordPressCategory(blog: Blog) {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async (category: Partial<WordPressCategory>) => {
      try {
        const client = getWordPressClientForBlog(blog)
        return await client.createCategory(category)
      } catch (error) {
        throw new Error(`Failed to create WordPress category: ${error}`)
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['wordpress-categories', blog.id])
      addNotification({
        type: 'success',
        title: 'Category Created',
        message: `Successfully created category: ${data.name}`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to Create Category',
        message: error.message,
      })
    },
  })
}

export function useCreateWordPressTag(blog: Blog) {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async (tag: Partial<WordPressTag>) => {
      try {
        const client = getWordPressClientForBlog(blog)
        return await client.createTag(tag)
      } catch (error) {
        throw new Error(`Failed to create WordPress tag: ${error}`)
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['wordpress-tags', blog.id])
      addNotification({
        type: 'success',
        title: 'Tag Created',
        message: `Successfully created tag: ${data.name}`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to Create Tag',
        message: error.message,
      })
    },
  })
}

export function useUploadWordPressMedia(blog: Blog) {
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async ({
      file,
      title,
      altText,
    }: {
      file: File
      title?: string
      altText?: string
    }) => {
      try {
        const client = getWordPressClientForBlog(blog)
        return await client.uploadMedia(file, title, altText)
      } catch (error) {
        throw new Error(`Failed to upload media to WordPress: ${error}`)
      }
    },
    onSuccess: (data) => {
      addNotification({
        type: 'success',
        title: 'Media Uploaded',
        message: `Successfully uploaded: ${data.title.rendered}`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to Upload Media',
        message: error.message,
      })
    },
  })
}

export function useWordPressConnectionTest(blog: Blog) {
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async () => {
      try {
        const client = getWordPressClientForBlog(blog)
        // Test connection by fetching a single post
        await client.getPosts({ per_page: 1 })
        return true
      } catch (error) {
        throw new Error(`WordPress connection test failed: ${error}`)
      }
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Connection Successful',
        message: `Successfully connected to WordPress site: ${blog.domain}`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Connection Failed',
        message: error.message,
      })
    },
  })
}