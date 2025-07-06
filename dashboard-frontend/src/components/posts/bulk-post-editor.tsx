'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  Edit, 
  Save, 
  Trash2,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Target,
  Zap
} from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  status: 'draft' | 'published' | 'scheduled' | 'trash'
  categories: string[]
  tags: string[]
  metaTitle: string
  metaDescription: string
  featuredImage?: string
  publishDate?: string
  blog: string
  seoScore: number
  wordCount: number
}

interface BulkOperation {
  type: 'update' | 'delete' | 'publish' | 'draft'
  field?: keyof Post
  value?: any
  postIds: string[]
}

interface BulkPostEditorProps {
  posts: Post[]
  onSave?: (operations: BulkOperation[]) => Promise<void>
  onClose?: () => void
}

export function BulkPostEditor({ posts, onSave, onClose }: BulkPostEditorProps) {
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [bulkEdits, setBulkEdits] = useState({
    status: '',
    categories: [] as string[],
    tags: [] as string[],
    metaTitle: '',
    metaDescription: '',
    blog: '',
    publishDate: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<{ success: number; failed: number; total: number } | null>(null)

  const selectedPostsData = posts.filter(post => selectedPosts.includes(post.id))

  const handleSelectAll = useCallback(() => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(posts.map(post => post.id))
    }
  }, [posts, selectedPosts.length])

  const handleSelectPost = useCallback((postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }, [])

  const handleBulkUpdate = async () => {
    if (selectedPosts.length === 0) return

    setIsProcessing(true)
    setProgress(0)
    setResults(null)

    try {
      const operations: BulkOperation[] = []

      // Build operations based on bulk edits
      if (bulkEdits.status) {
        operations.push({
          type: bulkEdits.status === 'published' ? 'publish' : 'update',
          field: 'status',
          value: bulkEdits.status,
          postIds: selectedPosts
        })
      }

      if (bulkEdits.categories.length > 0) {
        operations.push({
          type: 'update',
          field: 'categories',
          value: bulkEdits.categories,
          postIds: selectedPosts
        })
      }

      if (bulkEdits.tags.length > 0) {
        operations.push({
          type: 'update',
          field: 'tags',
          value: bulkEdits.tags,
          postIds: selectedPosts
        })
      }

      if (bulkEdits.metaTitle) {
        operations.push({
          type: 'update',
          field: 'metaTitle',
          value: bulkEdits.metaTitle,
          postIds: selectedPosts
        })
      }

      if (bulkEdits.metaDescription) {
        operations.push({
          type: 'update',
          field: 'metaDescription',
          value: bulkEdits.metaDescription,
          postIds: selectedPosts
        })
      }

      if (bulkEdits.blog) {
        operations.push({
          type: 'update',
          field: 'blog',
          value: bulkEdits.blog,
          postIds: selectedPosts
        })
      }

      if (bulkEdits.publishDate) {
        operations.push({
          type: 'update',
          field: 'publishDate',
          value: bulkEdits.publishDate,
          postIds: selectedPosts
        })
      }

      // Simulate progress
      let currentProgress = 0
      const progressInterval = setInterval(() => {
        currentProgress += 10
        setProgress(Math.min(currentProgress, 90))
      }, 200)

      if (onSave) {
        await onSave(operations)
      }

      clearInterval(progressInterval)
      setProgress(100)
      
      setResults({
        success: selectedPosts.length,
        failed: 0,
        total: selectedPosts.length
      })

      // Reset form
      setBulkEdits({
        status: '',
        categories: [],
        tags: [],
        metaTitle: '',
        metaDescription: '',
        blog: '',
        publishDate: ''
      })
      setSelectedPosts([])

    } catch (error) {
      console.error('Bulk update error:', error)
      setResults({
        success: 0,
        failed: selectedPosts.length,
        total: selectedPosts.length
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return
    
    if (!confirm(`Tem certeza que deseja deletar ${selectedPosts.length} posts? Esta ação não pode ser desfeita.`)) {
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      const operation: BulkOperation = {
        type: 'delete',
        postIds: selectedPosts
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90))
      }, 200)

      if (onSave) {
        await onSave([operation])
      }

      clearInterval(progressInterval)
      setProgress(100)
      
      setResults({
        success: selectedPosts.length,
        failed: 0,
        total: selectedPosts.length
      })

      setSelectedPosts([])

    } catch (error) {
      console.error('Bulk delete error:', error)
      setResults({
        success: 0,
        failed: selectedPosts.length,
        total: selectedPosts.length
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const addCategory = (category: string) => {
    if (category && !bulkEdits.categories.includes(category)) {
      setBulkEdits(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }))
    }
  }

  const removeCategory = (category: string) => {
    setBulkEdits(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }))
  }

  const addTag = (tag: string) => {
    if (tag && !bulkEdits.tags.includes(tag)) {
      setBulkEdits(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
  }

  const removeTag = (tag: string) => {
    setBulkEdits(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Edit className="h-6 w-6" />
            Editor em Massa
          </h2>
          <p className="text-gray-600">
            Edite múltiplos posts simultaneamente
          </p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        )}
      </div>

      {/* Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processando...</span>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results && (
        <Alert className={results.failed > 0 ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          {results.failed > 0 ? (
            <AlertCircle className="h-4 w-4 text-red-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription>
            Processamento concluído: {results.success} sucessos, {results.failed} falhas de {results.total} posts
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Post Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Selecionar Posts ({selectedPosts.length}/{posts.length})
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedPosts.length === posts.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label className="text-sm">Selecionar todos</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {posts.map((post) => (
                  <div key={post.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Checkbox
                      checked={selectedPosts.includes(post.id)}
                      onCheckedChange={() => handleSelectPost(post.id)}
                    />
                    <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{post.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={
                          post.status === 'published' ? 'default' :
                          post.status === 'draft' ? 'secondary' : 'outline'
                        }>
                          {post.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{post.blog}</span>
                        <span className="text-xs text-gray-500">{post.wordCount} palavras</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Edit Options */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações em Massa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  value={bulkEdits.status}
                  onChange={(e) => setBulkEdits(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Não alterar</option>
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                  <option value="scheduled">Agendado</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Blog</Label>
                <select
                  value={bulkEdits.blog}
                  onChange={(e) => setBulkEdits(prev => ({ ...prev, blog: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Não alterar</option>
                  <option value="einsof7">Einsof7</option>
                  <option value="opetmil">Opetmil</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Data de Publicação</Label>
                <Input
                  type="datetime-local"
                  value={bulkEdits.publishDate}
                  onChange={(e) => setBulkEdits(prev => ({ ...prev, publishDate: e.target.value }))}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Adicionar Categorias</Label>
                <Input
                  placeholder="Digite uma categoria e pressione Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCategory(e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <div className="flex flex-wrap gap-1">
                  {bulkEdits.categories.map((category) => (
                    <Badge key={category} variant="secondary" className="cursor-pointer">
                      {category}
                      <button
                        onClick={() => removeCategory(category)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Adicionar Tags</Label>
                <Input
                  placeholder="Digite uma tag e pressione Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag(e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <div className="flex flex-wrap gap-1">
                  {bulkEdits.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="cursor-pointer">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <Tabs defaultValue="seo" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="advanced">Avançado</TabsTrigger>
                </TabsList>

                <TabsContent value="seo" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Meta Título</Label>
                    <Input
                      value={bulkEdits.metaTitle}
                      onChange={(e) => setBulkEdits(prev => ({ ...prev, metaTitle: e.target.value }))}
                      placeholder="Substituir meta título..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Meta Descrição</Label>
                    <Textarea
                      value={bulkEdits.metaDescription}
                      onChange={(e) => setBulkEdits(prev => ({ ...prev, metaDescription: e.target.value }))}
                      placeholder="Substituir meta descrição..."
                      rows={3}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <Button variant="outline" className="w-full" disabled>
                    <Zap className="h-4 w-4 mr-2" />
                    Otimizar SEO com IA
                  </Button>
                  
                  <Button variant="outline" className="w-full" disabled>
                    <Target className="h-4 w-4 mr-2" />
                    Gerar Keywords
                  </Button>
                  
                  <Button variant="outline" className="w-full" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Sincronizar WordPress
                  </Button>
                </TabsContent>
              </Tabs>

              <Separator />

              <div className="space-y-2">
                <Button 
                  onClick={handleBulkUpdate}
                  disabled={selectedPosts.length === 0 || isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Aplicar Alterações ({selectedPosts.length})
                </Button>

                <Button 
                  variant="destructive"
                  onClick={handleBulkDelete}
                  disabled={selectedPosts.length === 0 || isProcessing}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Deletar Selecionados ({selectedPosts.length})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Selected Posts Summary */}
          {selectedPosts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Posts Selecionados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedPostsData.slice(0, 5).map((post) => (
                    <div key={post.id} className="text-xs p-2 bg-gray-50 rounded">
                      <div className="font-medium truncate">{post.title}</div>
                      <div className="text-gray-500">{post.blog} • {post.status}</div>
                    </div>
                  ))}
                  {selectedPosts.length > 5 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{selectedPosts.length - 5} mais posts...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}