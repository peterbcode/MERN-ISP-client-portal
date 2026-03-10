'use client'

import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  from?: string
  to?: string
  via?: string
}

/**
 * GradientText - Premium gradient text effect
 * 
 * Features:
 * - Smooth gradient transitions
 * - Customizable colors
 * - Accessibility friendly
 * - Performance optimized
 */
export const GradientText = ({
  children,
  className,
  from = 'from-[#f97316]',
  to = 'to-[#ea580c]',
  via = 'via-[#fb923c]',
}: GradientTextProps) => {
  return (
    <span
      className={cn(
        `bg-gradient-to-r ${from} ${via} ${to} bg-clip-text text-transparent`,
        className
      )}
    >
      {children}
    </span>
  )
}

export default GradientText
