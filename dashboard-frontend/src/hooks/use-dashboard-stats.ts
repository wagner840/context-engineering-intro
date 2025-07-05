'use client'

import { useQuery } from '@tanstack/react-query'

interface DashboardStats {
  totalBlogs: number
  totalKeywords: number
  totalPosts: number
  totalOpportunities: number
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const response = await fetch('/api/dashboard/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats')
      }
      return response.json()
    },
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  })
}

export function useBlogStats() {
  return useQuery({
    queryKey: ['blog-stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/blog-stats')
      if (!response.ok) {
        throw new Error('Failed to fetch blog stats')
      }
      return response.json()
    },
    refetchInterval: 60000, // Atualiza a cada minuto
  })
}