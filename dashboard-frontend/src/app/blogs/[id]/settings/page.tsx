'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Settings, 
  Globe, 
  Database,
  Shield,
  Zap,
  Bell,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  ExternalLink
} from 'lucide-react'

interface BlogSettingsProps {
  params: {
    id: string
  }
}

export default function BlogSettingsPage({ params }: BlogSettingsProps) {
  const [blogData, setBlogData] = useState({
    name: 'Einsof7',
    domain: 'einsof7.com',
    description: 'Blog focado em tecnologia e desenvolvimento web',
    niche: 'Tecnologia',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo'
  })

  const [wordpressSettings, setWordpressSettings] = useState({
    url: 'https://einsof7.com',
    username: 'admin',
    applicationPassword: '••••••••••••••••',
    syncEnabled: true,
    autoPublish: false,
    syncCategories: true,
    syncTags: true,
    syncMedia: true
  })

  const [seoSettings, setSeoSettings] = useState({
    defaultMetaTitle: '',
    defaultMetaDescription: '',
    sitemap: true,
    robotsTxt: true,
    schema: true,
    canonicalUrls: true
  })

  const [notifications, setNotifications] = useState({
    syncAlerts: true,
    errorAlerts: true,
    weeklyReports: false,
    publishNotifications: true
  })

  const [isDirty, setIsDirty] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)

  const handleSave = async () => {
    // TODO: Implement save functionality
    console.log('Saving blog settings...', { blogData, wordpressSettings, seoSettings, notifications })
    setIsDirty(false)
  }

  const testWordPressConnection = async () => {
    setIsTesting(true)
    setTestResult(null)
    
    // Simulate API test
    setTimeout(() => {
      setTestResult('success') // or 'error'
      setIsTesting(false)
    }, 2000)
  }

  const deleteBlog = async () => {
    if (confirm('Tem certeza que deseja excluir este blog? Esta ação não pode ser desfeita.')) {
      // TODO: Implement delete functionality
      console.log('Deleting blog...')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configurações do Blog</h1>
            <p className="text-gray-600">{blogData.name} - {blogData.domain}</p>
          </div>
        </div>
        
        {/* Save Alert */}
        {isDirty && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between w-full">
              <span>Você tem alterações não salvas</span>
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="wordpress" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            WordPress
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Avançado
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>
                Configure as informações básicas do seu blog
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Blog *</Label>
                  <Input
                    id="name"
                    value={blogData.name}
                    onChange={(e) => {
                      setBlogData(prev => ({ ...prev, name: e.target.value }))
                      setIsDirty(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Domínio *</Label>
                  <Input
                    id="domain"
                    value={blogData.domain}
                    onChange={(e) => {
                      setBlogData(prev => ({ ...prev, domain: e.target.value }))
                      setIsDirty(true)
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={blogData.description}
                  onChange={(e) => {
                    setBlogData(prev => ({ ...prev, description: e.target.value }))
                    setIsDirty(true)
                  }}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="niche">Nicho</Label>
                  <Input
                    id="niche"
                    value={blogData.niche}
                    onChange={(e) => {
                      setBlogData(prev => ({ ...prev, niche: e.target.value }))
                      setIsDirty(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <select
                    id="language"
                    value={blogData.language}
                    onChange={(e) => {
                      setBlogData(prev => ({ ...prev, language: e.target.value }))
                      setIsDirty(true)
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <select
                    id="timezone"
                    value={blogData.timezone}
                    onChange={(e) => {
                      setBlogData(prev => ({ ...prev, timezone: e.target.value }))
                      setIsDirty(true)
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="America/Sao_Paulo">América/São Paulo</option>
                    <option value="America/New_York">América/Nova York</option>
                    <option value="Europe/London">Europa/Londres</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WordPress Settings */}
        <TabsContent value="wordpress">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conexão WordPress</CardTitle>
                <CardDescription>
                  Configure a integração com seu site WordPress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="wp-url">URL do WordPress *</Label>
                  <Input
                    id="wp-url"
                    value={wordpressSettings.url}
                    onChange={(e) => {
                      setWordpressSettings(prev => ({ ...prev, url: e.target.value }))
                      setIsDirty(true)
                    }}
                    placeholder="https://seusite.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wp-username">Usuário</Label>
                    <Input
                      id="wp-username"
                      value={wordpressSettings.username}
                      onChange={(e) => {
                        setWordpressSettings(prev => ({ ...prev, username: e.target.value }))
                        setIsDirty(true)
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wp-password">Application Password</Label>
                    <Input
                      id="wp-password"
                      type="password"
                      value={wordpressSettings.applicationPassword}
                      onChange={(e) => {
                        setWordpressSettings(prev => ({ ...prev, applicationPassword: e.target.value }))
                        setIsDirty(true)
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={testWordPressConnection}
                    disabled={isTesting}
                  >
                    {isTesting ? (
                      <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Testar Conexão
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Criar Application Password
                  </Button>
                </div>

                {testResult && (
                  <Alert className={testResult === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                    {testResult === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription>
                      {testResult === 'success' 
                        ? 'Conexão estabelecida com sucesso!'
                        : 'Falha na conexão. Verifique as credenciais.'
                      }
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações de Sincronização</CardTitle>
                <CardDescription>
                  Configure como o conteúdo será sincronizado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base">Sincronização Automática</Label>
                      <p className="text-sm text-gray-600">
                        Sincroniza automaticamente posts e páginas
                      </p>
                    </div>
                    <Switch
                      checked={wordpressSettings.syncEnabled}
                      onCheckedChange={(checked) => {
                        setWordpressSettings(prev => ({ ...prev, syncEnabled: checked }))
                        setIsDirty(true)
                      }}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base">Publicação Automática</Label>
                      <p className="text-sm text-gray-600">
                        Publica automaticamente no WordPress
                      </p>
                    </div>
                    <Switch
                      checked={wordpressSettings.autoPublish}
                      onCheckedChange={(checked) => {
                        setWordpressSettings(prev => ({ ...prev, autoPublish: checked }))
                        setIsDirty(true)
                      }}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base">Sincronizar Categorias</Label>
                      <p className="text-sm text-gray-600">
                        Mantém categorias sincronizadas
                      </p>
                    </div>
                    <Switch
                      checked={wordpressSettings.syncCategories}
                      onCheckedChange={(checked) => {
                        setWordpressSettings(prev => ({ ...prev, syncCategories: checked }))
                        setIsDirty(true)
                      }}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base">Sincronizar Tags</Label>
                      <p className="text-sm text-gray-600">
                        Mantém tags sincronizadas
                      </p>
                    </div>
                    <Switch
                      checked={wordpressSettings.syncTags}
                      onCheckedChange={(checked) => {
                        setWordpressSettings(prev => ({ ...prev, syncTags: checked }))
                        setIsDirty(true)
                      }}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base">Sincronizar Mídia</Label>
                      <p className="text-sm text-gray-600">
                        Sincroniza imagens e arquivos
                      </p>
                    </div>
                    <Switch
                      checked={wordpressSettings.syncMedia}
                      onCheckedChange={(checked) => {
                        setWordpressSettings(prev => ({ ...prev, syncMedia: checked }))
                        setIsDirty(true)
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de SEO</CardTitle>
              <CardDescription>
                Configure as configurações padrão de SEO para este blog
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Título Padrão</Label>
                <Input
                  id="meta-title"
                  value={seoSettings.defaultMetaTitle}
                  onChange={(e) => {
                    setSeoSettings(prev => ({ ...prev, defaultMetaTitle: e.target.value }))
                    setIsDirty(true)
                  }}
                  placeholder="Título padrão para páginas sem meta título..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Descrição Padrão</Label>
                <Textarea
                  id="meta-description"
                  value={seoSettings.defaultMetaDescription}
                  onChange={(e) => {
                    setSeoSettings(prev => ({ ...prev, defaultMetaDescription: e.target.value }))
                    setIsDirty(true)
                  }}
                  placeholder="Descrição padrão para páginas sem meta descrição..."
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Configurações Técnicas</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base">Sitemap XML</Label>
                      <p className="text-sm text-gray-600">
                        Gera sitemap automaticamente
                      </p>
                    </div>
                    <Switch
                      checked={seoSettings.sitemap}
                      onCheckedChange={(checked) => {
                        setSeoSettings(prev => ({ ...prev, sitemap: checked }))
                        setIsDirty(true)
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base">Robots.txt</Label>
                      <p className="text-sm text-gray-600">
                        Configura robots.txt automaticamente
                      </p>
                    </div>
                    <Switch
                      checked={seoSettings.robotsTxt}
                      onCheckedChange={(checked) => {
                        setSeoSettings(prev => ({ ...prev, robotsTxt: checked }))
                        setIsDirty(true)
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base">Schema Markup</Label>
                      <p className="text-sm text-gray-600">
                        Adiciona markup estruturado
                      </p>
                    </div>
                    <Switch
                      checked={seoSettings.schema}
                      onCheckedChange={(checked) => {
                        setSeoSettings(prev => ({ ...prev, schema: checked }))
                        setIsDirty(true)
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base">URLs Canônicas</Label>
                      <p className="text-sm text-gray-600">
                        Adiciona URLs canônicas automaticamente
                      </p>
                    </div>
                    <Switch
                      checked={seoSettings.canonicalUrls}
                      onCheckedChange={(checked) => {
                        setSeoSettings(prev => ({ ...prev, canonicalUrls: checked }))
                        setIsDirty(true)
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificação</CardTitle>
              <CardDescription>
                Configure quando você quer ser notificado sobre este blog
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Alertas de Sincronização</Label>
                    <p className="text-sm text-gray-600">
                      Notifica sobre problemas de sincronização
                    </p>
                  </div>
                  <Switch
                    checked={notifications.syncAlerts}
                    onCheckedChange={(checked) => {
                      setNotifications(prev => ({ ...prev, syncAlerts: checked }))
                      setIsDirty(true)
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Alertas de Erro</Label>
                    <p className="text-sm text-gray-600">
                      Notifica sobre erros críticos
                    </p>
                  </div>
                  <Switch
                    checked={notifications.errorAlerts}
                    onCheckedChange={(checked) => {
                      setNotifications(prev => ({ ...prev, errorAlerts: checked }))
                      setIsDirty(true)
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Relatórios Semanais</Label>
                    <p className="text-sm text-gray-600">
                      Recebe relatórios semanais de performance
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => {
                      setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                      setIsDirty(true)
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Notificações de Publicação</Label>
                    <p className="text-sm text-gray-600">
                      Notifica quando posts são publicados
                    </p>
                  </div>
                  <Switch
                    checked={notifications.publishNotifications}
                    onCheckedChange={(checked) => {
                      setNotifications(prev => ({ ...prev, publishNotifications: checked }))
                      setIsDirty(true)
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
                <CardDescription>
                  Configurações técnicas e de desenvolvedor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>ID do Blog</Label>
                  <Input value={params.id} disabled className="bg-gray-50" />
                  <p className="text-xs text-gray-500">
                    Use este ID para integrações via API
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <Input 
                    value={`https://api.exemplo.com/webhooks/blog/${params.id}`} 
                    disabled 
                    className="bg-gray-50" 
                  />
                  <p className="text-xs text-gray-500">
                    URL para receber notificações de eventos
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Cache</Label>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Limpar Cache
                    </Button>
                    <Button variant="outline">
                      Regenerar Índices
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
                <CardDescription>
                  Ações irreversíveis - use com cuidado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-red-600">Excluir Blog</Label>
                  <p className="text-sm text-gray-600">
                    Remove permanentemente este blog e todos os dados associados.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={deleteBlog}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Blog Permanentemente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}