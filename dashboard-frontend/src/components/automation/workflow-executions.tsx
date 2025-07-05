'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  Activity, 
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Pause,
  RefreshCw,
  Eye,
  Play,
  Search,
  Download,
  Calendar,
  Zap
} from 'lucide-react'
import { useWorkflowExecutions } from '@/hooks/automation'
import { motion } from 'framer-motion'
import { WorkflowExecutionsProps } from '@/types/automation'

export function WorkflowExecutions({ timeframe }: WorkflowExecutionsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [workflowFilter, setWorkflowFilter] = useState('all')
  const [selectedExecution, setSelectedExecution] = useState<string | null>(null)

  const { data: executions, isLoading, refetch, isRefetching } = useWorkflowExecutions({
    timeframe,
    searchTerm,
    statusFilter,
    workflowFilter,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'running':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />
      case 'error':
        return <XCircle className="h-4 w-4" />
      case 'running':
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case 'cancelled':
        return <Pause className="h-4 w-4" />
      case 'waiting':
        return <Clock className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'schedule':
        return <Calendar className="h-4 w-4" />
      case 'webhook':
        return <Zap className="h-4 w-4" />
      case 'manual':
        return <Play className="h-4 w-4" />
      case 'api':
        return <Activity className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    }
    return `${remainingSeconds}s`
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredExecutions = executions?.filter(execution => {
    const matchesSearch = execution.workflow_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         execution.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || execution.status === statusFilter
    const matchesWorkflow = workflowFilter === 'all' || execution.workflow_id === workflowFilter
    return matchesSearch && matchesStatus && matchesWorkflow
  }) || []

  const workflowOptions = Array.from(new Set(executions?.map(e => ({ id: e.workflow_id, name: e.workflow_name })) || []))

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controles e filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar execuções..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="success">Sucesso</SelectItem>
              <SelectItem value="error">Erro</SelectItem>
              <SelectItem value="running">Rodando</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
              <SelectItem value="waiting">Aguardando</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={workflowFilter} onValueChange={setWorkflowFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Workflows</SelectItem>
              {workflowOptions.map((workflow) => (
                <SelectItem key={workflow.id} value={workflow.id}>
                  {workflow.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
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

      {/* Lista de execuções */}
      <div className="space-y-4">
        {filteredExecutions.map((execution, index) => (
          <motion.div
            key={execution.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Activity className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{execution.workflow_name}</h3>
                          <Badge className={getStatusColor(execution.status)}>
                            {getStatusIcon(execution.status)}
                            <span className="ml-1 capitalize">{execution.status}</span>
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            {getTriggerIcon(execution.trigger_type)}
                            <span className="capitalize">{execution.trigger_type}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          ID: <span className="font-mono">{execution.id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progresso: {execution.nodes_executed}/{execution.nodes_total} nodes</span>
                        <span>{Math.round((execution.nodes_executed / execution.nodes_total) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(execution.nodes_executed / execution.nodes_total) * 100} 
                        className="h-2"
                      />
                    </div>

                    {/* Métricas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Iniciado</div>
                        <div className="font-semibold text-sm">{formatTime(execution.started_at)}</div>
                      </div>
                      {execution.finished_at && (
                        <div>
                          <div className="text-sm text-gray-600">Finalizado</div>
                          <div className="font-semibold text-sm">{formatTime(execution.finished_at)}</div>
                        </div>
                      )}
                      {execution.duration && (
                        <div>
                          <div className="text-sm text-gray-600">Duração</div>
                          <div className="font-semibold text-sm">{formatDuration(execution.duration)}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-gray-600">Nodes Status</div>
                        <div className="font-semibold text-sm">
                          <span className="text-green-600">{execution.success_nodes}</span>
                          {execution.error_nodes > 0 && (
                            <span> / <span className="text-red-600">{execution.error_nodes}</span></span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Error message */}
                    {execution.error_message && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-800">
                          <AlertCircle className="h-4 w-4" />
                          <span className="font-medium">Erro:</span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">{execution.error_message}</p>
                      </div>
                    )}

                    {/* Execution details */}
                    {selectedExecution === execution.id && execution.execution_data && (
                      <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                        <h4 className="font-medium">Detalhes da Execução:</h4>
                        <div className="space-y-2">
                          {execution.execution_data.map((node, nodeIndex) => (
                            <div key={nodeIndex} className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${
                                  node.status === 'success' ? 'bg-green-500' : 
                                  node.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                                }`} />
                                <span className="font-medium text-sm">{String(node.node_name || '')}</span>
                                {Boolean(node.error) && (
                                  <Badge className="bg-red-100 text-red-800 text-xs">
                                    {String(node.error)}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-600">
                                {String(node.execution_time || 0)}s
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-6">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedExecution(
                        selectedExecution === execution.id ? null : execution.id
                      )}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      {selectedExecution === execution.id ? 'Ocultar' : 'Detalhes'}
                    </Button>
                    
                    {execution.status === 'running' && (
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Pause className="h-4 w-4" />
                        Parar
                      </Button>
                    )}
                    
                    {(execution.status === 'error' || execution.status === 'cancelled') && (
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Play className="h-4 w-4" />
                        Re-executar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Nenhum resultado */}
      {filteredExecutions.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma execução encontrada</h3>
              <p className="text-gray-600">
                Execute um workflow ou ajuste os filtros de busca
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}