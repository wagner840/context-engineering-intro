'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Edit3, Eye, Trash2, Search, Filter, Calendar, User } from 'lucide-react'
import { useBlogPosts, useDeletePost } from '@/hooks/use-posts'
import { Loading } from '@/components/ui/loading'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface PostsListProps {
  blogId: string
  onEditPost: (postId: string) => void
}

export function PostsList({ blogId, onEditPost }: PostsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('date')
  
  const { data: posts, isLoading, error } = useBlogPosts(blogId)
  const deletePost = useDeletePost()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading text="Carregando posts..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar posts</h3>
          <p className="text-gray-600">Não foi possível carregar os posts do blog.</p>
        </div>
      </div>
    )
  }

  const filteredPosts = posts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'status':
        return a.status.localeCompare(b.status)
      case 'date':
      default:
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    }
  })

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      try {
        await deletePost.mutateAsync(postId)
      } catch (error) {
        console.error('Erro ao excluir post:', error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'publish':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'private':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'publish':
        return 'Publicado'
      case 'draft':
        return 'Rascunho'
      case 'pending':
        return 'Pendente'
      case 'private':
        return 'Privado'
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="publish">Publicados</SelectItem>
                <SelectItem value="draft">Rascunhos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="private">Privados</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Data de modificação</SelectItem>
                <SelectItem value="title">Título</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Posts */}
      <div className="grid gap-4">
        {sortedPosts.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum post encontrado
                </h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros de busca.' 
                    : 'Comece criando seu primeiro post.'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          sortedPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDistanceToNow(new Date(post.updated_at), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </div>
                      {post.author && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.author}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(post.status)}>
                    {getStatusLabel(post.status)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="mb-4">
                  <p className="text-gray-600 line-clamp-3">
                    {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                  </p>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditPost(post.id)}
                      className="flex items-center gap-1"
                    >
                      <Edit3 className="h-4 w-4" />
                      Editar
                    </Button>
                    
                    {post.status === 'publish' && post.wordpress_id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/posts/${post.wordpress_id}`, '_blank')}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Visualizar
                      </Button>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}