'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    // Don't show on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return
    }

    cursor.classList.add('cursor--initialized')
    document.documentElement.classList.add('cursor-active')

    let requestRef: number

    const onMove = (e: MouseEvent) => {
      if (requestRef) cancelAnimationFrame(requestRef)
      
      requestRef = requestAnimationFrame(() => {
        if (cursor) {
          cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
          cursor.classList.remove('cursor--off-screen')
        }
      })
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

    // Re-run on route changes so new links get listeners
    const observer = new MutationObserver(() => {
      addHoverListeners()
    })
    
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      if (requestRef) cancelAnimationFrame(requestRef)
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={cursorRef} className="cursor">
      <div className="cursor-border">
        <span className="text">VIEW</span>
      </div>
    </div>
  )
}
