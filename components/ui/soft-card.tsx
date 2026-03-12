'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SoftCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'inset' | 'elevated'
  children: React.ReactNode
  className?: string
}

const SoftCard = React.forwardRef<HTMLDivElement, SoftCardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseClasses = 'soft-card'
    
    const variantClasses = {
      default: 'soft-card',
      inset: 'soft-card-inset',
      elevated: 'soft-card hover-lift'
    }
    
    return (
      <div
        className={cn(
          baseClasses,
          variantClasses[variant],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

SoftCard.displayName = 'SoftCard'

export { SoftCard }
