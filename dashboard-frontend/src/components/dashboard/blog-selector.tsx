'use client'

import { useEffect } from 'react'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useBlogs, useBlogRealtime } from '@/hooks/use-blogs'
import { useBlogStore } from '@/store/blog-store'
import { useModals } from '@/store/ui-store'

export function BlogSelector() {
  const { data: blogs, isLoading, error } = useBlogs()
  const { selectedBlog, selectBlog } = useBlogStore()
  const { openModal } = useModals()
  const { subscribe } = useBlogRealtime()

  useEffect(() => {
    const unsubscribe = subscribe()
    return unsubscribe
  }, [subscribe])

  useEffect(() => {
    // Auto-select first blog if none selected and blogs are available
    if (!selectedBlog && blogs && blogs.length > 0) {
      selectBlog(blogs[0])
    }
  }, [blogs, selectedBlog, selectBlog])

  const handleBlogChange = (blogId: string) => {
    const blog = blogs?.find(b => b.id === blogId)
    if (blog) {
      selectBlog(blog)
    }
  }

  const handleCreateBlog = () => {
    openModal('create-blog')
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-destructive">Failed to load blogs: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Active Blog:</span>
            <Select
              value={selectedBlog?.id || ''}
              onValueChange={handleBlogChange}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select a blog...">
                  {selectedBlog && (
                    <div className="flex items-center space-x-2">
                      <span>{selectedBlog.name}</span>
                      {selectedBlog.niche && (
                        <Badge variant="outline" className="text-xs">
                          {selectedBlog.niche}
                        </Badge>
                      )}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {blogs?.map((blog) => (
                  <SelectItem key={blog.id} value={blog.id}>
                    <div className="flex items-center space-x-2">
                      <span>{blog.name}</span>
                      {blog.niche && (
                        <Badge variant="outline" className="text-xs">
                          {blog.niche}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            {selectedBlog && (
              <>
                <Badge variant={selectedBlog.is_active ? "default" : "secondary"}>
                  {selectedBlog.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModal('edit-blog', { blog: selectedBlog })}
                >
                  Settings
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateBlog}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Blog
            </Button>
          </div>
        </div>

        {selectedBlog && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Domain:</span>
                <p className="font-mono">{selectedBlog.domain}</p>
              </div>
              {selectedBlog.description && (
                <div className="md:col-span-2">
                  <span className="text-muted-foreground">Description:</span>
                  <p className="truncate">{selectedBlog.description}</p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Created:</span>
                <p>{new Date(selectedBlog.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}