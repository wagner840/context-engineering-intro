'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Globe, 
  Target, 
  FileText, 
  BarChart3,
  Settings,
  Zap,
  ArrowRight,
  Plus,
  Search
} from 'lucide-react'

interface QuickAction {
  title: string
  description: string
  href: string
  icon: React.ElementType
  color: string
  badge?: string
  isPrimary?: boolean
}

const quickActions: QuickAction[] = [
  {
    title: 'Gerenciar Blogs',
    description: 'Configure e monitore seus blogs WordPress',
    href: '/blogs',
    icon: Globe,
    color: 'from-blue-500 to-blue-600',
    badge: 'Essencial',
    isPrimary: true
  },
  {
    title: 'Pesquisa de Keywords',
    description: 'Encontre oportunidades de palavras-chave',
    href: '/keywords',
    icon: Target,
    color: 'from-green-500 to-green-600',
    isPrimary: true
  },
  {
    title: 'Pipeline de Conteúdo',
    description: 'Gerencie todo o fluxo de criação',
    href: '/content',
    icon: FileText,
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: 'Analytics',
    description: 'Monitore performance e métricas',
    href: '/analytics',
    icon: BarChart3,
    color: 'from-orange-500 to-orange-600',
    badge: 'Pro'
  },
  {
    title: 'Automação',
    description: 'Configure workflows do n8n',
    href: '/automation',
    icon: Zap,
    color: 'from-yellow-500 to-yellow-600',
    badge: 'Novo'
  },
  {
    title: 'Configurações',
    description: 'Ajuste configurações do sistema',
    href: '/settings',
    icon: Settings,
    color: 'from-gray-500 to-gray-600'
  }
]

interface ActionCardProps extends QuickAction {
  delay: number
}

function ActionCard({ title, description, href, icon: Icon, color, badge, isPrimary, delay }: ActionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={href}>
        <Card className={`
          relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group
          ${isPrimary ? 'ring-2 ring-primary/20' : ''}
        `}>
          {/* Background Gradient */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity`}
          />
          
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                  {title}
                </CardTitle>
                {badge && (
                  <Badge 
                    variant={isPrimary ? 'default' : 'secondary'} 
                    className="text-xs"
                  >
                    {badge}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-sm">
                {description}
              </CardDescription>
            </div>
            
            <div className={`p-3 rounded-xl bg-gradient-to-br ${color} group-hover:scale-110 transition-transform`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Clique para acessar
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

export function QuickActions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ações Rápidas</h2>
          <p className="text-muted-foreground">
            Acesse rapidamente as principais funcionalidades
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Blog
          </Button>
          <Button size="sm">
            <Search className="h-4 w-4 mr-2" />
            Buscar Keywords
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action, index) => (
          <ActionCard
            key={action.title}
            {...action}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  )
}