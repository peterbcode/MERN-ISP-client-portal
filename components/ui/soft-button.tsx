'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SoftButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

const SoftButton = React.forwardRef<HTMLButtonElement, SoftButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'btn-soft'
    
    const variantClasses = {
      primary: 'btn-soft-primary',
      secondary: 'btn-soft-secondary', 
      ghost: 'btn-soft-ghost'
    }
    
    const sizeClasses = {
      sm: 'text-xs px-3 py-2',
      md: 'text-sm px-4 py-3',
      lg: 'text-base px-6 py-4'
    }
    
    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

SoftButton.displayName = 'SoftButton'

export { SoftButton }
