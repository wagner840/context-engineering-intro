import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Settings,
  Globe,
  Database,
  Bot,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { motion } from 'framer-motion'

interface Integration {
  id: string
  name: string
  type: 'n8n' | 'wordpress' | 'supabase' | 'openai'
  status: 'connected' | 'disconnected' | 'error'
  config: {
    url?: string
    api_key?: string
    enabled: boolean
    auto_sync?: boolean
  }
  last_sync?: string
  error_message?: string
}

export const IntegrationSettings = () => {
  // Mock data - substituir por chamada real à API
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'n8n',
      type: 'n8n',
      status: 'connected',
      config: {
        url: 'http://localhost:5678',
        api_key: '**********************',
        enabled: true,
        auto_sync: true
      },
      last_sync: '2024-03-16T10:00:00Z'
    },
    {
      id: '2',
      name: 'WordPress',
      type: 'wordpress',
      status: 'connected',
      config: {
        url: 'https://meusite.com',
        api_key: '**********************',
        enabled: true,
        auto_sync: true
      },
      last_sync: '2024-03-16T09:30:00Z'
    },
    {
      id: '3',
      name: 'Supabase',
      type: 'supabase',
      status: 'connected',
      config: {
        url: 'https://myproject.supabase.co',
        api_key: '**********************',
        enabled: true
      },
      last_sync: '2024-03-16T09:45:00Z'
    },
    {
      id: '4',
      name: 'OpenAI',
      type: 'openai',
      status: 'error',
      config: {
        api_key: '**********************',
        enabled: true
      },
      error_message: 'Chave API inválida ou expirada',
      last_sync: '2024-03-16T08:15:00Z'
    }
  ])

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'n8n':
        return <Settings className="h-5 w-5" />
      case 'wordpress':
        return <Globe className="h-5 w-5" />
      case 'supabase':
        return <Database className="h-5 w-5" />
      case 'openai':
        return <Bot className="h-5 w-5" />
      default:
        return <Settings className="h-5 w-5" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-gray-400" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(integration => {
      if (integration.id === id) {
        return {
          ...integration,
          config: {
            ...integration.config,
            enabled: !integration.config.enabled
          }
        }
      }
      return integration
    }))
  }

  const toggleAutoSync = (id: string) => {
    setIntegrations(integrations.map(integration => {
      if (integration.id === id) {
        return {
          ...integration,
          config: {
            ...integration.config,
            auto_sync: !integration.config.auto_sync
          }
        }
      }
      return integration
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Integrações</h2>
          <p className="text-sm text-gray-600">
            Gerencie suas conexões com serviços externos
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Atualizar Status
        </Button>
      </div>

      {/* Lista de Integrações */}
      <div className="space-y-4">
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Ícone e Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      {getIntegrationIcon(integration.type)}
                      <div>
                        <h3 className="font-medium">{integration.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusIcon(integration.status)}
                          <span className="text-sm text-gray-600">
                            {integration.status === 'connected' ? 'Conectado' :
                             integration.status === 'disconnected' ? 'Desconectado' : 'Erro'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Configurações */}
                    <div className="space-y-4">
                      {integration.config.url && (
                        <div>
                          <Label>URL</Label>
                          <Input
                            value={integration.config.url}
                            readOnly
                            className="bg-gray-50"
                          />
                        </div>
                      )}

                      {integration.config.api_key && (
                        <div>
                          <Label>Chave API</Label>
                          <Input
                            value={integration.config.api_key}
                            readOnly
                            type="password"
                            className="bg-gray-50"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={integration.config.enabled}
                            onCheckedChange={() => toggleIntegration(integration.id)}
                          />
                          <Label>Ativo</Label>
                        </div>

                        {integration.type !== 'supabase' && (
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={integration.config.auto_sync}
                              onCheckedChange={() => toggleAutoSync(integration.id)}
                            />
                            <Label>Sincronização Automática</Label>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status e Última Sincronização */}
                    <div className="mt-4 flex items-center gap-4">
                      <Badge
                        variant={
                          integration.status === 'connected'
                            ? 'default'
                            : integration.status === 'disconnected'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {integration.status === 'connected' && 'Conectado'}
                        {integration.status === 'disconnected' && 'Desconectado'}
                        {integration.status === 'error' && 'Erro'}
                      </Badge>

                      {integration.last_sync && (
                        <span className="text-sm text-gray-500">
                          Última sincronização: {formatDate(integration.last_sync)}
                        </span>
                      )}
                    </div>

                    {/* Mensagem de Erro */}
                    {integration.error_message && (
                      <div className="mt-2 text-sm text-red-600">
                        {integration.error_message}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
