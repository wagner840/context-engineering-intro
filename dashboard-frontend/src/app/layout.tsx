import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider'
import { QueryProvider } from '@/providers/query-provider'
import { SupabaseProvider } from '@/providers/supabase-provider'
import { BlogProvider } from '@/contexts/blog-context'
import { Sidebar } from '@/components/layout/sidebar'

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
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseProvider>
            <QueryProvider>
              <BlogProvider>
                <div className="relative min-h-screen bg-background">
                  <Sidebar />
                  <main className="min-h-screen md:pl-[260px] p-4 pt-16 md:pt-4">
                    {children}
                  </main>
                </div>
              </BlogProvider>
            </QueryProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}