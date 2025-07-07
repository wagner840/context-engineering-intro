"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  FileText,
  Target,
  TrendingUp,
  Activity,
  BarChart3,
  Zap,
} from "lucide-react";
import { useBlog } from "@/contexts/blog-context";
import { usePostStats } from "@/hooks/use-posts-dynamic";
import { useKeywordStats } from "@/hooks/use-keywords-dynamic";
import { useOpportunities } from "@/hooks/use-opportunities";
import { useDebugData } from "@/hooks/use-debug-data";
import { BlogsOverviewDynamic } from "@/components/blogs/blogs-overview-dynamic";

function QuickStats() {
  const {} = useBlog();
  const { data: postStats, isLoading: postsLoading } = usePostStats();
  const { data: keywordStats, isLoading: keywordsLoading } = useKeywordStats();
  const { data: opportunities, isLoading: opportunitiesLoading } = useOpportunities();
  const {} = useDebugData(); // Debug data

  if (postsLoading || keywordsLoading || opportunitiesLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total de Posts",
      value: postStats?.total || 0,
      icon: FileText,
      color: "text-blue-500",
      description: `${postStats?.published || 0} publicados`,
    },
    {
      title: "Posts Rascunho",
      value: postStats?.draft || 0,
      icon: Activity,
      color: "text-yellow-500",
      description: "Aguardando publicação",
    },
    {
      title: "Total Keywords",
      value: keywordStats?.total || 0,
      icon: Target,
      color: "text-purple-500",
      description: `${keywordStats?.active || 0} ativas`,
    },
    {
      title: "Oportunidades",
      value: opportunities?.total || 0,
      icon: TrendingUp,
      color: "text-green-500",
      description: `${opportunities?.categories || 0} categorias + ${opportunities?.clusters || 0} clusters`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function PerformanceOverview() {
  const { data: keywordStats, isLoading } = useKeywordStats();

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  const performance = {
    avgMsv: Math.round(keywordStats?.avgMsv || 0),
    avgDifficulty: Math.round(keywordStats?.avgDifficulty || 0),
    avgCpc: keywordStats?.avgCpc?.toFixed(2) || "0.00",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Performance das Keywords
        </CardTitle>
        <CardDescription>
          Métricas médias das keywords selecionadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {performance.avgMsv}
            </div>
            <div className="text-sm text-muted-foreground">MSV Médio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {performance.avgDifficulty}%
            </div>
            <div className="text-sm text-muted-foreground">Dificuldade Média</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ${performance.avgCpc}
            </div>
            <div className="text-sm text-muted-foreground">CPC Médio</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HomePageDynamic() {
  const { activeBlog } = useBlog();

  const currentSelection = activeBlog === "all" 
    ? "Todos os Blogs" 
    : (typeof activeBlog === "object" && activeBlog?.name) || "Nenhum blog selecionado";

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do {currentSelection}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {currentSelection}
        </Badge>
      </div>

      {/* Quick Stats */}
      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <QuickStats />
      </Suspense>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="automation">Automação</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <BlogsOverviewDynamic />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceOverview />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  Nenhuma atividade recente
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Automação
              </CardTitle>
              <CardDescription>
                Gerencie workflows e automações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Funcionalidades de automação em breve
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}