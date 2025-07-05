'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Trash2, 
  Settings, 
  Play, 
  Save,
  Copy,
  ArrowDown,
  Zap,
  Globe,
  Brain,
  FileText,
  Clock,
  Filter,
  Send
} from 'lucide-react'
import { useWorkflows, useCreateWorkflow, useUpdateWorkflow } from '@/hooks/use-automation'
import { N8nWorkflow, N8nNode, N8nConnection } from '@/types/n8n'
import { Loading } from '@/components/ui/loading'
import { motion } from 'framer-motion'

interface WorkflowNode extends N8nNode {
  config: Record<string, unknown>
}

interface Workflow extends N8nWorkflow {
  description: string
  trigger_type: 'schedule' | 'webhook' | 'manual'
  nodes: WorkflowNode[]
  connections: N8nConnection
}

export function WorkflowBuilder() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<N8nWorkflow | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const { data: workflows, isLoading } = useWorkflows()
  const createWorkflow = useCreateWorkflow()
  const updateWorkflow = useUpdateWorkflow()

  const nodeTypes = [
    {
      type: 'trigger',
      name: 'Trigger',
      icon: <Zap className="h-4 w-4" />,
      color: 'bg-blue-100 text-blue-800',
      description: 'Inicia o workflow'
    },
    {
      type: 'ai',
      name: 'IA Generator',
      icon: <Brain className="h-4 w-4" />,
      color: 'bg-purple-100 text-purple-800',
      description: 'Gera conteúdo com IA'
    },
    {
      type: 'wordpress',
      name: 'WordPress',
      icon: <Globe className="h-4 w-4" />,
      color: 'bg-green-100 text-green-800',
      description: 'Publica no WordPress'
    },
    {
      type: 'condition',
      name: 'Condição',
      icon: <Filter className="h-4 w-4" />,
      color: 'bg-yellow-100 text-yellow-800',
      description: 'Lógica condicional'
    },
    {
      type: 'delay',
      name: 'Delay',
      icon: <Clock className="h-4 w-4" />,
      color: 'bg-gray-100 text-gray-800',
      description: 'Aguarda um tempo'
    },
    {
      type: 'action',
      name: 'Ação',
      icon: <Send className="h-4 w-4" />,
      color: 'bg-orange-100 text-orange-800',
      description: 'Executa uma ação'
    }
  ]

  const createNewWorkflow = () => {
    const newWorkflow: Workflow = {
      name: 'Novo Workflow',
      description: '',
      active: false,
      trigger_type: 'manual',
      nodes: [],
      connections: [],
      id: '',
      createdAt: '',
      updatedAt: '',
      versionId: '',
      settings: {},
      tags: [],
    }
    setSelectedWorkflow(newWorkflow)
    setIsEditing(true)
  }

  const addNode = (type: string) => {
    if (!selectedWorkflow) return

    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type: type,
      typeVersion: 1,
      name: nodeTypes.find(nt => nt.type === type)?.name || 'Node',
      parameters: {},
      position: [100, 100],
      config: {},
    }

    setSelectedWorkflow({
      ...selectedWorkflow,
      nodes: [...selectedWorkflow.nodes, newNode]
    })
  }

  const removeNode = (nodeId: string) => {
    if (!selectedWorkflow) return;

    const newNodes = selectedWorkflow.nodes.filter((n) => n.id !== nodeId);
    const newNodeIds = newNodes.map((n) => n.id);
    const newConnections = selectedWorkflow.connections.filter(
      (c) => newNodeIds.includes(c.from) && newNodeIds.includes(c.to)
    );

    setSelectedWorkflow({
      ...selectedWorkflow,
      nodes: newNodes,
      connections: newConnections,
    });
  };

  const saveWorkflow = async () => {
    if (!selectedWorkflow) return

    try {
      if (selectedWorkflow.id) {
        await updateWorkflow.mutateAsync({
          id: selectedWorkflow.id,
          data: selectedWorkflow
        })
      } else {
        await createWorkflow.mutateAsync(selectedWorkflow)
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao salvar workflow:', error)
    }
  }

  const getNodeIcon = (type: string) => {
    return nodeTypes.find(nt => nt.type === type)?.icon || <FileText className="h-4 w-4" />
  }

  const getNodeColor = (type: string) => {
    return nodeTypes.find(nt => nt.type === type)?.color || 'bg-gray-100 text-gray-800'
  }
  
  if (isLoading) {
    return <Loading text="Carregando workflows..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Construtor de Workflows</h2>
          <p className="text-gray-600">Crie e gerencie workflows de automação</p>
        </div>
        <Button onClick={createNewWorkflow} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Workflows List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workflows?.map((workflow) => (
                  <div
                    key={workflow.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedWorkflow?.id === workflow.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedWorkflow(workflow)
                      setIsEditing(false)
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{workflow.name}</h4>
                      <Badge className={workflow.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {workflow.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{(workflow as any).description || 'Workflow description'}</p>
                  </div>
                ))}

                {(!workflows || workflows.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Nenhum workflow criado</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Editor */}
        <div className="lg:col-span-3">
          {selectedWorkflow ? (
            <Tabs defaultValue="design" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="config">Configuração</TabsTrigger>
                  <TabsTrigger value="test">Teste</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    {isEditing ? 'Cancelar' : 'Editar'}
                  </Button>
                  
                  {isEditing && (
                    <Button
                      onClick={saveWorkflow}
                      disabled={createWorkflow.isPending || updateWorkflow.isPending}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Salvar
                    </Button>
                  )}
                  
                  <Button variant="outline" className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Executar
                  </Button>
                </div>
              </div>

              <TabsContent value="design">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                  {/* Node Palette */}
                  {isEditing && (
                    <div className="xl:col-span-1">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Componentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {nodeTypes.map((nodeType) => (
                              <Button
                                key={nodeType.type}
                                variant="outline"
                                className="w-full justify-start h-auto p-3"
                                onClick={() => addNode(nodeType.type)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded ${nodeType.color}`}>
                                    {nodeType.icon}
                                  </div>
                                  <div className="text-left">
                                    <div className="font-medium text-sm">{nodeType.name}</div>
                                    <div className="text-xs text-gray-500">{nodeType.description}</div>
                                  </div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Canvas */}
                  <div className={isEditing ? 'xl:col-span-3' : 'xl:col-span-4'}>
                    <Card className="h-96">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{selectedWorkflow.name}</span>
                          <Badge className={selectedWorkflow.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {selectedWorkflow.active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="h-full">
                        <div className="relative h-full bg-gray-50 rounded-lg overflow-hidden">
                          {selectedWorkflow.nodes.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                              <div className="text-center">
                                <Zap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-600">
                                  {isEditing ? 'Arraste componentes para começar' : 'Workflow vazio'}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 space-y-4">
                              {selectedWorkflow.nodes.map((node, index) => (
                                <motion.div
                                  key={node.id}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="flex items-center gap-4"
                                >
                                  <div className={`p-4 rounded-lg border-2 border-dashed ${getNodeColor(node.type)} min-w-[200px]`}>
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        {getNodeIcon(node.type)}
                                        <span className="font-medium">{node.name}</span>
                                      </div>
                                      {isEditing && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeNode(node.id)}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {nodeTypes.find(nt => nt.type === node.type)?.description}
                                    </div>
                                  </div>
                                  
                                  {index < selectedWorkflow.nodes.length - 1 && (
                                    <ArrowDown className="h-5 w-5 text-gray-400" />
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="config">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações do Workflow</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="workflow-name">Nome</Label>
                        <Input
                          id="workflow-name"
                          value={selectedWorkflow.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedWorkflow({
                            ...selectedWorkflow,
                            name: e.target.value
                          })}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="trigger-type">Tipo de Trigger</Label>
                        <Select
                          value={(selectedWorkflow as any).trigger_type || 'manual'}
                          onValueChange={(value: 'schedule' | 'webhook' | 'manual') => setSelectedWorkflow({
                            ...selectedWorkflow,
                            ...(selectedWorkflow as any),
                            trigger_type: value
                          } as any)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="schedule">Agendado</SelectItem>
                            <SelectItem value="webhook">Webhook</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="workflow-description">Descrição</Label>
                      <Textarea
                        id="workflow-description"
                        value={(selectedWorkflow as any).description || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSelectedWorkflow({
                          ...selectedWorkflow,
                          ...(selectedWorkflow as any),
                          description: e.target.value
                        } as any)}
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="workflow-active"
                        checked={selectedWorkflow.active}
                        onCheckedChange={(checked: boolean) => setSelectedWorkflow({
                          ...selectedWorkflow,
                          active: checked
                        })}
                        disabled={!isEditing}
                      />
                      <Label htmlFor="workflow-active">Workflow ativo</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="test">
                <Card>
                  <CardHeader>
                    <CardTitle>Testar Workflow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Execute o workflow em modo de teste para verificar se tudo está funcionando corretamente.
                      </p>
                      
                      <div className="flex gap-3">
                        <Button className="flex items-center gap-2">
                          <Play className="h-4 w-4" />
                          Executar Teste
                        </Button>
                        
                        <Button variant="outline" className="flex items-center gap-2">
                          <Copy className="h-4 w-4" />
                          Duplicar Workflow
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Selecione um Workflow</h3>
                  <p className="text-gray-600">
                    Escolha um workflow da lista ou crie um novo para começar
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}