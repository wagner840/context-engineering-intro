'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { ExecutiveDashboard } from '@/components/dashboard/executive-dashboard'

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
        <div className="container mx-auto px-6 py-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Visão geral do sistema e métricas de desempenho
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Suspense fallback={<DashboardLoading />}>
          <ExecutiveDashboard />
        </Suspense>
      </main>
    </motion.div>
  )
}

function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Loading Animation */}
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <div className="absolute inset-2 h-16 w-16 rounded-full border-4 border-accent/20" />
          <div className="absolute inset-2 h-16 w-16 rounded-full border-4 border-accent border-t-transparent animate-spin animation-delay-150" />
          <div className="absolute inset-4 h-12 w-12 rounded-full bg-primary/10 animate-pulse" />
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-muted-foreground animate-pulse">
          Carregando dashboard<span className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      </div>

      {/* Skeleton Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card animate-pulse">
            <div className="h-20 bg-muted/50 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}