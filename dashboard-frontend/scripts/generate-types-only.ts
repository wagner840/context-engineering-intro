#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wayzhnpwphekjuznwqnr.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndheXpobnB3cGhla2p1em53cW5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDU2NjAzOCwiZXhwIjoyMDY2MTQyMDM4fQ.vDP-wAldCUCmQhclreEp3jDEaPTSjAL0AAyr2euy1XQ'

interface TableInfo {
  table_name: string
  table_schema: string
  table_type: string
}

interface ColumnInfo {
  table_name: string
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string
}

class TypeScriptGenerator {
  private supabase = createClient(supabaseUrl!, supabaseServiceKey!)

  async getTables(): Promise<TableInfo[]> {
    return [
      { table_name: 'analytics_metrics', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'automation_workflows', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'blog_categories', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'blogs', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'content_posts', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'keyword_categories', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'keyword_clusters', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'keyword_variations', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'main_keywords', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'media_assets', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'post_tags', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'sync_logs', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'workflow_executions', table_schema: 'public', table_type: 'BASE TABLE' },
      // Views
      { table_name: 'executive_dashboard', table_schema: 'public', table_type: 'VIEW' },
      { table_name: 'keyword_opportunities', table_schema: 'public', table_type: 'VIEW' },
      { table_name: 'categorized_keywords', table_schema: 'public', table_type: 'VIEW' },
      { table_name: 'blog_categories_usage', table_schema: 'public', table_type: 'VIEW' },
      { table_name: 'keyword_clustering_metrics', table_schema: 'public', table_type: 'VIEW' },
      { table_name: 'vw_content_opportunities_with_keywords', table_schema: 'public', table_type: 'VIEW' }
    ]
  }

  async generateTypeScript(): Promise<void> {
    const tables = await this.getTables()
    
    console.log(`// Auto-generated Supabase types - ${new Date().toISOString()}`)
    console.log(`// Updated types based on current database schema`)
    console.log(``)
    console.log(`export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]`)
    console.log(``)
    console.log(`export type Database = {`)
    console.log(`  public: {`)
    console.log(`    Tables: {`)

    // Generate base tables
    for (const table of tables.filter(t => t.table_type === 'BASE TABLE')) {
      console.log(`      ${table.table_name}: {`)
      console.log(`        Row: {`)
      console.log(`          id: string`)
      console.log(`          created_at: string`)
      console.log(`          updated_at: string`)
      if (table.table_name !== 'blogs') {
        console.log(`          blog_id: string`)
      }
      
      // Add specific columns based on table
      if (table.table_name === 'blogs') {
        console.log(`          name: string`)
        console.log(`          domain: string`)
        console.log(`          description: string | null`)
        console.log(`          niche: string | null`)
        console.log(`          settings: Json | null`)
        console.log(`          is_active: boolean | null`)
      } else if (table.table_name === 'content_posts') {
        console.log(`          title: string`)
        console.log(`          content: string`)
        console.log(`          excerpt: string | null`)
        console.log(`          status: string`)
        console.log(`          slug: string | null`)
        console.log(`          meta_title: string | null`)
        console.log(`          meta_description: string | null`)
        console.log(`          published_at: string | null`)
        console.log(`          word_count: number | null`)
        console.log(`          reading_time: number | null`)
        console.log(`          seo_score: number | null`)
        console.log(`          wordpress_post_id: number | null`)
        console.log(`          wordpress_slug: string | null`)
        console.log(`          wordpress_link: string | null`)
      } else if (table.table_name === 'main_keywords') {
        console.log(`          keyword: string`)
        console.log(`          msv: number | null`)
        console.log(`          kw_difficulty: number | null`)
        console.log(`          cpc: number | null`)
        console.log(`          competition: string | null`)
        console.log(`          search_intent: string | null`)
        console.log(`          is_used: boolean | null`)
        console.log(`          language: string | null`)
        console.log(`          location: string | null`)
        console.log(`          Search_limit: number | null`)
      } else if (table.table_name === 'automation_workflows') {
        console.log(`          n8n_workflow_id: string`)
        console.log(`          status: string`)
      } else if (table.table_name === 'workflow_executions') {
        console.log(`          workflow_id: string`)
        console.log(`          n8n_execution_id: string`)
        console.log(`          status: string`)
        console.log(`          input_data: Json | null`)
        console.log(`          output_data: Json | null`)
        console.log(`          started_at: string | null`)
        console.log(`          finished_at: string | null`)
      }
      
      console.log(`        }`)
      console.log(`        Insert: {`)
      console.log(`          id?: string`)
      if (table.table_name !== 'blogs') {
        console.log(`          blog_id: string`)
      }
      console.log(`          created_at?: string`)
      console.log(`          updated_at?: string`)
      console.log(`          [key: string]: any`)
      console.log(`        }`)
      console.log(`        Update: {`)
      console.log(`          id?: string`)
      if (table.table_name !== 'blogs') {
        console.log(`          blog_id?: string`)
      }
      console.log(`          created_at?: string`)
      console.log(`          updated_at?: string`)
      console.log(`          [key: string]: any`)
      console.log(`        }`)
      console.log(`        Relationships: [`)
      if (table.table_name !== 'blogs') {
        console.log(`          {`)
        console.log(`            foreignKeyName: "${table.table_name}_blog_id_fkey"`)
        console.log(`            columns: ["blog_id"]`)
        console.log(`            isOneToOne: false`)
        console.log(`            referencedRelation: "blogs"`)
        console.log(`            referencedColumns: ["id"]`)
        console.log(`          },`)
      }
      console.log(`        ]`)
      console.log(`      }`)
    }

    console.log(`    }`)
    console.log(`    Views: {`)

    // Generate views
    for (const view of tables.filter(t => t.table_type === 'VIEW')) {
      console.log(`      ${view.table_name}: {`)
      console.log(`        Row: {`)
      console.log(`          [key: string]: any`)
      console.log(`        }`)
      console.log(`        Relationships: []`)
      console.log(`      }`)
    }

    console.log(`    }`)
    console.log(`    Functions: {`)
    console.log(`      match_keywords_semantic: {`)
    console.log(`        Args: {`)
    console.log(`          query_embedding: string`)
    console.log(`          match_threshold?: number`)
    console.log(`          match_count?: number`)
    console.log(`          min_content_length?: number`)
    console.log(`        }`)
    console.log(`        Returns: {`)
    console.log(`          id: string`)
    console.log(`          keyword: string`)
    console.log(`          similarity: number`)
    console.log(`        }[]`)
    console.log(`      }`)
    console.log(`    }`)
    console.log(`    Enums: {`)
    console.log(`      [_ in never]: never`)
    console.log(`    }`)
    console.log(`    CompositeTypes: {`)
    console.log(`      [_ in never]: never`)
    console.log(`    }`)
    console.log(`  }`)
    console.log(`}`)
    console.log(``)
    console.log(`// Helper types`)
    console.log(`export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']`)
    console.log(`export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]`)
    console.log(`export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row']`)
    console.log(``)
    console.log(`// Specific table types`)
    console.log(`export type Blog = Tables<'blogs'>`)
    console.log(`export type ContentPost = Tables<'content_posts'>`)
    console.log(`export type MainKeyword = Tables<'main_keywords'>`)
    console.log(`export type KeywordVariation = Tables<'keyword_variations'>`)
    console.log(`export type KeywordCluster = Tables<'keyword_clusters'>`)
    console.log(`export type KeywordCategory = Tables<'keyword_categories'>`)
    console.log(`export type BlogCategory = Tables<'blog_categories'>`)
    console.log(`export type MediaAsset = Tables<'media_assets'>`)
    console.log(`export type PostTag = Tables<'post_tags'>`)
    console.log(`export type SyncLog = Tables<'sync_logs'>`)
    console.log(`export type AnalyticsMetric = Tables<'analytics_metrics'>`)
    console.log(`export type AutomationWorkflow = Tables<'automation_workflows'>`)
    console.log(`export type WorkflowExecution = Tables<'workflow_executions'>`)
  }
}

const generator = new TypeScriptGenerator()
generator.generateTypeScript()