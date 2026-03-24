'use client'

import { useEffect, useRef } from 'react'

// Simple cursor with inversion effect
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
    <>
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
        <defs>
          <filter id="cursor-invert">
            <feColorMatrix 
              type="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 -1 1"
              result="invert"
            />
            <feComposite in="SourceGraphic" in2="invert" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        ref={cursorRef}
        className="Cursor"
        style={{
          position: 'fixed',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'transparent',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.15s ease',
          filter: 'url(#cursor-invert)',
          backdropFilter: 'invert(100%)',
          WebkitBackdropFilter: 'invert(100%)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)'
        }}
      />
    </>
  )
}
