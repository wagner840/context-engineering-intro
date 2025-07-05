'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, 
  Eye,
  Clock,
  TrendingUp,
  TrendingDown,
  Star,
  ExternalLink,
  Target,
  Users,
  BarChart3
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

interface ContentPerformanceProps {
  timeframe: string
  blogId: string
  detailed?: boolean
}

interface ContentData {
  top_posts: {
    id: string
    title: string
    url: string
    views: number
    unique_views: number
    avg_time_on_page: number
    bounce_rate: number
    social_shares: number
    comments: number
    likes: number
    published_date: string
    category: string
    author: string
    seo_score: number
    conversion_rate: number
  }[]
  categories: {
    name: string
    posts_count: number
    total_views: number
    avg_engagement: number
    growth: number
  }[]
  authors: {
    name: string
    posts_count: number
    total_views: number
    avg_engagement: number
    avg_seo_score: number
  }[]
  content_metrics: {
    total_posts: number
    total_views: number
    avg_time_on_page: number
    avg_words_per_post: number
    avg_seo_score: number
    engagement_rate: number
    social_shares_total: number
    comments_total: number
  }
  trending_topics: {
    topic: string
    mentions: number
    growth: number
    related_posts: number
  }[]
  publishing_schedule: {
    day_of_week: string
    posts_count: number
    avg_views: number
    optimal_time: string
  }[]
}

export function ContentPerformance({ timeframe, blogId, detailed = false }: ContentPerformanceProps) {
  const [sortBy, setSortBy] = useState('views')
  const [filterCategory, setFilterCategory] = useState('all')

  const { data: contentData, isLoading } = useQuery({
    queryKey: ['content-performance', timeframe, blogId, sortBy, filterCategory],
    queryFn: async (): Promise<ContentData> => {
      // Mock data for now - replace with actual API calls
      return {
        top_posts: [
          {
            id: '1',
            title: 'Como investir em renda fixa: Guia completo 2024',
            url: '/como-investir-renda-fixa-2024',
            views: 15420,
            unique_views: 12890,
            avg_time_on_page: 285,
            bounce_rate: 35.2,
            social_shares: 234,
            comments: 23,
            likes: 145,
            published_date: '2024-01-10T09:00:00Z',
            category: 'Finanças',
            author: 'Maria Silva',
            seo_score: 87,
            conversion_rate: 4.2
          },
          {
            id: '2',
            title: 'Dicas de produtividade para home office',
            url: '/dicas-produtividade-home-office',
            views: 12890,
            unique_views: 10234,
            avg_time_on_page: 245,
            bounce_rate: 41.8,
            social_shares: 189,
            comments: 18,
            likes: 98,
            published_date: '2024-01-08T14:30:00Z',
            category: 'Produtividade',
            author: 'João Santos',
            seo_score: 82,
            conversion_rate: 3.1
          },
          {
            id: '3',
            title: 'Receitas saudáveis para o café da manhã',
            url: '/receitas-saudaveis-cafe-manha',
            views: 9856,
            unique_views: 8234,
            avg_time_on_page: 189,
            bounce_rate: 38.6,
            social_shares: 267,
            comments: 31,
            likes: 203,
            published_date: '2024-01-05T11:15:00Z',
            category: 'Saúde',
            author: 'Ana Costa',
            seo_score: 85,
            conversion_rate: 2.8
          },
          {
            id: '4',
            title: 'Tutorial: Configurando seu primeiro blog WordPress',
            url: '/tutorial-configurar-blog-wordpress',
            views: 7543,
            unique_views: 6789,
            avg_time_on_page: 342,
            bounce_rate: 29.4,
            social_shares: 156,
            comments: 15,
            likes: 87,
            published_date: '2024-01-03T16:00:00Z',
            category: 'Tecnologia',
            author: 'Carlos Lima',
            seo_score: 91,
            conversion_rate: 5.7
          }
        ],
        categories: [
          { name: 'Finanças', posts_count: 23, total_views: 45672, avg_engagement: 6.8, growth: 12.4 },
          { name: 'Produtividade', posts_count: 18, total_views: 34521, avg_engagement: 5.2, growth: 8.7 },
          { name: 'Saúde', posts_count: 15, total_views: 28934, avg_engagement: 7.1, growth: 15.3 },
          { name: 'Tecnologia', posts_count: 12, total_views: 22156, avg_engagement: 4.9, growth: -2.1 }
        ],
        authors: [
          { name: 'Maria Silva', posts_count: 15, total_views: 56789, avg_engagement: 6.2, avg_seo_score: 85 },
          { name: 'João Santos', posts_count: 12, total_views: 43567, avg_engagement: 5.8, avg_seo_score: 82 },
          { name: 'Ana Costa', posts_count: 10, total_views: 38942, avg_engagement: 7.1, avg_seo_score: 87 },
          { name: 'Carlos Lima', posts_count: 8, total_views: 29456, avg_engagement: 5.4, avg_seo_score: 89 }
        ],
        content_metrics: {
          total_posts: 68,
          total_views: 234567,
          avg_time_on_page: 265,
          avg_words_per_post: 1247,
          avg_seo_score: 84.5,
          engagement_rate: 6.8,
          social_shares_total: 3456,
          comments_total: 234
        },
        trending_topics: [
          { topic: 'Investimento para iniciantes', mentions: 45, growth: 23.5, related_posts: 12 },
          { topic: 'Trabalho remoto', mentions: 38, growth: 18.2, related_posts: 8 },
          { topic: 'Alimentação saudável', mentions: 32, growth: 15.7, related_posts: 6 },
          { topic: 'WordPress', mentions: 28, growth: 12.1, related_posts: 4 }
        ],
        publishing_schedule: [
          { day_of_week: 'Segunda', posts_count: 12, avg_views: 8945, optimal_time: '09:00' },
          { day_of_week: 'Terça', posts_count: 15, avg_views: 12340, optimal_time: '10:30' },
          { day_of_week: 'Quarta', posts_count: 18, avg_views: 15678, optimal_time: '09:15' },
          { day_of_week: 'Quinta', posts_count: 14, avg_views: 11234, optimal_time: '14:00' },
          { day_of_week: 'Sexta', posts_count: 9, avg_views: 6789, optimal_time: '11:45' }
        ]
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600'
    if (growth < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-3 w-3 text-green-600" />
    if (growth < 0) return <TrendingDown className="h-3 w-3 text-red-600" />
    return null
  }

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!contentData) return null

  if (!detailed) {
    // Versão resumida para overview
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Performance de Conteúdo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Métricas resumidas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {contentData.content_metrics.total_posts}
                </div>
                <div className="text-sm text-gray-600">Posts Publicados</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {contentData.content_metrics.total_views.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Visualizações Totais</div>
              </div>
            </div>

            {/* Top 3 posts */}
            <div>
              <h5 className="font-medium mb-3">Top Posts</h5>
              <div className="space-y-2">
                {contentData.top_posts.slice(0, 3).map((post, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1 truncate">
                      <div className="font-medium text-sm truncate">{post.title}</div>
                      <div className="text-xs text-gray-600">{post.category}</div>
                    </div>
                    <div className="text-right ml-2">
                      <div className="font-semibold text-sm">{post.views.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">views</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Versão detalhada
  return (
    <div className="space-y-6">
      {/* Controles e filtros */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Performance Detalhada de Conteúdo</h3>
          <p className="text-gray-600">Análise completa do desempenho dos seus posts</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              {contentData.categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="views">Views</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="seo_score">SEO Score</SelectItem>
              <SelectItem value="date">Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Métricas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{contentData.content_metrics.total_posts}</div>
                  <div className="text-sm text-gray-600">Posts Publicados</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{contentData.content_metrics.total_views.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Views Totais</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{formatDuration(contentData.content_metrics.avg_time_on_page)}</div>
                  <div className="text-sm text-gray-600">Tempo Médio</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Target className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{contentData.content_metrics.avg_seo_score}</div>
                  <div className="text-sm text-gray-600">SEO Score Médio</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de posts */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Posts por Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentData.top_posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm line-clamp-2 mb-1">{post.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span>{post.category}</span>
                          <span>•</span>
                          <span>{post.author}</span>
                          <span>•</span>
                          <span>{formatDate(post.published_date)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge className={`${getSEOScoreColor(post.seo_score)}`}>
                          SEO: {post.seo_score}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Views</div>
                        <div className="font-semibold">{post.views.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Tempo</div>
                        <div className="font-semibold">{formatDuration(post.avg_time_on_page)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Rejeição</div>
                        <div className="font-semibold">{post.bounce_rate}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Shares</div>
                        <div className="font-semibold">{post.social_shares}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Comentários</div>
                        <div className="font-semibold">{post.comments}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Conversão</div>
                        <div className="font-semibold">{post.conversion_rate}%</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Performance por categoria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentData.categories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{category.name}</span>
                      <div className="flex items-center gap-1">
                        {getGrowthIcon(category.growth)}
                        <span className={`text-xs ${getGrowthColor(category.growth)}`}>
                          {category.growth > 0 ? '+' : ''}{category.growth}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{category.posts_count} posts</span>
                      <span>{category.total_views.toLocaleString()} views</span>
                    </div>
                    <Progress value={category.avg_engagement * 10} className="h-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top autores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Autores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contentData.authors.map((author, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{author.name}</span>
                      <Badge className={getSEOScoreColor(author.avg_seo_score)}>
                        SEO: {author.avg_seo_score}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <span>Posts: </span>
                        <span className="font-semibold">{author.posts_count}</span>
                      </div>
                      <div>
                        <span>Views: </span>
                        <span className="font-semibold">{author.total_views.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tópicos em alta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Tópicos em Alta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contentData.trending_topics.map((topic, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{topic.topic}</span>
                      <div className="flex items-center gap-1">
                        {getGrowthIcon(topic.growth)}
                        <span className={`text-xs ${getGrowthColor(topic.growth)}`}>
                          {topic.growth > 0 ? '+' : ''}{topic.growth}%
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      {topic.mentions} menções • {topic.related_posts} posts relacionados
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}