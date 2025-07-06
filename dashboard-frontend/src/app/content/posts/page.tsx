"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Calendar,
  Clock,
  User,
  BarChart3,
  Globe,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  Upload,
  MoreHorizontal,
} from "lucide-react";
import Image from "next/image";

const postsData = {
  published: [
    {
      id: 1,
      title: "Guia Completo de SEO Técnico para 2024",
      slug: "guia-completo-seo-tecnico-2024",
      excerpt:
        "Aprenda as melhores práticas de SEO técnico para otimizar seu site e melhorar rankings...",
      status: "published",
      author: "AI Assistant",
      blog: "Einsof7",
      publishDate: "2024-01-15",
      wordCount: 3247,
      readingTime: 13,
      seoScore: 92,
      views: 2847,
      keywords: ["seo técnico", "otimização", "core web vitals"],
      categories: ["SEO", "Marketing Digital"],
      thumbnail: "/api/placeholder/400/200",
    },
    {
      id: 2,
      title: "Automação de Marketing com WordPress e n8n",
      slug: "automacao-marketing-wordpress-n8n",
      excerpt:
        "Como criar fluxos de automação eficientes integrando WordPress com n8n para marketing...",
      status: "published",
      author: "Content Team",
      blog: "Opetmil",
      publishDate: "2024-01-12",
      wordCount: 2156,
      readingTime: 9,
      seoScore: 87,
      views: 1642,
      keywords: ["automação", "n8n", "wordpress"],
      categories: ["Automação", "WordPress"],
      thumbnail: "/api/placeholder/400/200",
    },
  ],
  drafts: [
    {
      id: 3,
      title: "Link Building Avançado: Estratégias para 2024",
      slug: "link-building-avancado-estrategias-2024",
      excerpt:
        "Técnicas avançadas de link building que realmente funcionam em 2024...",
      status: "draft",
      author: "AI Assistant",
      blog: "Einsof7",
      publishDate: null,
      wordCount: 1834,
      readingTime: 7,
      seoScore: 76,
      views: 0,
      keywords: ["link building", "backlinks", "seo"],
      categories: ["SEO", "Link Building"],
      thumbnail: null,
    },
  ],
  scheduled: [
    {
      id: 4,
      title: "JavaScript SEO: Otimização para SPAs",
      slug: "javascript-seo-otimizacao-spas",
      excerpt:
        "Como otimizar Single Page Applications para mecanismos de busca...",
      status: "scheduled",
      author: "Content Team",
      blog: "Einsof7",
      publishDate: "2024-01-25",
      wordCount: 2687,
      readingTime: 11,
      seoScore: 89,
      views: 0,
      keywords: ["javascript seo", "spa", "react seo"],
      categories: ["SEO", "JavaScript"],
      thumbnail: "/api/placeholder/400/200",
    },
  ],
  review: [
    {
      id: 5,
      title: "WordPress Headless: Implementação com Next.js",
      slug: "wordpress-headless-implementacao-nextjs",
      excerpt:
        "Guia prático para implementar WordPress headless com Next.js e GraphQL...",
      status: "review",
      author: "AI Assistant",
      blog: "Optemil",
      publishDate: null,
      wordCount: 3456,
      readingTime: 14,
      seoScore: 94,
      views: 0,
      keywords: ["wordpress headless", "nextjs", "graphql"],
      categories: ["WordPress", "React"],
      thumbnail: "/api/placeholder/400/200",
    },
  ],
};

export default function ContentPostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);

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

  const getSeoScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const allPosts = [
    ...postsData.published,
    ...postsData.drafts,
    ...postsData.scheduled,
    ...postsData.review,
  ];

  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.keywords.some((k) =>
        k.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      post.categories.some((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus =
      selectedStatus === "all" || post.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const togglePostSelection = (id: number) => {
    setSelectedPosts((prev) =>
      prev.includes(id) ? prev.filter((postId) => postId !== id) : [...prev, id]
    );
  };

  const PostCard = ({ post }: { post: any }) => (
    <Card
      className={`cursor-pointer transition-colors hover:border-gray-300 ${
        selectedPosts.includes(post.id) ? "border-blue-500 bg-blue-50" : ""
      }`}
      onClick={() => togglePostSelection(post.id)}
    >
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="w-24 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
            {post.thumbnail ? (
              <Image
                src={post.thumbnail}
                alt={`Imagem destacada do post ${post.title}`}
                width={100}
                height={100}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <FileText className="h-6 w-6 text-gray-400" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Badge className={getStatusColor(post.status)}>
                  {getStatusIcon(post.status)}
                  <span className="ml-1 capitalize">{post.status}</span>
                </Badge>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {post.blog}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {post.wordCount} palavras
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readingTime} min
              </span>
              <span className="flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                <span className={getSeoScoreColor(post.seoScore)}>
                  SEO: {post.seoScore}%
                </span>
              </span>
              {post.views > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {post.views} views
                </span>
              )}
              {post.publishDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.publishDate).toLocaleDateString("pt-BR")}
                </span>
              )}
            </div>

            {/* Keywords and Categories */}
            <div className="flex flex-wrap gap-1 mb-3">
              {post.keywords
                .slice(0, 3)
                .map((keyword: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              {post.keywords.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.keywords.length - 3}
                </Badge>
              )}
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1">
              {post.categories.map((category: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </Button>
          {post.status === "published" && (
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const totalPosts = allPosts.length;
  const publishedCount = postsData.published.length;
  const draftCount = postsData.drafts.length;
  const scheduledCount = postsData.scheduled.length;
  const reviewCount = postsData.review.length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Gerenciamento de Posts
          </h1>
        </div>
        <p className="text-gray-600">
          Gerencie todos os seus posts, desde rascunhos até publicações
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{totalPosts}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {publishedCount}
            </div>
            <div className="text-sm text-gray-600">Publicados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{draftCount}</div>
            <div className="text-sm text-gray-600">Rascunhos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {scheduledCount}
            </div>
            <div className="text-sm text-gray-600">Agendados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {reviewCount}
            </div>
            <div className="text-sm text-gray-600">Em Revisão</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex gap-4">
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
        <div className="flex gap-2">
          {selectedPosts.length > 0 && (
            <div className="flex gap-2">
              <Badge variant="outline" className="px-3 py-1">
                {selectedPosts.length} selecionados
              </Badge>
              <Button variant="outline" size="sm">
                Ações em Lote
              </Button>
            </div>
          )}
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Post
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-5">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="published">Publicados</TabsTrigger>
          <TabsTrigger value="draft">Rascunhos</TabsTrigger>
          <TabsTrigger value="scheduled">Agendados</TabsTrigger>
          <TabsTrigger value="review">Revisão</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="published">
          <div className="space-y-4">
            {postsData.published
              .filter(
                (post) =>
                  post.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  post.keywords.some((k) =>
                    k.toLowerCase().includes(searchQuery.toLowerCase())
                  )
              )
              .map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="draft">
          <div className="space-y-4">
            {postsData.drafts
              .filter(
                (post) =>
                  post.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  post.keywords.some((k) =>
                    k.toLowerCase().includes(searchQuery.toLowerCase())
                  )
              )
              .map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <div className="space-y-4">
            {postsData.scheduled
              .filter(
                (post) =>
                  post.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  post.keywords.some((k) =>
                    k.toLowerCase().includes(searchQuery.toLowerCase())
                  )
              )
              .map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="review">
          <div className="space-y-4">
            {postsData.review
              .filter(
                (post) =>
                  post.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  post.keywords.some((k) =>
                    k.toLowerCase().includes(searchQuery.toLowerCase())
                  )
              )
              .map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum post encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? "Tente ajustar sua busca ou criar um novo post."
                : "Comece criando seu primeiro post."}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Post
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
