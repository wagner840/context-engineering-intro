'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Blog } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { 
  Globe, 
  Plus, 
  Search, 
  Settings, 
  ExternalLink,
  Database,
  Wifi,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2
} from 'lucide-react'

export default function BlogsPage() {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Form state for new blog
  const [newBlog, setNewBlog] = useState({
    name: '',
    domain: '',
    niche: '',
    description: '',
    is_active: true,
    settings: {
      wordpress_url: '',
      wordpress_username: '',
      wordpress_app_password: '',
      auto_sync: false,
      seo_enabled: true
    }
  })

  // Load blogs from Supabase
  useEffect(() => {
    loadBlogs()
  }, [])

  const loadBlogs = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBlogs(data || [])
    } catch (err) {
      console.error('Error loading blogs:', err)
      setError('Erro ao carregar blogs')
    } finally {
      setLoading(false)
    }
  }

  const testWordPressConnection = async (blog: Blog) => {
    try {
      const settings = blog.settings as any
      const wpUrl = settings?.wordpress_url
      
      if (!wpUrl) {
        alert('URL do WordPress não configurada')
        return
      }

      // Test WordPress REST API
      const testUrl = `${wpUrl}/wp-json/wp/v2/posts?per_page=1`
      const response = await fetch(testUrl)
      
      if (response.ok) {
        alert('✅ Conexão com WordPress funcionando!')
      } else {
        alert('❌ Erro na conexão com WordPress')
      }
    } catch (error) {
      console.error('WordPress connection test failed:', error)
      alert('❌ Erro ao testar conexão com WordPress')
    }
  }

  const createBlog = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .insert([{
          ...newBlog,
          settings: newBlog.settings
        }])
        .select()
        .single()

      if (error) throw error

      setBlogs([data, ...blogs])
      setShowAddForm(false)
      setNewBlog({
        name: '',
        domain: '',
        niche: '',
        description: '',
        is_active: true,
        settings: {
          wordpress_url: '',
          wordpress_username: '',
          wordpress_app_password: '',
          auto_sync: false,
          seo_enabled: true
        }
      })
      
      alert('✅ Blog criado com sucesso!')
    } catch (error) {
      console.error('Error creating blog:', error)
      alert('❌ Erro ao criar blog')
    }
  }

  const toggleBlogStatus = async (blog: Blog) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ is_active: !blog.is_active })
        .eq('id', blog.id)

      if (error) throw error

      setBlogs(blogs.map(b => 
        b.id === blog.id ? { ...b, is_active: !b.is_active } : b
      ))
    } catch (error) {
      console.error('Error updating blog status:', error)
      alert('❌ Erro ao atualizar status do blog')
    }
  }

  const filteredBlogs = blogs.filter(blog =>
    blog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blog.niche && blog.niche.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Database className="h-6 w-6 animate-pulse" />
          <span>Carregando blogs do Supabase...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erro ao conectar com Supabase</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadBlogs}>Tentar Novamente</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blogs WordPress</h1>
            <p className="text-muted-foreground">
              Gerencie seus blogs WordPress com integrações em tempo real
            </p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Blog
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Add Blog Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Adicionar Novo Blog</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Blog</Label>
                  <Input
                    id="name"
                    value={newBlog.name}
                    onChange={(e) => setNewBlog({...newBlog, name: e.target.value})}
                    placeholder="Meu Blog Incrível"
                  />
                </div>
                <div>
                  <Label htmlFor="domain">Domínio</Label>
                  <Input
                    id="domain"
                    value={newBlog.domain}
                    onChange={(e) => setNewBlog({...newBlog, domain: e.target.value})}
                    placeholder="meublog.com"
                  />
                </div>
                <div>
                  <Label htmlFor="niche">Nicho</Label>
                  <Input
                    id="niche"
                    value={newBlog.niche}
                    onChange={(e) => setNewBlog({...newBlog, niche: e.target.value})}
                    placeholder="Tecnologia, Saúde, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="wp_url">URL do WordPress</Label>
                  <Input
                    id="wp_url"
                    value={newBlog.settings.wordpress_url}
                    onChange={(e) => setNewBlog({
                      ...newBlog, 
                      settings: {...newBlog.settings, wordpress_url: e.target.value}
                    })}
                    placeholder="https://meublog.com"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newBlog.description}
                  onChange={(e) => setNewBlog({...newBlog, description: e.target.value})}
                  placeholder="Descrição do blog..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newBlog.is_active}
                  onCheckedChange={(checked) => setNewBlog({...newBlog, is_active: checked})}
                />
                <Label htmlFor="active">Blog ativo</Label>
              </div>

              <div className="flex space-x-2">
                <Button onClick={createBlog}>Criar Blog</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum blog encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {blogs.length === 0 
                ? 'Crie seu primeiro blog para começar'
                : 'Nenhum blog corresponde à sua busca'
              }
            </p>
            {blogs.length === 0 && (
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Blog
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <Card key={blog.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Globe className="h-5 w-5" />
                        <span>{blog.name}</span>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {blog.domain}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={blog.is_active ? "default" : "secondary"}>
                        {blog.is_active ? (
                          <><CheckCircle className="h-3 w-3 mr-1" /> Ativo</>
                        ) : (
                          <><AlertCircle className="h-3 w-3 mr-1" /> Inativo</>
                        )}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {blog.niche && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">NICHO</span>
                      <p className="text-sm">{blog.niche}</p>
                    </div>
                  )}
                  
                  {blog.description && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">DESCRIÇÃO</span>
                      <p className="text-sm line-clamp-2">{blog.description}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/blogs/${blog.id}`)}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Gerenciar
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testWordPressConnection(blog)}
                    >
                      <Wifi className="h-3 w-3 mr-1" />
                      Testar WP
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`https://${blog.domain}`, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visitar
                    </Button>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <Button
                      size="sm"
                      variant={blog.is_active ? "destructive" : "default"}
                      onClick={() => toggleBlogStatus(blog)}
                    >
                      {blog.is_active ? 'Desativar' : 'Ativar'}
                    </Button>
                    
                    <span className="text-xs text-muted-foreground">
                      Criado: {new Date(blog.created_at!).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Connection Status */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Conectado ao Supabase</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function BlogsLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-32 bg-muted/20 rounded-lg animate-pulse" />
      ))}
    </div>
  )
}