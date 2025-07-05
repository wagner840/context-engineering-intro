'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Globe, 
  Target, 
  FileText, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react'
import { useDashboardStats } from '@/hooks/use-dashboard-stats'

interface StatCardProps {
  title: string
  value: number
  description: string
  icon: React.ElementType
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
    period: string
  }
  color: string
  delay?: number
}

function StatCard({ title, value, description, icon: Icon, trend, color, delay = 0 }: StatCardProps) {
  const getTrendIcon = () => {
    switch (trend?.direction) {
      case 'up':
        return <ArrowUpRight className="h-3 w-3" />
      case 'down':
        return <ArrowDownRight className="h-3 w-3" />
      default:
        return <Minus className="h-3 w-3" />
    }
  }

  const getTrendColor = () => {
    switch (trend?.direction) {
      case 'up':
        return 'text-green-600 bg-green-50'
      case 'down':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Background Gradient */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5`}
        />
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-bold">
                {value.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            </div>
            
            {trend && (
              <Badge 
                variant="secondary" 
                className={`${getTrendColor()} border-0 text-xs`}
              >
                {getTrendIcon()}
                {Math.abs(trend.value)}%
              </Badge>
            )}
          </div>
          
          {trend && (
            <p className="text-xs text-muted-foreground mt-2">
              {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}
              {trend.value}% vs {trend.period}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function StatCardSkeleton() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  )
}

export function StatsCards() {
  const { data: stats, isLoading, error } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center justify-center p-6">
            <p className="text-sm text-destructive">
              Erro ao carregar estatísticas
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statsData = [
    {
      title: 'Total de Blogs',
      value: stats?.totalBlogs || 0,
      description: 'Blogs ativos configurados',
      icon: Globe,
      color: 'from-blue-500 to-blue-600',
      trend: {
        value: 12,
        direction: 'up' as const,
        period: 'mês anterior'
      }
    },
    {
      title: 'Palavras-chave',
      value: stats?.totalKeywords || 0,
      description: 'Keywords em variações',
      icon: Target,
      color: 'from-green-500 to-green-600',
      trend: {
        value: 8,
        direction: 'up' as const,
        period: 'mês anterior'
      }
    },
    {
      title: 'Posts de Conteúdo',
      value: stats?.totalPosts || 0,
      description: 'Posts publicados/rascunho',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      trend: {
        value: 23,
        direction: 'up' as const,
        period: 'mês anterior'
      }
    },
    {
      title: 'Oportunidades',
      value: stats?.totalOpportunities || 0,
      description: 'Categories + Clusters',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      trend: {
        value: 15,
        direction: 'up' as const,
        period: 'mês anterior'
      }
    }
  ]

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <StatCard
          key={stat.title}
          {...stat}
          delay={index * 0.1}
        />
      ))}
    </div>
  )
}