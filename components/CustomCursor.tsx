'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  
  const mouseRef = useRef({ x: -100, y: -100 })
  const dotPosRef = useRef({ x: -100, y: -100 })
  const followerPosRef = useRef({ x: -100, y: -100 })
  const initializedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      
      if (!initializedRef.current) {
        initializedRef.current = true
        // Set initial positions instantly to avoid laggy first appearance
        dotPosRef.current = { x: e.clientX, y: e.clientY }
        followerPosRef.current = { x: e.clientX, y: e.clientY }
        document.documentElement.setAttribute('data-cursor-active', 'true')
      }
    }

    const animate = () => {
      const dot = dotRef.current
      const follower = followerRef.current

      if (dot && follower && initializedRef.current) {
        const mouse = mouseRef.current
        const dotPos = dotPosRef.current
        const followerPos = followerPosRef.current

        // Smooth LERP (Linear Interpolation)
        dotPos.x += (mouse.x - dotPos.x) * 0.45
        dotPos.y += (mouse.y - dotPos.y) * 0.45
        followerPos.x += (mouse.x - followerPos.x) * 0.12
        followerPos.y += (mouse.y - followerPos.y) * 0.12

        dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`
        follower.style.transform = `translate3d(${followerPos.x}px, ${followerPos.y}px, 0)`
      }

      requestAnimationFrame(animate)
    }

    const onEnter = () => document.body.setAttribute('data-cursor-hover', 'true')
    const onExit = () => document.body.removeAttribute('data-cursor-hover')

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onEnter)
    window.addEventListener('mouseup', onExit)
    
    const updateListeners = () => {
      const targets = document.querySelectorAll('a, button, [role="button"], input[type="submit"], .cursor-pointer')
      targets.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onExit)
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onExit)
      })
    }

    updateListeners()
    const rafId = requestAnimationFrame(animate)
    const observer = new MutationObserver(updateListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onEnter)
      window.removeEventListener('mouseup', onExit)
      cancelAnimationFrame(rafId)
      observer.disconnect()
      document.documentElement.removeAttribute('data-cursor-active')
      document.body.removeAttribute('data-cursor-hover')
    }
  }, [])

  return (
    <>
      <div 
        ref={dotRef} 
        className="cursor-dot-v4" 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          pointerEvents: 'none', 
          zIndex: 2147483647,
          willChange: 'transform'
        }} 
      />
      <div 
        ref={followerRef} 
        className="cursor-follower-v4" 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          pointerEvents: 'none', 
          zIndex: 2147483646,
          willChange: 'transform'
        }} 
      />
    </>
  )
}
