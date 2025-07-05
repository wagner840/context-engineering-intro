'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { BlogsList } from '@/components/blogs/blogs-list'
import { Button } from '@/components/ui/button'
import { Plus, Settings } from 'lucide-react'

export default function BlogsPage() {
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
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Gerenciar Blogs</h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Configure e monitore seus blogs WordPress
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Blog
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <Suspense fallback={<BlogsLoading />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <BlogsList />
          </motion.div>
        </Suspense>
      </main>
    </motion.div>
  )
}

function BlogsLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-32 bg-muted/20 rounded-lg animate-pulse" />
      ))}
    </div>
  )
}