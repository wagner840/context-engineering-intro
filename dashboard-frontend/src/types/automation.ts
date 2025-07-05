// Types para componentes de automação

export interface N8nWorkflowManagerProps {
  timeframe: string
}

export interface WorkflowExecutionsProps {
  timeframe: string
}

export interface AutomationTemplate {
  id: string
  name: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  workflow_data: any // Dados do workflow n8n
  created_at: string
  updated_at: string
}

export interface WorkflowExecution {
  id: string
  workflow_id: string
  workflow_name: string
  status: 'success' | 'error' | 'running' | 'waiting'
  started_at: string
  finished_at?: string
  error_message?: string
  execution_time?: number
  node_graph?: any // Grafo de execução do n8n
}

export interface Workflow {
  id: string
  name: string
  active: boolean
  tags: string[]
  created_at: string
  updated_at: string
  last_execution: string | null
  execution_count: number
  average_execution_time: number
  success_rate: number
} 