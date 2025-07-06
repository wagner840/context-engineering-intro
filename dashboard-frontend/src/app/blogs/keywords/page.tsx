"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  TrendingUp,
  Target,
  BarChart3,
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
import { motion } from "framer-motion";
import {
  useKeywords,
  useKeywordStats,
  useMarkKeywordAsUsed,
} from "@/hooks/use-keywords";
import type { KeywordSearchFilters } from "@/types/database";

export default function BlogKeywordsPage({
  params,
}: {
  params: { blogId: string };
}) {
  const [filters, setFilters] = useState<KeywordSearchFilters>({
    blog_id: params.blogId,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const { data: keywordsData, isLoading } = useKeywords(filters);
  const { data: stats } = useKeywordStats(params.blogId);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Keywords</h1>
          <p className="text-muted-foreground">
            Gerencie as palavras-chave deste blog
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Keyword
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
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

      {/* Filters */}
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

      {/* Keywords List */}
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
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span>MSV: {keyword.msv?.toLocaleString() || "N/A"}</span>
                      <span>Dificuldade: {keyword.kw_difficulty || "N/A"}</span>
                      <span>CPC: R$ {keyword.cpc?.toFixed(2) || "N/A"}</span>
                      <span>Intenção: {keyword.search_intent}</span>
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
    </div>
  );
}
