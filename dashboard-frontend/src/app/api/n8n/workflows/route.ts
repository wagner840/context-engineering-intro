import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase'
import { N8nAPI } from '@/lib/n8n'
import { z } from 'zod'

const executeWorkflowSchema = z.object({
  workflow_id: z.string(),
  blog_id: z.string().uuid().optional(),
  input_data: z.record(z.any()).optional(),
  wait_for_completion: z.boolean().default(false),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const blogId = searchParams.get('blog_id')
    const active = searchParams.get('active')
    
    const supabase = createSupabaseServiceClient()
    
    // Get automation workflows from database
    let query = supabase
      .from('automation_workflows')
      .select(`
        *,
        blogs (
          name,
          url
        )
      `)
    
    if (blogId) {
      query = query.eq('blog_id', blogId)
    }
    
    if (active === 'true') {
      query = query.eq('status', 'active')
    }
    
    const { data: workflows, error } = await query.order('created_at', { ascending: false })
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Get n8n workflow details for each workflow
    const n8n = new N8nAPI()
    const workflowsWithDetails = await Promise.all(
      workflows.map(async (workflow) => {
        try {
          const n8nWorkflow = await n8n.getWorkflow(workflow.n8n_workflow_id)
          return {
            ...workflow,
            n8n_data: n8nWorkflow,
          }
        } catch (error) {
          return {
            ...workflow,
            n8n_data: null,
            n8n_error: 'Failed to fetch n8n data',
          }
        }
      })
    )
    
    return NextResponse.json({ data: workflowsWithDetails })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = executeWorkflowSchema.parse(body)
    
    const supabase = createSupabaseServiceClient()
    const n8n = new N8nAPI()
    
    // Get workflow configuration
    const { data: workflow, error: workflowError } = await supabase
      .from('automation_workflows')
      .select('*')
      .eq('n8n_workflow_id', validatedData.workflow_id)
      .single()
    
    if (workflowError || !workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }
    
    try {
      // Execute n8n workflow
      const execution = await n8n.executeWorkflow(
        validatedData.workflow_id,
        validatedData.input_data || {}
      )
      
      // Save execution record to database
      const { data: executionRecord, error: saveError } = await supabase
        .from('workflow_executions')
        .insert({
          workflow_id: workflow.id,
          n8n_execution_id: execution.id,
          status: execution.status,
          input_data: validatedData.input_data,
          output_data: execution.data,
          started_at: new Date().toISOString(),
          finished_at: execution.finished ? new Date().toISOString() : null,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()
      
      if (saveError) {
        console.error('Failed to save execution record:', saveError)
      }
      
      // Wait for completion if requested
      if (validatedData.wait_for_completion && !execution.finished) {
        const finalExecution = await n8n.waitForExecution(execution.id)
        
        // Update execution record
        if (executionRecord) {
          await supabase
            .from('workflow_executions')
            .update({
              status: finalExecution.status,
              output_data: finalExecution.data,
              finished_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', executionRecord.id)
        }
        
        return NextResponse.json({
          data: finalExecution,
          execution_record: executionRecord,
        })
      }
      
      return NextResponse.json({
        data: execution,
        execution_record: executionRecord,
      })
    } catch (n8nError) {
      return NextResponse.json(
        { error: 'Failed to execute workflow', details: n8nError },
        { status: 500 }
      )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}