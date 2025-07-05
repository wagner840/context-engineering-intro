'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Blog, ContentPost, MainKeyword } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Globe, 
  ArrowLeft,
  Sync, 
  FileText, 
  Key, 
  Database,
  Wifi,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Users,
  Clock,
  Search,
  Upload,
  Download,
  RefreshCw,
  ExternalLink,
  Plus
} from 'lucide-react'

interface WordPressPost {
  id: number
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  status: string
  date: string
  modified: string
  slug: string
  link: string
  author: number
  featured_media: number
}

interface WordPressStats {
  total_posts: number
  published_posts: number
  draft_posts: number
  total_pages: number
  total_comments: number
  total_users: number
}

export default function BlogDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  
  // WordPress Integration State
  const [wpPosts, setWpPosts] = useState<WordPressPost[]>([])
  const [wpStats, setWpStats] = useState<WordPressStats | null>(null)
  const [wpConnectionStatus, setWpConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')
  const [syncing, setSyncing] = useState(false)
  
  // Supabase Data
  const [posts, setPosts] = useState<ContentPost[]>([])
  const [keywords, setKeywords] = useState<MainKeyword[]>([])

  useEffect(() => {
    if (id) {
      loadBlogData()
    }
  }, [id])

  const loadBlogData = async () => {
    try {
      setLoading(true)
      
      // Load blog info
      const { data: blogData, error: blogError } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single()

      if (blogError) throw blogError
      setBlog(blogData)

      // Load posts from Supabase
      const { data: postsData, error: postsError } = await supabase
        .from('content_posts')
        .select('*')
        .eq('blog_id', id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (postsError) console.error('Posts error:', postsError)
      else setPosts(postsData || [])

      // Load keywords from Supabase
      const { data: keywordsData, error: keywordsError } = await supabase
        .from('main_keywords')
        .select('*')
        .eq('blog_id', id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (keywordsError) console.error('Keywords error:', keywordsError)
      else setKeywords(keywordsData || [])

      // Test WordPress connection if configured
      if (blogData.settings && (blogData.settings as any).wordpress_url) {
        await testWordPressConnection(blogData)
      }

    } catch (err) {
      console.error('Error loading blog data:', err)
      setError('Erro ao carregar dados do blog')
    } finally {
      setLoading(false)
    }
  }

  const testWordPressConnection = async (blogData: Blog) => {
    try {
      setWpConnectionStatus('connecting')
      const settings = blogData.settings as any
      const wpUrl = settings?.wordpress_url
      
      if (!wpUrl) {
        setWpConnectionStatus('error')
        return
      }

      // Test WordPress REST API
      const postsUrl = `${wpUrl}/wp-json/wp/v2/posts?per_page=5`
      const response = await fetch(postsUrl)
      
      if (response.ok) {
        const postsData = await response.json()
        setWpPosts(postsData)
        setWpConnectionStatus('connected')
        
        // Get WordPress stats
        await getWordPressStats(wpUrl)
      } else {
        setWpConnectionStatus('error')
      }
    } catch (error) {
      console.error('WordPress connection test failed:', error)
      setWpConnectionStatus('error')
    }
  }

  const getWordPressStats = async (wpUrl: string) => {
    try {
      const [postsRes, pagesRes, usersRes] = await Promise.all([
        fetch(`${wpUrl}/wp-json/wp/v2/posts?per_page=1`),
        fetch(`${wpUrl}/wp-json/wp/v2/pages?per_page=1`),
        fetch(`${wpUrl}/wp-json/wp/v2/users?per_page=1`)
      ])

      const stats: WordPressStats = {
        total_posts: parseInt(postsRes.headers.get('X-WP-Total') || '0'),
        published_posts: 0,
        draft_posts: 0,
        total_pages: parseInt(pagesRes.headers.get('X-WP-Total') || '0'),
        total_comments: 0,
        total_users: parseInt(usersRes.headers.get('X-WP-Total') || '0')
      }

      setWpStats(stats)
    } catch (error) {
      console.error('Error getting WordPress stats:', error)
    }
  }

  const syncFromWordPress = async () => {
    if (!blog || wpConnectionStatus !== 'connected') return
    
    try {
      setSyncing(true)
      const settings = blog.settings as any
      const wpUrl = settings.wordpress_url
      
      // Fetch recent WordPress posts
      const response = await fetch(`${wpUrl}/wp-json/wp/v2/posts?per_page=10`)
      if (!response.ok) throw new Error('Failed to fetch WordPress posts')
      
      const wpPosts: WordPressPost[] = await response.json()
      
      // Insert/Update posts in Supabase
      for (const wpPost of wpPosts) {
        const postData = {
          blog_id: blog.id,
          title: wpPost.title.rendered,
          content: wpPost.content.rendered,
          excerpt: wpPost.excerpt.rendered,
          status: wpPost.status,
          slug: wpPost.slug,
          wordpress_post_id: wpPost.id,
          published_at: wpPost.status === 'publish' ? wpPost.date : null,
          author_id: 'default', // You might want to handle author mapping
          word_count: wpPost.content.rendered.replace(/<[^>]*>/g, '').split(' ').length,
          reading_time: Math.ceil(wpPost.content.rendered.replace(/<[^>]*>/g, '').split(' ').length / 200)
        }

        const { error } = await supabase
          .from('content_posts')
          .upsert(postData, { 
            onConflict: 'blog_id,wordpress_post_id',
            ignoreDuplicates: false 
          })

        if (error) {
          console.error('Error syncing post:', error)
        }
      }
      
      // Reload posts
      await loadBlogData()
      alert('✅ Sincronização concluída com sucesso!')
      
    } catch (error) {
      console.error('Sync error:', error)
      alert('❌ Erro na sincronização')
    } finally {
      setSyncing(false)
    }
  }

  const createSampleKeyword = async () => {
    try {
      const sampleKeyword = {
        blog_id: blog?.id,
        keyword: 'exemplo palavra-chave',
        msv: 1000,
        kw_difficulty: 45,
        cpc: 2.5,
        competition: 'MEDIUM' as const,
        search_intent: 'informational' as const,
        is_used: false,
        location: 'BR',
        language: 'pt-BR',
        search_limit: 100
      }

      const { error } = await supabase
        .from('main_keywords')
        .insert([sampleKeyword])

      if (error) throw error
      
      await loadBlogData()
      alert('✅ Palavra-chave de exemplo criada!')
    } catch (error) {
      console.error('Error creating keyword:', error)
      alert('❌ Erro ao criar palavra-chave')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Database className="h-6 w-6 animate-pulse" />
          <span>Carregando dados do blog...</span>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar blog</h2>
          <p className="text-muted-foreground mb-4">{error || 'Blog não encontrado'}</p>
          <Button onClick={() => router.push('/blogs')}>Voltar aos Blogs</Button>
        </div>
      </div>
    )
  }

  const settings = blog.settings as any

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.push('/blogs')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <Globe className="h-8 w-8" />
                <span>{blog.name}</span>
              </h1>
              <p className="text-muted-foreground">{blog.domain}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={blog.is_active ? "default" : "secondary"}>
              {blog.is_active ? (
                <><CheckCircle className="h-3 w-3 mr-1" /> Ativo</>
              ) : (
                <><AlertCircle className="h-3 w-3 mr-1" /> Inativo</>
              )}
            </Badge>
            
            <Badge variant={wpConnectionStatus === 'connected' ? "default" : "destructive"}>
              <Wifi className="h-3 w-3 mr-1" />
              WordPress {wpConnectionStatus === 'connected' ? 'Conectado' : 'Desconectado'}
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="wordpress">WordPress</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="keywords">Palavras-chave</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{posts.length}</p>
                      <p className="text-xs text-muted-foreground">Posts no Supabase</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Key className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{keywords.length}</p>
                      <p className="text-xs text-muted-foreground">Palavras-chave</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{wpStats?.total_posts || 0}</p>
                      <p className="text-xs text-muted-foreground">Posts WordPress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">{wpStats?.total_users || 0}</p>
                      <p className="text-xs text-muted-foreground">Usuários WordPress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Blog Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Blog</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome</Label>
                    <p className="text-sm mt-1">{blog.name}</p>
                  </div>
                  <div>
                    <Label>Domínio</Label>
                    <p className="text-sm mt-1">{blog.domain}</p>
                  </div>
                  <div>
                    <Label>Nicho</Label>
                    <p className="text-sm mt-1">{blog.niche || 'Não definido'}</p>
                  </div>
                  <div>
                    <Label>URL WordPress</Label>
                    <p className="text-sm mt-1">{settings?.wordpress_url || 'Não configurado'}</p>
                  </div>
                </div>
                
                {blog.description && (
                  <div>
                    <Label>Descrição</Label>
                    <p className="text-sm mt-1">{blog.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* WordPress Tab */}
          <TabsContent value="wordpress" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Integração WordPress</h3>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => testWordPressConnection(blog)}
                  disabled={!settings?.wordpress_url}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Testar Conexão
                </Button>
                <Button 
                  onClick={syncFromWordPress}
                  disabled={wpConnectionStatus !== 'connected' || syncing}
                >
                  {syncing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sync className="h-4 w-4 mr-2" />
                  )}
                  Sincronizar Posts
                </Button>
              </div>
            </div>

            {wpConnectionStatus === 'connected' && wpPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Posts Recentes do WordPress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {wpPosts.map((post) => (
                      <div key={post.id} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                        <p className="text-sm text-muted-foreground">
                          Status: {post.status} | {new Date(post.date).toLocaleDateString('pt-BR')}
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" variant="outline" onClick={() => window.open(post.link, '_blank')}>
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Ver Post
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {wpConnectionStatus === 'error' && (
              <Card>
                <CardContent className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Erro na Conexão WordPress</h3>
                  <p className="text-muted-foreground mb-4">
                    Verifique a URL e configurações do WordPress
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Conteúdo no Supabase</h3>
              <Badge>{posts.length} posts</Badge>
            </div>

            {posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{post.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {post.excerpt || 'Sem resumo'}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>Status: {post.status}</span>
                            <span>Palavras: {post.word_count}</span>
                            <span>Leitura: {post.reading_time}min</span>
                          </div>
                        </div>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum post encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Sincronize com o WordPress para importar posts
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Keywords Tab */}
          <TabsContent value="keywords" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Palavras-chave</h3>
              <div className="flex space-x-2">
                <Button onClick={createSampleKeyword}>
                  <Plus className="h-4 w-4 mr-2" />
                  Exemplo
                </Button>
              </div>
            </div>

            {keywords.length > 0 ? (
              <div className="space-y-4">
                {keywords.map((keyword) => (
                  <Card key={keyword.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{keyword.keyword}</h4>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <span>MSV: {keyword.msv || 'N/A'}</span>
                            <span>Dificuldade: {keyword.kw_difficulty || 'N/A'}</span>
                            <span>CPC: ${keyword.cpc || 'N/A'}</span>
                            <span>Competição: {keyword.competition || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={keyword.is_used ? 'default' : 'secondary'}>
                            {keyword.is_used ? 'Em uso' : 'Disponível'}
                          </Badge>
                          <Badge variant="outline">
                            {keyword.search_intent || 'N/A'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma palavra-chave encontrada</h3>
                  <p className="text-muted-foreground mb-4">
                    Adicione palavras-chave para começar a análise SEO
                  </p>
                  <Button onClick={createSampleKeyword}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Exemplo
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Real-time Status */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Dados em tempo real via Supabase</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function BlogDashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Blog info skeleton */}
      <div className="h-32 bg-muted/20 rounded-lg animate-pulse" />
      
      {/* Stats skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted/20 rounded-lg animate-pulse" />
        ))}
      </div>
      
      {/* Posts skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 bg-muted/20 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  )
}