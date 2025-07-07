import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useBlog } from "@/contexts/blog-context";
import type { Database } from "@/types/database";

type MainKeyword = Database["public"]["Tables"]["main_keywords"]["Row"];

export function useKeywords(options?: {
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: "created_at" | "keyword" | "msv" | "kw_difficulty";
  sortOrder?: "asc" | "desc";
}) {
  const { selectedBlogIds, isAllSelected } = useBlog();
  const { 
    limit = 100, 
    status, 
    search, 
    sortBy = "created_at", 
    sortOrder = "desc" 
  } = options || {};

  return useQuery({
    queryKey: ["keywords", selectedBlogIds, { limit, status, search, sortBy, sortOrder }],
    queryFn: async () => {
      let query = supabase.from("main_keywords").select("*");

      // Filtrar por blogs selecionados
      if (!isAllSelected && selectedBlogIds.length > 0) {
        query = query.in("blog_id", selectedBlogIds);
      }

      // Filtros opcionais
      if (status) {
        query = query.eq("is_used", status === "active");
      }

      if (search) {
        query = query.ilike("keyword", `%${search}%`);
      }

      // Ordenação
      const ascending = sortOrder === "asc";
      query = query.order(sortBy, { ascending });

      const { data, error } = await query.limit(limit);

      if (error) throw error;
      return data as MainKeyword[];
    },
    staleTime: 3 * 60 * 1000, // 3 minutos
    enabled: selectedBlogIds.length > 0 || isAllSelected,
  });
}

export function useKeywordStats() {
  const { selectedBlogIds, isAllSelected } = useBlog();

  return useQuery({
    queryKey: ["keyword-stats", selectedBlogIds, isAllSelected],
    queryFn: async () => {
      console.log('🎯 useKeywordStats Debug:', { selectedBlogIds, isAllSelected });
      // Buscar keyword_variations (o que o usuário quer ver como "Total Keywords")
      
      // Buscar main_keywords para pegar blog_id
      let mainQuery = supabase.from("main_keywords").select("id, blog_id, is_used, msv, kw_difficulty, cpc");

      if (!isAllSelected && selectedBlogIds.length > 0) {
        mainQuery = mainQuery.in("blog_id", selectedBlogIds);
      }

      const [variationsResult, mainResult] = await Promise.all([
        supabase
          .from("keyword_variations")
          .select(`
            *,
            main_keywords!inner(blog_id)
          `)
          .then(result => {
            if (!isAllSelected && selectedBlogIds.length > 0) {
              result.data = result.data?.filter(kv => 
                selectedBlogIds.includes(kv.main_keywords.blog_id)
              ) || [];
            }
            return result;
          }),
        mainQuery
      ]);

      if (variationsResult.error) throw variationsResult.error;
      if (mainResult.error) throw mainResult.error;

      const variations = variationsResult.data || [];
      const mainKeywords = mainResult.data || [];

      console.log('📊 Keywords encontradas:', {
        variations: variations.length,
        mainKeywords: mainKeywords.length,
        mainActive: mainKeywords.filter(k => k.is_used === true).length,
        mainInactive: mainKeywords.filter(k => k.is_used === false).length
      });

      // Calcular estatísticas
      const stats = {
        total: variations.length, // Total de keyword_variations
        active: mainKeywords.filter(k => k.is_used === true).length || 0,
        inactive: mainKeywords.filter(k => k.is_used === false).length || 0,
        avgMsv: 0,
        avgDifficulty: 0,
        avgCpc: 0,
        byBlog: {} as Record<string, { 
          total: number; 
          active: number; 
          inactive: number;
          avgMsv: number;
          avgDifficulty: number;
        }>
      };

      if (variations.length > 0) {
        // Médias gerais das variations
        const validMsv = variations.filter(k => k.msv !== null).map(k => k.msv || 0);
        const validDifficulty = variations.filter(k => k.kw_difficulty !== null).map(k => k.kw_difficulty || 0);
        const validCpc = variations.filter(k => k.cpc !== null).map(k => k.cpc || 0);

        stats.avgMsv = validMsv.length > 0 ? validMsv.reduce((a, b) => a + b, 0) / validMsv.length : 0;
        stats.avgDifficulty = validDifficulty.length > 0 ? validDifficulty.reduce((a, b) => a + b, 0) / validDifficulty.length : 0;
        stats.avgCpc = validCpc.length > 0 ? validCpc.reduce((a, b) => a + b, 0) / validCpc.length : 0;

        // Estatísticas por blog
        variations.forEach(variation => {
          const blogId = variation.main_keywords?.blog_id;
          if (blogId && !stats.byBlog[blogId]) {
            stats.byBlog[blogId] = { 
              total: 0, 
              active: 0, 
              inactive: 0,
              avgMsv: 0,
              avgDifficulty: 0
            };
          }
          
          if (blogId) {
            stats.byBlog[blogId].total++;
          }
        });

        // Contar active/inactive por blog das main_keywords
        mainKeywords.forEach(keyword => {
          if (stats.byBlog[keyword.blog_id]) {
            if (keyword.is_used === true) {
              stats.byBlog[keyword.blog_id].active++;
            } else {
              stats.byBlog[keyword.blog_id].inactive++;
            }
          }
        });
      }

      return stats;
    },
    staleTime: 5 * 60 * 1000,
    enabled: true, // Sempre habilitado para mostrar dados gerais
  });
}

export function useKeywordOpportunities() {
  const { selectedBlogIds, isAllSelected } = useBlog();

  return useQuery({
    queryKey: ["keyword-opportunities", selectedBlogIds],
    queryFn: async () => {
      let query = supabase
        .from("main_keywords")
        .select("*, content_posts!inner(id)")
        .is("content_posts.id", null); // Keywords sem posts associados

      // Filtrar por blogs selecionados
      if (!isAllSelected && selectedBlogIds.length > 0) {
        query = query.in("blog_id", selectedBlogIds);
      }

      const { data, error } = await query
        .eq("is_used", true)
        .order("msv", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as MainKeyword[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    enabled: selectedBlogIds.length > 0 || isAllSelected,
  });
}