export interface N8nWorkflow {
  id: string
  name: string
  active: boolean
  createdAt: string
  updatedAt: string
  versionId: string
  nodes: N8nNode[]
  connections: N8nConnection
  settings?: {
    executionOrder?: 'v0' | 'v1'
    saveManualExecutions?: boolean
    callerPolicy?: string
    errorWorkflow?: string
    timezone?: string
  }
  staticData?: any
  tags?: string[]
  triggerCount?: number
  versionCount?: number
}

export interface N8nNode {
  id: string
  name: string
  type: string
  typeVersion: number
  position: [number, number]
  disabled?: boolean
  notes?: string
  notesInFlow?: boolean
  color?: string
  parameters: {
    [key: string]: any
  }
  webhookId?: string
  credentials?: {
    [key: string]: {
      id: string
      name: string
    }
  }
  executeOnce?: boolean
  retryOnFail?: boolean
  maxTries?: number
  waitBetweenTries?: number
  alwaysOutputData?: boolean
  onError?: 'stopWorkflow' | 'continueRegularOutput' | 'continueErrorOutput'
  continueOnFail?: boolean
}

export interface N8nConnection {
  [key: string]: {
    [key: string]: Array<{
      node: string
      type: string
      index: number
    }>
  }
}

export interface N8nExecution {
  id: string
  finished: boolean
  mode: 'manual' | 'trigger' | 'webhook' | 'error' | 'internal'
  retryOf?: string
  retrySuccessId?: string
  startedAt: string
  stoppedAt?: string
  workflowId: string
  workflowData?: {
    id: string
    name: string
    active: boolean
    createdAt: string
    updatedAt: string
    nodes: N8nNode[]
    connections: N8nConnection
  }
  data?: {
    resultData: {
      runData: {
        [nodeName: string]: Array<{
          startTime: number
          executionTime: number
          source?: Array<{
            previousNode: string
          }>
          data: {
            main: Array<Array<{
              json: any
              binary?: {
                [key: string]: {
                  data: string
                  mimeType: string
                  fileName?: string
                  directory?: string
                }
              }
            }>>
          }
        }>
      }
      lastNodeExecuted?: string
      error?: {
        name: string
        message: string
        description?: string
        cause?: any
        context?: any
        extra?: any
        functionality?: string
        functionOverview?: string
        node?: {
          id: string
          name: string
          type: string
        }
        severity?: 'warning' | 'error'
        timestamp: number
      }
    }
    executionData?: {
      contextData: any
      nodeExecutionStack: any[]
      metadata: any
      waitingExecution: any
      waitingExecutionSource: any
    }
  }
  status: 'running' | 'success' | 'error' | 'canceled' | 'waiting'
  waitTill?: string
}

export interface N8nCredential {
  id: string
  name: string
  type: string
  nodesAccess: Array<{
    nodeType: string
    user: string
    date: string
  }>
  sharedWith?: Array<{
    id: string
    email: string
    firstName: string
    lastName: string
  }>
  homeProject?: {
    id: string
    name: string
    type: 'Personal' | 'Team'
  }
  createdAt: string
  updatedAt: string
}

export interface N8nWebhook {
  id: string
  workflowId: string
  node: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH'
  path: string
  isTest: boolean
  lastEntryPoint?: string
}

export interface N8nExecutionSummary {
  id: string
  finished: boolean
  mode: string
  retryOf?: string
  retrySuccessId?: string
  startedAt: string
  stoppedAt?: string
  workflowId: string
  workflowName?: string
  status: 'running' | 'success' | 'error' | 'canceled' | 'waiting'
  nodeExecutionStatus?: {
    [nodeName: string]: {
      status: 'success' | 'error' | 'running'
      executionTime?: number
    }
  }
}

export interface N8nExecutionFilter {
  workflowId?: string
  status?: 'success' | 'error' | 'running' | 'canceled' | 'waiting'
  startedAfter?: string
  startedBefore?: string
  limit?: number
  offset?: number
}

export interface N8nWorkflowExecuteRequest {
  inputData?: {
    [nodeName: string]: Array<{
      json: any
    }>
  }
  triggerToStartFrom?: string
}

export interface N8nApiError {
  message: string
  name: string
  httpStatusCode?: number
  description?: string
  errorResponse?: {
    message: string
    name: string
  }
}

export interface N8nHealthResponse {
  status: 'ok' | 'error'
  timestamp: string
  uptime: number
  database: {
    status: 'connected' | 'disconnected'
    migration: 'completed' | 'pending' | 'error'
  }
  cache?: {
    status: 'connected' | 'disconnected'
  }
}

export interface N8nWorkflowTestRequest {
  workflowData: Partial<N8nWorkflow>
  runData?: {
    [nodeName: string]: Array<{
      data: {
        main: Array<Array<{
          json: any
        }>>
      }
    }>
  }
  startNodes?: string[]
  destinationNode?: string
}

export interface N8nWorkflowSettings {
  executionOrder: 'v0' | 'v1'
  saveDataErrorExecution: 'all' | 'none'
  saveDataSuccessExecution: 'all' | 'none'
  saveManualExecutions: boolean
  callerPolicy: 'workflowsFromSameOwner' | 'workflowsFromAList' | 'any'
  callerIds?: string
  errorWorkflow?: string
  timezone: string
}

export type N8nNodeType = 'n8n-nodes-base.start' | 'n8n-nodes-base.webhook' | 'n8n-nodes-base.httpRequest' | 'n8n-nodes-base.supabase' | 'n8n-nodes-base.wordpress' | string

export interface N8nNodeTypeDescription {
  displayName: string
  name: string
  icon: string
  group: string[]
  version: number
  description: string
  defaults: {
    name: string
    color: string
  }
  inputs: string[]
  outputs: string[]
  properties: Array<{
    displayName: string
    name: string
    type: string
    default: any
    required?: boolean
    description?: string
    options?: Array<{
      name: string
      value: any
    }>
  }>
}