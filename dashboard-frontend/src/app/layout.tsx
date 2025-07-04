import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider'
import { QueryProvider } from '@/providers/query-provider'
import { SupabaseProvider } from '@/providers/supabase-provider'
import { RealtimeProvider } from '@/components/realtime/realtime-provider'
import { RealtimeStatus } from '@/components/realtime/realtime-status'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dashboard Frontend PAWA',
  description: 'WordPress Content Management SaaS with Context Engineering & MCP integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
                <div className="min-h-screen bg-background">
                  {children}
                  
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