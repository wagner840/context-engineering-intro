import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useBlog } from "@/contexts/blog-context";

export function useOpportunities() {
  const { selectedBlogIds, isAllSelected } = useBlog();

  return useQuery({
    queryKey: ["opportunities", selectedBlogIds, isAllSelected],
    queryFn: async () => {
      console.log('🚀 useOpportunities Debug:', { selectedBlogIds, isAllSelected });
      try {
        // Buscar content_opportunities_categories
        let categoriesQuery = (supabase as any).from("content_opportunities_categories").select("*");
        if (!isAllSelected && selectedBlogIds.length > 0) {
          categoriesQuery = categoriesQuery.in("blog_id", selectedBlogIds);
        }

        // Buscar content_opportunities_clusters
        let clustersQuery = (supabase as any).from("content_opportunities_clusters").select("*");
        if (!isAllSelected && selectedBlogIds.length > 0) {
          clustersQuery = clustersQuery.in("blog_id", selectedBlogIds);
        }

        const [categoriesResult, clustersResult] = await Promise.all([
          categoriesQuery,
          clustersQuery
        ]);

        if (categoriesResult.error) {
          console.warn("Erro ao buscar content_opportunities_categories:", categoriesResult.error);
        }
        if (clustersResult.error) {
          console.warn("Erro ao buscar content_opportunities_clusters:", clustersResult.error);
        }

        const categories = categoriesResult.data || [];
        const clusters = clustersResult.data || [];

        console.log('🎯 Oportunidades encontradas:', {
          categories: categories.length,
          clusters: clusters.length,
          total: categories.length + clusters.length
        });

        // Calcular total de oportunidades
        const totalOpportunities = categories.length + clusters.length;

        return {
          total: totalOpportunities,
          categories: categories.length,
          clusters: clusters.length,
          byBlog: {} as Record<string, { categories: number; clusters: number; total: number }>
        };

      } catch (error) {
        console.error("Erro ao buscar oportunidades:", error);
        return {
          total: 0,
          categories: 0,
          clusters: 0,
          byBlog: {}
        };
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: true,
  });
}