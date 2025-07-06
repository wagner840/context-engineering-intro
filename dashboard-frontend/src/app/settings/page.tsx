'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database,
  Key,
  Zap,
  Save,
  AlertCircle,
  CheckCircle,
  Globe,
} from 'lucide-react'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    syncAlerts: true,
    weeklyReports: true
  })

  const [apiKeys, setApiKeys] = useState({
    openai: '••••••••••••••••',
    wordpress_einsof7: '••••••••••••••••',
    wordpress_opetmil: '••••••••••••••••',
    n8n: '••••••••••••••••'
  })

  const [profile, setProfile] = useState({
    name: 'Usuario',
    email: 'usuario@example.com',
    timezone: 'America/Sao_Paulo',
    language: 'pt-BR'
  })

  const [isDirty, setIsDirty] = useState(false)

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving settings...')
    setIsDirty(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        </div>
        <p className="text-gray-600">
          Gerencie suas preferências, integrações e configurações do sistema
        </p>
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

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Banco de Dados
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais e preferências
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => {
                      setProfile(prev => ({ ...prev, name: e.target.value }))
                      setIsDirty(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => {
                      setProfile(prev => ({ ...prev, email: e.target.value }))
                      setIsDirty(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Input
                    id="timezone"
                    value={profile.timezone}
                    onChange={(e) => {
                      setProfile(prev => ({ ...prev, timezone: e.target.value }))
                      setIsDirty(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Input
                    id="language"
                    value={profile.language}
                    onChange={(e) => {
                      setProfile(prev => ({ ...prev, language: e.target.value }))
                      setIsDirty(true)
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure como e quando você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Notificações por E-mail</Label>
                    <p className="text-sm text-gray-600">
                      Receba atualizações importantes por e-mail
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => {
                      setNotifications(prev => ({ ...prev, email: checked }))
                      setIsDirty(true)
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Notificações Push</Label>
                    <p className="text-sm text-gray-600">
                      Notificações em tempo real no navegador
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => {
                      setNotifications(prev => ({ ...prev, push: checked }))
                      setIsDirty(true)
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Alertas de Sincronização</Label>
                    <p className="text-sm text-gray-600">
                      Seja notificado sobre problemas de sincronização
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
                    <Label className="text-base">Relatórios Semanais</Label>
                    <p className="text-sm text-gray-600">
                      Receba um resumo semanal das atividades
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chaves de API</CardTitle>
                <CardDescription>
                  Configure as chaves de API para integrações externas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openai-key" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      OpenAI API Key
                    </Label>
                    <Input
                      id="openai-key"
                      type="password"
                      value={apiKeys.openai}
                      onChange={(e) => {
                        setApiKeys(prev => ({ ...prev, openai: e.target.value }))
                        setIsDirty(true)
                      }}
                      placeholder="sk-..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wp-einsof7-key" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      WordPress Einsof7 API Key
                    </Label>
                    <Input
                      id="wp-einsof7-key"
                      type="password"
                      value={apiKeys.wordpress_einsof7}
                      onChange={(e) => {
                        setApiKeys(prev => ({ ...prev, wordpress_einsof7: e.target.value }))
                        setIsDirty(true)
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wp-opetmil-key" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      WordPress Opetmil API Key
                    </Label>
                    <Input
                      id="wp-opetmil-key"
                      type="password"
                      value={apiKeys.wordpress_opetmil}
                      onChange={(e) => {
                        setApiKeys(prev => ({ ...prev, wordpress_opetmil: e.target.value }))
                        setIsDirty(true)
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="n8n-key" className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      n8n API Key
                    </Label>
                    <Input
                      id="n8n-key"
                      type="password"
                      value={apiKeys.n8n}
                      onChange={(e) => {
                        setApiKeys(prev => ({ ...prev, n8n: e.target.value }))
                        setIsDirty(true)
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status das Integrações</CardTitle>
                <CardDescription>
                  Status atual das suas integrações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Supabase
                    </span>
                    <Badge variant="default">Conectado</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      WordPress (Einsof7)
                    </span>
                    <Badge variant="default">Conectado</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      WordPress (Opetmil)
                    </span>
                    <Badge variant="secondary">Verificando</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      n8n
                    </span>
                    <Badge variant="default">Conectado</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Mantenha sua conta segura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Alterar Senha</Label>
                  <p className="text-sm text-gray-600 mb-3">
                    Recomendamos alterar sua senha regularmente
                  </p>
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Alterar Senha
                  </Button>
                </div>

                <Separator />

                <div>
                  <Label className="text-base">Autenticação de Dois Fatores</Label>
                  <p className="text-sm text-gray-600 mb-3">
                    Adicione uma camada extra de segurança à sua conta
                  </p>
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Configurar 2FA
                  </Button>
                </div>

                <Separator />

                <div>
                  <Label className="text-base">Sessões Ativas</Label>
                  <p className="text-sm text-gray-600 mb-3">
                    Gerencie dispositivos com acesso à sua conta
                  </p>
                  <Button variant="outline">
                    Ver Sessões Ativas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Banco de Dados</CardTitle>
              <CardDescription>
                Configurações e manutenção do Supabase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-5 h-5 text-blue-600" />
                    <span className="font-medium">Status da Conexão</span>
                  </div>
                  <Badge variant="default">Conectado</Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Backup Automático</span>
                  </div>
                  <Badge variant="default">Ativo</Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Testar Conexão
                </Button>
                <Button variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Verificar Permissões RLS
                </Button>
                <Button variant="outline" className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Executar Diagnóstico
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}