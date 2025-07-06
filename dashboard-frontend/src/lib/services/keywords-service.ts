/**
 * Serviço dinâmico para gerenciamento de keywords
 * Integração completa com Supabase
 */

import { createSupabaseServiceClient } from "@/lib/supabase";
import type {
  MainKeyword,
  KeywordVariation,
  KeywordCluster,
} from "@/types/database";

type SupabaseClient = ReturnType<typeof createSupabaseServiceClient>;

export interface KeywordFilters {
  blog_id?: string;
  search?: string;
  search_intent?:
    | "informational"
    | "navigational"
    | "commercial"
    | "transactional";
  competition?: "LOW" | "MEDIUM" | "HIGH";
  min_volume?: number;
  max_difficulty?: number;
  is_used?: boolean;
  location?: string;
  language?: string;
  limit?: number;
  offset?: number;
}

export interface CreateKeywordData {
  blog_id: string;
  keyword: string;
  msv?: number;
  kw_difficulty?: number;
  cpc?: number;
  competition?: "LOW" | "MEDIUM" | "HIGH";
  search_intent?:
    | "informational"
    | "navigational"
    | "commercial"
    | "transactional";
  location?: string;
  language?: string;
  search_limit?: number;
  variations?: Array<{
    keyword: string;
    variation_type?: string;
    msv?: number;
    kw_difficulty?: number;
    cpc?: number;
    competition?: "LOW" | "MEDIUM" | "HIGH";
    search_intent?:
      | "informational"
      | "navigational"
      | "commercial"
      | "transactional";
  }>;
}

export interface KeywordWithRelations extends MainKeyword {
  keyword_variations?: KeywordVariation[];
  keyword_clusters?: KeywordCluster[];
  blogs?: {
    name: string;
    domain: string;
  };
  opportunity_score?: number;
}

export interface KeywordStats {
  total_keywords: number;
  total_variations: number;
  used_keywords: number;
  avg_search_volume: number;
  avg_difficulty: number;
  avg_cpc: number;
  by_intent: Record<string, number>;
  by_competition: Record<string, number>;
}

class KeywordsService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createSupabaseServiceClient();
  }

  /**
   * Buscar keywords com filtros avançados
   */
  async getKeywords(filters: KeywordFilters = {}): Promise<{
    data: KeywordWithRelations[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      blog_id,
      search,
      search_intent,
      competition,
      min_volume,
      max_difficulty,
      is_used,
      location,
      language,
      limit = 20,
      offset = 0,
    } = filters;

    let query = this.supabase.from("main_keywords").select(
      `
        *,
        blogs!inner (
          name,
          domain
        ),
        keyword_variations (
          id,
          main_keyword_id,
          keyword,
          variation_type,
          msv,
          kw_difficulty,
          cpc,
          competition,
          search_intent,
          embedding,
          created_at,
          updated_at,
          answer
        )
      `,
      { count: "exact" }
    );

    // Aplicar filtros dinamicamente
    if (blog_id) {
      query = query.eq("blog_id", blog_id);
    }

    if (search) {
      query = query.ilike("keyword", `%${search}%`);
    }

    if (search_intent) {
      query = query.eq("search_intent", search_intent);
    }

    if (competition) {
      query = query.eq("competition", competition);
    }

    if (min_volume !== undefined) {
      query = query.gte("msv", min_volume);
    }

    if (max_difficulty !== undefined) {
      query = query.lte("kw_difficulty", max_difficulty);
    }

    if (is_used !== undefined) {
      query = query.eq("is_used", is_used);
    }

    if (location) {
      query = query.eq("location", location);
    }

    if (language) {
      query = query.eq("language", language);
    }

    // Paginação e ordenação
    query = query
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Erro ao buscar keywords: ${error.message}`);
    }

    // Calcular opportunity score para cada keyword
    const keywordsWithScore = (data || []).map((keyword) => ({
      ...keyword,
      opportunity_score: this.calculateOpportunityScore(
        keyword.msv,
        keyword.kw_difficulty,
        keyword.cpc
      ),
    }));

    return {
      data: keywordsWithScore,
      total: count || 0,
      page: Math.floor(offset / limit) + 1,
      limit,
    };
  }

  /**
   * Buscar keyword específica por ID
   */
  async getKeywordById(id: string): Promise<KeywordWithRelations | null> {
    const { data, error } = await this.supabase
      .from("main_keywords")
      .select(
        `
        *,
        blogs (
          name,
          domain,
          niche
        ),
        keyword_variations (*),
        keyword_clusters (
          id,
          blog_id,
          cluster_name,
          description,
          cluster_score,
          embedding,
          created_at,
          updated_at,
          main_keyword_id
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(`Erro ao buscar keyword: ${error.message}`);
    }

    return {
      ...data,
      opportunity_score: this.calculateOpportunityScore(
        data.msv,
        data.kw_difficulty,
        data.cpc
      ),
    };
  }

  /**
   * Criar nova keyword com validação
   */
  async createKeyword(
    keywordData: CreateKeywordData
  ): Promise<KeywordWithRelations> {
    const { variations, ...mainKeywordData } = keywordData;

    // Verificar se keyword já existe para o blog
    const existingKeyword = await this.checkKeywordExists(
      keywordData.blog_id,
      keywordData.keyword
    );

    if (existingKeyword) {
      throw new Error(
        `Keyword "${keywordData.keyword}" já existe para este blog`
      );
    }

    // Criar keyword principal
    const { data: newKeyword, error: keywordError } = await this.supabase
      .from("main_keywords")
      .insert([
        {
          ...mainKeywordData,
          is_used: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (keywordError) {
      throw new Error(`Erro ao criar keyword: ${keywordError.message}`);
    }

    // Criar variações se fornecidas
    if (variations && variations.length > 0) {
      const variationData = variations.map((variation) => ({
        ...variation,
        main_keyword_id: newKeyword.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      const { error: variationsError } = await this.supabase
        .from("keyword_variations")
        .insert(variationData);

      if (variationsError) {
        console.warn("Erro ao criar variações:", variationsError.message);
      }
    }

    // Retornar keyword criada com relações
    return this.getKeywordById(newKeyword.id) as Promise<KeywordWithRelations>;
  }

  /**
   * Atualizar keyword existente
   */
  async updateKeyword(
    id: string,
    updates: Partial<CreateKeywordData>
  ): Promise<KeywordWithRelations> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { variations: _variations, ...keywordUpdates } = updates;

    const { error } = await this.supabase
      .from("main_keywords")
      .update({
        ...keywordUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar keyword: ${error.message}`);
    }

    return this.getKeywordById(id) as Promise<KeywordWithRelations>;
  }

  /**
   * Remover keyword e suas variações
   */
  async deleteKeyword(id: string): Promise<void> {
    // Remover variações primeiro (cascata)
    await this.supabase
      .from("keyword_variations")
      .delete()
      .eq("main_keyword_id", id);

    // Remover keyword principal
    const { error } = await this.supabase
      .from("main_keywords")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Erro ao remover keyword: ${error.message}`);
    }
  }

  /**
   * Marcar keyword como usada/não usada
   */
  async toggleKeywordUsage(id: string, isUsed: boolean): Promise<void> {
    const { error } = await this.supabase
      .from("main_keywords")
      .update({
        is_used: isUsed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      throw new Error(`Erro ao atualizar status da keyword: ${error.message}`);
    }
  }

  /**
   * Busca semântica usando embeddings
   */
  async semanticSearch(params: {
    query: string;
    blog_id?: string;
    similarity_threshold?: number;
    limit?: number;
  }): Promise<
    Array<{
      id: string;
      keyword: string;
      similarity: number;
    }>
  > {
    const { query, blog_id, similarity_threshold = 0.7, limit = 10 } = params;

    try {
      // Gerar embedding para a query (implementar integração com OpenAI)
      const embedding = await this.generateEmbedding(query);

      // Usar função RPC do Supabase
      const { data, error } = await this.supabase.rpc(
        "match_keywords_semantic",
        {
          query_embedding: JSON.stringify(embedding),
          match_threshold: similarity_threshold,
          match_count: limit,
        }
      );

      if (error) {
        console.warn(
          "Busca semântica falhou, usando busca por texto:",
          error.message
        );
        return this.fallbackTextSearch(query, blog_id, limit);
      }

      return data || [];
    } catch (error) {
      console.warn("Erro na busca semântica:", error);
      return this.fallbackTextSearch(query, blog_id, limit);
    }
  }

  /**
   * Obter estatísticas das keywords
   */
  async getKeywordStats(blog_id: string): Promise<KeywordStats> {
    const { data, error } = await this.supabase
      .from("main_keywords")
      .select("msv, kw_difficulty, cpc, search_intent, competition, is_used")
      .eq("blog_id", blog_id);

    if (error) {
      throw new Error(`Erro ao obter estatísticas: ${error.message}`);
    }

    const keywords = data || [];
    const variations = await this.getVariationsCount(blog_id);

    // Calcular estatísticas
    const totalKeywords = keywords.length;
    const usedKeywords = keywords.filter((k) => k.is_used).length;
    const avgSearchVolume =
      keywords.reduce((sum, k) => sum + (k.msv || 0), 0) / totalKeywords;
    const avgDifficulty =
      keywords.reduce((sum, k) => sum + (k.kw_difficulty || 0), 0) /
      totalKeywords;
    const avgCpc =
      keywords.reduce((sum, k) => sum + (k.cpc || 0), 0) / totalKeywords;

    // Agrupar por intent e competition
    const byIntent = keywords.reduce(
      (acc, k) => {
        const intent = k.search_intent || "unknown";
        acc[intent] = (acc[intent] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byCompetition = keywords.reduce(
      (acc, k) => {
        const comp = k.competition || "unknown";
        acc[comp] = (acc[comp] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total_keywords: totalKeywords,
      total_variations: variations,
      used_keywords: usedKeywords,
      avg_search_volume: Math.round(avgSearchVolume),
      avg_difficulty: Math.round(avgDifficulty * 100) / 100,
      avg_cpc: Math.round(avgCpc * 100) / 100,
      by_intent: byIntent,
      by_competition: byCompetition,
    };
  }

  /**
   * Buscar oportunidades usando view
   */
  async getKeywordOpportunities(blog_id: string, limit = 20) {
    const { data, error } = await this.supabase
      .from("keyword_opportunities")
      .select("*")
      .eq("blog_name", blog_id) // Ajustar conforme estrutura da view
      .order("opportunity_score", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Erro ao buscar oportunidades: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Criação em lote de keywords
   */
  async bulkCreateKeywords(keywords: CreateKeywordData[]): Promise<{
    created: number;
    failed: Array<{ keyword: string; error: string }>;
  }> {
    const results = {
      created: 0,
      failed: [] as Array<{ keyword: string; error: string }>,
    };

    for (const keywordData of keywords) {
      try {
        await this.createKeyword(keywordData);
        results.created++;
      } catch (error) {
        results.failed.push({
          keyword: keywordData.keyword,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }
    }

    return results;
  }

  // --- Métodos privados ---

  private async checkKeywordExists(
    blogId: string,
    keyword: string
  ): Promise<boolean> {
    const { data } = await this.supabase
      .from("main_keywords")
      .select("id")
      .eq("blog_id", blogId)
      .eq("keyword", keyword)
      .maybeSingle();

    return !!data;
  }

  private calculateOpportunityScore(
    msv: number | null,
    kwDifficulty: number | null,
    cpc: number | null
  ): number {
    let score = 0;

    // Score baseado em volume de busca (0-40 pontos)
    if (msv) {
      if (msv > 10000) score += 40;
      else if (msv > 5000) score += 30;
      else if (msv > 1000) score += 20;
      else if (msv > 100) score += 10;
      else score += 5;
    }

    // Score baseado em dificuldade (0-30 pontos - invertido)
    if (kwDifficulty !== null) {
      if (kwDifficulty < 20) score += 30;
      else if (kwDifficulty < 40) score += 20;
      else if (kwDifficulty < 60) score += 10;
      else if (kwDifficulty < 80) score += 5;
    }

    // Score baseado em CPC (0-30 pontos)
    if (cpc) {
      if (cpc > 5) score += 30;
      else if (cpc > 2) score += 20;
      else if (cpc > 1) score += 15;
      else if (cpc > 0.5) score += 10;
      else score += 5;
    }

    return Math.min(score, 100);
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    // Implementar integração com OpenAI ou outro serviço de embeddings
    const response = await fetch("/api/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Falha ao gerar embedding");
    }

    const { embedding } = await response.json();
    return embedding;
  }

  private async fallbackTextSearch(
    query: string,
    blogId?: string,
    limit = 10
  ): Promise<Array<{ id: string; keyword: string; similarity: number }>> {
    let dbQuery = this.supabase
      .from("main_keywords")
      .select("id, keyword")
      .ilike("keyword", `%${query}%`)
      .limit(limit);

    if (blogId) {
      dbQuery = dbQuery.eq("blog_id", blogId);
    }

    const { data } = await dbQuery;

    return (data || []).map((item) => ({
      ...item,
      similarity: 0.8, // Mock similarity
    }));
  }

  private async getVariationsCount(blogId: string): Promise<number> {
    const { count } = await this.supabase
      .from("keyword_variations")
      .select("*", { count: "exact", head: true })
      .eq("main_keyword_id", blogId);

    return count || 0;
  }
}

// Singleton instance
export const keywordsService = new KeywordsService();
export default keywordsService;
