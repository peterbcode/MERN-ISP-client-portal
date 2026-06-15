'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Check for touch device - modern professional cursors usually hide on touch
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
    if (isTouchDevice) return

    const mouse = { x: 0, y: 0 }
    const dotPos = { x: 0, y: 0 }
    const followerPos = { x: 0, y: 0 }
    let rafId: number
    let hasMoved = false

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      
      if (!hasMoved) {
        hasMoved = true
        dotPos.x = mouse.x
        dotPos.y = mouse.y
        followerPos.x = mouse.x
        followerPos.y = mouse.y
        setIsReady(true)
        document.documentElement.classList.add('cursor-active')
      }
    }

    const animate = () => {
      const dot = dotRef.current
      const follower = followerRef.current

      if (dot && follower && hasMoved) {
        // Smooth interpolation
        dotPos.x += (mouse.x - dotPos.x) * 0.4
        dotPos.y += (mouse.y - dotPos.y) * 0.4
        followerPos.x += (mouse.x - followerPos.x) * 0.15
        followerPos.y += (mouse.y - followerPos.y) * 0.15

        dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`
        follower.style.transform = `translate3d(${followerPos.x}px, ${followerPos.y}px, 0)`
      }

      rafId = requestAnimationFrame(animate)
    }

    const onEnter = () => {
      document.body.classList.add('cursor-hover')
    }
    const onExit = () => {
      document.body.classList.remove('cursor-hover')
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onEnter)
    window.addEventListener('mouseup', onExit)
    
    const addHoverListeners = () => {
      const targets = document.querySelectorAll('a, button, [role="button"], input[type="submit"], .cursor-pointer, .hover-target')
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
      document.documentElement.classList.remove('cursor-active')
      document.body.classList.remove('cursor-hover')
    }
  }, [])

  if (typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window)) {
    return null
  }

  return (
    <div className={`cursor-container ${isReady ? 'is-ready' : ''}`}>
      <div ref={dotRef} className="cursor-dot-v2" />
      <div ref={followerRef} className="cursor-follower-v2" />
    </div>
  )
}
