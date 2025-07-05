'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBlog } from '@/contexts/blog-context'
import { BlogSelector } from '@/components/common/blog-selector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Globe, 
  Settings, 
  ExternalLink,
  Database,
  Wifi,
  FileText,
  Key,
  TrendingUp
} from 'lucide-react'

interface BlogStats {
  posts: number
  keywords: number
  wpConnection: 'connected' | 'disconnected' | 'checking'
  wpPosts: number
  lastSync?: string
}

export default function BlogsPage() {
  const router = useRouter()
  const { activeBlog, blogs } = useBlog()
  const [blogStats, setBlogStats] = useState<Record<string, BlogStats>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBlogStats()
  }, [activeBlog])

  const loadBlogStats = async () => {
    setLoading(true)
    try {
      // Simular carregamento de estatísticas
      const stats: Record<string, BlogStats> = {}
      
      for (const blog of blogs) {
        // Testar conexão WordPress
        try {
          const response = await fetch(`${blog.wordpress_url}/wp-json/wp/v2/posts?per_page=1`)
          const wpPosts = response.ok ? parseInt(response.headers.get('X-WP-Total') || '0') : 0
          
          stats[blog.id] = {
            posts: Math.floor(Math.random() * 50) + 10, // Simular posts no Supabase
            keywords: Math.floor(Math.random() * 100) + 20, // Simular keywords
            wpConnection: response.ok ? 'connected' : 'disconnected',
            wpPosts,
            lastSync: new Date().toISOString()
          }
        } catch (error) {
          stats[blog.id] = {
            posts: 0,
            keywords: 0,
            wpConnection: 'disconnected',
            wpPosts: 0
          }
        }
      }
      
      setBlogStats(stats)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const testWordPressConnection = async (blogId: string) => {
    const blog = blogs.find(b => b.id === blogId)
    if (!blog) return

    setBlogStats(prev => ({
      ...prev,
      [blogId]: { ...prev[blogId], wpConnection: 'checking' }
    }))

    try {
      const response = await fetch(`${blog.wordpress_url}/wp-json/wp/v2/posts?per_page=1`)
      const wpPosts = response.ok ? parseInt(response.headers.get('X-WP-Total') || '0') : 0
      
      setBlogStats(prev => ({
        ...prev,
        [blogId]: {
          ...prev[blogId],
          wpConnection: response.ok ? 'connected' : 'disconnected',
          wpPosts,
          lastSync: new Date().toISOString()
        }
      }))

      if (response.ok) {
        alert(`✅ Conexão com ${blog.name} funcionando! ${wpPosts} posts encontrados.`)
      } else {
        alert(`❌ Erro na conexão com ${blog.name}`)
      }
    } catch (error) {
      setBlogStats(prev => ({
        ...prev,
        [blogId]: { ...prev[blogId], wpConnection: 'disconnected' }
      }))
      alert(`❌ Erro ao conectar com ${blog.name}`)
    }
  }

  const getDisplayBlogs = () => {
    if (activeBlog === 'all') return blogs
    return activeBlog ? [activeBlog] : []
  }

  const displayBlogs = getDisplayBlogs()

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header com seletor */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Gerenciamento de Blogs</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Gerencie seus blogs WordPress com integrações em tempo real
              </p>
            </div>
            
            {/* Ações rápidas no mobile */}
            <div className="flex items-center gap-2 sm:hidden">
              <Button 
                size="sm" 
                onClick={() => loadBlogStats()}
                variant="outline"
              >
                <Database className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Seletor de blog - mobile first */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 max-w-sm">
              <BlogSelector 
                size="md" 
                showDescription={true}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => loadBlogStats()}
                variant="outline"
                size="sm"
                className="hidden sm:flex"
              >
                <Database className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              
              <Badge variant="outline" className="text-xs">
                {activeBlog === 'all' ? `${blogs.length} blogs` : '1 blog selecionado'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Grid de blogs */}
        {loading ? (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: displayBlogs.length || 2 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayBlogs.map((blog) => {
              const stats = blogStats[blog.id] || {
                posts: 0,
                keywords: 0,
                wpConnection: 'disconnected' as const,
                wpPosts: 0
              }

              return (
                <Card key={blog.id} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{blog.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{blog.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{blog.domain}</p>
                        </div>
                      </div>
                      
                      <Badge 
                        variant={stats.wpConnection === 'connected' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        <Wifi className="h-3 w-3 mr-1" />
                        {stats.wpConnection === 'connected' ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Niche */}
                    <div>
                      <Badge 
                        variant="secondary" 
                        className={`
                          ${blog.color === 'blue' ? 'bg-blue-100 text-blue-700' : ''}
                          ${blog.color === 'green' ? 'bg-green-100 text-green-700' : ''}
                        `}
                      >
                        {blog.niche}
                      </Badge>
                    </div>

                    {/* Descrição */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {blog.description}
                    </p>

                    {/* Estatísticas */}
                    <div className="grid grid-cols-2 gap-4 py-3 border-t border-b">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-lg font-bold text-blue-600">{stats.posts}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Posts Supabase</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Key className="h-4 w-4 text-green-600" />
                          <span className="text-lg font-bold text-green-600">{stats.keywords}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Keywords</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Globe className="h-4 w-4 text-purple-600" />
                          <span className="text-lg font-bold text-purple-600">{stats.wpPosts}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Posts WP</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp className="h-4 w-4 text-orange-600" />
                          <span className="text-lg font-bold text-orange-600">85%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">SEO Score</p>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/blogs/${blog.id}`)}
                        className="h-9"
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Gerenciar
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testWordPressConnection(blog.id)}
                        disabled={stats.wpConnection === 'checking'}
                        className="h-9"
                      >
                        <Wifi className="h-3 w-3 mr-1" />
                        {stats.wpConnection === 'checking' ? 'Testando...' : 'Testar WP'}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`https://${blog.domain}`, '_blank')}
                        className="h-9"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visitar Site
                      </Button>
                    </div>

                    {/* Última sincronização */}
                    {stats.lastSync && (
                      <div className="text-center pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          Última atualização: {new Date(stats.lastSync).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Status geral */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Sistema de blogs nativos ativo</span>
          </div>
        </div>
      </div>
    </div>
  )
}