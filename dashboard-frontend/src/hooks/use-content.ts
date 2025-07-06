import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type {
  ContentPost,
  PostWithMeta,
  DatabaseInsert,
} from "@/types/database";
import { toast } from "sonner";

// Namespace de chaves para facilitar invalidação
export const CONTENT_QUERY_KEYS = {
  all: ["content-posts"] as const,
  byBlog: (blogId?: string) => ["content-posts", blogId] as const,
  single: (id: string) => ["content-post", id] as const,
  stats: (blogId?: string) => ["content-stats", blogId] as const,
  pipeline: (blogId?: string) => ["production-pipeline", blogId] as const,
};

/* ---------------------------------------------------------------------------
 * LISTAGEM DE POSTS
 * ------------------------------------------------------------------------ */

export function useContentPosts(blogId?: string) {
  return useQuery({
    queryKey: CONTENT_QUERY_KEYS.byBlog(blogId),
    queryFn: async (): Promise<ContentPost[]> => {
      let query = supabase
        .from("content_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (blogId) query = query.eq("blog_id", blogId);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useContentPost(id: string) {
  return useQuery({
    queryKey: CONTENT_QUERY_KEYS.single(id),
    queryFn: async (): Promise<PostWithMeta> => {
      const { data, error } = await supabase
        .from("content_posts")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;

      // Construir o objeto PostWithMeta com os metadados
      const post = data as ContentPost;
      return {
        ...post,
        meta: {
          seo_score: post.seo_score || undefined,
          reading_time: post.reading_time || undefined,
          word_count: post.word_count || undefined,
          meta_title: post.meta_title || undefined,
          meta_description: post.meta_description || undefined,
        },
      };
    },
    enabled: !!id,
  });
}

/* ---------------------------------------------------------------------------
 * ESTATÍSTICAS AGREGADAS
 * ------------------------------------------------------------------------ */
export function useContentStats(blogId?: string) {
  const { data: posts } = useContentPosts(blogId);

  const grouped =
    posts?.reduce<Record<string, number>>((acc, p) => {
      const statusKey = (p.status || "draft") as string;
      acc[statusKey] = (acc[statusKey] ?? 0) + 1;
      return acc;
    }, {}) ?? {};

  return {
    total: posts?.length ?? 0,
    draft: grouped["draft"] ?? 0,
    review: grouped["review"] ?? 0,
    scheduled: grouped["scheduled"] ?? 0,
    published: grouped["published"] ?? 0,
    archived: grouped["archived"] ?? 0,
  };
}

/* ---------------------------------------------------------------------------
 * PRODUCTION PIPELINE VIEW
 * ------------------------------------------------------------------------ */
export function useProductionPipeline(blogId?: string) {
  return useQuery({
    queryKey: CONTENT_QUERY_KEYS.pipeline(blogId),
    queryFn: async () => {
      let query = supabase
        .from("vw_content_opportunities_with_keywords")
        .select("*");
      if (blogId) query = query.eq("blog_id", blogId);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}

/* ---------------------------------------------------------------------------
 * CRUD MUTATIONS
 * ------------------------------------------------------------------------ */
const useInvalidateContent = () => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: CONTENT_QUERY_KEYS.all });
};

export function useCreateContentPost() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: async (payload: DatabaseInsert<"content_posts">) => {
      const { data, error } = await supabase
        .from("content_posts")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data as ContentPost;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Post criado com sucesso!");
    },
  });
}

export function useUpdatePostStatus() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("content_posts")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Status do post atualizado!");
    },
  });
}

export function useSchedulePost() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: async ({ id, schedule }: { id: string; schedule: string }) => {
      const { data, error } = await supabase
        .from("content_posts")
        .update({ scheduled_at: schedule, status: "scheduled" })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => invalidate(),
  });
}

export function usePublishPost() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("content_posts")
        .update({ status: "published", published_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => invalidate(),
  });
}

/* ---------------------------------------------------------------------------
 * REATIME SUBSCRIPTION (opcional)
 * ------------------------------------------------------------------------ */
export function useContentRealtime() {
  // For simplicity, not implementing realtime here. Could reuse useRealtime pattern.
  return { isSubscribed: false };
}

/* ---------------------------------------------------------------------------
 * PLACEHOLDERS para compatibilidade
 * ------------------------------------------------------------------------ */
export function useContentPostsByStatus() {
  return { data: [], isLoading: false, error: null };
}
