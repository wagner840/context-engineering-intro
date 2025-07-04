import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase'
import { N8nAPI } from '@/lib/n8n'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServiceClient()
    const n8n = new N8nAPI()
    
    // Get execution from database
    const { data: execution, error: dbError } = await supabase
      .from('workflow_executions')
      .select(`
        *,
        automation_workflows (
          name,
          description,
          n8n_workflow_id
        )
      `)
      .eq('id', params.id)
      .single()
    
    if (dbError || !execution) {
      return NextResponse.json({ error: 'Execution not found' }, { status: 404 })
    }
    
    // Get latest data from n8n
    try {
      const n8nExecution = await n8n.getExecution(execution.n8n_execution_id)
      
      // Update database if execution status changed
      if (n8nExecution.status !== execution.status) {
        await supabase
          .from('workflow_executions')
          .update({
            status: n8nExecution.status,
            output_data: n8nExecution.data,
            finished_at: n8nExecution.finished ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', params.id)
      }
      
      return NextResponse.json({
        data: {
          ...execution,
          n8n_data: n8nExecution,
        },
      })
    } catch (n8nError) {
      // Return database data if n8n is unavailable
      return NextResponse.json({
        data: execution,
        warning: 'n8n data unavailable',
      })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServiceClient()
    const n8n = new N8nAPI()
    
    // Get execution details
    const { data: execution, error: getError } = await supabase
      .from('workflow_executions')
      .select('n8n_execution_id')
      .eq('id', params.id)
      .single()
    
    if (getError || !execution) {
      return NextResponse.json({ error: 'Execution not found' }, { status: 404 })
    }
    
    // Try to stop n8n execution if it's running
    try {
      await n8n.stopExecution(execution.n8n_execution_id)
    } catch (n8nError) {
      // Continue with database deletion even if n8n stop fails
      console.error('Failed to stop n8n execution:', n8nError)
    }
    
    // Delete from database
    const { error: deleteError } = await supabase
      .from('workflow_executions')
      .delete()
      .eq('id', params.id)
    
    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}