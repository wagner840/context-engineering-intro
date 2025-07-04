import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type {
  ContentPost,
  PostWithMeta,
  PaginatedResponse,
  DatabaseInsert,
  DatabaseUpdate,
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
      return data as unknown as PostWithMeta;
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
      let query = supabase.from("production_pipeline").select("*");
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
    mutationFn: async (payload: DatabaseInsert<ContentPost>) => {
      const { data, error } = await supabase
        .from("content_posts")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Post criado com sucesso!");
    },
    onError: (e: Error) => toast.error(`Erro ao criar post: ${e.message}`),
  });
}

export function useUpdateContentPost() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: DatabaseUpdate<ContentPost> & { id: string }) => {
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
      invalidate();
      toast.success("Post atualizado!");
    },
    onError: (e: Error) => toast.error(`Erro ao atualizar post: ${e.message}`),
  });
}

export function useDeleteContentPost() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("content_posts")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Post excluído!");
    },
    onError: (e: Error) => toast.error(`Erro ao excluir post: ${e.message}`),
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
    onSuccess: () => invalidate(),
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
export function useContentRealtime(enabled: boolean = false) {
  // For simplicity, not implementing realtime here. Could reuse useRealtime pattern.
  return { isSubscribed: false };
}

/* ---------------------------------------------------------------------------
 * PLACEHOLDERS para compatibilidade
 * ------------------------------------------------------------------------ */
export function useContentPostsByStatus() {
  return { data: [], isLoading: false, error: null };
}
