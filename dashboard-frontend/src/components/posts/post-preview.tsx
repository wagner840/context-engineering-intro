'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Monitor,
  Smartphone,
  Tablet,
  Calendar,
  User,
  Tag,
  Eye,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PostPreviewProps {
  post: {
    title: string
    content: string
    excerpt: string
    status: string
    featured_image?: string
    author?: string
    categories: string[]
    tags: string[]
    publish_date?: string
  }
  onClose: () => void
}

export function PostPreview({ post, onClose }: PostPreviewProps) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'publish':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'private':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'publish':
        return 'Publicado'
      case 'draft':
        return 'Rascunho'
      case 'pending':
        return 'Pendente'
      case 'private':
        return 'Privado'
      default:
        return status
    }
  }

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile':
        return 'max-w-sm'
      case 'tablet':
        return 'max-w-2xl'
      case 'desktop':
      default:
        return 'max-w-4xl'
    }
  }

  const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
  const readingTime = Math.ceil(wordCount / 200)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Visualização do Post
            </DialogTitle>
            
            <div className="flex items-center gap-2">
              {/* Controles de visualização */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
              
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="preview" className="h-full">
            <div className="px-6 py-2 border-b">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="metadata">Metadados</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="preview" className="h-full m-0 p-0">
              <div className="h-full overflow-y-auto bg-gray-50 p-8">
                <div className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${getPreviewWidth()}`}>
                  {/* Imagem destacada */}
                  {post.featured_image && (
                    <div className="aspect-video bg-gray-200 overflow-hidden">
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        width={1200}
                        height={675}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Conteúdo do post */}
                  <div className="p-6">
                    {/* Metadados */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {post.author && (
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.author}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {post.publish_date ? (
                            formatDistanceToNow(new Date(post.publish_date), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })
                          ) : (
                            'Agora'
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{readingTime} min de leitura</span>
                        </div>
                      </div>
                      
                      <Badge className={getStatusColor(post.status)}>
                        {getStatusLabel(post.status)}
                      </Badge>
                    </div>

                    {/* Título */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                      {post.title}
                    </h1>

                    {/* Resumo */}
                    {post.excerpt && (
                      <div className="text-lg text-gray-600 mb-6 leading-relaxed">
                        {post.excerpt}
                      </div>
                    )}

                    <Separator className="mb-6" />

                    {/* Conteúdo */}
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Categorias e Tags */}
                    {(post.categories.length > 0 || post.tags.length > 0) && (
                      <div className="mt-8 pt-6 border-t">
                        {post.categories.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Categorias:</h3>
                            <div className="flex flex-wrap gap-2">
                              {post.categories.map((category, index) => (
                                <Badge key={index} variant="secondary">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {post.tags.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Tags:</h3>
                            <div className="flex flex-wrap gap-2">
                              {post.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="html" className="h-full m-0 p-0">
              <div className="h-full overflow-y-auto p-6">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{post.content}</code>
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="metadata" className="h-full m-0 p-0">
              <div className="h-full overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Título:</span>
                        <p className="font-medium">{post.title}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Status:</span>
                        <p className="font-medium">{getStatusLabel(post.status)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Autor:</span>
                        <p className="font-medium">{post.author || 'Não definido'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Data de publicação:</span>
                        <p className="font-medium">
                          {post.publish_date 
                            ? new Date(post.publish_date).toLocaleDateString('pt-BR')
                            : 'Não definida'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Estatísticas</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Palavras:</span>
                        <p className="font-medium">{wordCount}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Caracteres:</span>
                        <p className="font-medium">{post.content.replace(/<[^>]*>/g, '').length}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Tempo de leitura:</span>
                        <p className="font-medium">{readingTime} minutos</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Parágrafos:</span>
                        <p className="font-medium">{post.content.split('</p>').length - 1}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Resumo</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">
                      {post.excerpt || 'Nenhum resumo definido'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Taxonomia</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Categorias:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {post.categories.length > 0 ? (
                          post.categories.map((category, index) => (
                            <Badge key={index} variant="secondary">
                              {category}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400">Nenhuma categoria</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-500">Tags:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {post.tags.length > 0 ? (
                          post.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400">Nenhuma tag</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}