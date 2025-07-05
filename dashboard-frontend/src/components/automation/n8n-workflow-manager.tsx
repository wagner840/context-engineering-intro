'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Zap, 
  Play, 
  Pause,
  Settings,
  Edit,
  Copy,
  Trash2,
  Eye,
  Plus,
  Search,
  RefreshCw,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { useWorkflows } from '@/hooks/automation'
import { motion } from 'framer-motion'
import { N8nWorkflowManagerProps } from '@/types/automation'

export function N8nWorkflowManager({ timeframe }: N8nWorkflowManagerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('updated_at')

  const { data: workflows, isLoading, refetch, isRefetching } = useWorkflows({
    timeframe,
    searchTerm,
    filterStatus,
    sortBy,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800'
      case 'stopped':
        return 'bg-gray-100 text-gray-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="h-4 w-4" />
      case 'stopped':
        return <Pause className="h-4 w-4" />
      case 'error':
        return <XCircle className="h-4 w-4" />
      case 'paused':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'schedule':
        return <Clock className="h-4 w-4" />
      case 'webhook':
        return <Zap className="h-4 w-4" />
      case 'manual':
        return <Play className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredWorkflows = workflows?.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || workflow.status === filterStatus
    return matchesSearch && matchesStatus
  }) || []

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
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
              placeholder="Buscar workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="running">Rodando</SelectItem>
              <SelectItem value="stopped">Parado</SelectItem>
              <SelectItem value="error">Com Erro</SelectItem>
              <SelectItem value="paused">Pausado</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated_at">Última Atualização</SelectItem>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="execution_count">Execuções</SelectItem>
              <SelectItem value="success_rate">Taxa de Sucesso</SelectItem>
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
          
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Workflow
          </Button>
        </div>
      </div>

      {/* Lista de workflows */}
      <div className="space-y-4">
        {filteredWorkflows.map((workflow, index) => (
          <motion.div
            key={workflow.id}
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
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Zap className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{workflow.name}</h3>
                          <Badge className={getStatusColor(workflow.status)}>
                            {getStatusIcon(workflow.status)}
                            <span className="ml-1 capitalize">{workflow.status}</span>
                          </Badge>
                          {workflow.active && (
                            <Badge className="bg-green-100 text-green-800">
                              Ativo
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{workflow.description}</p>
                      </div>
                    </div>

                    {/* Métricas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Execuções</div>
                        <div className="font-semibold">{workflow.execution_count}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Taxa de Sucesso</div>
                        <div className="font-semibold">{workflow.success_rate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Tempo Médio</div>
                        <div className="font-semibold">{workflow.avg_execution_time}s</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Nodes/Conexões</div>
                        <div className="font-semibold">{workflow.nodes_count}/{workflow.connections_count}</div>
                      </div>
                    </div>

                    {/* Trigger info */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getTriggerIcon(workflow.trigger_type)}
                        <span className="text-sm text-gray-600 capitalize">
                          Trigger: {workflow.trigger_type}
                        </span>
                      </div>
                      
                      {workflow.schedule && (
                        <div className="text-sm text-gray-600">
                          Agendamento: {workflow.schedule}
                        </div>
                      )}
                      
                      {workflow.webhook_url && (
                        <div className="text-sm text-gray-600">
                          Webhook configurado
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2">
                      {workflow.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Datas */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Criado: {formatDate(workflow.created_at)}</span>
                      <span>Atualizado: {formatDate(workflow.updated_at)}</span>
                      {workflow.last_execution && (
                        <span>Última execução: {formatDate(workflow.last_execution)}</span>
                      )}
                    </div>
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
                    
                    {workflow.active ? (
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Pause className="h-4 w-4" />
                        Pausar
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Play className="h-4 w-4" />
                        Ativar
                      </Button>
                    )}
                    
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Play className="h-4 w-4" />
                      Executar
                    </Button>
                    
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Copy className="h-4 w-4" />
                      Duplicar
                    </Button>
                    
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <ExternalLink className="h-4 w-4" />
                      Abrir n8n
                    </Button>
                    
                    <Button variant="outline" size="sm" className="flex items-center gap-1 text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                      Deletar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Nenhum resultado */}
      {filteredWorkflows.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Zap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Nenhum workflow encontrado</h3>
              <p className="text-gray-600">
                Crie seu primeiro workflow ou ajuste os filtros de busca
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}