import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  ContentPost,
  CreatePostData,
  UpdatePostData,
  PostStatus,
  UseQueryOptions,
  PaginatedResponse,
} from "@/types/database-optimized";

// Query keys centralizados para posts
const POST_QUERY_KEYS = {
  all: ["posts"] as const,
  lists: () => [...POST_QUERY_KEYS.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...POST_QUERY_KEYS.lists(), filters] as const,
  details: () => [...POST_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...POST_QUERY_KEYS.details(), id] as const,
  byBlog: (blogId: string) => [...POST_QUERY_KEYS.all, "blog", blogId] as const,
};

interface PostFilters {
  blog_id?: string;
  status?: PostStatus | PostStatus[];
  search?: string;
  limit?: number;
  offset?: number;
}

// Hook principal para listar posts com filtros e paginação
export function usePosts(filters: PostFilters = {}, options?: UseQueryOptions) {
  return useQuery({
    queryKey: POST_QUERY_KEYS.list(filters),
    queryFn: async (): Promise<PaginatedResponse<ContentPost>> => {
      let query = supabase
        .from("content_posts")
        .select(
          `
          id,
          blog_id,
          title,
          content,
          excerpt,
          status,
          slug,
          wordpress_post_id,
          wordpress_link,
          wordpress_slug,
          published_at,
          meta_title,
          meta_description,
          reading_time,
          word_count,
          seo_score,
          created_at,
          updated_at
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false });

      // Aplicar filtros
      if (filters.blog_id) {
        query = query.eq("blog_id", filters.blog_id);
      }

      if (filters.status) {
        if (Array.isArray(filters.status)) {
          query = query.in("status", filters.status);
        } else {
          query = query.eq("status", filters.status);
        }
      }

      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`
        );
      }

      // Paginação
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(
          filters.offset,
          filters.offset + (filters.limit || 50) - 1
        );
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Erro ao carregar posts: ${error.message}`);
      }

      return {
        data: data as ContentPost[],
        count: count || 0,
        page: Math.floor((filters.offset || 0) / (filters.limit || 50)) + 1,
        per_page: filters.limit || 50,
        total_pages: Math.ceil((count || 0) / (filters.limit || 50)),
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: options?.refetchInterval || 10 * 60 * 1000, // 10 minutos
    ...options,
  });
}

// Hook para post individual
export function usePost(id: string, options?: UseQueryOptions) {
  return useQuery({
    queryKey: POST_QUERY_KEYS.detail(id),
    queryFn: async (): Promise<ContentPost> => {
      if (!id) throw new Error("ID do post é obrigatório");

      const { data, error } = await supabase
        .from("content_posts")
        .select(
          `
          id,
          blog_id,
          title,
          content,
          excerpt,
          status,
          slug,
          wordpress_post_id,
          wordpress_link,
          wordpress_slug,
          published_at,
          meta_title,
          meta_description,
          reading_time,
          word_count,
          seo_score,
          created_at,
          updated_at
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`Erro ao carregar post: ${error.message}`);
      }

      return data as ContentPost;
    },
    enabled: !!id && options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutos
    ...options,
  });
}

// Hook para posts de um blog específico
export function useBlogPosts(
  blogId: string,
  status?: PostStatus,
  options?: UseQueryOptions
) {
  return usePosts(
    {
      blog_id: blogId,
      status,
      limit: 50,
    },
    {
      enabled: !!blogId && options?.enabled !== false,
      ...options,
    }
  );
}

// Hook para criar post com validação e sincronização WordPress
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation<ContentPost, Error, CreatePostData>({
    mutationFn: async (postData: CreatePostData): Promise<ContentPost> => {
      // Validação
      if (!postData.title?.trim()) {
        throw new Error("Título é obrigatório");
      }
      if (!postData.content?.trim()) {
        throw new Error("Conteúdo é obrigatório");
      }
      if (!postData.blog_id) {
        throw new Error("Blog é obrigatório");
      }

      // Calcular métricas automáticas
      const cleanContent = postData.content.replace(/<[^>]*>/g, "");
      const wordCount = cleanContent.split(/\s+/).filter(Boolean).length;
      const readingTime = Math.ceil(wordCount / 200);

      // Gerar slug automaticamente
      const slug = postData.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      const newPost = {
        blog_id: postData.blog_id,
        title: postData.title.trim(),
        content: postData.content,
        excerpt: postData.excerpt?.trim() || null,
        status: postData.status || "draft",
        slug,
        meta_title: postData.meta_title?.trim() || null,
        meta_description: postData.meta_description?.trim() || null,
        word_count: wordCount,
        reading_time: readingTime,
        published_at:
          postData.status === "publish" ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase
        .from("content_posts")
        .insert(newPost)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar post: ${error.message}`);
      }

      const createdPost = data as ContentPost;

      // Sincronização com WordPress se solicitada
      if (postData.wordpress_sync && postData.status === "publish") {
        try {
          const syncResponse = await fetch("/api/wordpress/sync-post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              postId: createdPost.id,
              blogId: postData.blog_id,
            }),
          });

          if (syncResponse.ok) {
            const syncResult = await syncResponse.json();

            // Atualizar com dados do WordPress
            const { data: updatedPost } = await supabase
              .from("content_posts")
              .update({
                wordpress_post_id: syncResult.wordpress_id,
                wordpress_link: syncResult.wordpress_link,
                wordpress_slug: syncResult.wordpress_slug,
              })
              .eq("id", createdPost.id)
              .select()
              .single();

            return updatedPost as ContentPost;
          }
        } catch (wpError) {
          console.warn("Erro na sincronização WordPress:", wpError);
          // Não falha o processo, apenas notifica
          toast.warning("Post criado com aviso", {
            description:
              "Post criado mas não foi possível sincronizar com WordPress.",
          });
        }
      }

      return createdPost;
    },
    onSuccess: (newPost) => {
      // Invalidar caches relacionados
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: POST_QUERY_KEYS.byBlog(newPost.blog_id),
      });

      // Adicionar ao cache otimisticamente
      queryClient.setQueryData(POST_QUERY_KEYS.detail(newPost.id), newPost);

      toast.success("Post criado com sucesso!", {
        description: `"${newPost.title}" foi ${newPost.status === "publish" ? "publicado" : "salvo como rascunho"}.`,
      });
    },
    onError: (error) => {
      toast.error("Erro ao criar post", {
        description: error.message,
      });
    },
  });
}

// Hook para atualizar post
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation<ContentPost, Error, UpdatePostData>({
    mutationFn: async (updateData: UpdatePostData): Promise<ContentPost> => {
      if (!updateData.id) throw new Error("ID do post é obrigatório");

      // Recalcular métricas se o conteúdo mudou
      let wordCount, readingTime;
      if (updateData.content) {
        const cleanContent = updateData.content.replace(/<[^>]*>/g, "");
        wordCount = cleanContent.split(/\s+/).filter(Boolean).length;
        readingTime = Math.ceil(wordCount / 200);
      }

      const { ...updatePayload } = {
        ...updateData,
        word_count: wordCount,
        reading_time: readingTime,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("content_posts")
        .update(updatePayload)
        .eq("id", updateData.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao atualizar post: ${error.message}`);
      }

      return data as ContentPost;
    },
    onSuccess: (updatedPost) => {
      // Atualizar caches
      queryClient.setQueryData(
        POST_QUERY_KEYS.detail(updatedPost.id),
        updatedPost
      );
      queryClient.invalidateQueries({
        queryKey: POST_QUERY_KEYS.byBlog(updatedPost.blog_id),
      });

      toast.success("Post atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar post", {
        description: error.message,
      });
    },
  });
}

// Hook para deletar post
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (postId: string): Promise<void> => {
      if (!postId) throw new Error("ID do post é obrigatório");

      const { error } = await supabase
        .from("content_posts")
        .delete()
        .eq("id", postId);

      if (error) {
        throw new Error(`Erro ao excluir post: ${error.message}`);
      }
    },
    onSuccess: (_, postId) => {
      // Remover do cache
      queryClient.removeQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.all });

      toast.success("Post excluído com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir post", {
        description: error.message,
      });
    },
  });
}

// Hook para publicar/despublicar post
export function useTogglePostStatus() {
  const queryClient = useQueryClient();

  return useMutation<ContentPost, Error, { id: string; status: PostStatus }>({
    mutationFn: async ({ id, status }): Promise<ContentPost> => {
      const updateData = {
        status,
        published_at: status === "publish" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("content_posts")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao alterar status: ${error.message}`);
      }

      return data as ContentPost;
    },
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(
        POST_QUERY_KEYS.detail(updatedPost.id),
        updatedPost
      );
      queryClient.invalidateQueries({
        queryKey: POST_QUERY_KEYS.byBlog(updatedPost.blog_id),
      });

      const action =
        updatedPost.status === "publish" ? "publicado" : "despublicado";
      toast.success(`Post ${action} com sucesso!`);
    },
    onError: (error) => {
      toast.error("Erro ao alterar status", {
        description: error.message,
      });
    },
  });
}

// Hook para estatísticas de posts por blog
export function usePostStats(blogId: string, options?: UseQueryOptions) {
  return useQuery({
    queryKey: [...POST_QUERY_KEYS.byBlog(blogId), "stats"],
    queryFn: async () => {
      if (!blogId) throw new Error("ID do blog é obrigatório");

      const { data, error } = await supabase
        .from("content_posts")
        .select("status, word_count, reading_time, seo_score")
        .eq("blog_id", blogId);

      if (error) throw error;

      const posts = data || [];

      return {
        total: posts.length,
        published: posts.filter((p) => p.status === "publish").length,
        draft: posts.filter((p) => p.status === "draft").length,
        private: posts.filter((p) => p.status === "private").length,
        avgWordCount:
          posts.reduce((sum, p) => sum + (p.word_count || 0), 0) /
            posts.length || 0,
        avgReadingTime:
          posts.reduce((sum, p) => sum + (p.reading_time || 0), 0) /
            posts.length || 0,
        avgSeoScore:
          posts.reduce((sum, p) => sum + (p.seo_score || 0), 0) /
            posts.length || 0,
      };
    },
    enabled: !!blogId && options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutos
    ...options,
  });
}
