import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Client-side Supabase client
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  })
}

// Service role client for server-side operations
export const createSupabaseServiceClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for service client')
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export const supabase = createSupabaseClient()

export type SupabaseClient = ReturnType<typeof createSupabaseClient>

export async function findSimilarKeywords(
  queryEmbedding: number[],
  matchThreshold = 0.8,
  matchCount = 10,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _blogId?: string
) {
  const { data, error } = await supabase.rpc('match_keywords_semantic', {
    query_embedding: JSON.stringify(queryEmbedding),
    match_threshold: matchThreshold,
    match_count: matchCount
  })

  if (error) throw error
  return data
}

export async function findSimilarPosts(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _queryEmbedding: number[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _matchThreshold = 0.8,
  matchCount = 10,
  blogId?: string
) {
  // Como não temos uma função específica para posts, usar busca direta na tabela
  const { data, error } = await supabase
    .from('content_posts')
    .select('*')
    .eq('blog_id', blogId || '')
    .limit(matchCount)

  if (error) throw error
  return data
}

export async function calculateKeywordOpportunityScore(
  msv: number | null,
  kwDifficulty: number | null,
  cpc: number | null
): Promise<number> {
  // Implementação local do cálculo de score de oportunidade
  let score = 0
  
  // Score baseado em volume de busca (0-40 pontos)
  if (msv) {
    if (msv > 10000) score += 40
    else if (msv > 5000) score += 30
    else if (msv > 1000) score += 20
    else if (msv > 100) score += 10
    else score += 5
  }
  
  // Score baseado em dificuldade (0-30 pontos - invertido)
  if (kwDifficulty !== null) {
    if (kwDifficulty < 20) score += 30
    else if (kwDifficulty < 40) score += 20
    else if (kwDifficulty < 60) score += 10
    else if (kwDifficulty < 80) score += 5
    // >= 80: 0 pontos
  }
  
  // Score baseado em CPC (0-30 pontos)
  if (cpc) {
    if (cpc > 5) score += 30
    else if (cpc > 2) score += 20
    else if (cpc > 1) score += 15
    else if (cpc > 0.5) score += 10
    else score += 5
  }
  
  return Math.min(score, 100) // Máximo 100 pontos
}

export type RealtimeChannel = ReturnType<typeof supabase.channel>

export function subscribeToTable(
  tableName: string,
  filter?: string,
  callback: (payload: unknown) => void = () => {}
) {
  const channel = supabase
    .channel(`public:${tableName}`)
    .on(
      'postgres_changes' as 'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: tableName,
        filter
      },
      callback
    )
    .subscribe()

  return channel
}

export function unsubscribeFromChannel(channel: RealtimeChannel) {
  return supabase.removeChannel(channel)
}