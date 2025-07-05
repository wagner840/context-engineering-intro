import { NextResponse } from 'next/server'
import { runBlogSetup } from '@/scripts/setup-blogs'

export async function POST() {
  try {
    console.log('🚀 Iniciando setup via API...')
    const result = await runBlogSetup()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Blogs configurados com sucesso!',
        data: result
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Erro na API de setup:', error)
    return NextResponse.json({
      success: false,
      error: (error as Error).message
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST para executar o setup dos blogs',
    endpoints: {
      setup: 'POST /api/setup-blogs'
    }
  })
}