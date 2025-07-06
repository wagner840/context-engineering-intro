'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  HelpCircle, 
  Search, 
  Book, 
  Video, 
  MessageCircle, 
  ExternalLink,
  Star,
  Clock,
  User,
  Zap,
  Database,
  Settings,
  BarChart3
} from 'lucide-react'

const faqData = [
  {
    category: 'Getting Started',
    icon: <Star className="h-5 w-5" />,
    items: [
      {
        question: 'Como adicionar um novo blog?',
        answer: 'Vá para a página de Blogs e clique em "Novo Blog". Preencha o nome, domínio e configurações do WordPress.',
        tags: ['blog', 'setup']
      },
      {
        question: 'Como configurar a sincronização com WordPress?',
        answer: 'Nas configurações do blog, adicione as credenciais da API do WordPress e ative a sincronização automática.',
        tags: ['wordpress', 'sync']
      },
      {
        question: 'Como importar keywords existentes?',
        answer: 'Use a ferramenta de importação na página Keywords ou conecte-se a uma ferramenta de SEO como SEMrush.',
        tags: ['keywords', 'import']
      }
    ]
  },
  {
    category: 'Keywords & SEO',
    icon: <Search className="h-5 w-5" />,
    items: [
      {
        question: 'Como funciona a pesquisa semântica?',
        answer: 'A pesquisa semântica usa IA para encontrar keywords relacionadas baseado no contexto e significado, não apenas palavras exatas.',
        tags: ['semantic', 'ai', 'search']
      },
      {
        question: 'O que são clusters de keywords?',
        answer: 'Clusters agrupam keywords similares para criar conteúdo mais abrangente e melhorar o ranking nos motores de busca.',
        tags: ['clusters', 'seo']
      },
      {
        question: 'Como calcular o score de oportunidade?',
        answer: 'O score combina volume de busca, dificuldade e competição para identificar as melhores oportunidades de conteúdo.',
        tags: ['opportunity', 'score']
      }
    ]
  },
  {
    category: 'Automation & Workflows',
    icon: <Zap className="h-5 w-5" />,
    items: [
      {
        question: 'Como configurar workflows do n8n?',
        answer: 'Vá para Automação > Workflows e use os templates prontos ou crie seus próprios workflows personalizados.',
        tags: ['n8n', 'automation']
      },
      {
        question: 'Como automatizar a criação de conteúdo?',
        answer: 'Configure workflows que usam IA para gerar conteúdo baseado em keywords e templates predefinidos.',
        tags: ['content', 'ai', 'automation']
      },
      {
        question: 'Como monitorar execuções de workflows?',
        answer: 'Na aba Execuções você pode ver o histórico, status e logs detalhados de todas as automações.',
        tags: ['monitoring', 'logs']
      }
    ]
  },
  {
    category: 'Technical Issues',
    icon: <Settings className="h-5 w-5" />,
    items: [
      {
        question: 'Erro 404 em páginas do dashboard',
        answer: 'Verifique se todas as dependências estão instaladas e se o servidor de desenvolvimento está rodando corretamente.',
        tags: ['404', 'error', 'troubleshooting']
      },
      {
        question: 'Problemas de conexão com Supabase',
        answer: 'Verifique as configurações RLS e se as chaves de API estão corretas nas variáveis de ambiente.',
        tags: ['supabase', 'connection', 'rls']
      },
      {
        question: 'Sincronização WordPress falhando',
        answer: 'Confirme se as credenciais do WordPress estão corretas e se a API REST está habilitada.',
        tags: ['wordpress', 'sync', 'api']
      }
    ]
  }
]

const tutorials = [
  {
    title: 'Configuração Inicial do Sistema',
    description: 'Aprenda a configurar seu primeiro blog e conectar com WordPress',
    duration: '15 min',
    difficulty: 'Beginner',
    tags: ['setup', 'getting-started']
  },
  {
    title: 'Pesquisa e Análise de Keywords',
    description: 'Como usar as ferramentas de pesquisa semântica e análise de oportunidades',
    duration: '20 min',
    difficulty: 'Intermediate',
    tags: ['keywords', 'seo', 'analysis']
  },
  {
    title: 'Automatização com n8n',
    description: 'Criando workflows para automatizar criação de conteúdo e sincronização',
    duration: '30 min',
    difficulty: 'Advanced',
    tags: ['automation', 'n8n', 'workflows']
  },
  {
    title: 'Dashboard e Analytics',
    description: 'Interpretando métricas e usando dashboards para tomada de decisões',
    duration: '12 min',
    difficulty: 'Beginner',
    tags: ['analytics', 'dashboard', 'metrics']
  }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredFAQ = faqData.filter(category => {
    if (selectedCategory !== 'all' && category.category !== selectedCategory) return false
    
    if (searchQuery) {
      return category.items.some(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    return true
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Central de Ajuda</h1>
        </div>
        <p className="text-gray-600">
          Encontre respostas, tutoriais e suporte para usar a plataforma
        </p>
      </div>

      {/* Search */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por problemas, funcionalidades, tutoriais..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Tutoriais
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            Guias
          </TabsTrigger>
        </TabsList>

        {/* FAQ Section */}
        <TabsContent value="faq">
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                Todas as categorias
              </Button>
              {faqData.map((category) => (
                <Button
                  key={category.category}
                  variant={selectedCategory === category.category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.category)}
                  className="flex items-center gap-2"
                >
                  {category.icon}
                  {category.category}
                </Button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-6">
              {filteredFAQ.map((category) => (
                <Card key={category.category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {category.icon}
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.items
                        .filter(item => {
                          if (!searchQuery) return true
                          return item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                        })
                        .map((item, index) => (
                        <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                          <h4 className="font-medium text-gray-900 mb-2">{item.question}</h4>
                          <p className="text-gray-600 mb-3">{item.answer}</p>
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tutorials Section */}
        <TabsContent value="tutorials">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutorials.map((tutorial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                    <Video className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardDescription>{tutorial.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {tutorial.duration}
                    </div>
                    <Badge className={getDifficultyColor(tutorial.difficulty)}>
                      {tutorial.difficulty}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tutorial.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full" variant="outline">
                    <Video className="h-4 w-4 mr-2" />
                    Assistir Tutorial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Guides Section */}
        <TabsContent value="guides">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Guia de Configuração
                </CardTitle>
                <CardDescription>
                  Setup completo da plataforma, integrações e primeiros passos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ler Guia
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-green-600" />
                  SEO e Keywords
                </CardTitle>
                <CardDescription>
                  Estratégias avançadas de SEO e pesquisa de palavras-chave
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ler Guia
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  Automação Avançada
                </CardTitle>
                <CardDescription>
                  Workflows complexos e integrações personalizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ler Guia
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                  Analytics e Relatórios
                </CardTitle>
                <CardDescription>
                  Interpretando dados e criando relatórios personalizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ler Guia
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Troubleshooting
                </CardTitle>
                <CardDescription>
                  Resolução de problemas comuns e dicas de otimização
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ler Guia
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  Best Practices
                </CardTitle>
                <CardDescription>
                  Melhores práticas e dicas de especialistas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ler Guia
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Contact Support */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Ainda precisa de ajuda?</CardTitle>
          <CardDescription>
            Nossa equipe de suporte está pronta para ajudar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Entrar em Contato
            </Button>
            <Button variant="outline" className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              Documentação Completa
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}