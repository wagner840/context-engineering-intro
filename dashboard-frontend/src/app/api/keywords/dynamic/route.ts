/**
 * API dinâmica para keywords
 * Integração completa com serviço otimizado
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import keywordsService from '@/lib/services/keywords-service'

// Schemas de validação
const keywordFiltersSchema = z.object({
  blog_id: z.string().uuid().optional(),
  search: z.string().optional(),
  search_intent: z.enum(['informational', 'navigational', 'commercial', 'transactional']).optional(),
  competition: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  min_volume: z.number().min(0).optional(),
  max_difficulty: z.number().min(0).max(100).optional(),
  is_used: z.boolean().optional(),
  location: z.string().optional(),
  language: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0)
})

const createKeywordSchema = z.object({
  blog_id: z.string().uuid(),
  keyword: z.string().min(1).max(255),
  msv: z.number().min(0).optional(),
  kw_difficulty: z.number().min(0).max(100).optional(),
  cpc: z.number().min(0).optional(),
  competition: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  search_intent: z.enum(['informational', 'navigational', 'commercial', 'transactional']).default('informational'),
  location: z.string().default('BR'),
  language: z.string().default('pt-BR'),
  search_limit: z.number().min(0).default(100),
  variations: z.array(z.object({
    keyword: z.string().min(1),
    variation_type: z.string().optional(),
    msv: z.number().min(0).optional(),
    kw_difficulty: z.number().min(0).max(100).optional(),
    cpc: z.number().min(0).optional(),
    competition: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    search_intent: z.enum(['informational', 'navigational', 'commercial', 'transactional']).optional()
  })).optional()
})

const updateKeywordSchema = createKeywordSchema.partial().omit({ blog_id: true })

const bulkCreateSchema = z.object({
  keywords: z.array(createKeywordSchema).min(1).max(50) // Máximo 50 por vez
})

/**
 * GET - Buscar keywords com filtros
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extrair filtros dos query parameters
    const filters: Record<string, any> = {}
    
    searchParams.forEach((value, key) => {
      if (key === 'limit' || key === 'offset' || key === 'min_volume' || key === 'max_difficulty') {
        filters[key] = parseInt(value)
      } else if (key === 'is_used') {
        filters[key] = value === 'true'
      } else {
        filters[key] = value
      }
    })

    // Validar filtros
    const validatedFilters = keywordFiltersSchema.parse(filters)

    // Buscar keywords
    const result = await keywordsService.getKeywords(validatedFilters)

    return NextResponse.json({
      success: true,
      ...result,
      filters: validatedFilters
    })

  } catch (error) {
    console.error('Erro ao buscar keywords:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Filtros inválidos', 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}

/**
 * POST - Criar keyword ou busca em lote
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    // Busca semântica
    if (action === 'semantic-search') {
      const searchSchema = z.object({
        query: z.string().min(1),
        blog_id: z.string().uuid().optional(),
        similarity_threshold: z.number().min(0).max(1).default(0.7),
        limit: z.number().min(1).max(50).default(10)
      })

      const params = searchSchema.parse(body)
      const results = await keywordsService.semanticSearch(params)

      return NextResponse.json({
        success: true,
        data: results,
        query: params.query,
        total: results.length
      })
    }

    // Criação em lote
    if (action === 'bulk-create') {
      const { keywords } = bulkCreateSchema.parse(body)
      const result = await keywordsService.bulkCreateKeywords(keywords)

      return NextResponse.json({
        success: true,
        created: result.created,
        failed: result.failed,
        total: keywords.length
      })
    }

    // Criação normal
    const keywordData = createKeywordSchema.parse(body)
    const newKeyword = await keywordsService.createKeyword(keywordData)

    return NextResponse.json({
      success: true,
      data: newKeyword,
      message: `Keyword "${newKeyword.keyword}" criada com sucesso`
    }, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar keyword:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dados inválidos', 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message.includes('já existe')) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message 
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}

/**
 * PUT - Atualizar keyword
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID da keyword é obrigatório' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const updateData = updateKeywordSchema.parse(body)

    const updatedKeyword = await keywordsService.updateKeyword(id, updateData)

    return NextResponse.json({
      success: true,
      data: updatedKeyword,
      message: `Keyword "${updatedKeyword.keyword}" atualizada com sucesso`
    })

  } catch (error) {
    console.error('Erro ao atualizar keyword:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dados inválidos', 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Remover keyword
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID da keyword é obrigatório' },
        { status: 400 }
      )
    }

    await keywordsService.deleteKeyword(id)

    return NextResponse.json({
      success: true,
      message: 'Keyword removida com sucesso'
    })

  } catch (error) {
    console.error('Erro ao remover keyword:', error)

    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH - Ações específicas (toggle usage, etc.)
 */
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const action = searchParams.get('action')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID da keyword é obrigatório' },
        { status: 400 }
      )
    }

    if (action === 'toggle-usage') {
      const body = await request.json()
      const { is_used } = z.object({
        is_used: z.boolean()
      }).parse(body)

      await keywordsService.toggleKeywordUsage(id, is_used)

      return NextResponse.json({
        success: true,
        message: `Keyword marcada como ${is_used ? 'usada' : 'não usada'}`
      })
    }

    return NextResponse.json(
      { success: false, error: 'Ação não reconhecida' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Erro na ação PATCH:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dados inválidos', 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}