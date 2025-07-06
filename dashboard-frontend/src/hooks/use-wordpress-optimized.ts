import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Blog,
  ContentPost,
  ApiResponse,
  WordPressApiResponse,
  UseQueryOptions,
} from "@/types/database-optimized";

// Configurações WordPress baseadas no .env
const getWordPressConfig = (domain: string) => {
  const configs = {
    "einsof7.com": {
      url:
        process.env.NEXT_PUBLIC_EINSOF7_WORDPRESS_URL || "https://einsof7.com",
      username: process.env.NEXT_PUBLIC_EINSOF7_WORDPRESS_USERNAME || "",
      password: process.env.NEXT_PUBLIC_EINSOF7_WORDPRESS_PASSWORD || "",
    },
    "optemil.com": {
      url:
        process.env.NEXT_PUBLIC_OPTEMIL_WORDPRESS_URL || "https://optemil.com",
      username: process.env.NEXT_PUBLIC_OPTEMIL_WORDPRESS_USERNAME || "",
      password: process.env.NEXT_PUBLIC_OPTEMIL_WORDPRESS_PASSWORD || "",
    },
  };

  return configs[domain as keyof typeof configs] || null;
};

// Cliente WordPress otimizado
class WordPressClient {
  private baseUrl: string;
  private credentials: string;

  constructor(config: { url: string; username: string; password: string }) {
    this.baseUrl = `${config.url}/wp-json/wp/v2`;
    this.credentials = btoa(`${config.username}:${config.password}`);
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Basic ${this.credentials}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`WordPress API Error ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  async getPosts(params: { per_page?: number; status?: string } = {}) {
    const searchParams = new URLSearchParams({
      per_page: String(params.per_page || 10),
      status: params.status || "any",
      _embed: "1",
    });

    return this.request(`/posts?${searchParams}`);
  }

  async getPost(id: number) {
    return this.request(`/posts/${id}?_embed=1`);
  }

  async createPost(post: any) {
    return this.request("/posts", {
      method: "POST",
      body: JSON.stringify(post),
    });
  }

  async updatePost(id: number, post: any) {
    return this.request(`/posts/${id}`, {
      method: "POST",
      body: JSON.stringify(post),
    });
  }

  async deletePost(id: number) {
    return this.request(`/posts/${id}`, {
      method: "DELETE",
    });
  }

  async testConnection() {
    try {
      await this.request("/posts?per_page=1");
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}

// Hook para testar conexão WordPress
export function useTestWordPressConnection() {
  return useMutation<
    { success: boolean; message?: string },
    Error,
    { blog: Blog }
  >({
    mutationFn: async ({ blog }) => {
      const config = getWordPressConfig(blog.domain);

      if (!config) {
        throw new Error(
          `Configuração WordPress não encontrada para ${blog.domain}`
        );
      }

      const client = new WordPressClient(config);
      const result = await client.testConnection();

      if (!result.success) {
        throw new Error(result.error || "Erro na conexão");
      }

      return {
        success: true,
        message: "Conexão estabelecida com sucesso",
      };
    },
    onSuccess: () => {
      toast.success("Conexão WordPress", {
        description: "Conexão testada com sucesso",
      });
    },
    onError: (error) => {
      toast.error("Erro na conexão WordPress", {
        description: error.message,
      });
    },
  });
}

// Hook para listar posts do WordPress
export function useWordPressPosts(
  blog: Blog,
  params: { per_page?: number; status?: string } = {},
  options?: UseQueryOptions
) {
  return useQuery({
    queryKey: ["wordpress-posts", blog.domain, params],
    queryFn: async (): Promise<WordPressApiResponse[]> => {
      const config = getWordPressConfig(blog.domain);

      if (!config) {
        throw new Error(
          `Configuração WordPress não encontrada para ${blog.domain}`
        );
      }

      const client = new WordPressClient(config);
      return client.getPosts(params);
    },
    enabled: !!blog && options?.enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutos
    ...options,
  });
}

// Hook para criar post no WordPress
export function useCreateWordPressPost() {
  const queryClient = useQueryClient();

  return useMutation<
    WordPressApiResponse,
    Error,
    { blog: Blog; post: ContentPost }
  >({
    mutationFn: async ({ blog, post }) => {
      const config = getWordPressConfig(blog.domain);

      if (!config) {
        throw new Error(
          `Configuração WordPress não encontrada para ${blog.domain}`
        );
      }

      const client = new WordPressClient(config);

      const wpPost = {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || "",
        status: post.status,
        meta: {
          _yoast_wpseo_title: post.meta_title || "",
          _yoast_wpseo_metadesc: post.meta_description || "",
        },
      };

      return client.createPost(wpPost);
    },
    onSuccess: (_, { blog }) => {
      queryClient.invalidateQueries({
        queryKey: ["wordpress-posts", blog.domain],
      });

      toast.success("Post criado no WordPress", {
        description: "Post publicado com sucesso",
      });
    },
    onError: (error) => {
      toast.error("Erro ao criar post no WordPress", {
        description: error.message,
      });
    },
  });
}

// Hook para sincronizar post do Supabase para WordPress
export function useSyncPostToWordPress() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<{ wordpress_id: number; wordpress_link: string }>,
    Error,
    { postId: string; blogId: string }
  >({
    mutationFn: async ({ postId, blogId }) => {
      const response = await fetch("/api/wordpress/sync-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, blogId }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Erro na sincronização: ${error}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast.success("Post sincronizado", {
        description: "Post enviado para WordPress com sucesso",
      });
    },
    onError: (error) => {
      toast.error("Erro na sincronização", {
        description: error.message,
      });
    },
  });
}

// Hook para sincronizar posts do WordPress para Supabase
export function useSyncPostsFromWordPress() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<{ synced: number; errors: number }>,
    Error,
    { blogId: string }
  >({
    mutationFn: async ({ blogId }) => {
      const response = await fetch("/api/wordpress/sync-from-wp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Erro na sincronização: ${error}`);
      }

      return response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast.success("Sincronização concluída", {
        description: `${result.data?.synced || 0} posts sincronizados`,
      });
    },
    onError: (error) => {
      toast.error("Erro na sincronização", {
        description: error.message,
      });
    },
  });
}

// Hook para sincronização em lote
export function useBulkWordPressSync() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<{ processed: number; successful: number; failed: number }>,
    Error,
    {
      blogId: string;
      postIds: string[];
      direction: "to_wp" | "from_wp";
    }
  >({
    mutationFn: async ({ blogId, postIds, direction }) => {
      const endpoint =
        direction === "to_wp"
          ? "/api/wordpress/bulk-sync-to-wp"
          : "/api/wordpress/bulk-sync-from-wp";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId, postIds }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Erro na sincronização em lote: ${error}`);
      }

      return response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["wordpress-posts"] });

      const { successful = 0, failed = 0 } = result.data || {};

      toast.success("Sincronização em lote concluída", {
        description: `${successful} posts sincronizados, ${failed} com erro`,
      });
    },
    onError: (error) => {
      toast.error("Erro na sincronização em lote", {
        description: error.message,
      });
    },
  });
}

// Hook para monitorar status de sincronização
export function useSyncStatus(blogId: string, options?: UseQueryOptions) {
  return useQuery({
    queryKey: ["sync-status", blogId],
    queryFn: async () => {
      const response = await fetch(`/api/sync/status?blogId=${blogId}`);

      if (!response.ok) {
        throw new Error("Erro ao verificar status de sincronização");
      }

      return response.json();
    },
    enabled: !!blogId && options?.enabled !== false,
    refetchInterval: 5000, // Atualizar a cada 5 segundos
    ...options,
  });
}

// Hook para configurações de sincronização automática
export function useAutoSyncSettings() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<any>,
    Error,
    {
      blogId: string;
      settings: {
        auto_sync: boolean;
        sync_interval: number;
        sync_direction: "bidirectional" | "to_wp" | "from_wp";
      };
    }
  >({
    mutationFn: async ({ blogId, settings }) => {
      const response = await fetch("/api/sync/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId, settings }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Erro ao salvar configurações: ${error}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sync-status"] });

      toast.success("Configurações de sincronização atualizadas");
    },
    onError: (error) => {
      toast.error("Erro ao salvar configurações", {
        description: error.message,
      });
    },
  });
}
