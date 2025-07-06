"use client";

import { useBlogStats } from "@/hooks/use-blog-stats";
import { useBlog } from "@/contexts/blog-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogSelector } from "@/components/common/blog-selector";
import {
  Database,
  FileText,
  Key,
  Target,
  BarChart3,
  Globe,
  Search,
  Settings,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function BlogStatsDashboard() {
  const router = useRouter();
  const { activeBlog } = useBlog();
  const blogId = activeBlog && activeBlog !== "all" ? activeBlog.id : "";
  const { isLoading, error, posts, keywords } = useBlogStats(blogId);

  if (!activeBlog || activeBlog === "all") {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Selecione um blog</h3>
          <p className="text-muted-foreground mb-4">
            Escolha um blog específico para ver as estatísticas detalhadas
          </p>
          <BlogSelector size="md" showDescription />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-muted/20 rounded-lg animate-pulse"
            />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-muted/20 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Database className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Erro ao carregar dados</h3>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-2xl">{activeBlog.icon}</span>
            Dashboard - {activeBlog.name}
          </h1>
          <p className="text-muted-foreground">{activeBlog.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <Database className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Badge variant="outline">{activeBlog.domain}</Badge>
        </div>
      </div>

      {/* Alerta se blog não existe no banco */}
      {posts && posts.total_posts === 0 && keywords?.total_keywords === 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-orange-900">
                  Blog não encontrado no banco de dados
                </p>
                <p className="text-orange-700 text-sm">
                  O blog <strong>{activeBlog.domain}</strong> precisa ser
                  configurado no banco Supabase.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => router.push("/admin/setup")}
                className="ml-4"
              >
                <Plus className="h-4 w-4 mr-1" />
                Configurar
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Estatísticas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Posts
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {posts?.total_posts || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Publicados: {posts?.published_posts || 0} • Rascunhos:{" "}
              {posts?.draft_posts || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keywords</CardTitle>
            <Key className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {posts?.total_keywords || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de keywords mapeadas
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {posts?.total_opportunities || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Oportunidades de conteúdo
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Post</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {posts?.last_post_date
                ? new Date(posts.last_post_date).toLocaleDateString()
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Data do último post</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push(`/blogs/${activeBlog.id}/posts`)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Gerenciar Posts
            </Button>

            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push("/keywords")}
            >
              <Search className="h-4 w-4 mr-2" />
              Pesquisar Keywords
            </Button>

            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push(`/blogs/${activeBlog.id}`)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurações Blog
            </Button>

            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push("/analytics")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>

            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() =>
                window.open(`https://${activeBlog.domain}`, "_blank")
              }
            >
              <Globe className="h-4 w-4 mr-2" />
              Visitar Site
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t pt-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={() => router.push("/blogs")}
            className="min-w-[200px]"
          >
            <Database className="h-5 w-5 mr-2" />
            Gerenciar Blogs
          </Button>
        </div>
      </div>
    </div>
  );
}
