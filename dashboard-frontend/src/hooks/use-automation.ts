import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getN8nClient } from '@/lib/n8n'
import { useNotifications } from '@/store/ui-store'
import type { N8nWorkflow, N8nExecution, N8nExecutionFilter } from '@/types/n8n'

export const AUTOMATION_QUERY_KEYS = {
  all: ['automation'] as const,
  workflows: () => [...AUTOMATION_QUERY_KEYS.all, 'workflows'] as const,
  workflow: (id: string) => [...AUTOMATION_QUERY_KEYS.workflows(), id] as const,
  executions: (filters?: N8nExecutionFilter) => [...AUTOMATION_QUERY_KEYS.all, 'executions', filters] as const,
  execution: (id: string) => [...AUTOMATION_QUERY_KEYS.all, 'execution', id] as const,
  health: () => [...AUTOMATION_QUERY_KEYS.all, 'health'] as const,
} as const

export function useWorkflows() {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: AUTOMATION_QUERY_KEYS.workflows(),
    queryFn: async (): Promise<N8nWorkflow[]> => {
      try {
        const client = getN8nClient()
        return await client.getWorkflows()
      } catch (error) {
        throw new Error(`Failed to fetch workflows: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to fetch workflows',
        message: error.message,
      })
    },
  })
}

export function useWorkflow(id: string) {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: AUTOMATION_QUERY_KEYS.workflow(id),
    queryFn: async (): Promise<N8nWorkflow> => {
      try {
        const client = getN8nClient()
        return await client.getWorkflow(id)
      } catch (error) {
        throw new Error(`Failed to fetch workflow: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to fetch workflow',
        message: error.message,
      })
    },
  })
}

export function useExecutions(filters?: N8nExecutionFilter) {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: AUTOMATION_QUERY_KEYS.executions(filters),
    queryFn: async () => {
      try {
        const client = getN8nClient()
        return await client.getExecutions({
          limit: 50,
          ...filters,
        })
      } catch (error) {
        throw new Error(`Failed to fetch executions: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to fetch executions',
        message: error.message,
      })
    },
  })
}

export function useExecution(id: string) {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: AUTOMATION_QUERY_KEYS.execution(id),
    queryFn: async (): Promise<N8nExecution> => {
      try {
        const client = getN8nClient()
        return await client.getExecution(id)
      } catch (error) {
        throw new Error(`Failed to fetch execution: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to fetch execution',
        message: error.message,
      })
    },
  })
}

export function useN8nHealth() {
  return useQuery({
    queryKey: AUTOMATION_QUERY_KEYS.health(),
    queryFn: async () => {
      try {
        const client = getN8nClient()
        return await client.getHealth()
      } catch (error) {
        throw new Error(`n8n health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export function useActivateWorkflow() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async (workflowId: string): Promise<N8nWorkflow> => {
      try {
        const client = getN8nClient()
        return await client.activateWorkflow(workflowId)
      } catch (error) {
        throw new Error(`Failed to activate workflow: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: AUTOMATION_QUERY_KEYS.workflows() })
      queryClient.setQueryData(AUTOMATION_QUERY_KEYS.workflow(data.id), data)
      addNotification({
        type: 'success',
        title: 'Workflow activated',
        message: `${data.name} is now active`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to activate workflow',
        message: error.message,
      })
    },
  })
}

export function useDeactivateWorkflow() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async (workflowId: string): Promise<N8nWorkflow> => {
      try {
        const client = getN8nClient()
        return await client.deactivateWorkflow(workflowId)
      } catch (error) {
        throw new Error(`Failed to deactivate workflow: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: AUTOMATION_QUERY_KEYS.workflows() })
      queryClient.setQueryData(AUTOMATION_QUERY_KEYS.workflow(data.id), data)
      addNotification({
        type: 'success',
        title: 'Workflow deactivated',
        message: `${data.name} is now inactive`,
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to deactivate workflow',
        message: error.message,
      })
    },
  })
}

export function useExecuteWorkflow() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async ({ 
      workflowId, 
      inputData 
    }: { 
      workflowId: string; 
      inputData?: any 
    }): Promise<N8nExecution> => {
      try {
        const client = getN8nClient()
        return await client.executeWorkflow(workflowId, inputData)
      } catch (error) {
        throw new Error(`Failed to execute workflow: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: AUTOMATION_QUERY_KEYS.executions() })
      addNotification({
        type: 'success',
        title: 'Workflow executed',
        message: 'Workflow execution started successfully',
      })
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to execute workflow',
        message: error.message,
      })
    },
  })
}

export function useWorkflowStats(workflowId: string) {
  const { data: executions } = useExecutions({ workflowId, limit: 100 })

  const stats = {
    totalExecutions: executions?.data?.length || 0,
    successfulExecutions: executions?.data?.filter(e => e.status === 'success').length || 0,
    failedExecutions: executions?.data?.filter(e => e.status === 'error').length || 0,
    runningExecutions: executions?.data?.filter(e => e.status === 'running').length || 0,
    successRate: 0,
    lastExecution: executions?.data?.[0] || null,
  }

  if (stats.totalExecutions > 0) {
    stats.successRate = Math.round((stats.successfulExecutions / stats.totalExecutions) * 100)
  }

  return stats
}

export function useWorkflowPerformance(workflowId: string, days = 7) {
  const { addNotification } = useNotifications()

  return useQuery({
    queryKey: ['workflow-performance', workflowId, days],
    queryFn: async () => {
      try {
        const client = getN8nClient()
        return await client.getWorkflowPerformanceMetrics(workflowId, days)
      } catch (error) {
        throw new Error(`Failed to fetch workflow performance: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    enabled: !!workflowId,
    staleTime: 5 * 60 * 1000,
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to fetch workflow performance',
        message: error.message,
      })
    },
  })
}

export function useAutomationOverview() {
  const { data: workflows } = useWorkflows()
  const { data: executions } = useExecutions({ limit: 100 })

  const overview = {
    totalWorkflows: workflows?.length || 0,
    activeWorkflows: workflows?.filter(w => w.active).length || 0,
    inactiveWorkflows: workflows?.filter(w => !w.active).length || 0,
    recentExecutions: executions?.data?.slice(0, 10) || [],
    totalExecutions: executions?.data?.length || 0,
    successfulExecutions: executions?.data?.filter(e => e.status === 'success').length || 0,
    failedExecutions: executions?.data?.filter(e => e.status === 'error').length || 0,
    overallSuccessRate: 0,
  }

  if (overview.totalExecutions > 0) {
    overview.overallSuccessRate = Math.round(
      (overview.successfulExecutions / overview.totalExecutions) * 100
    )
  }

  return overview
}