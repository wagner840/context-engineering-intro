'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Target, 
  AlertCircle,
  Download,
  RefreshCw,
  Activity,
  Eye,
  Heart,
  Share,
  MessageCircle
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

interface PipelineAnalytics {
  overview: {
    total_workflows: number
    active_workflows: number
    total_executions: number
    success_rate: number
    avg_execution_time: number
    content_generated: number
    posts_published: number
    social_shares: number
  }
  performance_trends: {
    period: string
    executions: number
    success_rate: number
    avg_time: number
    content_generated: number
  }[]
  workflow_performance: {
    id: string
    name: string
    executions: number
    success_rate: number
    avg_execution_time: number
    last_run: string
    status: 'active' | 'paused' | 'error'
    content_output: number
    engagement_score: number
  }[]
  content_metrics: {
    type: 'blog_post' | 'social_media' | 'newsletter'
    count: number
    avg_engagement: number
    top_performing: {
      title: string
      views: number
      engagement: number
      platform: string
    }[]
  }[]
  error_analysis: {
    error_type: string
    count: number
    percentage: number
    most_recent: string
    affected_workflows: string[]
  }[]
  optimization_suggestions: {
    type: 'performance' | 'content' | 'timing' | 'technical'
    title: string
    description: string
    impact: 'high' | 'medium' | 'low'
    difficulty: 'easy' | 'medium' | 'hard'
  }[]
}

export function PipelineAnalytics() {
  const [timeRange, setTimeRange] = useState('last_30_days')
  const [activeTab, setActiveTab] = useState('overview')

  const { data: analytics, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['pipeline-analytics', timeRange],
    queryFn: async (): Promise<PipelineAnalytics> => {
      // Mock data for now - replace with actual API call
      return {
        overview: {
          total_workflows: 12,
          active_workflows: 8,
          total_executions: 2847,
          success_rate: 94.2,
          avg_execution_time: 3.5,
          content_generated: 394,
          posts_published: 287,
          social_shares: 1549
        },
        performance_trends: [
          { period: 'Sem 1', executions: 245, success_rate: 92.5, avg_time: 3.8, content_generated: 34 },
          { period: 'Sem 2', executions: 289, success_rate: 94.1, avg_time: 3.6, content_generated: 41 },
          { period: 'Sem 3', executions: 312, success_rate: 95.8, avg_time: 3.2, content_generated: 45 },
          { period: 'Sem 4', executions: 267, success_rate: 93.4, avg_time: 3.4, content_generated: 38 }
        ],
        workflow_performance: [
          {
            id: 'wf-1',
            name: 'Geração de Conteúdo Automática',
            executions: 456,
            success_rate: 96.5,
            avg_execution_time: 4.2,
            last_run: '2024-01-15T09:30:00Z',
            status: 'active',
            content_output: 89,
            engagement_score: 87
          },
          {
            id: 'wf-2',
            name: 'Pipeline de Keywords',
            executions: 234,
            success_rate: 91.8,
            avg_execution_time: 2.8,
            last_run: '2024-01-15T08:45:00Z',
            status: 'active',
            content_output: 67,
            engagement_score: 92
          },
          {
            id: 'wf-3',
            name: 'Social Media Automation',
            executions: 789,
            success_rate: 98.2,
            avg_execution_time: 1.5,
            last_run: '2024-01-15T10:15:00Z',
            status: 'active',
            content_output: 145,
            engagement_score: 78
          },
          {
            id: 'wf-4',
            name: 'Curadoria de Conteúdo',
            executions: 156,
            success_rate: 88.5,
            avg_execution_time: 5.1,
            last_run: '2024-01-14T16:20:00Z',
            status: 'paused',
            content_output: 34,
            engagement_score: 85
          }
        ],
        content_metrics: [
          {
            type: 'blog_post',
            count: 187,
            avg_engagement: 8.4,
            top_performing: [
              { title: 'Como investir em 2024', views: 15420, engagement: 12.8, platform: 'WordPress' },
              { title: 'Dicas de produtividade', views: 12890, engagement: 9.7, platform: 'WordPress' }
            ]
          },
          {
            type: 'social_media',
            count: 145,
            avg_engagement: 6.2,
            top_performing: [
              { title: 'Thread sobre criptomoedas', views: 8945, engagement: 15.2, platform: 'Twitter' },
              { title: 'Infográfico finanças', views: 6734, engagement: 11.4, platform: 'LinkedIn' }
            ]
          },
          {
            type: 'newsletter',
            count: 62,
            avg_engagement: 18.7,
            top_performing: [
              { title: 'Newsletter semanal #45', views: 3456, engagement: 24.1, platform: 'Email' }
            ]
          }
        ],
        error_analysis: [
          {
            error_type: 'API Rate Limit',
            count: 12,
            percentage: 4.2,
            most_recent: '2024-01-15T07:30:00Z',
            affected_workflows: ['wf-1', 'wf-2']
          },
          {
            error_type: 'Content Generation Timeout',
            count: 8,
            percentage: 2.8,
            most_recent: '2024-01-14T14:15:00Z',
            affected_workflows: ['wf-1']
          },
          {
            error_type: 'WordPress Connection',
            count: 5,
            percentage: 1.7,
            most_recent: '2024-01-13T11:45:00Z',
            affected_workflows: ['wf-3']
          }
        ],
        optimization_suggestions: [
          {
            type: 'performance',
            title: 'Otimizar horários de execução',
            description: 'Redistribuir workflows para evitar picos de uso às 9h',
            impact: 'high',
            difficulty: 'easy'
          },
          {
            type: 'content',
            title: 'Melhorar prompts de IA',
            description: 'Ajustar prompts para aumentar a qualidade do conteúdo gerado',
            impact: 'medium',
            difficulty: 'medium'
          },
          {
            type: 'technical',
            title: 'Implementar retry automático',
            description: 'Adicionar lógica de retry para falhas temporárias de API',
            impact: 'high',
            difficulty: 'medium'
          }
        ]
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffMinutes < 60) return `${diffMinutes}m atrás`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h atrás`
    return `${Math.floor(diffMinutes / 1440)}d atrás`
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
          <h2 className="text-2xl font-bold">Analytics do Pipeline</h2>
          <p className="text-gray-600">Análise detalhada da performance dos seus workflows</p>
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

      {/* Cards de Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Workflows Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.active_workflows}</div>
              <div className="text-sm text-gray-600">
                de {analytics.overview.total_workflows} total
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Taxa de Sucesso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.success_rate}%</div>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +2.3% vs mês anterior
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Conteúdo Gerado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.content_generated}</div>
              <div className="text-sm text-gray-600">
                {analytics.overview.posts_published} publicados
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Tempo Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.avg_execution_time}min</div>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                -0.8min vs anterior
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs de Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-3xl grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="errors">Erros</TabsTrigger>
          <TabsTrigger value="optimization">Otimização</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Tendências de Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.performance_trends.map((trend, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 p-3 border rounded-lg">
                      <div>
                        <div className="text-sm text-gray-600">Período</div>
                        <div className="font-semibold">{trend.period}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Execuções</div>
                        <div className="font-semibold">{trend.executions}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Sucesso</div>
                        <div className="font-semibold">{trend.success_rate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Conteúdo</div>
                        <div className="font-semibold">{trend.content_generated}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Engagement Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Engagement Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Total de Visualizações</span>
                    </div>
                    <span className="font-bold">24.5K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Curtidas</span>
                    </div>
                    <span className="font-bold">3.2K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Share className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Compartilhamentos</span>
                    </div>
                    <span className="font-bold">{analytics.overview.social_shares}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Comentários</span>
                    </div>
                    <span className="font-bold">892</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance dos Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.workflow_performance.map((workflow, index) => (
                  <motion.div
                    key={workflow.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{workflow.name}</h4>
                        <Badge className={getStatusColor(workflow.status)}>
                          {workflow.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="block">Execuções</span>
                          <span className="font-semibold text-gray-900">{workflow.executions}</span>
                        </div>
                        <div>
                          <span className="block">Taxa de Sucesso</span>
                          <span className="font-semibold text-gray-900">{workflow.success_rate}%</span>
                        </div>
                        <div>
                          <span className="block">Tempo Médio</span>
                          <span className="font-semibold text-gray-900">{workflow.avg_execution_time}min</span>
                        </div>
                        <div>
                          <span className="block">Engagement</span>
                          <span className="font-semibold text-gray-900">{workflow.engagement_score}%</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Última execução: {formatTime(workflow.last_run)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-6">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analytics.content_metrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="capitalize">
                    {metric.type.replace('_', ' ')} ({metric.count} itens)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Engagement Médio</span>
                        <span className="font-bold">{metric.avg_engagement}%</span>
                      </div>
                      <Progress value={metric.avg_engagement * 5} className="h-2" />
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Top Performers</h5>
                      <div className="space-y-2">
                        {metric.top_performing.map((item, i) => (
                          <div key={i} className="p-2 bg-gray-50 rounded text-sm">
                            <div className="font-medium">{item.title}</div>
                            <div className="flex items-center gap-4 text-gray-600 mt-1">
                              <span>{item.views.toLocaleString()} views</span>
                              <span>{item.engagement}% engagement</span>
                              <span>{item.platform}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Análise de Erros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.error_analysis.map((error, index) => (
                  <div key={index} className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-900">{error.error_type}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 text-sm">
                          <div>
                            <span className="text-red-700">Ocorrências</span>
                            <div className="font-semibold">{error.count}</div>
                          </div>
                          <div>
                            <span className="text-red-700">Porcentagem</span>
                            <div className="font-semibold">{error.percentage}%</div>
                          </div>
                          <div>
                            <span className="text-red-700">Último erro</span>
                            <div className="font-semibold">{formatTime(error.most_recent)}</div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-sm text-red-700">Workflows afetados: </span>
                          <span className="text-sm font-medium">{error.affected_workflows.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Sugestões de Otimização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.optimization_suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{suggestion.title}</h4>
                          <Badge className={getDifficultyColor(suggestion.difficulty)}>
                            {suggestion.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{suggestion.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <span className="text-gray-600">Impacto:</span>
                            <span className={`font-semibold ${getImpactColor(suggestion.impact)}`}>
                              {suggestion.impact}
                            </span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-gray-600">Tipo:</span>
                            <span className="font-semibold capitalize">{suggestion.type}</span>
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-4">
                        Aplicar
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}