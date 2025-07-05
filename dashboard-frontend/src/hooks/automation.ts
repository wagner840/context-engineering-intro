// hooks/automation.ts
// Hooks padronizados para integração com n8n e Supabase

import { useQuery } from '@tanstack/react-query'

//-----------------------------------------------------------------------------//
// Variáveis de ambiente necessárias                                           //
//-----------------------------------------------------------------------------//
const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_BASE_URL
const N8N_API_KEY = process.env.NEXT_PUBLIC_N8N_API_KEY

if (typeof window !== 'undefined') {
  if (!N8N_BASE_URL || !N8N_API_KEY) {
    // eslint-disable-next-line no-console
    console.warn('[automation hooks] NEXT_PUBLIC_N8N_BASE_URL ou NEXT_PUBLIC_N8N_API_KEY não definidos.')
  }
}

//-----------------------------------------------------------------------------//
// Tipos compartilhados                                                        //
//-----------------------------------------------------------------------------//
export interface Workflow {
  id: string
  name: string
  active: boolean
  tags: string[]
  created_at: string
  updated_at: string
  last_execution: string | null
  execution_count: number
  success_rate: number
  avg_execution_time: number
  nodes_count: number
  connections_count: number
  trigger_type: string
  webhook_url?: string
  schedule?: string
  description: string
  status: 'running' | 'stopped' | 'error' | 'paused'
}

export interface WorkflowExecution {
  id: string
  workflow_id: string
  workflow_name: string
  status: 'running' | 'success' | 'error' | 'cancelled' | 'waiting'
  started_at: string
  finished_at?: string
  duration?: number
  trigger_type: 'manual' | 'schedule' | 'webhook' | 'api'
  trigger_data?: Record<string, unknown>
  nodes_executed: number
  nodes_total: number
  success_nodes: number
  error_nodes: number
  error_message?: string
  execution_data?: Record<string, unknown>[]
}

export interface AutomationTemplate {
  id: string
  name: string
  description: string
  category: string
  difficulty: string
  estimated_setup_time: number
  usage_count: number
  rating: number
  is_featured: boolean
  is_premium: boolean
  tags: string[]
  integrations: string[]
  triggers: string[]
  actions: string[]
  template_data: Record<string, unknown>
  author: string
  created_at: string
  updated_at: string
}

//-----------------------------------------------------------------------------//
// Helper genérico para chamadas ao n8n                                        //
//-----------------------------------------------------------------------------//
async function n8nFetch<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${N8N_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': N8N_API_KEY ?? '',
    },
    cache: 'no-store',
    ...init,
  })

  if (!res.ok) {
    throw new Error(`n8n API error: ${res.status}`)
  }

  return res.json() as Promise<T>
}

//-----------------------------------------------------------------------------//
// Hook: Workflows                                                             //
//-----------------------------------------------------------------------------//
export function useWorkflows(params: {
  timeframe: string
  searchTerm: string
  filterStatus: string
  sortBy: string
}) {
  const { timeframe, searchTerm, filterStatus, sortBy } = params

  return useQuery({
    queryKey: ['n8n-workflows', timeframe, searchTerm, filterStatus, sortBy],
    queryFn: async (): Promise<Workflow[]> => {
      const data = await n8nFetch<Record<string, unknown>[]>('/rest/workflows')
      // Mapeamento simplificado; ajuste conforme schema real da sua instância
      const mapped: Workflow[] = data.map((wf) => ({
        id: String(wf.id),
        name: wf.name as string,
        active: wf.active as boolean,
        tags: wf.tags as string[] ?? [],
        created_at: wf.createdAt as string ?? wf.created_at as string,
        updated_at: wf.updatedAt as string ?? wf.updated_at as string,
        last_execution: (wf.lastExecution as { finished: string })?.finished ?? null,
        execution_count: wf.executionCount as number ?? 0,
        success_rate: wf.successRate as number ?? 0,
        avg_execution_time: wf.avgExecutionTime as number ?? 0,
        nodes_count: (wf.nodes as [])?.length ?? 0,
        connections_count: (wf.connections as [])?.length ?? 0,
        trigger_type: (wf.trigger as { type: string })?.type ?? 'manual',
        schedule: (wf.trigger as { cron: string })?.cron,
        webhook_url: (wf.trigger as { webhookUrl: string })?.webhookUrl,
        description: wf.description as string ?? '',
        status: wf.state as 'running' | 'stopped' | 'error' | 'paused' ?? 'stopped',
      }))

      // Filtro + ordenação client-side
      const filtered = mapped.filter((w) => {
        const matchesSearch =
          !searchTerm ||
          w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesStatus = filterStatus === 'all' || w.status === filterStatus
        return matchesSearch && matchesStatus
      })

      const sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name)
          case 'execution_count':
            return b.execution_count - a.execution_count
          case 'success_rate':
            return b.success_rate - a.success_rate
          case 'updated_at':
          default:
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        }
      })

      return sorted
    },
    staleTime: 2 * 60 * 1000,
  })
}

//-----------------------------------------------------------------------------//
// Hook: Execuções                                                             //
//-----------------------------------------------------------------------------//
export function useWorkflowExecutions(params: {
  timeframe: string
  searchTerm: string
  statusFilter: string
  workflowFilter: string
}) {
  const { timeframe, searchTerm, statusFilter, workflowFilter } = params

  return useQuery({
    queryKey: ['workflow-executions', timeframe, searchTerm, statusFilter, workflowFilter],
    queryFn: async (): Promise<WorkflowExecution[]> => {
      const data = await n8nFetch<Record<string, unknown>[]>('/rest/executions')
      const mapped: WorkflowExecution[] = data.map((exec) => ({
        id: String(exec.id),
        workflow_id: String(exec.workflowId),
        workflow_name: exec.workflowName as string,
        status: exec.status as 'running' | 'success' | 'error' | 'cancelled' | 'waiting',
        started_at: exec.startedAt as string,
        finished_at: exec.finishedAt as string,
        duration: exec.duration as number,
        trigger_type: exec.triggerType as 'manual' | 'schedule' | 'webhook' | 'api' ?? 'manual',
        nodes_executed: exec.nodesExecuted as number ?? 0,
        nodes_total: exec.nodesTotal as number ?? 0,
        success_nodes: exec.successNodes as number ?? 0,
        error_nodes: exec.errorNodes as number ?? 0,
        error_message: exec.errorMessage as string,
        execution_data: exec.executionData as Record<string, unknown>[] ?? [],
      }))

      const filtered = mapped.filter((e) => {
        const matchesSearch =
          !searchTerm ||
          e.workflow_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.id.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || e.status === statusFilter
        const matchesWorkflow = workflowFilter === 'all' || e.workflow_id === workflowFilter
        return matchesSearch && matchesStatus && matchesWorkflow
      })

      return filtered
    },
    staleTime: 2 * 60 * 1000,
  })
}

//-----------------------------------------------------------------------------//
// Hook: Templates (Supabase)                                                  //
//-----------------------------------------------------------------------------//
export function useAutomationTemplates(params: {
  searchTerm: string
  selectedCategory: string
  selectedDifficulty: string
  sortBy: string
}) {
  const { searchTerm, selectedCategory, selectedDifficulty, sortBy } = params

  return useQuery({
    queryKey: ['automation-templates', searchTerm, selectedCategory, selectedDifficulty, sortBy],
    queryFn: async (): Promise<AutomationTemplate[]> => {
      // Busca templates diretamente da API do n8n (ex: /rest/marketplace-templates)
      // Ajuste o endpoint conforme configuração da sua instância (n8n Community Edition possui /rest/templates)
      const data = await n8nFetch<Record<string, unknown>[]>('/rest/templates')

      const mapped: AutomationTemplate[] = (data ?? []).map((tpl) => ({
        id: String(tpl.id),
        name: tpl.name as string,
        description: tpl.description as string ?? '',
        category: tpl.category as string ?? 'general',
        difficulty: tpl.difficulty as string ?? 'beginner',
        estimated_setup_time: tpl.estimatedSetupTime as number ?? 0,
        usage_count: tpl.usageCount as number ?? 0,
        rating: tpl.rating as number ?? 0,
        is_featured: tpl.isFeatured as boolean ?? false,
        is_premium: tpl.isPremium as boolean ?? false,
        tags: tpl.tags as string[] ?? [],
        integrations: tpl.integrations as string[] ?? [],
        triggers: tpl.triggers as string[] ?? [],
        actions: tpl.actions as string[] ?? [],
        template_data: tpl.templateData as Record<string, unknown> ?? {},
        author: tpl.author as string ?? 'n8n',
        created_at: tpl.createdAt as string ?? new Date().toISOString(),
        updated_at: tpl.updatedAt as string ?? new Date().toISOString(),
      }))

      const filtered = mapped.filter((tpl) => {
        const matchesSearch =
          !searchTerm ||
          tpl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tpl.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || tpl.category === selectedCategory
        const matchesDifficulty = selectedDifficulty === 'all' || tpl.difficulty === selectedDifficulty
        return matchesSearch && matchesCategory && matchesDifficulty
      })

      const sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name)
          case 'rating':
            return b.rating - a.rating
          case 'popularity':
          default:
            return b.usage_count - a.usage_count
        }
      })

      return sorted
    },
    staleTime: 10 * 60 * 1000,
  })
} 