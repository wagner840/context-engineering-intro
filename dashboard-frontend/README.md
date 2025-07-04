# Dashboard Frontend - Context Engineering & MCP Integration

## 🚀 Overview

This is a comprehensive dashboard frontend for WordPress content management SaaS with advanced Context Engineering using MCP (Model Context Protocol) servers. The system serves as a unified control center for multi-blog SEO content management with real-time analytics, AI-powered keyword clustering, and automated content pipeline management.

## ✨ Features

### 🎯 Core Functionality
- **Executive Dashboard**: Real-time metrics and KPIs across all blogs
- **Blog Management**: Multi-blog administration with context switching
- **Keywords Intelligence**: AI-powered opportunity scoring and clustering
- **Content Pipeline**: Kanban-style content management with WordPress integration
- **SERP Analysis**: Competitive insights and ranking tracking
- **Vector Search**: Semantic keyword search with embeddings
- **Automation Monitoring**: n8n workflow control and execution tracking

### 🔧 Technical Features
- **Real-time Subscriptions**: Live updates using Supabase real-time
- **Optimistic Updates**: Instant UI feedback with automatic rollback
- **Multi-blog Support**: Environment-based WordPress configurations
- **Type-safe**: Full TypeScript coverage with database type generation
- **Modern UI**: shadcn/ui components with Tailwind CSS
- **Performance**: React Query caching and optimizations

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 13+ with App Router
- **Database**: PostgreSQL with Supabase
- **State Management**: Zustand + React Query
- **UI Components**: shadcn/ui + Tailwind CSS
- **Real-time**: Supabase Realtime subscriptions
- **WordPress**: REST API v2 integration
- **Automation**: n8n platform integration
- **AI/ML**: Vector embeddings for semantic search

### Database Schema
- **20+ PostgreSQL tables** with vector embeddings
- **Database views** for executive dashboard metrics
- **Real-time triggers** for live updates
- **PGMQ integration** for async processing

## 🚀 Deployment

### Local Development
```bash
# Clone and install dependencies
git clone <repository>
cd dashboard-frontend
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

### Production Deployment (Coolify + VPS)

This project is configured for deployment on Hostinger VPS using Coolify:

1. **Environment Variables**:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # WordPress Blogs
   EINSOF7_WORDPRESS_URL=https://einsof7.com/wp-json/wp/v2
   EINSOF7_WORDPRESS_USERNAME=your_username
   EINSOF7_WORDPRESS_PASSWORD=your_app_password
   
   OPETMIL_WORDPRESS_URL=https://opetmil.com/wp-json/wp/v2
   OPETMIL_WORDPRESS_USERNAME=your_username
   OPETMIL_WORDPRESS_PASSWORD=your_app_password
   
   # n8n Integration
   N8N_API_URL=your_n8n_instance_url
   N8N_API_KEY=your_n8n_api_key
   ```

2. **Docker Build**:
   ```bash
   docker build -t dashboard-frontend .
   ```

3. **Coolify Deployment**:
   - Import the `coolify.yml` configuration
   - Set environment variables in Coolify dashboard
   - Deploy with automatic SSL and domain configuration

### Health Check
The application includes a health check endpoint at `/api/health` for monitoring.

## 📊 Database Setup

### Required PostgreSQL Extensions
```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pgmq";
```

### Key Tables
- `blogs`: Blog configurations and settings
- `main_keywords`: Primary keyword research data
- `keyword_variations`: Keyword variations with embeddings
- `content_posts`: Content management and pipeline
- `serp_results`: SERP tracking and analysis
- `semantic_clusters`: AI-generated keyword clusters
- `automation_executions`: n8n workflow execution logs

### Database Views
- `executive_dashboard`: Aggregated metrics for executive overview
- `keyword_opportunities`: Ranked keyword opportunities
- `production_pipeline`: Content production status

## 🔌 API Integrations

### WordPress REST API
- **Multi-blog support** with environment-based configurations
- **CRUD operations** for posts, categories, tags
- **Media management** with upload capabilities
- **Authentication** using application passwords

### Supabase Integration
- **Real-time subscriptions** for live data updates
- **Vector search** with OpenAI embeddings
- **Row Level Security** for multi-tenant architecture
- **Database functions** for complex queries

### n8n Automation
- **Workflow monitoring** and execution control
- **Status tracking** with real-time updates
- **Error handling** and notification system

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e
```

## 📈 Performance Optimizations

### React Query Caching
- **Stale-while-revalidate** strategy
- **Background refetching** for fresh data
- **Optimistic updates** for instant feedback

### Real-time Optimizations
- **Selective subscriptions** based on active views
- **Debounced updates** to prevent flooding
- **Automatic cleanup** on component unmount

### Virtual Scrolling
- **Large datasets** handled efficiently
- **Windowing** for keyword and content lists
- **Progressive loading** for better UX

## 🔒 Security

### Authentication
- **Supabase Auth** with RLS policies
- **WordPress App Passwords** for API access
- **Environment-based** credential management

### Data Protection
- **Row Level Security** for multi-tenant isolation
- **API key management** with environment variables
- **Secure headers** and CORS configuration

## 🚀 Context Engineering Principles

This dashboard follows Context Engineering principles:

1. **Context-First Architecture**: Every component understands its context
2. **Real-time by Design**: Live updates across all features
3. **Performance Optimized**: Efficient caching and optimistic updates
4. **Type-Safe**: Full TypeScript coverage with database types
5. **Component-Driven**: Reusable, composable UI components

## 📚 Documentation

### API Documentation
- [WordPress REST API](./docs/wordpress-api.md)
- [Supabase Integration](./docs/supabase.md)
- [n8n Workflows](./docs/n8n-automation.md)

### Development Guides
- [Database Schema](./docs/database-schema.md)
- [Component Architecture](./docs/components.md)
- [State Management](./docs/state-management.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using Context Engineering principles and MCP integration**