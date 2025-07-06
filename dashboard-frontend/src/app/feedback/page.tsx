'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
 
  Lightbulb, 
  Bug, 
  Heart, 
  Send,
  CheckCircle,
  TrendingUp,
  Users,
  ThumbsUp,
  MessageCircle
} from 'lucide-react'

const feedbackTypes = [
  {
    id: 'feature',
    label: 'Sugestão de Feature',
    icon: <Lightbulb className="h-5 w-5" />,
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Sugira novas funcionalidades'
  },
  {
    id: 'bug',
    label: 'Reportar Bug',
    icon: <Bug className="h-5 w-5" />,
    color: 'bg-red-100 text-red-800',
    description: 'Reporte problemas encontrados'
  },
  {
    id: 'improvement',
    label: 'Melhoria',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'bg-blue-100 text-blue-800',
    description: 'Sugestões de melhorias'
  },
  {
    id: 'general',
    label: 'Feedback Geral',
    icon: <MessageCircle className="h-5 w-5" />,
    color: 'bg-green-100 text-green-800',
    description: 'Comentários gerais sobre a plataforma'
  }
]

const recentFeedback = [
  {
    id: 1,
    type: 'feature',
    title: 'Integração com Google Analytics',
    description: 'Seria ótimo ter integração direta com GA para tracking de performance...',
    author: 'Ana Silva',
    date: '2024-01-15',
    votes: 23,
    status: 'Em análise'
  },
  {
    id: 2,
    type: 'improvement',
    title: 'Interface do editor de posts',
    description: 'O editor poderia ter mais opções de formatação e preview em tempo real...',
    author: 'Carlos Santos',
    date: '2024-01-14',
    votes: 18,
    status: 'Planejado'
  },
  {
    id: 3,
    type: 'bug',
    title: 'Sincronização WordPress travando',
    description: 'A sincronização para com muitos posts, precisa de otimização...',
    author: 'Maria Oliveira',
    date: '2024-01-13',
    votes: 31,
    status: 'Corrigido'
  },
  {
    id: 4,
    type: 'feature',
    title: 'Dashboard móvel',
    description: 'Um app móvel ou versão responsiva melhorada seria muito útil...',
    author: 'João Pereira',
    date: '2024-01-12',
    votes: 45,
    status: 'Em desenvolvimento'
  }
]

export default function FeedbackPage() {
  const [selectedType, setSelectedType] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    email: '',
    priority: 'medium'
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual submission
    console.log('Feedback submitted:', { ...formData, type: selectedType })
    setSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ title: '', description: '', email: '', priority: 'medium' })
      setSelectedType('')
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em análise': return 'bg-yellow-100 text-yellow-800'
      case 'Planejado': return 'bg-blue-100 text-blue-800'
      case 'Em desenvolvimento': return 'bg-purple-100 text-purple-800'
      case 'Corrigido': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeInfo = (type: string) => {
    return feedbackTypes.find(t => t.id === type) || feedbackTypes[0]
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Feedback Enviado!
                </h2>
                <p className="text-gray-600 mb-4">
                  Obrigado pelo seu feedback. Nossa equipe irá analisar sua sugestão.
                </p>
                <Button onClick={() => setSubmitted(false)}>
                  Enviar Outro Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
        </div>
        <p className="text-gray-600">
          Ajude-nos a melhorar! Sua opinião é fundamental para evoluirmos a plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feedback Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Enviar Feedback</CardTitle>
              <CardDescription>
                Compartilhe suas ideias, reporte bugs ou sugira melhorias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Feedback Type Selection */}
                <div className="space-y-3">
                  <Label>Tipo de Feedback</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {feedbackTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedType === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedType(type.id)}
                      >
                        <div className="flex items-center gap-3">
                          {type.icon}
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-gray-600">{type.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Resumo do seu feedback"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva detalhadamente seu feedback..."
                    rows={5}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail (opcional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                  />
                  <p className="text-xs text-gray-600">
                    Deixe seu e-mail se quiser receber atualizações sobre seu feedback
                  </p>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="critical">Crítica</option>
                  </select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!selectedType || !formData.title || !formData.description}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Feedback
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Impacto da Comunidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">127</div>
                  <div className="text-sm text-gray-600">Feedbacks recebidos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">43</div>
                  <div className="text-sm text-gray-600">Features implementadas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">89</div>
                  <div className="text-sm text-gray-600">Bugs corrigidos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How it Works */}
          <Card>
            <CardHeader>
              <CardTitle>Como Funciona</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <div className="font-medium">Envie seu feedback</div>
                    <div className="text-sm text-gray-600">
                      Escolha o tipo e descreva sua sugestão
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <div className="font-medium">Nossa equipe analisa</div>
                    <div className="text-sm text-gray-600">
                      Avaliamos viabilidade e prioridade
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <div className="font-medium">Implementação</div>
                    <div className="text-sm text-gray-600">
                      Desenvolvemos e notificamos você
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Feedback */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Feedback da Comunidade
          </CardTitle>
          <CardDescription>
            Veja o que outros usuários estão sugerindo e vote nas ideias que você gosta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFeedback.map((feedback) => {
              const typeInfo = getTypeInfo(feedback.type)
              return (
                <div key={feedback.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge className={typeInfo.color}>
                        {typeInfo.icon}
                        <span className="ml-1">{typeInfo.label}</span>
                      </Badge>
                      <Badge className={getStatusColor(feedback.status)}>
                        {feedback.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {feedback.votes}
                      </Button>
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">{feedback.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{feedback.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Por {feedback.author}</span>
                    <span>{new Date(feedback.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}