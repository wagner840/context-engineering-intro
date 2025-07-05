'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  Zap,
  AlertCircle,
  Plus,
  Eye,
  Settings
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { SemanticSearchSetup } from './semantic-search-setup'

interface SemanticSearchProps {
  query: string
  blogId: string
}

interface SemanticResult {
  keyword: string
  similarity: number
  relevance_score: number
  search_volume?: number
  competition?: string
  search_intent?: string
  related_topics: string[]
  content_suggestions: string[]
}

interface SemanticSearchResponse {
  results: SemanticResult[]
  query_embedding: number[]
  total_found: number
  processing_time: number
}

export function SemanticSearch({ query, blogId }: SemanticSearchProps) {
  
  // Verificar se o sistema está configurado
  const { data: setupStatus } = useQuery({
    queryKey: ['semantic-search-status'],
    queryFn: async () => {
      const response = await fetch('/api/database/setup-semantic-functions')
      if (!response.ok) return { semantic_search_ready: false }
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['semantic-search', query, blogId],
    queryFn: async (): Promise<SemanticSearchResponse> => {
      if (!query.trim()) return { results: [], query_embedding: [], total_found: 0, processing_time: 0 }
      
      const response = await fetch('/api/search/semantic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          blog_id: blogId === 'all' ? undefined : blogId,
          limit: 20,
          similarity_threshold: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro na busca semântica')
      }

      return response.json()
    },
    enabled: !!query.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Mostrar setup se não estiver configurado
  if (setupStatus && !setupStatus.semantic_search_ready) {
    return (
      <div className="space-y-6">
        <Alert className="border-blue-200 bg-blue-50">
          <Settings className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium text-blue-900">Sistema de Busca Semântica não configurado</p>
              <p className="text-blue-700 text-sm">
                Para usar a busca semântica com IA, é necessário configurar as funções RPC no banco de dados.
              </p>
            </div>
          </AlertDescription>
        </Alert>
        
        <SemanticSearchSetup />
      </div>
    )
  }

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.9) return 'text-green-600'
    if (similarity >= 0.8) return 'text-blue-600'
    if (similarity >= 0.7) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getSimilarityLabel = (similarity: number) => {
    if (similarity >= 0.9) return 'Muito similar'
    if (similarity >= 0.8) return 'Similar'
    if (similarity >= 0.7) return 'Relacionada'
    return 'Pouco relacionada'
  }

  const getRelevanceColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-blue-100 text-blue-800'
    if (score >= 40) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'LOW':
        return 'bg-green-100 text-green-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'HIGH':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!query.trim()) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold mb-2">Busca Semântica com IA</h3>
            <p className="text-gray-600 max-w-md">
              Descreva o que você procura em linguagem natural. A IA encontrará 
              keywords relacionadas por significado, não apenas por texto.
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Exemplos:</strong> &quot;conteúdo sobre culinária saudável&quot;, 
                &quot;dicas de investimento para iniciantes&quot;, &quot;tecnologia para empresas&quot;
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Analisando com IA...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
            <span className="text-sm">Processando embeddings semânticos...</span>
          </div>
          <Progress value={65} className="h-2" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium text-red-900">Erro na busca semântica</p>
            <p className="text-red-700">
              Não foi possível processar sua consulta. Verifique se você tem uma 
              chave API do OpenAI configurada.
            </p>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  const results = data?.results || []

  return (
    <div className="space-y-6">
      {/* Informações da Busca */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Análise Semântica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Consulta processada</p>
                <p className="font-semibold">&quot;{query}&quot;</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Keywords encontradas</p>
                <p className="font-semibold">{data?.total_found || 0}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Tempo de processamento</p>
                <p className="font-semibold">{data?.processing_time.toFixed(2)}s</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card>
        <CardHeader>
          <CardTitle>
            Keywords Relacionadas Semanticamente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nenhuma keyword relacionada encontrada</h3>
              <p className="text-gray-600">
                Tente usar termos mais específicos ou diferentes variações
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {results.map((result, index) => (
                <motion.div
                  key={`${result.keyword}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {/* Keyword principal */}
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold">{result.keyword}</h3>
                        
                        <Badge className={getRelevanceColor(result.relevance_score)}>
                          Relevância: {result.relevance_score}%
                        </Badge>
                        
                        <div className={`text-sm font-medium ${getSimilarityColor(result.similarity)}`}>
                          {getSimilarityLabel(result.similarity)} ({(result.similarity * 100).toFixed(1)}%)
                        </div>
                      </div>

                      {/* Métricas básicas */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {result.search_volume && (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <div>
                              <p className="text-xs text-gray-600">Volume de busca</p>
                              <p className="font-semibold">{result.search_volume.toLocaleString()}</p>
                            </div>
                          </div>
                        )}

                        {result.competition && (
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-orange-600" />
                            <div>
                              <p className="text-xs text-gray-600">Competição</p>
                              <Badge className={getCompetitionColor(result.competition)}>
                                {result.competition}
                              </Badge>
                            </div>
                          </div>
                        )}

                        {result.search_intent && (
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-purple-600" />
                            <div>
                              <p className="text-xs text-gray-600">Intenção</p>
                              <p className="font-semibold capitalize">{result.search_intent}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Tópicos relacionados */}
                      {result.related_topics.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Tópicos relacionados:</p>
                          <div className="flex flex-wrap gap-2">
                            {result.related_topics.map((topic, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sugestões de conteúdo */}
                      {result.content_suggestions.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Sugestões de conteúdo:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {result.content_suggestions.slice(0, 3).map((suggestion, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Usar
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Analisar
                      </Button>
                    </div>
                  </div>

                  {/* Barra de similaridade */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Similaridade semântica</span>
                      <span className={`text-xs font-medium ${getSimilarityColor(result.similarity)}`}>
                        {(result.similarity * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={result.similarity * 100} 
                      className="h-2"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dica de uso */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">Dica de Busca Semântica</p>
              <p className="text-xs text-blue-700">
                A busca semântica usa IA para entender o significado das palavras, não apenas o texto. 
                Experimente descrever conceitos, intenções ou contextos em linguagem natural para 
                descobrir keywords que você talvez não pensaria usando busca tradicional.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}