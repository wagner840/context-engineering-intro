'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Plus, 
  Globe, 
  Database,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Key,
  Settings,
  Zap
} from 'lucide-react'

export default function NewBlogPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [blogData, setBlogData] = useState({
    name: '',
    domain: '',
    description: '',
    niche: '',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo'
  })
  
  const [wordpressData, setWordpressData] = useState({
    url: '',
    username: '',
    password: '',
    testConnection: false
  })

  const [isCreating, setIsCreating] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const validateStep = (step: number): boolean => {
    const errors: string[] = []
    
    if (step === 1) {
      if (!blogData.name.trim()) errors.push('Nome do blog é obrigatório')
      if (!blogData.domain.trim()) errors.push('Domínio é obrigatório')
      if (!blogData.niche.trim()) errors.push('Nicho é obrigatório')
    }
    
    if (step === 2) {
      if (!wordpressData.url.trim()) errors.push('URL do WordPress é obrigatória')
      if (!wordpressData.username.trim()) errors.push('Usuário é obrigatório')
      if (!wordpressData.password.trim()) errors.push('Application Password é obrigatória')
    }
    
    setValidationErrors(errors)
    return errors.length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const testConnection = async () => {
    // TODO: Implement WordPress connection test
    console.log('Testing WordPress connection...', wordpressData)
    setWordpressData(prev => ({ ...prev, testConnection: true }))
  }

  const createBlog = async () => {
    if (!validateStep(currentStep)) return
    
    setIsCreating(true)
    
    try {
      // TODO: Implement blog creation API call
      console.log('Creating blog...', { blogData, wordpressData })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Redirect to blog dashboard or show success message
      window.location.href = '/blogs'
    } catch (error) {
      console.error('Error creating blog:', error)
      setValidationErrors(['Erro ao criar blog. Tente novamente.'])
    } finally {
      setIsCreating(false)
    }
  }

  const niches = [
    'Tecnologia',
    'Marketing Digital',
    'E-commerce',
    'Saúde e Bem-estar',
    'Educação',
    'Finanças',
    'Viagem',
    'Culinária',
    'Moda',
    'Esportes',
    'Outro'
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Plus className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Novo Blog</h1>
        </div>
        <p className="text-gray-600">
          Configure um novo blog e conecte com seu WordPress
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Passo {currentStep} de {totalSteps}
          </span>
          <span className="text-sm text-gray-500">{Math.round(progress)}% completo</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps */}
      <div className="max-w-2xl mx-auto">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
              <CardDescription>
                Configure as informações fundamentais do seu blog
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Blog *</Label>
                <Input
                  id="name"
                  value={blogData.name}
                  onChange={(e) => setBlogData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="ex: Meu Blog de Tecnologia"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Domínio *</Label>
                <Input
                  id="domain"
                  value={blogData.domain}
                  onChange={(e) => setBlogData(prev => ({ ...prev, domain: e.target.value }))}
                  placeholder="ex: meublog.com"
                />
                <p className="text-xs text-gray-500">
                  Digite apenas o domínio, sem http:// ou www
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={blogData.description}
                  onChange={(e) => setBlogData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o foco e objetivo do seu blog..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="niche">Nicho *</Label>
                <select
                  id="niche"
                  value={blogData.niche}
                  onChange={(e) => setBlogData(prev => ({ ...prev, niche: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecione um nicho...</option>
                  {niches.map((niche) => (
                    <option key={niche} value={niche}>{niche}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <select
                    id="language"
                    value={blogData.language}
                    onChange={(e) => setBlogData(prev => ({ ...prev, language: e.target.value }))}
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
                    onChange={(e) => setBlogData(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="America/Sao_Paulo">América/São Paulo</option>
                    <option value="America/New_York">América/Nova York</option>
                    <option value="Europe/London">Europa/Londres</option>
                  </select>
                </div>
              </div>

              {validationErrors.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc pl-4">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end">
                <Button onClick={nextStep}>
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: WordPress Connection */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Conexão WordPress
              </CardTitle>
              <CardDescription>
                Configure a integração com seu site WordPress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="wp-url">URL do WordPress *</Label>
                <Input
                  id="wp-url"
                  value={wordpressData.url}
                  onChange={(e) => setWordpressData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://seusite.com"
                />
                <p className="text-xs text-gray-500">
                  URL completa do seu site WordPress
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wp-username">Usuário *</Label>
                <Input
                  id="wp-username"
                  value={wordpressData.username}
                  onChange={(e) => setWordpressData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="seu-usuario"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wp-password">Application Password *</Label>
                <Input
                  id="wp-password"
                  type="password"
                  value={wordpressData.password}
                  onChange={(e) => setWordpressData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="xxxx xxxx xxxx xxxx"
                />
                <p className="text-xs text-gray-500">
                  Crie uma Application Password nas configurações do WordPress
                </p>
              </div>

              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  <strong>Como criar uma Application Password:</strong>
                  <ol className="list-decimal pl-4 mt-2 space-y-1">
                    <li>Acesse Usuários → Perfil no WordPress</li>
                    <li>Role até &quot;Application Passwords&quot;</li>
                    <li>Digite um nome (ex: &quot;Dashboard&quot;) e clique em &quot;Add New&quot;</li>
                    <li>Copie a senha gerada e cole aqui</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button variant="outline" onClick={testConnection}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Testar Conexão
                </Button>
              </div>

              {wordpressData.testConnection && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Conexão estabelecida com sucesso!
                  </AlertDescription>
                </Alert>
              )}

              {validationErrors.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc pl-4">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Voltar
                </Button>
                <Button onClick={nextStep}>
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review & Create */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Revisão e Criação
              </CardTitle>
              <CardDescription>
                Revise as configurações e crie seu blog
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Blog Info Summary */}
              <div className="space-y-4">
                <h4 className="font-medium">Informações do Blog</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nome:</span>
                    <span className="font-medium">{blogData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Domínio:</span>
                    <span className="font-medium">{blogData.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nicho:</span>
                    <Badge variant="outline">{blogData.niche}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Idioma:</span>
                    <span className="font-medium">{blogData.language}</span>
                  </div>
                  {blogData.description && (
                    <div>
                      <span className="text-gray-600">Descrição:</span>
                      <p className="mt-1 text-sm">{blogData.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* WordPress Summary */}
              <div className="space-y-4">
                <h4 className="font-medium">Configurações WordPress</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">URL:</span>
                    <span className="font-medium">{wordpressData.url}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usuário:</span>
                    <span className="font-medium">{wordpressData.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conexão:</span>
                    {wordpressData.testConnection ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Testada
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Não testada</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Features that will be enabled */}
              <div className="space-y-4">
                <h4 className="font-medium">Recursos Incluídos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Sincronização automática</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Análise de SEO</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Gestão de keywords</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Analytics integrado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Automação de conteúdo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Backup automático</span>
                  </div>
                </div>
              </div>

              {validationErrors.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc pl-4">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Voltar
                </Button>
                <Button 
                  onClick={createBlog} 
                  disabled={isCreating}
                  className="min-w-32"
                >
                  {isCreating ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-pulse" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Blog
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}