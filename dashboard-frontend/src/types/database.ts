export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics_metrics: {
        Row: {
          id: string
          blog_id: string
          post_id: string | null
          metric_type: string
          metric_value: number
          metric_date: string
          additional_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          blog_id: string
          post_id?: string | null
          metric_type: string
          metric_value: number
          metric_date: string
          additional_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          blog_id?: string
          post_id?: string | null
          metric_type?: string
          metric_value?: number
          metric_date?: string
          additional_data?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_metrics_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          id: string
          blog_id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          sort_order: number | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          blog_id: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          sort_order?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          blog_id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          sort_order?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_categories_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      blogs: {
        Row: {
          created_at: string
          description: string | null
          domain: string
          id: string
          is_active: boolean | null
          name: string
          niche: string | null
          settings: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          domain: string
          id?: string
          is_active?: boolean | null
          name: string
          niche?: string | null
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          domain?: string
          id?: string
          is_active?: boolean | null
          name?: string
          niche?: string | null
          settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      content_posts: {
        Row: {
          blog_id: string
          content: string
          created_at: string
          excerpt: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          reading_time: number | null
          seo_score: number | null
          slug: string | null
          status: string
          title: string
          updated_at: string
          word_count: number | null
          wordpress_link: string | null
          wordpress_post_id: number | null
          wordpress_slug: string | null
        }
        Insert: {
          blog_id: string
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          seo_score?: number | null
          slug?: string | null
          status?: string
          title: string
          updated_at?: string
          word_count?: number | null
          wordpress_link?: string | null
          wordpress_post_id?: number | null
          wordpress_slug?: string | null
        }
        Update: {
          blog_id?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          seo_score?: number | null
          slug?: string | null
          status?: string
          title?: string
          updated_at?: string
          word_count?: number | null
          wordpress_link?: string | null
          wordpress_post_id?: number | null
          wordpress_slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_posts_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      keyword_categories: {
        Row: {
          id: string
          blog_id: string
          name: string
          description: string | null
          keyword_variation_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          blog_id: string
          name: string
          description?: string | null
          keyword_variation_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          blog_id?: string
          name?: string
          description?: string | null
          keyword_variation_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "keyword_categories_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      keyword_clusters: {
        Row: {
          id: string
          blog_id: string
          cluster_name: string
          description: string | null
          cluster_score: number | null
          embedding: string | null
          created_at: string
          updated_at: string
          main_keyword_id: string | null
        }
        Insert: {
          id?: string
          blog_id: string
          cluster_name: string
          description?: string | null
          cluster_score?: number | null
          embedding?: string | null
          created_at?: string
          updated_at?: string
          main_keyword_id?: string | null
        }
        Update: {
          id?: string
          blog_id?: string
          cluster_name?: string
          description?: string | null
          cluster_score?: number | null
          embedding?: string | null
          created_at?: string
          updated_at?: string
          main_keyword_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "keyword_clusters_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "keyword_clusters_main_keyword_id_fkey"
            columns: ["main_keyword_id"]
            isOneToOne: false
            referencedRelation: "main_keywords"
            referencedColumns: ["id"]
          },
        ]
      }
      keyword_variations: {
        Row: {
          id: string
          main_keyword_id: string
          keyword: string
          variation_type: string | null
          msv: number | null
          kw_difficulty: number | null
          cpc: number | null
          competition: string | null
          search_intent: string | null
          embedding: string | null
          created_at: string
          updated_at: string
          answer: string | null
        }
        Insert: {
          id?: string
          main_keyword_id: string
          keyword: string
          variation_type?: string | null
          msv?: number | null
          kw_difficulty?: number | null
          cpc?: number | null
          competition?: string | null
          search_intent?: string | null
          embedding?: string | null
          created_at?: string
          updated_at?: string
          answer?: string | null
        }
        Update: {
          id?: string
          main_keyword_id?: string
          keyword?: string
          variation_type?: string | null
          msv?: number | null
          kw_difficulty?: number | null
          cpc?: number | null
          competition?: string | null
          search_intent?: string | null
          embedding?: string | null
          created_at?: string
          updated_at?: string
          answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "keyword_variations_main_keyword_id_fkey"
            columns: ["main_keyword_id"]
            isOneToOne: false
            referencedRelation: "main_keywords"
            referencedColumns: ["id"]
          },
        ]
      }
      main_keywords: {
        Row: {
          blog_id: string
          competition: string | null
          cpc: number | null
          created_at: string
          id: string
          is_used: boolean | null
          keyword: string
          kw_difficulty: number | null
          language: string | null
          location: string | null
          msv: number | null
          search_intent: string | null
          Search_limit: number | null
          updated_at: string
        }
        Insert: {
          blog_id: string
          competition?: string | null
          cpc?: number | null
          created_at?: string
          id?: string
          is_used?: boolean | null
          keyword: string
          kw_difficulty?: number | null
          language?: string | null
          location?: string | null
          msv?: number | null
          search_intent?: string | null
          Search_limit?: number | null
          updated_at?: string
        }
        Update: {
          blog_id?: string
          competition?: string | null
          cpc?: number | null
          created_at?: string
          id?: string
          is_used?: boolean | null
          keyword?: string
          kw_difficulty?: number | null
          language?: string | null
          location?: string | null
          msv?: number | null
          search_intent?: string | null
          Search_limit?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "main_keywords_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt_text: string | null
          blog_id: string
          caption: string | null
          created_at: string
          filename: string
          id: string
          size: number | null
          type: string
          updated_at: string
          url: string
          wordpress_media_id: number | null
        }
        Insert: {
          alt_text?: string | null
          blog_id: string
          caption?: string | null
          created_at?: string
          filename: string
          id?: string
          size?: number | null
          type: string
          updated_at?: string
          url: string
          wordpress_media_id?: number | null
        }
        Update: {
          alt_text?: string | null
          blog_id?: string
          caption?: string | null
          created_at?: string
          filename?: string
          id?: string
          size?: number | null
          type?: string
          updated_at?: string
          url?: string
          wordpress_media_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          post_id: string
          tag_name: string
          created_at: string
        }
        Insert: {
          post_id: string
          tag_name: string
          created_at?: string
        }
        Update: {
          post_id?: string
          tag_name?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "content_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_logs: {
        Row: {
          blog_id: string
          created_at: string
          details: Json | null
          id: string
          status: string
          sync_type: string
        }
        Insert: {
          blog_id: string
          created_at?: string
          details?: Json | null
          id?: string
          status: string
          sync_type: string
        }
        Update: {
          blog_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          status?: string
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_logs_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_workflows: {
        Row: {
          id: string
          blog_id: string
          n8n_workflow_id: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          blog_id: string
          n8n_workflow_id: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          blog_id?: string
          n8n_workflow_id?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_workflows_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_executions: {
        Row: {
          id: string
          workflow_id: string
          n8n_execution_id: string
          status: string
          input_data: Json | null
          output_data: Json | null
          started_at: string | null
          finished_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workflow_id: string
          n8n_execution_id: string
          status: string
          input_data?: Json | null
          output_data?: Json | null
          started_at?: string | null
          finished_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workflow_id?: string
          n8n_execution_id?: string
          status?: string
          input_data?: Json | null
          output_data?: Json | null
          started_at?: string | null
          finished_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_executions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "automation_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      blog_categories_usage: {
        Row: {
          blog_name: string | null
          category_name: string | null
          posts_count: number | null
          is_active: boolean | null
          sort_order: number | null
        }
        Relationships: []
      }
      categorized_keywords: {
        Row: {
          category_id: string | null
          category_name: string | null
          category_description: string | null
          category_created_at: string | null
          category_updated_at: string | null
          blog_id: string | null
          blog_name: string | null
          blog_niche: string | null
          main_keyword_id: string | null
          main_keyword: string | null
          main_keyword_msv: number | null
          main_keyword_difficulty: number | null
          main_keyword_cpc: number | null
          main_keyword_competition: string | null
          main_keyword_search_intent: string | null
          main_keyword_is_used: boolean | null
          keyword_variation_id: string | null
          variation_keyword: string | null
          variation_type: string | null
          msv: number | null
          kw_difficulty: number | null
          cpc: number | null
          competition: string | null
          search_intent: string | null
          variation_created_at: string | null
          variation_updated_at: string | null
        }
        Relationships: []
      }
      executive_dashboard: {
        Row: {
          blog_name: string | null
          niche: string | null
          total_keywords: number | null
          total_variations: number | null
          total_clusters: number | null
          total_posts: number | null
          published_posts: number | null
          used_keywords: number | null
          avg_msv: number | null
          avg_difficulty: number | null
          avg_cpc: number | null
          total_opportunities: number | null
        }
        Relationships: []
      }
      keyword_clustering_metrics: {
        Row: {
          variation_id: string | null
          main_keyword_id: string | null
          blog_id: string | null
          variation_keyword: string | null
          main_keyword: string | null
          variation_type: string | null
          search_intent: string | null
          msv: number | null
          kw_difficulty: number | null
          cpc: number | null
          competition: string | null
          embedding: string | null
          variation_count: number | null
          distinct_intents: number | null
          dominant_intent: string | null
          avg_msv: number | null
          avg_difficulty: number | null
          avg_cpc: number | null
          msv_level: string | null
          difficulty_level: string | null
          cpc_level: string | null
          current_cluster_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      keyword_opportunities: {
        Row: {
          blog_name: string | null
          keyword: string | null
          msv: number | null
          kw_difficulty: number | null
          cpc: number | null
          competition: string | null
          search_intent: string | null
          is_used: boolean | null
          opportunity_score: number | null
          variations_count: number | null
          serp_results_count: number | null
          priority_level: string | null
        }
        Relationships: []
      }
      vw_content_opportunities_with_keywords: {
        Row: {
          id: string | null
          blog_id: string | null
          category_id: string | null
          title: string | null
          description: string | null
          priority_score: number | null
          estimated_traffic: number | null
          difficulty_score: number | null
          status: string | null
          target_keywords: string[] | null
          content_outline: string | null
          notes: string | null
          assigned_to: string | null
          due_date: string | null
          created_at: string | null
          updated_at: string | null
          main_keyword_id: string | null
          main_keyword: string | null
          keyword_msv: number | null
          keyword_difficulty: number | null
          keyword_cpc: number | null
          keyword_competition: string | null
          keyword_search_intent: string | null
          keyword_is_used: boolean | null
          blog_name: string | null
          category_name: string | null
          assigned_author_name: string | null
          assigned_author_email: string | null
          calculated_opportunity_score: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      match_keywords_semantic: {
        Args: {
          query_embedding: string
          match_threshold?: number
          match_count?: number
          min_content_length?: number
        }
        Returns: {
          id: string
          keyword: string
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for better developer experience
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row']

// Specific table types for easier imports
export type Blog = Tables<'blogs'>
export type ContentPost = Tables<'content_posts'>
export type MainKeyword = Tables<'main_keywords'>
export type KeywordVariation = Tables<'keyword_variations'>
export type KeywordCluster = Tables<'keyword_clusters'>
export type KeywordCategory = Tables<'keyword_categories'>
export type BlogCategory = Tables<'blog_categories'>
export type MediaAsset = Tables<'media_assets'>
export type PostTag = Tables<'post_tags'>
export type SyncLog = Tables<'sync_logs'>
export type AnalyticsMetric = Tables<'analytics_metrics'>
export type AutomationWorkflow = Tables<'automation_workflows'>
export type WorkflowExecution = Tables<'workflow_executions'>

// View types
export type ExecutiveDashboard = Views<'executive_dashboard'>
export type KeywordOpportunity = Views<'keyword_opportunities'>
export type CategorizedKeyword = Views<'categorized_keywords'>
export type BlogCategoryUsage = Views<'blog_categories_usage'>
export type KeywordClusteringMetrics = Views<'keyword_clustering_metrics'>
export type ContentOpportunityWithKeywords = Views<'vw_content_opportunities_with_keywords'>

// Extended types for better UX
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

export interface DashboardMetrics {
  blogStats: BlogStats
  keywordStats: KeywordStats
  contentStats: ContentStats
}

// Keywords related interfaces
export interface KeywordSearchFilters {
  blog_id?: string
  search?: string
  search_intent?: 'informational' | 'navigational' | 'commercial' | 'transactional'
  competition?: 'LOW' | 'MEDIUM' | 'HIGH'
  min_volume?: number
  max_difficulty?: number
  is_used?: boolean
  location?: string
  language?: string
  limit?: number
  offset?: number
}

// Legacy Post type for backward compatibility
export type Post = ContentPost