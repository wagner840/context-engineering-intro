# API Documentation - Dashboard Frontend

## Overview

Este documento descreve as APIs implementadas no dashboard frontend para integração completa com Supabase, WordPress e n8n.

## Estrutura das APIs

### 1. Blogs API (`/api/blogs`)

#### GET `/api/blogs`
Retorna lista de blogs configurados.

**Query Parameters:**
- `active` (boolean): Filtrar apenas blogs ativos

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "url": "string",
      "niche": "string",
      "description": "string",
      "status": "active|inactive|suspended",
      "wordpress_config": {
        "api_url": "string",
        "username": "string",
        "app_password": "string"
      },
      "n8n_config": {
        "webhook_url": "string",
        "workflow_id": "string"
      }
    }
  ]
}
```

#### POST `/api/blogs`
Cria um novo blog.

**Request Body:**
```json
{
  "name": "string",
  "url": "string",
  "niche": "string",
  "description": "string",
  "wordpress_config": {
    "api_url": "string",
    "username": "string",
    "app_password": "string"
  },
  "n8n_config": {
    "webhook_url": "string",
    "workflow_id": "string"
  }
}
```

#### PUT `/api/blogs/[id]`
Atualiza um blog existente.

#### DELETE `/api/blogs/[id]`
Remove um blog.

---

### 2. WordPress Integration API (`/api/wordpress`)

#### GET `/api/wordpress/posts`
Lista posts do WordPress.

**Query Parameters:**
- `blog_id` (required): ID do blog
- `status`: Status do post (draft, publish, private)
- `limit`: Número de posts por página
- `offset`: Offset para paginação

#### POST `/api/wordpress/posts`
Cria um novo post no WordPress.

**Request Body:**
```json
{
  "blog_id": "uuid",
  "title": "string",
  "content": "string",
  "excerpt": "string",
  "status": "draft|publish|private",
  "categories": ["string"],
  "tags": ["string"],
  "featured_image_url": "string",
  "meta_title": "string",
  "meta_description": "string",
  "target_keywords": ["string"]
}
```

#### PUT `/api/wordpress/posts/[id]`
Atualiza um post existente.

#### DELETE `/api/wordpress/posts/[id]`
Remove um post.

---

### 3. n8n Integration API (`/api/n8n`)

#### GET `/api/n8n/workflows`
Lista workflows do n8n.

**Query Parameters:**
- `blog_id`: Filtrar por blog
- `active`: Filtrar workflows ativos

#### POST `/api/n8n/workflows`
Executa um workflow.

**Request Body:**
```json
{
  "workflow_id": "string",
  "blog_id": "uuid",
  "input_data": {},
  "wait_for_completion": false
}
```

#### GET `/api/n8n/executions/[id]`
Retorna detalhes de uma execução.

#### DELETE `/api/n8n/executions/[id]`
Para uma execução em andamento.

---

### 4. Database Operations API (`/api/database/operations`)

#### POST `/api/database/operations`
Realiza operações avançadas no banco de dados.

**Operações Suportadas:**

##### Bulk Operations
```json
{
  "operation": "bulk_operation",
  "table": "string",
  "operation": "insert|update|delete|upsert",
  "data": [{}],
  "filters": {},
  "returning": "*"
}
```

##### Aggregations
```json
{
  "operation": "aggregation",
  "table": "string",
  "columns": ["string"],
  "filters": {},
  "groupBy": ["string"],
  "orderBy": [{"column": "string", "ascending": true}]
}
```

##### Relationship Queries
```json
{
  "operation": "relationship_query",
  "table": "string",
  "select": "*, related_table(*)",
  "filters": {},
  "limit": 50,
  "offset": 0
}
```

##### Custom Functions
```json
{
  "operation": "custom_function",
  "function_name": "string",
  "parameters": {}
}
```

#### GET `/api/database/operations`
Informações sobre o schema.

**Query Parameters:**
- `operation`: table_info|schema_info|functions_list
- `table`: Nome da tabela (para table_info)

---

### 5. Vector Search API (`/api/search/vector`)

#### POST `/api/search/vector`
Busca vetorial por similaridade.

**Request Body:**
```json
{
  "query": "string",
  "type": "keywords|content",
  "blog_id": "uuid",
  "match_threshold": 0.8,
  "match_count": 10
}
```

#### GET `/api/search/vector`
Busca vetorial via GET.

**Query Parameters:**
- `query`: Termo de busca
- `type`: Tipo de busca (keywords|content)
- `blog_id`: ID do blog
- `match_threshold`: Limite de similaridade
- `match_count`: Número de resultados

---

## Hooks React Personalizados

### Database Operations
- `useBulkOperation()`: Operações em lote
- `useAggregation()`: Agregações
- `useRelationshipQuery()`: Queries relacionais
- `useCustomFunction()`: Funções customizadas
- `useTableInfo()`: Informações da tabela
- `useSchemaInfo()`: Informações do schema

### WordPress Integration
- `useWordPressPosts()`: Lista posts
- `useWordPressPost()`: Post individual
- `useCreateWordPressPost()`: Criar post
- `useUpdateWordPressPost()`: Atualizar post
- `useDeleteWordPressPost()`: Deletar post
- `useWordPressSync()`: Sincronização
- `useWordPressEditor()`: Editor completo

### n8n Integration
- `useN8nWorkflows()`: Lista workflows
- `useExecuteN8nWorkflow()`: Executar workflow
- `useN8nExecution()`: Acompanhar execução
- `useN8nExecutions()`: Lista execuções
- `useWorkflowAutomation()`: Automação completa

### Realtime Features
- `useRealtime()`: Status de conexão
- `useRealtimeTable()`: Monitorar tabela
- `useRealtimeContentPosts()`: Posts em tempo real
- `useRealtimeWorkflowExecutions()`: Execuções em tempo real

---

## Componentes de Interface

### WordPress Editor
- **WordPressEditor**: Editor visual completo
- **BlogPostsList**: Lista de posts com filtros
- Recursos: SEO score, preview, auto-save, formatting

### Realtime Components
- **RealtimeProvider**: Context provider
- **RealtimeStatus**: Indicador de status
- Recursos: Live updates, event tracking

### Database Components
- Operações CRUD avançadas
- Visualização de schema
- Execução de funções customizadas

---

## Funcionalidades Implementadas

### ✅ API Routes Completas
- Integração total com Supabase, WordPress e n8n
- Validação com Zod
- Error handling robusto
- Operações em lote

### ✅ WordPress Integration
- CRUD completo de posts
- Sincronização bidirecional
- Upload de media
- Gestão de categorias e tags
- SEO optimization

### ✅ n8n Workflows
- Execução e monitoramento
- Controle de workflows
- Métricas de performance
- Automação por blog

### ✅ Database Operations
- Operações CRUD avançadas
- Agregações e relacionamentos
- Funções customizadas
- Informações de schema

### ✅ Real-time Features
- Atualizações em tempo real
- Monitoramento de eventos
- Status de conexão
- Notificações automáticas

### ✅ SSR & Performance
- Server-Side Rendering
- Incremental Static Regeneration
- Otimização de performance
- SEO-friendly

### ✅ Content Editor
- Editor visual avançado
- Score de SEO
- Preview em tempo real
- Auto-save
- Gestão de keywords

---

## Próximos Passos

1. **Testes Automatizados**: Implementar testes unitários e de integração
2. **Monitoramento**: Adicionar logging e métricas
3. **Cache Avançado**: Implementar estratégias de cache
4. **Autenticação**: Adicionar controle de acesso
5. **Performance**: Otimizar queries e renderização