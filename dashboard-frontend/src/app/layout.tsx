import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider'
import { QueryProvider } from '@/providers/query-provider'
import { SupabaseProvider } from '@/providers/supabase-provider'
import { RealtimeProvider } from '@/components/realtime/realtime-provider'
import { RealtimeStatus } from '@/components/realtime/realtime-status'
import { Sidebar } from '@/components/layout/sidebar'
import { BlogSelector } from '@/components/dashboard/blog-selector'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Dashboard Frontend PAWA',
  description: 'WordPress Content Management SaaS with Context Engineering & MCP integration',
  keywords: ['WordPress', 'Content Management', 'SEO', 'Keywords', 'Blog Management'],
  authors: [{ name: 'PAWA Team' }],
  openGraph: {
    title: 'Dashboard Frontend PAWA',
    description: 'Professional WordPress Content Management System',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseProvider>
            <QueryProvider>
              <RealtimeProvider>
                <div className="relative min-h-screen bg-background">
                  {/* Background Effects */}
                  <div className="fixed inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
                    <div className="gradient-mesh opacity-30" />
                  </div>
                  
                  {/* Sidebar */}
                  <Sidebar />
                  
                  {/* Main Content */}
                  <main className="min-h-screen md:pl-[260px] transition-all duration-300">
                    <div className="relative">
                      {/* Mobile Header Space */}
                      <div className="h-16 md:hidden" />
                      {/* Seletor de Blog minimalista, topo direito */}
                      <div className="flex justify-end items-center w-full max-w-5xl mx-auto px-4 pt-2 pb-1">
                        <BlogSelector />
                      </div>
                      {children}
                    </div>
                  </main>
                  
                  {/* Realtime Status - Fixed position */}
                  <div className="fixed bottom-4 right-4 z-50">
                    <RealtimeStatus />
                  </div>
                </div>
              </RealtimeProvider>
            </QueryProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}