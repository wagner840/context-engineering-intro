"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Calendar,
  Clock,
  User,
  BarChart3,
  Target,
  Eye,
  TrendingUp,
  BookOpen,
  Zap,
  Globe,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

// Mock data for demonstration
const contentData = {
  posts: [
    {
      id: 1,
      title: "Como Implementar SEO Técnico em 2024",
      status: "published",
      wordCount: 2847,
      readingTime: 12,
      seoScore: 85,
      publishDate: "2024-01-15",
      author: "AI Assistant",
      blog: "Einsof7",
      views: 1247,
      keywords: ["seo técnico", "otimização", "performance"],
    },
    {
      id: 2,
      title: "Guia Completo de Keyword Research",
      status: "draft",
      wordCount: 1923,
      readingTime: 8,
      seoScore: 72,
      publishDate: null,
      author: "Content Team",
      blog: "Optemil",
      views: 0,
      keywords: ["keyword research", "pesquisa", "seo"],
    },
    {
      id: 3,
      title: "Automação de Conteúdo com IA",
      status: "scheduled",
      wordCount: 3156,
      readingTime: 14,
      seoScore: 91,
      publishDate: "2024-01-20",
      author: "AI Assistant",
      blog: "Einsof7",
      views: 0,
      keywords: ["automação", "ia", "conteúdo"],
    },
    {
      id: 4,
      title: "Análise de Competidores no SEO",
      status: "review",
      wordCount: 2134,
      readingTime: 9,
      seoScore: 78,
      publishDate: null,
      author: "Content Team",
      blog: "Optemil",
      views: 0,
      keywords: ["competidores", "análise", "seo"],
    },
  ],
  stats: {
    totalPosts: 127,
    publishedPosts: 89,
    draftPosts: 23,
    scheduledPosts: 8,
    reviewPosts: 7,
    totalWords: 256890,
    avgSeoScore: 82,
    monthlyViews: 45230,
  },
};

const opportunities = [
  {
    id: 1,
    title: "Otimização de Core Web Vitals",
    priority: "high",
    estimatedTraffic: 2500,
    difficulty: 65,
    keywords: ["core web vitals", "performance", "seo técnico"],
    blog: "Einsof7",
  },
  {
    id: 2,
    title: "Schema Markup para E-commerce",
    priority: "medium",
    estimatedTraffic: 1800,
    difficulty: 72,
    keywords: ["schema markup", "ecommerce", "estruturados"],
    blog: "Optemil",
  },
  {
    id: 3,
    title: "Link Building Estratégias 2024",
    priority: "high",
    estimatedTraffic: 3200,
    difficulty: 78,
    keywords: ["link building", "backlinks", "autoridade"],
    blog: "Einsof7",
  },
];

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "draft":
        return <Edit className="h-4 w-4 text-gray-500" />;
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "review":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPosts = contentData.posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.keywords.some((k) =>
        k.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus =
      selectedStatus === "all" || post.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Gestão de Conteúdo
              </h1>
            </div>
            <p className="text-gray-600">
              Gerencie todo seu conteúdo, posts e oportunidades de SEO
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/content/bulk-editor">
                <Edit className="h-4 w-4 mr-2" />
                Editor em Massa
              </Link>
            </Button>
            <Button variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Gerar com IA
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Post
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-blue-600" />
              Total de Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contentData.stats.totalPosts}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {contentData.stats.publishedPosts} publicados
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4 text-green-600" />
              Score SEO Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contentData.stats.avgSeoScore}
            </div>
            <div className="text-xs text-gray-600 mt-1">Meta: 85+</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-purple-600" />
              Total de Palavras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(contentData.stats.totalWords / 1000).toFixed(0)}k
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Palavras publicadas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4 text-orange-600" />
              Visualizações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(contentData.stats.monthlyViews / 1000).toFixed(0)}k
            </div>
            <div className="text-xs text-gray-600 mt-1">Últimos 30 dias</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="opportunities"
            className="flex items-center gap-2"
          >
            <Target className="h-4 w-4" />
            Oportunidades
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Todos os Posts</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">Todos os status</option>
                    <option value="published">Publicados</option>
                    <option value="draft">Rascunhos</option>
                    <option value="scheduled">Agendados</option>
                    <option value="review">Em revisão</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {post.title}
                          </h3>
                          <Badge className={getStatusColor(post.status)}>
                            {getStatusIcon(post.status)}
                            <span className="ml-1 capitalize">
                              {post.status}
                            </span>
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {post.wordCount} palavras
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readingTime} min
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart3 className="h-4 w-4" />
                            SEO: {post.seoScore}%
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            {post.blog}
                          </span>
                          {post.views > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {post.views} views
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.keywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>

                    {post.publishDate && (
                      <div className="text-xs text-gray-500">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {post.status === "published"
                          ? "Publicado em"
                          : "Agendado para"}
                        :{" "}
                        {new Date(post.publishDate).toLocaleDateString("pt-BR")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities">
          <Card>
            <CardHeader>
              <CardTitle>Oportunidades de Conteúdo</CardTitle>
              <CardDescription>
                Ideias de conteúdo baseadas em análise de keywords e tendências
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {opportunity.title}
                          </h3>
                          <Badge
                            className={getPriorityColor(opportunity.priority)}
                          >
                            {opportunity.priority}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            {opportunity.estimatedTraffic} tráfego estimado
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            Dificuldade: {opportunity.difficulty}%
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            {opportunity.blog}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {opportunity.keywords.map((keyword, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Zap className="h-4 w-4 mr-2" />
                          Gerar Conteúdo
                        </Button>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Criar Post
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Publicados ({contentData.stats.publishedPosts})
                    </span>
                    <Progress value={70} className="w-24" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Edit className="h-4 w-4 text-gray-500" />
                      Rascunhos ({contentData.stats.draftPosts})
                    </span>
                    <Progress value={18} className="w-24" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      Agendados ({contentData.stats.scheduledPosts})
                    </span>
                    <Progress value={6} className="w-24" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      Em revisão ({contentData.stats.reviewPosts})
                    </span>
                    <Progress value={6} className="w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Qualidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {contentData.stats.avgSeoScore}%
                    </div>
                    <div className="text-sm text-gray-600">Score SEO Médio</div>
                    <Progress
                      value={contentData.stats.avgSeoScore}
                      className="mt-2"
                    />
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {Math.round(
                        contentData.stats.totalWords /
                          contentData.stats.publishedPosts
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Palavras por post (média)
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {Math.round(
                        contentData.stats.monthlyViews /
                          contentData.stats.publishedPosts
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Views por post (média)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
