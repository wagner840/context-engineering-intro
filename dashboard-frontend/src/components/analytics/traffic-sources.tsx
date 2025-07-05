'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Search, 
  Globe,
  Share2,
  Mail,
  TrendingUp,
  ExternalLink,
  Zap,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

interface TrafficSourcesProps {
  timeframe: string
  blogId: string
}

interface TrafficData {
  sources: {
    name: string
    icon: React.ReactNode
    users: number
    sessions: number
    percentage: number
    growth: number
    avg_session_duration: number
    bounce_rate: number
    pages_per_session: number
  }[]
  referrals: {
    domain: string
    users: number
    percentage: number
    growth: number
  }[]
  social_networks: {
    network: string
    users: number
    engagement_rate: number
    clicks: number
  }[]
  campaigns: {
    name: string
    source: string
    users: number
    conversions: number
    cost: number
    roi: number
  }[]
}

export function TrafficSources({ timeframe, blogId }: TrafficSourcesProps) {
  const { data: trafficData, isLoading } = useQuery({
    queryKey: ['traffic-sources', timeframe, blogId],
    queryFn: async (): Promise<TrafficData> => {
      // Mock data for now - replace with actual API calls
      return {
        sources: [
          {
            name: 'Organic Search',
            icon: <Search className="h-4 w-4" />,
            users: 8934,
            sessions: 12456,
            percentage: 47.6,
            growth: 12.4,
            avg_session_duration: 245,
            bounce_rate: 38.2,
            pages_per_session: 4.2
          },
          {
            name: 'Direct',
            icon: <Globe className="h-4 w-4" />,
            users: 4523,
            sessions: 6789,
            percentage: 24.1,
            growth: -2.1,
            avg_session_duration: 198,
            bounce_rate: 35.8,
            pages_per_session: 3.8
          },
          {
            name: 'Social Media',
            icon: <Share2 className="h-4 w-4" />,
            users: 2845,
            sessions: 3912,
            percentage: 15.2,
            growth: 18.7,
            avg_session_duration: 156,
            bounce_rate: 52.1,
            pages_per_session: 2.9
          },
          {
            name: 'Referral',
            icon: <ExternalLink className="h-4 w-4" />,
            users: 1634,
            sessions: 2156,
            percentage: 8.7,
            growth: 5.3,
            avg_session_duration: 189,
            bounce_rate: 41.5,
            pages_per_session: 3.5
          },
          {
            name: 'Email Marketing',
            icon: <Mail className="h-4 w-4" />,
            users: 807,
            sessions: 1276,
            percentage: 4.3,
            growth: 23.1,
            avg_session_duration: 267,
            bounce_rate: 28.9,
            pages_per_session: 5.1
          }
        ],
        referrals: [
          { domain: 'medium.com', users: 456, percentage: 27.9, growth: 15.2 },
          { domain: 'reddit.com', users: 312, percentage: 19.1, growth: -3.4 },
          { domain: 'linkedin.com', users: 234, percentage: 14.3, growth: 8.7 },
          { domain: 'facebook.com', users: 198, percentage: 12.1, growth: 22.1 },
          { domain: 'twitter.com', users: 167, percentage: 10.2, growth: -7.8 },
          { domain: 'outros', users: 267, percentage: 16.4, growth: 5.1 }
        ],
        social_networks: [
          { network: 'Facebook', users: 1234, engagement_rate: 3.2, clicks: 2890 },
          { network: 'Instagram', users: 892, engagement_rate: 4.7, clicks: 1567 },
          { network: 'LinkedIn', users: 456, engagement_rate: 2.8, clicks: 834 },
          { network: 'Twitter', users: 263, engagement_rate: 1.9, clicks: 512 }
        ],
        campaigns: [
          {
            name: 'Campanha Investimentos Q1',
            source: 'Google Ads',
            users: 1234,
            conversions: 45,
            cost: 2890.50,
            roi: 320.5
          },
          {
            name: 'Social Media Push',
            source: 'Facebook Ads',
            users: 892,
            conversions: 32,
            cost: 1245.75,
            roi: 285.3
          },
          {
            name: 'Newsletter Promo',
            source: 'Email',
            users: 456,
            conversions: 28,
            cost: 150.00,
            roi: 460.2
          }
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) {
      return <ArrowUp className="h-3 w-3 text-green-600" />
    } else if (growth < 0) {
      return <ArrowDown className="h-3 w-3 text-red-600" />
    }
    return null
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600'
    if (growth < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!trafficData) return null

  return (
    <div className="space-y-6">
      {/* Principais fontes de tráfego */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Fontes de Tráfego
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trafficData.sources.map((source, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {source.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold">{source.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{source.percentage}% do tráfego</span>
                        {getGrowthIcon(source.growth)}
                        <span className={getGrowthColor(source.growth)}>
                          {source.growth > 0 ? '+' : ''}{source.growth}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{source.users.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">usuários</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Sessões</div>
                    <div className="font-semibold">{source.sessions.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Duração Média</div>
                    <div className="font-semibold">{formatDuration(source.avg_session_duration)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Taxa de Rejeição</div>
                    <div className="font-semibold">{source.bounce_rate}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Páginas/Sessão</div>
                    <div className="font-semibold">{source.pages_per_session}</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <Progress value={source.percentage} className="h-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Referrals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Top Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trafficData.referrals.map((referral, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{referral.domain}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{referral.percentage}% do tráfego de referral</span>
                      {getGrowthIcon(referral.growth)}
                      <span className={getGrowthColor(referral.growth)}>
                        {referral.growth > 0 ? '+' : ''}{referral.growth}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{referral.users.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">usuários</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Redes Sociais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Desempenho Social
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trafficData.social_networks.map((network, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{network.network}</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {network.engagement_rate}% engagement
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span>Usuários: </span>
                      <span className="font-semibold">{network.users.toLocaleString()}</span>
                    </div>
                    <div>
                      <span>Cliques: </span>
                      <span className="font-semibold">{network.clicks.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campanhas de Marketing */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance de Campanhas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficData.campaigns.map((campaign, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <Badge variant="outline" className="mt-1">
                        {campaign.source}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">ROI</div>
                      <div className="font-bold text-green-600">{campaign.roi}%</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm">
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
                    <div>
                      <div className="text-gray-600">Taxa Conversão</div>
                      <div className="font-semibold">
                        {((campaign.conversions / campaign.users) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}