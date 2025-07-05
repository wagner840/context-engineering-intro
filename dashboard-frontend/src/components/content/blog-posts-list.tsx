'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Eye, 
  Edit, 
  Trash2, 
  Search, 
  ExternalLink,
  Calendar,
  Target
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useWordPressEditor } from '@/hooks/use-wordpress-integration'

interface BlogPost {
  id: string
  title: string
  excerpt?: string
  status: 'draft' | 'publish' | 'private'
  wordpress_id?: number
  target_keywords?: string[]
  published_at?: string
  updated_at: string
  blogs?: {
    name: string
    url: string
  }
}

interface BlogPostsListProps {
  blogId: string
  initialPosts: BlogPost[]
  currentStatus: string
}

export function BlogPostsList({ blogId, initialPosts, currentStatus }: BlogPostsListProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const { removePost } = useWordPressEditor()

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleEdit = (postId: string) => {
    router.push(`/blogs/${blogId}/posts/${postId}/edit`)
  }

  const handlePreview = (post: BlogPost) => {
    router.push(`/blogs/${blogId}/posts/${post.id}/preview`)
  }

  const handleDelete = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setIsLoading(true)
      try {
        await removePost()
        setPosts(posts.filter(p => p.id !== postId))
      } catch (error) {
        console.error('Failed to delete post:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'publish':
        return <Badge variant="default" className="bg-green-100 text-green-800">Published</Badge>
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      case 'private':
        return <Badge variant="outline">Private</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const refreshPosts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/wordpress/posts?blog_id=${blogId}&status=${statusFilter}`)
      if (response.ok) {
        const result = await response.json()
        setPosts(result.data || [])
      }
    } catch (error) {
      console.error('Failed to refresh posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="publish">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={refreshPosts} disabled={isLoading}>
          Refresh
        </Button>
      </div>

      {/* Posts Table */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all' 
              ? 'No posts match your filters.' 
              : 'No posts yet. Create your first post!'
            }
          </div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Keywords</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{post.title}</div>
                    {post.excerpt && (
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-2">
                    {getStatusBadge(post.status)}
                    {post.wordpress_id && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        WP: {post.wordpress_id}
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  {post.target_keywords && post.target_keywords.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {post.target_keywords.slice(0, 3).map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Target className="h-3 w-3 mr-1" />
                          {keyword}
                        </Badge>
                      ))}
                      {post.target_keywords.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.target_keywords.length - 3}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">No keywords</span>
                  )}
                </TableCell>
                
                <TableCell>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(post.updated_at), { addSuffix: true })}
                    </div>
                    {post.published_at && post.status === 'publish' && (
                      <div className="text-xs text-green-600">
                        Published {formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(post.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(post)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}