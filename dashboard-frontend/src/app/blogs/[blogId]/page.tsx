'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useBlog } from '@/hooks/use-blogs'
import { useBlogRealtime } from '@/hooks/use-realtime'
import { useExecutiveDashboardSingle } from '@/hooks/use-dashboard'
import { useBlogStore } from '@/store/blog-store'
import { formatDate, formatNumber, formatCurrency } from '@/lib/utils'
import { Settings, ExternalLink } from 'lucide-react'

export default function BlogDetailPage() {
  const params = useParams()
  const blogId = params?.blogId as string
  
  const { data: blog, isLoading: blogLoading, error: blogError } = useBlog(blogId)
  const { data: dashboardData, isLoading: dashboardLoading } = useExecutiveDashboardSingle(blog?.name || '')
  const { selectBlog } = useBlogStore()
  
  // Real-time subscriptions for this blog
  useBlogRealtime(blogId)

  useEffect(() => {
    if (blog) {
      selectBlog(blog)
    }
  }, [blog, selectBlog])

  if (blogLoading) {
    return <BlogDetailSkeleton />
  }

  if (blogError || !blog) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Blog Details</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">
              {blogError ? `Error loading blog: ${blogError.message}` : 'Blog not found'}
            </p>
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
          <h1 className="text-3xl font-bold">{blog.name}</h1>
          <p className="text-muted-foreground">{blog.domain}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={blog.is_active ? "default" : "secondary"}>
            {blog.is_active ? 'Active' : 'Inactive'}
          </Badge>
          {blog.niche && (
            <Badge variant="outline">{blog.niche}</Badge>
          )}
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={`https://${blog.domain}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Site
            </a>
          </Button>
        </div>
      </div>

      {/* Blog Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Information</CardTitle>
          <CardDescription>
            Basic information and configuration for this blog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Domain</h4>
              <p className="font-mono">{blog.domain}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Niche</h4>
              <p>{blog.niche || 'Not specified'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Status</h4>
              <Badge variant={blog.is_active ? "default" : "secondary"}>
                {blog.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Created</h4>
              <p>{formatDate(blog.created_at)}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Last Updated</h4>
              <p>{formatDate(blog.updated_at)}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Settings</h4>
              <p className="text-sm text-muted-foreground">
                {Object.keys(blog.settings || {}).length} configured
              </p>
            </div>
          </div>
          
          {blog.description && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Description</h4>
              <p>{blog.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      {dashboardLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : dashboardData ? (
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Key performance indicators for this blog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Total Keywords</h4>
                <p className="text-2xl font-bold">{formatNumber(dashboardData.total_keywords)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(dashboardData.total_variations)} variations
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Content Posts</h4>
                <p className="text-2xl font-bold">{formatNumber(dashboardData.total_posts)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(dashboardData.published_posts)} published
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Opportunities</h4>
                <p className="text-2xl font-bold">{formatNumber(dashboardData.total_opportunities)}</p>
                <p className="text-xs text-muted-foreground">
                  Content opportunities
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Clusters</h4>
                <p className="text-2xl font-bold">{formatNumber(dashboardData.total_clusters)}</p>
                <p className="text-xs text-muted-foreground">
                  Keyword clusters
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-4">Average Metrics</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Search Volume:</span>
                  <span className="font-mono">{formatNumber(Math.round(dashboardData.avg_msv))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Keyword Difficulty:</span>
                  <span className="font-mono">{Math.round(dashboardData.avg_difficulty)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cost Per Click:</span>
                  <span className="font-mono">{formatCurrency(dashboardData.avg_cpc)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <h3 className="font-medium mb-2">Keywords</h3>
            <p className="text-sm text-muted-foreground">
              Manage keyword research and opportunities
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <h3 className="font-medium mb-2">Content</h3>
            <p className="text-sm text-muted-foreground">
              View content pipeline and production
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <h3 className="font-medium mb-2">SERP Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Analyze search engine results
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <h3 className="font-medium mb-2">Automation</h3>
            <p className="text-sm text-muted-foreground">
              Monitor n8n workflows
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function BlogDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}