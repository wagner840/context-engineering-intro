'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard PAWA</h1>
        <p className="text-muted-foreground mb-8">
          Sistema de gerenciamento de conteúdo WordPress com integrações reais
        </p>
        
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Bem-vindo ao PAWA</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Gerencie seus blogs WordPress, palavras-chave, conteúdo e integrações em um só lugar.
            </p>
          </div>
          
          <button
            onClick={() => router.push('/blogs')}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Acessar Blogs
          </button>
          
          <div className="grid gap-4 md:grid-cols-3 mt-8 w-full max-w-3xl">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">WordPress Integration</h3>
              <p className="text-sm text-muted-foreground">
                Conexão direta com APIs do WordPress
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Supabase Database</h3>
              <p className="text-sm text-muted-foreground">
                Banco de dados em tempo real
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">SEO Management</h3>
              <p className="text-sm text-muted-foreground">
                Gestão de palavras-chave e conteúdo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

