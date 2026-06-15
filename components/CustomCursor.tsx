'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Basic mobile/touch check
    if (typeof window !== 'undefined' && 
        (window.matchMedia('(pointer: coarse)').matches || 
         'ontouchstart' in window)) {
      return
    }

    const cursor = cursorRef.current
    if (!cursor) return

    let requestRef: number
    let mouseX = 0
    let mouseY = 0

    const updatePosition = () => {
      if (cursor) {
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }
      requestRef = requestAnimationFrame(updatePosition)
    }

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!isInitialized) {
        setIsInitialized(true)
        document.documentElement.classList.add('cursor-active')
      }
      cursor.classList.remove('cursor--off-screen')
    }

    const onLeave = () => cursor.classList.add('cursor--off-screen')
    const onEnter = () => cursor.classList.add('cursor--focused')
    const onExit = () => cursor.classList.remove('cursor--focused')

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)

    const addHoverListeners = () => {
      document.querySelectorAll('a, button, [role="button"], input[type="submit"], input[type="button"]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onExit)
      })
    }

    addHoverListeners()
    requestRef = requestAnimationFrame(updatePosition)

    const observer = new MutationObserver(() => addHoverListeners())
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(requestRef)
      observer.disconnect()
      document.documentElement.classList.remove('cursor-active')
    }
  }, [isInitialized])

  return (
    <div 
      ref={cursorRef} 
      className={`cursor ${isInitialized ? 'cursor--initialized' : ''}`}
      style={{ display: isInitialized ? 'block' : 'none' }}
    >
      <div className="cursor-border">
        <span className="text">VIEW</span>
      </div>
    </div>
  )
}
