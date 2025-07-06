'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Layers, 
  Plus, 
  Search, 
  Filter,
  BarChart3,
  Target,
  Eye,
  TrendingUp,
  Edit,
  Trash2
} from 'lucide-react'

const clustersData = [
  {
    id: 1,
    name: 'SEO Técnico',
    description: 'Keywords relacionadas a otimização técnica de websites',
    mainKeyword: 'seo técnico',
    keywordsCount: 24,
    totalVolume: 45200,
    avgDifficulty: 52,
    avgCpc: 3.20,
    opportunity: 85,
    keywords: [
      { keyword: 'seo técnico', volume: 8100, difficulty: 42 },
      { keyword: 'core web vitals', volume: 5400, difficulty: 55 },
      { keyword: 'otimização técnica', volume: 2800, difficulty: 48 },
      { keyword: 'schema markup', volume: 1900, difficulty: 61 }
    ]
  },
  {
    id: 2,
    name: 'Content Marketing',
    description: 'Estratégias e técnicas de marketing de conteúdo',
    mainKeyword: 'marketing de conteúdo',
    keywordsCount: 18,
    totalVolume: 32100,
    avgDifficulty: 41,
    avgCpc: 2.80,
    opportunity: 78,
    keywords: [
      { keyword: 'marketing de conteúdo', volume: 12000, difficulty: 45 },
      { keyword: 'estratégia de conteúdo', volume: 6700, difficulty: 38 },
      { keyword: 'criação de conteúdo', volume: 4200, difficulty: 35 },
      { keyword: 'calendário editorial', volume: 1800, difficulty: 42 }
    ]
  },
  {
    id: 3,
    name: 'WordPress Desenvolvimento',
    description: 'Keywords sobre desenvolvimento e customização WordPress',
    mainKeyword: 'desenvolvimento wordpress',
    keywordsCount: 31,
    totalVolume: 28600,
    avgDifficulty: 58,
    avgCpc: 4.50,
    opportunity: 71,
    keywords: [
      { keyword: 'desenvolvimento wordpress', volume: 7200, difficulty: 52 },
      { keyword: 'custom post types', volume: 3400, difficulty: 65 },
      { keyword: 'wordpress hooks', volume: 2100, difficulty: 68 },
      { keyword: 'theme development', volume: 1900, difficulty: 58 }
    ]
  },
  {
    id: 4,
    name: 'Link Building',
    description: 'Técnicas e estratégias de construção de links',
    mainKeyword: 'link building',
    keywordsCount: 15,
    totalVolume: 19800,
    avgDifficulty: 64,
    avgCpc: 5.20,
    opportunity: 69,
    keywords: [
      { keyword: 'link building', volume: 8900, difficulty: 67 },
      { keyword: 'backlinks', volume: 6200, difficulty: 62 },
      { keyword: 'guest posting', volume: 2800, difficulty: 59 },
      { keyword: 'broken link building', volume: 1900, difficulty: 68 }
    ]
  }
]

export default function KeywordClustersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const getOpportunityColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 40) return 'bg-green-100 text-green-800'
    if (difficulty < 65) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const filteredClusters = clustersData.filter(cluster =>
    cluster.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cluster.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cluster.mainKeyword.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Clusters de Keywords</h1>
        </div>
        <p className="text-gray-600">
          Organize suas keywords em grupos temáticos para criar conteúdo mais eficiente
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar clusters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cluster
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clusters</p>
                <p className="text-2xl font-bold">{clustersData.length}</p>
              </div>
              <Layers className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Keywords Total</p>
                <p className="text-2xl font-bold">
                  {clustersData.reduce((sum, cluster) => sum + cluster.keywordsCount, 0)}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Volume Total</p>
                <p className="text-2xl font-bold">
                  {(clustersData.reduce((sum, cluster) => sum + cluster.totalVolume, 0) / 1000).toFixed(0)}k
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Oportunidade Média</p>
                <p className="text-2xl font-bold">
                  {Math.round(clustersData.reduce((sum, cluster) => sum + cluster.opportunity, 0) / clustersData.length)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clusters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClusters.map((cluster) => (
          <Card key={cluster.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-blue-600" />
                    {cluster.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {cluster.description}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Main Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{cluster.keywordsCount}</div>
                  <div className="text-xs text-gray-600">Keywords</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {(cluster.totalVolume / 1000).toFixed(0)}k
                  </div>
                  <div className="text-xs text-gray-600">Volume/mês</div>
                </div>
              </div>

              {/* Secondary Metrics */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Dificuldade Média:</span>
                  <Badge className={getDifficultyColor(cluster.avgDifficulty)}>
                    {cluster.avgDifficulty}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">CPC Médio:</span>
                  <span className="font-medium">${cluster.avgCpc}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Score de Oportunidade:</span>
                    <span className={`font-medium ${getOpportunityColor(cluster.opportunity)}`}>
                      {cluster.opportunity}%
                    </span>
                  </div>
                  <Progress value={cluster.opportunity} className="h-2" />
                </div>
              </div>

              {/* Top Keywords Preview */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-900">Top Keywords:</h4>
                <div className="space-y-1">
                  {cluster.keywords.slice(0, 3).map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-gray-700">{keyword.keyword}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">{keyword.volume.toLocaleString()}</span>
                        <Badge variant="outline" className="text-xs">
                          KD: {keyword.difficulty}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {cluster.keywords.length > 3 && (
                    <button
                      className="text-xs text-blue-600 hover:underline"
                      onClick={() => console.log('View cluster:', cluster.id)}
                    >
                      Ver todas ({cluster.keywords.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analisar
                </Button>
                <Button size="sm" className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Conteúdo
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredClusters.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Layers className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum cluster encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? 'Tente ajustar sua busca ou criar um novo cluster.'
                : 'Comece criando seu primeiro cluster de keywords.'
              }
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Cluster
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}