'use client'

import { forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

/**
 * PremiumButton - SaaS-quality button with micro-interactions
 * 
 * Features:
 * - Smooth hover states with GPU acceleration
 * - Subtle press feedback
 * - Focus management
 * - Accessibility support
 * - Multiple variants and sizes
 */
export const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ variant = 'primary', size = 'md', children, className, disabled, ...props }, ref) => {
    const [isPressed, setIsPressed] = useState(false)

    const baseStyles = 'relative inline-flex items-center justify-center rounded-full font-bold transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent will-change-transform'

    const variants = {
      primary: 'bg-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.3)] ring-1 ring-white/40 hover:shadow-[0_10px_24px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 hover:brightness-110 focus:ring-white/50',
      secondary: 'border border-[rgba(255,106,0,0.4)] bg-transparent text-[#ff6a00] backdrop-blur-sm hover:border-[rgba(255,106,0,0.6)] hover:text-[#ff8c00] focus:ring-zinc-500',
      ghost: 'text-zinc-300 hover:text-white hover:bg-zinc-800/50 focus:ring-zinc-500',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    const handleMouseDown = () => setIsPressed(true)
    const handleMouseUp = () => setIsPressed(false)
    const handleMouseLeave = () => setIsPressed(false)

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          disabled && 'opacity-50 cursor-not-allowed',
          isPressed && !disabled && 'scale-95 translate-y-0.5 shadow-sm',
          className
        )}
        disabled={disabled}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Subtle gradient overlay for premium feel */}
        {variant === 'primary' && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        )}
        
        {/* Content */}
        <span className="relative z-10">{children}</span>
      </button>
    )
  }
)

PremiumButton.displayName = 'PremiumButton'

export default PremiumButton
