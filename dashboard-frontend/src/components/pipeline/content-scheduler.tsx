'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  Clock, 
  Play, 
  Pause,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  Globe,
  Users,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  Eye,
  TrendingUp
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

interface ScheduledItem {
  id: string
  title: string
  content_type: 'post' | 'social_media' | 'newsletter'
  blog_name: string
  scheduled_time: string
  status: 'scheduled' | 'publishing' | 'published' | 'failed' | 'paused'
  platforms: string[]
  workflow_id?: string
  workflow_name?: string
  estimated_duration: number
  author: string
  tags: string[]
  priority: 'high' | 'medium' | 'low'
  auto_generated: boolean
}

interface SchedulerStats {
  total_scheduled: number
  publishing_today: number
  failed_last_week: number
  success_rate: number
  best_performing_time: string
  upcoming_peaks: Array<{
    time: string
    count: number
  }>
}

export function ContentScheduler() {
  const [activeTab, setActiveTab] = useState('calendar')
  const [selectedTimeframe, setSelectedTimeframe] = useState('week')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: scheduledItems, isLoading } = useQuery({
    queryKey: ['scheduled-content'],
    queryFn: async (): Promise<ScheduledItem[]> => {
      // Mock data for now - replace with actual API call
      return [
        {
          id: 'sched-1',
          title: 'Como investir em renda fixa: Guia completo 2024',
          content_type: 'post',
          blog_name: 'Einsof7 Finance',
          scheduled_time: '2024-01-16T09:00:00Z',
          status: 'scheduled',
          platforms: ['WordPress', 'LinkedIn', 'Twitter'],
          workflow_id: 'wf-1',
          workflow_name: 'Conteúdo Financeiro Automático',
          estimated_duration: 5,
          author: 'IA Generator',
          tags: ['investimento', 'renda fixa', 'finanças'],
          priority: 'high',
          auto_generated: true
        },
        {
          id: 'sched-2',
          title: 'Receitas saudáveis para o café da manhã',
          content_type: 'post',
          blog_name: 'Vida Saudável Blog',
          scheduled_time: '2024-01-16T14:30:00Z',
          status: 'scheduled',
          platforms: ['WordPress', 'Instagram', 'Facebook'],
          workflow_id: 'wf-2',
          workflow_name: 'Pipeline de Receitas',
          estimated_duration: 3,
          author: 'Maria Silva',
          tags: ['receitas', 'café da manhã', 'saudável'],
          priority: 'medium',
          auto_generated: false
        },
        {
          id: 'sched-3',
          title: 'Newsletter Semanal - Tendências do Mercado',
          content_type: 'newsletter',
          blog_name: 'Market Insights',
          scheduled_time: '2024-01-17T08:00:00Z',
          status: 'scheduled',
          platforms: ['Email'],
          estimated_duration: 2,
          author: 'IA Generator',
          tags: ['newsletter', 'mercado', 'tendências'],
          priority: 'high',
          auto_generated: true
        },
        {
          id: 'sched-4',
          title: 'Dicas de produtividade para home office',
          content_type: 'social_media',
          blog_name: 'Produtividade Pro',
          scheduled_time: '2024-01-16T16:00:00Z',
          status: 'publishing',
          platforms: ['LinkedIn', 'Twitter'],
          workflow_id: 'wf-3',
          workflow_name: 'Social Media Automation',
          estimated_duration: 1,
          author: 'João Santos',
          tags: ['produtividade', 'home office'],
          priority: 'medium',
          auto_generated: true
        },
        {
          id: 'sched-5',
          title: 'Análise técnica: Bitcoin vs Ethereum',
          content_type: 'post',
          blog_name: 'Crypto Insights',
          scheduled_time: '2024-01-15T10:30:00Z',
          status: 'published',
          platforms: ['WordPress', 'Medium', 'Twitter'],
          estimated_duration: 4,
          author: 'IA Generator',
          tags: ['bitcoin', 'ethereum', 'análise técnica'],
          priority: 'high',
          auto_generated: true
        },
        {
          id: 'sched-6',
          title: 'Tutorial: Como configurar seu workspace',
          content_type: 'post',
          blog_name: 'Tech Tips',
          scheduled_time: '2024-01-15T15:20:00Z',
          status: 'failed',
          platforms: ['WordPress'],
          workflow_id: 'wf-4',
          workflow_name: 'Content Publishing',
          estimated_duration: 6,
          author: 'Ana Costa',
          tags: ['tutorial', 'workspace', 'configuração'],
          priority: 'low',
          auto_generated: false
        }
      ]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['scheduler-stats'],
    queryFn: async (): Promise<SchedulerStats> => {
      // Mock data for now
      return {
        total_scheduled: 23,
        publishing_today: 8,
        failed_last_week: 2,
        success_rate: 94.5,
        best_performing_time: '09:00',
        upcoming_peaks: [
          { time: '09:00', count: 5 },
          { time: '14:00', count: 3 },
          { time: '16:00', count: 4 }
        ]
      }
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'publishing':
        return 'bg-yellow-100 text-yellow-800'
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'paused':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4" />
      case 'publishing':
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case 'published':
        return <CheckCircle className="h-4 w-4" />
      case 'failed':
        return <AlertCircle className="h-4 w-4" />
      case 'paused':
        return <Pause className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <Calendar className="h-4 w-4" />
      case 'social_media':
        return <Globe className="h-4 w-4" />
      case 'newsletter':
        return <Users className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const formatScheduledTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 24 && diffHours > 0) {
      return `Em ${diffHours}h`
    } else if (diffHours < 0) {
      return date.toLocaleDateString('pt-BR')
    }
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  const filteredItems = scheduledItems?.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.blog_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesStatus
  }) || []

  if (isLoading || statsLoading) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Agendador de Conteúdo</h2>
          <p className="text-gray-600">Gerencie publicações automáticas e agendamentos inteligentes</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hoje</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Agendar Conteúdo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-blue-600" />
                Total Agendado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_scheduled}</div>
              <p className="text-xs text-gray-600">Próximos 30 dias</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Publicando Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.publishing_today}</div>
              <p className="text-xs text-gray-600">Entre agendados e automáticos</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                Taxa de Sucesso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.success_rate}%</div>
              <p className="text-xs text-gray-600">Últimos 30 dias</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-orange-600" />
                Melhor Horário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.best_performing_time}</div>
              <p className="text-xs text-gray-600">Baseado em engagement</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
          <TabsTrigger value="queue">Fila de Publicação</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-3">
            <Input
              placeholder="Buscar por título, blog ou tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="scheduled">Agendado</SelectItem>
                <SelectItem value="publishing">Publicando</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
                <SelectItem value="paused">Pausado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scheduled Items List */}
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getContentTypeIcon(item.content_type)}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <span>{item.blog_name}</span>
                              <span>•</span>
                              <span>{item.author}</span>
                              {item.auto_generated && (
                                <>
                                  <span>•</span>
                                  <Badge variant="outline" className="text-xs">
                                    Auto-gerado
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status and Timing */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(item.status)}>
                              {getStatusIcon(item.status)}
                              <span className="ml-1 capitalize">{item.status}</span>
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{formatScheduledTime(item.scheduled_time)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className={getPriorityColor(item.priority)}>
                              ● {item.priority}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>~{item.estimated_duration}min</span>
                          </div>
                        </div>

                        {/* Platforms */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Plataformas:</span>
                          <div className="flex gap-1">
                            {item.platforms.map((platform) => (
                              <Badge key={platform} variant="outline" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs bg-gray-50">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Workflow Info */}
                        {item.workflow_name && (
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <Settings className="h-4 w-4" />
                            <span>Workflow: {item.workflow_name}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 ml-6">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          Visualizar
                        </Button>
                        
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Edit className="h-4 w-4" />
                          Editar
                        </Button>
                        
                        {item.status === 'scheduled' && (
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Pause className="h-4 w-4" />
                            Pausar
                          </Button>
                        )}
                        
                        {(item.status === 'failed' || item.status === 'paused') && (
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Play className="h-4 w-4" />
                            Executar
                          </Button>
                        )}
                        
                        <Button variant="outline" size="sm" className="flex items-center gap-1 text-red-600">
                          <Trash2 className="h-4 w-4" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredItems.length === 0 && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum item agendado</h3>
                  <p className="text-gray-600">
                    Comece agendando seu primeiro conteúdo ou ajuste os filtros
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fila de Publicação em Tempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.upcoming_peaks.map((peak, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-semibold">{peak.time}</div>
                        <div className="text-sm text-gray-600">{peak.count} publicações agendadas</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics do Agendador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Performance por Horário</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">09:00 - 12:00</span>
                      <span className="font-semibold">95% sucesso</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">12:00 - 15:00</span>
                      <span className="font-semibold">88% sucesso</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">15:00 - 18:00</span>
                      <span className="font-semibold">92% sucesso</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Tipos de Conteúdo</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Posts</span>
                      <span className="font-semibold">67%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Social Media</span>
                      <span className="font-semibold">25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Newsletters</span>
                      <span className="font-semibold">8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}