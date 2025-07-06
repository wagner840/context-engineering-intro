'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  RefreshCw, 
  Upload, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Wifi, 
  WifiOff,
  ArrowUpDown,
  Settings,
  Clock
} from 'lucide-react'
import { useWordPressSync, useWordPressConnection } from '@/hooks/use-wordpress-sync'
import { Loading } from '@/components/ui/loading'

interface WordPressSyncProps {
  blogId: string
}

export function WordPressSync({ blogId }: WordPressSyncProps) {
  const [selectedSyncDirection, setSelectedSyncDirection] = useState<'to-wp' | 'from-wp'>('to-wp')
  
  const {
    syncStatus,
    syncSettings,
    testConnection,
    syncAllToWordPress,
    syncAllFromWordPress,
    isTestingConnection,
    isSyncingAll,
  } = useWordPressSync(blogId)

  const {
    connectionStatus,
    refetchConnection,
    isConnected,
    connectionError,
  } = useWordPressConnection(blogId)

  const handleTestConnection = () => {
    testConnection.mutate()
  }

  const handleSyncAll = () => {
    if (selectedSyncDirection === 'to-wp') {
      syncAllToWordPress.mutate()
    } else {
      syncAllFromWordPress.mutate()
    }
  }

  const getConnectionStatusIcon = () => {
    if (isConnected) {
      return <Wifi className="h-5 w-5 text-green-600" />
    } else {
      return <WifiOff className="h-5 w-5 text-red-600" />
    }
  }

  const getConnectionStatusBadge = () => {
    if (connectionStatus === undefined) {
      return <Badge variant="secondary">Verificando...</Badge>
    }
    
    if (isConnected) {
      return <Badge className="bg-green-100 text-green-800">Conectado</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800">Desconectado</Badge>
    }
  }

  const renderSyncResults = () => {
    if (!syncStatus.results) return null

    const { results } = syncStatus
    const isSuccess = results.success
    const icon = isSuccess ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />

    return (
      <Alert className={isSuccess ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
        <div className="flex items-start gap-3">
          {icon}
          <div className="flex-1">
            <AlertDescription className="font-medium mb-2">
              {results.message}
            </AlertDescription>
            
            {results.details && (
              <div className="space-y-2">
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600">
                    ✓ Sincronizados: {results.details.synced}
                  </span>
                  {results.details.errors > 0 && (
                    <span className="text-red-600">
                      ✗ Erros: {results.details.errors}
                    </span>
                  )}
                </div>
                
                {results.details.errorDetails && results.details.errorDetails.length > 0 && (
                  <div className="mt-3">
                    <details className="text-sm">
                      <summary className="cursor-pointer text-red-600 hover:text-red-700">
                        Ver detalhes dos erros
                      </summary>
                      <ul className="mt-2 space-y-1 text-red-600">
                        {results.details.errorDetails.map((error, index) => (
                          <li key={index} className="text-xs">• {error}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status da Conexão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getConnectionStatusIcon()}
            Status da Conexão WordPress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                {getConnectionStatusBadge()}
              </div>
              
              {connectionError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm text-red-700">
                    {connectionError}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => refetchConnection()}
                disabled={isTestingConnection}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isTestingConnection ? 'animate-spin' : ''}`} />
                Verificar
              </Button>
              
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTestingConnection}
              >
                {isTestingConnection ? (
                  <Loading variant="dots" size="sm" />
                ) : (
                  <Settings className="h-4 w-4 mr-2" />
                )}
                Testar Conexão
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sincronização */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            Sincronização de Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Direção da Sincronização */}
          <div>
            <h4 className="text-sm font-medium mb-3">Direção da Sincronização</h4>
            <div className="flex gap-3">
              <Button
                variant={selectedSyncDirection === 'to-wp' ? 'default' : 'outline'}
                onClick={() => setSelectedSyncDirection('to-wp')}
                className="flex items-center gap-2"
                disabled={isSyncingAll}
              >
                <Upload className="h-4 w-4" />
                Supabase → WordPress
              </Button>
              
              <Button
                variant={selectedSyncDirection === 'from-wp' ? 'default' : 'outline'}
                onClick={() => setSelectedSyncDirection('from-wp')}
                className="flex items-center gap-2"
                disabled={isSyncingAll}
              >
                <Download className="h-4 w-4" />
                WordPress → Supabase
              </Button>
            </div>
          </div>

          <Separator />

          {/* Status da Sincronização */}
          {syncStatus.isRunning && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progresso da Sincronização</span>
                <span className="text-sm text-gray-600">{syncStatus.progress}%</span>
              </div>
              
              <Progress value={syncStatus.progress} className="h-2" />
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                {syncStatus.currentTask}
              </div>
            </div>
          )}

          {/* Resultados da Sincronização */}
          {renderSyncResults()}

          {/* Ações */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSyncAll}
              disabled={!isConnected || isSyncingAll || syncStatus.isRunning}
              className="flex items-center gap-2"
            >
              {isSyncingAll ? (
                <Loading variant="dots" size="sm" />
              ) : selectedSyncDirection === 'to-wp' ? (
                <Upload className="h-4 w-4" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              
              {selectedSyncDirection === 'to-wp' 
                ? 'Sincronizar Todos para WordPress'
                : 'Importar Todos do WordPress'
              }
            </Button>

            {!isConnected && (
              <Alert className="flex-1">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Conexão com WordPress necessária para sincronização
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Descrição da Sincronização */}
          <div className="text-sm text-gray-600 space-y-2">
            <p className="font-medium">
              {selectedSyncDirection === 'to-wp' 
                ? 'Sincronização Supabase → WordPress:'
                : 'Importação WordPress → Supabase:'
              }
            </p>
            <ul className="space-y-1 text-xs pl-4">
              {selectedSyncDirection === 'to-wp' ? (
                <>
                  <li>• Envia posts marcados para sincronização para o WordPress</li>
                  <li>• Atualiza posts existentes ou cria novos</li>
                  <li>• Preserva IDs do WordPress para sincronização futura</li>
                  <li>• Inclui metadados SEO e conteúdo completo</li>
                </>
              ) : (
                <>
                  <li>• Importa todos os posts do WordPress</li>
                  <li>• Atualiza posts existentes ou cria novos</li>
                  <li>• Preserva estrutura e metadados originais</li>
                  <li>• Mantém referência aos IDs do WordPress</li>
                </>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Sincronização Automática */}
      {syncSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Sincronização Automática
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Status da Sincronização Automática</p>
                <p className="text-sm text-gray-600">
                  Sincronizar automaticamente quando posts forem criados ou atualizados
                </p>
              </div>
              
              <Badge variant={(syncSettings as any).auto_sync_enabled ? 'default' : 'secondary'}>
                {(syncSettings as any).auto_sync_enabled ? 'Ativada' : 'Desativada'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}