'use client'

import { useState } from 'react'
import { Plus, Search, Settings, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useBlogs } from '@/hooks/use-blogs'
import { useBlogStore } from '@/store/blog-store'
import { useModals } from '@/store/ui-store'
import { formatDate } from '@/lib/utils'

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: blogs, isLoading, error } = useBlogs()
  const { selectedBlog, selectBlog } = useBlogStore()
  const { openModal } = useModals()

  const filteredBlogs = blogs?.filter(blog =>
    blog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blog.niche && blog.niche.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleCreateBlog = () => {
    openModal('create-blog')
  }

  const handleEditBlog = (blog: any) => {
    openModal('edit-blog', { blog })
  }

  const handleDeleteBlog = (blog: any) => {
    openModal('delete-blog', { blog })
  }

  const handleSelectBlog = (blog: any) => {
    selectBlog(blog)
  }

  if (isLoading) {
    return <BlogsPageSkeleton />
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Blog Management</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading blogs: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-muted-foreground">
            Manage your WordPress blogs and their configurations
          </p>
        </div>
        <Button onClick={handleCreateBlog}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Blog
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogs?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {blogs?.filter(b => b.is_active).length || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Niches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(blogs?.filter(b => b.niche).map(b => b.niche)).size || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Different content niches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected Blog</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">
              {selectedBlog?.name || 'None'}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedBlog?.niche || 'No niche'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Blogs</CardTitle>
          <CardDescription>
            All WordPress blogs in your content management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blogs by name, domain, or niche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Blogs Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Blog</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Niche</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlogs?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {searchTerm ? 'No blogs match your search.' : 'No blogs found.'}
                      <div className="mt-2">
                        <Button variant="outline" onClick={handleCreateBlog}>
                          Create your first blog
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBlogs?.map((blog) => (
                    <TableRow
                      key={blog.id}
                      className={`cursor-pointer hover:bg-muted/50 ${
                        selectedBlog?.id === blog.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => handleSelectBlog(blog)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{blog.name}</div>
                          {blog.description && (
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {blog.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm">{blog.domain}</code>
                      </TableCell>
                      <TableCell>
                        {blog.niche ? (
                          <Badge variant="outline">{blog.niche}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={blog.is_active ? "default" : "secondary"}>
                          {blog.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(blog.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditBlog(blog)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              openModal('blog-settings', { blog })
                            }}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteBlog(blog)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
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
    </div>
  )
}

function BlogsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
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
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}