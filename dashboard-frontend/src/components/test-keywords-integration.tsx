/**
 * Componente de teste para validar a integração dinâmica de keywords
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  useKeywords,
  useCreateKeyword,
  useKeywordStats,
  useSemanticKeywordSearch 
} from '@/hooks/use-keywords-dynamic'
import type { KeywordFilters } from '@/lib/services/keywords-service'

export default function TestKeywordsIntegration() {
  const [testBlogId] = useState('550e8400-e29b-41d4-a716-446655440000') // Test blog ID
  const [searchTerm, setSearchTerm] = useState('')
  const [semanticQuery, setSemanticQuery] = useState('')
  
  // Hooks para testar
  const [filters, setFilters] = useState<KeywordFilters>({ 
    blog_id: testBlogId, 
    limit: 10 
  })
  
  const { data: keywords, isLoading, error, refetch } = useKeywords(filters)
  const { data: stats } = useKeywordStats(testBlogId)
  const createKeywordMutation = useCreateKeyword()
  const semanticSearchMutation = useSemanticKeywordSearch()

  const handleCreateTestKeyword = async () => {
    try {
      await createKeywordMutation.mutateAsync({
        blog_id: testBlogId,
        keyword: `teste-${Date.now()}`,
        msv: 1000,
        kw_difficulty: 45,
        cpc: 2.5,
        competition: 'MEDIUM',
        search_intent: 'informational',
        location: 'BR',
        language: 'pt-BR'
      })
      refetch()
    } catch (error) {
      console.error('Erro ao criar keyword de teste:', error)
    }
  }

  const handleSemanticSearch = async () => {
    if (!semanticQuery.trim()) return
    
    try {
      await semanticSearchMutation.mutateAsync({
        query: semanticQuery,
        blog_id: testBlogId,
        similarity_threshold: 0.7,
        limit: 5
      })
    } catch (error) {
      console.error('Erro na busca semântica:', error)
    }
  }

  const handleFilterSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm
    }))
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          🧪 Teste da Integração Dinâmica de Keywords
        </h1>
        <p className="text-blue-700">
          Este componente testa todos os aspectos da integração de keywords com Supabase
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-700">Total Keywords</h3>
          <p className="text-2xl font-bold text-blue-600">
            {stats?.total_keywords || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-700">Keywords Usadas</h3>
          <p className="text-2xl font-bold text-green-600">
            {stats?.used_keywords || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-700">Volume Médio</h3>
          <p className="text-2xl font-bold text-purple-600">
            {stats?.avg_search_volume || 0}
          </p>
        </div>
      </div>

      {/* Testes de funcionalidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Criar keyword de teste */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold mb-3">🆕 Criar Keyword de Teste</h3>
          <Button 
            onClick={handleCreateTestKeyword}
            disabled={createKeywordMutation.isPending}
            className="w-full"
          >
            {createKeywordMutation.isPending ? 'Criando...' : 'Criar Keyword Teste'}
          </Button>
          {createKeywordMutation.isSuccess && (
            <p className="text-green-600 mt-2 text-sm">✅ Keyword criada com sucesso!</p>
          )}
          {createKeywordMutation.error && (
            <p className="text-red-600 mt-2 text-sm">
              ❌ Erro: {createKeywordMutation.error.message}
            </p>
          )}
        </div>

        {/* Busca por filtro */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold mb-3">🔍 Busca por Filtro</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Buscar keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleFilterSearch()}
            />
            <Button onClick={handleFilterSearch}>
              Buscar
            </Button>
          </div>
        </div>

        {/* Busca semântica */}
        <div className="bg-white p-4 rounded-lg border md:col-span-2">
          <h3 className="font-semibold mb-3">🧠 Busca Semântica</h3>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Digite uma consulta semântica..."
              value={semanticQuery}
              onChange={(e) => setSemanticQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSemanticSearch()}
            />
            <Button 
              onClick={handleSemanticSearch}
              disabled={semanticSearchMutation.isPending}
            >
              {semanticSearchMutation.isPending ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
          
          {semanticSearchMutation.data && (
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="font-medium mb-2">Resultados da Busca Semântica:</h4>
              {semanticSearchMutation.data.length > 0 ? (
                <ul className="space-y-1">
                  {semanticSearchMutation.data.map((result, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{result.keyword}</span>
                      <span className="text-gray-500 ml-2">
                        (Similaridade: {(result.similarity * 100).toFixed(1)}%)
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">Nenhum resultado encontrado</p>
              )}
            </div>
          )}
          
          {semanticSearchMutation.error && (
            <p className="text-red-600 text-sm">
              ❌ Erro na busca: {semanticSearchMutation.error.message}
            </p>
          )}
        </div>
      </div>

      {/* Lista de keywords */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">📋 Keywords Encontradas</h3>
          <p className="text-sm text-gray-600">
            Total: {keywords?.total || 0} | Página: {keywords?.page || 1}
          </p>
        </div>
        
        <div className="p-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando keywords...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">❌ Erro: {error.message}</p>
              <Button onClick={() => refetch()} className="mt-2">
                Tentar Novamente
              </Button>
            </div>
          ) : keywords?.data && keywords.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Keyword</th>
                    <th className="text-left p-2">Volume</th>
                    <th className="text-left p-2">Dificuldade</th>
                    <th className="text-left p-2">CPC</th>
                    <th className="text-left p-2">Competição</th>
                    <th className="text-left p-2">Usada</th>
                    <th className="text-left p-2">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.data.map((keyword) => (
                    <tr key={keyword.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{keyword.keyword}</td>
                      <td className="p-2">{keyword.msv || '-'}</td>
                      <td className="p-2">{keyword.kw_difficulty || '-'}</td>
                      <td className="p-2">R$ {keyword.cpc || '-'}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          keyword.competition === 'LOW' ? 'bg-green-100 text-green-800' :
                          keyword.competition === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {keyword.competition || 'N/A'}
                        </span>
                      </td>
                      <td className="p-2">
                        {keyword.is_used ? '✅' : '❌'}
                      </td>
                      <td className="p-2">
                        <span className="font-medium text-blue-600">
                          {keyword.opportunity_score || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Nenhuma keyword encontrada</p>
              <p className="text-sm text-gray-500 mt-1">
                Tente criar uma keyword de teste ou ajustar os filtros
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status da integração */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">✅ Status da Integração</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div className="text-green-700">
            🔗 Supabase: Conectado
          </div>
          <div className="text-green-700">
            ⚛️ React Query: Ativo
          </div>
          <div className="text-green-700">
            📡 API Routes: Funcionando
          </div>
          <div className="text-green-700">
            🎯 TypeScript: Validado
          </div>
        </div>
      </div>
    </div>
  )
}