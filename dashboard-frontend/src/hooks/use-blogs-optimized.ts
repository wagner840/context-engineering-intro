import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Blog,
  CreateBlogData,
  UpdateBlogData,
  BlogSettings,
  ApiResponse,
  UseQueryOptions,
  Json,
} from "@/types/database-optimized";

// Query keys centralizados
const QUERY_KEYS = {
  all: ["blogs"] as const,
  lists: () => [...QUERY_KEYS.all, "list"] as const,
  list: (filters: string) => [...QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
  stats: (id: string) => [...QUERY_KEYS.detail(id), "stats"] as const,
};

// Hook principal para listar blogs com cache otimizado
export function useBlogs(options?: UseQueryOptions) {
  return useQuery({
    queryKey: QUERY_KEYS.lists(),
    queryFn: async (): Promise<Blog[]> => {
      const { data, error } = await supabase
        .from("blogs")
        .select(
          `
          id,
          name,
          domain,
          description,
          niche,
          is_active,
          settings,
          created_at,
          updated_at
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Erro ao carregar blogs: ${error.message}`);
      }

      return data as Blog[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: options?.refetchInterval || 30 * 60 * 1000, // 30 minutos
    ...options,
  });
}

// Hook para blog individual com cache otimizado
export function useBlog(id: string, options?: UseQueryOptions) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: async (): Promise<Blog> => {
      if (!id) throw new Error("ID do blog é obrigatório");

      const { data, error } = await supabase
        .from("blogs")
        .select(
          `
          id,
          name,
          domain,
          description,
          niche,
          is_active,
          settings,
          created_at,
          updated_at
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`Erro ao carregar blog: ${error.message}`);
      }

      return data as Blog;
    },
    enabled: !!id && options?.enabled !== false,
    staleTime: 10 * 60 * 1000, // 10 minutos
    ...options,
  });
}

// Hook para estatísticas do blog
export function useBlogStats(blogId: string, options?: UseQueryOptions) {
  return useQuery({
    queryKey: QUERY_KEYS.stats(blogId),
    queryFn: async () => {
      if (!blogId) throw new Error("ID do blog é obrigatório");

      const [keywordsRes, postsRes, variationsRes] = await Promise.all([
        supabase
          .from("main_keywords")
          .select("id, is_used", { count: "exact" })
          .eq("blog_id", blogId),
        supabase
          .from("content_posts")
          .select("id, status", { count: "exact" })
          .eq("blog_id", blogId),
        supabase
          .from("keyword_variations")
          .select("id, main_keyword_id")
          .in("main_keyword_id", [blogId]), // This needs to be fixed with a proper join
      ]);

      if (keywordsRes.error) throw keywordsRes.error;
      if (postsRes.error) throw postsRes.error;

      const usedKeywords =
        keywordsRes.data?.filter((k) => k.is_used).length || 0;
      const publishedPosts =
        postsRes.data?.filter((p) => p.status === "publish").length || 0;
      const draftPosts =
        postsRes.data?.filter((p) => p.status === "draft").length || 0;

      return {
        totalKeywords: keywordsRes.count || 0,
        usedKeywords,
        unusedKeywords: (keywordsRes.count || 0) - usedKeywords,
        totalPosts: postsRes.count || 0,
        publishedPosts,
        draftPosts,
        totalVariations: variationsRes.data?.length || 0,
      };
    },
    enabled: !!blogId && options?.enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutos
    ...options,
  });
}

// Hook para criar blog com validação
export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation<Blog, Error, CreateBlogData>({
    mutationFn: async (blogData: CreateBlogData): Promise<Blog> => {
      // Validação básica
      if (!blogData.name?.trim()) {
        throw new Error("Nome do blog é obrigatório");
      }
      if (!blogData.domain?.trim()) {
        throw new Error("Domínio é obrigatório");
      }
      if (!blogData.wordpress_url?.trim()) {
        throw new Error("URL do WordPress é obrigatória");
      }

      // Verificar se domínio já existe
      const { data: existingBlog } = await supabase
        .from("blogs")
        .select("id")
        .eq("domain", blogData.domain)
        .single();

      if (existingBlog) {
        throw new Error("Já existe um blog com este domínio");
      }

      // Criar configurações do WordPress
      const settings: BlogSettings = {
        wordpress_url: blogData.wordpress_url,
        wordpress_username: blogData.wordpress_username,
        wordpress_password: blogData.wordpress_password,
        auto_sync: true,
        seo_enabled: true,
        realtime_sync: false,
      };

      const { data, error } = await supabase
        .from("blogs")
        .insert({
          name: blogData.name.trim(),
          domain: blogData.domain.trim(),
          description: blogData.description?.trim() || null,
          niche: blogData.niche?.trim() || null,
          is_active: true,
          settings: settings as Json,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar blog: ${error.message}`);
      }

      return data as Blog;
    },
    onSuccess: (newBlog) => {
      // Invalida cache
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });

      // Adiciona ao cache otimisticamente
      queryClient.setQueryData(QUERY_KEYS.detail(newBlog.id), newBlog);

      toast.success("Blog criado com sucesso!", {
        description: `${newBlog.name} foi configurado e está pronto para uso.`,
      });
    },
    onError: (error) => {
      toast.error("Erro ao criar blog", {
        description: error.message,
      });
    },
  });
}

// Hook para atualizar blog
export function useUpdateBlog() {
  const queryClient = useQueryClient();

  return useMutation<
    Blog,
    Error,
    { blogId: string; updateData: UpdateBlogData }
  >({
    mutationFn: async ({ blogId, updateData }): Promise<Blog> => {
      if (!blogId) throw new Error("ID do blog é obrigatório");

      const { data, error } = await supabase
        .from("blogs")
        .update({
          ...updateData,
          settings: updateData.settings
            ? ({ ...updateData.settings } as Json)
            : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq("id", blogId)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao atualizar blog: ${error.message}`);
      }

      return data as Blog;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      toast.success("Blog atualizado com sucesso!", {
        description: "As alterações foram salvas.",
      });
    },
    onError: (error) => {
      toast.error("Erro ao atualizar blog", {
        description: error.message,
      });
    },
  });
}

// Hook para deletar blog
export function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string): Promise<void> => {
      if (!id) throw new Error("ID do blog é obrigatório");

      // Verificar se há posts/keywords associados
      const [postsRes, keywordsRes] = await Promise.all([
        supabase
          .from("content_posts")
          .select("id", { count: "exact" })
          .eq("blog_id", id),
        supabase
          .from("main_keywords")
          .select("id", { count: "exact" })
          .eq("blog_id", id),
      ]);

      const hasContent =
        (postsRes.count || 0) > 0 || (keywordsRes.count || 0) > 0;

      if (hasContent) {
        throw new Error(
          "Não é possível excluir blog com posts ou keywords associados"
        );
      }

      const { error } = await supabase.from("blogs").delete().eq("id", id);

      if (error) {
        throw new Error(`Erro ao excluir blog: ${error.message}`);
      }
    },
    onSuccess: (_, blogId) => {
      // Remove do cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(blogId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });

      toast.success("Blog excluído com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir blog", {
        description: error.message,
      });
    },
  });
}

// Hook para testar conexão WordPress
export function useTestWordPressConnection() {
  return useMutation<
    ApiResponse<{ status: string }>,
    Error,
    { blogId: string }
  >({
    mutationFn: async ({
      blogId,
    }): Promise<ApiResponse<{ status: string }>> => {
      if (!blogId) throw new Error("ID do blog é obrigatório");

      const response = await fetch(`/api/wordpress/test-connection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId }),
      });

      if (!response.ok) {
        throw new Error("Erro na conexão com WordPress");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Conexão WordPress testada com sucesso!", {
        description: "A integração está funcionando corretamente.",
      });
    },
    onError: (error) => {
      toast.error("Erro na conexão WordPress", {
        description: error.message,
      });
    },
  });
}
