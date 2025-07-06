// Auto-generated Supabase types - 2025-07-06T02:34:48.828Z
// Updated types based on current database schema

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      analytics_metrics: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          blog_id: string
        }
        Insert: {
          id?: string
          blog_id: string
          created_at?: string
          updated_at?: string
          [key: string]: any
        }
        Update: {
          id?: string
          blog_id?: string
          created_at?: string
          updated_at?: string
          [key: string]: any
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
      automation_workflows: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          blog_id: string
          n8n_workflow_id: string
          status: string
        }
        Insert: {
          id?: string
          blog_id: string
          created_at?: string
          updated_at?: string
          [key: string]: any
        }
        Update: {
          id?: string
          blog_id?: string
          created_at?: string
          updated_at?: string
          [key: string]: any
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
      blog_categories: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          blog_id: string
        }
        Insert: {
          id?: string
          blog_id: string
          created_at?: string
          updated_at?: string
          [key: string]: any
        }
        Update: {
          id?: string
          blog_id?: string
          created_at?: string
          updated_at?: string
          [key: string]: any
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
          id: string
          created_at: string
          updated_at: string
          name: string
          domain: string
          description: string | null
          niche: string | null
          settings: Json | null
          is_active: boolean | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          [key: string]: any
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          [key: string]: any
        }
        Relationships: [
        ]
      }
      content_posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          blog_id: string
          title: string
          content: string
          excerpt: string | null
          status: string
          slug: string | null
          meta_title: string | null
          meta_description: string | null
          published_at: string | null
          word_count: number | null
          reading_time: number | null
          seo_score: number | null
          wordpress_post_id: number | null
          wordpress_slug: string | null
          wordpress_link: string | null
        }
        Insert: {
          id?: string
          blog_id: string
          created_at?: string
          updated_at?: string
          [key: string]: any
        }
        Update: {
          id?: string
          blog_id?: string
          created_at?: string
          updated_at?: string
          [key: string]: any
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
          created_at: string
          updated_at: string
          blog_id: string
        }
        Insert: {
          id?: string
          blog_id: string
          created_at?: string
          updated_at?: string
          [key: string]: any
        }
        Update: {
          id?: string
          blog_id?: string
          created_at?: string
          updated_at?: string
          [key: string]: any
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
          created_at: string
          updated_at: string
          blog_id: string
        }
        Insert: {
          id?: string
          blog_id: string
          created_at?: string
          updated_at?: string
          [key: string]: any
        }
        Update: {
          id?: string
          blog_id?: string
          created_at?: string
          updated_at?: string
          [key: string]: any
        }
        Relationships: [
          {
            foreignKeyName: "keyword_clusters_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      keyword_variations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          blog_id: string
        }
        Insert: {
          id?: string
          blog_id: string
          created_at?: string
          updated_at?: string
          [key: string]: any
        }
        Update: {
          id?: string
          blog_id?: string
          created_at?: string
          updated_at?: string
          [key: string]: any
        }
        Relationships: [
          {
            foreignKeyName: "keyword_variations_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      main_keywords: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          blog_id: string
          keyword: string
          msv: number | null
          kw_difficulty: number | null
          cpc: number | null
          competition: string | null
          search_intent: string | null
          is_used: boolean | null
          language: string | null
          location: string | null
          Search_limit: number | null
        }
        Insert: {
          id?: string
          blog_id: string
          created_at?: string
          updated_at?: string
          [key: string]: any
        }
        Update: {
          id?: string
          blog_id?: string
          created_at?: string
          updated_at?: string
          [key: string]: any
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
          id: string
          created_at: string
          updated_at: string
          blog_id: string
        }
        Insert: {
          id?: string
          blog_id: string
          created_at?: string
          updated_at?: string
          [key: string]: any
        }
        Update: {
          id?: string
          blog_id?: string
          created_at?: string
          updated_at?: string
          [key: string]: any
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
          id: string
          created_at: string
          updated_at: string
          blog_id: string
        }
        Insert: {
          id?: string
          blog_id: string
          created_at?: string
          updated_at?: string
          [key: string]: any
        }
        Update: {
          id?: string
          blog_id?: string
          created_at?: string
          updated_at?: string
          [key: string]: any
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_logs: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          blog_id: string
        }
        Insert: {
          id?: string
          blog_id: string
          created_at?: string
          updated_at?: string
          [key: string]: any
        }
        Update: {
          id?: string
          blog_id?: string
          created_at?: string
          updated_at?: string
          [key: string]: any
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
      workflow_executions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          blog_id: string
          workflow_id: string
          n8n_execution_id: string
          status: string
          input_data: Json | null
          output_data: Json | null
          started_at: string | null
          finished_at: string | null
        }
        Insert: {
          id?: string
          blog_id: string
          created_at?: string
          updated_at?: string
          [key: string]: any
        }
        Update: {
          id?: string
          blog_id?: string
          created_at?: string
          updated_at?: string
          [key: string]: any
        }
        Relationships: [
          {
            foreignKeyName: "workflow_executions_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      executive_dashboard: {
        Row: {
          [key: string]: any
        }
        Relationships: []
      }
      keyword_opportunities: {
        Row: {
          [key: string]: any
        }
        Relationships: []
      }
      categorized_keywords: {
        Row: {
          [key: string]: any
        }
        Relationships: []
      }
      blog_categories_usage: {
        Row: {
          [key: string]: any
        }
        Relationships: []
      }
      keyword_clustering_metrics: {
        Row: {
          [key: string]: any
        }
        Relationships: []
      }
      vw_content_opportunities_with_keywords: {
        Row: {
          [key: string]: any
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

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row']

// Specific table types
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
