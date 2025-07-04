name: "Dashboard Frontend PAWA - Context Engineering & MCP Integration"
description: |

## Purpose
Build a comprehensive, production-ready dashboard frontend for a WordPress content management SaaS with advanced Context Engineering using MCP (Model Context Protocol) servers. This system serves as a unified control center for multi-blog SEO content management with real-time analytics, AI-powered keyword clustering, and automated content pipeline management.

## Core Principles
1. **Context Engineering First**: Leverage MCP servers for maximum development efficiency
2. **Real-time by Design**: Implement Supabase real-time subscriptions throughout
3. **Performance Optimized**: Handle large datasets with proper caching and pagination
4. **Type-Safe**: Full TypeScript coverage with proper database typing
5. **Component-Driven**: Follow shadcn/ui patterns for consistency

---

## Goal
Create a modern, responsive dashboard frontend that serves as the central hub for managing multiple WordPress blogs, keyword research, content opportunities, SERP analysis, and production pipelines. The system must integrate seamlessly with the existing PostgreSQL backend (20+ tables with vector embeddings), WordPress REST API, n8n automation platform, and Supabase real-time features.

## Why
- **Business Value**: Centralizes complex SEO workflow management for multiple WordPress sites
- **Integration**: Unifies scattered tools into cohesive workflow management platform
- **AI Enhancement**: Leverages vector embeddings for semantic keyword clustering and content opportunities
- **Automation**: Reduces manual work through n8n integration and automated pipelines
- **Real-time Insights**: Provides immediate feedback on content performance and keyword opportunities

## What
A comprehensive dashboard application featuring:
- **Executive Dashboard**: High-level KPIs and metrics across all blogs
- **Multi-Blog Management**: Switch between multiple WordPress sites seamlessly
- **Keyword Intelligence**: Manage main keywords, variations, and opportunity scoring
- **Content Pipeline**: Track content from ideation to publication with WordPress sync
- **SERP Analysis**: Competitive analysis with automated data collection
- **Vector Search**: Semantic search across keywords and content using embeddings
- **Real-time Updates**: Live updates across all dashboard components
- **n8n Integration**: Monitor and control automation workflows

### Success Criteria
- [ ] Executive dashboard displays real-time metrics from all blogs
- [ ] Keyword opportunities ranked by proprietary scoring algorithm
- [ ] Content pipeline tracks posts from draft to published with WordPress sync
- [ ] SERP analysis provides competitive insights with automated data collection
- [ ] Vector search enables semantic discovery of related keywords and content
- [ ] Real-time subscriptions update UI without page refresh
- [ ] MCP servers provide context-aware development experience
- [ ] All components follow shadcn/ui patterns for consistency
- [ ] Performance handles 10,000+ keywords and 1,000+ posts per blog
- [ ] WordPress API integration enables bidirectional content sync

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window

# Database Schema & Backend
- file: backup_estrutura.sql
  why: Complete PostgreSQL schema with 20+ tables, vector embeddings, views, and PGMQ
  critical: Contains exact table structures, relationships, and constraints

# MCP Server Configuration
- url: https://supabase.com/docs/guides/getting-started/mcp
  why: Supabase MCP server setup and configuration patterns
  section: Installation and authentication with personal access tokens

- url: https://github.com/Jpisnice/shadcn-ui-mcp-server
  why: shadcn/ui MCP server for component access and examples
  section: Component source code, demos, and installation patterns

- url: https://github.com/upstash/context7
  why: Context7 MCP for real-time documentation and code examples
  section: Usage patterns with "use context7" prompt enhancement

# Frontend Technologies
- url: https://react.dev/
  why: React 18+ patterns, hooks, and modern development practices
  section: Concurrent features, Suspense, and streaming SSR

- url: https://ui.shadcn.com/docs
  why: shadcn/ui component library patterns and customization
  section: Installation, theming, and component composition

- url: https://github.com/pmndrs/zustand
  why: State management patterns for complex dashboard state
  section: Async actions, middleware, and TypeScript integration

- url: https://tanstack.com/query/latest/docs/react/overview
  why: Data fetching, caching, and synchronization patterns
  section: Mutations, optimistic updates, and real-time subscriptions

- url: https://supabase.com/docs/reference/javascript/introduction
  why: Supabase JavaScript client patterns and real-time subscriptions
  section: Auth, database queries, and real-time subscriptions

# API Documentation
- url: https://developer.wordpress.org/rest-api/reference/
  why: WordPress REST API v2 for content management and synchronization
  section: Posts, pages, media, categories, and authentication

- url: https://docs.n8n.io/api/api-reference/
  why: n8n API for workflow monitoring and control
  section: Workflow execution, status monitoring, and webhook management

# Chart and Visualization
- url: https://www.chartjs.org/docs/latest/
  why: Chart.js patterns for dashboard visualizations
  section: Real-time data updates, responsive design, and performance

- url: https://recharts.org/en-US/
  why: Recharts patterns for React-specific chart components
  section: Composition, data transformation, and animations
```

### Current Codebase Tree
```bash
.
├── CLAUDE.md                    # Project instructions and constraints
├── INITIAL.md                   # Feature specification
├── backup_estrutura.sql         # Complete PostgreSQL schema
├── PRPs/
│   ├── templates/
│   │   └── prp_base.md         # PRP template
│   └── EXAMPLE_multi_agent_prp.md
├── examples/                    # Empty directory for examples
├── README.md                    # Project documentation
└── LICENSE                      # Project license
```

### Desired Codebase Tree
```bash
.
├── dashboard-frontend/
│   ├── package.json                    # Dependencies and scripts
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── tailwind.config.js              # Tailwind CSS configuration
│   ├── components.json                 # shadcn/ui configuration
│   ├── .env.example                    # Environment variables template
│   ├── .env.local                      # Local environment variables
│   ├── next.config.js                  # Next.js configuration
│   ├── src/
│   │   ├── app/                        # Next.js 13+ app directory
│   │   │   ├── layout.tsx              # Root layout with providers
│   │   │   ├── page.tsx                # Executive dashboard page
│   │   │   ├── blogs/
│   │   │   │   ├── page.tsx            # Blog management page
│   │   │   │   └── [blogId]/
│   │   │   │       ├── page.tsx        # Blog-specific dashboard
│   │   │   │       ├── keywords/
│   │   │   │       │   ├── page.tsx    # Keywords management
│   │   │   │       │   └── opportunities/
│   │   │   │       │       └── page.tsx # Keyword opportunities
│   │   │   │       ├── content/
│   │   │   │       │   ├── page.tsx    # Content management
│   │   │   │       │   └── pipeline/
│   │   │   │       │       └── page.tsx # Production pipeline
│   │   │   │       ├── serp/
│   │   │   │       │   └── page.tsx    # SERP analysis
│   │   │   │       └── automation/
│   │   │   │           └── page.tsx    # n8n workflows
│   │   │   ├── settings/
│   │   │   │   └── page.tsx            # Application settings
│   │   │   └── globals.css             # Global styles
│   │   ├── components/
│   │   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── dashboard/
│   │   │   │   ├── executive-dashboard.tsx
│   │   │   │   ├── blog-selector.tsx
│   │   │   │   ├── metrics-cards.tsx
│   │   │   │   └── activity-feed.tsx
│   │   │   ├── keywords/
│   │   │   │   ├── keyword-table.tsx
│   │   │   │   ├── keyword-form.tsx
│   │   │   │   ├── opportunity-matrix.tsx
│   │   │   │   └── clustering-network.tsx
│   │   │   ├── content/
│   │   │   │   ├── content-table.tsx
│   │   │   │   ├── content-form.tsx
│   │   │   │   ├── pipeline-board.tsx
│   │   │   │   └── seo-optimizer.tsx
│   │   │   ├── serp/
│   │   │   │   ├── serp-table.tsx
│   │   │   │   ├── competition-heatmap.tsx
│   │   │   │   └── ranking-chart.tsx
│   │   │   ├── automation/
│   │   │   │   ├── workflow-list.tsx
│   │   │   │   ├── workflow-monitor.tsx
│   │   │   │   └── execution-logs.tsx
│   │   │   ├── charts/
│   │   │   │   ├── line-chart.tsx
│   │   │   │   ├── bar-chart.tsx
│   │   │   │   ├── pie-chart.tsx
│   │   │   │   └── heatmap.tsx
│   │   │   └── layout/
│   │   │       ├── sidebar.tsx
│   │   │       ├── header.tsx
│   │   │       ├── breadcrumb.tsx
│   │   │       └── footer.tsx
│   │   ├── lib/
│   │   │   ├── utils.ts                # Utility functions
│   │   │   ├── supabase.ts             # Supabase client
│   │   │   ├── wordpress.ts            # WordPress API client
│   │   │   ├── n8n.ts                  # n8n API client
│   │   │   ├── validations.ts          # Form validation schemas
│   │   │   └── constants.ts            # Application constants
│   │   ├── hooks/
│   │   │   ├── use-blogs.ts            # Blog data management
│   │   │   ├── use-keywords.ts         # Keyword data management
│   │   │   ├── use-content.ts          # Content data management
│   │   │   ├── use-serp.ts             # SERP data management
│   │   │   ├── use-automation.ts       # n8n workflow management
│   │   │   ├── use-realtime.ts         # Real-time subscriptions
│   │   │   └── use-vector-search.ts    # Vector search functionality
│   │   ├── store/
│   │   │   ├── blog-store.ts           # Blog state management
│   │   │   ├── keyword-store.ts        # Keyword state management
│   │   │   ├── content-store.ts        # Content state management
│   │   │   ├── ui-store.ts             # UI state management
│   │   │   └── index.ts                # Store exports
│   │   ├── types/
│   │   │   ├── database.ts             # Database types (generated)
│   │   │   ├── wordpress.ts            # WordPress API types
│   │   │   ├── n8n.ts                  # n8n API types
│   │   │   └── index.ts                # Type exports
│   │   └── providers/
│   │       ├── supabase-provider.tsx   # Supabase client provider
│   │       ├── theme-provider.tsx      # Theme provider
│   │       └── query-provider.tsx      # React Query provider
│   ├── public/
│   │   ├── favicon.ico
│   │   └── images/
│   ├── tests/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── setup.ts
│   ├── docs/
│   │   ├── mcp-setup.md               # MCP server setup guide
│   │   ├── database-schema.md         # Database documentation
│   │   ├── api-integration.md         # API integration guide
│   │   └── deployment.md              # Deployment guide
│   └── README.md                      # Project documentation
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Supabase requires proper TypeScript types generation
// Run: npx supabase gen types typescript --project-id <project-id> > src/types/database.ts

// CRITICAL: Vector search requires proper embedding handling
// Embeddings are stored as vector(1536) - OpenAI embedding dimension
// Use rpc() calls for vector similarity functions

// CRITICAL: PGMQ requires proper queue monitoring
// Queue tables: q_embedding_jobs, a_embedding_jobs
// Monitor queue health and processing status

// CRITICAL: WordPress API requires proper authentication
// Use Application Passwords for secure API access
// Handle rate limiting and API timeouts

// CRITICAL: n8n API requires webhook authentication
// Secure webhook endpoints with proper validation
// Monitor workflow execution status

// CRITICAL: Real-time subscriptions require proper cleanup
// Use useEffect cleanup functions to prevent memory leaks
// Handle reconnection logic for network interruptions

// CRITICAL: shadcn/ui requires proper theme configuration
// CSS variables must be defined in globals.css
// Dark mode requires proper theme provider setup

// CRITICAL: Performance optimization required for large datasets
// Implement virtual scrolling for large tables
// Use React.memo for expensive component renders
// Implement proper caching strategies
```

## Implementation Blueprint

### Data Models and Structure

Create comprehensive TypeScript types for type safety and consistency:

```typescript
// src/types/database.ts - Generated from Supabase
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
          name: string;
          domain: string;
          niche?: string | null;
          description?: string | null;
          settings?: Json;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          domain?: string;
          niche?: string | null;
          description?: string | null;
          settings?: Json;
          is_active?: boolean;
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
        };
        // ... Insert and Update types
      };
      // ... other table types
    };
    Views: {
      executive_dashboard: {
        Row: {
          blog_name: string;
          niche: string;
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
          msv: number;
          kw_difficulty: number;
          cpc: number;
          competition: string;
          search_intent: string;
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
          seo_score: number;
          readability_score: number;
          author_name: string;
          scheduled_at: string | null;
          published_at: string | null;
          created_at: string;
          days_in_status: number | null;
        };
      };
    };
    Functions: {
      find_similar_keywords: {
        Args: {
          query_embedding: number[];
          match_threshold: number;
          match_count: number;
        };
        Returns: {
          id: string;
          keyword: string;
          similarity: number;
        }[];
      };
      calculate_keyword_opportunity_score: {
        Args: {
          msv: number;
          kw_difficulty: number;
          cpc: number;
        };
        Returns: number;
      };
    };
  };
}

// src/types/wordpress.ts - WordPress API types
export interface WordPressPost {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  status: 'publish' | 'draft' | 'pending' | 'private';
  slug: string;
  featured_media: number;
  categories: number[];
  tags: number[];
  meta: {
    seo_title?: string;
    seo_description?: string;
    focus_keyword?: string;
  };
}

// src/types/n8n.ts - n8n API types
export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  nodes: N8nNode[];
  connections: N8nConnection[];
}

export interface N8nExecution {
  id: string;
  workflowId: string;
  mode: 'manual' | 'trigger' | 'webhook';
  startedAt: string;
  stoppedAt: string | null;
  status: 'running' | 'success' | 'error' | 'canceled';
  data: any;
}
```

### List of Tasks to Complete

```yaml
Phase 1: Foundation Setup
Task 1: Project Initialization and MCP Configuration
CREATE dashboard-frontend/:
  - PATTERN: Next.js 13+ app directory structure
  - Initialize with TypeScript, Tailwind CSS, shadcn/ui
  - Configure MCP servers (Supabase, shadcn/ui, Context7)
  - Set up environment variables and configuration

Task 2: Database Types and Client Setup
CREATE src/types/database.ts:
  - PATTERN: Generate from Supabase CLI
  - Include all tables, views, and functions
  - Proper TypeScript integration

CREATE src/lib/supabase.ts:
  - PATTERN: Supabase client with TypeScript
  - Real-time subscription helpers
  - Row Level Security configuration

Phase 2: Core Infrastructure
Task 3: State Management Setup
CREATE src/store/:
  - PATTERN: Zustand with TypeScript and middleware
  - Separate stores for blogs, keywords, content, UI
  - Async actions and optimistic updates

Task 4: Data Fetching and Caching
CREATE src/hooks/:
  - PATTERN: React Query with Supabase integration
  - Custom hooks for each data domain
  - Real-time subscription management

Task 5: UI Component Foundation
CREATE src/components/ui/:
  - PATTERN: Install and configure shadcn/ui components
  - Custom theme configuration
  - Consistent styling patterns

Phase 3: Core Dashboard Features
Task 6: Executive Dashboard
CREATE src/components/dashboard/:
  - PATTERN: Grid layout with metric cards
  - Real-time data from executive_dashboard view
  - Interactive charts and visualizations

Task 7: Blog Management
CREATE src/app/blogs/:
  - PATTERN: CRUD operations for blogs table
  - Blog selector component
  - Blog-specific context switching

Task 8: Keywords Intelligence
CREATE src/app/blogs/[blogId]/keywords/:
  - PATTERN: Data table with filtering and sorting
  - Keyword opportunity scoring
  - Clustering visualization

Phase 4: Advanced Features
Task 9: Content Pipeline
CREATE src/app/blogs/[blogId]/content/:
  - PATTERN: Kanban board for content status
  - WordPress API integration
  - SEO optimization tools

Task 10: SERP Analysis
CREATE src/app/blogs/[blogId]/serp/:
  - PATTERN: Competitive analysis dashboard
  - Heat map visualizations
  - Automated data collection

Task 11: Vector Search
CREATE src/hooks/use-vector-search.ts:
  - PATTERN: Semantic search with embeddings
  - Real-time search suggestions
  - Performance optimization

Phase 5: Automation and Integration
Task 12: n8n Integration
CREATE src/app/blogs/[blogId]/automation/:
  - PATTERN: Workflow monitoring dashboard
  - Execution logs and status tracking
  - Webhook management

Task 13: WordPress API Integration
CREATE src/lib/wordpress.ts:
  - PATTERN: REST API client with authentication
  - Bidirectional content synchronization
  - Media management

Task 14: Real-time Features
CREATE src/hooks/use-realtime.ts:
  - PATTERN: Supabase real-time subscriptions
  - Optimistic updates
  - Conflict resolution

Phase 6: Testing and Optimization
Task 15: Component Testing
CREATE tests/components/:
  - PATTERN: React Testing Library
  - Unit tests for all components
  - Integration tests for complex flows

Task 16: Performance Optimization
OPTIMIZE performance:
  - PATTERN: Virtual scrolling for large tables
  - Memoization for expensive calculations
  - Caching strategies

Task 17: Documentation and Deployment
CREATE docs/:
  - PATTERN: Comprehensive documentation
  - MCP setup guide
  - Deployment instructions
```

### Per Task Pseudocode

```typescript
// Task 1: MCP Configuration
// .cursor-client/mcp.json
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

// Task 3: Blog Store Example
// src/store/blog-store.ts
import { create } from 'zustand';
import { Database } from '@/types/database';

type Blog = Database['public']['Tables']['blogs']['Row'];

interface BlogStore {
  blogs: Blog[];
  selectedBlog: Blog | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchBlogs: () => Promise<void>;
  selectBlog: (blog: Blog) => void;
  createBlog: (blog: Omit<Blog, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateBlog: (id: string, updates: Partial<Blog>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
}

export const useBlogStore = create<BlogStore>((set, get) => ({
  blogs: [],
  selectedBlog: null,
  loading: false,
  error: null,
  
  fetchBlogs: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ blogs: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  selectBlog: (blog) => {
    set({ selectedBlog: blog });
    // Trigger real-time subscriptions for blog-specific data
  },
  
  // ... other actions
}));

// Task 6: Executive Dashboard Component
// src/components/dashboard/executive-dashboard.tsx
'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExecutiveDashboard } from '@/hooks/use-executive-dashboard';
import { MetricsCards } from './metrics-cards';
import { ActivityFeed } from './activity-feed';
import { Charts } from './charts';

export function ExecutiveDashboard() {
  const { data, loading, error, subscribe } = useExecutiveDashboard();
  
  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribe();
    return unsubscribe;
  }, [subscribe]);
  
  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorDisplay error={error} />;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Executive Dashboard</h1>
        <BlogSelector />
      </div>
      
      <MetricsCards data={data} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Charts data={data} />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}

// Task 11: Vector Search Hook
// src/hooks/use-vector-search.ts
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useDebounce } from './use-debounce';

export function useVectorSearch(blogId: string) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const search = useCallback(async (query: string, threshold = 0.8, limit = 10) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Generate embedding for query (you'll need to implement this)
      const embedding = await generateEmbedding(query);
      
      const { data, error } = await supabase.rpc('find_similar_keywords', {
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: limit,
        blog_id: blogId
      });
      
      if (error) throw error;
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [blogId]);
  
  const debouncedSearch = useDebounce(search, 300);
  
  return {
    results,
    loading,
    error,
    search: debouncedSearch
  };
}
```

### Integration Points

```yaml
ENVIRONMENT VARIABLES:
  - add to: .env.local
  - variables: |
      # Supabase Configuration
      NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
      NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
      SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
      
      # WordPress API
      WORDPRESS_API_URL=https://your-blog.com/wp-json/wp/v2
      WORDPRESS_USERNAME=your-username
      WORDPRESS_APP_PASSWORD=your-app-password
      
      # n8n API
      N8N_API_URL=https://your-n8n.com/api/v1
      N8N_API_KEY=your-n8n-api-key
      
      # OpenAI for embeddings
      OPENAI_API_KEY=your-openai-key
      
      # MCP Server Tokens
      SUPABASE_ACCESS_TOKEN=your-supabase-token
      GITHUB_TOKEN=your-github-token

DEPENDENCIES:
  - package.json must include:
    - next: "^14.0.0"
    - react: "^18.0.0"
    - typescript: "^5.0.0"
    - tailwindcss: "^3.0.0"
    - @supabase/supabase-js: "^2.0.0"
    - @tanstack/react-query: "^5.0.0"
    - zustand: "^4.0.0"
    - recharts: "^2.0.0"
    - lucide-react: "^0.300.0"
    - @radix-ui/react-*: "latest"
    - class-variance-authority: "^0.7.0"
    - clsx: "^2.0.0"
    - tailwind-merge: "^2.0.0"

REAL-TIME SUBSCRIPTIONS:
  - Pattern: Subscribe to all relevant tables
  - Cleanup: Proper subscription cleanup in useEffect
  - Reconnection: Handle network interruptions
  - Optimistic Updates: Update UI immediately, rollback on error

PERFORMANCE OPTIMIZATIONS:
  - Virtual scrolling for large datasets
  - React.memo for expensive components
  - Proper caching with React Query
  - Database query optimization
  - Image optimization with Next.js
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
npm run lint                      # ESLint with Next.js config
npm run type-check               # TypeScript compilation
npm run format                   # Prettier formatting

# Expected: No errors. If errors exist, read and fix them.
```

### Level 2: Unit Tests
```typescript
// tests/components/executive-dashboard.test.tsx
import { render, screen } from '@testing-library/react';
import { ExecutiveDashboard } from '@/components/dashboard/executive-dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

function renderWithProviders(component: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
}

describe('ExecutiveDashboard', () => {
  test('renders dashboard title', () => {
    renderWithProviders(<ExecutiveDashboard />);
    expect(screen.getByText('Executive Dashboard')).toBeInTheDocument();
  });
  
  test('displays metrics cards', async () => {
    renderWithProviders(<ExecutiveDashboard />);
    expect(await screen.findByTestId('metrics-cards')).toBeInTheDocument();
  });
  
  test('handles loading state', () => {
    renderWithProviders(<ExecutiveDashboard />);
    expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
  });
});

// tests/hooks/use-vector-search.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useVectorSearch } from '@/hooks/use-vector-search';

describe('useVectorSearch', () => {
  test('returns search results', async () => {
    const { result } = renderHook(() => useVectorSearch('blog-id'));
    
    await waitFor(() => {
      result.current.search('test query');
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.results).toHaveLength(0);
  });
  
  test('handles search errors', async () => {
    // Mock error case
    const { result } = renderHook(() => useVectorSearch('invalid-blog-id'));
    
    await waitFor(() => {
      result.current.search('test query');
    });
    
    expect(result.current.error).toBeTruthy();
  });
});
```

```bash
# Run tests iteratively until passing
npm test                         # Run all tests
npm test -- --coverage         # Run with coverage report
npm test -- --watch            # Run in watch mode

# If failing: Debug specific test, fix code, re-run
```

### Level 3: Integration Tests
```bash
# Start development server
npm run dev

# Test critical user flows:
# 1. Dashboard loads with real data
# 2. Blog selection switches context
# 3. Keyword search returns results
# 4. Content pipeline updates in real-time
# 5. SERP analysis displays competition data

# Expected: All user flows work without errors
# Check browser console for JavaScript errors
# Check network tab for failed API calls
```

### Level 4: Performance Tests
```bash
# Run Lighthouse audit
npm run lighthouse

# Check Core Web Vitals:
# - First Contentful Paint < 2s
# - Largest Contentful Paint < 2.5s
# - Cumulative Layout Shift < 0.1
# - First Input Delay < 100ms

# Expected: All metrics in green range
```

## Final Validation Checklist
- [ ] All TypeScript compiles without errors: `npm run type-check`
- [ ] All linting passes: `npm run lint`
- [ ] All tests pass: `npm test`
- [ ] MCP servers properly configured and accessible
- [ ] Supabase connection and real-time subscriptions working
- [ ] WordPress API integration functional
- [ ] n8n API integration monitoring workflows
- [ ] Vector search returns relevant results
- [ ] Performance metrics meet targets
- [ ] All dashboard views display real data
- [ ] Real-time updates work across all components
- [ ] Mobile responsiveness verified
- [ ] Error handling graceful for all failure modes
- [ ] Documentation complete and accurate

---

## Anti-Patterns to Avoid
- ❌ Don't ignore TypeScript errors - fix them immediately
- ❌ Don't skip real-time subscription cleanup - causes memory leaks
- ❌ Don't hardcode API URLs - use environment variables
- ❌ Don't forget to handle loading and error states
- ❌ Don't skip vector search optimization - performance critical
- ❌ Don't ignore MCP server rate limits - implement proper throttling
- ❌ Don't skip database query optimization - large datasets require it
- ❌ Don't forget WordPress API authentication - security critical
- ❌ Don't skip component memoization - performance optimization required
- ❌ Don't ignore accessibility - implement proper ARIA labels

## Confidence Score: 8/10

High confidence due to:
- Comprehensive database schema provided
- Clear MCP server documentation and setup
- Established patterns for React/TypeScript/Next.js
- shadcn/ui well-documented component library
- Supabase excellent documentation and TypeScript support
- Clear task breakdown with validation gates

Minor uncertainty areas:
- MCP server integration complexity (relatively new technology)
- Vector search performance optimization requirements
- Real-time subscription scale and performance
- Complex state management across multiple domains
- WordPress API rate limiting and authentication edge cases

The comprehensive context provided and clear implementation phases should enable successful one-pass implementation with proper validation loops.