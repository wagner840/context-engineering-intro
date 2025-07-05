"use client";

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Zap, 
  Play, 
  RefreshCw,
  Settings,
  Plus,
  Copy,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Globe,
  Target,
  BarChart3,
  ExternalLink
} from 'lucide-react'
import { N8nWorkflowManager } from '@/components/automation/n8n-workflow-manager'
import { AutomationTemplates } from '@/components/automation/automation-templates'
import { WorkflowExecutions } from '@/components/automation/workflow-executions'
import { TriggerManager } from '@/components/automation/trigger-manager';
import { IntegrationSettings } from '@/components/automation/integration-settings';
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

interface AutomationOverview {
  total_workflows: number
  active_workflows: number
  total_executions: number
  successful_executions: number
  failed_executions: number
  avg_execution_time: number
  uptime_percentage: number
  integrations_connected: number
  n8n_status: 'online' | 'offline' | 'degraded'
  recent_activity: Array<{
    id: string
    type: 'workflow_created' | 'workflow_executed' | 'workflow_failed' | 'integration_added'
    message: string
    timestamp: string
    workflow_name?: string
    status: 'success' | 'warning' | 'error'
  }>
}

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedTimeframe, setSelectedTimeframe] = useState('last_7_days')

  const { data: overview, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['automation-overview', selectedTimeframe],
    queryFn: async (): Promise<AutomationOverview> => {
      // Mock data for now - replace with actual n8n API calls
      return {
        total_workflows: 24,
        active_workflows: 18,
        total_executions: 1456,
        successful_executions: 1342,
        failed_executions: 114,
        avg_execution_time: 3.2,
        uptime_percentage: 99.7,
        integrations_connected: 12,
        n8n_status: 'online',
        recent_activity: [
          {
            id: '1',
            type: 'workflow_executed',
            message: 'Workflow "Geração de Conteúdo Automática" executado com sucesso',
            timestamp: '2024-01-15T10:30:00Z',
            workflow_name: 'Geração de Conteúdo Automática',
            status: 'success'
          },
          {
            id: '2',
            type: 'workflow_failed',
            message: 'Falha na execução do workflow "Sincronização WordPress"',
            timestamp: '2024-01-15T09:45:00Z',
            workflow_name: 'Sincronização WordPress',
            status: 'error'
          },
          {
            id: '3',
            type: 'workflow_created',
            message: 'Novo workflow "Newsletter Automática" criado',
            timestamp: '2024-01-15T08:20:00Z',
            workflow_name: 'Newsletter Automática',
            status: 'success'
          },
          {
            id: '4',
            type: 'integration_added',
            message: 'Integração com Slack configurada',
            timestamp: '2024-01-14T16:15:00Z',
            status: 'success'
          }
        ]
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800'
      case 'offline':
        return 'bg-red-100 text-red-800'
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'workflow_executed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'workflow_failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'workflow_created':
        return <Plus className="h-4 w-4 text-blue-600" />
      case 'integration_added':
        return <Globe className="h-4 w-4 text-purple-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
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
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Zap className="h-8 w-8 text-blue-600" />
              Automação & n8n
            </h1>
            <p className="text-gray-600">
              Gerencie workflows, integrações e automações do seu sistema de conteúdo
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(overview?.n8n_status || 'offline')}>
              <Activity className="h-3 w-3 mr-1" />
              n8n {overview?.n8n_status || 'offline'}
            </Badge>
            
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_24_hours">Últimas 24h</SelectItem>
                <SelectItem value="last_7_days">Últimos 7 dias</SelectItem>
                <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
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
            
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Workflow
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-blue-600" />
                Workflows Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.active_workflows}</div>
              <div className="text-xs text-gray-600 mt-1">
                de {overview?.total_workflows} total
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-green-600" />
                Taxa de Sucesso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview ? Math.round((overview.successful_executions / overview.total_executions) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {overview?.successful_executions} de {overview?.total_executions} execuções
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-purple-600" />
                Tempo Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.avg_execution_time}s</div>
              <div className="text-xs text-gray-600 mt-1">
                Por execução
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-orange-600" />
                Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.uptime_percentage}%</div>
              <div className="text-xs text-gray-600 mt-1">
                {overview?.integrations_connected} integrações ativas
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-4xl grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Workflows
            </TabsTrigger>
            <TabsTrigger value="executions" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Execuções
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="triggers" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Triggers
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status do sistema */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Status do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium">Execuções Bem-sucedidas</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {overview?.successful_executions}
                        </div>
                        <Progress 
                          value={overview ? (overview.successful_executions / overview.total_executions) * 100 : 0} 
                          className="mt-2 h-2"
                        />
                      </div>

                      <div className="p-4 bg-red-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="h-5 w-5 text-red-600" />
                          <span className="font-medium">Execuções Falhadas</span>
                        </div>
                        <div className="text-2xl font-bold text-red-600">
                          {overview?.failed_executions}
                        </div>
                        <Progress 
                          value={overview ? (overview.failed_executions / overview.total_executions) * 100 : 0} 
                          className="mt-2 h-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold">{overview?.total_executions}</div>
                        <div className="text-sm text-gray-600">Total de Execuções</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{overview?.avg_execution_time}s</div>
                        <div className="text-sm text-gray-600">Tempo Médio</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{overview?.uptime_percentage}%</div>
                        <div className="text-sm text-gray-600">Uptime</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Atividade recente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overview?.recent_activity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      <div className="mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTime(activity.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflows">
          <N8nWorkflowManager timeframe={selectedTimeframe} />
        </TabsContent>

        <TabsContent value="executions">
          <WorkflowExecutions timeframe={selectedTimeframe} />
        </TabsContent>

        <TabsContent value="templates">
          <AutomationTemplates />
        </TabsContent>

        <TabsContent value="triggers">
          <TriggerManager />
        </TabsContent>

        <TabsContent value="settings">
          <IntegrationSettings />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Automação Inteligente</h3>
            <p className="text-blue-700 text-sm">
              Conecte seu WordPress, Supabase, OpenAI e outras ferramentas para criar fluxos automatizados
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Abrir n8n
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Criar Automação
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
