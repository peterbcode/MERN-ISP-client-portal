'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Check for touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
    if (isTouchDevice) return

    const mouse = { x: -100, y: -100 }
    const dotPos = { x: -100, y: -100 }
    const followerPos = { x: -100, y: -100 }
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
        document.documentElement.classList.add('cursor-active')
      }
    }

    const animate = () => {
      const dot = dotRef.current
      const follower = followerRef.current

      if (dot && follower && hasMoved) {
        // Linear interpolation for smoothness
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
      const dot = dotRef.current
      const follower = followerRef.current
      if (follower) follower.classList.add('is-hovering')
      if (dot) dot.classList.add('is-hovering')
    }
    const onExit = () => {
      const dot = dotRef.current
      const follower = followerRef.current
      if (follower) follower.classList.remove('is-hovering')
      if (dot) dot.classList.remove('is-hovering')
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onEnter)
    window.addEventListener('mouseup', onExit)
    
    const addHoverListeners = () => {
      document.querySelectorAll('a, button, [role="button"], input[type="submit"], .cursor-pointer').forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onExit)
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
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  )
}
