'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Eye, 
  Users,
  Clock,
  Target,
  Globe,
  Download,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

interface BlogAnalyticsProps {
  params: {
    id: string
  }
}

const analyticsData = {
  overview: {
    pageViews: 45230,
    uniqueVisitors: 28467,
    avgSessionDuration: 245,
    bounceRate: 42.3,
    pageViewsChange: 12.5,
    visitorsChange: 8.2,
    durationChange: -3.1,
    bounceRateChange: -5.7
  },
  topPages: [
    {
      page: '/guia-completo-seo-tecnico',
      title: 'Guia Completo de SEO Técnico',
      views: 5847,
      uniqueViews: 4231,
      avgTime: 342,
      bounceRate: 28.5
    },
    {
      page: '/automacao-wordpress-n8n',
      title: 'Automação WordPress com n8n',
      views: 4156,
      uniqueViews: 3289,
      avgTime: 267,
      bounceRate: 35.2
    },
    {
      page: '/core-web-vitals-otimizacao',
      title: 'Core Web Vitals: Otimização Completa',
      views: 3742,
      uniqueViews: 2891,
      avgTime: 298,
      bounceRate: 31.7
    },
    {
      page: '/javascript-seo-spa',
      title: 'JavaScript SEO para SPAs',
      views: 2934,
      uniqueViews: 2156,
      avgTime: 234,
      bounceRate: 45.8
    }
  ],
  keywords: [
    {
      keyword: 'seo técnico',
      position: 3.2,
      clicks: 1247,
      impressions: 8942,
      ctr: 13.9,
      change: 2
    },
    {
      keyword: 'core web vitals',
      position: 7.8,
      clicks: 892,
      impressions: 12456,
      ctr: 7.2,
      change: -1
    },
    {
      keyword: 'automação wordpress',
      position: 12.5,
      clicks: 634,
      impressions: 9823,
      ctr: 6.5,
      change: 5
    },
    {
      keyword: 'javascript seo',
      position: 15.2,
      clicks: 423,
      impressions: 7621,
      ctr: 5.5,
      change: -3
    }
  ],
  traffic: {
    organic: 68.2,
    direct: 18.5,
    social: 8.3,
    referral: 3.8,
    email: 1.2
  },
  devices: {
    desktop: 54.3,
    mobile: 38.7,
    tablet: 7.0
  }
}

export default function BlogAnalyticsPage({ params }: BlogAnalyticsProps) {
  const [dateRange, setDateRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
    return num.toString()
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-3 w-3 text-green-500" />
    if (change < 0) return <ArrowDown className="h-3 w-3 text-red-500" />
    return null
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getPositionChange = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-500" />
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-500" />
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics do Blog</h1>
              <p className="text-gray-600">ID: {params.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="1y">Último ano</option>
            </select>
            <Button variant="outline" onClick={refreshData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visualizações</p>
                <p className="text-2xl font-bold">{formatNumber(analyticsData.overview.pageViews)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getChangeIcon(analyticsData.overview.pageViewsChange)}
                  <span className={`text-sm ${getChangeColor(analyticsData.overview.pageViewsChange)}`}>
                    {Math.abs(analyticsData.overview.pageViewsChange)}%
                  </span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visitantes Únicos</p>
                <p className="text-2xl font-bold">{formatNumber(analyticsData.overview.uniqueVisitors)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getChangeIcon(analyticsData.overview.visitorsChange)}
                  <span className={`text-sm ${getChangeColor(analyticsData.overview.visitorsChange)}`}>
                    {Math.abs(analyticsData.overview.visitorsChange)}%
                  </span>
                </div>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Duração Média</p>
                <p className="text-2xl font-bold">{formatDuration(analyticsData.overview.avgSessionDuration)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getChangeIcon(analyticsData.overview.durationChange)}
                  <span className={`text-sm ${getChangeColor(analyticsData.overview.durationChange)}`}>
                    {Math.abs(analyticsData.overview.durationChange)}%
                  </span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Rejeição</p>
                <p className="text-2xl font-bold">{analyticsData.overview.bounceRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  {getChangeIcon(analyticsData.overview.bounceRateChange)}
                  <span className={`text-sm ${getChangeColor(analyticsData.overview.bounceRateChange)}`}>
                    {Math.abs(analyticsData.overview.bounceRateChange)}%
                  </span>
                </div>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="pages">Páginas</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="traffic">Tráfego</TabsTrigger>
          <TabsTrigger value="devices">Dispositivos</TabsTrigger>
        </TabsList>

        {/* Top Pages */}
        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Páginas Mais Visitadas</CardTitle>
                  <CardDescription>
                    Performance das páginas nos últimos {dateRange === '7d' ? '7 dias' : dateRange === '30d' ? '30 dias' : dateRange === '90d' ? '90 dias' : 'ano'}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topPages.map((page, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{page.title}</h4>
                        <p className="text-sm text-gray-600 font-mono">{page.page}</p>
                      </div>
                      <Badge variant="outline">#{index + 1}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Visualizações</p>
                        <p className="font-semibold">{page.views.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Únicos</p>
                        <p className="font-semibold">{page.uniqueViews.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tempo Médio</p>
                        <p className="font-semibold">{formatDuration(page.avgTime)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Rejeição</p>
                        <p className="font-semibold">{page.bounceRate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keywords Performance */}
        <TabsContent value="keywords">
          <Card>
            <CardHeader>
              <CardTitle>Performance de Keywords</CardTitle>
              <CardDescription>
                Posições e cliques das principais keywords
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.keywords.map((keyword, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-gray-900">{keyword.keyword}</h4>
                        {getPositionChange(keyword.change)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          Posição {keyword.position}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Cliques</p>
                        <p className="font-semibold">{keyword.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Impressões</p>
                        <p className="font-semibold">{keyword.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">CTR</p>
                        <p className="font-semibold">{keyword.ctr}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Mudança</p>
                        <p className={`font-semibold ${keyword.change > 0 ? 'text-green-600' : keyword.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {keyword.change > 0 ? '+' : ''}{keyword.change} pos
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traffic Sources */}
        <TabsContent value="traffic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fontes de Tráfego</CardTitle>
                <CardDescription>
                  Distribuição do tráfego por canal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Busca Orgânica</span>
                    </div>
                    <span className="font-semibold">{analyticsData.traffic.organic}%</span>
                  </div>
                  <Progress value={analyticsData.traffic.organic} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Direto</span>
                    </div>
                    <span className="font-semibold">{analyticsData.traffic.direct}%</span>
                  </div>
                  <Progress value={analyticsData.traffic.direct} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Redes Sociais</span>
                    </div>
                    <span className="font-semibold">{analyticsData.traffic.social}%</span>
                  </div>
                  <Progress value={analyticsData.traffic.social} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Referências</span>
                    </div>
                    <span className="font-semibold">{analyticsData.traffic.referral}%</span>
                  </div>
                  <Progress value={analyticsData.traffic.referral} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">E-mail</span>
                    </div>
                    <span className="font-semibold">{analyticsData.traffic.email}%</span>
                  </div>
                  <Progress value={analyticsData.traffic.email} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insights de Tráfego</CardTitle>
                <CardDescription>
                  Análises e recomendações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Crescimento Orgânico</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Tráfego orgânico cresceu 12.5% comparado ao período anterior
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">Melhoria na Rejeição</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Taxa de rejeição diminuiu 5.7%, indicando melhor engajamento
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-900">Oportunidade Social</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        Considere aumentar presença em redes sociais para diversificar tráfego
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Device Analytics */}
        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Análise por Dispositivo</CardTitle>
              <CardDescription>
                Performance do site em diferentes dispositivos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <Globe className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold mb-2">Desktop</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {analyticsData.devices.desktop}%
                  </div>
                  <p className="text-sm text-gray-600">dos visitantes</p>
                </div>

                <div className="text-center p-6 border rounded-lg">
                  <Globe className="h-8 w-8 mx-auto mb-3 text-green-600" />
                  <h3 className="font-semibold mb-2">Mobile</h3>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {analyticsData.devices.mobile}%
                  </div>
                  <p className="text-sm text-gray-600">dos visitantes</p>
                </div>

                <div className="text-center p-6 border rounded-lg">
                  <Globe className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                  <h3 className="font-semibold mb-2">Tablet</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {analyticsData.devices.tablet}%
                  </div>
                  <p className="text-sm text-gray-600">dos visitantes</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Recomendações</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Priorize otimizações para desktop (54.3% dos usuários)</li>
                  <li>• Melhore a experiência mobile para aumentar engajamento</li>
                  <li>• Teste responsividade em diferentes tamanhos de tela</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}