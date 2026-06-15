'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Check for touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
    if (isTouchDevice) return

    const mouse = { x: -100, y: -100 }
    const dotPos = { x: -100, y: -100 }
    const followerPos = { x: -100, y: -100 }
    let rafId: number
    let moveCount = 0

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      
      moveCount++
      if (moveCount > 5 && !active) {
        setActive(true)
        dotPos.x = mouse.x
        dotPos.y = mouse.y
        followerPos.x = mouse.x
        followerPos.y = mouse.y
        document.documentElement.setAttribute('data-cursor-active', 'true')
      }
    }

    const animate = () => {
      const dot = dotRef.current
      const follower = followerRef.current

      if (dot && follower && moveCount > 5) {
        // Smooth interpolation
        dotPos.x += (mouse.x - dotPos.x) * 0.4
        dotPos.y += (mouse.y - dotPos.y) * 0.4
        followerPos.x += (mouse.x - followerPos.x) * 0.15
        followerPos.y += (mouse.y - followerPos.y) * 0.15

        dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`
        follower.style.transform = `translate3d(${followerPos.x}px, ${followerPos.y}px, 0)`
        
        // Ensure they are visible
        dot.style.opacity = '1'
        follower.style.opacity = '1'
      }

      rafId = requestAnimationFrame(animate)
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
    rafId = requestAnimationFrame(animate)

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
  }, [active])

  if (typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window)) {
    return null
  }

  return (
    <>
      <div 
        ref={dotRef} 
        className="cursor-dot-v3" 
        style={{ opacity: 0, position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 2147483647 }} 
      />
      <div 
        ref={followerRef} 
        className="cursor-follower-v3" 
        style={{ opacity: 0, position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 2147483646 }} 
      />
    </>
  )
}
