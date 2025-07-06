// Tipos otimizados para melhor performance e tipagem forte
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Tipos de status padronizados
export type PostStatus = "draft" | "publish" | "private" | "future" | "pending";
export type SyncStatus = "pending" | "running" | "completed" | "failed";
export type WorkflowStatus = "active" | "inactive" | "error" | "paused";
export type SearchIntent =
  | "informational"
  | "navigational"
  | "commercial"
  | "transactional";
export type Competition = "LOW" | "MEDIUM" | "HIGH";

// Interfaces base otimizadas
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Definição do tipo BlogSettings como um tipo que estende Json
export type BlogSettings = {
  wordpress_url: string;
  wordpress_username: string;
  wordpress_password: string;
  auto_sync: boolean;
  seo_enabled: boolean;
  realtime_sync: boolean;
} & { [key: string]: Json | undefined };

export interface Blog extends BaseEntity {
  name: string;
  domain: string;
  description: string | null;
  niche: string | null;
  is_active: boolean;
  settings: BlogSettings | null;
}

export interface ContentPost extends BaseEntity {
  blog_id: string;
  title: string;
  content: string;
  excerpt: string | null;
  status: PostStatus;
  slug: string | null;
  wordpress_post_id: number | null;
  wordpress_link: string | null;
  wordpress_slug: string | null;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  reading_time: number | null;
  word_count: number | null;
  seo_score: number | null;
}

export interface MainKeyword extends BaseEntity {
  blog_id: string;
  keyword: string;
  msv: number | null;
  kw_difficulty: number | null;
  cpc: number | null;
  competition: Competition | null;
  search_intent: SearchIntent | null;
  language: string | null;
  location: string | null;
  is_used: boolean;
  search_limit: number | null;
}

export interface KeywordVariation extends BaseEntity {
  main_keyword_id: string;
  keyword: string;
  variation_type: string | null;
  msv: number | null;
  kw_difficulty: number | null;
  cpc: number | null;
  competition: Competition | null;
  search_intent: SearchIntent | null;
  embedding: string | null;
  answer: string | null;
}

export interface KeywordCluster extends BaseEntity {
  blog_id: string;
  cluster_name: string;
  description: string | null;
  cluster_score: number | null;
  embedding: string | null;
  main_keyword_id: string | null;
}

export interface SyncLog extends BaseEntity {
  blog_id: string;
  sync_type: "wp_to_supabase" | "supabase_to_wp";
  status: SyncStatus;
  details: Json | null;
}

export interface AutomationWorkflow extends BaseEntity {
  blog_id: string;
  n8n_workflow_id: string;
  status: WorkflowStatus;
}

export interface WorkflowExecution extends BaseEntity {
  workflow_id: string;
  n8n_execution_id: string;
  status: SyncStatus;
  input_data: Json | null;
  output_data: Json | null;
  started_at: string | null;
  finished_at: string | null;
}

// Tipos de formulário otimizados
export interface CreateBlogData {
  name: string;
  domain: string;
  description?: string;
  niche?: string;
  wordpress_url: string;
  wordpress_username: string;
  wordpress_password: string;
}

export interface UpdateBlogData extends Partial<CreateBlogData> {
  is_active?: boolean;
  settings?: Partial<BlogSettings>;
}

export interface CreatePostData {
  blog_id: string;
  title: string;
  content: string;
  excerpt?: string;
  status: PostStatus;
  meta_title?: string;
  meta_description?: string;
  wordpress_sync?: boolean;
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string;
}

// Tipos de resposta da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Tipos para hooks
export interface UseQueryOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number;
}

export interface WordPressApiResponse {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  status: string;
  slug: string;
  link: string;
  date: string;
  modified: string;
}

// Tipos para busca semântica
export interface SemanticSearchRequest {
  query: string;
  similarity_threshold?: number;
  limit?: number;
  blog_id?: string;
}

export interface SemanticSearchResult<T> {
  item: T;
  similarity: number;
  rank: number;
}

// Export dos tipos base do Supabase para compatibilidade
export type { Database } from "./database";

// Tipos utilitários
export type ExtractData<T> = T extends { data: infer U } ? U : never;
export type NonNullable<T> = T extends null | undefined ? never : T;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
