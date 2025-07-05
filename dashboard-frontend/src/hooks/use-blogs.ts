import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type {
  Blog,
  BlogWithKeywords,
  DatabaseInsert,
  DatabaseUpdate,
} from "@/types/database";
import { toast } from "sonner";

export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async (): Promise<Blog[]> => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useBlog(id: string) {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: async (): Promise<BlogWithKeywords> => {
      const { data, error } = await supabase
        .from("blogs")
        .select(
          `
          *,
          keywords:main_keywords(*),
          posts:content_posts(
            id,
            title,
            status,
            created_at,
            author:authors(name)
          )
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

export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blog: DatabaseInsert<Blog>) => {
      const { data, error } = await supabase
        .from("blogs")
        .insert(blog)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog criado com sucesso!");
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: DatabaseUpdate<Blog> & { id: string }) => {
      const { data, error } = await supabase
        .from("blogs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog", data.id] });
      toast.success("Blog atualizado com sucesso!");
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
      toast.success("Blog removido com sucesso!");
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
          .from("content_opportunities_clusters")
          .select("id, status", { count: "exact" })
          .eq("blog_id", blogId),
      ]);

      if (keywordsRes.error) throw keywordsRes.error;
      if (postsRes.error) throw postsRes.error;
      if (opportunitiesRes.error) throw opportunitiesRes.error;

      const publishedPosts =
        postsRes.data?.filter((p) => p.status === "published").length || 0;
      const pendingOpportunities =
        opportunitiesRes.data?.filter((o) => o.status === "identified")
          .length || 0;

      return {
        totalKeywords: keywordsRes.count || 0,
        totalPosts: postsRes.count || 0,
        publishedPosts,
        totalOpportunities: opportunitiesRes.count || 0,
        pendingOpportunities,
      };
    },
    enabled: !!blogId,
  });
}
