'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Target, 
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Settings,
  BarChart3,
  Zap,
  ArrowRight,
  Calendar,
  FileText
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

interface PipelineStats {
  active_workflows: number
  total_posts_generated: number
  success_rate: number
  avg_time_to_publish: number
  pending_approval: number
  scheduled_posts: number
  recent_activity: Array<{
    id: string
    type: 'workflow_started' | 'post_generated' | 'post_published' | 'error'
    message: string
    timestamp: string
    status: 'success' | 'warning' | 'error'
  }>
  workflows: Array<{
    id: string
    name: string
    status: 'active' | 'paused' | 'error'
    last_run: string
    success_rate: number
    posts_generated: number
  }>
}

export function ContentPipelineOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['pipeline-overview'],
    queryFn: async (): Promise<PipelineStats> => {
      // Mock data for now - replace with actual API call
      return {
        active_workflows: 8,
        total_posts_generated: 147,
        success_rate: 92,
        avg_time_to_publish: 45,
        pending_approval: 12,
        scheduled_posts: 34,
        recent_activity: [
          {
            id: '1',
            type: 'post_published',
            message: 'Post "Dicas de investimento" publicado no blog Einsof7',
            timestamp: '2024-01-15T10:30:00Z',
            status: 'success'
          },
          {
            id: '2',
            type: 'workflow_started',
            message: 'Workflow "Conteúdo Semanal" iniciado',
            timestamp: '2024-01-15T09:15:00Z',
            status: 'success'
          },
          {
            id: '3',
            type: 'post_generated',
            message: 'Novo post gerado: "Como economizar dinheiro"',
            timestamp: '2024-01-15T08:45:00Z',
            status: 'success'
          },
          {
            id: '4',
            type: 'error',
            message: 'Erro na sincronização com WordPress',
            timestamp: '2024-01-15T08:20:00Z',
            status: 'error'
          }
        ],
        workflows: [
          {
            id: '1',
            name: 'Conteúdo Semanal Automatizado',
            status: 'active',
            last_run: '2024-01-15T09:15:00Z',
            success_rate: 95,
            posts_generated: 23
          },
          {
            id: '2',
            name: 'Pipeline de Keywords Trending',
            status: 'active',
            last_run: '2024-01-15T07:30:00Z',
            success_rate: 88,
            posts_generated: 18
          },
          {
            id: '3',
            name: 'Reescrita de Conteúdo Antigo',
            status: 'paused',
            last_run: '2024-01-14T15:20:00Z',
            success_rate: 92,
            posts_generated: 12
          }
        ]
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post_published':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'workflow_started':
        return <Play className="h-4 w-4 text-blue-600" />
      case 'post_generated':
        return <FileText className="h-4 w-4 text-purple-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

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

  const formatRelativeTime = (timestamp: string) => {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <BarChart3 className="h-5 w-5" />
                Performance Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-700">Taxa de Sucesso</span>
                    <span className="font-bold text-blue-900">{stats.success_rate}%</span>
                  </div>
                  <Progress value={stats.success_rate} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-600">Posts Gerados</p>
                    <p className="font-bold text-blue-900">{stats.total_posts_generated}</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Tempo Médio</p>
                    <p className="font-bold text-blue-900">{stats.avg_time_to_publish}min</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-900">
                <Zap className="h-5 w-5" />
                Automação Ativa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-900">{stats.active_workflows}</div>
                  <p className="text-sm text-green-700">Workflows rodando</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-green-600">Pendentes</p>
                    <p className="font-bold text-green-900">{stats.pending_approval}</p>
                  </div>
                  <div>
                    <p className="text-green-600">Agendados</p>
                    <p className="font-bold text-green-900">{stats.scheduled_posts}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Target className="h-5 w-5" />
                Próximas Ações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <Play className="h-4 w-4 mr-2" />
                  Executar Workflow
                </Button>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar Automação
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Workflows */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Workflows Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.workflows.map((workflow, index) => (
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
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Taxa: {workflow.success_rate}%</span>
                      <span>Posts: {workflow.posts_generated}</span>
                      <span>Última execução: {formatRelativeTime(workflow.last_run)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {workflow.status === 'active' ? (
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recent_activity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Setup */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-900">
            <Zap className="h-5 w-5" />
            Setup Rápido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
              <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold">Templates Prontos</h4>
                <p className="text-sm text-gray-600">Use templates pré-configurados</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Settings className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold">Configurar n8n</h4>
                <p className="text-sm text-gray-600">Conecte com sua instância</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold">Agendamento</h4>
                <p className="text-sm text-gray-600">Configure publicações automáticas</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}