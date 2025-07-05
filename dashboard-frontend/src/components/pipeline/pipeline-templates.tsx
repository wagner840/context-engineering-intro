'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  FileText, 
  Play, 
  Copy, 
  Star,
  Search,
  Plus,
  Brain,
  Clock,
  Target,
  BookOpen,
  Sparkles,
  TrendingUp,
  Globe
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: 'content_generation' | 'social_media' | 'seo_optimization' | 'research' | 'publishing'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimated_time: number // in minutes
  tags: string[]
  features: string[]
  preview_steps: string[]
  usage_count: number
  rating: number
  is_featured: boolean
  template_data: {
    nodes: Record<string, unknown>[]
    connections: Record<string, unknown>[]
    config: Record<string, unknown>
  }
}

export function PipelineTemplates() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [, setShowPreview] = useState<string | null>(null)

  const { data: templates, isLoading } = useQuery({
    queryKey: ['pipeline-templates'],
    queryFn: async (): Promise<WorkflowTemplate[]> => {
      // Mock data for now - replace with actual API call
      return [
        {
          id: 'template-1',
          name: 'Geração de Conteúdo Automática',
          description: 'Gera posts automaticamente baseado em keywords e publica no WordPress',
          category: 'content_generation',
          difficulty: 'beginner',
          estimated_time: 30,
          tags: ['wordpress', 'ai', 'seo', 'automação'],
          features: [
            'Pesquisa automática de keywords',
            'Geração de conteúdo com IA',
            'Otimização SEO automática',
            'Publicação direta no WordPress'
          ],
          preview_steps: [
            'Trigger: Agendamento diário',
            'Buscar keywords trending',
            'Gerar conteúdo com OpenAI',
            'Otimizar para SEO',
            'Publicar no WordPress'
          ],
          usage_count: 234,
          rating: 4.8,
          is_featured: true,
          template_data: {
            nodes: [],
            connections: [],
            config: {}
          }
        },
        {
          id: 'template-2',
          name: 'Pipeline de Pesquisa de Mercado',
          description: 'Analisa tendências e competidores para identificar oportunidades de conteúdo',
          category: 'research',
          difficulty: 'intermediate',
          estimated_time: 45,
          tags: ['pesquisa', 'competidores', 'tendências', 'analytics'],
          features: [
            'Análise de competidores',
            'Identificação de gaps de conteúdo',
            'Monitoramento de tendências',
            'Relatórios automatizados'
          ],
          preview_steps: [
            'Trigger: Semanal',
            'Coletar dados dos competidores',
            'Analisar gaps de conteúdo',
            'Identificar oportunidades',
            'Gerar relatório'
          ],
          usage_count: 156,
          rating: 4.6,
          is_featured: true,
          template_data: {
            nodes: [],
            connections: [],
            config: {}
          }
        },
        {
          id: 'template-3',
          name: 'Otimização SEO em Massa',
          description: 'Otimiza posts existentes para melhorar rankings de SEO',
          category: 'seo_optimization',
          difficulty: 'advanced',
          estimated_time: 60,
          tags: ['seo', 'otimização', 'wordpress', 'analytics'],
          features: [
            'Análise de performance SEO',
            'Sugestões de melhorias',
            'Atualização automática de meta tags',
            'Monitoramento de rankings'
          ],
          preview_steps: [
            'Trigger: Mensal',
            'Analisar performance dos posts',
            'Identificar oportunidades de melhoria',
            'Aplicar otimizações',
            'Monitorar resultados'
          ],
          usage_count: 89,
          rating: 4.4,
          is_featured: false,
          template_data: {
            nodes: [],
            connections: [],
            config: {}
          }
        },
        {
          id: 'template-4',
          name: 'Distribuição Social Automática',
          description: 'Publica conteúdo automaticamente nas redes sociais com adaptações',
          category: 'social_media',
          difficulty: 'beginner',
          estimated_time: 20,
          tags: ['social media', 'distribuição', 'automação'],
          features: [
            'Adaptação para diferentes plataformas',
            'Agendamento inteligente',
            'Hashtags automáticas',
            'Monitoramento de engagement'
          ],
          preview_steps: [
            'Trigger: Novo post publicado',
            'Adaptar conteúdo para cada rede',
            'Gerar hashtags relevantes',
            'Agendar publicações',
            'Monitorar performance'
          ],
          usage_count: 312,
          rating: 4.7,
          is_featured: true,
          template_data: {
            nodes: [],
            connections: [],
            config: {}
          }
        },
        {
          id: 'template-5',
          name: 'Curadoria de Conteúdo Inteligente',
          description: 'Encontra e organiza conteúdo relevante de diversas fontes',
          category: 'content_generation',
          difficulty: 'intermediate',
          estimated_time: 40,
          tags: ['curadoria', 'fontes', 'organização', 'ai'],
          features: [
            'Busca em múltiplas fontes',
            'Filtragem por relevância',
            'Resumos automáticos',
            'Organização por tópicos'
          ],
          preview_steps: [
            'Trigger: Diário',
            'Buscar conteúdo em fontes',
            'Filtrar por relevância',
            'Gerar resumos',
            'Organizar por categorias'
          ],
          usage_count: 145,
          rating: 4.5,
          is_featured: false,
          template_data: {
            nodes: [],
            connections: [],
            config: {}
          }
        },
        {
          id: 'template-6',
          name: 'Publicação Programada Inteligente',
          description: 'Sistema avançado de agendamento baseado em analytics e audiência',
          category: 'publishing',
          difficulty: 'advanced',
          estimated_time: 50,
          tags: ['agendamento', 'analytics', 'audiência', 'otimização'],
          features: [
            'Análise do melhor horário',
            'Segmentação de audiência',
            'A/B testing automático',
            'Otimização contínua'
          ],
          preview_steps: [
            'Trigger: Conteúdo pronto',
            'Analisar audiência',
            'Determinar melhor horário',
            'Configurar A/B test',
            'Publicar e monitorar'
          ],
          usage_count: 67,
          rating: 4.9,
          is_featured: true,
          template_data: {
            nodes: [],
            connections: [],
            config: {}
          }
        }
      ]
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  const categories = [
    { id: 'all', name: 'Todos', icon: <FileText className="h-4 w-4" /> },
    { id: 'content_generation', name: 'Geração de Conteúdo', icon: <Brain className="h-4 w-4" /> },
    { id: 'social_media', name: 'Redes Sociais', icon: <Globe className="h-4 w-4" /> },
    { id: 'seo_optimization', name: 'Otimização SEO', icon: <Target className="h-4 w-4" /> },
    { id: 'research', name: 'Pesquisa', icon: <Search className="h-4 w-4" /> },
    { id: 'publishing', name: 'Publicação', icon: <BookOpen className="h-4 w-4" /> }
  ]

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'content_generation':
        return <Brain className="h-5 w-5 text-purple-600" />
      case 'social_media':
        return <Globe className="h-5 w-5 text-blue-600" />
      case 'seo_optimization':
        return <Target className="h-5 w-5 text-green-600" />
      case 'research':
        return <Search className="h-5 w-5 text-orange-600" />
      case 'publishing':
        return <BookOpen className="h-5 w-5 text-indigo-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  }) || []

  const featuredTemplates = filteredTemplates.filter(t => t.is_featured)
  const otherTemplates = filteredTemplates.filter(t => !t.is_featured)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header e Controles */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Templates de Workflow</h2>
          <p className="text-gray-600">Templates prontos para automatizar seu fluxo de conteúdo</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Criar Template
          </Button>
        </div>
      </div>

      {/* Filtros por Categoria */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            {category.icon}
            {category.name}
          </Button>
        ))}
      </div>

      {/* Templates em Destaque */}
      {featuredTemplates.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-semibold">Templates em Destaque</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-2 border-yellow-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(template.category)}
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Destaque
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{template.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{template.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Badge className={difficultyColors[template.difficulty]}>
                        {template.difficulty}
                      </Badge>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        {template.estimated_time}min
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <TrendingUp className="h-4 w-4" />
                        {template.usage_count} usos
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Principais recursos:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {template.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        className="flex-1"
                        onClick={() => setShowPreview(template.id)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Usar Template
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Outros Templates */}
      {otherTemplates.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Outros Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (featuredTemplates.length + index) * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(template.category)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{template.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{template.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Badge className={difficultyColors[template.difficulty]}>
                        {template.difficulty}
                      </Badge>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        {template.estimated_time}min
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <TrendingUp className="h-4 w-4" />
                        {template.usage_count} usos
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Principais recursos:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {template.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        className="flex-1"
                        onClick={() => setShowPreview(template.id)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Usar Template
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Nenhum resultado */}
      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Nenhum template encontrado</h3>
              <p className="text-gray-600">
                Tente ajustar sua busca ou categoria selecionada
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dica sobre templates */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-6 w-6 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-purple-900 mb-2">Dica: Personalize seus Templates</h4>
              <p className="text-sm text-purple-700">
                Todos os templates podem ser customizados após a importação. Adicione seus próprios triggers, 
                modifique as configurações de IA e ajuste os fluxos para suas necessidades específicas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}