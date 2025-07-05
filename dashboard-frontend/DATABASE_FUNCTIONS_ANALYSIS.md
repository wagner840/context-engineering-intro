# Database RPC Functions Analysis Report

## Overview
This report analyzes the RPC (Remote Procedure Call) functions required by the semantic search system in the dashboard frontend application.

## Required Functions Analysis

### 1. `match_keywords_semantic` (MISSING)
- **Location**: Used in `/src/app/api/search/semantic/route.ts` line 57
- **Parameters**: 
  - `query_embedding`: number[] (vector)
  - `similarity_threshold`: number (0-1)
  - `match_count`: number (limit)
  - `target_blog_id`: string (optional)
- **Purpose**: Performs semantic search on main_keywords table using vector similarity
- **Status**: ⚠️ **NOT DEFINED** in database types
- **Impact**: The semantic search API will fallback to traditional text search

### 2. `find_similar_keywords` (AVAILABLE)
- **Location**: Used in `/src/app/api/search/vector/route.ts` line 27
- **Parameters**:
  - `query_embedding`: number[]
  - `match_threshold`: number
  - `match_count`: number
  - `blog_id`: string (optional)
- **Returns**: Array of `{id: string, keyword: string, similarity: number}`
- **Status**: ✅ **DEFINED** in database types (lines 695-707)
- **Impact**: Vector keyword search should work properly

### 3. `find_similar_posts` (AVAILABLE)
- **Location**: Used in `/src/app/api/search/vector/route.ts` line 46
- **Parameters**:
  - `query_embedding`: number[]
  - `match_threshold`: number
  - `match_count`: number
  - `blog_id`: string (optional)
- **Returns**: Array of `{id: string, title: string, similarity: number}`
- **Status**: ✅ **DEFINED** in database types (lines 716-728)
- **Impact**: Vector content search should work properly

### 4. `calculate_keyword_opportunity_score` (AVAILABLE)
- **Location**: Used in `/src/lib/supabase.ts` line 77
- **Parameters**:
  - `msv`: number | null
  - `kw_difficulty`: number | null
  - `cpc`: number | null
- **Returns**: number (score)
- **Status**: ✅ **DEFINED** in database types (lines 708-715)
- **Impact**: Keyword opportunity calculation should work

## Database Schema Analysis

### Vector Support Detection
The database schema shows several tables with embedding columns:
- `keyword_variations.embedding`: number[] | null (line 143)
- `content_posts.embedding`: number[] | null (line 199)
- `keyword_clusters.embedding`: number[] | null (line 260)

This indicates that pgvector extension is likely installed and configured.

### Missing Implementation: `match_keywords_semantic`

The function `match_keywords_semantic` is not defined in the database types but is used in the semantic search API. This function should:

1. **Target Table**: `main_keywords` (not `keyword_variations`)
2. **Expected Functionality**: 
   - Find semantically similar keywords using vector similarity
   - Filter by blog_id if provided
   - Return similarity scores above threshold
   - Limit results to match_count

3. **Suggested Implementation** (SQL):
```sql
CREATE OR REPLACE FUNCTION match_keywords_semantic(
  query_embedding vector(1536),
  similarity_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10,
  target_blog_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  keyword text,
  similarity float,
  msv integer,
  competition text,
  search_intent text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mk.id,
    mk.keyword,
    1 - (kv.embedding <=> query_embedding) as similarity,
    mk.msv,
    mk.competition,
    mk.search_intent
  FROM main_keywords mk
  LEFT JOIN keyword_variations kv ON mk.id = kv.main_keyword_id
  WHERE 
    kv.embedding IS NOT NULL
    AND (target_blog_id IS NULL OR mk.blog_id = target_blog_id)
    AND 1 - (kv.embedding <=> query_embedding) > similarity_threshold
  ORDER BY kv.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

## Recommendations

### Immediate Actions Required:
1. **Create `match_keywords_semantic` function** in the database
2. **Verify pgvector extension** is installed and enabled
3. **Test vector similarity operations** with sample data
4. **Update database types** to include the new function

### Verification Steps:
1. Check if pgvector extension is enabled:
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'vector';
   ```

2. Check existing RPC functions:
   ```sql
   SELECT routine_name, routine_type 
   FROM information_schema.routines 
   WHERE routine_schema = 'public' 
   AND routine_name LIKE '%similar%' OR routine_name LIKE '%semantic%';
   ```

3. Test vector operations:
   ```sql
   SELECT id, keyword, embedding IS NOT NULL as has_embedding
   FROM keyword_variations 
   WHERE embedding IS NOT NULL 
   LIMIT 5;
   ```

### Current System Status:
- **Vector Search**: ✅ Should work (functions defined)
- **Semantic Search**: ⚠️ Will fallback to text search (missing function)
- **Keyword Opportunity**: ✅ Should work (function defined)
- **Database Connection**: ✅ Configured with MCP Supabase

### Next Steps:
1. Connect to the database using MCP Supabase tools
2. Verify the actual implementation status
3. Create missing functions if needed
4. Test the semantic search functionality end-to-end

## Environment Details
- **Database**: Supabase (project ref: wayzhnpwphekjuznwqnr)
- **MCP Configuration**: Available in `.cursor-client/mcp.json`
- **Vector Dimensions**: 1536 (OpenAI text-embedding-ada-002)
- **Fallback Strategy**: Text-based search implemented for missing functions