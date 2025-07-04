import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type {
  MainKeyword,
  KeywordVariation,
  KeywordWithVariations,
  KeywordSearchFilters,
  PaginatedResponse,
  DatabaseInsert,
  DatabaseUpdate,
  SemanticSearchRequest,
  SemanticSearchResult,
} from "@/types/database";
import { toast } from "sonner";

export function useKeywords(filters?: KeywordSearchFilters) {
  return useQuery({
    queryKey: ["keywords", filters],
    queryFn: async (): Promise<PaginatedResponse<MainKeyword>> => {
      let query = supabase
        .from("main_keywords")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (filters?.blog_id) {
        query = query.eq("blog_id", filters.blog_id);
      }
      if (filters?.search) {
        query = query.ilike("keyword", `%${filters.search}%`);
      }
      if (filters?.competition) {
        query = query.eq("competition", filters.competition);
      }
      if (filters?.search_intent) {
        query = query.eq("search_intent", filters.search_intent);
      }
      if (filters?.min_msv !== undefined) {
        query = query.gte("msv", filters.min_msv);
      }
      if (filters?.max_msv !== undefined) {
        query = query.lte("msv", filters.max_msv);
      }
      if (filters?.min_difficulty !== undefined) {
        query = query.gte("kw_difficulty", filters.min_difficulty);
      }
      if (filters?.max_difficulty !== undefined) {
        query = query.lte("kw_difficulty", filters.max_difficulty);
      }
      if (filters?.is_used !== undefined) {
        query = query.eq("is_used", filters.is_used);
      }
      if (filters?.location) {
        query = query.eq("location", filters.location);
      }
      if (filters?.language) {
        query = query.eq("language", filters.language);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        page: 1,
        per_page: data?.length || 0,
        total_pages: 1,
      };
    },
  });
}

export function useKeyword(id: string) {
  return useQuery({
    queryKey: ["keyword", id],
    queryFn: async (): Promise<KeywordWithVariations> => {
      const { data, error } = await supabase
        .from("main_keywords")
        .select(
          `
          *,
          variations:keyword_variations(*),
          serp_results(*),
          clusters:keyword_clusters(*)
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useKeywordVariations(mainKeywordId: string) {
  return useQuery({
    queryKey: ["keyword-variations", mainKeywordId],
    queryFn: async (): Promise<KeywordVariation[]> => {
      const { data, error } = await supabase
        .from("keyword_variations")
        .select("*")
        .eq("main_keyword_id", mainKeywordId)
        .order("msv", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!mainKeywordId,
  });
}

export function useCreateKeyword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (keyword: DatabaseInsert<MainKeyword>) => {
      const { data, error } = await supabase
        .from("main_keywords")
        .insert(keyword)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["keywords"] });
      toast.success("Keyword criada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar keyword: ${error.message}`);
    },
  });
}

export function useUpdateKeyword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: DatabaseUpdate<MainKeyword> & { id: string }) => {
      const { data, error } = await supabase
        .from("main_keywords")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["keywords"] });
      queryClient.invalidateQueries({ queryKey: ["keyword", data.id] });
      toast.success("Keyword atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar keyword: ${error.message}`);
    },
  });
}

export function useDeleteKeyword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("main_keywords")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["keywords"] });
      toast.success("Keyword removida com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao remover keyword: ${error.message}`);
    },
  });
}

export function useCreateKeywordVariation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variation: DatabaseInsert<KeywordVariation>) => {
      const { data, error } = await supabase
        .from("keyword_variations")
        .insert(variation)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["keyword-variations"] });
      queryClient.invalidateQueries({
        queryKey: ["keyword", data.main_keyword_id],
      });
      toast.success("Variação criada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar variação: ${error.message}`);
    },
  });
}

export function useBulkCreateKeywords() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (keywords: DatabaseInsert<MainKeyword>[]) => {
      const { data, error } = await supabase
        .from("main_keywords")
        .insert(keywords)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["keywords"] });
      toast.success(`${data.length} keywords criadas com sucesso!`);
    },
    onError: (error) => {
      toast.error(`Erro ao criar keywords: ${error.message}`);
    },
  });
}

export function useSemanticKeywordSearch() {
  return useMutation({
    mutationFn: async (
      request: SemanticSearchRequest
    ): Promise<SemanticSearchResult<KeywordVariation>[]> => {
      // First, generate embedding for the query
      const embeddingResponse = await fetch("/api/embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: request.query }),
      });

      if (!embeddingResponse.ok) {
        throw new Error("Failed to generate embedding");
      }

      const { embedding } = await embeddingResponse.json();

      // Then use Supabase function for similarity search
      const { data, error } = await supabase.rpc("find_similar_keywords", {
        query_embedding: embedding,
        match_threshold: request.similarity_threshold || 0.5,
        match_count: request.limit || 10,
        blog_id: request.filters?.blog_id,
      });

      if (error) throw error;

      return data.map((item: any, index: number) => ({
        item,
        similarity: item.similarity,
        rank: index + 1,
      }));
    },
    onError: (error) => {
      toast.error(`Erro na busca semântica: ${error.message}`);
    },
  });
}

export function useKeywordStats(blogId?: string) {
  return useQuery({
    queryKey: ["keyword-stats", blogId],
    queryFn: async () => {
      let query = supabase.from("main_keywords").select("*");

      if (blogId) {
        query = query.eq("blog_id", blogId);
      }

      const { data: keywords, error } = await query;

      if (error) throw error;

      const stats = {
        total: keywords.length,
        byCompetition: {
          LOW: keywords.filter((k) => k.competition === "LOW").length,
          MEDIUM: keywords.filter((k) => k.competition === "MEDIUM").length,
          HIGH: keywords.filter((k) => k.competition === "HIGH").length,
        },
        byIntent: {
          informational: keywords.filter(
            (k) => k.search_intent === "informational"
          ).length,
          navigational: keywords.filter(
            (k) => k.search_intent === "navigational"
          ).length,
          commercial: keywords.filter((k) => k.search_intent === "commercial")
            .length,
          transactional: keywords.filter(
            (k) => k.search_intent === "transactional"
          ).length,
        },
        used: keywords.filter((k) => k.is_used).length,
        avgMsv:
          keywords.reduce((sum, k) => sum + (k.msv || 0), 0) / keywords.length,
        avgDifficulty:
          keywords.reduce((sum, k) => sum + (k.kw_difficulty || 0), 0) /
          keywords.length,
        avgCpc:
          keywords.reduce((sum, k) => sum + (k.cpc || 0), 0) / keywords.length,
      };

      return stats;
    },
  });
}

export function useMarkKeywordAsUsed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("main_keywords")
        .update({ is_used: true })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["keywords"] });
      toast.success("Keyword marcada como usada!");
    },
    onError: (error) => {
      toast.error(`Erro ao marcar keyword: ${error.message}`);
    },
  });
}

/* ---------------------------------------------------------------------------
 * HOOKS DE ALTO NÍVEL UTILIZADOS NA UI
 * ------------------------------------------------------------------------ */

/**
 * Retorna todas as main_keywords de um blog específico.
 * Simplificação para a UI que precisa apenas de um array direto.
 */
export function useMainKeywords(blogId?: string) {
  const { data, ...rest } = useKeywords({ blog_id: blogId });

  // Adapta para o formato esperado (array ou undefined)
  return {
    data: data?.data,
    ...rest,
  };
}

/**
 * Retorna oportunidades de keywords calculadas pela view `keyword_opportunities`.
 * Filtra opcionalmente por blog (usando blog_name via subquery) caso blogId seja informado.
 */
export function useKeywordOpportunities(blogId?: string) {
  return useQuery({
    queryKey: ["keyword-opportunities", blogId],
    queryFn: async () => {
      let query = supabase.from("keyword_opportunities").select("*");

      if (blogId) {
        // Obter nome do blog para filtrar pela view (que contém blog_name, não blog_id)
        const { data: blogRow, error: blogError } = await supabase
          .from("blogs")
          .select("name")
          .eq("id", blogId)
          .single();

        if (blogError) throw blogError;

        if (blogRow?.name) {
          query = query.eq("blog_name", blogRow.name);
        }
      }

      const { data, error } = await query.order("opportunity_score", {
        ascending: false,
      });

      if (error) throw error;
      return data || [];
    },
  });
}
