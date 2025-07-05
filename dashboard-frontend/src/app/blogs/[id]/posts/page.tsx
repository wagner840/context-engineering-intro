'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ContentPost } from '@/types/database-extended'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  FileText, 
  Plus, 
  Search, 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Globe,
  RefreshCw,
  ArrowLeft
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function PostsPage() {
  const { id: blogId } = useParams()
  const router = useRouter()
  
  const [posts, setPosts] = useState<ContentPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (blogId) {
      loadPosts()
    }
  }, [blogId])

  const loadPosts = async () => {
    setLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('content_posts')
        .select('*')
        .eq('blog_id', blogId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (err) {
      console.error('Erro ao carregar posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      published: 'default',
      draft: 'secondary',
      scheduled: 'outline',
      trash: 'destructive'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-muted/20 rounded animate-pulse" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted/20 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/blogs')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Gerenciar Posts</h1>
            <p className="text-muted-foreground">
              {filteredPosts.length} posts encontrados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={loadPosts} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={() => router.push(`/blogs/${blogId}/posts/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Post
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="all">Todos os status</option>
          <option value="published">Publicados</option>
          <option value="draft">Rascunhos</option>
          <option value="scheduled">Agendados</option>
        </select>
      </div>

      {/* Lista de Posts */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum post encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando seu primeiro post
            </p>
            <Button onClick={() => router.push(`/blogs/${blogId}/posts/new`)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Post
            </Button>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{post.title}</h3>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    {getStatusBadge(post.status)}
                    <span>{post.word_count || 0} palavras</span>
                    <span>{post.reading_time || 0}min leitura</span>
                    {post.wordpress_post_id && (
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        WP #{post.wordpress_post_id}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/blogs/${blogId}/posts/${post.id}/view`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/blogs/${blogId}/posts/${post.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {post.wordpress_post_id && (
                        <DropdownMenuItem
                          onClick={() => window.open(post.slug, '_blank')}
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Ver no WordPress
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}