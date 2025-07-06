/**
 * API para geração de embeddings usando OpenAI
 * Integração dinâmica com cache para otimização
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import OpenAI from 'openai'

// Schema de validação
const embeddingSchema = z.object({
  text: z.string().min(1).max(8192), // Limite do OpenAI
  model: z.string().default('text-embedding-ada-002')
})

// Inicializar OpenAI
let openai: OpenAI | null = null

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

// Cache simples em memória (em produção usar Redis)
const embeddingCache = new Map<string, {
  embedding: number[]
  timestamp: number
}>()

const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 horas

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, model } = embeddingSchema.parse(body)

    // Verificar cache primeiro
    const cacheKey = `${model}:${text}`
    const cached = embeddingCache.get(cacheKey)
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      return NextResponse.json({
        embedding: cached.embedding,
        cached: true,
        model
      })
    }

    // Se não tiver OpenAI configurado, retornar embedding mock
    if (!openai) {
      console.warn('OpenAI não configurado, retornando embedding mock')
      const mockEmbedding = generateMockEmbedding(text)
      
      // Cache o mock também
      embeddingCache.set(cacheKey, {
        embedding: mockEmbedding,
        timestamp: Date.now()
      })

      return NextResponse.json({
        embedding: mockEmbedding,
        cached: false,
        model: 'mock',
        warning: 'OpenAI não configurado, usando embedding simulado'
      })
    }

    // Gerar embedding real
    const response = await openai.embeddings.create({
      model,
      input: text,
    })

    const embedding = response.data[0].embedding

    // Armazenar no cache
    embeddingCache.set(cacheKey, {
      embedding,
      timestamp: Date.now()
    })

    // Limpar cache antigo periodicamente
    cleanOldCache()

    return NextResponse.json({
      embedding,
      cached: false,
      model,
      usage: response.usage
    })

  } catch (error) {
    console.error('Erro ao gerar embedding:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'Chave da API OpenAI inválida' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API de Embeddings',
    endpoints: {
      'POST /api/embeddings': 'Gerar embedding para texto',
    },
    models: ['text-embedding-ada-002'],
    cacheStatus: {
      size: embeddingCache.size,
      ttl: `${CACHE_TTL / 1000 / 60 / 60}h`
    }
  })
}

// Função para gerar embedding mock determinístico
function generateMockEmbedding(text: string): number[] {
  const dimension = 1536 // Dimensão do ada-002
  const embedding: number[] = []
  
  // Usar hash simples do texto para gerar embedding determinístico
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Gerar embedding baseado no hash
  for (let i = 0; i < dimension; i++) {
    // Usar diferentes seeds para cada dimensão
    const seed = hash + i
    const value = (Math.sin(seed) * 10000) % 1
    embedding.push(value)
  }
  
  // Normalizar o vetor
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  return embedding.map(val => val / magnitude)
}

// Função para limpar cache antigo
function cleanOldCache() {
  const now = Date.now()
  const keysToDelete: string[] = []
  
  embeddingCache.forEach((value, key) => {
    if (now - value.timestamp > CACHE_TTL) {
      keysToDelete.push(key)
    }
  })
  
  keysToDelete.forEach(key => embeddingCache.delete(key))
}