'use client'

import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  LayoutDashboard,
  Globe,
  Target,
  FileText,
  TrendingUp,
  Search,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Activity,
  Database,
  Code2,
  Sparkles,
  MessageSquare,
  HelpCircle,
  Bell,
  Sun,
  Moon,
  LogOut,
  Zap
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { BlogSelectorDropdown } from '@/components/common/blog-selector-dropdown'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  badge?: string | number
  isNew?: boolean
  isPro?: boolean
  children?: NavItem[]
}

const navigation: NavItem[] = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: LayoutDashboard,
    badge: 2
  },
  { 
    name: 'Blogs', 
    href: '/blogs', 
    icon: Globe 
  },
  {
    name: 'Keywords',
    href: '/keywords',
    icon: Target,
    children: [
      { name: 'Research', href: '/keywords/research', icon: Search },
      { name: 'Clusters', href: '/keywords/clusters', icon: Database },
      { name: 'Opportunities', href: '/keywords/opportunities', icon: TrendingUp, isNew: true }
    ]
  },
  {
    name: 'Content',
    href: '/content',
    icon: FileText,
    children: [
      { name: 'Posts', href: '/content/posts', icon: FileText },
      { name: 'Editor', href: '/content/editor', icon: Code2, isPro: true },
      { name: 'AI Assistant', href: '/content/ai', icon: Sparkles, isNew: true }
    ]
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    badge: 'Pro',
    isPro: true
  },
  {
    name: 'Automation',
    href: '/automation',
    icon: Zap,
    isNew: true
  }
]

const bottomNavigation: NavItem[] = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
  { name: 'Feedback', href: '/feedback', icon: MessageSquare }
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const sidebarRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fechar sidebar no mobile quando mudar de rota
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Fechar sidebar ao clicar fora (mobile)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isMobileOpen && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[data-mobile-menu-button]')
      ) {
        setIsMobileOpen(false)
      }
    }

    if (isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileOpen])

  const toggleExpanded = (name: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(name)) {
      newExpanded.delete(name)
    } else {
      newExpanded.add(name)
    }
    setExpandedItems(newExpanded)
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === href
    return pathname.startsWith(href)
  }

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.name)
    const active = isActive(item.href)

    return (
      <div key={item.name} className="relative">
        <motion.div
          initial={false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: depth * 0.05 }}
        >
          <Link
            href={hasChildren ? '#' : item.href}
            onClick={(e) => {
              if (hasChildren) {
                e.preventDefault()
                toggleExpanded(item.name)
              } else {
                // Fechar mobile sidebar ao navegar
                setIsMobileOpen(false)
              }
            }}
            className={cn(
              'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              'hover:bg-accent hover:text-accent-foreground select-none',
              active && 'bg-primary text-primary-foreground shadow-sm',
              !active && 'text-muted-foreground',
              depth > 0 && 'ml-4 text-xs'
            )}
            style={{
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            <item.icon className={cn(
              'h-4 w-4 transition-transform duration-200',
              active && 'scale-110',
              isCollapsed && depth === 0 && 'h-5 w-5'
            )} />
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 overflow-hidden whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>

            {!isCollapsed && (
              <>
                {item.badge && (
                  <Badge 
                    variant={item.isPro ? 'default' : 'secondary'} 
                    className={cn(
                      'ml-auto transition-all duration-200',
                      active && 'bg-primary-foreground text-primary'
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
                
                {item.isNew && (
                  <span className="ml-auto flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                )}

                {hasChildren && (
                  <ChevronRight 
                    className={cn(
                      'ml-auto h-4 w-4 transition-transform duration-200',
                      isExpanded && 'rotate-90'
                    )}
                  />
                )}
              </>
            )}
          </Link>
        </motion.div>

        {/* Children items */}
        <AnimatePresence>
          {hasChildren && isExpanded && !isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1 space-y-1"
            >
              {item.children?.map(child => renderNavItem(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  if (!mounted) {
    return <SidebarSkeleton />
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        data-mobile-menu-button
        className={cn(
          "fixed top-4 z-50 md:hidden bg-background/90 backdrop-blur-sm border",
          isMobileOpen ? "left-[220px]" : "left-4"
        )}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <AnimatePresence mode="wait">
          {isMobileOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <X className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <Menu className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef}
        initial={false}
        animate={{
          width: isCollapsed ? 70 : 260,
          x: 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 z-40 h-full border-r bg-card/95 backdrop-blur-xl shadow-xl',
          'md:translate-x-0 md:shadow-none',
          // Mobile: show/hide based on mobile menu state
          'max-md:transition-transform max-md:duration-300 max-md:w-64',
          !isMobileOpen && 'max-md:-translate-x-full',
          isMobileOpen && 'max-md:translate-x-0'
        )}
        style={{
          // Evita que o conteúdo dentro seja arrastável
          WebkitUserSelect: 'none',
          userSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold">PAWA</span>
              </motion.div>
            ) : (
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Activity className="h-5 w-5" />
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Blog Selector */}
          {!isCollapsed && (
            <div className="px-3 py-2 border-b">
              <BlogSelectorDropdown />
            </div>
          )}

          {/* Main Navigation */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <nav className="space-y-1">
              {navigation.map(item => renderNavItem(item))}
            </nav>

            {/* Divider */}
            <div className="my-4 border-t" />

            {/* Bottom Navigation */}
            <nav className="space-y-1">
              {bottomNavigation.map(item => renderNavItem(item))}
            </nav>
          </div>

          {/* User Section */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              {!isCollapsed && (
                <>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent" />
                  <div className="flex-1 truncate">
                    <p className="text-sm font-medium">User Name</p>
                    <p className="text-xs text-muted-foreground">user@email.com</p>
                  </div>
                </>
              )}
              
              <div className={cn(
                'flex items-center gap-1',
                isCollapsed && 'flex-col'
              )}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
                
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Bell className="h-4 w-4" />
                </Button>
                
                {!isCollapsed && (
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

function SidebarSkeleton() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-full w-[260px] border-r bg-card/50 backdrop-blur-xl">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-4">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex-1 px-3 py-4">
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="border-t p-4">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </aside>
  )
}
