import { NextRequest, NextResponse } from 'next/server'
import { N8nService } from '@/lib/services/n8n-service'
import { createSupabaseServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { blogId, data: inputData = {} } = await request.json()
    
    const n8nService = new N8nService()
    const supabase = createSupabaseServiceClient()

    // Get blog information if provided
    let blogData = null
    if (blogId) {
      const { data: blog, error: blogError } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', blogId)
        .single()

      if (blogError) {
        console.warn('Failed to fetch blog data:', blogError)
      } else {
        blogData = blog
      }
    }

    // Prepare execution data
    const executionData = {
      ...inputData,
      blogId,
      blogDomain: blogData?.domain,
      timestamp: new Date().toISOString(),
    }

    // Trigger the workflow execution via webhook
    let result
    const workflowId = params.id
    
    // Try to map common workflow types to webhook paths
    if (workflowId.includes('sync') || workflowId.includes('blog')) {
      result = await n8nService.triggerBlogSync(blogId, blogData?.domain || '')
    } else if (workflowId.includes('content')) {
      result = await n8nService.triggerContentGeneration({
        blogId,
        keyword: inputData.keyword || 'default',
        title: inputData.title || 'Generated Content',
        outline: inputData.outline
      })
    } else {
      // Generic webhook trigger
      result = await n8nService.triggerWebhook(`workflow-${workflowId}`, executionData)
    }

    // Log the execution to Supabase
    if (blogId && result.success) {
      await supabase.from('sync_logs').insert({
        blog_id: blogId,
        sync_type: 'n8n_workflow_execution',
        status: result.success ? 'completed' : 'failed',
        details: {
          workflow_id: workflowId,
          execution_data: executionData,
          result: result.data,
          error: result.error
        },
        created_at: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Workflow executed successfully' : 'Workflow execution failed',
      data: result.data,
      error: result.error
    })
  } catch (error) {
    console.error('N8N execute workflow error:', error)
    return NextResponse.json({
      error: 'Failed to execute workflow',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}