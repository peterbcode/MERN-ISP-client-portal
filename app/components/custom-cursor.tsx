'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const [isError, setIsError] = useState(false)
  
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const circleX = useRef(0)
  const circleY = useRef(0)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    // Check if device has a fine pointer (mouse/trackpad)
    const finePointer = window.matchMedia('(pointer: fine)')
    if (!finePointer.matches) {
      setIsError(true)
      return
    }

    const cursor = cursorRef.current
    const dot = dotRef.current
    const circle = circleRef.current
    const label = labelRef.current

    if (!cursor || !dot || !circle) {
      setIsError(true)
      return
    }

    try {
      // Lerp factor for smooth trailing
      const lerpFactor = 0.12

      // Animation loop
      const animate = () => {
        circleX.current += (mouseX.current - circleX.current) * lerpFactor
        circleY.current += (mouseY.current - circleY.current) * lerpFactor

        // Update dot position (instant)
        dot.style.transform = `translate(${mouseX.current}px, ${mouseY.current}px) translate(-50%, -50%)`

        // Update circle position (smooth lag)
        circle.style.transform = `translate(${circleX.current}px, ${circleY.current}px) translate(-50%, -50%)`

        // Update label position
        if (label) {
          label.style.transform = `translate(${circleX.current}px, ${circleY.current}px) translate(-50%, -50%)`
        }

        rafId.current = requestAnimationFrame(animate)
      }

      // Start animation loop
      rafId.current = requestAnimationFrame(animate)

      // Track mouse position
      const onMouseMove = (e: MouseEvent) => {
        mouseX.current = e.clientX
        mouseY.current = e.clientY
      }

      // Handle hover state
      const onMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        const isInteractive = target.matches('a, button') || 
                             target.closest('a, button') ||
                             target.classList.contains('cursor-hover') ||
                             target.closest('.cursor-hover') ||
                             target.dataset.cursor === 'hover' ||
                             target.closest('[data-cursor="hover"]')

        if (isInteractive) {
          cursor?.classList.add('cursor--hover')
          
          // Get label from data-cursor-label attribute
          const labelAttr = target.dataset.cursorLabel || 
                           (target.closest('[data-cursor-label]') as HTMLElement)?.dataset.cursorLabel
          if (label && labelAttr) {
            label.textContent = labelAttr
            label.classList.add('cursor__label--visible')
          }
        }
      }

      const onMouseOut = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        const isInteractive = target.matches('a, button') || 
                             target.closest('a, button') ||
                             target.classList.contains('cursor-hover') ||
                             target.closest('.cursor-hover') ||
                             target.dataset.cursor === 'hover' ||
                             target.closest('[data-cursor="hover"]')

        if (isInteractive) {
          cursor?.classList.remove('cursor--hover')
          label?.classList.remove('cursor__label--visible')
        }
      }

      // Handle click state
      const onMouseDown = () => {
        cursor?.classList.add('cursor--click')
      }

      const onMouseUp = () => {
        cursor?.classList.remove('cursor--click')
      }

      // Add event listeners
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseover', onMouseOver)
      document.addEventListener('mouseout', onMouseOut)
      document.addEventListener('mousedown', onMouseDown)
      document.addEventListener('mouseup', onMouseUp)

      // Cleanup
      return () => {
        if (rafId.current) {
          cancelAnimationFrame(rafId.current)
        }
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseover', onMouseOver)
        document.removeEventListener('mouseout', onMouseOut)
        document.removeEventListener('mousedown', onMouseDown)
        document.removeEventListener('mouseup', onMouseUp)
        // Remove cursor-active class on cleanup
        document.body.classList.remove('cursor-active')
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
    <div ref={cursorRef} className="custom-cursor">
      <div ref={dotRef} className="custom-cursor__dot" />
      <div ref={circleRef} className="custom-cursor__circle" />
      <div ref={labelRef} className="custom-cursor__label" />
    </div>
  )
}
