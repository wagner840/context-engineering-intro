'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { X, Plus, Search, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react'

interface SEOSettingsProps {
  title: string
  description: string
  keywords: string[]
  onUpdate: (data: { title: string; description: string; keywords: string[] }) => void
}

interface SEOScore {
  score: number
  issues: string[]
  suggestions: string[]
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const getScoreIcon = (score: number) => {
  if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
  if (score >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-600" />
  return <AlertCircle className="h-5 w-5 text-red-600" />
}

export function SEOSettings({ title, description, keywords, onUpdate }: SEOSettingsProps) {
  const [seoTitle, setSeoTitle] = useState(title)
  const [seoDescription, setSeoDescription] = useState(description)
  const [seoKeywords, setSeoKeywords] = useState<string[]>(keywords)
  const [newKeyword, setNewKeyword] = useState('')
  const [seoScore, setSeoScore] = useState<SEOScore>({ score: 0, issues: [], suggestions: [] })

  const addKeyword = () => {
    if (newKeyword.trim() && !seoKeywords.includes(newKeyword.trim())) {
      setSeoKeywords([...seoKeywords, newKeyword.trim()])
      setNewKeyword('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setSeoKeywords(seoKeywords.filter(k => k !== keyword))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword()
    }
  }

  useEffect(() => {
    setSeoTitle(title)
    setSeoDescription(description)
    setSeoKeywords(keywords)
  }, [title, description, keywords])

  useEffect(() => {
    const calculateSEOScore = () => {
      const issues: string[] = []
      const suggestions: string[] = []
      let score = 0
  
      // Análise do título
      if (seoTitle.length === 0) {
        issues.push('Título SEO está vazio')
      } else if (seoTitle.length < 30) {
        issues.push('Título SEO muito curto (mínimo 30 caracteres)')
      } else if (seoTitle.length > 60) {
        issues.push('Título SEO muito longo (máximo 60 caracteres)')
      } else {
        score += 30
      }
  
      // Análise da descrição
      if (seoDescription.length === 0) {
        issues.push('Meta descrição está vazia')
      } else if (seoDescription.length < 120) {
        issues.push('Meta descrição muito curta (mínimo 120 caracteres)')
      } else if (seoDescription.length > 160) {
        issues.push('Meta descrição muito longa (máximo 160 caracteres)')
      } else {
        score += 30
      }
  
      // Análise das palavras-chave
      if (seoKeywords.length === 0) {
        issues.push('Nenhuma palavra-chave definida')
      } else if (seoKeywords.length < 3) {
        suggestions.push('Considere adicionar mais palavras-chave (3-5 recomendado)')
      } else if (seoKeywords.length > 10) {
        suggestions.push('Muitas palavras-chave podem diluir o foco')
      } else {
        score += 20
      }
  
      // Verificar se palavras-chave estão no título
      const titleWords = seoTitle.toLowerCase().split(' ')
      const keywordsInTitle = seoKeywords.filter(keyword => 
        titleWords.some(word => word.includes(keyword.toLowerCase()))
      )
  
      if (keywordsInTitle.length > 0) {
        score += 10
      } else {
        suggestions.push('Considere incluir palavras-chave no título')
      }
  
      // Verificar se palavras-chave estão na descrição
      const descriptionWords = seoDescription.toLowerCase().split(' ')
      const keywordsInDescription = seoKeywords.filter(keyword => 
        descriptionWords.some(word => word.includes(keyword.toLowerCase()))
      )
  
      if (keywordsInDescription.length > 0) {
        score += 10
      } else {
        suggestions.push('Considere incluir palavras-chave na descrição')
      }
  
      setSeoScore({ score, issues, suggestions })
    }
    calculateSEOScore()
  }, [seoTitle, seoDescription, seoKeywords])

  useEffect(() => {
    const handleUpdate = () => {
      onUpdate({
        title: seoTitle,
        description: seoDescription,
        keywords: seoKeywords,
      })
    }

    const timer = setTimeout(() => {
      handleUpdate()
    }, 500)

    return () => clearTimeout(timer)
  }, [seoTitle, seoDescription, seoKeywords, onUpdate])

  return (
    <div className="space-y-6">
      {/* Score SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Análise SEO
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            {getScoreIcon(seoScore.score)}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Score SEO</span>
                <span className={`text-sm font-bold ${getScoreColor(seoScore.score)}`}>
                  {seoScore.score}/100
                </span>
              </div>
              <Progress value={seoScore.score} className="h-2" />
            </div>
          </div>

          {seoScore.issues.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-red-600">Problemas encontrados:</h4>
              <ul className="space-y-1">
                {seoScore.issues.map((issue, index) => (
                  <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {seoScore.suggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-yellow-600">Sugestões:</h4>
              <ul className="space-y-1">
                {seoScore.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-yellow-600 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configurações SEO */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="seo-title">Título SEO</Label>
            <Input
              id="seo-title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Título otimizado para SEO"
              maxLength={60}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">
                Recomendado: 30-60 caracteres
              </span>
              <span className={`text-xs ${
                seoTitle.length > 60 ? 'text-red-500' : 
                seoTitle.length < 30 ? 'text-yellow-500' : 'text-green-500'
              }`}>
                {seoTitle.length}/60
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="seo-description">Meta Descrição</Label>
            <Textarea
              id="seo-description"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Descrição que aparecerá nos resultados de busca"
              rows={3}
              maxLength={160}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">
                Recomendado: 120-160 caracteres
              </span>
              <span className={`text-xs ${
                seoDescription.length > 160 ? 'text-red-500' : 
                seoDescription.length < 120 ? 'text-yellow-500' : 'text-green-500'
              }`}>
                {seoDescription.length}/160
              </span>
            </div>
          </div>

          <div>
            <Label>Palavras-chave</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Adicionar palavra-chave"
                className="flex-1"
              />
              <Button onClick={addKeyword} size="sm" disabled={!newKeyword.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {seoKeywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Recomendado: 3-5 palavras-chave relevantes
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview do Google */}
      <Card>
        <CardHeader>
          <CardTitle>Preview do Google</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="max-w-lg">
              <h3 className="text-blue-600 text-lg hover:underline cursor-pointer">
                {seoTitle || 'Título do seu post'}
              </h3>
              <p className="text-green-600 text-sm mt-1">
                https://seublog.com/posts/titulo-do-post
              </p>
              <p className="text-gray-600 text-sm mt-2">
                {seoDescription || 'Descrição do seu post que aparecerá nos resultados de busca do Google.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}