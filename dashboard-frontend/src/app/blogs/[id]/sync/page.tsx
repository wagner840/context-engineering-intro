'use client'

import { useBlog } from '@/hooks/use-blogs'
import { WordPressSync } from '@/components/sync/wordpress-sync'
import { Loading } from '@/components/ui/loading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, AlertCircle, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface BlogSyncPageProps {
  params: {
    id: string
  }
}

export default function BlogSyncPage({ params }: BlogSyncPageProps) {
  const { id: blogId } = params
  
  const { data: blog, isLoading, error } = useBlog(blogId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading text="Carregando configurações..." />
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog não encontrado</h2>
          <p className="text-gray-600">O blog solicitado não foi encontrado.</p>
          <Link href="/blogs">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Blogs
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const hasWordPressConfig = !!blog.wordpress_config

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href={`/blogs/${blogId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Sincronização WordPress
            </h1>
            <p className="text-gray-600">
              {blog.name} • Gerencie a sincronização com WordPress
            </p>
          </div>
        </div>

        {/* Status do Blog */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Informações do Blog
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-500">Nome do Blog</span>
                <p className="font-medium">{blog.name}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Domínio</span>
                <p className="font-medium">{blog.domain || 'Não configurado'}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Status WordPress</span>
                <div className="mt-1">
                  {hasWordPressConfig ? (
                    <Badge className="bg-green-100 text-green-800">Configurado</Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuração WordPress */}
      {!hasWordPressConfig ? (
        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Configuração do WordPress Necessária</p>
              <p>
                Para usar a sincronização, você precisa configurar as credenciais do WordPress para este blog.
                Adicione as seguintes informações nas configurações do blog:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>URL do WordPress (ex: https://meusite.com)</li>
                <li>Nome de usuário do WordPress</li>
                <li>Senha de aplicação (Application Password)</li>
              </ul>
              <div className="mt-4">
                <Link href={`/blogs/${blogId}/settings`}>
                  <Button variant="outline" size="sm">
                    Configurar WordPress
                  </Button>
                </Link>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        /* Componente de Sincronização */
        <WordPressSync blogId={blogId} />
      )}

      {/* Informações sobre Sincronização */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Como Funciona a Sincronização</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Sincronização Bidirecional</h4>
            <p className="text-sm text-gray-600 mb-3">
              Nossa plataforma oferece sincronização completa entre o Supabase e o WordPress:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h5 className="font-medium text-green-600 mb-2">Supabase → WordPress</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Envia posts criados na plataforma</li>
                  <li>• Atualiza posts existentes</li>
                  <li>• Sincroniza metadados SEO</li>
                  <li>• Preserva formatação e mídia</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h5 className="font-medium text-blue-600 mb-2">WordPress → Supabase</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Importa posts do WordPress</li>
                  <li>• Mantém estrutura original</li>
                  <li>• Preserva categorias e tags</li>
                  <li>• Sincroniza metadados</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Requisitos do WordPress</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• WordPress 5.0 ou superior</li>
              <li>• API REST habilitada (padrão)</li>
              <li>• Usuário com permissões de editor/administrador</li>
              <li>• Senha de aplicação configurada</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}