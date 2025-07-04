import type { WordPressPost, WordPressCategory, WordPressTag, WordPressMedia } from '@/types/wordpress'

export class WordPressApiClient {
  private baseUrl: string
  private username: string
  private password: string

  constructor(baseUrl: string, username: string, password: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '') // Remove trailing slash
    this.username = username
    this.password = password
  }

  private getAuthHeaders() {
    const credentials = btoa(`${this.username}:${this.password}`)
    return {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/wp-json/wp/v2${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Posts
  async getPosts(params: {
    per_page?: number
    page?: number
    search?: string
    status?: 'publish' | 'draft' | 'pending' | 'private'
    categories?: number[]
    tags?: number[]
  } = {}): Promise<WordPressPost[]> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          searchParams.append(key, value.join(','))
        } else {
          searchParams.append(key, String(value))
        }
      }
    })

    return this.request<WordPressPost[]>(`/posts?${searchParams}`)
  }

  async getPost(id: number): Promise<WordPressPost> {
    return this.request<WordPressPost>(`/posts/${id}`)
  }

  async createPost(post: Partial<WordPressPost>): Promise<WordPressPost> {
    return this.request<WordPressPost>('/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    })
  }

  async updatePost(id: number, post: Partial<WordPressPost>): Promise<WordPressPost> {
    return this.request<WordPressPost>(`/posts/${id}`, {
      method: 'POST',
      body: JSON.stringify(post),
    })
  }

  async deletePost(id: number, force = false): Promise<WordPressPost> {
    return this.request<WordPressPost>(`/posts/${id}?force=${force}`, {
      method: 'DELETE',
    })
  }

  // Categories
  async getCategories(params: {
    per_page?: number
    page?: number
    search?: string
  } = {}): Promise<WordPressCategory[]> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    })

    return this.request<WordPressCategory[]>(`/categories?${searchParams}`)
  }

  async createCategory(category: Partial<WordPressCategory>): Promise<WordPressCategory> {
    return this.request<WordPressCategory>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    })
  }

  // Tags
  async getTags(params: {
    per_page?: number
    page?: number
    search?: string
  } = {}): Promise<WordPressTag[]> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    })

    return this.request<WordPressTag[]>(`/tags?${searchParams}`)
  }

  async createTag(tag: Partial<WordPressTag>): Promise<WordPressTag> {
    return this.request<WordPressTag>('/tags', {
      method: 'POST',
      body: JSON.stringify(tag),
    })
  }

  // Media
  async getMedia(params: {
    per_page?: number
    page?: number
    search?: string
  } = {}): Promise<WordPressMedia[]> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    })

    return this.request<WordPressMedia[]>(`/media?${searchParams}`)
  }

  async uploadMedia(file: File, title?: string, altText?: string): Promise<WordPressMedia> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (title) formData.append('title', title)
    if (altText) formData.append('alt_text', altText)

    const response = await fetch(`${this.baseUrl}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${this.username}:${this.password}`)}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`WordPress Media upload error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Sync helpers
  async syncPost(localPost: {
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
  }, wordpressPostId?: number): Promise<WordPressPost> {
    const wpPost = {
      title: localPost.title,
      content: localPost.content,
      excerpt: localPost.excerpt || '',
      status: localPost.status,
      categories: localPost.categories || [],
      tags: localPost.tags || [],
      featured_media: localPost.featured_media || 0,
      meta: localPost.meta || {},
    }

    if (wordpressPostId) {
      return this.updatePost(wordpressPostId, wpPost)
    } else {
      return this.createPost(wpPost)
    }
  }

  async getPostBySlug(slug: string): Promise<WordPressPost | null> {
    const posts = await this.getPosts({ search: slug, per_page: 1 })
    return posts.length > 0 ? posts[0] : null
  }
}

export function createWordPressClient(
  baseUrl: string, 
  username: string, 
  password: string
): WordPressApiClient {
  return new WordPressApiClient(baseUrl, username, password)
}

export const getWordPressClientForBlog = (blog: {
  domain: string
  settings: any
}): WordPressApiClient => {
  // Try blog-specific settings first
  const { wordpress_username, wordpress_password } = blog.settings || {}
  
  if (wordpress_username && wordpress_password) {
    return createWordPressClient(
      `https://${blog.domain}`,
      wordpress_username,
      wordpress_password
    )
  }
  
  // Fall back to environment variables based on domain
  const blogKey = blog.domain.replace(/\./g, '').toUpperCase()
  const envUsername = process.env[`${blogKey}_WORDPRESS_USERNAME`]
  const envPassword = process.env[`${blogKey}_WORDPRESS_PASSWORD`]
  const envUrl = process.env[`${blogKey}_WORDPRESS_URL`]
  
  if (envUsername && envPassword) {
    return createWordPressClient(
      envUrl || `https://${blog.domain}`,
      envUsername,
      envPassword
    )
  }
  
  throw new Error(`WordPress credentials not configured for blog: ${blog.domain}`)
}

// Helper function to get WordPress client by domain name
export const getWordPressClientByDomain = (domain: string): WordPressApiClient => {
  // Map domain to environment variable prefix
  const domainMap: Record<string, string> = {
    'einsof7.com': 'EINSOF7',
    'opetmil.com': 'OPETMIL',
  }
  
  const envPrefix = domainMap[domain]
  if (!envPrefix) {
    throw new Error(`No WordPress configuration found for domain: ${domain}`)
  }
  
  const username = process.env[`${envPrefix}_WORDPRESS_USERNAME`]
  const password = process.env[`${envPrefix}_WORDPRESS_PASSWORD`]
  const url = process.env[`${envPrefix}_WORDPRESS_URL`]
  
  if (!username || !password) {
    throw new Error(`WordPress credentials not configured for domain: ${domain}`)
  }
  
  return createWordPressClient(
    url || `https://${domain}/wp-json/wp/v2`,
    username,
    password
  )
}