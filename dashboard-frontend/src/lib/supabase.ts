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
  blogId?: string
) {
  const { data, error } = await supabase.rpc('find_similar_keywords', {
    query_embedding: queryEmbedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
    blog_id: blogId
  })

  if (error) throw error
  return data
}

export async function findSimilarPosts(
  queryEmbedding: number[],
  matchThreshold = 0.8,
  matchCount = 10,
  blogId?: string
) {
  const { data, error } = await supabase.rpc('find_similar_posts', {
    query_embedding: queryEmbedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
    blog_id: blogId
  })

  if (error) throw error
  return data
}

export async function calculateKeywordOpportunityScore(
  msv: number | null,
  kwDifficulty: number | null,
  cpc: number | null
) {
  const { data, error } = await supabase.rpc('calculate_keyword_opportunity_score', {
    msv,
    kw_difficulty: kwDifficulty,
    cpc
  })

  if (error) throw error
  return data
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