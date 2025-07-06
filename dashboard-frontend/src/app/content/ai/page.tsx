'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Wand2, 
  Target, 
  FileText,
  Lightbulb,
  BarChart3,
  Settings,
  RotateCcw,
  Download,
  Copy,
  CheckCircle,
  Clock,
  Bot,
  Sparkles
} from 'lucide-react'

const aiTemplates = [
  {
    id: 'blog-post',
    name: 'Post de Blog Completo',
    description: 'Gera um post de blog completo otimizado para SEO',
    category: 'Conteúdo',
    inputs: ['keyword', 'tone', 'length', 'target_audience'],
    estimatedTime: '3-5 min',
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'meta-tags',
    name: 'Meta Tags SEO',
    description: 'Cria títulos e meta descriptions otimizados',
    category: 'SEO',
    inputs: ['content', 'keyword'],
    estimatedTime: '1-2 min',
    icon: <Target className="h-5 w-5" />
  },
  {
    id: 'content-outline',
    name: 'Estrutura de Conteúdo',
    description: 'Gera um outline detalhado para seu conteúdo',
    category: 'Planejamento',
    inputs: ['topic', 'keyword', 'content_type'],
    estimatedTime: '2-3 min',
    icon: <Lightbulb className="h-5 w-5" />
  },
  {
    id: 'social-media',
    name: 'Posts para Redes Sociais',
    description: 'Cria posts otimizados para diferentes plataformas',
    category: 'Social Media',
    inputs: ['content', 'platform', 'tone'],
    estimatedTime: '2-3 min',
    icon: <Sparkles className="h-5 w-5" />
  }
]

const generationHistory = [
  {
    id: 1,
    template: 'Post de Blog Completo',
    keyword: 'seo técnico',
    status: 'completed',
    createdAt: '2024-01-15 14:30',
    wordCount: 2847,
    seoScore: 92
  },
  {
    id: 2,
    template: 'Meta Tags SEO',
    keyword: 'automação marketing',
    status: 'completed',
    createdAt: '2024-01-15 13:15',
    wordCount: 156,
    seoScore: 88
  },
  {
    id: 3,
    template: 'Estrutura de Conteúdo',
    keyword: 'wordpress headless',
    status: 'processing',
    createdAt: '2024-01-15 15:45',
    wordCount: 0,
    seoScore: 0
  }
]

export default function AIContentPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [generationData, setGenerationData] = useState({
    keyword: '',
    topic: '',
    tone: 'professional',
    length: 'medium',
    targetAudience: '',
    contentType: 'blog-post',
    platform: 'blog',
    additionalInstructions: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedContent, setGeneratedContent] = useState('')

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    
    // Simulate AI generation progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 500)

    // Simulate API call
    setTimeout(() => {
      clearInterval(progressInterval)
      setGenerationProgress(100)
      setGeneratedContent(`# ${generationData.topic || generationData.keyword}

## Introdução

Este é um exemplo de conteúdo gerado por IA baseado na keyword "${generationData.keyword}". O conteúdo foi otimizado para SEO e escrito em tom ${generationData.tone}.

## Desenvolvimento

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

### Subtópico 1

Conteúdo relevante sobre o primeiro subtópico relacionado a ${generationData.keyword}.

### Subtópico 2

Informações importantes sobre o segundo aspecto do tema.

## Conclusão

Resumo dos pontos principais e call-to-action relevante.`)
      setIsGenerating(false)
    }, 8000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Conteúdo': return 'bg-blue-100 text-blue-800'
      case 'SEO': return 'bg-green-100 text-green-800'
      case 'Planejamento': return 'bg-purple-100 text-purple-800'
      case 'Social Media': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Bot className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Geração de Conteúdo IA</h1>
        </div>
        <p className="text-gray-600">
          Use inteligência artificial para criar conteúdo otimizado e de alta qualidade
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Generator */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="templates" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="custom">Personalizado</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>

            {/* Templates */}
            <TabsContent value="templates">
              <Card>
                <CardHeader>
                  <CardTitle>Escolha um Template</CardTitle>
                  <CardDescription>
                    Selecione um template pré-configurado para começar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiTemplates.map((template) => (
                      <Card 
                        key={template.id}
                        className={`cursor-pointer transition-colors hover:border-blue-300 ${
                          selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {template.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{template.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge className={getCategoryColor(template.category)}>
                              {template.category}
                            </Badge>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {template.estimatedTime}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Configuration */}
              {selectedTemplate && (
                <Card>
                  <CardHeader>
                    <CardTitle>Configuração</CardTitle>
                    <CardDescription>
                      Configure os parâmetros para a geração
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="keyword">Palavra-chave Principal *</Label>
                        <Input
                          id="keyword"
                          value={generationData.keyword}
                          onChange={(e) => setGenerationData(prev => ({ ...prev, keyword: e.target.value }))}
                          placeholder="ex: seo técnico"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="topic">Tópico/Título</Label>
                        <Input
                          id="topic"
                          value={generationData.topic}
                          onChange={(e) => setGenerationData(prev => ({ ...prev, topic: e.target.value }))}
                          placeholder="ex: Guia Completo de SEO Técnico"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Tom de Voz</Label>
                        <select
                          value={generationData.tone}
                          onChange={(e) => setGenerationData(prev => ({ ...prev, tone: e.target.value }))}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="professional">Profissional</option>
                          <option value="casual">Casual</option>
                          <option value="friendly">Amigável</option>
                          <option value="authoritative">Autoritativo</option>
                          <option value="conversational">Conversacional</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label>Tamanho do Conteúdo</Label>
                        <select
                          value={generationData.length}
                          onChange={(e) => setGenerationData(prev => ({ ...prev, length: e.target.value }))}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="short">Curto (300-500 palavras)</option>
                          <option value="medium">Médio (800-1200 palavras)</option>
                          <option value="long">Longo (1500-2500 palavras)</option>
                          <option value="very-long">Muito Longo (3000+ palavras)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="audience">Público-alvo</Label>
                      <Input
                        id="audience"
                        value={generationData.targetAudience}
                        onChange={(e) => setGenerationData(prev => ({ ...prev, targetAudience: e.target.value }))}
                        placeholder="ex: desenvolvedores web iniciantes"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instruções Adicionais (opcional)</Label>
                      <Textarea
                        id="instructions"
                        value={generationData.additionalInstructions}
                        onChange={(e) => setGenerationData(prev => ({ ...prev, additionalInstructions: e.target.value }))}
                        placeholder="Inclua informações específicas, estilo ou requisitos especiais..."
                        rows={3}
                      />
                    </div>

                    <Button 
                      onClick={handleGenerate}
                      disabled={!generationData.keyword || isGenerating}
                      className="w-full"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                          Gerando... {Math.round(generationProgress)}%
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Gerar Conteúdo
                        </>
                      )}
                    </Button>

                    {isGenerating && (
                      <Progress value={generationProgress} className="w-full" />
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Generated Content */}
              {generatedContent && !isGenerating && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Conteúdo Gerado
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Exportar
                        </Button>
                        <Button size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Usar no Editor
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Custom Generation */}
            <TabsContent value="custom">
              <Card>
                <CardHeader>
                  <CardTitle>Geração Personalizada</CardTitle>
                  <CardDescription>
                    Crie conteúdo com instruções completamente personalizadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customPrompt">Prompt Personalizado</Label>
                    <Textarea
                      id="customPrompt"
                      placeholder="Descreva exatamente o que você quer que a IA crie..."
                      rows={8}
                      className="resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Modelo de IA</Label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="gpt-4">GPT-4 (Mais criativo)</option>
                        <option value="gpt-3.5">GPT-3.5 (Mais rápido)</option>
                        <option value="claude">Claude (Analítico)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Temperatura</Label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="0.3">Baixa (Mais consistente)</option>
                        <option value="0.7">Média (Balanceado)</option>
                        <option value="0.9">Alta (Mais criativo)</option>
                      </select>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Gerar com Prompt Personalizado
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Gerações</CardTitle>
                  <CardDescription>
                    Acompanhe todas as suas gerações de conteúdo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generationHistory.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{item.template}</h4>
                            <p className="text-sm text-gray-600">Keyword: {item.keyword}</p>
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {item.status === 'processing' && <RotateCcw className="h-3 w-3 mr-1 animate-spin" />}
                            {item.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{item.createdAt}</span>
                          <div className="flex items-center gap-4">
                            {item.wordCount > 0 && (
                              <span>{item.wordCount} palavras</span>
                            )}
                            {item.seoScore > 0 && (
                              <span>SEO: {item.seoScore}%</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Usage Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Estatísticas de Uso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">24</div>
                <div className="text-sm text-gray-600">Gerações este mês</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">156k</div>
                <div className="text-sm text-gray-600">Palavras geradas</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">87%</div>
                <div className="text-sm text-gray-600">Score médio SEO</div>
              </div>
            </CardContent>
          </Card>

          {/* AI Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Modelo Padrão</Label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5">GPT-3.5</option>
                  <option value="claude">Claude</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Idioma Padrão</Label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="pt-br">Português (Brasil)</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Tom Padrão</Label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="professional">Profissional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Amigável</option>
                </select>
              </div>

              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Configurações Avançadas
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Novo Post de Blog
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Otimizar SEO
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Sparkles className="h-4 w-4 mr-2" />
                Posts Sociais
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Lightbulb className="h-4 w-4 mr-2" />
                Brainstorm Ideias
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}