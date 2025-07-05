'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Settings, 
  Zap,
  Database,
  Sparkles,
  RefreshCw
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface DatabaseStatus {
  semantic_search_ready: boolean
  database_status: {
    functions_available: {
      match_keywords_semantic: boolean
      find_similar_keywords: boolean
      find_similar_posts: boolean
    }
    extensions_installed: { extname: string; extversion: string }[]
    embedding_data: {
      keyword_variations_with_embeddings: number
      content_posts_with_embeddings: number
    }
  }
  recommendations: string[]
}

export function SemanticSearchSetup() {
  const [setupStage, setSetupStage] = useState<'checking' | 'setup' | 'testing' | 'complete'>('checking')
  const queryClient = useQueryClient()

  // Verificar status do banco
  const { data: status, isLoading, refetch } = useQuery({
    queryKey: ['semantic-search-status'],
    queryFn: async (): Promise<DatabaseStatus> => {
      const response = await fetch('/api/database/setup-semantic-functions')
      if (!response.ok) throw new Error('Erro ao verificar status')
      return response.json()
    },
    staleTime: 30 * 1000, // 30 segundos
  })

  // Executar setup automático
  const setupMutation = useMutation({
    mutationFn: async () => {
      setSetupStage('setup')
      const response = await fetch('/api/database/setup-semantic-functions', {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Erro no setup')
      return response.json()
    },
    onSuccess: () => {
      setSetupStage('testing')
      toast.success('Funções RPC configuradas com sucesso!')
      
      // Aguardar um pouco e testar
      setTimeout(() => {
        setSetupStage('complete')
        queryClient.invalidateQueries({ queryKey: ['semantic-search-status'] })
        refetch()
      }, 2000)
    },
    onError: (error) => {
      setSetupStage('checking')
      toast.error(`Erro no setup: ${(error as Error).message}`)
    }
  })

  const getStatusIcon = (isReady: boolean) => {
    return isReady ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    )
  }

  const getStatusColor = (isReady: boolean) => {
    return isReady ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Verificando Configuração da Busca Semântica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Verificando status do banco de dados...</span>
          </div>
          <Progress value={50} className="h-2" />
        </CardContent>
      </Card>
    )
  }

  if (!status) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Não foi possível verificar o status da busca semântica.
        </AlertDescription>
      </Alert>
    )
  }

  const isFullyReady = status.semantic_search_ready && 
                      status.database_status.embedding_data.keyword_variations_with_embeddings > 0

  if (isFullyReady) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-green-900">Sistema de Busca Semântica Ativo</p>
              <p className="text-green-700 text-sm">
                {status.database_status.embedding_data.keyword_variations_with_embeddings} keywords com embeddings disponíveis
              </p>
            </div>
            <Sparkles className="h-6 w-6 text-green-600" />
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Configuração da Busca Semântica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Funções RPC */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Funções do Banco de Dados
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">match_keywords_semantic</span>
                <Badge className={getStatusColor(status.database_status.functions_available.match_keywords_semantic)}>
                  {getStatusIcon(status.database_status.functions_available.match_keywords_semantic)}
                  {status.database_status.functions_available.match_keywords_semantic ? 'Ativo' : 'Faltando'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">find_similar_keywords</span>
                <Badge className={getStatusColor(status.database_status.functions_available.find_similar_keywords)}>
                  {getStatusIcon(status.database_status.functions_available.find_similar_keywords)}
                  {status.database_status.functions_available.find_similar_keywords ? 'Ativo' : 'Faltando'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">find_similar_posts</span>
                <Badge className={getStatusColor(status.database_status.functions_available.find_similar_posts)}>
                  {getStatusIcon(status.database_status.functions_available.find_similar_posts)}
                  {status.database_status.functions_available.find_similar_posts ? 'Ativo' : 'Faltando'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Extensões */}
          <div>
            <h4 className="font-medium mb-3">Extensões do PostgreSQL</h4>
            <div className="space-y-2">
              {status.database_status.extensions_installed.length > 0 ? (
                status.database_status.extensions_installed.map((ext) => (
                  <div key={ext.extname} className="flex items-center justify-between">
                    <span className="text-sm">{ext.extname}</span>
                    <Badge className="bg-green-100 text-green-800">
                      v{ext.extversion}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">Nenhuma extensão detectada</p>
              )}
            </div>
          </div>

          {/* Dados de Embedding */}
          <div>
            <h4 className="font-medium mb-3">Dados de Embedding</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 border rounded">
                <p className="text-2xl font-bold text-blue-600">
                  {status.database_status.embedding_data.keyword_variations_with_embeddings}
                </p>
                <p className="text-xs text-gray-600">Keywords</p>
              </div>
              <div className="text-center p-3 border rounded">
                <p className="text-2xl font-bold text-purple-600">
                  {status.database_status.embedding_data.content_posts_with_embeddings}
                </p>
                <p className="text-xs text-gray-600">Posts</p>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Setup Progress */}
      {setupMutation.isPending && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                {setupStage === 'setup' && <Database className="h-8 w-8 text-blue-600 animate-pulse" />}
                {setupStage === 'testing' && <Zap className="h-8 w-8 text-yellow-600 animate-pulse" />}
                {setupStage === 'complete' && <CheckCircle className="h-8 w-8 text-green-600" />}
              </div>
              
              <div>
                {setupStage === 'setup' && <p>Configurando funções RPC...</p>}
                {setupStage === 'testing' && <p>Testando configuração...</p>}
                {setupStage === 'complete' && <p>Setup completo!</p>}
              </div>
              
              <Progress 
                value={setupStage === 'setup' ? 50 : setupStage === 'testing' ? 80 : 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ações */}
      <Card>
        <CardHeader>
          <CardTitle>Ações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {!status.semantic_search_ready && (
            <Button
              onClick={() => setupMutation.mutate()}
              disabled={setupMutation.isPending}
              className="w-full"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Configurar Busca Semântica Automaticamente
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Verificar Status Novamente
          </Button>

          {/* Recomendações */}
          {status.recommendations.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Recomendações:</p>
                  <ul className="text-sm space-y-1">
                    {status.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

        </CardContent>
      </Card>
    </div>
  )
}