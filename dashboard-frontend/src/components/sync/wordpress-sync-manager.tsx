'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { useBlog } from '@/contexts/blog-context'
import { 
  RefreshCw, 
  Upload, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Zap,
  Database,
  Globe
} from 'lucide-react'

interface SyncLog {
  id: string
  blog_id: string
  sync_type: string
  status: string
  details: any
  created_at: string
}

// SyncResult interface moved to hook for reusability

export function WordPressSyncManager() {
  const { activeBlog } = useBlog()
  const [syncProgress, setSyncProgress] = useState(0)
  const [autoSync, setAutoSync] = useState(false)

  // Fetch sync logs
  const { data: syncLogs, refetch: refetchLogs } = useQuery({
    queryKey: ['sync-logs', activeBlog === 'all' ? null : (activeBlog as any)?.id],
    queryFn: async () => {
      if (!activeBlog || activeBlog === 'all') return []
      const response = await fetch(`/api/sync/logs?blog_id=${(activeBlog as any).id}`)
      if (!response.ok) throw new Error('Failed to fetch sync logs')
      return response.json()
    },
    enabled: !!activeBlog && activeBlog !== 'all'
  })

  // Sync mutation
  const syncMutation = useMutation({
    mutationFn: async ({ direction }: { direction: string }) => {
      if (!activeBlog || activeBlog === 'all') {
        throw new Error('Please select a blog')
      }

      const response = await fetch('/api/sync/wordpress-to-supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogId: activeBlog.id,
          direction
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Sync failed')
      }

      return response.json()
    },
    onSuccess: () => {
      refetchLogs()
      setSyncProgress(100)
      setTimeout(() => setSyncProgress(0), 2000)
    },
    onError: (error) => {
      console.error('Sync error:', error)
      setSyncProgress(0)
    }
  })

  const handleSync = (direction: string) => {
    setSyncProgress(10)
    syncMutation.mutate({ direction })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />
      case 'running': return <Clock className="w-4 h-4 text-blue-500" />
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getSyncTypeColor = (type: string) => {
    switch (type) {
      case 'wp_to_supabase': return 'bg-blue-100 text-blue-800'
      case 'supabase_to_wp': return 'bg-green-100 text-green-800'
      case 'webhook_wp_to_supabase': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSyncTypeLabel = (type: string) => {
    switch (type) {
      case 'wp_to_supabase': return 'WP → Supabase'
      case 'supabase_to_wp': return 'Supabase → WP'
      case 'webhook_wp_to_supabase': return 'WP Webhook'
      default: return type
    }
  }

  if (!activeBlog || activeBlog === 'all') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>WordPress Sync Manager</CardTitle>
          <CardDescription>
            Please select a specific blog to manage synchronization
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sync Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            WordPress Synchronization
          </CardTitle>
          <CardDescription>
            Manage bilateral synchronization between WordPress and Supabase for {activeBlog.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          {syncProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Synchronizing...</span>
                <span>{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="w-full" />
            </div>
          )}

          {/* Sync Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="font-medium">WordPress → Supabase</span>
              </div>
              <p className="text-sm text-gray-600">
                Import posts and media from WordPress to Supabase
              </p>
              <Button
                onClick={() => handleSync('wp_to_supabase')}
                disabled={syncMutation.isPending}
                className="w-full"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                {syncMutation.isPending ? 'Syncing...' : 'Import from WordPress'}
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span className="font-medium">Supabase → WordPress</span>
              </div>
              <p className="text-sm text-gray-600">
                Export posts from Supabase to WordPress
              </p>
              <Button
                onClick={() => handleSync('supabase_to_wp')}
                disabled={syncMutation.isPending}
                className="w-full"
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                {syncMutation.isPending ? 'Syncing...' : 'Export to WordPress'}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Auto Sync Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">
                Auto Sync (Webhooks)
              </label>
              <p className="text-xs text-gray-600">
                Automatically sync changes from WordPress via webhooks
              </p>
            </div>
            <Switch
              checked={autoSync}
              onCheckedChange={setAutoSync}
            />
          </div>

          {/* Webhook URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Webhook URL</label>
            <code className="block p-2 bg-gray-100 rounded text-xs">
              {process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'}/api/sync/wordpress-webhook
            </code>
            <p className="text-xs text-gray-600">
              Configure this URL in your WordPress webhook settings
            </p>
          </div>

          {/* Error Display */}
          {syncMutation.error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                {syncMutation.error.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Success Display */}
          {syncMutation.isSuccess && syncMutation.data && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {syncMutation.data.message}
                <br />
                Posts synced: {syncMutation.data.results.posts_synced}
                {syncMutation.data.results.media_synced > 0 && (
                  <>, Media synced: {syncMutation.data.results.media_synced}</>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Sync History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Sync History
          </CardTitle>
          <CardDescription>
            Recent synchronization operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {syncLogs && syncLogs.length > 0 ? (
            <div className="space-y-3">
              {syncLogs.slice(0, 10).map((log: SyncLog) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(log.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSyncTypeColor(log.sync_type)}>
                          {getSyncTypeLabel(log.sync_type)}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      {log.details && (
                        <div className="text-xs text-gray-500 mt-1">
                          {log.details.posts_synced !== undefined && (
                            <span>Posts: {log.details.posts_synced}</span>
                          )}
                          {log.details.media_synced !== undefined && (
                            <span>, Media: {log.details.media_synced}</span>
                          )}
                          {log.details.post_title && (
                            <span> - {log.details.post_title}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No sync history available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}