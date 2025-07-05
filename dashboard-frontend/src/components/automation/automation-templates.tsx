'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Download,
  Star,
  Clock,
  Zap,
  Globe,
  FileText,
  BarChart3,
  Settings,
  Play,
  Search,
  Eye,
  Plus,
  TrendingUp,
  Users,
  Target,
  Sparkles
} from 'lucide-react'
import { useAutomationTemplates } from '@/hooks/automation'
import { motion } from 'framer-motion'

export function AutomationTemplates() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState('popularity')

  const { data: templates, isLoading } = useAutomationTemplates({
    searchTerm,
    selectedCategory,
    selectedDifficulty,
    sortBy,
  })

  const categories = [
    { id: 'all', name: 'Todos', icon: <Settings className="h-4 w-4" /> },
    { id: 'content', name: 'Conteúdo', icon: <FileText className="h-4 w-4" /> },
    { id: 'marketing', name: 'Marketing', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'productivity', name: 'Produtividade', icon: <Clock className="h-4 w-4" /> },
    { id: 'integration', name: 'Integração', icon: <Globe className="h-4 w-4" /> },
    { id: 'seo', name: 'SEO', icon: <Target className="h-4 w-4" /> }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'content':
        return <FileText className="h-5 w-5 text-blue-600" />
      case 'marketing':
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'analytics':
        return <BarChart3 className="h-5 w-5 text-purple-600" />
      case 'productivity':
        return <Clock className="h-5 w-5 text-orange-600" />
      case 'integration':
        return <Globe className="h-5 w-5 text-indigo-600" />
      case 'seo':
        return <Target className="h-5 w-5 text-red-600" />
      default:
        return <Settings className="h-5 w-5 text-gray-600" />
    }
  }

  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
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
      {/* Header e controles */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Templates de Automação</h3>
          <p className="text-gray-600">Templates prontos para acelerar sua automação</p>
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
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularidade</SelectItem>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="created_at">Mais Recentes</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="beginner">Iniciante</SelectItem>
              <SelectItem value="intermediate">Intermediário</SelectItem>
              <SelectItem value="advanced">Avançado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filtros por categoria */}
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

      {/* Templates em destaque */}
      {featuredTemplates.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-yellow-600" />
            <h4 className="text-lg font-semibold">Templates em Destaque</h4>
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
                        {template.is_premium && (
                          <Badge className="bg-purple-100 text-purple-800">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
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
                      <Badge className={getDifficultyColor(template.difficulty)}>
                        {template.difficulty}
                      </Badge>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        {template.estimated_setup_time}min
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Users className="h-4 w-4" />
                        {template.usage_count} usos
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Integrações:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.integrations.slice(0, 3).map((integration) => (
                          <Badge key={integration} variant="outline" className="text-xs">
                            {integration}
                          </Badge>
                        ))}
                        {template.integrations.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.integrations.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Triggers & Actions:</p>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          <span>{template.triggers.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          <span>{template.actions.slice(0, 2).join(', ')}</span>
                          {template.actions.length > 2 && <span>...</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Usar Template
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Outros templates */}
      {otherTemplates.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4">Outros Templates</h4>
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
                        {template.is_premium && (
                          <Badge className="bg-purple-100 text-purple-800">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
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
                      <Badge className={getDifficultyColor(template.difficulty)}>
                        {template.difficulty}
                      </Badge>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        {template.estimated_setup_time}min
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Users className="h-4 w-4" />
                        {template.usage_count} usos
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Integrações:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.integrations.slice(0, 3).map((integration) => (
                          <Badge key={integration} variant="outline" className="text-xs">
                            {integration}
                          </Badge>
                        ))}
                        {template.integrations.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.integrations.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Usar Template
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
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
                Tente ajustar sua busca ou filtros selecionados
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dica sobre templates */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-6 w-6 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Contribua com a Comunidade</h4>
              <p className="text-sm text-blue-700">
                Crie seus próprios templates e compartilhe com a comunidade. Templates populares 
                podem ser destacados e gerar reconhecimento para seu trabalho.
              </p>
              <Button className="mt-3 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Criar Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}