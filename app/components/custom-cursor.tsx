'use client'

import { useEffect, useRef } from 'react'

// Optimized water cursor with smooth performance
export default function MorphCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>()
  const previousPos = useRef({ x: 0, y: 0 })
  
  let mousePosition = { x: 0, y: 0 }
  let isHoveringInteractive = false
  let currentColor = 'orange' // Start with orange

  // Optimized animation loop for smooth cursor follow
  const animate = () => {
    if (!cursorRef.current) return

    const currentX = previousPos.current.x
    const currentY = previousPos.current.y
    const targetX = mousePosition.x
    const targetY = mousePosition.y

    // High sensitivity easing factor for responsive movement
    const deltaX = (targetX - currentX) * 0.4
    const deltaY = (targetY - currentY) * 0.4

    const newX = currentX + deltaX
    const newY = currentY + deltaY

    previousPos.current = { x: newX, y: newY }

    // Add subtle wobble for water effect
    const wobbleX = Math.sin(Date.now() * 0.003) * 2
    const wobbleY = Math.cos(Date.now() * 0.003) * 2

    cursorRef.current.style.transform = `translate(${newX + wobbleX}px, ${newY + wobbleY}px) translate(-50%, -50%)`

    requestRef.current = requestAnimationFrame(animate)
  }

  // Simple color detection
  const getCursorColor = (element: Element | null): string => {
    // Check if we're on the top bar above navbar (the orange announcement bar)
    if (element?.closest('[data-cursor-invert]') || element?.closest('.bg-\\[\\#f97316\\]')) {
      return 'black' // Black on top orange bar
    }
    
    // Always stay orange on navbar and everywhere else
    return 'orange' // Orange on navbar and all other backgrounds
  }

  // Get effective background color
  const getEffectiveBg = (el: Element | null): { r: number; g: number; b: number } | null => {
    let node = el
    while (node && node !== document.body) {
      const bg = window.getComputedStyle(node as Element).backgroundColor
      const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
      if (match) {
        const alpha = match[4] !== undefined ? parseFloat(match[4]) : 1
        if (alpha > 0.05) {
          return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) }
        }
      }
      node = (node as Element).parentElement
    }
    return null
  }

  useEffect(() => {
    // Disable cursor on touch devices
    if ('ontouchstart' in window) return

    const cursor = cursorRef.current
    if (!cursor) return
    
    // Add required classes for cursor visibility
    document.body.classList.add('custom-cursor-enabled')
    cursor.classList.add('Cursor')

    // Optimized mouse move handler with high sensitivity
    const onMouseMove = (e: MouseEvent) => {
      // Direct position update for maximum responsiveness
      mousePosition.x = e.clientX
      mousePosition.y = e.clientY
      
      // Throttle expensive operations
      if (!isHoveringInteractive) {
        // Check for hover on interactive elements only when needed
        const element = document.elementFromPoint(e.clientX, e.clientY)
        const interactive = !!(element as Element)?.closest?.('a, button, input, textarea, select, label, [role="button"], [tabindex], [onclick]')
        
        if (interactive !== isHoveringInteractive) {
          isHoveringInteractive = interactive
          cursor.classList.toggle('Cursor--interactive', interactive)
          
          // Expand cursor on interactive elements
          if (interactive) {
            cursor.style.width = '32px'
            cursor.style.height = '32px'
          } else {
            cursor.style.width = '16px'
            cursor.style.height = '16px'
          }
        }

        // Update cursor color only when needed
        const newColor = getCursorColor(element)
        if (newColor !== currentColor) {
          currentColor = newColor
          if (newColor === 'orange') {
            cursor.style.background = 'radial-gradient(circle at 30% 30%, #ff9800, #f57c00)'
            cursor.style.boxShadow = '0 2px 8px rgba(245, 124, 0, 0.3)'
          } else {
            cursor.style.background = 'radial-gradient(circle at 30% 30%, #424242, #212121)'
            cursor.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)'
          }
        }
      }
    }

    const handleMouseEnter = () => {
      cursor.style.opacity = '1'
    }

    const handleMouseLeave = () => {
      cursor.style.opacity = '0'
    }

    // Start optimized event listeners
    document.addEventListener("mousemove", onMouseMove)
    document.documentElement.addEventListener("mouseenter", handleMouseEnter)
    document.documentElement.addEventListener("mouseleave", handleMouseLeave)
    
    // Initialize cursor color
    cursor.style.background = 'radial-gradient(circle at 30% 30%, #ff9800, #f57c00)'
    cursor.style.boxShadow = '0 2px 8px rgba(245, 124, 0, 0.3)'

    // Start optimized animation loop
    requestRef.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter)
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave)
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      // Clean up classes
      document.body.classList.remove('custom-cursor-enabled')
      cursor.classList.remove('Cursor')
      cursor.classList.remove('Cursor--interactive')
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="Cursor"
      style={{
        position: 'fixed',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        transition: 'background 0.2s ease, box-shadow 0.2s ease, width 0.2s ease, height 0.2s ease',
        backdropFilter: 'blur(1px)',
        opacity: 0
      }}
    />
  )
}
