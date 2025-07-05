'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

const loadingVariants = cva(
  "flex items-center justify-center",
  {
    variants: {
      variant: {
        spinner: "",
        dots: "",
        pulse: "",
        bars: "",
        ring: "",
      },
      size: {
        sm: "scale-75",
        default: "scale-100",
        lg: "scale-125",
        xl: "scale-150",
      },
      color: {
        primary: "text-primary",
        secondary: "text-secondary",
        accent: "text-accent",
        default: "text-current",
      },
    },
    defaultVariants: {
      variant: "spinner",
      size: "default",
      color: "default",
    },
  }
)

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring'
  size?: 'sm' | 'default' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'accent' | 'default'
  text?: string
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, variant, size, color, text, ...props }, ref) => {
    const renderLoading = () => {
      switch (variant) {
        case 'spinner':
          return (
            <div className="relative">
              <div className={cn(
                "h-12 w-12 rounded-full border-4 border-current opacity-25",
                size === 'sm' && 'h-8 w-8 border-2',
                size === 'lg' && 'h-16 w-16 border-4',
                size === 'xl' && 'h-20 w-20 border-6'
              )} />
              <div className={cn(
                "absolute inset-0 h-12 w-12 rounded-full border-4 border-current border-t-transparent animate-spin",
                size === 'sm' && 'h-8 w-8 border-2',
                size === 'lg' && 'h-16 w-16 border-4',
                size === 'xl' && 'h-20 w-20 border-6'
              )} />
            </div>
          )
          
        case 'dots':
          return (
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-3 w-3 rounded-full bg-current animate-bounce",
                    size === 'sm' && 'h-2 w-2',
                    size === 'lg' && 'h-4 w-4',
                    size === 'xl' && 'h-5 w-5'
                  )}
                  style={{
                    animationDelay: `${i * 150}ms`,
                  }}
                />
              ))}
            </div>
          )
          
        case 'pulse':
          return (
            <div className="relative">
              <div className={cn(
                "h-12 w-12 rounded-full bg-current animate-ping absolute",
                size === 'sm' && 'h-8 w-8',
                size === 'lg' && 'h-16 w-16',
                size === 'xl' && 'h-20 w-20'
              )} />
              <div className={cn(
                "h-12 w-12 rounded-full bg-current relative",
                size === 'sm' && 'h-8 w-8',
                size === 'lg' && 'h-16 w-16',
                size === 'xl' && 'h-20 w-20'
              )} />
            </div>
          )
          
        case 'bars':
          return (
            <div className="flex items-end gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1 bg-current animate-pulse rounded-full",
                    size === 'sm' && 'w-0.5',
                    size === 'lg' && 'w-1.5',
                    size === 'xl' && 'w-2'
                  )}
                  style={{
                    height: `${20 + Math.random() * 20}px`,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>
          )
          
        case 'ring':
          return (
            <div className="relative">
              <div className={cn(
                "h-12 w-12",
                size === 'sm' && 'h-8 w-8',
                size === 'lg' && 'h-16 w-16',
                size === 'xl' && 'h-20 w-20'
              )}>
                <svg className="animate-spin" viewBox="0 0 50 50">
                  <circle
                    className="stroke-current opacity-25"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    strokeWidth="4"
                  />
                  <circle
                    className="stroke-current"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    strokeWidth="4"
                    strokeDasharray="80"
                    strokeDashoffset="60"
                  />
                </svg>
              </div>
            </div>
          )
          
        default:
          return null
      }
    }

    return (
      <div
        ref={ref}
        className={cn(loadingVariants({ variant: variant || 'spinner', size: size || 'default', color: color || 'default' }), className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-4">
          {renderLoading()}
          {text && (
            <p className="text-sm text-muted-foreground animate-pulse">
              {text}
            </p>
          )}
        </div>
      </div>
    )
  }
)
Loading.displayName = "Loading"

// Componente de Loading de Página Inteira
export const PageLoading = ({ text = "Carregando..." }: { text?: string }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loading variant="spinner" size="lg" text={text} />
    </div>
  )
}

// Componente de Loading Inline
export const InlineLoading = ({ text }: { text?: string }) => {
  return (
    <div className="inline-flex items-center gap-2">
      <Loading variant="dots" size="sm" />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  )
}

// Componente de Skeleton Loading
export const SkeletonCard = ({ className }: { className?: string }) => {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="h-40 bg-muted animate-pulse rounded-lg" />
      <div className="space-y-2">
        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
      </div>
    </div>
  )
}

export { Loading, loadingVariants } 