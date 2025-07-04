export interface WordPressPost {
  id: number
  date: string
  date_gmt: string
  guid: {
    rendered: string
  }
  modified: string
  modified_gmt: string
  slug: string
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private'
  type: string
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  featured_media: number
  comment_status: 'open' | 'closed'
  ping_status: 'open' | 'closed'
  sticky: boolean
  template: string
  format: string
  meta: {
    seo_title?: string
    seo_description?: string
    focus_keyword?: string
    [key: string]: any
  }
  categories: number[]
  tags: number[]
}

export interface WordPressCategory {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: 'category'
  parent: number
  meta: any[]
}

export interface WordPressTag {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: 'post_tag'
  meta: any[]
}

export interface WordPressMedia {
  id: number
  date: string
  slug: string
  type: string
  link: string
  title: {
    rendered: string
  }
  author: number
  comment_status: 'open' | 'closed'
  ping_status: 'open' | 'closed'
  template: string
  meta: any[]
  description: {
    rendered: string
  }
  caption: {
    rendered: string
  }
  alt_text: string
  media_type: 'image' | 'file'
  mime_type: string
  media_details: {
    width: number
    height: number
    file: string
    sizes: {
      [key: string]: {
        file: string
        width: number
        height: number
        mime_type: string
        source_url: string
      }
    }
  }
  source_url: string
}

export interface WordPressUser {
  id: number
  name: string
  url: string
  description: string
  link: string
  slug: string
  avatar_urls: {
    [size: string]: string
  }
  meta: any[]
}

export interface WordPressApiError {
  code: string
  message: string
  data: {
    status: number
  }
}

export interface WordPressCreatePostRequest {
  title: string
  content: string
  excerpt?: string
  status?: 'publish' | 'future' | 'draft' | 'pending' | 'private'
  author?: number
  featured_media?: number
  categories?: number[]
  tags?: number[]
  meta?: {
    seo_title?: string
    seo_description?: string
    focus_keyword?: string
    [key: string]: any
  }
  slug?: string
  date?: string
}

export interface WordPressUpdatePostRequest extends Partial<WordPressCreatePostRequest> {
  id: number
}