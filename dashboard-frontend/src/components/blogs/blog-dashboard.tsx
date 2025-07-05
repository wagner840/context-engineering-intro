'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { 
  Globe,
  FileText,
  Target,
  TrendingUp,
  Calendar,
  Eye,
  Edit,
  ExternalLink,
  BarChart3,
  Clock,
  Settings,
  RefreshCw,
  Plus
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface BlogDashboardProps {
  blogId: string
}

interface BlogData {
  id: string
  name: string
  url: string
  niche: string
  description: string
  status: string
  wordpress_config: {
    api_url: string
    username: string
  }
  stats: {
    total_posts: number
    published_posts: number
    draft_posts: number
    total_keywords: number
    opportunities: number
    last_post_date?: string
  }
}

interface Post {
  id: string
  title: string
  status: 'draft' | 'publish' | 'private'
  published_at?: string
  created_at: string
  updated_at: string
  target_keywords?: string[]
  wordpress_id?: number
  excerpt?: string
}

function BlogInfoCard({ blog }: { blog: BlogData }) {
  const router = useRouter()
  
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">{blog.name}</CardTitle>
              <CardDescription>{blog.description}</CardDescription>
            </div>
          </div>
          <Badge variant={blog.status === 'active' ? 'default' : 'secondary'}>
            {blog.status === 'active' ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ExternalLink className="h-4 w-4" />
          <a 
            href={blog.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            {blog.url}
          </a>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Target className="h-4 w-4" />
          <span>Nicho: {blog.niche}</span>
        </div>

        {blog.stats.last_post_date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              Último post: {formatDistanceToNow(new Date(blog.stats.last_post_date), { 
                addSuffix: true,
                locale: ptBR 
              })}
            </span>
          </div>
        )}

        {/* Ações do Blog */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/blogs/${blog.id}/posts`)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Ver Posts
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/blogs/${blog.id}/posts?edit=new`)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Post
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/blogs/${blog.id}/sync`)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sincronização
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/blogs/${blog.id}/settings`)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function StatsGrid({ stats }: { stats: BlogData['stats'] }) {
  const statsData = [
    {
      title: 'Total de Posts',
      value: stats.total_posts,
      description: `${stats.published_posts} publicados, ${stats.draft_posts} rascunhos`,
      icon: FileText,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Keywords',
      value: stats.total_keywords,
      description: 'Palavras-chave configuradas',
      icon: Target,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Oportunidades',
      value: stats.opportunities,
      description: 'Ideias para novos posts',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

function PostsList({ blogId }: { blogId: string }) {
  const router = useRouter()
  
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts', blogId],
    queryFn: async (): Promise<Post[]> => {
      const response = await fetch(`/api/wordpress/posts?blog_id=${blogId}&limit=10`)
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      const result = await response.json()
      return result.data || []
    }
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'publish':
        return <Badge className="bg-green-100 text-green-800">Publicado</Badge>
      case 'draft':
        return <Badge variant="secondary">Rascunho</Badge>
      case 'private':
        return <Badge variant="outline">Privado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleEditPost = (postId: string) => {
    router.push(`/blogs/${blogId}/posts/${postId}/edit`)
  }

  const handleViewPost = (post: Post) => {
    router.push(`/blogs/${blogId}/posts/${post.id}`)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 bg-muted/20 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-center p-12">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Nenhum post encontrado</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Comece criando seu primeiro post para este blog
              </p>
            </div>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Criar Post
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium line-clamp-1">{post.title}</h3>
                    {getStatusBadge(post.status)}
                    {post.wordpress_id && (
                      <Badge variant="outline" className="text-xs">
                        WP: {post.wordpress_id}
                      </Badge>
                    )}
                  </div>
                  
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(post.created_at), { 
                        addSuffix: true,
                        locale: ptBR 
                      })}
                    </div>
                    
                    {post.target_keywords && post.target_keywords.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {post.target_keywords.length} keyword{post.target_keywords.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewPost(post)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditPost(post.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export function BlogDashboard({ blogId }: BlogDashboardProps) {
  const { data: blogData, isLoading, error } = useQuery({
    queryKey: ['blog-dashboard', blogId],
    queryFn: async (): Promise<BlogData> => {
      const response = await fetch(`/api/dashboard/blog-stats?blog_id=${blogId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch blog data')
      }
      const result = await response.json()
      return result.blog
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !blogData) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="flex items-center justify-center p-12">
          <div className="text-center space-y-2">
            <p className="text-destructive font-medium">
              Erro ao carregar dados do blog
            </p>
            <p className="text-sm text-muted-foreground">
              Verifique se o blog existe e tente novamente
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Blog Info */}
      <BlogInfoCard blog={blogData} />

      {/* Stats Grid */}
      <StatsGrid stats={blogData.stats} />

      <Separator />

      {/* Posts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Posts Recentes</h2>
            <p className="text-sm text-muted-foreground">
              Últimos posts criados neste blog
            </p>
          </div>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Ver Todos
          </Button>
        </div>

        <PostsList blogId={blogId} />
      </div>
    </div>
  )
}