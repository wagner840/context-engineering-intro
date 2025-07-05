'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { BlogDashboard } from '@/components/blogs/blog-dashboard'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Settings, Plus, ExternalLink } from 'lucide-react'

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const blogId = params.id as string

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
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Dashboard do Blog</h1>
                <p className="text-muted-foreground mt-1 text-sm md:text-base">
                  Gerencie posts e monitore performance
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Site
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Post
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <Suspense fallback={<BlogDashboardLoading />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <BlogDashboard blogId={blogId} />
          </motion.div>
        </Suspense>
      </main>
    </motion.div>
  )
}

function BlogDashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Blog info skeleton */}
      <div className="h-32 bg-muted/20 rounded-lg animate-pulse" />
      
      {/* Stats skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted/20 rounded-lg animate-pulse" />
        ))}
      </div>
      
      {/* Posts skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 bg-muted/20 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  )
}