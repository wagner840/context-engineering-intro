import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotifications } from '@/store/ui-store'

interface ExecuteWorkflowParams {
  workflow_id: string
  blog_id?: string
  input_data?: Record<string, any>
  wait_for_completion?: boolean
}

interface WorkflowFilters {
  blog_id?: string
  active?: boolean
}

export function useN8nWorkflows(filters: WorkflowFilters = {}) {
  return useQuery({
    queryKey: ['n8n-workflows', filters.blog_id, filters.active],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      
      if (filters.blog_id) searchParams.append('blog_id', filters.blog_id)
      if (filters.active !== undefined) searchParams.append('active', filters.active.toString())

      const response = await fetch(`/api/n8n/workflows?${searchParams}`)

      if (!response.ok) {
        throw new Error('Failed to fetch n8n workflows')
      }

      return response.json()
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useN8nWorkflow(workflowId: string) {
  return useQuery({
    queryKey: ['n8n-workflow', workflowId],
    queryFn: async () => {
      const response = await fetch(`/api/n8n/workflows/${workflowId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch n8n workflow')
      }

      return response.json()
    },
    enabled: !!workflowId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useExecuteN8nWorkflow() {
  const { addNotification } = useNotifications()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: ExecuteWorkflowParams) => {
      const response = await fetch('/api/n8n/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to execute workflow')
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
      addNotification({
        type: 'success',
        title: 'Workflow executed',
        message: `Workflow ${variables.workflow_id} started successfully`,
      })

      // Invalidate executions queries
      queryClient.invalidateQueries({ queryKey: ['n8n-executions'] })
      queryClient.invalidateQueries({ queryKey: ['n8n-workflow-status', variables.workflow_id] })
    },
    onError: (error, variables) => {
      addNotification({
        type: 'error',
        title: 'Workflow execution failed',
        message: `Failed to execute ${variables.workflow_id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    },
  })
}

export function useN8nExecution(executionId: string) {
  return useQuery({
    queryKey: ['n8n-execution', executionId],
    queryFn: async () => {
      const response = await fetch(`/api/n8n/executions/${executionId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch execution')
      }

      return response.json()
    },
    enabled: !!executionId,
    refetchInterval: (data) => {
      // Auto-refresh if execution is still running
      if (data?.data?.status === 'running') {
        return 2000 // 2 seconds
      }
      return false
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useN8nExecutions(workflowId?: string) {
  return useQuery({
    queryKey: ['n8n-executions', workflowId],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (workflowId) searchParams.append('workflow_id', workflowId)

      const response = await fetch(`/api/n8n/executions?${searchParams}`)

      if (!response.ok) {
        throw new Error('Failed to fetch executions')
      }

      return response.json()
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useStopN8nExecution() {
  const { addNotification } = useNotifications()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (executionId: string) => {
      const response = await fetch(`/api/n8n/executions/${executionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to stop execution')
      }

      return response.json()
    },
    onSuccess: (data, executionId) => {
      addNotification({
        type: 'success',
        title: 'Execution stopped',
        message: `Execution ${executionId} has been stopped`,
      })

      // Invalidate execution queries
      queryClient.invalidateQueries({ queryKey: ['n8n-execution', executionId] })
      queryClient.invalidateQueries({ queryKey: ['n8n-executions'] })
    },
    onError: (error, executionId) => {
      addNotification({
        type: 'error',
        title: 'Failed to stop execution',
        message: `Could not stop execution ${executionId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    },
  })
}

export function useRetryN8nExecution() {
  const { addNotification } = useNotifications()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (executionId: string) => {
      const response = await fetch(`/api/n8n/executions/${executionId}/retry`, {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to retry execution')
      }

      return response.json()
    },
    onSuccess: (data, executionId) => {
      addNotification({
        type: 'success',
        title: 'Execution retried',
        message: `Execution ${executionId} has been retried`,
      })

      // Invalidate execution queries
      queryClient.invalidateQueries({ queryKey: ['n8n-executions'] })
    },
    onError: (error, executionId) => {
      addNotification({
        type: 'error',
        title: 'Failed to retry execution',
        message: `Could not retry execution ${executionId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    },
  })
}

export function useN8nWorkflowStatus(workflowId: string) {
  return useQuery({
    queryKey: ['n8n-workflow-status', workflowId],
    queryFn: async () => {
      const response = await fetch(`/api/n8n/workflows/${workflowId}/status`)

      if (!response.ok) {
        throw new Error('Failed to fetch workflow status')
      }

      return response.json()
    },
    enabled: !!workflowId,
    refetchInterval: 30 * 1000, // 30 seconds
    staleTime: 15 * 1000, // 15 seconds
  })
}

export function useN8nWorkflowMetrics(workflowId: string, days: number = 7) {
  return useQuery({
    queryKey: ['n8n-workflow-metrics', workflowId, days],
    queryFn: async () => {
      const response = await fetch(`/api/n8n/workflows/${workflowId}/metrics?days=${days}`)

      if (!response.ok) {
        throw new Error('Failed to fetch workflow metrics')
      }

      return response.json()
    },
    enabled: !!workflowId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useActivateN8nWorkflow() {
  const { addNotification } = useNotifications()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workflowId, activate }: { workflowId: string; activate: boolean }) => {
      const endpoint = activate ? 'activate' : 'deactivate'
      const response = await fetch(`/api/n8n/workflows/${workflowId}/${endpoint}`, {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `Failed to ${endpoint} workflow`)
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
      const action = variables.activate ? 'activated' : 'deactivated'
      addNotification({
        type: 'success',
        title: `Workflow ${action}`,
        message: `Workflow ${variables.workflowId} has been ${action}`,
      })

      // Invalidate workflow queries
      queryClient.invalidateQueries({ queryKey: ['n8n-workflow', variables.workflowId] })
      queryClient.invalidateQueries({ queryKey: ['n8n-workflows'] })
      queryClient.invalidateQueries({ queryKey: ['n8n-workflow-status', variables.workflowId] })
    },
    onError: (error, variables) => {
      const action = variables.activate ? 'activate' : 'deactivate'
      addNotification({
        type: 'error',
        title: `Failed to ${action} workflow`,
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    },
  })
}

export function useTestN8nWorkflow() {
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async ({ 
      workflowId, 
      testData 
    }: { 
      workflowId: string
      testData?: Record<string, any> 
    }) => {
      const response = await fetch(`/api/n8n/workflows/${workflowId}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test_data: testData }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Test failed')
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
      addNotification({
        type: 'success',
        title: 'Workflow test completed',
        message: `Test for workflow ${variables.workflowId} completed successfully`,
      })
    },
    onError: (error, variables) => {
      addNotification({
        type: 'error',
        title: 'Workflow test failed',
        message: `Test for workflow ${variables.workflowId} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    },
  })
}

// Utility hook for workflow automation management
export function useWorkflowAutomation(blogId: string) {
  const { data: workflows, isLoading: isLoadingWorkflows } = useN8nWorkflows({ blog_id: blogId })
  const executeWorkflow = useExecuteN8nWorkflow()
  const activateWorkflow = useActivateN8nWorkflow()
  const testWorkflow = useTestN8nWorkflow()

  const triggerContentGeneration = (keywords: string[]) => {
    const contentWorkflow = workflows?.data?.find((w: any) => w.name.includes('content-generation'))
    
    if (contentWorkflow) {
      executeWorkflow.mutate({
        workflow_id: contentWorkflow.n8n_workflow_id,
        blog_id: blogId,
        input_data: { keywords },
      })
    }
  }

  const triggerSEOAnalysis = (postId: string) => {
    const seoWorkflow = workflows?.data?.find((w: any) => w.name.includes('seo-analysis'))
    
    if (seoWorkflow) {
      executeWorkflow.mutate({
        workflow_id: seoWorkflow.n8n_workflow_id,
        blog_id: blogId,
        input_data: { post_id: postId },
      })
    }
  }

  const triggerSerpMonitoring = (keywords: string[]) => {
    const serpWorkflow = workflows?.data?.find((w: any) => w.name.includes('serp-monitoring'))
    
    if (serpWorkflow) {
      executeWorkflow.mutate({
        workflow_id: serpWorkflow.n8n_workflow_id,
        blog_id: blogId,
        input_data: { keywords },
      })
    }
  }

  return {
    workflows: workflows?.data || [],
    isLoading: isLoadingWorkflows,
    triggerContentGeneration,
    triggerSEOAnalysis,
    triggerSerpMonitoring,
    executeWorkflow: executeWorkflow.mutate,
    activateWorkflow: activateWorkflow.mutate,
    testWorkflow: testWorkflow.mutate,
    isExecuting: executeWorkflow.isPending,
    isActivating: activateWorkflow.isPending,
    isTesting: testWorkflow.isPending,
  }
}

// Hook for real-time execution monitoring
export function useExecutionMonitoring(executionIds: string[]) {
  return useQuery({
    queryKey: ['execution-monitoring', executionIds],
    queryFn: async () => {
      const results = await Promise.allSettled(
        executionIds.map(async (id) => {
          const response = await fetch(`/api/n8n/executions/${id}`)
          if (!response.ok) throw new Error(`Failed to fetch execution ${id}`)
          return response.json()
        })
      )

      return results.map((result, index) => ({
        id: executionIds[index],
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null,
      }))
    },
    enabled: executionIds.length > 0,
    refetchInterval: 3000, // 3 seconds
    staleTime: 1000, // 1 second
  })
}