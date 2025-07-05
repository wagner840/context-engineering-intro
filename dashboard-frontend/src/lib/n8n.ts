import type { N8nWorkflow, N8nExecution, N8nCredential } from '@/types/n8n'

export class N8nApiClient {
  private baseUrl: string
  private apiKey: string

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '') // Remove trailing slash
    this.apiKey = apiKey
  }

  private getAuthHeaders() {
    return {
      'X-N8N-API-KEY': this.apiKey,
      'Content-Type': 'application/json',
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/api/v1${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`n8n API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Workflows
  async getWorkflows(): Promise<N8nWorkflow[]> {
    const response = await this.request<{ data: N8nWorkflow[] }>('/workflows')
    return response.data
  }

  async getWorkflow(id: string): Promise<N8nWorkflow> {
    return this.request<N8nWorkflow>(`/workflows/${id}`)
  }

  async createWorkflow(workflow: Partial<N8nWorkflow>): Promise<N8nWorkflow> {
    return this.request<N8nWorkflow>('/workflows', {
      method: 'POST',
      body: JSON.stringify(workflow),
    })
  }

  async updateWorkflow(id: string, workflow: Partial<N8nWorkflow>): Promise<N8nWorkflow> {
    return this.request<N8nWorkflow>(`/workflows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workflow),
    })
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    await this.request(`/workflows/${id}`, {
      method: 'DELETE',
    })
    return true
  }

  async activateWorkflow(id: string): Promise<N8nWorkflow> {
    return this.request<N8nWorkflow>(`/workflows/${id}/activate`, {
      method: 'POST',
    })
  }

  async deactivateWorkflow(id: string): Promise<N8nWorkflow> {
    return this.request<N8nWorkflow>(`/workflows/${id}/deactivate`, {
      method: 'POST',
    })
  }

  // Executions
  async getExecutions(params: {
    limit?: number
    offset?: number
    workflowId?: string
    status?: 'success' | 'error' | 'running' | 'canceled'
  } = {}): Promise<{ data: N8nExecution[]; nextCursor?: string }> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    })

    return this.request<{ data: N8nExecution[]; nextCursor?: string }>(`/executions?${searchParams}`)
  }

  async getExecution(id: string): Promise<N8nExecution> {
    return this.request<N8nExecution>(`/executions/${id}`)
  }

  async deleteExecution(id: string): Promise<boolean> {
    await this.request(`/executions/${id}`, {
      method: 'DELETE',
    })
    return true
  }

  async retryExecution(id: string): Promise<N8nExecution> {
    return this.request<N8nExecution>(`/executions/${id}/retry`, {
      method: 'POST',
    })
  }

  async stopExecution(id: string): Promise<N8nExecution> {
    return this.request<N8nExecution>(`/executions/${id}/stop`, {
      method: 'POST',
    })
  }

  // Manual execution
  async executeWorkflow(
    workflowId: string, 
    inputData?: any
  ): Promise<N8nExecution> {
    return this.request<N8nExecution>(`/workflows/${workflowId}/execute`, {
      method: 'POST',
      body: JSON.stringify({ inputData }),
    })
  }

  // Credentials
  async getCredentials(): Promise<N8nCredential[]> {
    const response = await this.request<{ data: N8nCredential[] }>('/credentials')
    return response.data
  }

  async createCredential(credential: Partial<N8nCredential>): Promise<N8nCredential> {
    return this.request<N8nCredential>('/credentials', {
      method: 'POST',
      body: JSON.stringify(credential),
    })
  }

  // Health check
  async getHealth(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health')
  }

  // Webhook management
  async getActiveWebhooks(): Promise<Array<{
    workflowId: string
    webhookId: string
    method: string
    path: string
    isTest: boolean
  }>> {
    return this.request<Array<{
      workflowId: string
      webhookId: string
      method: string
      path: string
      isTest: boolean
    }>>('/webhooks')
  }

  // Test webhook
  async testWebhook(
    workflowId: string, 
    webhookId: string, 
    data: any
  ): Promise<any> {
    return this.request(`/webhooks/test/${workflowId}/${webhookId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Utility methods for dashboard
  async getWorkflowStatus(id: string): Promise<{
    active: boolean
    lastExecution?: N8nExecution
    executionCount: number
    successRate: number
  }> {
    const workflow = await this.getWorkflow(id)
    const executions = await this.getExecutions({ 
      workflowId: id, 
      limit: 50 
    })

    const executionCount = executions.data.length
    const successCount = executions.data.filter(e => e.status === 'success').length
    const successRate = executionCount > 0 ? (successCount / executionCount) * 100 : 0

    return {
      active: workflow.active,
      lastExecution: executions.data[0] || undefined,
      executionCount,
      successRate: Math.round(successRate * 100) / 100
    }
  }

  async getWorkflowPerformanceMetrics(
    workflowId: string,
    days = 7
  ): Promise<{
    totalExecutions: number
    successfulExecutions: number
    failedExecutions: number
    averageExecutionTime: number
    successRate: number
  }> {
    const executions = await this.getExecutions({ 
      workflowId, 
      limit: 1000 
    })

    const now = new Date()
    const daysAgo = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

    const recentExecutions = executions.data.filter(e => 
      new Date(e.startedAt) >= daysAgo
    )

    const totalExecutions = recentExecutions.length
    const successfulExecutions = recentExecutions.filter(e => e.status === 'success').length
    const failedExecutions = recentExecutions.filter(e => e.status === 'error').length

    const executionTimes = recentExecutions
      .filter(e => e.stoppedAt)
      .map(e => {
        const start = new Date(e.startedAt).getTime()
        const end = new Date(e.stoppedAt!).getTime()
        return end - start
      })

    const averageExecutionTime = executionTimes.length > 0 
      ? executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length 
      : 0

    const successRate = totalExecutions > 0 
      ? (successfulExecutions / totalExecutions) * 100 
      : 0

    return {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      averageExecutionTime: Math.round(averageExecutionTime),
      successRate: Math.round(successRate * 100) / 100
    }
  }
}

export function createN8nClient(baseUrl: string, apiKey: string): N8nApiClient {
  return new N8nApiClient(baseUrl, apiKey)
}

export const getN8nClient = (): N8nApiClient => {
  const baseUrl = process.env.N8N_API_URL
  const apiKey = process.env.N8N_API_KEY
  
  if (!baseUrl || !apiKey) {
    throw new Error('n8n API credentials not configured')
  }

  return createN8nClient(baseUrl, apiKey)
}

// N8n API wrapper with enhanced functionality
export class N8nAPI {
  private client: N8nApiClient

  constructor() {
    this.client = getN8nClient()
  }

  // Delegate all methods to the client
  getWorkflows() {
    return this.client.getWorkflows()
  }
  
  getWorkflow(id: string) {
    return this.client.getWorkflow(id)
  }
  
  createWorkflow(workflow: any) {
    return this.client.createWorkflow(workflow)
  }
  
  updateWorkflow(id: string, workflow: any) {
    return this.client.updateWorkflow(id, workflow)
  }
  
  deleteWorkflow(id: string) {
    return this.client.deleteWorkflow(id)
  }
  
  activateWorkflow(id: string) {
    return this.client.activateWorkflow(id)
  }
  
  deactivateWorkflow(id: string) {
    return this.client.deactivateWorkflow(id)
  }
  
  executeWorkflow(id: string, inputData?: any) {
    return this.client.executeWorkflow(id, inputData)
  }
  
  getExecution(id: string) {
    return this.client.getExecution(id)
  }
  
  getExecutions(filters?: any) {
    return this.client.getExecutions(filters)
  }
  
  stopExecution(id: string) {
    return this.client.stopExecution(id)
  }
  
  retryExecution(id: string) {
    return this.client.retryExecution(id)
  }
  
  deleteExecution(id: string) {
    return this.client.deleteExecution(id)
  }
  
  getCredentials() {
    return this.client.getCredentials()
  }
  
  createCredential(credential: any) {
    return this.client.createCredential(credential)
  }
  
  getHealth() {
    return this.client.getHealth()
  }
  
  getActiveWebhooks() {
    return this.client.getActiveWebhooks()
  }
  
  testWebhook(workflowId: string, webhookId: string, data: any) {
    return this.client.testWebhook(workflowId, webhookId, data)
  }
  
  getWorkflowStatus(id: string) {
    return this.client.getWorkflowStatus(id)
  }
  
  getWorkflowPerformanceMetrics(id: string) {
    return this.client.getWorkflowPerformanceMetrics(id)
  }

  // Additional methods for waiting for execution
  async waitForExecution(id: string, timeout: number = 30000): Promise<N8nExecution> {
    const startTime = Date.now()
    
    while (Date.now() - startTime < timeout) {
      const execution = await this.getExecution(id)
      
      if (execution.status !== 'running') {
        return execution
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    throw new Error(`Execution ${id} did not complete within ${timeout}ms`)
  }
}