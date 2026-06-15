'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return
    if (window.matchMedia('(hover: none)').matches) return

    cursor.classList.add('cursor--initialized')

    const onMove = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      cursor.classList.remove('cursor--off-screen')
    }

    const onLeave = () => cursor.classList.add('cursor--off-screen')

    const onEnter = () => cursor.classList.add('cursor--focused')
    const onExit = () => cursor.classList.remove('cursor--focused')

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)

    const addHoverListeners = () => {
      document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onExit)
      })
    }

    addHoverListeners()

    // Re-run on route changes so new links get listeners
    const observer = new MutationObserver(addHoverListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
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
