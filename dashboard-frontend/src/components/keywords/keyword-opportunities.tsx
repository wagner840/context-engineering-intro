'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  Target, 
  Lightbulb, 
  Zap, 
  Star,
  ArrowUp,
  ArrowDown,
  Eye,
  Plus,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

interface KeywordOpportunitiesProps {
  blogId: string
}

interface Opportunity {
  id: string
  keyword: string
  type: 'low_competition' | 'high_volume' | 'trending' | 'gap_analysis' | 'long_tail'
  score: number
  reason: string
  metrics: {
    msv?: number
    competition?: string
    difficulty?: number
    cpc?: number
    trend?: 'rising' | 'stable' | 'falling'
  }
  suggestions: string[]
}

export function KeywordOpportunities({ blogId }: KeywordOpportunitiesProps) {
  const [activeTab, setActiveTab] = useState('all')

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['keyword-opportunities', blogId],
    queryFn: async (): Promise<Opportunity[]> => {
      const response = await fetch('/api/keywords/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blog_id: blogId === 'all' ? undefined : blogId,
          include_competitors: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar oportunidades')
      }

      const data = await response.json()
      return data.opportunities || []
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  const getOpportunityIcon = (type: string) => {
    switch (type) {
      case 'low_competition':
        return <Target className="h-5 w-5 text-green-600" />
      case 'high_volume':
        return <TrendingUp className="h-5 w-5 text-blue-600" />
      case 'trending':
        return <ArrowUp className="h-5 w-5 text-purple-600" />
      case 'gap_analysis':
        return <Lightbulb className="h-5 w-5 text-orange-600" />
      case 'long_tail':
        return <Zap className="h-5 w-5 text-indigo-600" />
      default:
        return <Star className="h-5 w-5 text-gray-600" />
    }
  }

  const getOpportunityLabel = (type: string) => {
    switch (type) {
      case 'low_competition':
        return 'Baixa Competição'
      case 'high_volume':
        return 'Alto Volume'
      case 'trending':
        return 'Em Tendência'
      case 'gap_analysis':
        return 'Gap de Mercado'
      case 'long_tail':
        return 'Cauda Longa'
      default:
        return 'Oportunidade'
    }
  }

  const getOpportunityColor = (type: string) => {
    switch (type) {
      case 'low_competition':
        return 'bg-green-100 text-green-800'
      case 'high_volume':
        return 'bg-blue-100 text-blue-800'
      case 'trending':
        return 'bg-purple-100 text-purple-800'
      case 'gap_analysis':
        return 'bg-orange-100 text-orange-800'
      case 'long_tail':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'rising':
        return <ArrowUp className="h-4 w-4 text-green-600" />
      case 'falling':
        return <ArrowDown className="h-4 w-4 text-red-600" />
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  const filteredOpportunities = opportunities?.filter(opp => {
    if (activeTab === 'all') return true
    return opp.type === activeTab
  }) || []

  const opportunityStats = {
    total: opportunities?.length || 0,
    low_competition: opportunities?.filter(o => o.type === 'low_competition').length || 0,
    high_volume: opportunities?.filter(o => o.type === 'high_volume').length || 0,
    trending: opportunities?.filter(o => o.type === 'trending').length || 0,
    gap_analysis: opportunities?.filter(o => o.type === 'gap_analysis').length || 0,
    long_tail: opportunities?.filter(o => o.type === 'long_tail').length || 0,
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Oportunidades Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{opportunityStats.total}</div>
            <p className="text-sm text-gray-600">Keywords identificadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Baixa Competição
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{opportunityStats.low_competition}</div>
            <p className="text-sm text-gray-600">Fáceis de ranquear</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Em Tendência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{opportunityStats.trending}</div>
            <p className="text-sm text-gray-600">Crescendo agora</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros por Tipo */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-4xl grid-cols-6">
          <TabsTrigger value="all">
            Todas ({opportunityStats.total})
          </TabsTrigger>
          <TabsTrigger value="low_competition">
            <Target className="h-4 w-4 mr-1" />
            Baixa Comp. ({opportunityStats.low_competition})
          </TabsTrigger>
          <TabsTrigger value="high_volume">
            <TrendingUp className="h-4 w-4 mr-1" />
            Alto Vol. ({opportunityStats.high_volume})
          </TabsTrigger>
          <TabsTrigger value="trending">
            <ArrowUp className="h-4 w-4 mr-1" />
            Trends ({opportunityStats.trending})
          </TabsTrigger>
          <TabsTrigger value="gap_analysis">
            <Lightbulb className="h-4 w-4 mr-1" />
            Gaps ({opportunityStats.gap_analysis})
          </TabsTrigger>
          <TabsTrigger value="long_tail">
            <Zap className="h-4 w-4 mr-1" />
            Cauda L. ({opportunityStats.long_tail})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredOpportunities.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">
                    Nenhuma oportunidade encontrada
                  </h3>
                  <p className="text-gray-600">
                    Tente selecionar um blog específico ou aguarde nossa análise
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOpportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-4">
                          {/* Header */}
                          <div className="flex items-center gap-3">
                            {getOpportunityIcon(opportunity.type)}
                            <h3 className="text-xl font-semibold">{opportunity.keyword}</h3>
                            <Badge className={getOpportunityColor(opportunity.type)}>
                              {getOpportunityLabel(opportunity.type)}
                            </Badge>
                            <div className={`text-lg font-bold ${getScoreColor(opportunity.score)}`}>
                              {opportunity.score}%
                            </div>
                          </div>

                          {/* Reason */}
                          <p className="text-gray-700">{opportunity.reason}</p>

                          {/* Metrics */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {opportunity.metrics.msv && (
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-blue-600" />
                                <div>
                                  <p className="text-xs text-gray-600">Volume</p>
                                  <p className="font-semibold">
                                    {opportunity.metrics.msv.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            )}

                            {opportunity.metrics.difficulty && (
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-orange-600" />
                                <div>
                                  <p className="text-xs text-gray-600">Dificuldade</p>
                                  <p className={`font-semibold ${getScoreColor(100 - opportunity.metrics.difficulty)}`}>
                                    {opportunity.metrics.difficulty}
                                  </p>
                                </div>
                              </div>
                            )}

                            {opportunity.metrics.cpc && (
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-green-600 flex items-center justify-center">
                                  <span className="text-xs text-white font-bold">$</span>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">CPC</p>
                                  <p className="font-semibold">
                                    R$ {opportunity.metrics.cpc.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            )}

                            {opportunity.metrics.trend && (
                              <div className="flex items-center gap-2">
                                {getTrendIcon(opportunity.metrics.trend)}
                                <div>
                                  <p className="text-xs text-gray-600">Tendência</p>
                                  <p className="font-semibold capitalize">
                                    {opportunity.metrics.trend === 'rising' ? 'Subindo' :
                                     opportunity.metrics.trend === 'falling' ? 'Caindo' : 'Estável'}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Suggestions */}
                          {opportunity.suggestions.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Sugestões para aproveitar esta oportunidade:
                              </p>
                              <ul className="space-y-1">
                                {opportunity.suggestions.map((suggestion, i) => (
                                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 ml-6">
                          <Button size="sm" className="flex items-center gap-1">
                            <Plus className="h-4 w-4" />
                            Usar Keyword
                          </Button>
                          
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            Analisar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-6 w-6 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Como Funciona a Análise de Oportunidades</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <p>• <strong>Baixa Competição:</strong> Keywords com poucos concorrentes, mais fáceis de ranquear</p>
                <p>• <strong>Alto Volume:</strong> Keywords com muitas buscas mensais e potencial de tráfego</p>
                <p>• <strong>Em Tendência:</strong> Keywords que estão crescendo em popularidade</p>
                <p>• <strong>Gap de Mercado:</strong> Keywords que seus concorrentes não estão explorando</p>
                <p>• <strong>Cauda Longa:</strong> Keywords específicas com menos competição</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}