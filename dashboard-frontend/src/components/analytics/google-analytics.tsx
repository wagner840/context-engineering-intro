'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Clock,
  Target,
  TrendingUp,
  Eye,
  MousePointer,
  RefreshCw,
  ExternalLink,
  BarChart3,
  PieChart
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

interface GoogleAnalyticsProps {
  timeframe: string
  blogId: string
}

interface GoogleAnalyticsData {
  audience: {
    total_users: number
    new_users: number
    returning_users: number
    sessions: number
    pageviews: number
    avg_session_duration: number
    bounce_rate: number
    pages_per_session: number
  }
  demographics: {
    age_groups: {
      range: string
      percentage: number
      users: number
    }[]
    gender: {
      male: number
      female: number
      unknown: number
    }
    locations: {
      country: string
      users: number
      percentage: number
    }[]
  }
  devices: {
    desktop: number
    mobile: number
    tablet: number
    browsers: {
      name: string
      users: number
      percentage: number
    }[]
    operating_systems: {
      name: string
      users: number
      percentage: number
    }[]
  }
  acquisition: {
    channels: {
      channel: string
      users: number
      sessions: number
      conversion_rate: number
    }[]
    campaigns: {
      name: string
      users: number
      conversions: number
      cost: number
    }[]
  }
  behavior: {
    top_pages: {
      page: string
      pageviews: number
      unique_pageviews: number
      avg_time_on_page: number
      bounce_rate: number
    }[]
    events: {
      event_name: string
      count: number
      unique_events: number
    }[]
  }
  conversions: {
    goals: {
      name: string
      completions: number
      conversion_rate: number
      value: number
    }[]
    ecommerce: {
      revenue: number
      transactions: number
      avg_order_value: number
      conversion_rate: number
    }
  }
}

export function GoogleAnalytics({ timeframe, blogId }: GoogleAnalyticsProps) {
  const [selectedView, setSelectedView] = useState('audience')

  const { data: gaData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['google-analytics', timeframe, blogId],
    queryFn: async (): Promise<GoogleAnalyticsData> => {
      // Mock data for now - replace with actual Google Analytics API calls
      return {
        audience: {
          total_users: 18743,
          new_users: 12845,
          returning_users: 5898,
          sessions: 24589,
          pageviews: 89234,
          avg_session_duration: 215,
          bounce_rate: 42.3,
          pages_per_session: 3.6
        },
        demographics: {
          age_groups: [
            { range: '18-24', percentage: 23.5, users: 4405 },
            { range: '25-34', percentage: 34.2, users: 6410 },
            { range: '35-44', percentage: 28.1, users: 5267 },
            { range: '45-54', percentage: 10.8, users: 2024 },
            { range: '55+', percentage: 3.4, users: 637 }
          ],
          gender: {
            male: 58.3,
            female: 39.2,
            unknown: 2.5
          },
          locations: [
            { country: 'Brasil', users: 15234, percentage: 81.3 },
            { country: 'Portugal', users: 1892, percentage: 10.1 },
            { country: 'Estados Unidos', users: 945, percentage: 5.0 },
            { country: 'Espanha', users: 467, percentage: 2.5 },
            { country: 'Outros', users: 205, percentage: 1.1 }
          ]
        },
        devices: {
          desktop: 45.2,
          mobile: 48.1,
          tablet: 6.7,
          browsers: [
            { name: 'Chrome', users: 12845, percentage: 68.5 },
            { name: 'Safari', users: 3124, percentage: 16.7 },
            { name: 'Firefox', users: 1498, percentage: 8.0 },
            { name: 'Edge', users: 936, percentage: 5.0 },
            { name: 'Outros', users: 340, percentage: 1.8 }
          ],
          operating_systems: [
            { name: 'Windows', users: 8934, percentage: 47.7 },
            { name: 'Android', users: 5623, percentage: 30.0 },
            { name: 'iOS', users: 2812, percentage: 15.0 },
            { name: 'macOS', users: 1124, percentage: 6.0 },
            { name: 'Linux', users: 250, percentage: 1.3 }
          ]
        },
        acquisition: {
          channels: [
            { channel: 'Organic Search', users: 8934, sessions: 12456, conversion_rate: 3.2 },
            { channel: 'Direct', users: 4523, sessions: 6789, conversion_rate: 4.1 },
            { channel: 'Social', users: 2845, sessions: 3912, conversion_rate: 1.8 },
            { channel: 'Referral', users: 1634, sessions: 2156, conversion_rate: 2.5 },
            { channel: 'Email', users: 807, sessions: 1276, conversion_rate: 5.3 }
          ],
          campaigns: [
            { name: 'Campanha Investimentos', users: 1234, conversions: 45, cost: 890.50 },
            { name: 'Social Media Push', users: 2156, conversions: 32, cost: 1245.00 },
            { name: 'Newsletter Promo', users: 876, conversions: 78, cost: 450.25 }
          ]
        },
        behavior: {
          top_pages: [
            {
              page: '/como-investir-renda-fixa-2024',
              pageviews: 15420,
              unique_pageviews: 12890,
              avg_time_on_page: 185,
              bounce_rate: 35.2
            },
            {
              page: '/dicas-produtividade-home-office',
              pageviews: 12890,
              unique_pageviews: 10234,
              avg_time_on_page: 156,
              bounce_rate: 41.8
            },
            {
              page: '/receitas-saudaveis-cafe-manha',
              pageviews: 9856,
              unique_pageviews: 8234,
              avg_time_on_page: 142,
              bounce_rate: 38.6
            }
          ],
          events: [
            { event_name: 'newsletter_signup', count: 1245, unique_events: 1156 },
            { event_name: 'download_pdf', count: 856, unique_events: 734 },
            { event_name: 'video_play', count: 634, unique_events: 598 },
            { event_name: 'contact_form', count: 423, unique_events: 387 }
          ]
        },
        conversions: {
          goals: [
            { name: 'Newsletter Signup', completions: 1245, conversion_rate: 5.1, value: 15.50 },
            { name: 'Contact Form', completions: 423, conversion_rate: 1.7, value: 25.00 },
            { name: 'PDF Download', completions: 856, conversion_rate: 3.5, value: 8.75 }
          ],
          ecommerce: {
            revenue: 45234.50,
            transactions: 234,
            avg_order_value: 193.30,
            conversion_rate: 0.95
          }
        }
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
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

  if (!gaData) return null

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Google Analytics</h3>
          <p className="text-gray-600">Dados detalhados de audiência e comportamento</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="audience">Audiência</SelectItem>
              <SelectItem value="acquisition">Aquisição</SelectItem>
              <SelectItem value="behavior">Comportamento</SelectItem>
              <SelectItem value="conversions">Conversões</SelectItem>
            </SelectContent>
          </Select>
          
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
            Google Analytics
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-blue-600" />
                Usuários Totais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gaData.audience.total_users.toLocaleString()}</div>
              <div className="text-xs text-gray-600 mt-1">
                {((gaData.audience.new_users / gaData.audience.total_users) * 100).toFixed(1)}% novos usuários
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-green-600" />
                Páginas Vistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gaData.audience.pageviews.toLocaleString()}</div>
              <div className="text-xs text-gray-600 mt-1">
                {gaData.audience.pages_per_session.toFixed(1)} páginas/sessão
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-purple-600" />
                Duração Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatDuration(gaData.audience.avg_session_duration)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Tempo por sessão
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
              <div className="text-2xl font-bold">{gaData.audience.bounce_rate}%</div>
              <div className="text-xs text-gray-600 mt-1">
                {gaData.audience.sessions.toLocaleString()} sessões totais
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* View específica baseada na seleção */}
      {selectedView === 'audience' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Demografia por idade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Faixa Etária
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gaData.demographics.age_groups.map((group, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{group.range} anos</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${group.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-8">{group.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dispositivos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Dispositivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Monitor className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="font-semibold">{gaData.devices.desktop}%</div>
                    <div className="text-xs text-gray-600">Desktop</div>
                  </div>
                  <div>
                    <Smartphone className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="font-semibold">{gaData.devices.mobile}%</div>
                    <div className="text-xs text-gray-600">Mobile</div>
                  </div>
                  <div>
                    <Tablet className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="font-semibold">{gaData.devices.tablet}%</div>
                    <div className="text-xs text-gray-600">Tablet</div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-2">Top Navegadores</h5>
                  <div className="space-y-2">
                    {gaData.devices.browsers.slice(0, 3).map((browser, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{browser.name}</span>
                        <span className="font-semibold">{browser.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Localização */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localização dos Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gaData.demographics.locations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{location.country}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${location.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-12">{location.users.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gênero */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Distribuição por Gênero
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{gaData.demographics.gender.male}%</div>
                    <div className="text-sm text-gray-600">Masculino</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-pink-600">{gaData.demographics.gender.female}%</div>
                    <div className="text-sm text-gray-600">Feminino</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-600">{gaData.demographics.gender.unknown}%</div>
                    <div className="text-sm text-gray-600">Não informado</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedView === 'acquisition' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Canais de aquisição */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Canais de Aquisição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gaData.acquisition.channels.map((channel, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{channel.channel}</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {channel.conversion_rate}% conversão
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span>Usuários: </span>
                        <span className="font-semibold">{channel.users.toLocaleString()}</span>
                      </div>
                      <div>
                        <span>Sessões: </span>
                        <span className="font-semibold">{channel.sessions.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Campanhas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Performance de Campanhas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gaData.acquisition.campaigns.map((campaign, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">{campaign.name}</h4>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <div className="text-gray-600">Usuários</div>
                        <div className="font-semibold">{campaign.users.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Conversões</div>
                        <div className="font-semibold">{campaign.conversions}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Custo</div>
                        <div className="font-semibold">{formatCurrency(campaign.cost)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedView === 'behavior' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Páginas mais visitadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Páginas Mais Visitadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gaData.behavior.top_pages.map((page, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="font-medium text-sm mb-2 truncate">{page.page}</div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                      <div>
                        <span>Visualizações: </span>
                        <span className="font-semibold">{page.pageviews.toLocaleString()}</span>
                      </div>
                      <div>
                        <span>Únicas: </span>
                        <span className="font-semibold">{page.unique_pageviews.toLocaleString()}</span>
                      </div>
                      <div>
                        <span>Tempo médio: </span>
                        <span className="font-semibold">{formatDuration(page.avg_time_on_page)}</span>
                      </div>
                      <div>
                        <span>Rejeição: </span>
                        <span className="font-semibold">{page.bounce_rate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Eventos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="h-5 w-5" />
                Eventos Principais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gaData.behavior.events.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm capitalize">
                        {event.event_name.replace(/_/g, ' ')}
                      </div>
                      <div className="text-xs text-gray-600">
                        {event.unique_events} eventos únicos
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{event.count.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">total</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedView === 'conversions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Metas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Metas de Conversão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gaData.conversions.goals.map((goal, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{goal.name}</span>
                      <Badge className="bg-green-100 text-green-800">
                        {goal.conversion_rate}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span>Conversões: </span>
                        <span className="font-semibold">{goal.completions.toLocaleString()}</span>
                      </div>
                      <div>
                        <span>Valor: </span>
                        <span className="font-semibold">{formatCurrency(goal.value)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* E-commerce */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Métricas E-commerce
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(gaData.conversions.ecommerce.revenue)}
                    </div>
                    <div className="text-sm text-gray-600">Receita Total</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {gaData.conversions.ecommerce.transactions}
                    </div>
                    <div className="text-sm text-gray-600">Transações</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">
                      {formatCurrency(gaData.conversions.ecommerce.avg_order_value)}
                    </div>
                    <div className="text-sm text-gray-600">Ticket Médio</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">
                      {gaData.conversions.ecommerce.conversion_rate}%
                    </div>
                    <div className="text-sm text-gray-600">Taxa Conversão</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}