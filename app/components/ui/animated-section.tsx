'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  duration?: number
  threshold?: number
  once?: boolean
}

/**
 * AnimatedSection - Premium scroll-triggered animations
 * 
 * Features:
 * - Intersection Observer for performance
 * - GPU-accelerated transforms
 * - Respects prefers-reduced-motion
 * - Staggered animations for lists
 * - Mobile-optimized
 */
export const AnimatedSection = ({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 600,
  threshold = 0.1,
  once = true,
}: AnimatedSectionProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated)) {
          setIsVisible(true)
          setHasAnimated(true)
        } else if (!once && !entry.isIntersecting) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin: '50px 0px -50px 0px' // Start animation 50px before element enters viewport
      }
    )

    observer.observe(element)

    return () => observer.unobserve(element)
  }, [threshold, once, hasAnimated])

  // Animation variants with GPU-friendly transforms
  const getAnimationStyles = () => {
    if (isVisible) {
      return {
        opacity: 1,
        transform: 'translate3d(0, 0, 0) scale3d(1, 1, 1)',
        transition: `opacity ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms, transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
      }
    }

    // Initial states based on direction
    const initialStates = {
      up: { opacity: 0, transform: 'translate3d(0, 30px, 0) scale3d(0.95, 0.95, 1)' },
      down: { opacity: 0, transform: 'translate3d(0, -30px, 0) scale3d(0.95, 0.95, 1)' },
      left: { opacity: 0, transform: 'translate3d(30px, 0, 0) scale3d(0.95, 0.95, 1)' },
      right: { opacity: 0, transform: 'translate3d(-30px, 0, 0) scale3d(0.95, 0.95, 1)' },
      fade: { opacity: 0, transform: 'translate3d(0, 0, 0) scale3d(0.95, 0.95, 1)' },
    }

    return {
      ...initialStates[direction],
      transition: `opacity ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms, transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
    }
  }

  return (
    <div
      ref={ref}
      className={cn('will-change-transform', className)}
      style={getAnimationStyles()}
    >
      {children}
    </div>
  )
}

export default AnimatedSection
