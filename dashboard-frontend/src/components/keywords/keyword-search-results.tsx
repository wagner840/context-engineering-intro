'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, TrendingUp, Target, BarChart3, Plus, Eye, Star } from 'lucide-react'
import { useKeywords, useMarkKeywordAsUsed } from '@/hooks/use-keywords'
import { motion } from 'framer-motion'
import { KeywordSearchFilters } from '@/types/database'

interface KeywordSearchResultsProps {
  query: string
  blogId: string
}

export function KeywordSearchResults({ query, blogId }: KeywordSearchResultsProps) {
  const [filters, setFilters] = useState<Partial<KeywordSearchFilters>>({
    competition: undefined,
    search_intent: undefined,
    is_used: undefined,
    min_msv: undefined,
    max_difficulty: undefined,
  })

  const { data: keywordsData, isLoading } = useKeywords({
    search: query,
    blog_id: blogId === 'all' ? undefined : blogId,
    ...filters,
  })

  const markAsUsed = useMarkKeywordAsUsed()
  const keywords = keywordsData?.data || []

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'LOW':
        return 'bg-green-100 text-green-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'HIGH':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getIntentIcon = (intent: string) => {
    switch (intent) {
      case 'informational':
        return '📚'
      case 'navigational':
        return '🧭'
      case 'commercial':
        return '🛍️'
      case 'transactional':
        return '💰'
      default:
        return '❓'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (!query.trim()) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Buscar Keywords</h3>
            <p className="text-gray-600">
              Digite uma palavra-chave ou frase para começar sua pesquisa
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Buscando keywords...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros Avançados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select 
              value={filters.competition} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, competition: value as "LOW" | "MEDIUM" | "HIGH" | undefined }))}
            >
              <SelectTrigger>
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
              value={filters.search_intent} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, search_intent: value as "informational" | "navigational" | "commercial" | "transactional" | undefined }))}
            >
              <SelectTrigger>
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

            <Input
              placeholder="MSV mínimo"
              value={filters.min_msv}
              onChange={(e) => setFilters(prev => ({ ...prev, min_msv: Number(e.target.value) }))}
              type="number"
            />

            <Input
              placeholder="Dificuldade máx"
              value={filters.max_difficulty}
              onChange={(e) => setFilters(prev => ({ ...prev, max_difficulty: Number(e.target.value) }))}
              type="number"
            />

            <Select 
              value={String(filters.is_used)} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, is_used: value === 'true' }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Todas</SelectItem>
                <SelectItem value="true">Em uso</SelectItem>
                <SelectItem value="false">Disponível</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card>
        <CardHeader>
          <CardTitle>
            Resultados para &quot;{query}&quot; ({keywords.length} keywords encontradas)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {keywords.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nenhuma keyword encontrada</h3>
              <p className="text-gray-600">
                Tente ajustar sua busca ou usar filtros diferentes
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {keywords.map((keyword, index: number) => (
                <motion.div
                  key={keyword.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Keyword principal */}
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{keyword.keyword}</h3>
                        
                        {keyword.is_used && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Em uso
                          </Badge>
                        )}
                        
                        <Badge className={getCompetitionColor(keyword.competition || '')}>
                          {keyword.competition || 'N/A'}
                        </Badge>
                        
                        <div className="flex items-center gap-1">
                          <span>{getIntentIcon(keyword.search_intent || '')}</span>
                          <span className="text-sm text-gray-600">
                            {keyword.search_intent || 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Métricas */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-gray-600">Volume (MSV)</p>
                            <p className="font-semibold">
                              {keyword.msv?.toLocaleString() || 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-orange-600" />
                          <div>
                            <p className="text-gray-600">Dificuldade</p>
                            <p className={`font-semibold ${getScoreColor(keyword.kw_difficulty || 0)}`}>
                              {keyword.kw_difficulty || 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-gray-600">CPC</p>
                            <p className="font-semibold">
                              R$ {keyword.cpc?.toFixed(2) || 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-purple-600 flex items-center justify-center">
                            <span className="text-xs text-white font-bold">S</span>
                          </div>
                          <div>
                            <p className="text-gray-600">Score SEO</p>
                            <p className={`font-semibold ${getScoreColor(keyword.seo_score || 0)}`}>
                              {keyword.seo_score || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Informações adicionais */}
                      <div className="flex items-center gap-6 text-xs text-gray-500">
                        <span>Local: {keyword.location || 'Global'}</span>
                        <span>Idioma: {keyword.language || 'PT'}</span>
                        {keyword.last_updated && (
                          <span>
                            Atualizado: {new Date(keyword.last_updated).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col gap-2 ml-4">
                      {!keyword.is_used && (
                        <Button
                          size="sm"
                          onClick={() => markAsUsed.mutate(keyword.id)}
                          disabled={markAsUsed.isPending}
                          className="flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          Usar
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Detalhes
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
