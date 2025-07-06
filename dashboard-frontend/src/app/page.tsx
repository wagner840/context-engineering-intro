"use client";

import { BlogsOverview } from "@/components/blogs/blogs-overview";
import { N8nDashboard } from "@/components/automation/n8n-dashboard";
import { BlogRealtimeMonitor } from "@/components/realtime/blog-realtime-monitor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Zap,
  Activity,
  FileText,
  Target,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { BlogService } from "@/lib/services/blog-service";
import { N8nService } from "@/lib/services/n8n-service";

export default function HomePage() {
  // Buscar estatísticas gerais
  const { data: blogs } = useQuery({
    queryKey: ["active-blogs-stats"],
    queryFn: () => BlogService.getActiveBlogs(),
  });

  const n8nService = new N8nService();
  const { data: workflows } = useQuery({
    queryKey: ["n8n-workflows-stats"],
    queryFn: () => n8nService.getWorkflows({ limit: 100 }),
  });

  const totalStats = {
    blogs: blogs?.length || 0,
    posts:
      blogs?.reduce((acc, blog) => acc + (blog.stats?.total_posts || 0), 0) ||
      0,
    keywords:
      blogs?.reduce(
        (acc, blog) => acc + (blog.stats?.total_keywords || 0),
        0
      ) || 0,
    opportunities:
      blogs?.reduce(
        (acc, blog) => acc + (blog.stats?.total_opportunities || 0),
        0
      ) || 0,
    workflows: workflows?.data?.length || 0,
    activeWorkflows: workflows?.data?.filter((w: any) => w.active).length || 0,
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard SEO & Automação</h1>
        <p className="text-muted-foreground">
          Gerencie seus blogs WordPress com inteligência artificial e automação
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blogs Ativos</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.blogs}</div>
            <p className="text-xs text-muted-foreground">
              WordPress integrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Posts
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.posts}</div>
            <p className="text-xs text-muted-foreground">Conteúdo publicado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keywords</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.keywords}</div>
            <p className="text-xs text-muted-foreground">
              Palavras monitoradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workflows N8N</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalStats.activeWorkflows}/{totalStats.workflows}
            </div>
            <p className="text-xs text-muted-foreground">Automações ativas</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="automation">Automação</TabsTrigger>
          <TabsTrigger value="realtime">Tempo Real</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo dos Blogs</CardTitle>
                <CardDescription>
                  Performance geral dos seus blogs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogs?.slice(0, 3).map((blog) => (
                    <div
                      key={blog.id}
                      className="flex items-center justify-between"
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
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold">
                            {blog.stats?.total_posts || 0}
                          </p>
                          <p className="text-xs text-muted-foreground">Posts</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">
                            {blog.stats?.total_keywords || 0}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Keywords
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>Top Oportunidades</CardTitle>
                <CardDescription>
                  Melhores ideias de conteúdo identificadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">
                          IA para Marketing Digital
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Score: 95
                        </p>
                      </div>
                    </div>
                    <Badge variant="default">Alta</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Automação com N8N</p>
                        <p className="text-xs text-muted-foreground">
                          Score: 88
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Média</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium">
                          SEO para E-commerce
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Score: 82
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Média</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Últimas ações no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <BlogRealtimeMonitor showAllBlogs={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blogs">
          <BlogsOverview />
        </TabsContent>

        <TabsContent value="automation">
          <N8nDashboard />
        </TabsContent>

        <TabsContent value="realtime">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monitor Geral</CardTitle>
                <CardDescription>
                  Todas as alterações em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BlogRealtimeMonitor showAllBlogs={true} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status dos Serviços</CardTitle>
                <CardDescription>Monitoramento de integrações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Activity className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Supabase</p>
                        <p className="text-sm text-muted-foreground">
                          Database & Realtime
                        </p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-500">
                      Online
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Zap className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">N8N</p>
                        <p className="text-sm text-muted-foreground">
                          Automation Platform
                        </p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-500">
                      Online
                    </Badge>
                  </div>

                  {blogs?.map((blog) => (
                    <div
                      key={blog.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100">
                          <Globe className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{blog.name}</p>
                          <p className="text-sm text-muted-foreground">
                            WordPress API
                          </p>
                        </div>
                      </div>
                      <Badge variant="default" className="bg-green-500">
                        Online
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
