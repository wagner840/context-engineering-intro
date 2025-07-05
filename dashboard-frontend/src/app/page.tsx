'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { Separator } from '@/components/ui/separator'

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {/* Page Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Visão geral do sistema e métricas de desempenho
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 space-y-8">
        {/* Statistics Cards */}
        <Suspense fallback={<DashboardLoading />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatsCards />
          </motion.div>
        </Suspense>

        <Separator />

        {/* Quick Actions */}
        <Suspense fallback={<QuickActionsLoading />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <QuickActions />
          </motion.div>
        </Suspense>
      </main>
    </motion.div>
  )
}

function DashboardLoading() {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-32 bg-muted/20 rounded-lg animate-pulse" />
      ))}
    </div>
  )
}

function QuickActionsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-16 bg-muted/20 rounded-lg animate-pulse" />
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 bg-muted/20 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  )
}