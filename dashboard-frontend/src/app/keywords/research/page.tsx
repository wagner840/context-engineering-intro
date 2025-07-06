'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Plus, 
  Filter, 
  TrendingUp,
  Target,
  Globe,
  BarChart3,
  Eye,
  Download,
  RefreshCw,
  Lightbulb
} from 'lucide-react'

const researchData = {
  suggestions: [
    {
      keyword: 'seo técnico 2024',
      volume: 8100,
      difficulty: 42,
      cpc: 2.80,
      trend: 'up',
      competition: 'medium',
      intent: 'informational',
      related: ['core web vitals', 'seo performance', 'technical optimization']
    },
    {
      keyword: 'automação de conteúdo',
      volume: 3600,
      difficulty: 38,
      cpc: 3.20,
      trend: 'up',
      competition: 'low',
      intent: 'commercial',
      related: ['ai content', 'marketing automation', 'content generation']
    },
    {
      keyword: 'wordpress headless',
      volume: 1900,
      difficulty: 55,
      cpc: 4.10,
      trend: 'stable',
      competition: 'high',
      intent: 'technical',
      related: ['jamstack', 'react wordpress', 'api wordpress']
    },
    {
      keyword: 'link building estratégias',
      volume: 2700,
      difficulty: 47,
      cpc: 3.50,
      trend: 'up',
      competition: 'medium',
      intent: 'informational',
      related: ['backlinks', 'autoridade domínio', 'guest posting']
    }
  ],
  trending: [
    { keyword: 'ai seo tools', volume: 12000, growth: '+150%' },
    { keyword: 'core web vitals optimization', volume: 8500, growth: '+87%' },
    { keyword: 'voice search seo', volume: 6200, growth: '+65%' },
    { keyword: 'e-commerce seo 2024', volume: 9800, growth: '+42%' }
  ]
}

export default function KeywordResearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleResearch = async () => {
    setIsLoading(true)
    // TODO: Implement actual research functionality
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const toggleKeywordSelection = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    )
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'bg-green-100 text-green-800'
    if (difficulty < 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Search className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Pesquisa de Keywords</h1>
        </div>
        <p className="text-gray-600">
          Descubra novas oportunidades de keywords e analise tendências do mercado
        </p>
      </div>

      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Nova Pesquisa</CardTitle>
          <CardDescription>
            Digite um termo para encontrar keywords relacionadas e analisar oportunidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Digite seu termo de pesquisa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-lg"
              />
            </div>
            <Button 
              onClick={handleResearch}
              disabled={!searchQuery || isLoading}
              size="lg"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Pesquisar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="suggestions" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Sugestões
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tendências
          </TabsTrigger>
          <TabsTrigger value="competitor" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Concorrentes
          </TabsTrigger>
        </TabsList>

        {/* Keyword Suggestions */}
        <TabsContent value="suggestions">
          <div className="space-y-4">
            {/* Actions Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedKeywords.length} keywords selecionadas
                </span>
                {selectedKeywords.length > 0 && (
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Selecionadas
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            {/* Keywords List */}
            <div className="space-y-3">
              {researchData.suggestions.map((item, index) => (
                <Card 
                  key={index} 
                  className={`cursor-pointer transition-colors ${
                    selectedKeywords.includes(item.keyword) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => toggleKeywordSelection(item.keyword)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.keyword}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {item.volume.toLocaleString()}/mês
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            KD: {item.difficulty}
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart3 className="h-4 w-4" />
                            CPC: ${item.cpc}
                          </span>
                          <Badge className={getCompetitionColor(item.competition)}>
                            {item.competition}
                          </Badge>
                          <Badge variant="outline">
                            {item.intent}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getDifficultyColor(item.difficulty)}>
                          Dificuldade: {item.difficulty}
                        </Badge>
                        <TrendingUp className={`h-4 w-4 ${
                          item.trend === 'up' ? 'text-green-500' : 'text-gray-400'
                        }`} />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-gray-500 mr-2">Relacionadas:</span>
                      {item.related.map((related, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {related}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Trending Keywords */}
        <TabsContent value="trending">
          <Card>
            <CardHeader>
              <CardTitle>Keywords em Alta</CardTitle>
              <CardDescription>
                Palavras-chave com maior crescimento de busca
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {researchData.trending.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.keyword}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {item.volume.toLocaleString()}/mês
                        </span>
                        <Badge className="bg-green-100 text-green-800">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {item.growth}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitor Analysis */}
        <TabsContent value="competitor">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Concorrentes</CardTitle>
              <CardDescription>
                Descubra keywords que seus concorrentes estão rankeando
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input 
                  placeholder="Digite o domínio do concorrente..."
                  className="max-w-md"
                />
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Analisar Concorrente
                </Button>
                
                <div className="text-center py-8 text-gray-500">
                  <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Digite um domínio para começar a análise</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}