'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  PieChart, 
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

interface KeywordAnalyticsProps {
  blogId: string
}

interface AnalyticsData {
  summary: {
    total_keywords: number
    avg_msv: number
    avg_difficulty: number
    avg_cpc: number
    keywords_in_use: number
  }
  competition_breakdown: {
    low: number
    medium: number
    high: number
  }
  intent_breakdown: {
    informational: number
    navigational: number
    commercial: number
    transactional: number
  }
  volume_distribution: {
    high_volume: number    // >10k
    medium_volume: number  // 1k-10k
    low_volume: number     // 100-1k
    very_low: number       // <100
  }
  trends: {
    month: string
    new_keywords: number
    used_keywords: number
    avg_difficulty: number
  }[]
  top_performers: {
    keyword: string
    msv: number
    difficulty: number
    cpc: number
    performance_score: number
  }[]
}

export function KeywordAnalytics({ blogId }: KeywordAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('last_30_days')
  const [activeTab, setActiveTab] = useState('overview')

  const { data: analytics, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['keyword-analytics', blogId, timeRange],
    queryFn: async (): Promise<AnalyticsData> => {
      const response = await fetch('/api/keywords/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blog_id: blogId === 'all' ? undefined : blogId,
          time_range: timeRange,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar analytics')
      }

      const data = await response.json()
      return data.analytics || mockAnalyticsData()
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  })

  // Mock data for development
  function mockAnalyticsData(): AnalyticsData {
    return {
      summary: {
        total_keywords: 1247,
        avg_msv: 2850,
        avg_difficulty: 45,
        avg_cpc: 1.35,
        keywords_in_use: 287,
      },
      competition_breakdown: {
        low: 456,
        medium: 623,
        high: 168,
      },
      intent_breakdown: {
        informational: 623,
        commercial: 312,
        navigational: 186,
        transactional: 126,
      },
      volume_distribution: {
        high_volume: 89,
        medium_volume: 234,
        low_volume: 567,
        very_low: 357,
      },
      trends: [
        { month: 'Jan', new_keywords: 45, used_keywords: 23, avg_difficulty: 43 },
        { month: 'Fev', new_keywords: 52, used_keywords: 31, avg_difficulty: 44 },
        { month: 'Mar', new_keywords: 38, used_keywords: 28, avg_difficulty: 46 },
        { month: 'Abr', new_keywords: 67, used_keywords: 35, avg_difficulty: 45 },
        { month: 'Mai', new_keywords: 73, used_keywords: 42, avg_difficulty: 47 },
        { month: 'Jun', new_keywords: 61, used_keywords: 38, avg_difficulty: 45 },
      ],
      top_performers: [
        { keyword: 'investimento para iniciantes', msv: 8900, difficulty: 32, cpc: 2.45, performance_score: 87 },
        { keyword: 'como cozinhar peixe', msv: 12400, difficulty: 28, cpc: 0.85, performance_score: 92 },
        { keyword: 'dicas de economia doméstica', msv: 5600, difficulty: 35, cpc: 1.20, performance_score: 78 },
        { keyword: 'receitas low carb', msv: 15300, difficulty: 42, cpc: 1.65, performance_score: 82 },
        { keyword: 'planejamento financeiro', msv: 7800, difficulty: 38, cpc: 3.20, performance_score: 75 },
      ],
    }
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics de Keywords</h2>
          <p className="text-gray-600">Análise detalhada do desempenho das suas keywords</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Últimos 7 dias</SelectItem>
              <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
              <SelectItem value="last_90_days">Últimos 90 dias</SelectItem>
              <SelectItem value="last_year">Último ano</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.summary.total_keywords.toLocaleString()}</div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-600">{analytics.summary.keywords_in_use}</span>
                <span className="text-gray-600 ml-1">em uso</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">MSV Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.summary.avg_msv.toLocaleString()}</div>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                Volume mensal
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Dificuldade Média</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.summary.avg_difficulty}</div>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <Target className="h-4 w-4 mr-1" />
                Nível SEO
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">CPC Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {analytics.summary.avg_cpc.toFixed(2)}</div>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <BarChart3 className="h-4 w-4 mr-1" />
                Custo por clique
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs de Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="competition">Competição</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Distribuição por Intenção */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Intenção de Busca
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-blue-600 rounded-full" />
                      <span className="text-sm">Informacional</span>
                    </div>
                    <span className="font-semibold">{analytics.intent_breakdown.informational}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-green-600 rounded-full" />
                      <span className="text-sm">Comercial</span>
                    </div>
                    <span className="font-semibold">{analytics.intent_breakdown.commercial}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-yellow-600 rounded-full" />
                      <span className="text-sm">Navegacional</span>
                    </div>
                    <span className="font-semibold">{analytics.intent_breakdown.navigational}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-purple-600 rounded-full" />
                      <span className="text-sm">Transacional</span>
                    </div>
                    <span className="font-semibold">{analytics.intent_breakdown.transactional}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Distribuição de Volume */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Volume de Busca
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Alto volume (&gt;10k)</span>
                    <span className="font-semibold">{analytics.volume_distribution.high_volume}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Médio volume (1k-10k)</span>
                    <span className="font-semibold">{analytics.volume_distribution.medium_volume}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Baixo volume (100-1k)</span>
                    <span className="font-semibold">{analytics.volume_distribution.low_volume}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Muito baixo (&lt;100)</span>
                    <span className="font-semibold">{analytics.volume_distribution.very_low}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Competição</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {analytics.competition_breakdown.low}
                  </div>
                  <div className="text-sm text-gray-600">Baixa Competição</div>
                  <div className="text-xs text-gray-500 mt-1">Fácil de ranquear</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {analytics.competition_breakdown.medium}
                  </div>
                  <div className="text-sm text-gray-600">Média Competição</div>
                  <div className="text-xs text-gray-500 mt-1">Moderadamente competitiva</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {analytics.competition_breakdown.high}
                  </div>
                  <div className="text-sm text-gray-600">Alta Competição</div>
                  <div className="text-xs text-gray-500 mt-1">Difícil de ranquear</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Keywords Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.top_performers.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{keyword.keyword}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>MSV: {keyword.msv.toLocaleString()}</span>
                        <span>Dificuldade: {keyword.difficulty}</span>
                        <span>CPC: R$ {keyword.cpc.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${getPerformanceColor(keyword.performance_score)}`}>
                      {keyword.performance_score}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Tendências Mensais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.trends.map((trend, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600">Mês</div>
                      <div className="font-semibold">{trend.month}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Novas Keywords</div>
                      <div className="font-semibold">{trend.new_keywords}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Keywords Usadas</div>
                      <div className="font-semibold">{trend.used_keywords}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Dificuldade Média</div>
                      <div className="font-semibold">{trend.avg_difficulty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}