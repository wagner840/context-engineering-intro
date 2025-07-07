# Documentação do Banco de Dados Supabase

## Tabelas Principais

### 1. blogs

- **Descrição:** Armazena informações dos blogs cadastrados.
- **Campos:**
  - `id: string` (UUID, PK)
  - `name: string` (nome do blog)
  - `domain: string` (domínio do blog)
  - `niche: string | null` (nicho)
  - `description: string | null`
  - `settings: Json | null`
  - `is_active: boolean | null`
  - `created_at: string | null`
  - `updated_at: string | null`
- **Relacionamentos:**
  - Relaciona com várias tabelas via `id` (ex: posts, keywords, categorias)
- **Tipagem Typescript:**

```ts
export type Blog = {
  id: string;
  name: string;
  domain: string;
  niche?: string | null;
  description?: string | null;
  settings?: Json | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};
```

### 2. authors

- **Descrição:** Autores de posts.
- **Campos:**
  - `id: string` (UUID, PK)
  - `name: string`
  - `email: string` (único)
  - `bio: string | null`
  - `avatar_url: string | null`
  - `social_links: Json | null`
  - `is_active: boolean | null`
  - `created_at: string | null`
  - `updated_at: string | null`
- **Tipagem Typescript:**

```ts
export type Author = {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  avatar_url?: string | null;
  social_links?: Json | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};
```

### 3. main_keywords

- **Descrição:** Palavras-chave principais de cada blog.
- **Campos:**
  - `id: string` (UUID, PK)
  - `blog_id: string` (FK blogs)
  - `keyword: string`
  - `msv: number | null` (volume de busca)
  - `kw_difficulty: number | null`
  - `cpc: number | null`
  - `competition: string | null`
  - `search_intent: string | null`
  - `is_used: boolean | null`
  - `created_at: string | null`
  - `updated_at: string | null`
  - `location: string | null`
  - `language: string | null`
  - `Search_limit: number | null`
- **Relacionamentos:**
  - `blog_id` referencia blogs
- **Tipagem Typescript:**

```ts
export type MainKeyword = {
  id: string;
  blog_id: string;
  keyword: string;
  msv?: number | null;
  kw_difficulty?: number | null;
  cpc?: number | null;
  competition?: string | null;
  search_intent?: string | null;
  is_used?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  location?: string | null;
  language?: string | null;
  Search_limit?: number | null;
};
```

### 4. keyword_variations

- **Descrição:** Variações de palavras-chave ligadas a uma principal.
- **Campos:**
  - `id: string` (UUID, PK)
  - `main_keyword_id: string` (FK main_keywords)
  - `keyword: string`
  - `variation_type: string | null`
  - `msv: number | null`
  - `kw_difficulty: number | null`
  - `cpc: number | null`
  - `competition: string | null`
  - `search_intent: string | null`
  - `embedding: string | null`
  - `created_at: string | null`
  - `updated_at: string | null`
  - `answer: string | null`
- **Relacionamentos:**
  - `main_keyword_id` referencia main_keywords
- **Tipagem Typescript:**

```ts
export type KeywordVariation = {
  id: string;
  main_keyword_id: string;
  keyword: string;
  variation_type?: string | null;
  msv?: number | null;
  kw_difficulty?: number | null;
  cpc?: number | null;
  competition?: string | null;
  search_intent?: string | null;
  embedding?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  answer?: string | null;
};
```

### 5. keyword_clusters

- **Descrição:** Agrupamentos de palavras-chave.
- **Campos:**
  - `id: string` (UUID, PK)
  - `blog_id: string` (FK blogs)
  - `cluster_name: string`
  - `description: string | null`
  - `cluster_score: number | null`
  - `embedding: string | null`
  - `created_at: string | null`
  - `updated_at: string | null`
  - `main_keyword_id: string | null`
- **Relacionamentos:**
  - `blog_id` referencia blogs
  - `main_keyword_id` referencia main_keywords
- **Tipagem Typescript:**

```ts
export type KeywordCluster = {
  id: string;
  blog_id: string;
  cluster_name: string;
  description?: string | null;
  cluster_score?: number | null;
  embedding?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  main_keyword_id?: string | null;
};
```

### 6. keyword_categories

- **Descrição:** Categorias de palavras-chave.
- **Campos:**
  - `id: string` (UUID, PK)
  - `blog_id: string` (FK blogs)
  - `name: string`
  - `description: string | null`
  - `keyword_variation_id: string | null`
  - `created_at: string | null`
  - `updated_at: string | null`
- **Relacionamentos:**
  - `blog_id` referencia blogs
  - `keyword_variation_id` referencia keyword_variations
- **Tipagem Typescript:**

```ts
export type KeywordCategory = {
  id: string;
  blog_id: string;
  name: string;
  description?: string | null;
  keyword_variation_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};
```

### 7. content_posts

- **Descrição:** Posts de conteúdo dos blogs.
- **Campos:**
  - `id: string` (UUID, PK)
  - `blog_id: string` (FK blogs)
  - `author_id: string` (FK authors)
  - `title: string`
  - `slug: string | null`
  - `excerpt: string | null`
  - `content: string | null`
  - `status: string | null`
  - `featured_image_url: string | null`
  - `seo_title: string | null`
  - `seo_description: string | null`
  - `focus_keyword: string | null`
  - `readability_score: number | null`
  - `seo_score: number | null`
  - `word_count: number | null`
  - `reading_time: number | null`
  - `scheduled_at: string | null`
  - `published_at: string | null`
  - `embedding: string | null`
  - `created_at: string | null`
  - `updated_at: string | null`
  - `wordpress_post_id: number | null`
- **Relacionamentos:**
  - `blog_id` referencia blogs
  - `author_id` referencia authors
- **Tipagem Typescript:**

```ts
export type ContentPost = {
  id: string;
  blog_id: string;
  author_id: string;
  title: string;
  slug?: string | null;
  excerpt?: string | null;
  content?: string | null;
  status?: string | null;
  featured_image_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  focus_keyword?: string | null;
  readability_score?: number | null;
  seo_score?: number | null;
  word_count?: number | null;
  reading_time?: number | null;
  scheduled_at?: string | null;
  published_at?: string | null;
  embedding?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  wordpress_post_id?: number | null;
};
```

### 8. media_assets

- **Descrição:** Arquivos de mídia dos blogs/posts.
- **Campos:**
  - `id: string` (UUID, PK)
  - `blog_id: string` (FK blogs)
  - `post_id: string | null` (FK content_posts)
  - `filename: string | null`
  - `original_filename: string | null`
  - `file_path: string | null`
  - `file_url: string | null`
  - `file_type: string | null`
  - `file_size: number | null`
  - `mime_type: string | null`
  - `alt_text: string | null`
  - `caption: string | null`
  - `metadata: Json | null`
  - `is_featured: boolean | null`
  - `created_at: string | null`
  - `updated_at: string | null`
- **Relacionamentos:**
  - `blog_id` referencia blogs
  - `post_id` referencia content_posts
- **Tipagem Typescript:**

```ts
export type MediaAsset = {
  id: string;
  blog_id: string;
  post_id?: string | null;
  filename?: string | null;
  original_filename?: string | null;
  file_path?: string | null;
  file_url?: string | null;
  file_type?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
  alt_text?: string | null;
  caption?: string | null;
  metadata?: Json | null;
  is_featured?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};
```

### 9. blog_categories

- **Descrição:** Categorias de blogs.
- **Campos:**
  - `id: string` (UUID, PK)
  - `blog_id: string` (FK blogs)
  - `name: string`
  - `slug: string`
  - `description: string | null`
  - `parent_id: string | null`
  - `sort_order: number | null`
  - `is_active: boolean | null`
  - `created_at: string | null`
  - `updated_at: string | null`
- **Relacionamentos:**
  - `blog_id` referencia blogs
  - `parent_id` referencia blog_categories
- **Tipagem Typescript:**

```ts
export type BlogCategory = {
  id: string;
  blog_id: string;
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: string | null;
  sort_order?: number | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};
```

### 10. post_tags

- **Descrição:** Tags dos posts.
- **Campos:**
  - `post_id: string` (FK content_posts)
  - `tag_name: string`
  - `created_at: string | null`
- **Relacionamentos:**
  - `post_id` referencia content_posts
- **Tipagem Typescript:**

```ts
export type PostTag = {
  post_id: string;
  tag_name: string;
  created_at?: string | null;
};
```

### 11. sync_logs

- **Descrição:** Logs de sincronização (ex: WordPress).
- **Campos:**
  - `id: string` (UUID, PK)
  - `blog_id: string` (FK blogs)
  - `sync_type: string`
  - `status: string`
  - `details: Json | null`
  - `error_message: string | null`
  - `created_at: string | null`
  - `updated_at: string | null`
- **Relacionamentos:**
  - `blog_id` referencia blogs
- **Tipagem Typescript:**

```ts
export type SyncLog = {
  id: string;
  blog_id: string;
  sync_type: string;
  status: string;
  details?: Json | null;
  error_message?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};
```

### 12. analytics_metrics

- **Descrição:** Métricas analíticas dos blogs/posts.
- **Campos:**
  - `id: string` (UUID, PK)
  - `blog_id: string` (FK blogs)
  - `post_id: string | null` (FK content_posts)
  - `metric_type: string`
  - `metric_value: number`
  - `metric_date: string`
  - `additional_data: Json | null`
  - `created_at: string | null`
- **Relacionamentos:**
  - `blog_id` referencia blogs
  - `post_id` referencia content_posts
- **Tipagem Typescript:**

```ts
export type AnalyticsMetric = {
  id: string;
  blog_id: string;
  post_id?: string | null;
  metric_type: string;
  metric_value: number;
  metric_date: string;
  additional_data?: Json | null;
  created_at?: string | null;
};
```

### 13. serp_results

- **Descrição:** Resultados de SERP para keywords.
- **Campos:**
  - `id: string` (UUID, PK)
  - `main_keyword_id: string` (FK main_keywords)
  - `position: number`
  - `url: string | null`
  - `title: string | null`
  - `description: string | null`
  - `domain: string | null`
  - `type: string | null`
  - `features: Json | null`
  - `created_at: string | null`
  - `updated_at: string | null`
- **Relacionamentos:**
  - `main_keyword_id` referencia main_keywords
- **Tipagem Typescript:**

```ts
export type SerpResult = {
  id: string;
  main_keyword_id: string;
  position: number;
  url?: string | null;
  title?: string | null;
  description?: string | null;
  domain?: string | null;
  type?: string | null;
  features?: Json | null;
  created_at?: string | null;
  updated_at?: string | null;
};
```

---

## Funções do Banco de Dados

Abaixo estão exemplos de funções SQL presentes no banco, com suas tipagens:

### Exemplo: match_posts_semantic

- **Descrição:** Busca posts semanticamente similares a um embedding.
- **Assinatura:**

```ts
function match_posts_semantic(args: {
  query_embedding: string;
  match_threshold: number;
  match_count: number;
  blog_id: string;
}): Array<{
  id: string;
  title: string;
  similarity: number;
}>;
```

### Exemplo: find_similar_keywords

- **Descrição:** Busca keywords semanticamente similares.
- **Assinatura:**

```ts
function find_similar_keywords(args: {
  query_embedding: string;
  match_threshold?: number;
  match_count?: number;
}): Array<{
  id: string;
  keyword: string;
  similarity: number;
}>;
```

### Exemplo: analyze_content_gaps

- **Descrição:** Analisa lacunas de conteúdo para um blog.
- **Assinatura:**

```ts
function analyze_content_gaps(args: {
  p_blog_id: string;
  gap_threshold?: number;
}): Array<{
  keyword: string;
  msv: number;
  difficulty: number;
  has_content: boolean;
  similar_content_count: number;
  opportunity_score: number;
}>;
```

### Exemplo: calculate_keyword_opportunity_score

- **Descrição:** Calcula score de oportunidade para uma keyword.
- **Assinatura:**

```ts
function calculate_keyword_opportunity_score(args: {
  msv: number;
  kw_difficulty: number;
  cpc: number;
  competition: string;
  search_intent: string;
}): number;
```

---

> **Observação:** Para a lista completa de funções, consulte o painel Supabase ou o arquivo de tipos gerado automaticamente.

---

## Observações Gerais

- Todas as tabelas possuem campos de auditoria (`created_at`, `updated_at`).
- Os tipos Typescript podem ser gerados automaticamente via Supabase CLI.
- Relacionamentos são fortemente utilizados para garantir integridade referencial.

---

_Gerado automaticamente via Supabase MCP Tool e análise do schema._
