export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          id: string;
          name: string;
          domain: string;
          niche: string | null;
          description: string | null;
          settings: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          domain: string;
          niche?: string | null;
          description?: string | null;
          settings?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          domain?: string;
          niche?: string | null;
          description?: string | null;
          settings?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      authors: {
        Row: {
          id: string;
          name: string;
          email: string;
          bio: string | null;
          avatar_url: string | null;
          social_links: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          bio?: string | null;
          avatar_url?: string | null;
          social_links?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          bio?: string | null;
          avatar_url?: string | null;
          social_links?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      main_keywords: {
        Row: {
          id: string;
          blog_id: string;
          keyword: string;
          msv: number | null;
          kw_difficulty: number | null;
          cpc: number | null;
          competition: string | null;
          search_intent: string | null;
          is_used: boolean;
          created_at: string;
          updated_at: string;
          location: string;
          language: string;
          search_limit: number;
        };
        Insert: {
          id?: string;
          blog_id: string;
          keyword: string;
          msv?: number | null;
          kw_difficulty?: number | null;
          cpc?: number | null;
          competition?: string | null;
          search_intent?: string | null;
          is_used?: boolean;
          created_at?: string;
          updated_at?: string;
          location?: string;
          language?: string;
          search_limit?: number;
        };
        Update: {
          id?: string;
          blog_id?: string;
          keyword?: string;
          msv?: number | null;
          kw_difficulty?: number | null;
          cpc?: number | null;
          competition?: string | null;
          search_intent?: string | null;
          is_used?: boolean;
          created_at?: string;
          updated_at?: string;
          location?: string;
          language?: string;
          search_limit?: number;
        };
      };
      keyword_variations: {
        Row: {
          id: string;
          main_keyword_id: string;
          keyword: string;
          variation_type: string | null;
          msv: number | null;
          kw_difficulty: number | null;
          cpc: number | null;
          competition: string | null;
          search_intent: string | null;
          embedding: number[] | null;
          created_at: string;
          updated_at: string;
          answer: string | null;
        };
        Insert: {
          id?: string;
          main_keyword_id: string;
          keyword: string;
          variation_type?: string | null;
          msv?: number | null;
          kw_difficulty?: number | null;
          cpc?: number | null;
          competition?: string | null;
          search_intent?: string | null;
          embedding?: number[] | null;
          created_at?: string;
          updated_at?: string;
          answer?: string | null;
        };
        Update: {
          id?: string;
          main_keyword_id?: string;
          keyword?: string;
          variation_type?: string | null;
          msv?: number | null;
          kw_difficulty?: number | null;
          cpc?: number | null;
          competition?: string | null;
          search_intent?: string | null;
          embedding?: number[] | null;
          created_at?: string;
          updated_at?: string;
          answer?: string | null;
        };
      };
      content_posts: {
        Row: {
          id: string;
          blog_id: string;
          author_id: string;
          title: string;
          slug: string | null;
          excerpt: string | null;
          content: string | null;
          status: string;
          featured_image_url: string | null;
          seo_title: string | null;
          seo_description: string | null;
          focus_keyword: string | null;
          readability_score: number | null;
          seo_score: number | null;
          word_count: number;
          reading_time: number;
          scheduled_at: string | null;
          published_at: string | null;
          embedding: number[] | null;
          created_at: string;
          updated_at: string;
          wordpress_post_id: number | null;
        };
        Insert: {
          id?: string;
          blog_id: string;
          author_id: string;
          title: string;
          slug?: string | null;
          excerpt?: string | null;
          content?: string | null;
          status?: string;
          featured_image_url?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          focus_keyword?: string | null;
          readability_score?: number | null;
          seo_score?: number | null;
          word_count?: number;
          reading_time?: number;
          scheduled_at?: string | null;
          published_at?: string | null;
          embedding?: number[] | null;
          created_at?: string;
          updated_at?: string;
          wordpress_post_id?: number | null;
        };
        Update: {
          id?: string;
          blog_id?: string;
          author_id?: string;
          title?: string;
          slug?: string | null;
          excerpt?: string | null;
          content?: string | null;
          status?: string;
          featured_image_url?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          focus_keyword?: string | null;
          readability_score?: number | null;
          seo_score?: number | null;
          word_count?: number;
          reading_time?: number;
          scheduled_at?: string | null;
          published_at?: string | null;
          embedding?: number[] | null;
          created_at?: string;
          updated_at?: string;
          wordpress_post_id?: number | null;
        };
      };
      keyword_clusters: {
        Row: {
          id: string;
          blog_id: string;
          cluster_name: string;
          description: string | null;
          cluster_score: number | null;
          embedding: number[] | null;
          created_at: string;
          updated_at: string;
          main_keyword_id: string | null;
        };
        Insert: {
          id?: string;
          blog_id: string;
          cluster_name: string;
          description?: string | null;
          cluster_score?: number | null;
          embedding?: number[] | null;
          created_at?: string;
          updated_at?: string;
          main_keyword_id?: string | null;
        };
        Update: {
          id?: string;
          blog_id?: string;
          cluster_name?: string;
          description?: string | null;
          cluster_score?: number | null;
          embedding?: number[] | null;
          created_at?: string;
          updated_at?: string;
          main_keyword_id?: string | null;
        };
      };
      content_opportunities_clusters: {
        Row: {
          id: string;
          blog_id: string;
          cluster_id: string;
          title: string;
          description: string | null;
          content_type: string;
          priority_score: number;
          estimated_traffic: number;
          difficulty_score: number;
          status: string;
          target_keywords: string[];
          content_outline: string | null;
          notes: string | null;
          assigned_to: string | null;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          blog_id: string;
          cluster_id: string;
          title: string;
          description?: string | null;
          content_type?: string;
          priority_score?: number;
          estimated_traffic?: number;
          difficulty_score?: number;
          status?: string;
          target_keywords?: string[];
          content_outline?: string | null;
          notes?: string | null;
          assigned_to?: string | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          blog_id?: string;
          cluster_id?: string;
          title?: string;
          description?: string | null;
          content_type?: string;
          priority_score?: number;
          estimated_traffic?: number;
          difficulty_score?: number;
          status?: string;
          target_keywords?: string[];
          content_outline?: string | null;
          notes?: string | null;
          assigned_to?: string | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      serp_results: {
        Row: {
          id: string;
          main_keyword_id: string;
          position: number;
          title: string | null;
          url: string | null;
          description: string | null;
          domain: string | null;
          type: string;
          features: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          main_keyword_id: string;
          position: number;
          title?: string | null;
          url?: string | null;
          description?: string | null;
          domain?: string | null;
          type?: string;
          features?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          main_keyword_id?: string;
          position?: number;
          title?: string | null;
          url?: string | null;
          description?: string | null;
          domain?: string | null;
          type?: string;
          features?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      analytics_metrics: {
        Row: {
          id: string;
          blog_id: string;
          metric_name: string;
          metric_value: number;
          metric_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          blog_id: string;
          metric_name: string;
          metric_value: number;
          metric_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          blog_id?: string;
          metric_name?: string;
          metric_value?: number;
          metric_date?: string;
          created_at?: string;
        };
      };
      media_assets: {
        Row: {
          id: string;
          blog_id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          file_size: number | null;
          alt_text: string | null;
          caption: string | null;
          wordpress_media_id: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          blog_id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          file_size?: number | null;
          alt_text?: string | null;
          caption?: string | null;
          wordpress_media_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          blog_id?: string;
          file_name?: string;
          file_url?: string;
          file_type?: string;
          file_size?: number | null;
          alt_text?: string | null;
          caption?: string | null;
          wordpress_media_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_categories: {
        Row: {
          id: string;
          blog_id: string;
          name: string;
          slug: string;
          description: string | null;
          wordpress_category_id: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          blog_id: string;
          name: string;
          slug: string;
          description?: string | null;
          wordpress_category_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          blog_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          wordpress_category_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_tags: {
        Row: {
          id: string;
          blog_id: string;
          name: string;
          slug: string;
          description: string | null;
          wordpress_tag_id: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          blog_id: string;
          name: string;
          slug: string;
          description?: string | null;
          wordpress_tag_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          blog_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          wordpress_tag_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      keyword_categories: {
        Row: {
          id: string;
          blog_id: string;
          keyword_variation_id: string | null;
          name: string;
          description: string | null;
          color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          blog_id: string;
          keyword_variation_id?: string | null;
          name: string;
          description?: string | null;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          blog_id?: string;
          keyword_variation_id?: string | null;
          name?: string;
          description?: string | null;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cluster_keywords: {
        Row: {
          id: string;
          cluster_id: string;
          keyword_variation_id: string;
          relevance_score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          cluster_id: string;
          keyword_variation_id: string;
          relevance_score?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          cluster_id?: string;
          keyword_variation_id?: string;
          relevance_score?: number | null;
          created_at?: string;
        };
      };
      content_opportunities_categories: {
        Row: {
          id: string;
          blog_id: string;
          keyword_category_id: string;
          title: string;
          description: string | null;
          content_type: string;
          priority_score: number;
          estimated_traffic: number | null;
          difficulty_score: number | null;
          status: string;
          target_keywords: string[];
          content_outline: string | null;
          notes: string | null;
          assigned_to: string | null;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          blog_id: string;
          keyword_category_id: string;
          title: string;
          description?: string | null;
          content_type?: string;
          priority_score?: number;
          estimated_traffic?: number | null;
          difficulty_score?: number | null;
          status?: string;
          target_keywords?: string[];
          content_outline?: string | null;
          notes?: string | null;
          assigned_to?: string | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          blog_id?: string;
          keyword_category_id?: string;
          title?: string;
          description?: string | null;
          content_type?: string;
          priority_score?: number;
          estimated_traffic?: number | null;
          difficulty_score?: number | null;
          status?: string;
          target_keywords?: string[];
          content_outline?: string | null;
          notes?: string | null;
          assigned_to?: string | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      executive_dashboard: {
        Row: {
          blog_name: string;
          niche: string | null;
          total_keywords: number;
          total_variations: number;
          total_clusters: number;
          total_posts: number;
          published_posts: number;
          used_keywords: number;
          avg_msv: number;
          avg_difficulty: number;
          avg_cpc: number;
          total_opportunities: number;
        };
      };
      keyword_opportunities: {
        Row: {
          blog_name: string;
          keyword: string;
          msv: number | null;
          kw_difficulty: number | null;
          cpc: number | null;
          competition: string | null;
          search_intent: string | null;
          is_used: boolean;
          opportunity_score: number;
          variations_count: number;
          serp_results_count: number;
          priority_level: string;
        };
      };
      production_pipeline: {
        Row: {
          blog_name: string;
          title: string;
          status: string;
          word_count: number;
          seo_score: number | null;
          readability_score: number | null;
          author_name: string;
          scheduled_at: string | null;
          published_at: string | null;
          created_at: string;
          days_in_status: number | null;
        };
      };
      serp_competition_analysis: {
        Row: {
          keyword: string;
          position: number;
          url: string;
          title: string;
          domain: string;
          competition_level: string;
          opportunity_score: number;
        };
      };
    };
    Functions: {
      find_similar_keywords: {
        Args: {
          query_embedding: number[];
          match_threshold: number;
          match_count: number;
          blog_id?: string;
        };
        Returns: {
          id: string;
          keyword: string;
          similarity: number;
        }[];
      };
      calculate_keyword_opportunity_score: {
        Args: {
          msv: number | null;
          kw_difficulty: number | null;
          cpc: number | null;
        };
        Returns: number;
      };
      find_similar_posts: {
        Args: {
          query_embedding: number[];
          match_threshold: number;
          match_count: number;
          blog_id?: string;
        };
        Returns: {
          id: string;
          title: string;
          similarity: number;
        }[];
      };
    };
  };
}

// Types para todas as tabelas do banco PAWA
export interface Blog {
  id: string;
  name: string;
  domain: string;
  niche?: string;
  description?: string;
  settings?: Record<string, any>;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  social_links?: Record<string, any>;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MainKeyword {
  id: string;
  blog_id: string;
  keyword: string;
  msv?: number;
  kw_difficulty?: number;
  cpc?: number;
  competition?: "LOW" | "MEDIUM" | "HIGH";
  search_intent?:
    | "informational"
    | "navigational"
    | "commercial"
    | "transactional";
  is_used?: boolean;
  location?: string;
  language?: string;
  search_limit?: number;
  created_at?: string;
  updated_at?: string;
}

export interface KeywordVariation {
  id: string;
  main_keyword_id: string;
  keyword: string;
  variation_type?:
    | "related"
    | "suggestion"
    | "idea"
    | "autocomplete"
    | "subtopic"
    | "people_also_ask";
  msv?: number;
  kw_difficulty?: number;
  cpc?: number;
  competition?: "LOW" | "MEDIUM" | "HIGH";
  search_intent?:
    | "informational"
    | "navigational"
    | "commercial"
    | "transactional";
  embedding?: number[];
  answer?: string;
  created_at?: string;
  updated_at?: string;
}

export interface KeywordCluster {
  id: string;
  blog_id: string;
  main_keyword_id?: string;
  cluster_name: string;
  description?: string;
  cluster_score?: number;
  embedding?: number[];
  created_at?: string;
  updated_at?: string;
}

export interface KeywordCategory {
  id: string;
  blog_id: string;
  name: string;
  description?: string;
  keyword_variation_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContentPost {
  id: string;
  blog_id: string;
  author_id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  status?: "draft" | "review" | "scheduled" | "published" | "archived";
  featured_image_url?: string;
  seo_title?: string;
  seo_description?: string;
  focus_keyword?: string;
  readability_score?: number;
  seo_score?: number;
  word_count?: number;
  reading_time?: number;
  scheduled_at?: string;
  published_at?: string;
  wordpress_post_id?: number;
  embedding?: number[];
  created_at?: string;
  updated_at?: string;
}

export interface SerpResult {
  id: string;
  main_keyword_id: string;
  position: number;
  title?: string;
  url?: string;
  description?: string;
  domain?: string;
  type?: string;
  features?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ContentOpportunityCluster {
  id: string;
  blog_id: string;
  cluster_id: string;
  main_keyword_id?: string;
  title: string;
  description?: string;
  final_title?: string;
  final_description?: string;
  content_type?: string;
  priority_score?: number;
  estimated_traffic?: number;
  difficulty_score?: number;
  status?: "identified" | "planned" | "in_progress" | "completed" | "cancelled";
  target_keywords?: string[];
  content_outline?: string;
  notes?: string;
  assigned_to?: string;
  due_date?: string;
  embedding?: number[];
  created_at?: string;
  updated_at?: string;
}

export interface ContentOpportunityCategory {
  id: string;
  blog_id: string;
  category_id: string;
  main_keyword_id?: string;
  title: string;
  description?: string;
  priority_score?: number;
  estimated_traffic?: number;
  difficulty_score?: number;
  status?: "identified" | "planned" | "in_progress" | "completed" | "cancelled";
  target_keywords?: string[];
  content_outline?: string;
  notes?: string;
  assigned_to?: string;
  due_date?: string;
  embedding?: number[];
  created_at?: string;
  updated_at?: string;
}

export interface MediaAsset {
  id: string;
  blog_id: string;
  post_id?: string;
  filename?: string;
  original_filename?: string;
  file_path?: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  mime_type?: string;
  alt_text?: string;
  caption?: string;
  metadata?: Record<string, any>;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BlogCategory {
  id: string;
  blog_id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BlogTag {
  id: string;
  blog_id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AnalyticsMetrics {
  id: string;
  blog_id: string;
  post_id?: string;
  metric_type: string;
  metric_value: number;
  metric_date: string;
  additional_data?: Record<string, any>;
  created_at?: string;
}

export interface PostMeta {
  id: string;
  post_id: string;
  meta_key: string;
  meta_value?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClusterKeyword {
  id: string;
  cluster_id: string;
  keyword_variations: string;
  embedding?: number[];
  created_at?: string;
  updated_at?: string;
}

export interface Document {
  id: number;
  content?: string;
  metadata?: Record<string, any>;
  embedding?: number[];
}

export interface DocumentMetadata {
  id: string;
  title?: string;
  url?: string;
  created_at?: string;
  schema?: string;
}

export interface DocumentRow {
  id: number;
  dataset_id?: string;
  row_data?: Record<string, any>;
}

// Types para relacionamentos
export interface BlogWithKeywords extends Blog {
  keywords?: MainKeyword[];
  posts?: ContentPost[];
  authors?: Author[];
}

export interface KeywordWithVariations extends MainKeyword {
  variations?: KeywordVariation[];
  serp_results?: SerpResult[];
  clusters?: KeywordCluster[];
}

export interface PostWithMeta extends ContentPost {
  meta?: PostMeta[];
  categories?: string[];
  tags?: string[];
  media?: MediaAsset[];
  analytics?: AnalyticsMetrics[];
}

// Types para API responses
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface KeywordSearchFilters {
  blog_id?: string;
  search?: string;
  competition?: "LOW" | "MEDIUM" | "HIGH";
  search_intent?:
    | "informational"
    | "navigational"
    | "commercial"
    | "transactional";
  min_msv?: number;
  max_msv?: number;
  min_difficulty?: number;
  max_difficulty?: number;
  is_used?: boolean;
  location?: string;
  language?: string;
}

export interface ContentFilters {
  blog_id?: string;
  author_id?: string;
  status?: "draft" | "review" | "scheduled" | "published" | "archived";
  search?: string;
  category?: string;
  tag?: string;
  date_from?: string;
  date_to?: string;
}

export interface OpportunityFilters {
  blog_id?: string;
  status?: "identified" | "planned" | "in_progress" | "completed" | "cancelled";
  assigned_to?: string;
  priority_min?: number;
  priority_max?: number;
  due_date_from?: string;
  due_date_to?: string;
}

export interface AnalyticsFilters {
  blog_id?: string;
  post_id?: string;
  metric_type?: string;
  date_from?: string;
  date_to?: string;
}

// Types para pesquisa semântica
export interface SemanticSearchRequest {
  query: string;
  limit?: number;
  similarity_threshold?: number;
  table:
    | "keyword_variations"
    | "content_posts"
    | "keyword_clusters"
    | "content_opportunities_clusters"
    | "content_opportunities_categories";
  filters?: Record<string, any>;
}

export interface SemanticSearchResult<T> {
  item: T;
  similarity: number;
  rank: number;
}

// Types para dashboard
export interface DashboardMetrics {
  total_keywords: number;
  total_posts: number;
  total_opportunities: number;
  avg_seo_score: number;
  total_traffic: number;
  top_keywords: MainKeyword[];
  recent_posts: ContentPost[];
  performance_trends: {
    date: string;
    traffic: number;
    rankings: number;
    content_score: number;
  }[];
}

// Types para WordPress integration
export interface WordPressPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  status: string;
  slug: string;
  date: string;
  modified: string;
  featured_media?: number;
  categories?: number[];
  tags?: number[];
  meta?: Record<string, any>;
}

export interface WordPressSyncStatus {
  post_id: string;
  wordpress_id?: number;
  status: "pending" | "syncing" | "synced" | "error";
  last_sync?: string;
  error_message?: string;
}

// Types para n8n integration
export interface N8NWorkflow {
  id: string;
  name: string;
  active: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface N8NExecution {
  id: string;
  workflowId: string;
  status: "running" | "success" | "error" | "waiting";
  startedAt: string;
  stoppedAt?: string;
  data?: Record<string, any>;
}

// Types para AI/Embeddings
export interface EmbeddingRequest {
  text: string;
  model?: string;
}

export interface EmbeddingResponse {
  embedding: number[];
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

// Types para exportação
export interface ExportRequest {
  table: string;
  format: "csv" | "json" | "xlsx";
  filters?: Record<string, any>;
  columns?: string[];
}

export interface ImportRequest {
  table: string;
  data: Record<string, any>[];
  options?: {
    upsert?: boolean;
    batch_size?: number;
    validate?: boolean;
  };
}

// Utility types for database operations
export type DatabaseInsert<T> = Omit<T, "id" | "created_at" | "updated_at">;
export type DatabaseUpdate<T> = Partial<DatabaseInsert<T>>;
