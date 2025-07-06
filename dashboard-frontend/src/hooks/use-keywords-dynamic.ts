/**
 * Hooks otimizados para gerenciamento dinâmico de keywords
 * Integração completa com Supabase via serviço
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import keywordsService, {
  type KeywordFilters,
  type CreateKeywordData,
  type KeywordWithRelations,
} from "@/lib/services/keywords-service";

// Query Keys para cache management
const QUERY_KEYS = {
  KEYWORDS: "keywords",
  KEYWORD: "keyword",
  KEYWORD_STATS: "keyword-stats",
  KEYWORD_OPPORTUNITIES: "keyword-opportunities",
  SEMANTIC_SEARCH: "semantic-search",
} as const;

/**
 * Hook principal para buscar keywords com filtros
 */
export function useKeywords(filters: KeywordFilters = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.KEYWORDS, filters],
    queryFn: () => keywordsService.getKeywords(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
    enabled: !!filters.blog_id, // Só buscar se tiver blog_id
  });
}

/**
 * Hook para buscar uma keyword específica
 */
export function useKeyword(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.KEYWORD, id],
    queryFn: () => keywordsService.getKeywordById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para estatísticas de keywords
 */
export function useKeywordStats(blogId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.KEYWORD_STATS, blogId],
    queryFn: () => keywordsService.getKeywordStats(blogId),
    enabled: !!blogId,
    staleTime: 10 * 60 * 1000, // Stats são menos voláteis
  });
}

/**
 * Hook para oportunidades de keywords
 */
export function useKeywordOpportunities(blogId: string, limit = 20) {
  return useQuery({
    queryKey: [QUERY_KEYS.KEYWORD_OPPORTUNITIES, blogId, limit],
    queryFn: () => keywordsService.getKeywordOpportunities(blogId, limit),
    enabled: !!blogId,
    staleTime: 15 * 60 * 1000, // Oportunidades são ainda menos voláteis
  });
}

/**
 * Hook para busca semântica
 */
export function useSemanticKeywordSearch() {
  return useMutation({
    mutationFn: keywordsService.semanticSearch.bind(keywordsService),
    onError: (error) => {
      toast.error(`Erro na busca semântica: ${error.message}`);
    },
  });
}

/**
 * Hook para criar keyword
 */
export function useCreateKeyword() {
  const queryClient = useQueryClient();

  return useMutation<KeywordWithRelations, Error, CreateKeywordData>({
    mutationFn: keywordsService.createKeyword.bind(keywordsService),
    onSuccess: (newKeyword) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.KEYWORDS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.KEYWORD_STATS, newKeyword.blog_id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.KEYWORD_OPPORTUNITIES, newKeyword.blog_id],
      });

      // Adicionar ao cache
      queryClient.setQueryData([QUERY_KEYS.KEYWORD, newKeyword.id], newKeyword);

      toast.success(`Keyword "${newKeyword.keyword}" criada com sucesso!`);
    },
    onError: (error) => {
      toast.error(`Erro ao criar keyword: ${error.message}`);
    },
  });
}

/**
 * Hook para atualizar keyword
 */
export function useUpdateKeyword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<CreateKeywordData>;
    }) => keywordsService.updateKeyword(id, updates),
    onSuccess: (updatedKeyword) => {
      // Atualizar cache
      queryClient.setQueryData(
        [QUERY_KEYS.KEYWORD, updatedKeyword.id],
        updatedKeyword
      );

      // Invalidar listas
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.KEYWORDS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.KEYWORD_STATS, updatedKeyword.blog_id],
      });

      toast.success(`Keyword "${updatedKeyword.keyword}" atualizada!`);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar keyword: ${error.message}`);
    },
  });
}

/**
 * Hook para remover keyword
 */
export function useDeleteKeyword() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: keywordsService.deleteKeyword.bind(keywordsService),
    onSuccess: (_, keywordId) => {
      // Remover do cache
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.KEYWORD, keywordId],
      });

      // Invalidar listas
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.KEYWORDS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.KEYWORD_STATS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.KEYWORD_OPPORTUNITIES],
      });

      toast.success("Keyword removida com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao remover keyword: ${error.message}`);
    },
  });
}

/**
 * Hook para marcar keyword como usada/não usada
 */
export function useToggleKeywordUsage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isUsed }: { id: string; isUsed: boolean }) =>
      keywordsService.toggleKeywordUsage(id, isUsed),
    onSuccess: (_, { id, isUsed }) => {
      // Atualizar cache local da keyword
      queryClient.setQueryData(
        [QUERY_KEYS.KEYWORD, id],
        (old: KeywordWithRelations | undefined) =>
          old ? { ...old, is_used: isUsed } : old
      );

      // Invalidar listas e stats
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.KEYWORDS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.KEYWORD_STATS],
      });

      toast.success(`Keyword marcada como ${isUsed ? "usada" : "não usada"}!`);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar status: ${error.message}`);
    },
  });
}

/**
 * Hook para criação em lote
 */
export function useBulkCreateKeywords() {
  const queryClient = useQueryClient();

  return useMutation<
    { created: number; failed: Array<{ keyword: string; error: string }> },
    Error,
    CreateKeywordData[]
  >({
    mutationFn: keywordsService.bulkCreateKeywords.bind(keywordsService),
    onSuccess: (result) => {
      // Invalidar todas as queries de keywords
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.KEYWORDS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.KEYWORD_STATS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.KEYWORD_OPPORTUNITIES],
      });

      const { created, failed } = result;

      if (created > 0) {
        toast.success(`${created} keywords criadas com sucesso!`);
      }

      if (failed.length > 0) {
        toast.error(`${failed.length} keywords falharam ao ser criadas`);
        console.error("Keywords que falharam:", failed);
      }
    },
    onError: (error) => {
      toast.error(`Erro na criação em lote: ${error.message}`);
    },
  });
}

/**
 * Hook customizado para filtros com debounce
 */
export function useKeywordsWithFilters(blogId: string) {
  const queryClient = useQueryClient();

  const refetchKeywords = useCallback(
    (filters: KeywordFilters) => {
      return queryClient.fetchQuery({
        queryKey: [QUERY_KEYS.KEYWORDS, { ...filters, blog_id: blogId }],
        queryFn: () =>
          keywordsService.getKeywords({ ...filters, blog_id: blogId }),
        staleTime: 0, // Force refresh
      });
    },
    [queryClient, blogId]
  );

  const prefetchKeyword = useCallback(
    (id: string) => {
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS.KEYWORD, id],
        queryFn: () => keywordsService.getKeywordById(id),
        staleTime: 5 * 60 * 1000,
      });
    },
    [queryClient]
  );

  return {
    refetchKeywords,
    prefetchKeyword,
  };
}

/**
 * Hook para cache management manual
 */
export function useKeywordCache() {
  const queryClient = useQueryClient();

  const clearKeywordCache = useCallback(() => {
    queryClient.removeQueries({
      queryKey: [QUERY_KEYS.KEYWORDS],
    });
    queryClient.removeQueries({
      queryKey: [QUERY_KEYS.KEYWORD],
    });
    toast.success("Cache de keywords limpo!");
  }, [queryClient]);

  const refreshKeywordStats = useCallback(
    (blogId: string) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.KEYWORD_STATS, blogId],
      });
    },
    [queryClient]
  );

  const preloadKeywords = useCallback(
    async (blogId: string) => {
      try {
        await queryClient.prefetchQuery({
          queryKey: [QUERY_KEYS.KEYWORDS, { blog_id: blogId }],
          queryFn: () => keywordsService.getKeywords({ blog_id: blogId }),
          staleTime: 5 * 60 * 1000,
        });
        toast.success("Keywords pré-carregadas!");
      } catch (error) {
        toast.error("Erro ao pré-carregar keywords");
      }
    },
    [queryClient]
  );

  return {
    clearKeywordCache,
    refreshKeywordStats,
    preloadKeywords,
  };
}

/**
 * Hook para otimistic updates
 */
export function useOptimisticKeywordUpdate() {
  const queryClient = useQueryClient();

  const updateKeywordOptimistically = useCallback(
    (keywordId: string, updates: Partial<KeywordWithRelations>) => {
      // Update keyword cache
      queryClient.setQueryData(
        [QUERY_KEYS.KEYWORD, keywordId],
        (old: KeywordWithRelations | undefined) =>
          old ? { ...old, ...updates } : old
      );

      // Update keywords list cache
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.KEYWORDS] },
        (old: any) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: old.data.map((keyword: KeywordWithRelations) =>
              keyword.id === keywordId ? { ...keyword, ...updates } : keyword
            ),
          };
        }
      );
    },
    [queryClient]
  );

  return { updateKeywordOptimistically };
}

/**
 * Hook para relatórios e analytics
 */
export function useKeywordAnalytics(blogId: string) {
  const { data: stats } = useKeywordStats(blogId);
  const { data: opportunities } = useKeywordOpportunities(blogId);

  const analytics = {
    totalKeywords: stats?.total_keywords || 0,
    usageRate: stats?.total_keywords
      ? (stats.used_keywords / stats.total_keywords) * 100
      : 0,
    topOpportunities: opportunities?.slice(0, 5) || [],
    averageOpportunityScore: opportunities?.length
      ? opportunities.reduce(
          (sum, opp) => sum + (opp.opportunity_score || 0),
          0
        ) / opportunities.length
      : 0,
    intentDistribution: stats?.by_intent || {},
    competitionDistribution: stats?.by_competition || {},
  };

  return analytics;
}
