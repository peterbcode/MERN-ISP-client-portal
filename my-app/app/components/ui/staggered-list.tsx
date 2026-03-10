'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface StaggeredListProps {
  children: React.ReactNode[]
  className?: string
  staggerDelay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  duration?: number
  threshold?: number
}

/**
 * StaggeredList - Premium list with progressive animations
 * 
 * Features:
 * - Intersection Observer for performance
 * - Staggered item animations
 * - GPU-friendly transforms
 * - Responsive to scroll direction
 */
export const StaggeredList = ({
  children,
  className,
  staggerDelay = 100,
  direction = 'up',
  duration = 500,
  threshold = 0.1,
}: StaggeredListProps) => {
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set())
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setVisibleIndices(new Set(children.map((_, index) => index)))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0')
          if (entry.isIntersecting) {
            setVisibleIndices((prev) => new Set([...prev, index]))
          }
        })
      },
      {
        threshold,
        rootMargin: '50px 0px -50px 0px'
      }
    )

    // Observe each child
    const childElements = element.querySelectorAll('[data-stagger-item]')
    childElements.forEach((child) => observer.observe(child))

    return () => {
      childElements.forEach((child) => observer.unobserve(child))
    }
  }, [children, threshold])

  const getItemStyles = (index: number) => {
    const isVisible = visibleIndices.has(index)
    const delay = index * staggerDelay

    if (isVisible) {
      return {
        opacity: 1,
        transform: 'translate3d(0, 0, 0) scale3d(1, 1, 1)',
        transition: `opacity ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms, transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
      }
    }

    // Initial states based on direction
    const initialStates = {
      up: { opacity: 0, transform: 'translate3d(0, 20px, 0) scale3d(0.95, 0.95, 1)' },
      down: { opacity: 0, transform: 'translate3d(0, -20px, 0) scale3d(0.95, 0.95, 1)' },
      left: { opacity: 0, transform: 'translate3d(20px, 0, 0) scale3d(0.95, 0.95, 1)' },
      right: { opacity: 0, transform: 'translate3d(-20px, 0, 0) scale3d(0.95, 0.95, 1)' },
      fade: { opacity: 0, transform: 'translate3d(0, 0, 0) scale3d(0.95, 0.95, 1)' },
    }

    return {
      ...initialStates[direction],
      transition: `opacity ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms, transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
    }
  }

  return (
    <div ref={ref} className={cn('space-y-4', className)}>
      {children.map((child, index) => (
        <div
          key={index}
          data-stagger-item
          data-index={index}
          className="will-change-transform"
          style={getItemStyles(index)}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export default StaggeredList
