import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase'
import { z } from 'zod'

const bulkOperationSchema = z.object({
  table: z.string(),
  operation: z.enum(['insert', 'update', 'delete', 'upsert']),
  data: z.array(z.record(z.any())),
  filters: z.record(z.any()).optional(),
  returning: z.string().optional().default('*'),
})

const aggregationSchema = z.object({
  table: z.string(),
  columns: z.array(z.string()),
  filters: z.record(z.any()).optional(),
  groupBy: z.array(z.string()).optional(),
  having: z.record(z.any()).optional(),
  orderBy: z.array(z.object({
    column: z.string(),
    ascending: z.boolean().default(true),
  })).optional(),
})

const relationshipQuerySchema = z.object({
  table: z.string(),
  select: z.string(),
  filters: z.record(z.any()).optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { operation } = body
    
    const supabase = createSupabaseServiceClient()
    
    switch (operation) {
      case 'bulk_operation':
        return handleBulkOperation(supabase, body)
      case 'aggregation':
        return handleAggregation(supabase, body)
      case 'relationship_query':
        return handleRelationshipQuery(supabase, body)
      case 'custom_function':
        return handleCustomFunction(supabase, body)
      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
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
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}

async function handleBulkOperation(supabase: any, body: any) {
  const validatedData = bulkOperationSchema.parse(body)
  
  let query = supabase.from(validatedData.table)
  
  switch (validatedData.operation) {
    case 'insert':
      const { data: insertData, error: insertError } = await query
        .insert(validatedData.data)
        .select(validatedData.returning)
      
      if (insertError) throw insertError
      return NextResponse.json({ data: insertData, operation: 'insert' })
    
    case 'upsert':
      const { data: upsertData, error: upsertError } = await query
        .upsert(validatedData.data)
        .select(validatedData.returning)
      
      if (upsertError) throw upsertError
      return NextResponse.json({ data: upsertData, operation: 'upsert' })
    
    case 'update':
      if (!validatedData.filters) {
        throw new Error('Filters required for bulk update')
      }
      
      const updateResults = []
      for (const item of validatedData.data) {
        const { data: updateData, error: updateError } = await query
          .update(item)
          .match(validatedData.filters)
          .select(validatedData.returning)
        
        if (updateError) throw updateError
        updateResults.push(updateData)
      }
      
      return NextResponse.json({ data: updateResults.flat(), operation: 'update' })
    
    case 'delete':
      if (!validatedData.filters) {
        throw new Error('Filters required for bulk delete')
      }
      
      const { data: deleteData, error: deleteError } = await query
        .delete()
        .match(validatedData.filters)
        .select(validatedData.returning)
      
      if (deleteError) throw deleteError
      return NextResponse.json({ data: deleteData, operation: 'delete' })
    
    default:
      throw new Error('Invalid bulk operation')
  }
}

async function handleAggregation(supabase: any, body: any) {
  const validatedData = aggregationSchema.parse(body)
  
  // Build aggregation query
  const selectClause = validatedData.columns.join(', ')
  let query = supabase
    .from(validatedData.table)
    .select(selectClause)
  
  // Apply filters
  if (validatedData.filters) {
    Object.entries(validatedData.filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
  }
  
  // Apply ordering
  if (validatedData.orderBy) {
    validatedData.orderBy.forEach(order => {
      query = query.order(order.column, { ascending: order.ascending })
    })
  }
  
  const { data, error } = await query
  
  if (error) throw error
  
  return NextResponse.json({ data, operation: 'aggregation' })
}

async function handleRelationshipQuery(supabase: any, body: any) {
  const validatedData = relationshipQuerySchema.parse(body)
  
  let query = supabase
    .from(validatedData.table)
    .select(validatedData.select)
  
  // Apply filters
  if (validatedData.filters) {
    Object.entries(validatedData.filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        query = query.in(key, value)
      } else {
        query = query.eq(key, value)
      }
    })
  }
  
  // Apply pagination
  if (validatedData.limit) {
    const start = validatedData.offset || 0
    query = query.range(start, start + validatedData.limit - 1)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  
  return NextResponse.json({ data, operation: 'relationship_query' })
}

async function handleCustomFunction(supabase: any, body: any) {
  const { function_name, parameters } = body
  
  if (!function_name) {
    throw new Error('Function name is required')
  }
  
  const { data, error } = await supabase.rpc(function_name, parameters || {})
  
  if (error) throw error
  
  return NextResponse.json({ data, operation: 'custom_function', function_name })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const operation = searchParams.get('operation')
    
    const supabase = createSupabaseServiceClient()
    
    switch (operation) {
      case 'table_info':
        return getTableInfo(supabase, searchParams)
      case 'schema_info':
        return getSchemaInfo(supabase)
      case 'functions_list':
        return getFunctionsList(supabase)
      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}

async function getTableInfo(supabase: any, searchParams: URLSearchParams) {
  const tableName = searchParams.get('table')
  
  if (!tableName) {
    throw new Error('Table name is required')
  }
  
  // Get table structure from information_schema
  const { data: columns, error: columnsError } = await supabase
    .from('information_schema.columns')
    .select('column_name, data_type, is_nullable, column_default')
    .eq('table_name', tableName)
    .eq('table_schema', 'public')
  
  if (columnsError) throw columnsError
  
  // Get constraints
  const { data: constraints, error: constraintsError } = await supabase
    .from('information_schema.table_constraints')
    .select('constraint_name, constraint_type')
    .eq('table_name', tableName)
    .eq('table_schema', 'public')
  
  if (constraintsError) throw constraintsError
  
  return NextResponse.json({
    table: tableName,
    columns,
    constraints,
    operation: 'table_info'
  })
}

async function getSchemaInfo(supabase: any) {
  // Get all tables in public schema
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name, table_type')
    .eq('table_schema', 'public')
  
  if (tablesError) throw tablesError
  
  // Get all views
  const { data: views, error: viewsError } = await supabase
    .from('information_schema.views')
    .select('table_name')
    .eq('table_schema', 'public')
  
  if (viewsError) throw viewsError
  
  return NextResponse.json({
    tables: tables?.map(t => t.table_name) || [],
    views: views?.map(v => v.table_name) || [],
    operation: 'schema_info'
  })
}

async function getFunctionsList(supabase: any) {
  // Get custom functions
  const { data: functions, error: functionsError } = await supabase
    .from('information_schema.routines')
    .select('routine_name, routine_type, data_type')
    .eq('routine_schema', 'public')
    .eq('routine_type', 'FUNCTION')
  
  if (functionsError) throw functionsError
  
  return NextResponse.json({
    functions: functions?.map(f => ({
      name: f.routine_name,
      type: f.routine_type,
      return_type: f.data_type
    })) || [],
    operation: 'functions_list'
  })
}