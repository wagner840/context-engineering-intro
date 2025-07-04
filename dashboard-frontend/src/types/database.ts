export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          id: string
          name: string
          domain: string
          niche: string | null
          description: string | null
          settings: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          domain: string
          niche?: string | null
          description?: string | null
          settings?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          domain?: string
          niche?: string | null
          description?: string | null
          settings?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      authors: {
        Row: {
          id: string
          name: string
          email: string
          bio: string | null
          avatar_url: string | null
          social_links: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          bio?: string | null
          avatar_url?: string | null
          social_links?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          bio?: string | null
          avatar_url?: string | null
          social_links?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      main_keywords: {
        Row: {
          id: string
          blog_id: string
          keyword: string
          msv: number | null
          kw_difficulty: number | null
          cpc: number | null
          competition: string | null
          search_intent: string | null
          is_used: boolean
          created_at: string
          updated_at: string
          location: string
          language: string
          search_limit: number
        }
        Insert: {
          id?: string
          blog_id: string
          keyword: string
          msv?: number | null
          kw_difficulty?: number | null
          cpc?: number | null
          competition?: string | null
          search_intent?: string | null
          is_used?: boolean
          created_at?: string
          updated_at?: string
          location?: string
          language?: string
          search_limit?: number
        }
        Update: {
          id?: string
          blog_id?: string
          keyword?: string
          msv?: number | null
          kw_difficulty?: number | null
          cpc?: number | null
          competition?: string | null
          search_intent?: string | null
          is_used?: boolean
          created_at?: string
          updated_at?: string
          location?: string
          language?: string
          search_limit?: number
        }
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
          embedding: number[] | null
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
          embedding?: number[] | null
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
          embedding?: number[] | null
          created_at?: string
          updated_at?: string
          answer?: string | null
        }
      }
      content_posts: {
        Row: {
          id: string
          blog_id: string
          author_id: string
          title: string
          slug: string | null
          excerpt: string | null
          content: string | null
          status: string
          featured_image_url: string | null
          seo_title: string | null
          seo_description: string | null
          focus_keyword: string | null
          readability_score: number | null
          seo_score: number | null
          word_count: number
          reading_time: number
          scheduled_at: string | null
          published_at: string | null
          embedding: number[] | null
          created_at: string
          updated_at: string
          wordpress_post_id: number | null
        }
        Insert: {
          id?: string
          blog_id: string
          author_id: string
          title: string
          slug?: string | null
          excerpt?: string | null
          content?: string | null
          status?: string
          featured_image_url?: string | null
          seo_title?: string | null
          seo_description?: string | null
          focus_keyword?: string | null
          readability_score?: number | null
          seo_score?: number | null
          word_count?: number
          reading_time?: number
          scheduled_at?: string | null
          published_at?: string | null
          embedding?: number[] | null
          created_at?: string
          updated_at?: string
          wordpress_post_id?: number | null
        }
        Update: {
          id?: string
          blog_id?: string
          author_id?: string
          title?: string
          slug?: string | null
          excerpt?: string | null
          content?: string | null
          status?: string
          featured_image_url?: string | null
          seo_title?: string | null
          seo_description?: string | null
          focus_keyword?: string | null
          readability_score?: number | null
          seo_score?: number | null
          word_count?: number
          reading_time?: number
          scheduled_at?: string | null
          published_at?: string | null
          embedding?: number[] | null
          created_at?: string
          updated_at?: string
          wordpress_post_id?: number | null
        }
      }
      keyword_clusters: {
        Row: {
          id: string
          blog_id: string
          cluster_name: string
          description: string | null
          cluster_score: number | null
          embedding: number[] | null
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
          embedding?: number[] | null
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
          embedding?: number[] | null
          created_at?: string
          updated_at?: string
          main_keyword_id?: string | null
        }
      }
      content_opportunities_clusters: {
        Row: {
          id: string
          blog_id: string
          cluster_id: string
          title: string
          description: string | null
          content_type: string
          priority_score: number
          estimated_traffic: number
          difficulty_score: number
          status: string
          target_keywords: string[]
          content_outline: string | null
          notes: string | null
          assigned_to: string | null
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          blog_id: string
          cluster_id: string
          title: string
          description?: string | null
          content_type?: string
          priority_score?: number
          estimated_traffic?: number
          difficulty_score?: number
          status?: string
          target_keywords?: string[]
          content_outline?: string | null
          notes?: string | null
          assigned_to?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          blog_id?: string
          cluster_id?: string
          title?: string
          description?: string | null
          content_type?: string
          priority_score?: number
          estimated_traffic?: number
          difficulty_score?: number
          status?: string
          target_keywords?: string[]
          content_outline?: string | null
          notes?: string | null
          assigned_to?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      serp_results: {
        Row: {
          id: string
          main_keyword_id: string
          position: number
          title: string | null
          url: string | null
          description: string | null
          domain: string | null
          type: string
          features: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          main_keyword_id: string
          position: number
          title?: string | null
          url?: string | null
          description?: string | null
          domain?: string | null
          type?: string
          features?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          main_keyword_id?: string
          position?: number
          title?: string | null
          url?: string | null
          description?: string | null
          domain?: string | null
          type?: string
          features?: Json
          created_at?: string
          updated_at?: string
        }
      }
      analytics_metrics: {
        Row: {
          id: string
          blog_id: string
          metric_name: string
          metric_value: number
          metric_date: string
          created_at: string
        }
        Insert: {
          id?: string
          blog_id: string
          metric_name: string
          metric_value: number
          metric_date: string
          created_at?: string
        }
        Update: {
          id?: string
          blog_id?: string
          metric_name?: string
          metric_value?: number
          metric_date?: string
          created_at?: string
        }
      }
      media_assets: {
        Row: {
          id: string
          blog_id: string
          file_name: string
          file_url: string
          file_type: string
          file_size: number | null
          alt_text: string | null
          caption: string | null
          wordpress_media_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          blog_id: string
          file_name: string
          file_url: string
          file_type: string
          file_size?: number | null
          alt_text?: string | null
          caption?: string | null
          wordpress_media_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          blog_id?: string
          file_name?: string
          file_url?: string
          file_type?: string
          file_size?: number | null
          alt_text?: string | null
          caption?: string | null
          wordpress_media_id?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_categories: {
        Row: {
          id: string
          blog_id: string
          name: string
          slug: string
          description: string | null
          wordpress_category_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          blog_id: string
          name: string
          slug: string
          description?: string | null
          wordpress_category_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          blog_id?: string
          name?: string
          slug?: string
          description?: string | null
          wordpress_category_id?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_tags: {
        Row: {
          id: string
          blog_id: string
          name: string
          slug: string
          description: string | null
          wordpress_tag_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          blog_id: string
          name: string
          slug: string
          description?: string | null
          wordpress_tag_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          blog_id?: string
          name?: string
          slug?: string
          description?: string | null
          wordpress_tag_id?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      keyword_categories: {
        Row: {
          id: string
          blog_id: string
          keyword_variation_id: string | null
          name: string
          description: string | null
          color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          blog_id: string
          keyword_variation_id?: string | null
          name: string
          description?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          blog_id?: string
          keyword_variation_id?: string | null
          name?: string
          description?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cluster_keywords: {
        Row: {
          id: string
          cluster_id: string
          keyword_variation_id: string
          relevance_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          cluster_id: string
          keyword_variation_id: string
          relevance_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          cluster_id?: string
          keyword_variation_id?: string
          relevance_score?: number | null
          created_at?: string
        }
      }
      content_opportunities_categories: {
        Row: {
          id: string
          blog_id: string
          keyword_category_id: string
          title: string
          description: string | null
          content_type: string
          priority_score: number
          estimated_traffic: number | null
          difficulty_score: number | null
          status: string
          target_keywords: string[]
          content_outline: string | null
          notes: string | null
          assigned_to: string | null
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          blog_id: string
          keyword_category_id: string
          title: string
          description?: string | null
          content_type?: string
          priority_score?: number
          estimated_traffic?: number | null
          difficulty_score?: number | null
          status?: string
          target_keywords?: string[]
          content_outline?: string | null
          notes?: string | null
          assigned_to?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          blog_id?: string
          keyword_category_id?: string
          title?: string
          description?: string | null
          content_type?: string
          priority_score?: number
          estimated_traffic?: number | null
          difficulty_score?: number | null
          status?: string
          target_keywords?: string[]
          content_outline?: string | null
          notes?: string | null
          assigned_to?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      executive_dashboard: {
        Row: {
          blog_name: string
          niche: string | null
          total_keywords: number
          total_variations: number
          total_clusters: number
          total_posts: number
          published_posts: number
          used_keywords: number
          avg_msv: number
          avg_difficulty: number
          avg_cpc: number
          total_opportunities: number
        }
      }
      keyword_opportunities: {
        Row: {
          blog_name: string
          keyword: string
          msv: number | null
          kw_difficulty: number | null
          cpc: number | null
          competition: string | null
          search_intent: string | null
          is_used: boolean
          opportunity_score: number
          variations_count: number
          serp_results_count: number
          priority_level: string
        }
      }
      production_pipeline: {
        Row: {
          blog_name: string
          title: string
          status: string
          word_count: number
          seo_score: number | null
          readability_score: number | null
          author_name: string
          scheduled_at: string | null
          published_at: string | null
          created_at: string
          days_in_status: number | null
        }
      }
      serp_competition_analysis: {
        Row: {
          keyword: string
          position: number
          url: string
          title: string
          domain: string
          competition_level: string
          opportunity_score: number
        }
      }
    }
    Functions: {
      find_similar_keywords: {
        Args: {
          query_embedding: number[]
          match_threshold: number
          match_count: number
          blog_id?: string
        }
        Returns: {
          id: string
          keyword: string
          similarity: number
        }[]
      }
      calculate_keyword_opportunity_score: {
        Args: {
          msv: number | null
          kw_difficulty: number | null
          cpc: number | null
        }
        Returns: number
      }
      find_similar_posts: {
        Args: {
          query_embedding: number[]
          match_threshold: number
          match_count: number
          blog_id?: string
        }
        Returns: {
          id: string
          title: string
          similarity: number
        }[]
      }
    }
  }
}