"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "@/store/ui-store";
import { supabase } from "@/lib/supabase";
import { getWordPressClient } from "@/lib/wordpress";
import { ContentPost as BaseContentPost } from "@/types/database";

// Tipo estendido para uso na aplicação
export interface ExtendedContentPost extends BaseContentPost {
  categories?: string[];
  tags?: string[];
  wordpress_sync?: boolean;
  wordpress_id?: string;
  featured_image?: string;
  author?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  custom_fields?: Record<string, unknown>;
  publish_date?: string;
}

// Tipo para criação de posts
export interface CreatePostData {
  blog_id: string;
  title: string;
  content: string;
  excerpt: string;
  status: "draft" | "pending" | "publish" | "private";
  meta_title?: string;
  meta_description?: string;
  featured_image?: string;
  author?: string;
  categories?: string[];
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  custom_fields?: Record<string, unknown>;
  wordpress_sync?: boolean;
  publish_date?: string;
}

export interface UpdatePostData extends CreatePostData {
  id: string;
}

export const POSTS_QUERY_KEYS = {
  all: ["posts"] as const,
  blogPosts: (blogId: string) =>
    [...POSTS_QUERY_KEYS.all, "blog", blogId] as const,
  post: (id: string) => [...POSTS_QUERY_KEYS.all, "post", id] as const,
  search: (query: string) =>
    [...POSTS_QUERY_KEYS.all, "search", query] as const,
} as const;

// Função utilitária para converter string[] para number[]
function toNumberArray(arr: string[] | undefined): number[] {
  if (!arr) return [];
  return arr.map((v) => Number(v)).filter((n) => !isNaN(n));
}

export function useBlogPosts(blogId: string | null) {
  return useQuery({
    queryKey: POSTS_QUERY_KEYS.blogPosts(blogId ?? "all"),
    queryFn: async (): Promise<ExtendedContentPost[]> => {
      if (!blogId) {
        // Buscar todos os posts de todos os blogs
        const { data, error } = await supabase
          .from("content_posts")
          .select("*")
          .order("updated_at", { ascending: false });
        if (error) throw new Error(error.message);
        return data || [];
      } else {
        // Buscar posts de um blog específico
        const { data, error } = await supabase
          .from("content_posts")
          .select("*")
          .eq("blog_id", blogId)
          .order("updated_at", { ascending: false });
        if (error) throw new Error(error.message);
        return data || [];
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: POSTS_QUERY_KEYS.post(id),
    queryFn: async (): Promise<ExtendedContentPost | null> => {
      if (!id) return null;

      try {
        const { data, error } = await supabase
          .from("content_posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            return null; // Post não encontrado
          }
          throw new Error(error.message);
        }

        return data;
      } catch (error) {
        throw new Error(
          `Failed to fetch post: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: async (
      postData: CreatePostData
    ): Promise<ExtendedContentPost> => {
      try {
        // Criar post no Supabase
        const { data, error } = await supabase
          .from("content_posts")
          .insert([
            {
              blog_id: postData.blog_id,
              title: postData.title,
              content: postData.content,
              excerpt: postData.excerpt,
              status: postData.status,
              meta_title: postData.seo_title,
              meta_description: postData.seo_description,
              wordpress_link: undefined,
              wordpress_post_id: undefined,
              wordpress_slug: undefined,
            },
          ])
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        // Sincronizar com WordPress se habilitado
        if (postData.wordpress_sync && postData.status === "publish") {
          try {
            const wpClient = await getWordPressClient(postData.blog_id);
            const wpPayload = {
              title: { rendered: postData.title },
              content: { rendered: postData.content, protected: false },
              excerpt: { rendered: postData.excerpt || "", protected: false },
              status: postData.status,
              featured_media: postData.featured_image
                ? Number(postData.featured_image)
                : undefined,
              categories: toNumberArray(postData.categories),
              tags: toNumberArray(postData.tags),
              meta: {
                seo_title: postData.seo_title,
                seo_description: postData.seo_description,
                focus_keyword: postData.seo_keywords?.[0],
                ...postData.custom_fields,
              },
            };
            const wpPost = await wpClient.createPost(wpPayload);

            // Atualizar com WordPress ID
            const { data: updatedData, error: updateError } = await supabase
              .from("content_posts")
              .update({
                wordpress_post_id: wpPost.id,
                wordpress_link: wpPost.link,
                wordpress_slug: wpPost.slug,
              })
              .eq("id", data.id)
              .select()
              .single();

            if (updateError) {
              console.error("Erro ao atualizar WordPress ID:", updateError);
            }

            return {
              ...updatedData,
              wordpress_sync: true,
              featured_image: postData.featured_image,
              author: postData.author,
              categories: postData.categories,
              tags: postData.tags,
              seo_title: postData.seo_title,
              seo_description: postData.seo_description,
              seo_keywords: postData.seo_keywords,
              custom_fields: postData.custom_fields,
              publish_date: postData.publish_date,
            } as ExtendedContentPost;
          } catch (wpError) {
            console.error("Erro na sincronização WordPress:", wpError);
            addNotification({
              type: "warning",
              title: "Post criado com aviso",
              message:
                "Post criado localmente, mas não foi possível sincronizar com WordPress.",
            });
          }
        }

        return {
          ...data,
          wordpress_sync: false,
          featured_image: postData.featured_image,
          author: postData.author,
          categories: postData.categories,
          tags: postData.tags,
          seo_title: postData.seo_title,
          seo_description: postData.seo_description,
          seo_keywords: postData.seo_keywords,
          custom_fields: postData.custom_fields,
          publish_date: postData.publish_date,
        } as ExtendedContentPost;
      } catch (error) {
        throw new Error(
          `Failed to create post: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: POSTS_QUERY_KEYS.blogPosts(data.blog_id),
      });
      addNotification({
        type: "success",
        title: "Post criado",
        message: "Post criado com sucesso",
      });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: async (
      postData: UpdatePostData
    ): Promise<ExtendedContentPost> => {
      try {
        // Atualizar post no Supabase
        const { data, error } = await supabase
          .from("content_posts")
          .update({
            title: postData.title,
            content: postData.content,
            excerpt: postData.excerpt,
            status: postData.status,
            meta_title: postData.seo_title,
            meta_description: postData.seo_description,
          })
          .eq("id", postData.id)
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        // Sincronizar com WordPress se habilitado
        if (postData.wordpress_sync && data.wordpress_post_id) {
          try {
            const wpClient = await getWordPressClient(postData.blog_id);
            const wpPayload = {
              title: { rendered: postData.title },
              content: { rendered: postData.content, protected: false },
              excerpt: { rendered: postData.excerpt || "", protected: false },
              status: postData.status,
              featured_media: postData.featured_image
                ? Number(postData.featured_image)
                : undefined,
              categories: toNumberArray(postData.categories),
              tags: toNumberArray(postData.tags),
              meta: {
                seo_title: postData.seo_title,
                seo_description: postData.seo_description,
                focus_keyword: postData.seo_keywords?.[0],
                ...postData.custom_fields,
              },
            };
            await wpClient.updatePost(
              Number(data.wordpress_post_id),
              wpPayload
            );
          } catch (wpError) {
            console.error("Erro na sincronização WordPress:", wpError);
            addNotification({
              type: "warning",
              title: "Post atualizado com aviso",
              message:
                "Post atualizado localmente, mas não foi possível sincronizar com WordPress.",
            });
          }
        }

        return {
          ...data,
          wordpress_sync: postData.wordpress_sync,
        } as ExtendedContentPost;
      } catch (error) {
        throw new Error(
          `Failed to update post: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: POSTS_QUERY_KEYS.blogPosts(data.blog_id),
      });
      queryClient.setQueryData(POSTS_QUERY_KEYS.post(data.id), data);
      addNotification({
        type: "success",
        title: "Post atualizado",
        message: "Post atualizado com sucesso",
      });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: async (postId: string): Promise<void> => {
      try {
        // Buscar post para verificar WordPress ID
        const { data: post, error: fetchError } = await supabase
          .from("content_posts")
          .select("wordpress_post_id, blog_id")
          .eq("id", postId)
          .single();

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        // Excluir do WordPress se sincronizado
        if (post.wordpress_post_id) {
          try {
            const wpClient = await getWordPressClient(post.blog_id);
            await wpClient.deletePost(Number(post.wordpress_post_id));
          } catch (wpError) {
            console.error("Erro ao excluir do WordPress:", wpError);
            addNotification({
              type: "warning",
              title: "Post excluído com aviso",
              message:
                "Post excluído localmente, mas não foi possível excluir do WordPress.",
            });
          }
        }

        // Excluir do Supabase
        const { error } = await supabase
          .from("content_posts")
          .delete()
          .eq("id", postId);

        if (error) {
          throw new Error(error.message);
        }
      } catch (error) {
        throw new Error(
          `Failed to delete post: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.all });
      addNotification({
        type: "success",
        title: "Post excluído",
        message: "Post excluído com sucesso",
      });
    },
  });
}

export function useSearchPosts(query: string) {
  return useQuery({
    queryKey: POSTS_QUERY_KEYS.search(query),
    queryFn: async (): Promise<ExtendedContentPost[]> => {
      if (!query.trim()) {
        return [];
      }

      try {
        const { data, error } = await supabase
          .from("content_posts")
          .select("*")
          .or(
            `title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`
          )
          .order("updated_at", { ascending: false })
          .limit(50);

        if (error) {
          throw new Error(error.message);
        }

        return data || [];
      } catch (error) {
        throw new Error(
          `Failed to search posts: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    enabled: !!query.trim(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useBulkUpdatePosts() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: async ({
      postIds,
      updates,
    }: {
      postIds: string[];
      updates: Partial<ExtendedContentPost>;
    }): Promise<void> => {
      try {
        const { error } = await supabase
          .from("content_posts")
          .update(updates)
          .in("id", postIds);

        if (error) {
          throw new Error(error.message);
        }
      } catch (error) {
        throw new Error(
          `Failed to bulk update posts: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.all });
      addNotification({
        type: "success",
        title: "Posts atualizados",
        message: "Posts atualizados em lote com sucesso",
      });
    },
  });
}

export function usePostStats(blogId: string) {
  return useQuery({
    queryKey: ["post-stats", blogId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("content_posts")
          .select("status, created_at")
          .eq("blog_id", blogId);

        if (error) {
          throw new Error(error.message);
        }

        const stats = {
          total: data.length,
          published: data.filter((p) => p.status === "publish").length,
          drafts: data.filter((p) => p.status === "draft").length,
          pending: data.filter((p) => p.status === "pending").length,
          private: data.filter((p) => p.status === "private").length,
          thisMonth: data.filter((p) => {
            const postDate = new Date(p.created_at);
            const now = new Date();
            return (
              postDate.getMonth() === now.getMonth() &&
              postDate.getFullYear() === now.getFullYear()
            );
          }).length,
        };

        return stats;
      } catch (error) {
        throw new Error(
          `Failed to fetch post stats: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
