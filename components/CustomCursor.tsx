'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Check for touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
    if (isTouchDevice) return

    const dot = dotRef.current
    const follower = followerRef.current
    if (!dot || !follower) return

    // Position state
    const mouse = { x: 0, y: 0 }
    const dotPos = { x: 0, y: 0 }
    const followerPos = { x: 0, y: 0 }

    let requestRef: number
    let hasMoved = false

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      
      if (!hasMoved) {
        hasMoved = true
        setIsInitialized(true)
        dotPos.x = mouse.x
        dotPos.y = mouse.y
        followerPos.x = mouse.x
        followerPos.y = mouse.y
        // Add class immediately on move
        document.documentElement.classList.add('cursor-active')
      }
    }

    // Also add it if we are already initialized (though hasMoved covers this)
    if (isInitialized) {
      document.documentElement.classList.add('cursor-active')
    }

    const animate = () => {
      dotPos.x += (mouse.x - dotPos.x) * 0.8
      dotPos.y += (mouse.y - dotPos.y) * 0.8
      followerPos.x += (mouse.x - followerPos.x) * 0.15
      followerPos.y += (mouse.y - followerPos.y) * 0.15

      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`
      follower.style.transform = `translate3d(${followerPos.x}px, ${followerPos.y}px, 0)`

      requestRef = requestAnimationFrame(animate)
    }

    const onEnter = () => {
      follower.classList.add('cursor-follower--focused')
      dot.classList.add('cursor-dot--focused')
    }
    const onExit = () => {
      follower.classList.remove('cursor-follower--focused')
      dot.classList.remove('cursor-dot--focused')
    }

    window.addEventListener('mousemove', onMove)
    
    const addHoverListeners = () => {
      document.querySelectorAll('a, button, [role="button"], input[type="submit"], .cursor-pointer').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onExit)
      })
    }

    addHoverListeners()
    requestRef = requestAnimationFrame(animate)

    const observer = new MutationObserver(() => addHoverListeners())
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(requestRef)
      observer.disconnect()
      document.documentElement.classList.remove('cursor-active')
    }
  }, [])

  if (typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window)) {
    return null
  }

  return (
    <div className={`cursor-wrapper ${isInitialized ? 'is-visible' : ''}`}>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={followerRef} className="cursor-follower">
        <div className="cursor-follower-inner" />
      </div>
    </div>
  )
}
