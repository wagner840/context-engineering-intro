"use client";

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye,
  Clock,
  Globe,
  Search,
  RefreshCw,
  Download,
  Calendar,
  Target,
  Activity,
  ArrowUp,
  ArrowDown,
  Zap,
  FileText
} from 'lucide-react'
import { WordPressAnalytics } from '@/components/analytics/wordpress-analytics'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { TrafficSources } from '@/components/analytics/traffic-sources'
import { ContentPerformance } from '@/components/analytics/content-performance'
import { SEOAnalytics } from '@/components/analytics/seo-analytics'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

interface AnalyticsOverview {
  total_sessions: number
  total_users: number
  page_views: number
  bounce_rate: number
  avg_session_duration: number
  new_users_percentage: number
  total_posts: number
  published_this_month: number
  top_performing_post: {
    title: string
    views: number
    url: string
  }
  traffic_growth: number
  conversion_rate: number
}

export default function AnalyticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('last_30_days')
  const [selectedBlog, setSelectedBlog] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')

  const { data: overview, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['analytics-overview', selectedTimeframe, selectedBlog],
    queryFn: async (): Promise<AnalyticsOverview> => {
      // Mock data for now - replace with actual API calls
      return {
        total_sessions: 24589,
        total_users: 18743,
        page_views: 89234,
        bounce_rate: 42.3,
        avg_session_duration: 215, // seconds
        new_users_percentage: 68.5,
        total_posts: 147,
        published_this_month: 23,
        top_performing_post: {
          title: 'Como investir em renda fixa: Guia completo 2024',
          views: 15420,
          url: '/blog/como-investir-renda-fixa-2024'
        },
        traffic_growth: 15.7,
        conversion_rate: 3.2
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getChangeIndicator = (value: number) => {
    if (value > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <ArrowUp className="h-4 w-4" />
          <span>+{value}%</span>
        </div>
      )
    } else if (value < 0) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <ArrowDown className="h-4 w-4" />
          <span>{value}%</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1 text-gray-600">
        <span>0%</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Analytics & Performance
            </h1>
            <p className="text-gray-600">
              Análise completa de tráfego, engajamento e performance do seu conteúdo
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={selectedBlog} onValueChange={setSelectedBlog}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Blogs</SelectItem>
                <SelectItem value="einsof7">Einsof7 Finance</SelectItem>
                <SelectItem value="vida-saudavel">Vida Saudável</SelectItem>
                <SelectItem value="tech-tips">Tech Tips</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_7_days">Últimos 7 dias</SelectItem>
                <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
                <SelectItem value="last_90_days">Últimos 90 dias</SelectItem>
                <SelectItem value="last_year">Último ano</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-blue-600" />
                Usuários Totais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.total_users.toLocaleString()}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">{overview?.new_users_percentage}% novos</span>
                {getChangeIndicator(overview?.traffic_growth || 0)}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-green-600" />
                Visualizações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.page_views.toLocaleString()}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">{overview?.total_sessions.toLocaleString()} sessões</span>
                {getChangeIndicator(12.4)}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-purple-600" />
                Tempo Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview?.avg_session_duration ? formatDuration(overview.avg_session_duration) : '0:00'}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">Por sessão</span>
                {getChangeIndicator(8.2)}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-orange-600" />
                Taxa de Rejeição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.bounce_rate}%</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">Taxa ideal: &lt;40%</span>
                {getChangeIndicator(-2.1)}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-700">Posts Publicados</h3>
                <div className="text-2xl font-bold text-blue-900">{overview?.published_this_month}</div>
                <p className="text-xs text-blue-600">Este mês</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-green-700">Taxa de Conversão</h3>
                <div className="text-2xl font-bold text-green-900">{overview?.conversion_rate}%</div>
                <p className="text-xs text-green-600">Últimos 30 dias</p>
              </div>
              <Zap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-purple-700">Top Performing</h3>
                <div className="text-sm font-bold text-purple-900 truncate max-w-32">
                  {overview?.top_performing_post.title}
                </div>
                <p className="text-xs text-purple-600">{overview?.top_performing_post.views.toLocaleString()} views</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-4xl grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="wordpress" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              WordPress
            </TabsTrigger>
            <TabsTrigger value="google" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Google Analytics
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              SEO
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrafficSources timeframe={selectedTimeframe} blogId={selectedBlog} />
            <ContentPerformance timeframe={selectedTimeframe} blogId={selectedBlog} />
          </div>
        </TabsContent>

        <TabsContent value="wordpress">
          <WordPressAnalytics timeframe={selectedTimeframe} blogId={selectedBlog} />
        </TabsContent>

        <TabsContent value="google">
          <GoogleAnalytics timeframe={selectedTimeframe} blogId={selectedBlog} />
        </TabsContent>

        <TabsContent value="content">
          <ContentPerformance timeframe={selectedTimeframe} blogId={selectedBlog} detailed={true} />
        </TabsContent>

        <TabsContent value="seo">
          <SEOAnalytics timeframe={selectedTimeframe} blogId={selectedBlog} />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-indigo-900">Analytics Insights</h3>
            <p className="text-indigo-700 text-sm">
              Configure alertas automáticos e relatórios personalizados para monitorar sua performance
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white">
              <Calendar className="h-4 w-4 mr-2" />
              Agendar Relatório
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Activity className="h-4 w-4 mr-2" />
              Configurar Alertas
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
