export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      blogs: {
        Row: {
          created_at: string | null;
          description: string | null;
          domain: string;
          id: string;
          is_active: boolean | null;
          name: string;
          niche: string | null;
          settings: Json | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          domain: string;
          id?: string;
          is_active?: boolean | null;
          name: string;
          niche?: string | null;
          settings?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          domain?: string;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          niche?: string | null;
          settings?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      content_posts: {
        Row: {
          author_id: string;
          blog_id: string;
          content: string | null;
          created_at: string | null;
          embedding: string | null;
          excerpt: string | null;
          featured_image_url: string | null;
          focus_keyword: string | null;
          id: string;
          published_at: string | null;
          readability_score: number | null;
          reading_time: number | null;
          scheduled_at: string | null;
          seo_description: string | null;
          seo_score: number | null;
          seo_title: string | null;
          slug: string | null;
          status: string | null;
          title: string;
          updated_at: string | null;
          word_count: number | null;
          wordpress_post_id: number | null;
        };
        Insert: {
          author_id: string;
          blog_id: string;
          content?: string | null;
          created_at?: string | null;
          embedding?: string | null;
          excerpt?: string | null;
          featured_image_url?: string | null;
          focus_keyword?: string | null;
          id?: string;
          published_at?: string | null;
          readability_score?: number | null;
          reading_time?: number | null;
          scheduled_at?: string | null;
          seo_description?: string | null;
          seo_score?: number | null;
          seo_title?: string | null;
          slug?: string | null;
          status?: string | null;
          title: string;
          updated_at?: string | null;
          word_count?: number | null;
          wordpress_post_id?: number | null;
        };
        Update: {
          author_id?: string;
          blog_id?: string;
          content?: string | null;
          created_at?: string | null;
          embedding?: string | null;
          excerpt?: string | null;
          featured_image_url?: string | null;
          focus_keyword?: string | null;
          id?: string;
          published_at?: string | null;
          readability_score?: number | null;
          reading_time?: number | null;
          scheduled_at?: string | null;
          seo_description?: string | null;
          seo_score?: number | null;
          seo_title?: string | null;
          slug?: string | null;
          status?: string | null;
          title?: string;
          updated_at?: string | null;
          word_count?: number | null;
          wordpress_post_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "content_posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "authors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_posts_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
        ];
      };
      authors: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string | null;
          email: string;
          id: string;
          is_active: boolean | null;
          name: string;
          social_links: Json | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          email: string;
          id?: string;
          is_active?: boolean | null;
          name: string;
          social_links?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          email?: string;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          social_links?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      main_keywords: {
        Row: {
          blog_id: string;
          competition: string | null;
          cpc: number | null;
          created_at: string | null;
          id: string;
          is_used: boolean | null;
          keyword: string;
          kw_difficulty: number | null;
          language: string | null;
          location: string | null;
          msv: number | null;
          search_intent: string | null;
          Search_limit: number | null;
          updated_at: string | null;
        };
        Insert: {
          blog_id: string;
          competition?: string | null;
          cpc?: number | null;
          created_at?: string | null;
          id?: string;
          is_used?: boolean | null;
          keyword: string;
          kw_difficulty?: number | null;
          language?: string | null;
          location?: string | null;
          msv?: number | null;
          search_intent?: string | null;
          Search_limit?: number | null;
          updated_at?: string | null;
        };
        Update: {
          blog_id?: string;
          competition?: string | null;
          cpc?: number | null;
          created_at?: string | null;
          id?: string;
          is_used?: boolean | null;
          keyword?: string;
          kw_difficulty?: number | null;
          language?: string | null;
          location?: string | null;
          msv?: number | null;
          search_intent?: string | null;
          Search_limit?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "main_keywords_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
        ];
      };
      content_opportunities_clusters: {
        Row: {
          assigned_to: string | null;
          blog_id: string;
          cluster_id: string;
          content_outline: string | null;
          content_type: string | null;
          created_at: string | null;
          description: string | null;
          difficulty_score: number | null;
          due_date: string | null;
          embedding: string | null;
          estimated_traffic: number | null;
          final_description: string | null;
          final_title: string | null;
          id: string;
          main_keyword_id: string | null;
          notes: string | null;
          priority_score: number | null;
          status: string | null;
          target_keywords: string[] | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          assigned_to?: string | null;
          blog_id: string;
          cluster_id: string;
          content_outline?: string | null;
          content_type?: string | null;
          created_at?: string | null;
          description?: string | null;
          difficulty_score?: number | null;
          due_date?: string | null;
          embedding?: string | null;
          estimated_traffic?: number | null;
          final_description?: string | null;
          final_title?: string | null;
          id?: string;
          main_keyword_id?: string | null;
          notes?: string | null;
          priority_score?: number | null;
          status?: string | null;
          target_keywords?: string[] | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          assigned_to?: string | null;
          blog_id?: string;
          cluster_id?: string;
          content_outline?: string | null;
          content_type?: string | null;
          created_at?: string | null;
          description?: string | null;
          difficulty_score?: number | null;
          due_date?: string | null;
          embedding?: string | null;
          estimated_traffic?: number | null;
          final_description?: string | null;
          final_title?: string | null;
          id?: string;
          main_keyword_id?: string | null;
          notes?: string | null;
          priority_score?: number | null;
          status?: string | null;
          target_keywords?: string[] | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "content_opportunities_clusters_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "authors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_opportunities_clusters_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_opportunities_clusters_cluster_id_fkey";
            columns: ["cluster_id"];
            isOneToOne: false;
            referencedRelation: "keyword_clusters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_opportunities_clusters_main_keyword_id_fkey";
            columns: ["main_keyword_id"];
            isOneToOne: false;
            referencedRelation: "main_keywords";
            referencedColumns: ["id"];
          },
        ];
      };
      content_opportunities_categories: {
        Row: {
          assigned_to: string | null;
          blog_id: string;
          category_id: string;
          content_outline: string | null;
          created_at: string | null;
          description: string | null;
          difficulty_score: number | null;
          due_date: string | null;
          embedding: string | null;
          estimated_traffic: number | null;
          id: string;
          main_keyword_id: string | null;
          notes: string | null;
          priority_score: number | null;
          status: string | null;
          target_keywords: string[] | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          assigned_to?: string | null;
          blog_id: string;
          category_id: string;
          content_outline?: string | null;
          created_at?: string | null;
          description?: string | null;
          difficulty_score?: number | null;
          due_date?: string | null;
          embedding?: string | null;
          estimated_traffic?: number | null;
          id?: string;
          main_keyword_id?: string | null;
          notes?: string | null;
          priority_score?: number | null;
          status?: string | null;
          target_keywords?: string[] | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          assigned_to?: string | null;
          blog_id?: string;
          category_id?: string;
          content_outline?: string | null;
          created_at?: string | null;
          description?: string | null;
          difficulty_score?: number | null;
          due_date?: string | null;
          embedding?: string | null;
          estimated_traffic?: number | null;
          id?: string;
          main_keyword_id?: string | null;
          notes?: string | null;
          priority_score?: number | null;
          status?: string | null;
          target_keywords?: string[] | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "content_opportunities_categories_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "authors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_opportunities_categories_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_opportunities_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "keyword_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_opportunities_categories_main_keyword_id_fkey";
            columns: ["main_keyword_id"];
            isOneToOne: false;
            referencedRelation: "main_keywords";
            referencedColumns: ["id"];
          },
        ];
      };
      keyword_clusters: {
        Row: {
          blog_id: string;
          cluster_name: string;
          cluster_score: number | null;
          created_at: string | null;
          description: string | null;
          embedding: string | null;
          id: string;
          main_keyword_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          blog_id: string;
          cluster_name: string;
          cluster_score?: number | null;
          created_at?: string | null;
          description?: string | null;
          embedding?: string | null;
          id?: string;
          main_keyword_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          blog_id?: string;
          cluster_name?: string;
          cluster_score?: number | null;
          created_at?: string | null;
          description?: string | null;
          embedding?: string | null;
          id?: string;
          main_keyword_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "keyword_clusters_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "keyword_clusters_main_keyword_id_fkey";
            columns: ["main_keyword_id"];
            isOneToOne: false;
            referencedRelation: "main_keywords";
            referencedColumns: ["id"];
          },
        ];
      };
      keyword_categories: {
        Row: {
          blog_id: string;
          created_at: string | null;
          description: string | null;
          id: string;
          keyword_variation_id: string | null;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          blog_id: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          keyword_variation_id?: string | null;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          blog_id?: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          keyword_variation_id?: string | null;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "keyword_categories_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "keyword_categories_keyword_variation_id_fkey";
            columns: ["keyword_variation_id"];
            isOneToOne: false;
            referencedRelation: "keyword_variations";
            referencedColumns: ["id"];
          },
        ];
      };
      keyword_variations: {
        Row: {
          answer: string | null;
          competition: string | null;
          cpc: number | null;
          created_at: string | null;
          embedding: string | null;
          id: string;
          keyword: string;
          kw_difficulty: number | null;
          main_keyword_id: string;
          msv: number | null;
          search_intent: string | null;
          updated_at: string | null;
          variation_type: string | null;
        };
        Insert: {
          answer?: string | null;
          competition?: string | null;
          cpc?: number | null;
          created_at?: string | null;
          embedding?: string | null;
          id?: string;
          keyword: string;
          kw_difficulty?: number | null;
          main_keyword_id: string;
          msv?: number | null;
          search_intent?: string | null;
          updated_at?: string | null;
          variation_type?: string | null;
        };
        Update: {
          answer?: string | null;
          competition?: string | null;
          cpc?: number | null;
          created_at?: string | null;
          embedding?: string | null;
          id?: string;
          keyword?: string;
          kw_difficulty?: number | null;
          main_keyword_id?: string;
          msv?: number | null;
          search_intent?: string | null;
          updated_at?: string | null;
          variation_type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "keyword_variations_main_keyword_id_fkey";
            columns: ["main_keyword_id"];
            isOneToOne: false;
            referencedRelation: "main_keywords";
            referencedColumns: ["id"];
          },
        ];
      };
      media_assets: {
        Row: {
          alt_text: string | null;
          blog_id: string;
          caption: string | null;
          created_at: string | null;
          file_path: string | null;
          file_size: number | null;
          file_type: string | null;
          file_url: string | null;
          filename: string | null;
          id: string;
          is_featured: boolean | null;
          metadata: Json | null;
          mime_type: string | null;
          original_filename: string | null;
          post_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          alt_text?: string | null;
          blog_id: string;
          caption?: string | null;
          created_at?: string | null;
          file_path?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          file_url?: string | null;
          filename?: string | null;
          id?: string;
          is_featured?: boolean | null;
          metadata?: Json | null;
          mime_type?: string | null;
          original_filename?: string | null;
          post_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          alt_text?: string | null;
          blog_id?: string;
          caption?: string | null;
          created_at?: string | null;
          file_path?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          file_url?: string | null;
          filename?: string | null;
          id?: string;
          is_featured?: boolean | null;
          metadata?: Json | null;
          mime_type?: string | null;
          original_filename?: string | null;
          post_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "media_assets_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "media_assets_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "content_posts";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
  seo_score?: number;
  last_updated?: string;
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
  similarity?: number;
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
}

export interface SerpResult {
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
  wordpress_config?: any;
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

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  status: "draft" | "published" | "scheduled";
  featured_image?: string;
  categories?: string[];
  tags?: string[];
  author_id: string;
  blog_id: string;
  blog_name?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
}
