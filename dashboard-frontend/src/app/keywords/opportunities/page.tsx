'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Target, 
  TrendingUp, 
  Search, 
  Filter,
  BarChart3,
  Eye,
  Star,
  Zap,
  Plus,
  Clock,
  DollarSign
} from 'lucide-react'

const opportunitiesData = {
  highPriority: [
    {
      id: 1,
      keyword: 'automação seo 2024',
      volume: 6800,
      difficulty: 35,
      cpc: 4.20,
      competitorGap: 85,
      trendGrowth: '+120%',
      estimatedTraffic: 2890,
      conversionPotential: 'high',
      contentGap: true,
      timeToRank: '3-4 meses',
      relatedKeywords: 12
    },
    {
      id: 2,
      keyword: 'wordpress headless cms',
      volume: 4200,
      difficulty: 42,
      cpc: 5.80,
      competitorGap: 78,
      trendGrowth: '+89%',
      estimatedTraffic: 1680,
      conversionPotential: 'medium',
      contentGap: true,
      timeToRank: '4-5 meses',
      relatedKeywords: 8
    },
    {
      id: 3,
      keyword: 'core web vitals otimização',
      volume: 3900,
      difficulty: 38,
      cpc: 3.60,
      competitorGap: 82,
      trendGrowth: '+67%',
      estimatedTraffic: 1560,
      conversionPotential: 'high',
      contentGap: false,
      timeToRank: '2-3 meses',
      relatedKeywords: 15
    }
  ],
  mediumPriority: [
    {
      id: 4,
      keyword: 'link building estratégias avançadas',
      volume: 2800,
      difficulty: 58,
      cpc: 6.20,
      competitorGap: 65,
      trendGrowth: '+34%',
      estimatedTraffic: 980,
      conversionPotential: 'medium',
      contentGap: true,
      timeToRank: '5-6 meses',
      relatedKeywords: 9
    },
    {
      id: 5,
      keyword: 'javascript seo best practices',
      volume: 2100,
      difficulty: 52,
      cpc: 4.80,
      competitorGap: 71,
      trendGrowth: '+45%',
      estimatedTraffic: 735,
      conversionPotential: 'high',
      contentGap: false,
      timeToRank: '4-5 meses',
      relatedKeywords: 6
    }
  ],
  seasonal: [
    {
      id: 6,
      keyword: 'black friday seo strategy',
      volume: 1800,
      difficulty: 45,
      cpc: 3.90,
      seasonalPeak: 'Novembro',
      yearOverYear: '+156%',
      estimatedTraffic: 630,
      conversionPotential: 'high',
      contentGap: true,
      timeToRank: '2-3 meses',
      relatedKeywords: 7
    }
  ]
}

export default function KeywordOpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOpportunities, setSelectedOpportunities] = useState<number[]>([])


  const getConversionColor = (potential: string) => {
    switch (potential) {
      case 'high': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 40) return 'bg-green-100 text-green-800'
    if (difficulty < 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const toggleOpportunitySelection = (id: number) => {
    setSelectedOpportunities(prev => 
      prev.includes(id) 
        ? prev.filter(oppId => oppId !== id)
        : [...prev, id]
    )
  }

  const OpportunityCard = ({ opportunity, type = 'regular' }: { opportunity: any, type?: string }) => (
    <Card 
      className={`cursor-pointer transition-colors hover:border-gray-300 ${
        selectedOpportunities.includes(opportunity.id) 
          ? 'border-blue-500 bg-blue-50' 
          : ''
      }`}
      onClick={() => toggleOpportunitySelection(opportunity.id)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">{opportunity.keyword}</h3>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {opportunity.volume.toLocaleString()}/mês
              </span>
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                KD: {opportunity.difficulty}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                ${opportunity.cpc}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {opportunity.trendGrowth || opportunity.yearOverYear}
              </span>
            </div>
          </div>
          <Badge className={getDifficultyColor(opportunity.difficulty)}>
            KD: {opportunity.difficulty}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              {opportunity.estimatedTraffic.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Tráfego Estimado</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              {opportunity.competitorGap || 'N/A'}%
            </div>
            <div className="text-xs text-gray-600">Gap Competitivo</div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Potencial de Conversão:</span>
            <Badge className={getConversionColor(opportunity.conversionPotential)}>
              {opportunity.conversionPotential}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Gap de Conteúdo:</span>
            <Badge className={opportunity.contentGap ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
              {opportunity.contentGap ? 'Sim' : 'Não'}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Tempo para Rankear:</span>
            <span className="font-medium">{opportunity.timeToRank}</span>
          </div>
          {type === 'seasonal' && opportunity.seasonalPeak && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Pico Sazonal:</span>
              <span className="font-medium">{opportunity.seasonalPeak}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>{opportunity.relatedKeywords} keywords relacionadas</span>
          {opportunity.competitorGap && (
            <Progress value={opportunity.competitorGap} className="w-20 h-2" />
          )}
        </div>

        <div className="flex gap-2">
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
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Oportunidades de Keywords</h1>
        </div>
        <p className="text-gray-600">
          Identifique as melhores oportunidades de conteúdo baseadas em análise competitiva
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar oportunidades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {selectedOpportunities.length > 0 && (
            <Badge variant="outline" className="px-3 py-1">
              {selectedOpportunities.length} selecionadas
            </Badge>
          )}
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            Gerar Novo Relatório
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Oportunidades Total</p>
                <p className="text-2xl font-bold">
                  {opportunitiesData.highPriority.length + opportunitiesData.mediumPriority.length + opportunitiesData.seasonal.length}
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tráfego Potencial</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    [...opportunitiesData.highPriority, ...opportunitiesData.mediumPriority]
                      .reduce((sum, opp) => sum + opp.estimatedTraffic, 0) / 1000
                  )}k
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gap Médio</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    [...opportunitiesData.highPriority, ...opportunitiesData.mediumPriority]
                      .reduce((sum, opp) => sum + opp.competitorGap, 0) / 
                    (opportunitiesData.highPriority.length + opportunitiesData.mediumPriority.length)
                  )}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sazonais Ativas</p>
                <p className="text-2xl font-bold">{opportunitiesData.seasonal.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="high-priority" className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="high-priority" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Alta
          </TabsTrigger>
          <TabsTrigger value="medium-priority" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Média
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Sazonal
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Todas
          </TabsTrigger>
        </TabsList>

        {/* High Priority */}
        <TabsContent value="high-priority">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-semibold">Oportunidades de Alta Prioridade</h2>
              <Badge className="bg-red-100 text-red-800">
                {opportunitiesData.highPriority.length} oportunidades
              </Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {opportunitiesData.highPriority.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Medium Priority */}
        <TabsContent value="medium-priority">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-yellow-500" />
              <h2 className="text-xl font-semibold">Oportunidades de Média Prioridade</h2>
              <Badge className="bg-yellow-100 text-yellow-800">
                {opportunitiesData.mediumPriority.length} oportunidades
              </Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {opportunitiesData.mediumPriority.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Seasonal */}
        <TabsContent value="seasonal">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-semibold">Oportunidades Sazonais</h2>
              <Badge className="bg-orange-100 text-orange-800">
                {opportunitiesData.seasonal.length} ativas
              </Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {opportunitiesData.seasonal.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} type="seasonal" />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* All Opportunities */}
        <TabsContent value="all">
          <div className="space-y-8">
            {/* High Priority Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-medium">Alta Prioridade</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {opportunitiesData.highPriority.map((opportunity) => (
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>
            </div>

            {/* Medium Priority Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-medium">Média Prioridade</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {opportunitiesData.mediumPriority.map((opportunity) => (
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>
            </div>

            {/* Seasonal Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-orange-500" />
                <h3 className="text-lg font-medium">Sazonais</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {opportunitiesData.seasonal.map((opportunity) => (
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} type="seasonal" />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}