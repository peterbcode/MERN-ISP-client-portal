'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  hoverScale?: number
  shadowIntensity?: 'light' | 'medium' | 'heavy'
}

/**
 * HoverCard - Premium card with subtle hover effects
 * 
 * Features:
 * - Smooth scaling with GPU acceleration
 * - Dynamic shadows
 * - Accessibility support
 * - Performance optimized
 */
export const HoverCard = forwardRef<HTMLDivElement, HoverCardProps>(
  ({ children, className, hoverScale = 1.02, shadowIntensity = 'medium', ...props }, ref) => {
    const shadowStyles = {
      light: 'shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)]',
      medium: 'shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]',
      heavy: 'shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.25)]',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'group relative overflow-hidden rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 transition-all duration-300 ease-out will-change-transform',
          shadowStyles[shadowIntensity],
          className
        )}
        style={{
          transform: 'translate3d(0, 0, 0) scale3d(1, 1, 1)',
        }}
        {...props}
      >
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Hover scale effect */}
        <style jsx>{`
          .group:hover {
            transform: translate3d(0, -4px, 0) scale3d(${hoverScale}, ${hoverScale}, 1);
          }
        `}</style>
      </div>
    )
  }
)

HoverCard.displayName = 'HoverCard'

export default HoverCard
