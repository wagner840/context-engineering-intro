"use client";

import { useState } from "react";
import {
  Search,
  TrendingUp,
  Target,
  BarChart3,
  Brain,
  Sparkles,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  useKeywords,
  useKeywordStats,
  useMarkKeywordAsUsed,
} from "@/hooks/use-keywords";
import { useBlogs } from "@/hooks/use-blogs";
import { useDebounce } from "@/hooks/use-debounce";
import { KeywordSearchResults } from "@/components/keywords/keyword-search-results";
import { SemanticSearch } from "@/components/keywords/semantic-search";
import { KeywordOpportunities } from "@/components/keywords/keyword-opportunities";
import { KeywordAnalytics } from "@/components/keywords/keyword-analytics";
import type { KeywordSearchFilters } from "@/types/database";

export default function KeywordsPage() {
  const [filters, setFilters] = useState<KeywordSearchFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlog, setSelectedBlog] = useState<string>('all');
  const [searchMode, setSearchMode] = useState<'traditional' | 'semantic'>('traditional');
  const [activeTab, setActiveTab] = useState('search');
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: blogs } = useBlogs();
  const { data: keywordsData, isLoading } = useKeywords(filters);
  const { data: stats } = useKeywordStats(filters.blog_id);
  const markAsUsed = useMarkKeywordAsUsed();

  const keywords = keywordsData?.data || [];

  const handleFilterChange = (key: keyof KeywordSearchFilters, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case "LOW":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HIGH":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getIntentIcon = (intent: string) => {
    switch (intent) {
      case "informational":
        return "📚";
      case "navigational":
        return "🧭";
      case "commercial":
        return "🛍️";
      case "transactional":
        return "💰";
      default:
        return "❓";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pesquisa de Keywords
        </h1>
        <p className="text-gray-600">
          Encontre as melhores palavras-chave para seu conteúdo com busca tradicional e semântica
        </p>
      </div>

      {/* Filtros e Busca */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Busca e Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Campo de busca */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Digite sua palavra-chave ou descreva o que procura..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {/* Seletor de blog */}
            <Select value={selectedBlog} onValueChange={setSelectedBlog}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar blog" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os blogs</SelectItem>
                {blogs?.map((blog) => (
                  <SelectItem key={blog.id} value={blog.id}>
                    {blog.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Modo de busca */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Modo de busca:</span>
            <div className="flex gap-2">
              <Button
                variant={searchMode === 'traditional' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSearchMode('traditional')}
                className="flex items-center gap-2"
              >
                <Target className="h-4 w-4" />
                Tradicional
              </Button>
              <Button
                variant={searchMode === 'semantic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSearchMode('semantic')}
                className="flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                Semântica (AI)
              </Button>
            </div>
          </div>

          {searchMode === 'semantic' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Busca Semântica com IA</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Use linguagem natural para encontrar keywords relacionadas por significado, 
                    não apenas por correspondência textual.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conteúdo Principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Busca
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Oportunidades
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Gerenciar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          {searchMode === 'traditional' ? (
            <KeywordSearchResults 
              query={debouncedSearchQuery}
              blogId={selectedBlog}
            />
          ) : (
            <SemanticSearch
              query={debouncedSearchQuery}
              blogId={selectedBlog}
            />
          )}
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <KeywordOpportunities blogId={selectedBlog} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <KeywordAnalytics blogId={selectedBlog} />
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          {/* Stats Cards */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Keywords
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.used} em uso
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">MSV Médio</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(stats.avgMsv)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Volume de busca mensal
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Dificuldade Média
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(stats.avgDifficulty)}
                  </div>
                  <p className="text-xs text-muted-foreground">Dificuldade SEO</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CPC Médio</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {stats.avgCpc.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">Custo por clique</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Filtros Legacy */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Filtre e pesquise suas keywords</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Pesquisar keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button onClick={handleSearch}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Select
                    value={filters.blog_id || ""}
                    onValueChange={(value) => handleFilterChange("blog_id", value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Blog" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os blogs</SelectItem>
                      {blogs?.map((blog) => (
                        <SelectItem key={blog.id} value={blog.id}>
                          {blog.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.competition || ""}
                    onValueChange={(value) =>
                      handleFilterChange("competition", value)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Competição" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      <SelectItem value="LOW">Baixa</SelectItem>
                      <SelectItem value="MEDIUM">Média</SelectItem>
                      <SelectItem value="HIGH">Alta</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.search_intent || ""}
                    onValueChange={(value) =>
                      handleFilterChange("search_intent", value)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Intenção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      <SelectItem value="informational">Informacional</SelectItem>
                      <SelectItem value="navigational">Navegacional</SelectItem>
                      <SelectItem value="commercial">Comercial</SelectItem>
                      <SelectItem value="transactional">Transacional</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.is_used?.toString() || ""}
                    onValueChange={(value) =>
                      handleFilterChange("is_used", value === "true")
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      <SelectItem value="true">Em uso</SelectItem>
                      <SelectItem value="false">Disponível</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keywords List Legacy */}
          <Card>
            <CardHeader>
              <CardTitle>Keywords ({keywords.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 bg-gray-100 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : keywords.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma keyword encontrada
                </div>
              ) : (
                <div className="space-y-4">
                  {keywords.map((keyword: any, index: number) => (
                    <motion.div
                      key={keyword.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{keyword.keyword}</h3>
                          {keyword.is_used && (
                            <Badge variant="secondary">Em uso</Badge>
                          )}
                          <Badge
                            className={getCompetitionColor(
                              keyword.competition || ""
                            )}
                          >
                            {keyword.competition}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <span>
                              {getIntentIcon(keyword.search_intent || "")}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {keyword.search_intent}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span>MSV: {keyword.msv?.toLocaleString() || "N/A"}</span>
                          <span>Dificuldade: {keyword.kw_difficulty || "N/A"}</span>
                          <span>CPC: R$ {keyword.cpc?.toFixed(2) || "N/A"}</span>
                          <span>Local: {keyword.location}</span>
                          <span>Idioma: {keyword.language}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!keyword.is_used && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsUsed.mutate(keyword.id)}
                            disabled={markAsUsed.isPending}
                          >
                            Marcar como usada
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          Ver detalhes
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
