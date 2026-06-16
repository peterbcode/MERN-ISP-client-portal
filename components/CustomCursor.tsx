'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Check if device is mobile/touch based on pointer capability
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    const isSmallScreen = window.innerWidth <= 768
    
    if (isTouchDevice || isSmallScreen) return

    const cursor = cursorRef.current
    const dot = dotRef.current
    if (!cursor || !dot) return

    let mouseX = -100
    let mouseY = -100
    let currentX = -100
    let currentY = -100

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!visible) setVisible(true)
    }

    const updatePosition = () => {
      // Smooth interpolation (optional, set to 1 for instant follow)
      // Using 0.2 for the outer circle gives a premium "lazy" follow effect
      // Using 1 for the dot ensures it stays locked to the actual cursor
      
      // Update dot (Instant)
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
      
      // Update outer circle (Smooth interpolation)
      currentX += (mouseX - currentX) * 0.2
      currentY += (mouseY - currentY) * 0.2
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`

      requestAnimationFrame(updatePosition)
    }

    window.addEventListener('mousemove', onMove)
    const rafId = requestAnimationFrame(updatePosition)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [visible])

  return (
    <>
      {/* OUTER CIRCLE - High visibility Orange */}
      <div 
        ref={cursorRef}
        data-custom-cursor="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '40px',
          height: '40px',
          border: '2px solid #f97316',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 2147483646,
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          display: visible ? 'block' : 'none',
          willChange: 'transform',
          transition: 'opacity 0.3s ease',
          opacity: visible ? 1 : 0
        }} 
      />
      {/* INNER DOT - Solid Orange */}
      <div 
        ref={dotRef}
        data-custom-cursor="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          backgroundColor: '#f97316',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 2147483647,
          display: visible ? 'block' : 'none',
          willChange: 'transform',
          transition: 'opacity 0.3s ease',
          opacity: visible ? 1 : 0
        }} 
      />
    </>
  )
}
