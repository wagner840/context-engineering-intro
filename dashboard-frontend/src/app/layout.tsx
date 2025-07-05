import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider'
import { QueryProvider } from '@/providers/query-provider'
import { SupabaseProvider } from '@/providers/supabase-provider'

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
              <div className="relative min-h-screen bg-background">
                <main className="min-h-screen p-4">
                  {children}
                </main>
              </div>
            </QueryProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}