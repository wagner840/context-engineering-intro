'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Globe,
  ExternalLink,
  Settings,
  BarChart3,
  FileText,
  Target,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

interface Blog {
  id: string
  name: string
  url: string
  niche: string
  description: string
  status: 'active' | 'inactive' | 'suspended'
  wordpress_config: {
    api_url: string
    username: string
  }
  n8n_config?: {
    webhook_url: string
    workflow_id: string
  }
  created_at: string
  stats?: {
    posts_count: number
    keywords_count: number
    opportunities_count: number
  }
}

function BlogCard({ blog, delay = 0 }: { blog: Blog; delay?: number }) {
  const router = useRouter()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inativo</Badge>
      case 'suspended':
        return <Badge variant="destructive">Suspenso</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleSelectBlog = () => {
    router.push(`/blogs/${blog.id}`)
  }

  const handleViewPosts = () => {
    router.push(`/blogs/${blog.id}/posts`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all" />
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {blog.name}
                </CardTitle>
                {getStatusBadge(blog.status)}
              </div>
              <CardDescription className="line-clamp-2">
                {blog.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Blog Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ExternalLink className="h-4 w-4" />
              <a 
                href={blog.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors truncate"
              >
                {blog.url}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>Nicho: {blog.niche}</span>
            </div>
          </div>

          {/* Stats */}
          {blog.stats && (
            <div className="grid grid-cols-3 gap-2 py-2 border-t border-b">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">
                  {blog.stats.posts_count}
                </div>
                <div className="text-xs text-muted-foreground">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {blog.stats.keywords_count}
                </div>
                <div className="text-xs text-muted-foreground">Keywords</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">
                  {blog.stats.opportunities_count}
                </div>
                <div className="text-xs text-muted-foreground">Oportunidades</div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              onClick={handleSelectBlog}
              className="flex-1"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Selecionar
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleViewPosts}
            >
              <FileText className="h-4 w-4 mr-2" />
              Posts
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function BlogCardSkeleton() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center space-y-1">
              <Skeleton className="h-6 w-8 mx-auto" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-12" />
        </div>
      </CardContent>
    </Card>
  )
}

export function BlogsList() {
  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: async (): Promise<Blog[]> => {
      const response = await fetch('/api/blogs?active=true')
      if (!response.ok) {
        throw new Error('Failed to fetch blogs')
      }
      const result = await response.json()
      return result.data || []
    }
  })

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="flex items-center justify-center p-12">
          <div className="text-center space-y-2">
            <p className="text-destructive font-medium">
              Erro ao carregar blogs
            </p>
            <p className="text-sm text-muted-foreground">
              Verifique sua conexão e tente novamente
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!blogs || blogs.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-center p-12">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Globe className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Nenhum blog configurado</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Configure seu primeiro blog WordPress para começar a gerenciar conteúdo
              </p>
            </div>
            <Button>
              <Globe className="h-4 w-4 mr-2" />
              Adicionar Blog
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Seus Blogs</h2>
          <p className="text-sm text-muted-foreground">
            {blogs.length} blog{blogs.length !== 1 ? 's' : ''} configurado{blogs.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog, index) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  )
}