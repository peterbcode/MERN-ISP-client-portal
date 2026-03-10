'use client'

import { forwardRef, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  magneticStrength?: number
}

/**
 * MagneticButton - Premium button with magnetic hover effect
 * 
 * Features:
 * - Magnetic cursor attraction
 * - Smooth GPU-accelerated transforms
 * - Accessibility support
 * - Performance optimized
 */
export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, className, magneticStrength = 0.3, ...props }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [magnetStyle, setMagnetStyle] = useState({})

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current
      if (!button) return

      const rect = button.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) * magneticStrength
      const deltaY = (e.clientY - centerY) * magneticStrength

      setMagnetStyle({
        transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale3d(1.02, 1.02, 1)`,
      })
    }

    const handleMouseLeave = () => {
      setMagnetStyle({
        transform: 'translate3d(0, 0, 0) scale3d(1, 1, 1)',
      })
    }

    return (
      <button
        ref={buttonRef}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full bg-[#f97316] px-6 py-3 text-base font-bold text-white shadow-[0_4px_24px_rgba(243,111,0,0.3)] transition-all duration-300 ease-out hover:shadow-[0_8px_32px_rgba(243,111,0,0.4)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 focus:ring-offset-2 focus:ring-offset-transparent will-change-transform',
          className
        )}
        style={magnetStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
        
        {/* Content */}
        <span className="relative z-10">{children}</span>
      </button>
    )
  }
)

MagneticButton.displayName = 'MagneticButton'

export default MagneticButton
