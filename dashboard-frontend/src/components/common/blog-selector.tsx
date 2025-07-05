'use client'

import { useState } from 'react'
import { useBlog } from '@/contexts/blog-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Check } from 'lucide-react'

interface BlogSelectorProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showDescription?: boolean
}

export function BlogSelector({ className = '', size = 'md', showDescription = false }: BlogSelectorProps) {
  const { activeBlog, setActiveBlog, blogs, isLoading } = useBlog()
  const [isOpen, setIsOpen] = useState(false)

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-muted rounded-md h-10 w-32 ${className}`} />
    )
  }

  const getDisplayInfo = () => {
    if (activeBlog === 'all') {
      return {
        name: 'Todos os Blogs',
        icon: '🌐',
        color: 'gray',
        description: `${blogs.length} blogs ativos`
      }
    }
    
    if (activeBlog) {
      return {
        name: activeBlog.name,
        icon: activeBlog.icon,
        color: activeBlog.color,
        description: activeBlog.niche
      }
    }

    return {
      name: 'Selecionar Blog',
      icon: '📋',
      color: 'gray',
      description: 'Nenhum blog selecionado'
    }
  }

  const displayInfo = getDisplayInfo()

  const sizeClasses = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base'
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`
            ${sizeClasses[size]}
            ${className}
            flex items-center justify-between 
            gap-2 w-full max-w-[280px] 
            border-2 transition-all duration-200
            hover:border-primary/50 hover:bg-accent/50
            focus:border-primary focus:ring-2 focus:ring-primary/20
          `}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-lg leading-none">{displayInfo.icon}</span>
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="font-medium truncate w-full text-left">
                {displayInfo.name}
              </span>
              {showDescription && size !== 'sm' && (
                <span className="text-xs text-muted-foreground truncate w-full text-left">
                  {displayInfo.description}
                </span>
              )}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="start" 
        className="w-[280px] p-2"
        sideOffset={5}
      >
        {/* Opção "Todos" */}
        <DropdownMenuItem
          onClick={() => {
            setActiveBlog('all')
            setIsOpen(false)
          }}
          className="flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-accent/80"
        >
          <div className="flex items-center gap-3 flex-1">
            <span className="text-lg">🌐</span>
            <div className="flex flex-col">
              <span className="font-medium">Todos os Blogs</span>
              <span className="text-xs text-muted-foreground">
                Visualizar dados de ambos os blogs
              </span>
            </div>
          </div>
          {activeBlog === 'all' && (
            <Check className="h-4 w-4 text-primary" />
          )}
        </DropdownMenuItem>

        {/* Separador */}
        <div className="my-2 border-t" />

        {/* Blogs nativos */}
        {blogs.map((blog) => (
          <DropdownMenuItem
            key={blog.id}
            onClick={() => {
              setActiveBlog(blog)
              setIsOpen(false)
            }}
            className="flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-accent/80"
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-lg">{blog.icon}</span>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{blog.name}</span>
                  <Badge 
                    variant="secondary" 
                    className={`
                      text-xs px-2 py-0.5
                      ${blog.color === 'blue' ? 'bg-blue-100 text-blue-700' : ''}
                      ${blog.color === 'green' ? 'bg-green-100 text-green-700' : ''}
                    `}
                  >
                    {blog.niche}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {blog.domain}
                </span>
              </div>
            </div>
            {activeBlog && activeBlog !== 'all' && activeBlog.id === blog.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}

        {/* Status da conexão */}
        <div className="mt-2 pt-2 border-t">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-muted-foreground">Status</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600">Online</span>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}