"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBlogs } from "@/hooks/use-blogs-optimized";
import { useBlogStats } from "@/hooks/use-blogs-optimized";
import { BlogCard } from "@/components/ui/mobile-optimized-card";
import { Blog } from "@/types/database-optimized";

// Componente de resumo de métricas
function MetricsOverview() {
  const { data: blogs = [] } = useBlogs();

  const totalMetrics = blogs.reduce(
    (acc, blog) => {
      return {
        totalBlogs: acc.totalBlogs + 1,
        activeBlogs: acc.activeBlogs + (blog.is_active ? 1 : 0),
      };
    },
    { totalBlogs: 0, activeBlogs: 0 }
  );

  const metrics = [
    {
      label: "Blogs Ativos",
      value: totalMetrics.activeBlogs,
      total: totalMetrics.totalBlogs,
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Posts Hoje",
      value: 0, // Implementar contador
      icon: <FileText className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Keywords",
      value: 0, // Implementar contador
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Analytics",
      value: 0, // Implementar contador
      icon: <BarChart3 className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border ${metric.bgColor} transition-all duration-200 hover:shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg bg-white ${metric.color}`}>
              {metric.icon}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {metric.value}
                {metric.total && (
                  <span className="text-sm font-normal text-gray-500">
                    /{metric.total}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-600">{metric.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente de busca rápida
function QuickSearch({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="flex gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar blogs, posts, keywords..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button variant="outline" size="icon">
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Lista de blogs otimizada
function BlogsList({ searchQuery }: { searchQuery: string }) {
  const { data: blogs = [], isLoading } = useBlogs();
  const router = useRouter();

  const filteredBlogs = blogs.filter(
    (blog) =>
      !searchQuery ||
      blog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredBlogs.map((blog) => (
        <BlogStatsCard key={blog.id} blog={blog} />
      ))}

      {filteredBlogs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Nenhum blog encontrado</p>
          <p className="text-sm">
            {searchQuery
              ? "Tente uma busca diferente"
              : "Comece criando seu primeiro blog"}
          </p>
          <Button className="mt-4" onClick={() => router.push("/blogs/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Blog
          </Button>
        </div>
      )}
    </div>
  );
}

// Card de blog com estatísticas
function BlogStatsCard({ blog }: { blog: Blog }) {
  const { data: stats } = useBlogStats(blog.id);
  const router = useRouter();

  return (
    <BlogCard
      blog={{
        id: blog.id,
        name: blog.name,
        domain: blog.domain,
        description: blog.description || undefined,
        is_active: blog.is_active,
      }}
      stats={stats}
      onEdit={() => router.push(`/blogs/${blog.id}/settings`)}
      onSync={() => router.push(`/blogs/${blog.id}/sync`)}
    />
  );
}

// Ações rápidas
function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      label: "Novo Blog",
      description: "Criar um novo blog",
      icon: <Plus className="h-5 w-5" />,
      onClick: () => router.push("/blogs/new"),
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      label: "Novo Post",
      description: "Escrever um post",
      icon: <FileText className="h-5 w-5" />,
      onClick: () => router.push("/content/editor"),
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      label: "Keywords",
      description: "Pesquisar palavras-chave",
      icon: <TrendingUp className="h-5 w-5" />,
      onClick: () => router.push("/keywords"),
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      label: "Analytics",
      description: "Ver relatórios",
      icon: <BarChart3 className="h-5 w-5" />,
      onClick: () => router.push("/analytics"),
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          className={`h-20 flex-col gap-2 ${action.color}`}
          onClick={action.onClick}
        >
          {action.icon}
          <div className="text-center">
            <div className="font-medium text-sm">{action.label}</div>
            <div className="text-xs opacity-70">{action.description}</div>
          </div>
        </Button>
      ))}
    </div>
  );
}

// Dashboard principal
export function MobileDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">
                Gerencie seus blogs e conteúdo
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              Online
            </Badge>
          </div>

          <QuickSearch onSearch={setSearchQuery} />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="recent">Recentes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <MetricsOverview />
            <QuickActions />

            <div>
              <h2 className="text-lg font-semibold mb-3">Blogs Ativos</h2>
              <BlogsList searchQuery={searchQuery} />
            </div>
          </TabsContent>

          <TabsContent value="blogs">
            <BlogsList searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="recent">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Atividade Recente</h2>
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma atividade recente</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
