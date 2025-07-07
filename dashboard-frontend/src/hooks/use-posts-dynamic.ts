import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useBlog } from "@/contexts/blog-context";
import type { Database } from "@/types/database";

type Post = Database["public"]["Tables"]["content_posts"]["Row"];

export function usePostsDynamic(options?: {
  limit?: number;
  status?: string;
  search?: string;
}) {
  const { selectedBlogIds, isAllSelected } = useBlog();
  const { limit = 50, status, search } = options || {};

  return useQuery({
    queryKey: ["posts", selectedBlogIds, { limit, status, search }],
    queryFn: async () => {
      let query = supabase.from("content_posts").select("*");

      // Filtrar por blogs selecionados (exceto quando "todos" está selecionado)
      if (!isAllSelected && selectedBlogIds.length > 0) {
        query = query.in("blog_id", selectedBlogIds);
      }

      // Filtros opcionais
      if (status) {
        query = query.eq("status", status);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%, content.ilike.%${search}%`);
      }

      const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Post[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    enabled: selectedBlogIds.length > 0 || isAllSelected,
  });
}

export function usePostStats() {
  const { selectedBlogIds, isAllSelected } = useBlog();

  return useQuery({
    queryKey: ["post-stats", selectedBlogIds, isAllSelected],
    queryFn: async () => {
      console.log('🔍 usePostStats Debug:', { selectedBlogIds, isAllSelected });
      
      // Buscar posts do Supabase
      let supabaseQuery = supabase.from("content_posts").select("status, blog_id");
      
      if (!isAllSelected && selectedBlogIds.length > 0) {
        supabaseQuery = supabaseQuery.in("blog_id", selectedBlogIds);
        console.log('📊 Filtrando por blog IDs:', selectedBlogIds);
      } else {
        console.log('📊 Buscando todos os posts (sem filtro)');
      }

      const { data: supabasePosts, error: supabaseError } = await supabaseQuery;
      if (supabaseError) {
        console.error('❌ Erro Supabase:', supabaseError);
        throw supabaseError;
      }
      console.log('📄 Posts encontrados no Supabase:', supabasePosts?.length || 0);

      // Buscar rascunhos do WordPress baseado na seleção
      let wordpressDrafts = 0;
      try {
        let blogsToFetch: string[] = [];
        
        if (isAllSelected) {
          // Se todos estão selecionados, buscar ambos os blogs
          blogsToFetch = ['einsof7', 'optemil'];
        } else if (selectedBlogIds.length > 0) {
          // Mapear IDs dos blogs selecionados para nomes dos blogs
          // Vamos buscar informações dos blogs para mapear
          const { data: blogsData } = await supabase
            .from('blogs')
            .select('id, domain')
            .in('id', selectedBlogIds);
          
          blogsToFetch = blogsData?.map(blog => {
            if (blog.domain.includes('einsof7.com')) return 'einsof7';
            if (blog.domain.includes('optemil.com')) return 'optemil';
            return null;
          }).filter(Boolean) as string[] || [];
        }

        if (blogsToFetch.length > 0) {
          const responses = await Promise.allSettled(
            blogsToFetch.map(blog => 
              fetch(`/api/wordpress/posts?status=draft&blog=${blog}`)
            )
          );
          
          wordpressDrafts = 0;
          for (const response of responses) {
            if (response.status === 'fulfilled' && response.value.ok) {
              const data = await response.value.json();
              wordpressDrafts += data.total || 0;
              console.log(`Rascunhos ${blogsToFetch[responses.indexOf(response)]}: ${data.total || 0}`);
            }
          }
        }
        
        console.log(`Total de rascunhos WordPress: ${wordpressDrafts}`);
      } catch (error) {
        console.warn('Erro ao buscar rascunhos do WordPress:', error);
      }

      // Calcular estatísticas
      const stats = {
        total: supabasePosts?.length || 0,
        published: supabasePosts?.filter(p => p.status === "publish").length || 0,
        draft: wordpressDrafts,
        byBlog: {} as Record<string, { total: number; published: number; draft: number }>
      };

      // Estatísticas por blog
      supabasePosts?.forEach(post => {
        if (!stats.byBlog[post.blog_id]) {
          stats.byBlog[post.blog_id] = { total: 0, published: 0, draft: 0 };
        }
        stats.byBlog[post.blog_id].total++;
        if (post.status === "publish") {
          stats.byBlog[post.blog_id].published++;
        }
      });

      return stats;
    },
    staleTime: 2 * 60 * 1000, // Atualizar mais frequentemente
    enabled: true, // Sempre habilitado para mostrar dados gerais
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { selectedBlogIds } = useBlog();

  return useMutation({
    mutationFn: async (post: Database["public"]["Tables"]["content_posts"]["Insert"]) => {
      const { data, error } = await supabase
        .from("content_posts")
        .insert(post)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", selectedBlogIds] });
      queryClient.invalidateQueries({ queryKey: ["post-stats", selectedBlogIds] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  const { selectedBlogIds } = useBlog();

  return useMutation({
    mutationFn: async ({ 
      id, 
      ...updates 
    }: Database["public"]["Tables"]["content_posts"]["Update"] & { id: string }) => {
      const { data, error } = await supabase
        .from("content_posts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", selectedBlogIds] });
      queryClient.invalidateQueries({ queryKey: ["post-stats", selectedBlogIds] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  const { selectedBlogIds } = useBlog();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("content_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", selectedBlogIds] });
      queryClient.invalidateQueries({ queryKey: ["post-stats", selectedBlogIds] });
    },
  });
}