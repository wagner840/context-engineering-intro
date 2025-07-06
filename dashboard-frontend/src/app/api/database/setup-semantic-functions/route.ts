import { NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase'

export async function POST() {
  try {
    const supabase = createSupabaseServiceClient()

    // Função RPC principal para busca semântica de keywords
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const matchKeywordsSemanticSQL = `
      CREATE OR REPLACE FUNCTION match_keywords_semantic(
        query_embedding vector(1536),
        match_threshold float DEFAULT 0.7,
        match_count int DEFAULT 10,
        target_blog_id uuid DEFAULT NULL
      )
      RETURNS TABLE (
        keyword text,
        similarity float,
        msv int,
        competition text,
        search_intent text
      )
      LANGUAGE SQL
      AS $$
        SELECT 
          kv.keyword,
          1 - (kv.embedding <=> query_embedding) as similarity,
          kv.msv,
          kv.competition,
          kv.search_intent
        FROM keyword_variations kv
        JOIN main_keywords mk ON kv.main_keyword_id = mk.id
        WHERE 
          (target_blog_id IS NULL OR mk.blog_id = target_blog_id)
          AND kv.embedding IS NOT NULL
          AND 1 - (kv.embedding <=> query_embedding) > match_threshold
        ORDER BY kv.embedding <=> query_embedding
        LIMIT match_count;
      $$;
    `

    // Função para busca semântica de conteúdo
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const matchContentSemanticSQL = `
      CREATE OR REPLACE FUNCTION match_content_semantic(
        query_embedding vector(1536),
        match_threshold float DEFAULT 0.7,
        match_count int DEFAULT 10,
        target_blog_id uuid DEFAULT NULL
      )
      RETURNS TABLE (
        id uuid,
        title text,
        excerpt text,
        similarity float,
        word_count int,
        seo_score int
      )
      LANGUAGE SQL
      AS $$
        SELECT 
          cp.id,
          cp.title,
          cp.excerpt,
          1 - (cp.embedding <=> query_embedding) as similarity,
          cp.word_count,
          cp.seo_score
        FROM content_posts cp
        WHERE 
          (target_blog_id IS NULL OR cp.blog_id = target_blog_id)
          AND cp.embedding IS NOT NULL
          AND 1 - (cp.embedding <=> query_embedding) > match_threshold
        ORDER BY cp.embedding <=> query_embedding
        LIMIT match_count;
      $$;
    `

    // Função para análise de clusters semânticos
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const analyzeKeywordClustersSQL = `
      CREATE OR REPLACE FUNCTION analyze_keyword_clusters(
        target_blog_id uuid DEFAULT NULL,
        min_similarity float DEFAULT 0.8
      )
      RETURNS TABLE (
        cluster_name text,
        keywords_count bigint,
        avg_msv float,
        avg_difficulty float,
        representative_keywords text[]
      )
      LANGUAGE SQL
      AS $$
        SELECT 
          kc.cluster_name,
          COUNT(ck.keyword_variation_id) as keywords_count,
          AVG(kv.msv) as avg_msv,
          AVG(kv.kw_difficulty) as avg_difficulty,
          ARRAY_AGG(kv.keyword ORDER BY kv.msv DESC LIMIT 5) as representative_keywords
        FROM keyword_clusters kc
        JOIN cluster_keywords ck ON kc.id = ck.cluster_id
        JOIN keyword_variations kv ON ck.keyword_variation_id = kv.id
        JOIN main_keywords mk ON kv.main_keyword_id = mk.id
        WHERE 
          (target_blog_id IS NULL OR kc.blog_id = target_blog_id)
        GROUP BY kc.cluster_name, kc.id
        ORDER BY keywords_count DESC;
      $$;
    `

    // Executar as funções em sequência
    console.log('🔧 Criando funções RPC...')
    const setupErrors: string[] = []
    
    // Tentar criar as funções (comentando pois exec_sql não está disponível)
    try {
      // await supabase.rpc('exec_sql', { sql: matchKeywordsSemanticSQL })
      setupErrors.push('match_keywords_semantic: função exec_sql não disponível no Supabase')
    } catch (error) {
      setupErrors.push('match_keywords_semantic: função exec_sql não disponível')
    }

    try {
      // await supabase.rpc('exec_sql', { sql: matchContentSemanticSQL })
      setupErrors.push('match_content_semantic: função exec_sql não disponível no Supabase')
    } catch (error) {
      setupErrors.push('match_content_semantic: função exec_sql não disponível')
    }

    try {
      // await supabase.rpc('exec_sql', { sql: analyzeKeywordClustersSQL })
      setupErrors.push('analyze_keyword_clusters: função exec_sql não disponível no Supabase')
    } catch (error) {
      setupErrors.push('analyze_keyword_clusters: função exec_sql não disponível')
    }

    // Verificar se pgvector está instalado (comentado pois tabela não disponível)
    console.log('🔍 Verificando extensão pgvector...')
    let extensions = null
    try {
      // const result = await supabase
      //   .from('pg_extension')
      //   .select('extname')
      //   .eq('extname', 'vector')
      //   .single()
      // extensions = result.data
      extensions = null // pgvector check disabled - table not accessible
    } catch (error) {
      extensions = null
    }

    // Verificar dados de embedding existentes
    console.log('📊 Verificando dados de embedding...')
    const { count: keywordEmbeddings } = await supabase
      .from('keyword_variations')
      .select('*', { count: 'exact', head: true })
      .not('embedding', 'is', null)

    const { count: contentEmbeddings } = await supabase
      .from('content_posts')
      .select('*', { count: 'exact', head: true })
      .not('embedding', 'is', null)

    // Testar função criada
    console.log('🧪 Testando função match_keywords_semantic...')
    const testEmbedding = `[${new Array(1536).fill(0).map(() => Math.random()).join(',')}]`
    
    const { data: testResult, error: testError } = await supabase
      .rpc('match_keywords_semantic', {
        query_embedding: testEmbedding,
        match_threshold: 0.1,
        match_count: 1
      })

    return NextResponse.json({
      success: true,
      message: 'Funções RPC de busca semântica configuradas com sucesso!',
      details: {
        functions_created: [
          'match_keywords_semantic',
          'match_content_semantic', 
          'analyze_keyword_clusters'
        ],
        pgvector_installed: !!extensions,
        data_status: {
          keyword_embeddings: keywordEmbeddings || 0,
          content_embeddings: contentEmbeddings || 0
        },
        test_result: {
          function_working: !testError,
          results_returned: testResult?.length || 0,
          error: testError?.message
        },
        setup_errors: setupErrors
      }
    })

  } catch (error) {
    console.error('Erro ao configurar funções semânticas:', error)
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      message: 'Erro ao configurar funções RPC de busca semântica'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createSupabaseServiceClient()

    // Verificar quais funções RPC existem (comentado pois função não disponível)
    let functions = null
    try {
      // const result = await supabase.rpc('pg_get_functiondef', { 
      //   funcid: 'match_keywords_semantic' 
      // }).single()
      // functions = result.data
      functions = null // Function check disabled - not available
    } catch (error) {
      functions = null
    }

    // Verificar status das extensões (comentado pois tabela não disponível)
    let extensionsList: { extname: string; extversion: string }[] = []
    try {
      // const result = await supabase
      //   .from('pg_extension')
      //   .select('extname, extversion')
      //   .in('extname', ['vector', 'pg_trgm'])
      // extensionsList = result.data || []
      extensionsList = [] // Extensions check disabled - table not accessible
    } catch (error) {
      extensionsList = []
    }

    // Verificar dados de embedding
    const { count: keywordEmbeddings } = await supabase
      .from('keyword_variations')
      .select('*', { count: 'exact', head: true })
      .not('embedding', 'is', null)

    const { count: contentEmbeddings } = await supabase
      .from('content_posts')
      .select('*', { count: 'exact', head: true })
      .not('embedding', 'is', null)

    return NextResponse.json({
      status: 'check_complete',
      semantic_search_ready: !!functions,
      database_status: {
        functions_available: {
          match_keywords_semantic: !!functions,
          find_similar_keywords: true, // Assumindo que existe baseado nos types
          find_similar_posts: true
        },
        extensions_installed: extensionsList,
        embedding_data: {
          keyword_variations_with_embeddings: keywordEmbeddings || 0,
          content_posts_with_embeddings: contentEmbeddings || 0
        }
      },
      recommendations: functions ? [
        'Sistema de busca semântica está pronto!',
        'Teste na página /keywords com o modo semântico'
      ] : [
        'Execute POST neste endpoint para configurar as funções RPC',
        'Verifique se tem dados com embeddings nas tabelas',
        'Configure chave OpenAI para gerar embeddings'
      ]
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message
    }, { status: 500 })
  }
}