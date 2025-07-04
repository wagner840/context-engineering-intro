'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Settings, Trash2, Edit, Globe, Activity, TrendingUp, Calendar, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, AnimatedCard } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useBlogs } from '@/hooks/use-blogs'
import { useBlogStore } from '@/store/blog-store'
import { useModals } from '@/store/ui-store'
import { formatDate } from '@/lib/utils'
import { Loading } from '@/components/ui/loading'

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen"
      >
        <div className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b">
          <div className="container mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold">Gerenciamento de Blogs</h1>
          </div>
        </div>
        <div className="container mx-auto px-6 py-8">
          <Card variant="glass">
            <CardContent className="pt-6">
              <p className="text-destructive">Erro ao carregar blogs: {error.message}</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {/* Page Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b">
        <div className="container mx-auto px-6 py-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gradient">Gerenciamento de Blogs</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie seus sites WordPress e suas configurações
              </p>
            </div>
            <Button 
              onClick={handleCreateBlog}
              variant="gradient"
              leftIcon={<Plus className="h-4 w-4" />}
              className="btn-glow"
            >
              Adicionar Blog
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loading variant="spinner" size="lg" text="Carregando blogs..." />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Statistics Cards */}
            <motion.div 
              variants={itemVariants}
              className="grid gap-4 md:grid-cols-3"
            >
              <AnimatedCard variant="glass" delay={0}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Blogs</CardTitle>
                  <Globe className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{blogs?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {blogs?.filter(b => b.is_active).length || 0} ativos
                  </p>
                </CardContent>
              </AnimatedCard>

              <AnimatedCard variant="glass" delay={100}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Nichos Ativos</CardTitle>
                  <TrendingUp className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {new Set(blogs?.filter(b => b.niche).map(b => b.niche)).size || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Diferentes nichos de conteúdo
                  </p>
                </CardContent>
              </AnimatedCard>

              <AnimatedCard variant="glass" delay={200}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blog Selecionado</CardTitle>
                  <Activity className="h-4 w-4 text-info" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold truncate">
                    {selectedBlog?.name || 'Nenhum'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedBlog?.niche || 'Selecione um blog'}
                  </p>
                </CardContent>
              </AnimatedCard>
            </motion.div>

            {/* Search and Filters */}
            <motion.div variants={itemVariants}>
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Blogs</CardTitle>
                  <CardDescription>
                    Todos os blogs WordPress no seu sistema de gerenciamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar blogs por nome, domínio ou nicho..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-background/50"
                      />
                    </div>
                  </div>

                  {/* Blogs Grid */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredBlogs?.length === 0 ? (
                      <div className="col-span-full text-center py-12">
                        <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">
                          {searchTerm ? 'Nenhum blog corresponde à sua busca.' : 'Nenhum blog encontrado.'}
                        </p>
                        <Button variant="gradient" onClick={handleCreateBlog}>
                          Criar seu primeiro blog
                        </Button>
                      </div>
                    ) : (
                      filteredBlogs?.map((blog, index) => (
                        <motion.div
                          key={blog.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card
                            variant={selectedBlog?.id === blog.id ? "gradient" : "default"}
                            interactive
                            glow={selectedBlog?.id === blog.id}
                            className="h-full cursor-pointer group"
                            onClick={() => handleSelectBlog(blog)}
                          >
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    {blog.name}
                                    {blog.is_active && (
                                      <Badge variant="success" className="text-xs">
                                        Ativo
                                      </Badge>
                                    )}
                                  </CardTitle>
                                  <CardDescription className="mt-1">
                                    <a 
                                      href={`https://${blog.domain}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {blog.domain}
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {blog.niche && (
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {blog.niche}
                                  </Badge>
                                </div>
                              )}
                              
                              {blog.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {blog.description}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Criado em {formatDate(blog.created_at)}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </main>
    </motion.div>
  )
}

function BlogsPageSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} variant="glass">
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

        <Card variant="glass">
          <CardHeader>
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full mb-6" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}