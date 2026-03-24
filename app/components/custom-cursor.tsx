'use client'

import { useEffect, useRef } from 'react'

// Water/Liquid cursor with fluid animations
export default function MorphCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement[]>([])

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

    // Create water droplets
    const createDroplets = () => {
      for (let i = 0; i < 8; i++) {
        const droplet = document.createElement('div')
        droplet.className = 'water-droplet'
        droplet.style.cssText = `
          position: absolute;
          width: ${8 + i * 2}px;
          height: ${8 + i * 2}px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(249, 115, 22, 0.8), rgba(249, 115, 22, 0.2));
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          filter: blur(0.5px);
          opacity: ${0.6 - i * 0.05};
        `
        cursor.appendChild(droplet)
        dotsRef.current.push(droplet)
      }
    }

    // Simple mouse move handler with liquid physics
    const onMouseMove = (e: MouseEvent) => {
      mousePosition.x = e.clientX
      mousePosition.y = e.clientY
      
      // Check for hover on interactive elements
      const element = document.elementFromPoint(e.clientX, e.clientY)
      const interactive = !!(element as Element)?.closest?.('a, button, input, textarea, select, label, [role="button"], [tabindex], [onclick]')
      
      if (interactive !== isHoveringInteractive) {
        isHoveringInteractive = interactive
        cursor.classList.toggle('Cursor--interactive', interactive)
        
        // Water ripple effect on interactive elements
        if (interactive) {
          dotsRef.current.forEach((droplet, i) => {
            droplet.style.transform = `translate(-50%, -50%) scale(${1.2 + i * 0.1})`
            droplet.style.opacity = `${0.8 - i * 0.05}`
          })
        } else {
          dotsRef.current.forEach((droplet, i) => {
            droplet.style.transform = `translate(-50%, -50%) scale(1)`
            droplet.style.opacity = `${0.6 - i * 0.05}`
          })
        }
      }

      // Create ripple effect on movement
      if (Math.random() > 0.9) {
        const ripple = document.createElement('div')
        ripple.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(249, 115, 22, 0.6);
          pointer-events: none;
          transform: translate(-50%, -50%);
          animation: ripple 1s ease-out forwards;
        `
        cursor.appendChild(ripple)
        setTimeout(() => ripple.remove(), 1000)
      }
    }

    // Liquid physics for droplets
    const updateDroplets = () => {
      const baseX = mousePosition.x
      const baseY = mousePosition.y
      
      dotsRef.current.forEach((droplet, i) => {
        const delay = i * 0.05
        const offsetX = Math.sin(Date.now() * 0.001 + delay) * (i * 2)
        const offsetY = Math.cos(Date.now() * 0.001 + delay) * (i * 2)
        
        droplet.style.left = `${baseX + offsetX}px`
        droplet.style.top = `${baseY + offsetY}px`
      })
    }

    // Animation loop
    const render = () => {
      updateDroplets()
      rafID = requestAnimationFrame(render)
    }

    // Add ripple animation
    const style = document.createElement('style')
    style.textContent = `
      @keyframes ripple {
        0% {
          width: 4px;
          height: 4px;
          opacity: 0.6;
        }
        100% {
          width: 20px;
          height: 20px;
          opacity: 0;
        }
      }
      
      .Cursor--interactive .water-droplet {
        background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(249, 115, 22, 0.3)) !important;
        filter: blur(1px);
      }
    `
    document.head.appendChild(style)

    // Initialize
    createDroplets()
    window.addEventListener("mousemove", onMouseMove)
    rafID = requestAnimationFrame(render)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      cancelAnimationFrame(rafID)
      document.head.removeChild(style)
      // Clean up cursor
      while (cursor.firstChild) cursor.removeChild(cursor.firstChild)
      dotsRef.current = []
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
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)'
      }}
    />
  )
}
