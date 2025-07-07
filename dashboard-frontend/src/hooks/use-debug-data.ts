import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useDebugData() {
  return useQuery({
    queryKey: ["debug-data"],
    queryFn: async () => {
      try {
        // Verificar se existem dados nas tabelas principais
        const [blogs, posts, mainKeywords, variations, categories, clusters] = await Promise.all([
          supabase.from("blogs").select("id, name, domain").limit(5),
          supabase.from("content_posts").select("id, blog_id, status").limit(5),
          supabase.from("main_keywords").select("id, blog_id, is_used").limit(5),
          supabase.from("keyword_variations").select("id, main_keyword_id").limit(5),
          (supabase as any).from("content_opportunities_categories").select("id, blog_id").limit(5),
          (supabase as any).from("content_opportunities_clusters").select("id, blog_id").limit(5)
        ]);

        const debug = {
          blogs: {
            count: blogs.data?.length || 0,
            data: blogs.data,
            error: blogs.error
          },
          posts: {
            count: posts.data?.length || 0,
            data: posts.data,
            error: posts.error
          },
          mainKeywords: {
            count: mainKeywords.data?.length || 0,
            data: mainKeywords.data,
            error: mainKeywords.error
          },
          variations: {
            count: variations.data?.length || 0,
            data: variations.data,
            error: variations.error
          },
          categories: {
            count: categories.data?.length || 0,
            data: categories.data,
            error: categories.error
          },
          clusters: {
            count: clusters.data?.length || 0,
            data: clusters.data,
            error: clusters.error
          }
        };

        console.log("🔍 DEBUG DATABASE:", debug);
        return debug;

      } catch (error) {
        console.error("❌ Erro ao debugar dados:", error);
        return null;
      }
    },
    staleTime: 30 * 1000, // 30 segundos
  });
}