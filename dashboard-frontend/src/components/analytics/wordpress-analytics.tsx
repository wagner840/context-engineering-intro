'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Globe, 
  FileText, 
  Users, 
  MessageCircle,
  TrendingUp,
  Eye,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

interface WordPressAnalyticsProps {
  timeframe: string
  blogId: string
}

interface WordPressData {
  posts: {
    total: number
    published: number
    drafts: number
    scheduled: number
    most_viewed: {
      title: string
      views: number
      url: string
      comments: number
    }[]
  }
  comments: {
    total: number
    approved: number
    pending: number
    spam: number
    recent: {
      author: string
      content: string
      post_title: string
      date: string
      status: 'approved' | 'pending' | 'spam'
    }[]
  }
  users: {
    total: number
    admins: number
    editors: number
    authors: number
    contributors: number
    subscribers: number
  }
  performance: {
    server_response_time: number
    page_load_speed: number
    uptime_percentage: number
    database_queries: number
  }
  plugins: {
    active: number
    inactive: number
    updates_available: number
    problematic: string[]
  }
  security: {
    failed_logins: number
    blocked_ips: number
    last_backup: string
    ssl_status: boolean
  }
}

export function WordPressAnalytics({ timeframe, blogId }: WordPressAnalyticsProps) {
  const { data: wpData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['wordpress-analytics', timeframe, blogId],
    queryFn: async (): Promise<WordPressData> => {
      // Mock data for now - replace with actual WordPress API calls
      return {
        posts: {
          total: 247,
          published: 198,
          drafts: 34,
          scheduled: 15,
          most_viewed: [
            {
              title: 'Como investir em renda fixa: Guia completo 2024',
              views: 15420,
              url: '/como-investir-renda-fixa-2024',
              comments: 23
            },
            {
              title: 'Dicas de produtividade para home office',
              views: 12890,
              url: '/dicas-produtividade-home-office',
              comments: 18
            },
            {
              title: 'Receitas saudáveis para o café da manhã',
              views: 9856,
              url: '/receitas-saudaveis-cafe-manha',
              comments: 31
            }
          ]
        },
        comments: {
          total: 1847,
          approved: 1623,
          pending: 156,
          spam: 68,
          recent: [
            {
              author: 'João Silva',
              content: 'Excelente artigo! Muito útil para quem está começando...',
              post_title: 'Como investir em renda fixa: Guia completo 2024',
              date: '2024-01-15T10:30:00Z',
              status: 'approved'
            },
            {
              author: 'Maria Santos',
              content: 'Gostaria de ver mais conteúdo sobre criptomoedas...',
              post_title: 'Dicas de produtividade para home office',
              date: '2024-01-15T09:45:00Z',
              status: 'pending'
            }
          ]
        },
        users: {
          total: 145,
          admins: 3,
          editors: 8,
          authors: 12,
          contributors: 15,
          subscribers: 107
        },
        performance: {
          server_response_time: 1.2,
          page_load_speed: 2.8,
          uptime_percentage: 99.8,
          database_queries: 45
        },
        plugins: {
          active: 23,
          inactive: 7,
          updates_available: 4,
          problematic: ['Old Plugin v1.0', 'Security Issue Plugin']
        },
        security: {
          failed_logins: 12,
          blocked_ips: 3,
          last_backup: '2024-01-15T02:00:00Z',
          ssl_status: true
        }
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'spam':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!wpData) return null

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">WordPress Analytics</h3>
          <p className="text-gray-600">Métricas diretas do seu WordPress</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Sincronizar
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Admin WP
          </Button>
        </div>
      </div>

      {/* Cards de Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-blue-600" />
                Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wpData.posts.total}</div>
              <div className="text-xs text-gray-600 mt-1">
                {wpData.posts.published} publicados • {wpData.posts.drafts} rascunhos
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <MessageCircle className="h-4 w-4 text-green-600" />
                Comentários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wpData.comments.total}</div>
              <div className="text-xs text-gray-600 mt-1">
                {wpData.comments.pending} pendentes • {wpData.comments.spam} spam
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-purple-600" />
                Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wpData.users.total}</div>
              <div className="text-xs text-gray-600 mt-1">
                {wpData.users.subscribers} assinantes ativos
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-orange-600" />
                Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wpData.performance.uptime_percentage}%</div>
              <div className="text-xs text-gray-600 mt-1">
                {wpData.performance.server_response_time}s resposta média
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posts mais visualizados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Posts Mais Visualizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wpData.posts.most_viewed.map((post, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-2">{post.title}</h4>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comentários recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comentários Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wpData.comments.recent.map((comment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 border rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <Badge className={getStatusColor(comment.status)}>
                        {comment.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.date)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                    {comment.content}
                  </p>
                  <p className="text-xs text-gray-500">
                    em: {comment.post_title}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance do site */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance do Site
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Tempo de Resposta</span>
                  <span className="font-semibold">{wpData.performance.server_response_time}s</span>
                </div>
                <Progress 
                  value={Math.max(0, 100 - (wpData.performance.server_response_time * 20))} 
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Velocidade de Carregamento</span>
                  <span className="font-semibold">{wpData.performance.page_load_speed}s</span>
                </div>
                <Progress 
                  value={Math.max(0, 100 - (wpData.performance.page_load_speed * 10))} 
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Queries de Banco</span>
                  <span className="font-semibold">{wpData.performance.database_queries}</span>
                </div>
                <Progress 
                  value={Math.max(0, 100 - wpData.performance.database_queries)} 
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Uptime</span>
                  <span className="font-semibold">{wpData.performance.uptime_percentage}%</span>
                </div>
                <Progress value={wpData.performance.uptime_percentage} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status e Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Status & Segurança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Plugins Ativos</div>
                  <div className="font-semibold">{wpData.plugins.active}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Atualizações</div>
                  <div className="font-semibold text-orange-600">{wpData.plugins.updates_available}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Tentativas de Login</div>
                  <div className="font-semibold text-red-600">{wpData.security.failed_logins}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">IPs Bloqueados</div>
                  <div className="font-semibold">{wpData.security.blocked_ips}</div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">SSL Status</span>
                  <Badge className={wpData.security.ssl_status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {wpData.security.ssl_status ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Último Backup</div>
                <div className="font-semibold">{formatDate(wpData.security.last_backup)}</div>
              </div>
              
              {wpData.plugins.problematic.length > 0 && (
                <div>
                  <div className="text-sm text-gray-600 mb-2">Plugins Problemáticos</div>
                  <div className="space-y-1">
                    {wpData.plugins.problematic.map((plugin, index) => (
                      <Badge key={index} className="bg-red-100 text-red-800 text-xs">
                        {plugin}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}