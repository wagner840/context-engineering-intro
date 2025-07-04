'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Play, Pause, Settings, Activity, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useWorkflows, useExecutions, useAutomationOverview, useN8nHealth } from '@/hooks/use-automation'
import { useBlog } from '@/hooks/use-blogs'
import { useModals } from '@/store/ui-store'
import { formatDate, formatNumber } from '@/lib/utils'

export default function AutomationPage() {
  const params = useParams()
  const blogId = params?.blogId as string
  
  const { data: blog } = useBlog(blogId)
  const { data: workflows, isLoading: workflowsLoading, error: workflowsError } = useWorkflows()
  const { data: executions, isLoading: executionsLoading } = useExecutions({ limit: 20 })
  const overview = useAutomationOverview()
  const { data: health } = useN8nHealth()
  const { openModal } = useModals()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      case 'running': return <Activity className="h-4 w-4 text-blue-500 animate-spin" />
      case 'canceled': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'success': return 'default'
      case 'error': return 'destructive'
      case 'running': return 'secondary'
      case 'canceled': return 'outline'
      default: return 'outline'
    }
  }

  const handleToggleWorkflow = (workflow: any) => {
    openModal('toggle-workflow', { workflow })
  }

  const handleExecuteWorkflow = (workflow: any) => {
    openModal('execute-workflow', { workflow })
  }

  const handleViewExecution = (execution: any) => {
    openModal('view-execution', { execution })
  }

  if (workflowsLoading || executionsLoading) {
    return <AutomationPageSkeleton />
  }

  if (workflowsError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Automation</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading automation: {workflowsError.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automation</h1>
          <p className="text-muted-foreground">
            n8n workflow monitoring and control for {blog?.name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {health && (
            <Badge variant={health.status === 'ok' ? 'default' : 'destructive'}>
              n8n {health.status === 'ok' ? 'Online' : 'Offline'}
            </Badge>
          )}
          <Button variant="outline" onClick={() => openModal('n8n-settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(overview.totalWorkflows)}</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(overview.activeWorkflows)} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Executions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(overview.totalExecutions)}</div>
            <p className="text-xs text-muted-foreground">
              Last 100 executions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overview.overallSuccessRate}%</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(overview.successfulExecutions)} successful
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Executions</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatNumber(overview.failedExecutions)}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Workflows */}
      <Card>
        <CardHeader>
          <CardTitle>Workflows</CardTitle>
          <CardDescription>
            n8n workflows and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Triggers</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflows?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No workflows found. Create workflows in your n8n instance to see them here.
                    </TableCell>
                  </TableRow>
                ) : (
                  workflows?.map((workflow) => (
                    <TableRow key={workflow.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{workflow.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {workflow.nodes?.length || 0} nodes
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={workflow.active ? "default" : "secondary"}>
                          {workflow.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(workflow.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono">
                          {workflow.nodes?.filter(n => n.type.includes('trigger')).length || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleWorkflow(workflow)}
                          >
                            {workflow.active ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExecuteWorkflow(workflow)}
                            disabled={!workflow.active}
                          >
                            <Activity className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openModal('workflow-details', { workflow })}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Executions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Executions</CardTitle>
          <CardDescription>
            Latest workflow execution results and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Execution</TableHead>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {executions?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No executions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  executions?.data?.map((execution) => {
                    const duration = execution.stoppedAt 
                      ? Math.round((new Date(execution.stoppedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000)
                      : null

                    return (
                      <TableRow
                        key={execution.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewExecution(execution)}
                      >
                        <TableCell>
                          <div className="font-mono text-sm">{execution.id.slice(0, 8)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {execution.workflowData?.name || 'Unknown'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(execution.status)}
                            <Badge variant={getStatusVariant(execution.status)}>
                              {execution.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDate(execution.startedAt)}
                        </TableCell>
                        <TableCell>
                          {duration ? (
                            <span className="font-mono">{duration}s</span>
                          ) : execution.status === 'running' ? (
                            <Badge variant="secondary">Running</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{execution.mode}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewExecution(execution)
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AutomationPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}