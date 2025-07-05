"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  FileText,
  Target,
  TrendingUp,
  Calendar,
  Eye,
  Settings,
  RefreshCw,
  Plus,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  Zap,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { BlogService, BlogWithStats } from "@/lib/services/blog-service";
import { N8nService } from "@/lib/services/n8n-service";
import { supabase } from "@/lib/supabase";

interface BlogCardProps {
  blog: BlogWithStats;
  onSync: (blogId: string) => void;
  isSyncing: boolean;
}

function BlogCard({ blog, onSync, isSyncing }: BlogCardProps) {
  const router = useRouter();

  const getBlogTypeFromDomain = (domain: string): "einsof7" | "opetmil" => {
    return domain.includes("einsof7") ? "einsof7" : "opetmil";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg bg-gradient-to-br ${
                  getBlogTypeFromDomain(blog.domain) === "einsof7"
                    ? "from-purple-500 to-purple-600"
                    : "from-blue-500 to-blue-600"
                }`}
              >
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">{blog.name}</CardTitle>
                <CardDescription>{blog.description}</CardDescription>
              </div>
            </div>
            <Badge variant={blog.is_active ? "default" : "secondary"}>
              {blog.is_active ? "Ativo" : "Inativo"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ExternalLink className="h-4 w-4" />
            <a
              href={`https://${blog.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {blog.domain}
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            <span>Nicho: {blog.niche}</span>
          </div>

          {blog.stats?.last_post_date && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Último post:{" "}
                {formatDistanceToNow(new Date(blog.stats.last_post_date), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </span>
            </div>
          )}

          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {blog.stats?.total_posts || 0}
              </p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {blog.stats?.total_keywords || 0}
              </p>
              <p className="text-xs text-muted-foreground">Keywords</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {blog.stats?.total_opportunities || 0}
              </p>
              <p className="text-xs text-muted-foreground">Oportunidades</p>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/blogs/${blog.id}`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Dashboard
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/blogs/${blog.id}/posts`)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Posts
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onSync(blog.id)}
              disabled={isSyncing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`}
              />
              Sincronizar
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/blogs/${blog.id}/settings`)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function N8nStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">(
    "checking"
  );
  const n8nService = new N8nService();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await n8nService.healthCheck();
        setStatus(result.status === "ok" ? "online" : "offline");
      } catch {
        setStatus("offline");
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Zap className="h-4 w-4" />
      <span className="text-sm font-medium">N8N Status:</span>
      {status === "checking" ? (
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          Verificando...
        </Badge>
      ) : status === "online" ? (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Online
        </Badge>
      ) : (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Offline
        </Badge>
      )}
    </div>
  );
}

export function BlogsOverview() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const n8nService = new N8nService();
  const [syncingBlogId, setSyncingBlogId] = useState<string | null>(null);

  // Buscar blogs ativos
  const {
    data: blogs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["active-blogs"],
    queryFn: () => BlogService.getActiveBlogs(),
    refetchInterval: 60000, // Refresh every minute
  });

  // Mutation para sincronizar blog
  const syncBlogMutation = useMutation({
    mutationFn: async (blogId: string) => {
      const blog = blogs?.find((b) => b.id === blogId);
      if (!blog) throw new Error("Blog não encontrado");

      return n8nService.triggerBlogSync(blogId, blog.domain);
    },
    onMutate: (blogId) => {
      setSyncingBlogId(blogId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-blogs"] });
    },
    onSettled: () => {
      setSyncingBlogId(null);
    },
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel("blogs-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "blogs",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["active-blogs"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "content_posts",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["active-blogs"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar blogs. Por favor, tente novamente.
        </AlertDescription>
      </Alert>
    );
  }

  const totalStats = blogs?.reduce(
    (acc, blog) => ({
      posts: acc.posts + (blog.stats?.total_posts || 0),
      keywords: acc.keywords + (blog.stats?.total_keywords || 0),
      opportunities: acc.opportunities + (blog.stats?.total_opportunities || 0),
    }),
    { posts: 0, keywords: 0, opportunities: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blogs</h1>
          <p className="text-muted-foreground">
            Gerencie seus blogs WordPress integrados
          </p>
        </div>
        <div className="flex items-center gap-4">
          <N8nStatus />
          <Button onClick={() => router.push("/blogs/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Blog
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Posts
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats?.posts || 0}</div>
            <p className="text-xs text-muted-foreground">
              Em todos os blogs ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Keywords Rastreadas
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalStats?.keywords || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Palavras-chave monitoradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalStats?.opportunities || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Ideias de conteúdo identificadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Blogs Grid */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos os Blogs</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {blogs && blogs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onSync={(blogId) => syncBlogMutation.mutate(blogId)}
                  isSyncing={syncingBlogId === blog.id}
                />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex items-center justify-center p-12">
                <div className="text-center space-y-4">
                  <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <Globe className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      Nenhum blog cadastrado
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Adicione seu primeiro blog para começar a gerenciar
                      conteúdo
                    </p>
                  </div>
                  <Button onClick={() => router.push("/blogs/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Blog
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {blogs
              ?.filter((blog) => blog.is_active)
              .map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onSync={(blogId) => syncBlogMutation.mutate(blogId)}
                  isSyncing={syncingBlogId === blog.id}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise Comparativa</CardTitle>
              <CardDescription>
                Compare o desempenho dos seus blogs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blogs?.map((blog) => (
                  <div
                    key={blog.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-br ${
                          blog.domain.includes("einsof7")
                            ? "from-purple-500 to-purple-600"
                            : "from-blue-500 to-blue-600"
                        }`}
                      >
                        <Globe className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{blog.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {blog.domain}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-lg font-semibold">
                          {blog.stats?.total_posts || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Posts</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">
                          {blog.stats?.published_posts || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Publicados
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">
                          {blog.stats?.total_keywords || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Keywords
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(`/blogs/${blog.id}/analytics`)
                        }
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
