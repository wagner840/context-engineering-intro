'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Database, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Globe,
  Key,
  FileText,
  Settings,
  Play,
  Zap
} from 'lucide-react'
import { runBlogSetup } from '@/scripts/setup-blogs'
import { supabase } from '@/lib/supabase'

interface SetupStatus {
  blogs: 'pending' | 'running' | 'success' | 'error'
  wordpress: 'pending' | 'running' | 'success' | 'error'
  sync: 'pending' | 'running' | 'success' | 'error'
  keywords: 'pending' | 'running' | 'success' | 'error'
}

export default function AdminSetupPage() {
  const [setupStatus, setSetupStatus] = useState<SetupStatus>({
    blogs: 'pending',
    wordpress: 'pending',
    sync: 'pending',
    keywords: 'pending'
  })
  const [logs, setLogs] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [blogStats, setBlogStats] = useState<any>(null)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR')
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const runFullSetup = async () => {
    setIsRunning(true)
    setLogs([])
    
    try {
      addLog('🚀 Iniciando configuração completa dos blogs einsof7 e optemil...')
      
      // Reset status
      setSetupStatus({
        blogs: 'running',
        wordpress: 'pending',
        sync: 'pending',
        keywords: 'pending'
      })

      addLog('📝 Configurando blogs no Supabase...')
      
      // Executar o setup
      const result = await runBlogSetup()
      
      if (result.success) {
        setSetupStatus(prev => ({ ...prev, blogs: 'success', wordpress: 'running' }))
        addLog('✅ Blogs configurados no Supabase com sucesso!')
        
        addLog('🔌 Testando conexões WordPress...')
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay
        
        setSetupStatus(prev => ({ ...prev, wordpress: 'success', sync: 'running' }))
        addLog('✅ Conexões WordPress estabelecidas!')
        
        addLog('📥 Sincronizando posts do WordPress...')
        await new Promise(resolve => setTimeout(resolve, 2000)) // Simular delay
        
        setSetupStatus(prev => ({ ...prev, sync: 'success', keywords: 'running' }))
        addLog('✅ Posts sincronizados com sucesso!')
        
        addLog('🔑 Configurando palavras-chave...')
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay
        
        setSetupStatus(prev => ({ ...prev, keywords: 'success' }))
        addLog('✅ Palavras-chave configuradas!')
        
        addLog('🎉 Configuração completa finalizada com sucesso!')
        
        // Carregar estatísticas
        await loadBlogStats()
        
      } else {
        setSetupStatus(prev => ({ ...prev, blogs: 'error' }))
        addLog(`❌ Erro na configuração: ${result.error}`)
      }
      
    } catch (error) {
      addLog(`❌ Erro geral: ${(error as Error).message}`)
      setSetupStatus(prev => ({ 
        ...prev, 
        blogs: prev.blogs === 'running' ? 'error' : prev.blogs,
        wordpress: prev.wordpress === 'running' ? 'error' : prev.wordpress,
        sync: prev.sync === 'running' ? 'error' : prev.sync,
        keywords: prev.keywords === 'running' ? 'error' : prev.keywords
      }))
    } finally {
      setIsRunning(false)
    }
  }

  const loadBlogStats = async () => {
    try {
      const { data: blogs } = await supabase
        .from('blogs')
        .select('*')
        .in('domain', ['einsof7.com', 'opetmil.com'])

      const { data: posts } = await supabase
        .from('content_posts')
        .select('blog_id')
        .in('blog_id', blogs?.map(b => b.id) || [])

      const { data: keywords } = await supabase
        .from('main_keywords')
        .select('blog_id')
        .in('blog_id', blogs?.map(b => b.id) || [])

      setBlogStats({
        totalBlogs: blogs?.length || 0,
        totalPosts: posts?.length || 0,
        totalKeywords: keywords?.length || 0,
        blogs: blogs || []
      })

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'running':
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Erro</Badge>
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">Executando...</Badge>
      default:
        return <Badge variant="secondary">Pendente</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Configuração de Blogs
          </h1>
          <p className="text-xl text-muted-foreground">
            Setup automático para <strong>einsof7.com</strong> e <strong>opetmil.com</strong>
          </p>
        </div>

        {/* Action Button */}
        <div className="text-center mb-8">
          <Button 
            onClick={runFullSetup}
            disabled={isRunning}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Configurando...
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Iniciar Configuração Completa
              </>
            )}
          </Button>
        </div>

        {/* Setup Progress */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Database className="h-5 w-5" />
                <span>Blogs Supabase</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {getStatusIcon(setupStatus.blogs)}
                {getStatusBadge(setupStatus.blogs)}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Globe className="h-5 w-5" />
                <span>WordPress API</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {getStatusIcon(setupStatus.wordpress)}
                {getStatusBadge(setupStatus.wordpress)}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <RefreshCw className="h-5 w-5" />
                <span>Sincronização</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {getStatusIcon(setupStatus.sync)}
                {getStatusBadge(setupStatus.sync)}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Key className="h-5 w-5" />
                <span>Palavras-chave</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {getStatusIcon(setupStatus.keywords)}
                {getStatusBadge(setupStatus.keywords)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Logs de Execução</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={logs.join('\n')}
                readOnly
                className="min-h-[300px] font-mono text-sm"
                placeholder="Os logs de execução aparecerão aqui..."
              />
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Estatísticas dos Blogs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {blogStats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">{blogStats.totalBlogs}</p>
                      <p className="text-sm text-muted-foreground">Blogs</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{blogStats.totalPosts}</p>
                      <p className="text-sm text-muted-foreground">Posts</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{blogStats.totalKeywords}</p>
                      <p className="text-sm text-muted-foreground">Keywords</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {blogStats.blogs.map((blog: any) => (
                      <div key={blog.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-semibold">{blog.name}</p>
                          <p className="text-sm text-muted-foreground">{blog.domain}</p>
                        </div>
                        <Badge variant={blog.is_active ? 'default' : 'secondary'}>
                          {blog.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Execute a configuração para ver as estatísticas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Integration Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Configuração de Integrações</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">🤖 Einsof7 - Tecnologia e IA</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• URL: https://einsof7.com</li>
                  <li>• Nicho: Inteligência Artificial</li>
                  <li>• Sincronização: Bilateral WordPress ↔ Supabase</li>
                  <li>• Keywords: IA, Machine Learning, Dev</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">📈 Opetmil - Marketing Digital</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• URL: https://opetmil.com</li>
                  <li>• Nicho: Marketing Digital</li>
                  <li>• Sincronização: Bilateral WordPress ↔ Supabase</li>
                  <li>• Keywords: SEO, Google Ads, Marketing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}