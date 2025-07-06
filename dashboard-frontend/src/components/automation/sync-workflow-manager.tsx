'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useBlog } from '@/contexts/blog-context'
import { useWordPressSync } from '@/hooks/use-wordpress-sync'
import { 
  Workflow, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Zap,
  Settings,
  RefreshCw,
  Bot
} from 'lucide-react'

interface N8nWorkflow {
  id: string
  name: string
  active: boolean
  tags?: string[]
  createdAt: string
  updatedAt: string
}

interface N8nExecution {
  id: string
  finished: boolean
  status?: 'success' | 'error' | 'running' | 'waiting'
  startedAt: string
  stoppedAt?: string
  workflowId: string
}

export function SyncWorkflowManager() {
  const { activeBlog } = useBlog()
  const { getSyncStatus, getSyncStats, syncFromWordPress, syncToWordPress } = useWordPressSync()

  // Fetch n8n workflows
  const { data: workflows, refetch: refetchWorkflows } = useQuery({
    queryKey: ['n8n-workflows'],
    queryFn: async () => {
      const response = await fetch('/api/n8n/workflows')
      if (!response.ok) throw new Error('Failed to fetch workflows')
      return response.json()
    },
    refetchInterval: 60000, // Refresh every minute
  })

  // Fetch workflow executions for all workflows
  const { data: executions } = useQuery({
    queryKey: ['n8n-executions'],
    queryFn: async () => {
      const response = await fetch(`/api/n8n/executions`)
      if (!response.ok) throw new Error('Failed to fetch executions')
      return response.json()
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  // Create workflow mutation
  const createWorkflowMutation = useMutation({
    mutationFn: async (template: string) => {
      const response = await fetch('/api/n8n/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template, blogId: activeBlog === 'all' ? null : (activeBlog as any)?.id })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create workflow')
      }

      return response.json()
    },
    onSuccess: () => {
      refetchWorkflows()
    }
  })

  // Toggle workflow activation
  const toggleWorkflowMutation = useMutation({
    mutationFn: async ({ workflowId, active }: { workflowId: string; active: boolean }) => {
      const response = await fetch(`/api/n8n/workflows/${workflowId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to toggle workflow')
      }

      return response.json()
    },
    onSuccess: () => {
      refetchWorkflows()
    }
  })

  // Trigger manual execution
  const triggerExecutionMutation = useMutation({
    mutationFn: async (workflowId: string) => {
      const response = await fetch(`/api/n8n/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogId: activeBlog === 'all' ? null : (activeBlog as any)?.id })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to trigger execution')
      }

      return response.json()
    }
  })

  const syncStatus = getSyncStatus()
  const syncStats = getSyncStats()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />
      case 'running': return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
      case 'waiting': return <Clock className="w-4 h-4 text-yellow-500" />
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getBlogSyncWorkflows = () => {
    if (!workflows?.data) return []
    return workflows.data.filter((w: N8nWorkflow) => 
      w.tags?.includes('blog-sync') || w.name.toLowerCase().includes('sync')
    )
  }

  const getContentWorkflows = () => {
    if (!workflows?.data) return []
    return workflows.data.filter((w: N8nWorkflow) => 
      w.tags?.includes('content') || w.name.toLowerCase().includes('content')
    )
  }

  if (!activeBlog || activeBlog === 'all') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sync Workflow Manager</CardTitle>
          <CardDescription>
            Please select a specific blog to manage automation workflows
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sync Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Automation Status for {activeBlog.name}
          </CardTitle>
          <CardDescription>
            WordPress synchronization and content automation workflows
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sync Health */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {syncStatus?.isHealthy ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500" />
                )}
              </div>
              <h3 className="font-medium">Sync Health</h3>
              <p className="text-sm text-gray-600">
                {syncStatus?.isHealthy ? 'Healthy' : 'Issues Detected'}
              </p>
            </div>

            {/* Total Syncs */}
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {syncStats.totalSyncs}
              </div>
              <h3 className="font-medium">Total Syncs</h3>
              <p className="text-sm text-gray-600">
                {Math.round(syncStats.successRate)}% success rate
              </p>
            </div>

            {/* Posts Synced */}
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {syncStats.totalPostsSynced}
              </div>
              <h3 className="font-medium">Posts Synced</h3>
              <p className="text-sm text-gray-600">
                {syncStats.totalMediaSynced} media files
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <Separator />
          <div className="flex gap-2">
            <Button
              onClick={() => syncFromWordPress()}
              size="sm"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync from WP
            </Button>
            <Button
              onClick={() => syncToWordPress()}
              size="sm"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync to WP
            </Button>
          </div>

          {syncStatus && (
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                Last sync: {new Date(syncStatus.lastSyncAt).toLocaleString()} 
                ({syncStatus.lastSyncType})
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Workflow Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="w-5 h-5" />
            n8n Workflows
          </CardTitle>
          <CardDescription>
            Manage automation workflows for synchronization and content generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sync" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sync">Sync Workflows</TabsTrigger>
              <TabsTrigger value="content">Content Workflows</TabsTrigger>
              <TabsTrigger value="executions">Executions</TabsTrigger>
            </TabsList>

            <TabsContent value="sync" className="space-y-4">
              {getBlogSyncWorkflows().length > 0 ? (
                <div className="space-y-3">
                  {getBlogSyncWorkflows().map((workflow: N8nWorkflow) => (
                    <div key={workflow.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Workflow className="w-4 h-4" />
                        <div>
                          <h4 className="font-medium">{workflow.name}</h4>
                          <p className="text-sm text-gray-600">
                            Updated: {new Date(workflow.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={workflow.active ? "default" : "secondary"}>
                          {workflow.active ? "Active" : "Inactive"}
                        </Badge>
                        <Switch
                          checked={workflow.active}
                          onCheckedChange={(checked) => 
                            toggleWorkflowMutation.mutate({ workflowId: workflow.id, active: checked })
                          }
                          disabled={toggleWorkflowMutation.isPending}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => triggerExecutionMutation.mutate(workflow.id)}
                          disabled={triggerExecutionMutation.isPending}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Workflow className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No sync workflows found</h3>
                  <p className="text-gray-600 mb-4">Create your first blog synchronization workflow</p>
                  <Button
                    onClick={() => createWorkflowMutation.mutate('blogSync')}
                    disabled={createWorkflowMutation.isPending}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Create Sync Workflow
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              {getContentWorkflows().length > 0 ? (
                <div className="space-y-3">
                  {getContentWorkflows().map((workflow: N8nWorkflow) => (
                    <div key={workflow.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Settings className="w-4 h-4" />
                        <div>
                          <h4 className="font-medium">{workflow.name}</h4>
                          <p className="text-sm text-gray-600">
                            Updated: {new Date(workflow.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={workflow.active ? "default" : "secondary"}>
                          {workflow.active ? "Active" : "Inactive"}
                        </Badge>
                        <Switch
                          checked={workflow.active}
                          onCheckedChange={(checked) => 
                            toggleWorkflowMutation.mutate({ workflowId: workflow.id, active: checked })
                          }
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => triggerExecutionMutation.mutate(workflow.id)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No content workflows found</h3>
                  <p className="text-gray-600 mb-4">Create your first content automation workflow</p>
                  <Button
                    onClick={() => createWorkflowMutation.mutate('contentGeneration')}
                    disabled={createWorkflowMutation.isPending}
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Create Content Workflow
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="executions" className="space-y-4">
              {executions && executions.data && executions.data.length > 0 ? (
                <div className="space-y-3">
                  {executions.data.slice(0, 10).map((execution: N8nExecution) => (
                    <div key={execution.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(execution.status || 'waiting')}
                        <div>
                          <h4 className="font-medium">Execution #{execution.id.slice(-8)}</h4>
                          <p className="text-sm text-gray-600">
                            Started: {new Date(execution.startedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={execution.finished ? "default" : "secondary"}>
                          {execution.finished ? "Finished" : "Running"}
                        </Badge>
                        {execution.status && (
                          <Badge variant={execution.status === 'success' ? "default" : "destructive"}>
                            {execution.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No executions found. Select a workflow to view its execution history.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}