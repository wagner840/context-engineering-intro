'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface NativeBlog {
  id: string
  name: string
  domain: string
  niche: string
  description: string
  wordpress_url: string
  wordpress_username: string
  wordpress_password: string
  color: string
  icon: string
}

export const NATIVE_BLOGS: NativeBlog[] = [
  {
    id: 'einsof7',
    name: 'Einsof7',
    domain: 'einsof7.com',
    niche: 'Tecnologia e IA',
    description: 'Blog especializado em inteligência artificial, desenvolvimento e tecnologia avançada',
    wordpress_url: process.env.NEXT_PUBLIC_EINSOF7_WORDPRESS_URL || 'https://einsof7.com',
    wordpress_username: process.env.NEXT_PUBLIC_EINSOF7_WORDPRESS_USERNAME || 'contatopawa@gmail.com',
    wordpress_password: process.env.NEXT_PUBLIC_EINSOF7_WORDPRESS_PASSWORD || 'B0lk 6UEQ kNEz aVgP KnFS WXJBd',
    color: 'blue',
    icon: '🤖'
  },
  {
    id: 'optemil',
    name: 'Optemil', 
    domain: 'opetmil.com',
    niche: 'Marketing Digital',
    description: 'Blog focado em estratégias de marketing digital, otimização e crescimento online',
    wordpress_url: process.env.NEXT_PUBLIC_OPTEMIL_WORDPRESS_URL || 'https://opetmil.com',
    wordpress_username: process.env.NEXT_PUBLIC_OPTEMIL_WORDPRESS_USERNAME || 'contatopawa@gmail.com',
    wordpress_password: process.env.NEXT_PUBLIC_OPTEMIL_WORDPRESS_PASSWORD || '7FoB NxNd DNsU 7Mew O9Dr dLiY',
    color: 'green',
    icon: '📈'
  }
]

interface BlogContextType {
  activeBlog: NativeBlog | 'all' | null
  setActiveBlog: (blog: NativeBlog | 'all') => void
  blogs: NativeBlog[]
  isLoading: boolean
}

const BlogContext = createContext<BlogContextType | undefined>(undefined)

interface BlogProviderProps {
  children: ReactNode
}

export function BlogProvider({ children }: BlogProviderProps) {
  const [activeBlog, setActiveBlogState] = useState<NativeBlog | 'all' | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Carregar blog ativo do localStorage ou definir padrão
    const savedBlog = localStorage.getItem('activeBlog')
    if (savedBlog === 'all') {
      setActiveBlogState('all')
    } else if (savedBlog) {
      const blog = NATIVE_BLOGS.find(b => b.id === savedBlog)
      setActiveBlogState(blog || NATIVE_BLOGS[0])
    } else {
      // Padrão: todos os blogs
      setActiveBlogState('all')
    }
    setIsLoading(false)
  }, [])

  const setActiveBlog = (blog: NativeBlog | 'all') => {
    setActiveBlogState(blog)
    localStorage.setItem('activeBlog', blog === 'all' ? 'all' : blog.id)
  }

  return (
    <BlogContext.Provider
      value={{
        activeBlog,
        setActiveBlog,
        blogs: NATIVE_BLOGS,
        isLoading
      }}
    >
      {children}
    </BlogContext.Provider>
  )
}

export function useBlog() {
  const context = useContext(BlogContext)
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider')
  }
  return context
}