'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  
  // Use refs for values that shouldn't trigger re-renders or be reset by them
  const mouseRef = useRef({ x: -100, y: -100 })
  const dotPosRef = useRef({ x: -100, y: -100 })
  const followerPosRef = useRef({ x: -100, y: -100 })
  const moveCountRef = useRef(0)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const onMove = (e: MouseEvent) => {
      // Basic validation for mouse movement
      if (e.clientX === 0 && e.clientY === 0) return

      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      
      moveCountRef.current++
      
      // Confirm it's a real mouse and activate
      if (moveCountRef.current > 5 && !initializedRef.current) {
        initializedRef.current = true
        dotPosRef.current = { ...mouseRef.current }
        followerPosRef.current = { ...mouseRef.current }
        document.documentElement.setAttribute('data-cursor-active', 'true')
        
        // Show elements immediately
        if (dotRef.current) dotRef.current.style.opacity = '1'
        if (followerRef.current) followerRef.current.style.opacity = '1'
      }
    }

    const animate = () => {
      const dot = dotRef.current
      const follower = followerRef.current

      if (dot && follower && initializedRef.current) {
        const mouse = mouseRef.current
        const dotPos = dotPosRef.current
        const followerPos = followerPosRef.current

        // Smooth interpolation
        dotPos.x += (mouse.x - dotPos.x) * 0.4
        dotPos.y += (mouse.y - dotPos.y) * 0.4
        followerPos.x += (mouse.x - followerPos.x) * 0.15
        followerPos.y += (mouse.y - followerPos.y) * 0.15

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
    
    const addHoverListeners = () => {
      const targets = document.querySelectorAll('a, button, [role="button"], input[type="submit"], .cursor-pointer')
      targets.forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onExit)
      })
    }

    addHoverListeners()
    const rafId = requestAnimationFrame(animate)

    const observer = new MutationObserver(() => addHoverListeners())
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
  }, []) // Empty dependency array is critical - this effect must only run once

  return (
    <>
      <div 
        ref={dotRef} 
        className="cursor-dot-v3" 
        style={{ 
          opacity: 0, 
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
        className="cursor-follower-v3" 
        style={{ 
          opacity: 0, 
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
