import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground transition-all duration-200",
  {
    variants: {
      variant: {
        default: "shadow-sm hover:shadow-md",
        elevated: "shadow-lg hover:shadow-xl",
        outline: "shadow-none",
        glass: "backdrop-blur-md bg-card/50 border-white/10",
        gradient: "bg-gradient-to-br from-card via-card to-accent/5 shadow-md",
      },
      interactive: {
        true: "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
      },
      glow: {
        true: "relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/0 before:via-primary/10 before:to-primary/0 before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",
      },
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
      glow: false,
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, glow, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, interactive, glow }), className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  >
    {children}
  </h3>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Componente adicional para cards com animação de entrada
export const AnimatedCard = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    delay?: number
    animateOnce?: boolean
  }
>(({ className, delay = 0, animateOnce = true, ...props }, ref) => {
  const [hasAnimated, setHasAnimated] = React.useState(false)
  const cardRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!animateOnce || !hasAnimated) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setHasAnimated(true)
            if (animateOnce) {
              observer.disconnect()
            }
          }
        },
        { threshold: 0.1 }
      )

      if (cardRef.current) {
        observer.observe(cardRef.current)
      }

      return () => observer.disconnect()
    }
  }, [animateOnce, hasAnimated])

  return (
    <Card
      ref={cardRef}
      className={cn(
        "opacity-0",
        hasAnimated && "animate-in fade-in-50 slide-in-from-bottom-5",
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "forwards",
      }}
      {...props}
    />
  )
})
AnimatedCard.displayName = "AnimatedCard"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }