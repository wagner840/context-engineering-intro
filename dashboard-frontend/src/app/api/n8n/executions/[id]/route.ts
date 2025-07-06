import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // This route is disabled because workflow_executions table doesn't exist
    return NextResponse.json({ 
      error: 'Workflow executions functionality not available - database tables missing',
      executionId: params.id 
    }, { status: 404 })
  } catch (error) {
    console.error('Error in n8n execution route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}