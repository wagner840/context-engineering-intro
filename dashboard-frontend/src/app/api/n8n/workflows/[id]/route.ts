import { NextRequest, NextResponse } from 'next/server'
import { N8nService } from '@/lib/services/n8n-service'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const n8nService = new N8nService()
    const workflow = await n8nService.getWorkflow(params.id)
    
    return NextResponse.json(workflow)
  } catch (error) {
    console.error('N8N get workflow error:', error)
    return NextResponse.json({
      error: 'Failed to fetch workflow',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()
    const n8nService = new N8nService()
    
    const workflow = await n8nService.updateWorkflow(params.id, updates)
    
    return NextResponse.json(workflow)
  } catch (error) {
    console.error('N8N update workflow error:', error)
    return NextResponse.json({
      error: 'Failed to update workflow',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const n8nService = new N8nService()
    await n8nService.deleteWorkflow(params.id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('N8N delete workflow error:', error)
    return NextResponse.json({
      error: 'Failed to delete workflow',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}