import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type {
  Blog as SupabaseBlog,
  BlogWithKeywords,
  DatabaseInsert,
  DatabaseUpdate,
} from "@/types/database";
import { toast } from "sonner";
import { useBlog as useBlogContext } from "@/contexts/blog-context";

export function useBlogs() {
  const { selectedBlogIds, blogs, isAllSelected } = useBlogContext();
  
  return useQuery({
    queryKey: ["blogs", selectedBlogIds],
    queryFn: async () => {
      // Se todos os blogs estão selecionados, retornar blogs do contexto
      if (isAllSelected) {
        return blogs;
      }
      
      // Se blogs específicos estão selecionados, buscar dados do Supabase
      if (selectedBlogIds.length > 0) {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .in("id", selectedBlogIds);
          
        if (error) throw error;
        return data as SupabaseBlog[];
      }
      
      return blogs;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useBlog(id: string) {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select(
          `
          *,
          main_keywords:main_keywords(*)
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as BlogWithKeywords;
    },
    enabled: !!id,
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blog: DatabaseInsert<"blogs">) => {
      const { data, error } = await supabase
        .from("blogs")
        .insert(blog)
        .select()
        .single();

      if (error) throw error;
      return data as SupabaseBlog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog criado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar blog: ${error.message}`);
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...blog
    }: DatabaseUpdate<"blogs"> & { id: string }) => {
      const { data, error } = await supabase
        .from("blogs")
        .update(blog)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as SupabaseBlog;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog", variables.id] });
      toast.success("Blog atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar blog: ${error.message}`);
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blogs").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog excluído com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir blog: ${error.message}`);
    },
  });
}

export function useBlogStats(blogId: string) {
  return useQuery({
    queryKey: ["blog-stats", blogId],
    queryFn: async () => {
      const [keywordsRes, postsRes, opportunitiesRes] = await Promise.all([
        supabase
          .from("main_keywords")
          .select("id", { count: "exact" })
          .eq("blog_id", blogId),
        supabase
          .from("content_posts")
          .select("id, status", { count: "exact" })
          .eq("blog_id", blogId),
        supabase
          .from("keyword_clusters")
          .select("id", { count: "exact" })
          .eq("blog_id", blogId),
      ]);

      if (keywordsRes.error) throw keywordsRes.error;
      if (postsRes.error) throw postsRes.error;
      if (opportunitiesRes.error) throw opportunitiesRes.error;

      const publishedPosts =
        postsRes.data?.filter((p) => p.status === "published").length || 0;

      return {
        totalKeywords: keywordsRes.count || 0,
        totalPosts: postsRes.count || 0,
        publishedPosts,
        totalOpportunities: opportunitiesRes.count || 0,
      };
    },
    enabled: !!blogId,
  });
}
