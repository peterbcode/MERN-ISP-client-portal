'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isError, setIsError] = useState(false)
  
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const dotX = useRef(0)
  const dotY = useRef(0)
  const rafId = useRef<number | null>(null)
  const lastMouseX = useRef(0)
  const lastMouseY = useRef(0)
  const lastTime = useRef(0)
  const velocity = useRef(0)

  useEffect(() => {
    // Check if device has a fine pointer (mouse/trackpad)
    const finePointer = window.matchMedia('(pointer: fine)')
    if (!finePointer.matches) {
      setIsError(true)
      return
    }

    const dot = dotRef.current

    if (!dot) {
      setIsError(true)
      return
    }

    // Fade in on load
    setTimeout(() => setIsVisible(true), 100)

    try {
      // Lerp factor for smooth trailing (0.15 for fluid lag)
      const lerpFactor = 0.15

      // Animation loop
      const animate = (timestamp: number) => {
        // Calculate velocity for scale effect
        const timeDelta = timestamp - lastTime.current
        if (timeDelta > 0) {
          const dx = mouseX.current - lastMouseX.current
          const dy = mouseY.current - lastMouseY.current
          const distance = Math.sqrt(dx * dx + dy * dy)
          velocity.current = distance / timeDelta
        }

        // Smooth interpolation
        dotX.current += (mouseX.current - dotX.current) * lerpFactor
        dotY.current += (mouseY.current - dotY.current) * lerpFactor

        // Scale based on velocity (faster = larger)
        const scale = 1 + Math.min(velocity.current * 0.02, 0.5)
        
        // Update dot position with scale
        dot.style.transform = `translate(${dotX.current}px, ${dotY.current}px) translate(-50%, -50%) scale(${scale})`

        // Decay velocity
        velocity.current *= 0.9

        lastMouseX.current = mouseX.current
        lastMouseY.current = mouseY.current
        lastTime.current = timestamp

        rafId.current = requestAnimationFrame(animate)
      }

      // Start animation loop
      rafId.current = requestAnimationFrame(animate)

      // Track mouse position
      const onMouseMove = (e: MouseEvent) => {
        mouseX.current = e.clientX
        mouseY.current = e.clientY
      }

      // Add event listeners
      document.addEventListener('mousemove', onMouseMove)

      // Cleanup
      return () => {
        if (rafId.current) {
          cancelAnimationFrame(rafId.current)
        }
        document.removeEventListener('mousemove', onMouseMove)
      }
    } catch (error) {
      console.error('Custom cursor error:', error)
      setIsError(true)
    }
  }, [])

  // If there's an error, don't render the custom cursor
  if (isError) {
    return null
  }

  return (
    <div 
      ref={dotRef} 
      className="cursor-dot"
      style={{ opacity: isVisible ? 1 : 0 }}
    />
  )
}
