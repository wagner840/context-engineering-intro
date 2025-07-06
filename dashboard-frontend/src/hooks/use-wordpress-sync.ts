"use client";

import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "@/store/ui-store";
import { supabase } from "@/lib/supabase";
import { getWordPressClient } from "@/lib/wordpress";
import { useBlog } from "@/contexts/blog-context";
import type { Tables } from "@/types/database";
import type {
  WordPressCreatePostRequest,
  WordPressResponse,
} from "@/types/wordpress";

export interface SyncResult {
  success: boolean;
  message: string;
  details?: {
    synced: number;
    errors: number;
    errorDetails?: string[];
  };
}

export interface SyncStatus {
  isRunning: boolean;
  progress: number;
  currentTask: string;
  results?: SyncResult;
}

export function useWordPressSync(blogId?: string) {
  const { activeBlog } = useBlog();
  const currentBlogId =
    blogId || (activeBlog && activeBlog !== "all" ? activeBlog.id : "");

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isRunning: false,
    progress: 0,
    currentTask: "",
  });

  const [syncingPosts, setSyncingPosts] = useState<Set<string>>(new Set());

  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  // Helper function to create WordPress post
  const createWordPressPost = async (
    blog: Tables<"blogs">,
    postData: WordPressCreatePostRequest
  ): Promise<WordPressResponse> => {
    const client = await getWordPressClient(blog.id);

    // Converter para o formato esperado pelo WordPress API
    const wpPostData = {
      title: { rendered: postData.title },
      content: { rendered: postData.content, protected: false },
      excerpt: postData.excerpt
        ? { rendered: postData.excerpt, protected: false }
        : undefined,
      status: postData.status,
      meta: postData.meta || {},
    };

    return (await client.createPost(wpPostData)) as WordPressResponse;
  };

  // Helper function to log sync operation
  const logSync = async (
    blogId: string,
    syncType: "wp_to_supabase" | "supabase_to_wp",
    status: "pending" | "running" | "completed" | "failed",
    details?: any
  ) => {
    try {
      await supabase.from("sync_logs").insert({
        blog_id: blogId,
        sync_type: syncType,
        status,
        details,
      });
    } catch (error) {
      console.error("Error logging sync:", error);
    }
  };

  // Fetch sync logs using the new API
  const {
    data: syncLogs = [],
    isLoading: logsLoading,
    error: logsError,
    refetch: refetchLogs,
  } = useQuery<Tables<"sync_logs">[]>({
    queryKey: ["sync-logs", currentBlogId],
    queryFn: async () => {
      if (!currentBlogId) return [];

      const response = await fetch(`/api/sync/logs?blog_id=${currentBlogId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch sync logs");
      }
      return response.json();
    },
    enabled: !!currentBlogId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Enhanced sync mutations using the new API
  const syncFromWordPressMutation = useMutation({
    mutationFn: async (options?: { postId?: string }) => {
      if (!currentBlogId) throw new Error("No blog selected");

      const response = await fetch("/api/sync/wordpress-to-supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: currentBlogId,
          direction: "wp_to_supabase",
          postId: options?.postId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Sync failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sync-logs"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-stats"] });

      addNotification({
        type: "success",
        title: "WordPress Import",
        message: data.message,
      });
    },
    onError: (error) => {
      addNotification({
        type: "error",
        title: "Import Failed",
        message: error.message,
      });
    },
  });

  const syncToWordPressMutation = useMutation({
    mutationFn: async (options?: { postId?: string }) => {
      if (!currentBlogId) throw new Error("No blog selected");

      const response = await fetch("/api/sync/wordpress-to-supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: currentBlogId,
          direction: "supabase_to_wp",
          postId: options?.postId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Sync failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sync-logs"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-stats"] });

      addNotification({
        type: "success",
        title: "WordPress Export",
        message: data.message,
      });
    },
    onError: (error) => {
      addNotification({
        type: "error",
        title: "Export Failed",
        message: error.message,
      });
    },
  });

  // Enhanced sync functions
  const syncFromWordPress = useCallback(
    async (postId?: string) => {
      return syncFromWordPressMutation.mutateAsync({ postId });
    },
    [syncFromWordPressMutation]
  );

  const syncToWordPress = useCallback(
    async (postId?: string) => {
      return syncToWordPressMutation.mutateAsync({ postId });
    },
    [syncToWordPressMutation]
  );

  // Get sync status
  const getSyncStatus = useCallback(() => {
    if (!syncLogs || syncLogs.length === 0) return null;

    const lastSync = syncLogs[0];
    return {
      lastSyncAt: lastSync.created_at,
      lastSyncStatus: lastSync.status,
      lastSyncType: lastSync.sync_type,
      isHealthy: lastSync.status === "completed",
    };
  }, [syncLogs]);

  // Get sync statistics
  const getSyncStats = useCallback(() => {
    if (!syncLogs || syncLogs.length === 0) {
      return {
        totalSyncs: 0,
        successfulSyncs: 0,
        failedSyncs: 0,
        totalPostsSynced: 0,
        totalMediaSynced: 0,
        successRate: 0,
      };
    }

    const totalSyncs = syncLogs.length;
    const successfulSyncs = syncLogs.filter(
      (log: Tables<"sync_logs">) => log.status === "completed"
    ).length;
    const failedSyncs = syncLogs.filter(
      (log: Tables<"sync_logs">) => log.status === "failed"
    ).length;

    const totalPostsSynced = syncLogs.reduce(
      (sum: number, log: Tables<"sync_logs">) => {
        const details = log.details as { posts_synced?: number } | null;
        return sum + (details?.posts_synced || 0);
      },
      0
    );

    const totalMediaSynced = syncLogs.reduce(
      (sum: number, log: Tables<"sync_logs">) => {
        const details = log.details as { media_synced?: number } | null;
        return sum + (details?.media_synced || 0);
      },
      0
    );

    return {
      totalSyncs,
      successfulSyncs,
      failedSyncs,
      totalPostsSynced,
      totalMediaSynced,
      successRate: totalSyncs > 0 ? (successfulSyncs / totalSyncs) * 100 : 0,
    };
  }, [syncLogs]);

  // Testar conexão WordPress
  const testConnection = useMutation({
    mutationFn: async () => {
      try {
        const blogId = currentBlogId;
        if (!blogId) throw new Error("No blog selected");

        const client = await getWordPressClient(blogId);
        await client.getPosts({ per_page: 1 });
        return { success: true, message: "Conexão estabelecida com sucesso" };
      } catch (error) {
        throw new Error(
          `Erro na conexão: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      }
    },
    onSuccess: () => {
      addNotification({
        type: "success",
        title: "Conexão WordPress",
        message: "Conexão testada com sucesso",
      });
    },
    onError: (error) => {
      addNotification({
        type: "error",
        title: "Erro na conexão",
        message: error.message,
      });
    },
  });

  // Sincronizar post específico para WordPress
  const syncPostToWordPress = useCallback(
    async (postId: string) => {
      try {
        setSyncingPosts((prev) => new Set([...prev, postId]));

        // Verificar se há um blog selecionado
        const blogId = currentBlogId;
        if (!blogId) throw new Error("No blog selected");

        const { data: post, error: postError } = await supabase
          .from("content_posts")
          .select("*")
          .eq("id", postId)
          .eq("blog_id", blogId)
          .single();

        if (postError || !post) {
          throw new Error("Post not found");
        }

        const { data: blog, error: blogError } = await supabase
          .from("blogs")
          .select("*")
          .eq("id", blogId)
          .single();

        if (blogError || !blog) {
          throw new Error("Blog not found");
        }

        // Preparar dados para o WordPress
        const wpPostData: WordPressCreatePostRequest = {
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || undefined,
          status: post.status as
            | "publish"
            | "future"
            | "draft"
            | "pending"
            | "private",
          meta: {
            title: post.meta_title || "",
            description: post.meta_description || "",
          },
        };

        // Criar post no WordPress
        const wpResponse = await createWordPressPost(blog, wpPostData);

        // Atualizar post no Supabase com dados do WordPress
        const updateData = {
          wordpress_post_id: wpResponse.id,
          wordpress_link: wpResponse.link || null,
          wordpress_slug: wpResponse.slug || null,
        } as const;

        const { error: updateError } = await supabase
          .from("content_posts")
          .update(updateData)
          .eq("id", postId)
          .eq("blog_id", blogId);

        if (updateError) {
          throw updateError;
        }

        // Log da sincronização
        await logSync(blogId, "supabase_to_wp", "completed", {
          posts_synced: 1,
        });

        queryClient.invalidateQueries({ queryKey: ["posts", blogId] });
      } catch (error) {
        console.error("Error syncing post to WordPress:", error);

        const blogId = currentBlogId;
        if (blogId) {
          await logSync(blogId, "supabase_to_wp", "failed", {
            errors: [error instanceof Error ? error.message : "Unknown error"],
          });
        }

        throw error;
      } finally {
        setSyncingPosts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }
    },
    [currentBlogId, queryClient]
  );

  // Sincronizar post específico do WordPress para Supabase
  const syncPostFromWordPress = useMutation({
    mutationFn: async (wordpressId: number) => {
      try {
        const blogId = currentBlogId;
        if (!blogId) throw new Error("No blog selected");

        const client = await getWordPressClient(blogId);
        const wpPost = await client.getPost(wordpressId);

        // Verificar se post já existe
        const { data: existingPost } = await supabase
          .from("content_posts")
          .select("id")
          .eq("wordpress_post_id", wordpressId)
          .eq("blog_id", blogId)
          .single();

        const postData = {
          blog_id: blogId,
          title:
            typeof wpPost.title === "string"
              ? wpPost.title
              : wpPost.title.rendered,
          content:
            typeof wpPost.content === "string"
              ? wpPost.content
              : wpPost.content.rendered,
          excerpt: wpPost.excerpt
            ? typeof wpPost.excerpt === "string"
              ? wpPost.excerpt
              : wpPost.excerpt.rendered
            : null,
          status: wpPost.status,
          wordpress_post_id: wpPost.id,
          wordpress_link: wpPost.link || null,
          wordpress_slug: wpPost.slug || null,
          meta_title: (wpPost.meta as any)?.seo_title,
          meta_description: (wpPost.meta as any)?.seo_description,
          published_at: (wpPost as any).date,
        };

        if (existingPost) {
          // Atualizar post existente
          const { data, error } = await supabase
            .from("content_posts")
            .update(postData)
            .eq("id", existingPost.id)
            .select()
            .single();

          if (error) {
            throw new Error(`Erro ao atualizar post: ${error.message}`);
          }

          return {
            success: true,
            message: "Post atualizado do WordPress",
            post: data,
          };
        } else {
          // Criar novo post
          const { data, error } = await supabase
            .from("content_posts")
            .insert(postData)
            .select()
            .single();

          if (error) {
            throw new Error(`Erro ao criar post: ${error.message}`);
          }

          return {
            success: true,
            message: "Post importado do WordPress",
            post: data,
          };
        }
      } catch (error) {
        throw new Error(
          `Erro na sincronização: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      addNotification({
        type: "success",
        title: "Sincronização completa",
        message: "Post sincronizado do WordPress",
      });
    },
    onError: (error) => {
      addNotification({
        type: "error",
        title: "Erro na sincronização",
        message: error.message,
      });
    },
  });

  // Sincronização em lote
  const bulkSync = useMutation({
    mutationFn: async ({
      direction,
      postIds,
    }: {
      direction: "to_wp" | "from_wp";
      postIds?: string[];
    }) => {
      setSyncStatus({
        isRunning: true,
        progress: 0,
        currentTask: "Iniciando sincronização...",
      });

      let synced = 0;
      let errors = 0;
      const errorDetails: string[] = [];
      const totalPosts = postIds?.length || 0;

      if (direction === "to_wp" && postIds) {
        for (const postId of postIds) {
          try {
            setSyncStatus((prev) => ({
              ...prev,
              progress: (synced / totalPosts) * 100,
              currentTask: `Sincronizando post ${synced + 1} de ${totalPosts}...`,
            }));

            await syncPostToWordPress(postId);
            synced++;
          } catch (error) {
            errors++;
            errorDetails.push(
              error instanceof Error ? error.message : "Erro desconhecido"
            );
          }
        }
      }

      const result: SyncResult = {
        success: errors === 0,
        message: `Sincronização concluída: ${synced} posts sincronizados, ${errors} erros`,
        details: {
          synced,
          errors,
          errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
        },
      };

      setSyncStatus({
        isRunning: false,
        progress: 100,
        currentTask: "Concluído",
        results: result,
      });

      return result;
    },
    onSuccess: (result) => {
      addNotification({
        type: result.success ? "success" : "warning",
        title: "Sincronização em lote",
        message: result.message,
      });
    },
    onError: (error) => {
      setSyncStatus((prev) => ({
        ...prev,
        isRunning: false,
      }));

      addNotification({
        type: "error",
        title: "Erro na sincronização",
        message: error.message,
      });
    },
  });

  return {
    // States
    syncStatus,
    syncLogs,
    logsLoading,
    logsError,
    syncingPosts,

    // Sync functions
    syncFromWordPress,
    syncToWordPress,
    syncPostToWordPress,
    syncPostFromWordPress: syncPostFromWordPress.mutateAsync,
    bulkSync: bulkSync.mutateAsync,

    // Utilities
    getSyncStatus,
    getSyncStats,
    testConnection: testConnection.mutateAsync,
    refetchLogs,

    // Loading states
    isSyncingFromWP: syncFromWordPressMutation.isPending,
    isSyncingToWP: syncToWordPressMutation.isPending,
    isTestingConnection: testConnection.isPending,
    isBulkSyncing: bulkSync.isPending,
  };
}

export function useWordPressConnection(blogId: string) {
  const { data: connectionStatus, refetch } = useQuery({
    queryKey: ["wordpress-connection", blogId],
    queryFn: async () => {
      try {
        const client = await getWordPressClient(blogId);
        await client.getPosts({ per_page: 1 });
        return { connected: true, error: null };
      } catch (error) {
        return {
          connected: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        };
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });

  return {
    connectionStatus,
    refetchConnection: refetch,
    isConnected: connectionStatus?.connected ?? false,
    connectionError: connectionStatus?.error,
  };
}
