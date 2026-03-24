'use client'

import { useEffect, useRef } from 'react'

// Simple cursor with basic hover detection and color adaptation
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
    let currentColor = '#ff6a00' // Default to orange

    // Simple color detection
    const getCursorColor = (element: Element | null): string => {
      // Always use orange on navbar elements
      if (element?.closest('nav') || element?.closest('[class*="nav"]')) {
        return '#ff6a00' // Orange
      }
      
      // Check if hovering over dark/light areas
      const bg = getEffectiveBg(element)
      if (bg) {
        const lum = 0.299 * bg.r + 0.587 * bg.g + 0.114 * bg.b
        // Light background -> dark cursor, Dark background -> orange cursor
        return lum > 100 ? '#0d0d0d' : '#ff6a00'
      }
      
      return '#ff6a00' // Default to orange
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
      }

      // Update cursor color
      const newColor = getCursorColor(element)
      if (newColor !== currentColor) {
        currentColor = newColor
        cursor.style.backgroundColor = newColor
      }
    }

    // Simple position update
    const positionCursor = () => {
      cursor.style.transform = `translate(${mousePosition.x}px, ${mousePosition.y}px) translate(-50%, -50%)`
    }

    // Animation loop
    const render = () => {
      positionCursor()
      rafID = requestAnimationFrame(render)
    }

    // Initialize cursor color
    cursor.style.backgroundColor = currentColor

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
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: '#ff6a00',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        transition: 'background-color 0.15s ease'
      }}
    />
  )
}
