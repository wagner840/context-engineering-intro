# INITIAL.md - Dashboard Frontend PAWA com Context Engineering & MCP

## FEATURE:

Desenvolver um dashboard frontend moderno e responsivo para gerenciamento completo da SaaS de geração de posts para WordPress com n8n. O sistema deve servir como centro de controle unificado com Context Engineering avançado usando MCP (Model Context Protocol) servers para:

**Context Engineering & MCP Integration:**
- **MCP Servers**: Supabase MCP, shadcn/ui MCP, Context7 MCP para context engineering avançado
- **Real-time Documentation**: Context7 MCP para documentação sempre atualizada em prompts
- **Component Intelligence**: shadcn/ui MCP para acesso direto a componentes e exemplos
- **Database Context**: Supabase MCP para operações inteligentes no banco de dados

**Core Functionality:**
- **Analise backup_estrutura.sql**: Backup da estrura completa do meu backend do supabase para melhor conhecimento e integração de funcionalidades e potencial da aplicação web
- **Multi-Blog Management**: Interface para gerenciar tabela `blogs` com múltiplos sites WordPress
- **Keywords Intelligence**: Gestão completa de `main_keywords` e `keyword_variations` com scoring automático
- **Content Opportunities**: Sistema de `content_opportunities_clusters` e `content_opportunities_categories`
- **SERP Analysis**: Análise competitiva através de `serp_results` com métricas automáticas
- **Production Pipeline**: Workflow completo baseado na view `production_pipeline`
- **Vector Search**: Busca semântica usando embeddings `vector(1536)` nas tabelas principais
- **Backend PAWA Integration**: Integração completa com o sistema PostgreSQL avançado baseado na estrutura real:
- **Tabelas Core**: `blogs`, `authors`, `main_keywords`, `keyword_variations`, `content_posts`
- **Intelligence Tables**: `keyword_clusters`, `keyword_categories`, `content_opportunities_clusters`
- **Analytics**: `analytics_metrics`, `serp_results`, `media_assets`
- **Views Avançadas**: `executive_dashboard`, `keyword_opportunities`, `production_pipeline`
- **Vector Search**: Embeddings `vector(1536)` para busca semântica
- **Queue System**: PGMQ para processamento assíncrono (`q_embedding_jobs`)
- **WordPress API Control**: Controle total de posts, páginas, mídia, categorias e tags através da WordPress REST API v2
- **n8n Automation Hub**: Painel para monitoramento, controle e execução de workflows/bots no n8n
- **Supabase Real-time**: Integração com Supabase para operações CRUD, real-time subscriptions e analytics

**Advanced Features:**
- **Executive Dashboard**: Métricas consolidadas via view `executive_dashboard` com KPIs por blog
- **Keyword Opportunities**: Ranking automático via view `keyword_opportunities` com scoring proprietário
- **Content Clustering**: Agrupamentos inteligentes via `keyword_clusters` com embeddings vetoriais
- **SERP Competition**: Análise automática via view `serp_competition_analysis` com dados competitivos
- **Analytics Metrics**: Sistema de métricas via tabela `analytics_metrics` com dados temporais
- **Media Management**: Gestão de assets via tabela `media_assets` integrada com WordPress
- **Queue Processing**: Sistema PGMQ para embeddings assíncronos (`q_embedding_jobs`, `a_embedding_jobs`)

**Context Engineering with MCP:**
- **Real-time Documentation**: Integração com Context7 MCP para documentação sempre atualizada
- **Component Intelligence**: Acesso direto a componentes shadcn/ui via MCP com exemplos atualizados
- **Database Context**: Contexto direto do Supabase via MCP para operações mais inteligentes
- **Documentation-First Development**: Uso de `use context7` em prompts para código sempre atualizado

**Technical Requirements:**
- **Frontend**: React 18+ com TypeScript, Tailwind CSS, shadcn/ui
- **State Management**: Zustand ou Redux Toolkit para gerenciamento de estado complexo
- **API Integration**: Axios/React Query para otimização de requisições e caching
- **Real-time**: Socket.io ou Supabase Realtime para updates em tempo real
- **Charts & Viz**: Chart.js ou Recharts para visualizações avançadas
- **Authentication**: Integração com Supabase Auth
- **Deployment**: Otimizado para Vercel/Netlify com CI/CD

## CONTEXT ENGINEERING SETUP:

Configure os MCP servers antes do desenvolvimento para máxima eficiência:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--read-only", "--project-ref=<project-ref>"],
      "env": { "SUPABASE_ACCESS_TOKEN": "<token>" }
    },
    "shadcn-ui": {
      "command": "npx",
      "args": ["-y", "@jpisnice/shadcn-ui-mcp-server", "--github-api-key", "<github-token>"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

**Padrão de Uso**: Adicione `use context7` aos prompts para documentação sempre atualizada.

## EXAMPLES:

No diretório `examples/`, inclua os seguintes arquivos de referência:

**Backend PAWA Tables:**
- `examples/backend/blogs-management.ts` - CRUD operations para tabela `blogs`
- `examples/backend/main-keywords-operations.ts` - Operações em `main_keywords` com scoring
- `examples/backend/keyword-variations-clustering.ts` - Clustering de `keyword_variations`
- `examples/backend/content-opportunities.ts` - Gestão de `content_opportunities_clusters`
- `examples/backend/executive-dashboard.ts` - Integração com view `executive_dashboard`
- `examples/backend/serp-analysis.ts` - Análise via view `serp_competition_analysis`
- `examples/backend/vector-search.ts` - Busca semântica com embeddings `vector(1536)`

**Dashboard Views Integration:**
- `examples/views/keyword-opportunities-table.tsx` - Tabela baseada em view `keyword_opportunities`
- `examples/views/production-pipeline-board.tsx` - Board baseado em view `production_pipeline`
- `examples/views/executive-metrics.tsx` - Métricas da view `executive_dashboard`
- `examples/views/serp-competition-chart.tsx` - Gráficos de `serp_competition_analysis`
- `examples/views/content-clustering-viz.tsx` - Visualização de `keyword_clusters`

**State Management:**
- `examples/store/blog-store.ts` - Store para gerenciamento de blogs ativos
- `examples/store/keyword-store.ts` - Store para dados de keywords e oportunidades
- `examples/store/content-store.ts` - Store para pipeline de conteúdo
- `examples/store/n8n-store.ts` - Store para workflows e automações

**MCP Setup & Usage:**
- `examples/mcp/setup-mcp-servers.md` - Guia completo para configurar MCP servers
- `examples/mcp/mcp-usage-patterns.ts` - Padrões de uso para MCP no projeto
- `examples/mcp/mcp-error-handling.ts` - Tratamento de erros para MCP servers
- `examples/mcp/mcp-performance-optimization.ts` - Otimizações de performance para MCP

**Data Fetching & Caching:**
- `examples/hooks/use-blog-data.ts` - Hook para dados de blog com cache
- `examples/hooks/use-keyword-opportunities.ts` - Hook para oportunidades SEO
- `examples/hooks/use-n8n-workflows.ts` - Hook para workflows n8n
- `examples/hooks/use-realtime-subscription.ts` - Hook para subscriptions real-time

**Visualizations (Real Data):**
- `examples/charts/executive-dashboard-charts.tsx` - Gráficos da view `executive_dashboard`
- `examples/charts/keyword-opportunity-matrix.tsx` - Matrix de oportunidades com scoring
- `examples/charts/serp-competition-heatmap.tsx` - Heatmap de competição SERP
- `examples/charts/content-pipeline-funnel.tsx` - Funil baseado em `production_pipeline`
- `examples/charts/keyword-clustering-network.tsx` - Network graph de `keyword_clusters`
- `examples/charts/analytics-metrics-timeseries.tsx` - Séries temporais de `analytics_metrics`

**MCP Configuration:**
- `examples/mcp/mcp-config.json` - Configuração completa dos MCP servers
- `examples/mcp/supabase-mcp-integration.ts` - Integração com Supabase MCP
- `examples/mcp/shadcn-mcp-integration.ts` - Uso de componentes via shadcn/ui MCP
- `examples/mcp/context7-integration.ts` - Integração com Context7 para docs atualizadas

**Testing Patterns (Real Backend):**
- `examples/tests/blogs-crud.test.ts` - Testes CRUD para tabela `blogs`
- `examples/tests/keyword-operations.test.ts` - Testes para `main_keywords` e `keyword_variations`
- `examples/tests/vector-search.test.ts` - Testes de busca semântica com embeddings
- `examples/tests/dashboard-views.test.ts` - Testes das views (`executive_dashboard`, `keyword_opportunities`)
- `examples/tests/content-opportunities.test.ts` - Testes do sistema de oportunidades
- `examples/tests/serp-analysis.test.ts` - Testes de análise SERP

## DOCUMENTATION:

### API Documentation:
- **Supabase JavaScript Client**: https://supabase.com/docs/reference/javascript/introduction
- **WordPress REST API v2**: https://developer.wordpress.org/rest-api/reference/
- **n8n API Reference**: https://docs.n8n.io/api/api-reference/
- **Supabase REST API**: https://supabase.com/docs/guides/api
- **WordPress Authentication**: https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/

### Technical Stack Documentation:
- **React 18 Documentation**: https://react.dev/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui Components**: https://ui.shadcn.com/
- **React Query**: https://tanstack.com/query/latest/docs/react/overview
- **Zustand**: https://github.com/pmndrs/zustand
- **Chart.js**: https://www.chartjs.org/docs/latest/

### Backend PAWA Reference (Real Structure):
- **Core Tables**: `blogs`, `authors`, `main_keywords`, `keyword_variations`, `content_posts`
- **Intelligence**: `keyword_clusters`, `keyword_categories`, `content_opportunities_clusters`
- **Analytics**: `analytics_metrics`, `serp_results`, `media_assets`, `post_meta`
- **Advanced Views**: `executive_dashboard`, `keyword_opportunities`, `production_pipeline`, `serp_competition_analysis`
- **Vector Search**: Embeddings `extensions.vector(1536)` nas tabelas principais
- **Queue System**: PGMQ tables (`q_embedding_jobs`, `a_embedding_jobs`) para processamento assíncrono
- **Specialized Views**: `keyword_categorization_metrics`, `content_cluster_opportunities`, `niche_overview`

### MCP Server Sources:
Configure os seguintes MCP servers para Context Engineering avançado:

**1. Supabase MCP Server** - `@supabase/mcp-server-supabase`
- **Propósito**: Integração direta com projetos Supabase via Model Context Protocol
- **Funcionalidades**: Gerenciamento de projetos, design de tabelas, consultas SQL, tipos TypeScript
- **Configuração**: 
  ```json
  {
    "mcpServers": {
      "supabase": {
        "command": "npx",
        "args": ["-y", "@supabase/mcp-server-supabase@latest", "--read-only", "--project-ref=<project-ref>"],
        "env": {
          "SUPABASE_ACCESS_TOKEN": "<personal-access-token>"
        }
      }
    }
  }
  ```
- **Recursos**: Execução SQL, migrations, configurações, logs, branches
- **Documentação**: https://supabase.com/docs/guides/getting-started/mcp

**2. shadcn/ui MCP Server** - `@jpisnice/shadcn-ui-mcp-server`
- **Propósito**: Acesso a componentes shadcn/ui v4 com documentação e exemplos
- **Funcionalidades**: Código fonte de componentes, demos, blocos, metadados
- **Configuração**:
  ```json
  {
    "mcpServers": {
      "shadcn-ui": {
        "command": "npx",
        "args": ["-y", "@jpisnice/shadcn-ui-mcp-server", "--github-api-key", "<github-token>"]
      }
    }
  }
  ```
- **Recursos**: `get_component`, `get_component_demo`, `list_components`, `get_installation_guide`
- **Documentação**: https://github.com/Jpisnice/shadcn-ui-mcp-server

**3. Context7 MCP Server** - `@upstash/context7-mcp`
- **Propósito**: Documentação atualizada e específica por versão para bibliotecas/frameworks
- **Funcionalidades**: Docs em tempo real, exemplos de código, prevenção de APIs obsoletas
- **Configuração**:
  ```json
  {
    "mcpServers": {
      "context7": {
        "command": "npx",
        "args": ["-y", "@upstash/context7-mcp@latest"]
      }
    }
  }
  ```
- **Uso**: Adicionar `use context7` nos prompts para documentação atualizada
- **Recursos**: `resolve-library-id`, `get-library-docs`, 9000+ bibliotecas suportadas
- **Documentação**: https://github.com/upstash/context7

## OTHER CONSIDERATIONS:

### Performance & Scalability (Backend PAWA):
- **View Optimization**: Usar views materializadas para dashboards pesados (`executive_dashboard`)
- **Vector Indexing**: Implementar HNSW indexes para busca semântica rápida
- **PGMQ Processing**: Usar sistema de filas para embeddings assíncronos
- **Blog Isolation**: Otimizar queries com `blog_id` filtering
- **Constraint Validation**: Cache validações de constraints no frontend
- **Large Tables**: Implementar paginação para `keyword_variations` e `serp_results`

### Security & Authentication (Backend PAWA):
- **Row Level Security**: Implementar RLS baseado em `blog_id` para isolamento total
- **PostgreSQL Constraints**: Respeitar constraints como `main_keywords_competition_check`
- **Vector Data Security**: Proteger embeddings sensíveis com encryption at rest
- **Queue Security**: Implementar autenticação para PGMQ operations
- **View Permissions**: Configurar permissões específicas para views de dashboard
- **Audit Trail**: Usar tabelas de auditoria para mudanças críticas

### Error Handling & Monitoring (Backend PAWA):
- **PostgreSQL Errors**: Mapear erros específicos de constraints e foreign keys
- **Vector Search Failures**: Handling de falhas em embeddings e busca semântica
- **PGMQ Monitoring**: Monitorar filas de processamento de embeddings
- **View Performance**: Alertas para views lentas (`executive_dashboard`, `serp_competition_analysis`)
- **Blog Context Errors**: Validação de `blog_id` em todas as operações
- **Large Dataset Handling**: Timeout e pagination para tabelas grandes

### Multi-Blog Architecture (Backend PAWA):
- **Blog Isolation**: Usar `blog_id` como chave de isolamento em todas as tabelas
- **Dynamic Context**: Switch entre blogs com recarga de contexto completo
- **Shared Resources**: `authors` table compartilhada entre blogs
- **Independent Analytics**: `analytics_metrics` isoladas por `blog_id`
- **Bulk Operations**: Operações em lote respeitando isolamento de blogs
- **Cross-Blog Analysis**: Views agregadas como `niche_overview` para análise comparativa

### Backend PAWA Integration Specifics:
- **Table Structure**: Integração direta com as 20+ tabelas do schema PostgreSQL
- **Views Integration**: Usar views otimizadas como `executive_dashboard`, `keyword_opportunities`
- **Vector Search**: Implementar busca semântica usando embeddings `vector(1536)`
- **Queue Processing**: Integrar com PGMQ para processamento assíncrono de embeddings
- **Constraint Handling**: Respeitar constraints como `keyword_variations_competition_check`
- **Multi-Blog Context**: Implementar isolamento via `blog_id` em todas as operações

### Real-time Features com Backend PAWA:
- **Supabase Subscriptions**: Real-time updates para mudanças no banco
- **WebSocket Fallback**: Fallback para long-polling se WebSocket falhar
- **Optimistic Updates**: Updates otimistas para melhor UX
- **Conflict Resolution**: Resolução de conflitos para edições simultâneas

### WordPress Integration (Backend PAWA):
- **Post Sync**: Sincronização bidirecional entre `content_posts` e WordPress
- **Media Management**: Integração de `media_assets` com WordPress Media Library
- **SEO Data**: Sync de `seo_title`, `seo_description`, `focus_keyword` com WordPress SEO plugins
- **Categories/Tags**: Sincronização entre `blog_categories`/`blog_tags` e WordPress taxonomies
- **Publishing Pipeline**: Workflow completo da view `production_pipeline` para WordPress
- **WordPress Post ID**: Campo `wordpress_post_id` para mapeamento direto

### n8n Integration Complexities:
- **Workflow State**: Monitorar estado de execução de workflows
- **Trigger Management**: Gerenciar triggers e webhooks
- **Credential Security**: Armazenar credenciais n8n de forma segura
- **Execution Logs**: Visualizar logs de execução de workflows

### Data Synchronization (Backend PAWA):
- **Content Sync**: Sync bidirecional entre `content_posts` e WordPress posts
- **Keywords Tracking**: Atualizar `is_used` em `main_keywords` baseado em uso real
- **SERP Monitoring**: Atualização automática de `serp_results` via APIs externas
- **Analytics Updates**: Inserção contínua em `analytics_metrics` de dados WordPress
- **Embedding Processing**: PGMQ para processamento assíncrono de embeddings
- **Blog Settings**: Sync de configurações entre `blogs.settings` e WordPress

### MCP Development Integration:
- **Context Engineering**: Usar MCP servers para contexto máximo durante desenvolvimento
- **Real-time Docs**: Context7 MCP para documentação sempre atualizada
- **Component Access**: shadcn/ui MCP para componentes com contexto completo
- **Database Operations**: Supabase MCP para operações inteligentes
- **Usage Pattern**: Adicionar `use context7` consistentemente em prompts
- **Security**: Configurar tokens apropriados e permissões mínimas

### Context Engineering Enhancement:
- **MCP Integration**: Integrar Supabase MCP, shadcn/ui MCP e Context7 MCP para contexto avançado
- **Real-time Context**: Usar Context7 MCP para documentação sempre atualizada
- **Component Context**: Usar shadcn/ui MCP para componentes com contexto completo
- **Database Context**: Usar Supabase MCP para operações de banco mais inteligentes
- **Documentation Pattern**: Usar `use context7` consistentemente em prompts para melhor contexto

### UI/UX Considerations:
- **Loading States**: Estados de loading informativos
- **Empty States**: Estados vazios bem desenhados
- **Mobile Responsiveness**: Design responsivo para mobile
- **Accessibility**: Padrões WCAG para acessibilidade
- **Theme Support**: Suporte a temas claro/escuro

### MCP Integration Strategy:
- **Environment Setup**: Configurar MCP servers localmente para desenvolvimento
- **Token Management**: Gerenciar tokens do GitHub, Supabase e Context7 de forma segura
- **Usage Patterns**: Implementar padrões consistentes para chamadas MCP
- **Rate Limiting**: Implementar rate limiting para evitar excesso de chamadas
- **Error Handling**: Tratar erros de MCP servers adequadamente com fallbacks

### MCP Integration Best Practices:
- **Supabase MCP**: Configurar modo read-only por padrão para prevenir alterações não intencionais
- **shadcn/ui MCP**: Utilizar GitHub token para melhor rate limiting (5000 requests/hour vs 60)
- **Context7 MCP**: Usar sintaxe `use context7` consistentemente em prompts para documentação atualizada
- **Security**: Manter tokens de acesso seguros e usar variáveis de ambiente
- **Performance**: Implementar cache para respostas MCP quando possível
- **Fallback**: Ter estratégias de fallback caso MCP servers sejam indisponíveis

### MCP Debugging & Monitoring:
- **MCP Inspector**: Usar http://127.0.0.1:6274 para debug de MCP servers
- **Logging**: Implementar logging detalhado para chamadas MCP
- **Health Checks**: Monitorar saúde dos MCP servers
- **Performance Monitoring**: Monitorar latência e throughput
- **Error Tracking**: Rastrear erros e exceptions dos MCP servers
- **Rate Limit Monitoring**: Monitorar rate limits e implementar backoff

### MCP Troubleshooting Tips:
- **Verificar Tokens**: Ensure todos os tokens (GitHub, Supabase) estão configurados
- **Node Version**: Usar Node.js v18+ para compatibilidade com MCP servers
- **Network Issues**: Verificar conectividade para GitHub e Supabase APIs
- **Rate Limits**: Implementar backoff strategy para rate limits do GitHub
- **Debug Mode**: Usar MCP Inspector (http://127.0.0.1:6274) para debug
- **Fallback**: Ter estratégias de fallback quando MCP servers estão indisponíveis

### MCP Troubleshooting:
- **Connection Issues**: Verificar tokens e configurações MCP
- **Rate Limiting**: Implementar backoff strategy para rate limits
- **Fallback Strategies**: Ter alternativas quando MCP servers estão indisponíveis
- **Debug Mode**: Usar MCP Inspector para debug (http://127.0.0.1:6274)
- **Performance**: Otimizar chamadas MCP para evitar latência

### MCP Configuration Patterns:
- **Environment Variables**: Usar .env para tokens sensíveis
- **Read-Only Mode**: Configurar Supabase MCP em modo read-only por segurança
- **GitHub Rate Limits**: Usar GitHub token para melhor rate limiting
- **Error Handling**: Implementar try-catch para chamadas MCP
- **Performance**: Cache responses MCP quando apropriado
- **Monitoring**: Monitorar saúde dos MCP servers

### MCP Configuration Considerations:
- **Local Development**: Configurar MCP servers localmente para desenvolvimento
- **Production Setup**: Configurar MCP servers para produção com tokens apropriados
- **Security**: Manter tokens MCP em variáveis de ambiente seguras
- **Performance**: Implementar cache para respostas MCP quando necessário
- **Monitoring**: Monitorar saúde e performance dos MCP servers

### Development & Deployment (Backend PAWA):
- **Database Migrations**: Sistema de migrations para schema PostgreSQL
- **View Dependencies**: Gerenciar dependências entre views complexas
- **Vector Extensions**: Ensure pgvector extension está disponível
- **PGMQ Setup**: Configurar sistema de filas para embeddings
- **Performance Monitoring**: Monitorar queries pesadas e views
- **Backup Strategy**: Backup especial para dados de embeddings vetoriais

### Backend PAWA Advanced Capabilities:

**Vector Search Implementation:**
```typescript
// Busca semântica usando embeddings vector(1536)
const { data } = await supabase.rpc('find_similar_keywords', {
  query_embedding: userQuery,
  match_threshold: 0.8,
  match_count: 10
});
// Integração com Context7 MCP para documentação de vector search
```

**PGMQ Queue Processing:**
```typescript
// Sistema de filas para processamento assíncrono
const { data } = await supabase
  .from('q_embedding_jobs')
  .insert({
    message: {
      table: 'keyword_variations',
      id: keywordId,
      action: 'generate_embedding'
    }
  });
// Monitoramento via dashboard de filas
```

**Advanced Analytics Views:**
```typescript
// Views complexas para insights avançados
const serpAnalysis = await supabase
  .from('serp_competition_analysis')
  .select('*')
  .eq('blog_name', selectedBlog);

const contentOpportunities = await supabase
  .from('content_cluster_opportunities_no_embedding')
  .select('*')
  .order('opportunity_score', { ascending: false });
```

### Backend PAWA Functions & Procedures:
- **Scoring Functions**: `calculate_keyword_opportunity_score()` para ranking de oportunidades
- **Vector Functions**: `find_similar_keywords()`, `find_similar_posts()` para busca semântica
- **Analytics Functions**: `get_niche_statistics()` para estatísticas agregadas
- **Validation Functions**: `is_special_msv()` para validação de valores especiais
- **Content Functions**: Funções para análise de gaps e detecção de duplicatas
- **PGMQ Operations**: Funções para gerenciamento de filas de embeddings

### Backend PAWA Real Schema Insights:
- **Constraints System**: Sistema robusto de constraints para integridade de dados
- **Vector Embeddings**: Implementação completa com `extensions.vector(1536)`
- **Queue Processing**: PGMQ implementado para processamento assíncrono
- **View Optimization**: Views complexas otimizadas para dashboards
- **Multi-tenant Design**: Arquitetura nativa multi-blog via `blog_id`
- **Analytics Ready**: Estrutura preparada para métricas e relatórios
- **View Performance**: Monitorar `executive_dashboard`, `keyword_opportunities`, `serp_competition_analysis`
- **Vector Search Latency**: Métricas de performance de busca semântica
- **PGMQ Queue Health**: Status das filas de processamento de embeddings
- **Blog Isolation**: Verificar isolamento correto via `blog_id`
- **Constraint Violations**: Alertas para violações de constraints PostgreSQL
- **Large Table Growth**: Monitorar crescimento de `keyword_variations`, `serp_results`