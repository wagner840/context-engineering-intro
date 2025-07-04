import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotifications } from '@/store/ui-store'

interface BulkOperationParams {
  table: string
  operation: 'insert' | 'update' | 'delete' | 'upsert'
  data: Record<string, any>[]
  filters?: Record<string, any>
  returning?: string
}

interface AggregationParams {
  table: string
  columns: string[]
  filters?: Record<string, any>
  groupBy?: string[]
  having?: Record<string, any>
  orderBy?: Array<{
    column: string
    ascending: boolean
  }>
}

interface RelationshipQueryParams {
  table: string
  select: string
  filters?: Record<string, any>
  limit?: number
  offset?: number
}

export function useBulkOperation() {
  const { addNotification } = useNotifications()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: BulkOperationParams) => {
      const response = await fetch('/api/database/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'bulk_operation',
          ...params,
        }),
      })

      if (!response.ok) {
        throw new Error('Bulk operation failed')
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
      addNotification({
        type: 'success',
        title: 'Bulk operation completed',
        message: `${variables.operation} operation on ${variables.table} successful`,
      })

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [variables.table] })
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Bulk operation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    },
  })
}

export function useAggregation(params: AggregationParams, enabled = true) {
  return useQuery({
    queryKey: ['aggregation', params.table, params.columns, params.filters, params.groupBy],
    queryFn: async () => {
      const response = await fetch('/api/database/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'aggregation',
          ...params,
        }),
      })

      if (!response.ok) {
        throw new Error('Aggregation query failed')
      }

      return response.json()
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useRelationshipQuery(params: RelationshipQueryParams, enabled = true) {
  return useQuery({
    queryKey: ['relationship', params.table, params.select, params.filters, params.limit, params.offset],
    queryFn: async () => {
      const response = await fetch('/api/database/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'relationship_query',
          ...params,
        }),
      })

      if (!response.ok) {
        throw new Error('Relationship query failed')
      }

      return response.json()
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useCustomFunction() {
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async (params: { function_name: string; parameters?: Record<string, any> }) => {
      const response = await fetch('/api/database/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'custom_function',
          ...params,
        }),
      })

      if (!response.ok) {
        throw new Error('Custom function execution failed')
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
      addNotification({
        type: 'success',
        title: 'Function executed',
        message: `Function ${variables.function_name} completed successfully`,
      })
    },
    onError: (error, variables) => {
      addNotification({
        type: 'error',
        title: 'Function execution failed',
        message: `${variables.function_name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    },
  })
}

export function useTableInfo(tableName: string, enabled = true) {
  return useQuery({
    queryKey: ['table-info', tableName],
    queryFn: async () => {
      const response = await fetch(`/api/database/operations?operation=table_info&table=${tableName}`)

      if (!response.ok) {
        throw new Error('Failed to fetch table info')
      }

      return response.json()
    },
    enabled: enabled && !!tableName,
    staleTime: 10 * 60 * 1000, // 10 minutes - table structure doesn't change often
  })
}

export function useSchemaInfo(enabled = true) {
  return useQuery({
    queryKey: ['schema-info'],
    queryFn: async () => {
      const response = await fetch('/api/database/operations?operation=schema_info')

      if (!response.ok) {
        throw new Error('Failed to fetch schema info')
      }

      return response.json()
    },
    enabled,
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

export function useFunctionsList(enabled = true) {
  return useQuery({
    queryKey: ['functions-list'],
    queryFn: async () => {
      const response = await fetch('/api/database/operations?operation=functions_list')

      if (!response.ok) {
        throw new Error('Failed to fetch functions list')
      }

      return response.json()
    },
    enabled,
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

// Utility hooks for common operations

export function useInsertMany(table: string) {
  const bulkOperation = useBulkOperation()

  return {
    insertMany: (data: Record<string, any>[]) =>
      bulkOperation.mutate({
        table,
        operation: 'insert',
        data,
      }),
    isLoading: bulkOperation.isPending,
    error: bulkOperation.error,
  }
}

export function useUpdateMany(table: string) {
  const bulkOperation = useBulkOperation()

  return {
    updateMany: (data: Record<string, any>[], filters: Record<string, any>) =>
      bulkOperation.mutate({
        table,
        operation: 'update',
        data,
        filters,
      }),
    isLoading: bulkOperation.isPending,
    error: bulkOperation.error,
  }
}

export function useDeleteMany(table: string) {
  const bulkOperation = useBulkOperation()

  return {
    deleteMany: (filters: Record<string, any>) =>
      bulkOperation.mutate({
        table,
        operation: 'delete',
        data: [],
        filters,
      }),
    isLoading: bulkOperation.isPending,
    error: bulkOperation.error,
  }
}

export function useUpsertMany(table: string) {
  const bulkOperation = useBulkOperation()

  return {
    upsertMany: (data: Record<string, any>[]) =>
      bulkOperation.mutate({
        table,
        operation: 'upsert',
        data,
      }),
    isLoading: bulkOperation.isPending,
    error: bulkOperation.error,
  }
}