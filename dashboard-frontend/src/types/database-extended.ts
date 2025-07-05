// Extended database types for complete blog management system

export interface MainKeyword {
  id: string
  blog_id: string
  keyword: string
  msv?: number
  kw_difficulty?: number
  cpc?: number
  competition?: 'LOW' | 'MEDIUM' | 'HIGH'
  search_intent?: 'informational' | 'commercial' | 'transactional' | 'navigational'
  is_used: boolean
  location?: string
  language?: string
  created_at?: string
  updated_at?: string
  embedding?: number[] // Vector embedding for semantic search
}

export interface KeywordVariation {
  id: string
  main_keyword_id: string
  variation: string
  search_volume?: number
  difficulty?: number
  relevance_score?: number
  created_at?: string
  embedding?: number[]
}

export interface KeywordCategory {
  id: string
  main_keyword_id: string
  category: string
  confidence_score?: number
  created_at?: string
}

export interface KeywordCluster {
  id: string
  main_keyword_id: string
  cluster_name: string
  cluster_keywords: string[]
  similarity_score?: number
  created_at?: string
}

export interface ContentOpportunityCategory {
  id: string
  blog_id: string
  main_keyword_id: string
  category: string
  opportunity_type: 'category_gap' | 'trending_topic' | 'competitor_analysis'
  priority: 'high' | 'medium' | 'low'
  estimated_traffic?: number
  content_angle?: string
  target_audience?: string
  created_at?: string
  is_used: boolean
}

export interface ContentOpportunityCluster {
  id: string
  blog_id: string
  main_keyword_id: string
  cluster_name: string
  opportunity_type: 'cluster_gap' | 'semantic_group' | 'topic_expansion'
  priority: 'high' | 'medium' | 'low'
  estimated_traffic?: number
  content_pillars: string[]
  target_keywords: string[]
  created_at?: string
  is_used: boolean
}

export interface ContentPost {
  id: string
  blog_id: string
  title: string
  content: string
  excerpt?: string
  status: 'draft' | 'published' | 'scheduled' | 'trash'
  slug: string
  wordpress_post_id?: number
  published_at?: string
  author_id: string
  word_count?: number
  reading_time?: number
  featured_image_url?: string
  categories?: string[]
  tags?: string[]
  seo_title?: string
  seo_description?: string
  focus_keyword?: string
  readability_score?: number
  seo_score?: number
  created_at?: string
  updated_at?: string
  embedding?: number[]
  main_keyword_id?: string
  opportunity_category_id?: string
  opportunity_cluster_id?: string
}

export interface MediaAsset {
  id: string
  blog_id: string
  filename: string
  original_name: string
  file_path: string
  file_url: string
  file_size: number
  mime_type: string
  width?: number
  height?: number
  alt_text?: string
  caption?: string
  wordpress_media_id?: number
  is_featured: boolean
  created_at?: string
  updated_at?: string
  post_id?: string
}

export interface Blog {
  id: string
  name: string
  domain: string
  niche?: string
  description?: string
  settings?: {
    wordpress_url?: string
    wordpress_username?: string
    wordpress_app_password?: string
    auto_sync?: boolean
    seo_enabled?: boolean
    realtime_sync?: boolean
  }
  is_active: boolean
  created_at?: string
  updated_at?: string
}

// Extended stats interfaces
export interface BlogStats {
  total_blogs: number
  keyword_variations: number
  content_posts: number
  opportunities: number
  media_assets: number
  published_posts: number
  draft_posts: number
  high_priority_opportunities: number
}

export interface KeywordStats {
  total_keywords: number
  total_variations: number
  total_categories: number
  total_clusters: number
  used_keywords: number
  avg_search_volume: number
  avg_difficulty: number
}

export interface ContentStats {
  total_posts: number
  published_posts: number
  draft_posts: number
  scheduled_posts: number
  avg_word_count: number
  avg_reading_time: number
  avg_seo_score: number
}

// Search and filter interfaces
export interface SearchFilters {
  blog_id?: string
  keyword?: string
  status?: string
  priority?: string
  opportunity_type?: string
  search_intent?: string
  competition?: string
  date_range?: {
    start: string
    end: string
  }
}

export interface SemanticSearchResult {
  id: string
  type: 'keyword' | 'post' | 'opportunity'
  title: string
  content: string
  similarity_score: number
  metadata: Record<string, any>
}

// WordPress integration interfaces
export interface WordPressSync {
  post_id: string
  wordpress_id: number
  sync_status: 'pending' | 'syncing' | 'success' | 'error'
  last_sync: string
  sync_direction: 'to_wp' | 'from_wp' | 'bidirectional'
  error_message?: string
}

export interface WordPressPost {
  id: number
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  status: string
  date: string
  modified: string
  slug: string
  link: string
  author: number
  featured_media: number
  categories: number[]
  tags: number[]
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number
      source_url: string
      alt_text: string
    }>
  }
}

// Editor interfaces
export interface EditorState {
  content: string
  title: string
  excerpt: string
  status: string
  seo_title: string
  seo_description: string
  focus_keyword: string
  categories: string[]
  tags: string[]
  featured_image?: MediaAsset
  scheduled_date?: string
}

export interface BulkEditOperation {
  post_ids: string[]
  operation: 'publish' | 'draft' | 'delete' | 'update_category' | 'update_tags'
  data?: {
    categories?: string[]
    tags?: string[]
    status?: string
  }
}