'use client'

import { useEffect, useRef } from 'react'

// Simple water cursor with color inversion
export default function MorphCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Disable cursor on touch devices
    if ('ontouchstart' in window) return

    const cursor = cursorRef.current
    if (!cursor) return
    
    // Add required classes for cursor visibility
    document.body.classList.add('custom-cursor-enabled')
    cursor.classList.add('Cursor')

    let mousePosition = { x: 0, y: 0 }
    let rafID: number
    let isHoveringInteractive = false
    let currentColor = 'orange' // Start with orange

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

    // Simple mouse move handler
    const onMouseMove = (e: MouseEvent) => {
      mousePosition.x = e.clientX
      mousePosition.y = e.clientY
      
      // Check for hover on interactive elements
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

      // Update cursor color
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

    // Simple position update with slight wobble for liquid effect
    const positionCursor = () => {
      const wobbleX = Math.sin(Date.now() * 0.003) * 2
      const wobbleY = Math.cos(Date.now() * 0.003) * 2
      cursor.style.transform = `translate(${mousePosition.x + wobbleX}px, ${mousePosition.y + wobbleY}px) translate(-50%, -50%)`
    }

    // Animation loop
    const render = () => {
      positionCursor()
      rafID = requestAnimationFrame(render)
    }

    // Initialize cursor color
    cursor.style.background = 'radial-gradient(circle at 30% 30%, #ff9800, #f57c00)'
    cursor.style.boxShadow = '0 2px 8px rgba(245, 124, 0, 0.3)'

    // Start
    window.addEventListener("mousemove", onMouseMove)
    rafID = requestAnimationFrame(render)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      cancelAnimationFrame(rafID)
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
        transition: 'transform 0.1s ease-out, background 0.2s ease, box-shadow 0.2s ease, width 0.2s ease, height 0.2s ease',
        backdropFilter: 'blur(1px)'
      }}
    />
  )
}
