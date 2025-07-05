'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Target,
  Eye,
  MousePointer,
  AlertCircle,
  Zap,
  BarChart3,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

interface SEOAnalyticsProps {
  timeframe: string
  blogId: string
}

interface SEOData {
  overview: {
    avg_position: number
    total_keywords: number
    keywords_in_top_10: number
    keywords_in_top_3: number
    total_clicks: number
    total_impressions: number
    avg_ctr: number
    organic_traffic: number
  }
  keyword_rankings: {
    keyword: string
    position: number
    previous_position: number
    clicks: number
    impressions: number
    ctr: number
    volume: number
    difficulty: number
    url: string
  }[]
  top_pages: {
    page: string
    clicks: number
    impressions: number
    ctr: number
    avg_position: number
    keywords_count: number
  }[]
  technical_seo: {
    page_speed_score: number
    mobile_friendly_score: number
    core_web_vitals: {
      lcp: number // Largest Contentful Paint
      fid: number // First Input Delay
      cls: number // Cumulative Layout Shift
    }
    indexing_issues: number
    crawl_errors: number
    broken_links: number
    duplicate_content: number
  }
  competitors: {
    domain: string
    visibility_score: number
    common_keywords: number
    avg_position: number
    traffic_estimate: number
  }[]
  content_gaps: {
    keyword: string
    competitor_position: number
    our_position: number | null
    opportunity_score: number
    search_volume: number
  }[]
  featured_snippets: {
    keyword: string
    snippet_type: 'paragraph' | 'list' | 'table' | 'video'
    current_owner: string
    opportunity: boolean
  }[]
}

export function SEOAnalytics({ timeframe, blogId }: SEOAnalyticsProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const { data: seoData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['seo-analytics', timeframe, blogId],
    queryFn: async (): Promise<SEOData> => {
      // Mock data for now - replace with actual Search Console and SEO tools API calls
      return {
        overview: {
          avg_position: 15.4,
          total_keywords: 1247,
          keywords_in_top_10: 234,
          keywords_in_top_3: 89,
          total_clicks: 45623,
          total_impressions: 234567,
          avg_ctr: 4.2,
          organic_traffic: 18934
        },
        keyword_rankings: [
          {
            keyword: 'como investir dinheiro',
            position: 3,
            previous_position: 5,
            clicks: 1245,
            impressions: 15670,
            ctr: 7.9,
            volume: 18100,
            difficulty: 42,
            url: '/como-investir-renda-fixa-2024'
          },
          {
            keyword: 'produtividade home office',
            position: 7,
            previous_position: 12,
            clicks: 892,
            impressions: 12340,
            ctr: 7.2,
            volume: 8900,
            difficulty: 35,
            url: '/dicas-produtividade-home-office'
          },
          {
            keyword: 'receitas café da manhã saudável',
            position: 4,
            previous_position: 4,
            clicks: 734,
            impressions: 9876,
            ctr: 7.4,
            volume: 12400,
            difficulty: 28,
            url: '/receitas-saudaveis-cafe-manha'
          },
          {
            keyword: 'tutorial wordpress iniciantes',
            position: 2,
            previous_position: 3,
            clicks: 1567,
            impressions: 18945,
            ctr: 8.3,
            volume: 5600,
            difficulty: 38,
            url: '/tutorial-configurar-blog-wordpress'
          }
        ],
        top_pages: [
          {
            page: '/como-investir-renda-fixa-2024',
            clicks: 3456,
            impressions: 45678,
            ctr: 7.6,
            avg_position: 8.2,
            keywords_count: 89
          },
          {
            page: '/dicas-produtividade-home-office',
            clicks: 2134,
            impressions: 32456,
            ctr: 6.6,
            avg_position: 12.1,
            keywords_count: 67
          },
          {
            page: '/receitas-saudaveis-cafe-manha',
            clicks: 1987,
            impressions: 28934,
            ctr: 6.9,
            avg_position: 9.8,
            keywords_count: 54
          }
        ],
        technical_seo: {
          page_speed_score: 87,
          mobile_friendly_score: 92,
          core_web_vitals: {
            lcp: 2.1, // Good: <2.5s
            fid: 45,   // Good: <100ms
            cls: 0.08  // Good: <0.1
          },
          indexing_issues: 3,
          crawl_errors: 1,
          broken_links: 5,
          duplicate_content: 2
        },
        competitors: [
          {
            domain: 'investidor.me',
            visibility_score: 78.5,
            common_keywords: 234,
            avg_position: 12.3,
            traffic_estimate: 125000
          },
          {
            domain: 'blogprodutividade.com',
            visibility_score: 65.2,
            common_keywords: 189,
            avg_position: 15.7,
            traffic_estimate: 89000
          },
          {
            domain: 'vivasaudavel.net',
            visibility_score: 72.1,
            common_keywords: 156,
            avg_position: 11.9,
            traffic_estimate: 98000
          }
        ],
        content_gaps: [
          {
            keyword: 'investimento renda variável iniciantes',
            competitor_position: 4,
            our_position: null,
            opportunity_score: 85,
            search_volume: 12400
          },
          {
            keyword: 'ferramentas produtividade 2024',
            competitor_position: 6,
            our_position: 23,
            opportunity_score: 72,
            search_volume: 8900
          },
          {
            keyword: 'dieta mediterrânea benefícios',
            competitor_position: 3,
            our_position: null,
            opportunity_score: 68,
            search_volume: 15600
          }
        ],
        featured_snippets: [
          {
            keyword: 'como calcular rentabilidade investimento',
            snippet_type: 'paragraph',
            current_owner: 'investidor.me',
            opportunity: true
          },
          {
            keyword: 'lista ferramentas home office',
            snippet_type: 'list',
            current_owner: 'produtividade.com',
            opportunity: true
          },
          {
            keyword: 'tabela nutricional café da manhã',
            snippet_type: 'table',
            current_owner: 'nossa-domain.com',
            opportunity: false
          }
        ]
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  })

  const getPositionChange = (current: number, previous: number) => {
    const change = previous - current // Improvement means lower position number
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <ArrowUp className="h-3 w-3" />
          <span className="text-xs">+{change}</span>
        </div>
      )
    } else if (change < 0) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <ArrowDown className="h-3 w-3" />
          <span className="text-xs">{change}</span>
        </div>
      )
    }
    return (
      <div className="text-xs text-gray-500">-</div>
    )
  }

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-green-600'
    if (position <= 10) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 30) return 'bg-green-100 text-green-800'
    if (difficulty <= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getCoreWebVitalStatus = (metric: string, value: number) => {
    switch (metric) {
      case 'lcp':
        return value <= 2.5 ? 'good' : value <= 4.0 ? 'needs-improvement' : 'poor'
      case 'fid':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor'
      case 'cls':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor'
      default:
        return 'unknown'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600'
      case 'needs-improvement':
        return 'text-yellow-600'
      case 'poor':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!seoData) return null

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">SEO Analytics</h3>
          <p className="text-gray-600">Análise completa de performance SEO e rankings</p>
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
            Search Console
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-blue-600" />
                Posição Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{seoData.overview.avg_position}</div>
              <div className="text-xs text-gray-600 mt-1">
                {seoData.overview.keywords_in_top_10} no top 10
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Search className="h-4 w-4 text-green-600" />
                Keywords Totais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{seoData.overview.total_keywords.toLocaleString()}</div>
              <div className="text-xs text-gray-600 mt-1">
                {seoData.overview.keywords_in_top_3} no top 3
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <MousePointer className="h-4 w-4 text-purple-600" />
                Cliques Totais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{seoData.overview.total_clicks.toLocaleString()}</div>
              <div className="text-xs text-gray-600 mt-1">
                CTR: {seoData.overview.avg_ctr}%
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-orange-600" />
                Impressões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{seoData.overview.total_impressions.toLocaleString()}</div>
              <div className="text-xs text-gray-600 mt-1">
                Tráfego orgânico: {seoData.overview.organic_traffic.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs de Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-4xl grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="technical">Técnico</TabsTrigger>
          <TabsTrigger value="competitors">Competidores</TabsTrigger>
          <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top páginas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top Páginas SEO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {seoData.top_pages.map((page, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="font-medium text-sm mb-2 truncate">{page.page}</div>
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                        <div>
                          <span>Cliques: </span>
                          <span className="font-semibold">{page.clicks.toLocaleString()}</span>
                        </div>
                        <div>
                          <span>Impressões: </span>
                          <span className="font-semibold">{page.impressions.toLocaleString()}</span>
                        </div>
                        <div>
                          <span>CTR: </span>
                          <span className="font-semibold">{page.ctr}%</span>
                        </div>
                        <div>
                          <span>Keywords: </span>
                          <span className="font-semibold">{page.keywords_count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Core Web Vitals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Core Web Vitals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">LCP (Largest Contentful Paint)</span>
                      <span className={`font-semibold ${getStatusColor(getCoreWebVitalStatus('lcp', seoData.technical_seo.core_web_vitals.lcp))}`}>
                        {seoData.technical_seo.core_web_vitals.lcp}s
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">Objetivo: &lt; 2.5s</div>
                    <Progress 
                      value={Math.min(100, (2.5 / seoData.technical_seo.core_web_vitals.lcp) * 100)} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">FID (First Input Delay)</span>
                      <span className={`font-semibold ${getStatusColor(getCoreWebVitalStatus('fid', seoData.technical_seo.core_web_vitals.fid))}`}>
                        {seoData.technical_seo.core_web_vitals.fid}ms
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">Objetivo: &lt; 100ms</div>
                    <Progress 
                      value={Math.min(100, (100 / seoData.technical_seo.core_web_vitals.fid) * 100)} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">CLS (Cumulative Layout Shift)</span>
                      <span className={`font-semibold ${getStatusColor(getCoreWebVitalStatus('cls', seoData.technical_seo.core_web_vitals.cls))}`}>
                        {seoData.technical_seo.core_web_vitals.cls}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">Objetivo: &lt; 0.1</div>
                    <Progress 
                      value={Math.min(100, (0.1 / seoData.technical_seo.core_web_vitals.cls) * 100)} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rankings de Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seoData.keyword_rankings.map((keyword, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold">{keyword.keyword}</h4>
                        <div className="text-sm text-gray-600 truncate">{keyword.url}</div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge className={getDifficultyColor(keyword.difficulty)}>
                          KD: {keyword.difficulty}
                        </Badge>
                        {getPositionChange(keyword.position, keyword.previous_position)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Posição</div>
                        <div className={`font-bold text-lg ${getPositionColor(keyword.position)}`}>
                          {keyword.position}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Cliques</div>
                        <div className="font-semibold">{keyword.clicks.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Impressões</div>
                        <div className="font-semibold">{keyword.impressions.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">CTR</div>
                        <div className="font-semibold">{keyword.ctr}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Volume</div>
                        <div className="font-semibold">{keyword.volume.toLocaleString()}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scores técnicos */}
            <Card>
              <CardHeader>
                <CardTitle>Scores Técnicos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Page Speed Score</span>
                      <span className="font-bold">{seoData.technical_seo.page_speed_score}</span>
                    </div>
                    <Progress value={seoData.technical_seo.page_speed_score} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Mobile Friendly Score</span>
                      <span className="font-bold">{seoData.technical_seo.mobile_friendly_score}</span>
                    </div>
                    <Progress value={seoData.technical_seo.mobile_friendly_score} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Problemas técnicos */}
            <Card>
              <CardHeader>
                <CardTitle>Problemas Técnicos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Problemas de Indexação</span>
                    </div>
                    <Badge className={seoData.technical_seo.indexing_issues > 0 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
                      {seoData.technical_seo.indexing_issues}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Erros de Crawl</span>
                    </div>
                    <Badge className={seoData.technical_seo.crawl_errors > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                      {seoData.technical_seo.crawl_errors}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Links Quebrados</span>
                    </div>
                    <Badge className={seoData.technical_seo.broken_links > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                      {seoData.technical_seo.broken_links}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Conteúdo Duplicado</span>
                    </div>
                    <Badge className={seoData.technical_seo.duplicate_content > 0 ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}>
                      {seoData.technical_seo.duplicate_content}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Competidores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seoData.competitors.map((competitor, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{competitor.domain}</h4>
                      <Badge className="bg-blue-100 text-blue-800">
                        Visibilidade: {competitor.visibility_score}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span>Keywords Comuns</span>
                        <div className="font-semibold">{competitor.common_keywords}</div>
                      </div>
                      <div>
                        <span>Posição Média</span>
                        <div className="font-semibold">{competitor.avg_position}</div>
                      </div>
                      <div>
                        <span>Tráfego Estimado</span>
                        <div className="font-semibold">{competitor.traffic_estimate.toLocaleString()}</div>
                      </div>
                      <div>
                        <span>Score</span>
                        <div className="font-semibold">{competitor.visibility_score}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content gaps */}
            <Card>
              <CardHeader>
                <CardTitle>Gaps de Conteúdo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {seoData.content_gaps.map((gap, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{gap.keyword}</span>
                        <Badge className="bg-purple-100 text-purple-800">
                          Score: {gap.opportunity_score}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div>
                          <span>Competidor: </span>
                          <span className="font-semibold">#{gap.competitor_position}</span>
                        </div>
                        <div>
                          <span>Nossa posição: </span>
                          <span className="font-semibold">{gap.our_position || 'N/A'}</span>
                        </div>
                        <div>
                          <span>Volume: </span>
                          <span className="font-semibold">{gap.search_volume.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured snippets */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Snippets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {seoData.featured_snippets.map((snippet, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{snippet.keyword}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {snippet.snippet_type}
                          </Badge>
                          {snippet.opportunity && (
                            <Badge className="bg-green-100 text-green-800">
                              Oportunidade
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        Dono atual: <span className="font-semibold">{snippet.current_owner}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}