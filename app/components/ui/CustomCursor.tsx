'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dot    = useRef<HTMLDivElement>(null)
  const ring   = useRef<HTMLDivElement>(null)
  const mouse  = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const ring_  = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const raf    = useRef<number | undefined>(undefined)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dot.current) {
        dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)` 
      }
    }

    const animate = () => {
      ring_.current.x += (mouse.current.x - ring_.current.x) * 0.12
      ring_.current.y += (mouse.current.y - ring_.current.y) * 0.12
      if (ring.current) {
        ring.current.style.transform = `translate(${ring_.current.x}px, ${ring_.current.y}px)` 
      }
      raf.current = requestAnimationFrame(animate)
    }

    const onEnterLink = () => {
      ring.current?.classList.add('cursor-hover')
      dot.current?.classList.add('cursor-hover')
    }
    const onLeaveLink = () => {
      ring.current?.classList.remove('cursor-hover')
      dot.current?.classList.remove('cursor-hover')
    }

    window.addEventListener('mousemove', onMove)
    raf.current = requestAnimationFrame(animate)

    const attachHover = () => {
      document.querySelectorAll('a, button, [role="button"], article').forEach(el => {
        el.addEventListener('mouseenter', onEnterLink)
        el.addEventListener('mouseleave', onLeaveLink)
      })
    }
    attachHover()
    const observer = new MutationObserver(attachHover)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current!)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dot} style={{
        position: 'fixed', top: 0, left: 0, width: 6, height: 6,
        borderRadius: '50%', background: '#f97316', pointerEvents: 'none',
        zIndex: 99999, marginLeft: -3, marginTop: -3, willChange: 'transform',
        transition: 'width .2s, height .2s, background .2s'
      }} />
      <div ref={ring} style={{
        position: 'fixed', top: 0, left: 0, width: 32, height: 32,
        borderRadius: '50%', border: '1.5px solid rgba(249,115,22,0.6)',
        pointerEvents: 'none', zIndex: 99998, marginLeft: -16, marginTop: -16,
        willChange: 'transform', transition: 'width .2s, height .2s, border-color .2s'
      }} />
      <style>{`
        .cursor-hover div { width: 48px !important; height: 48px !important; }
        div[style*="border-radius: 50%"][style*="border"].cursor-hover {
          border-color: rgba(249,115,22,0.9) !important;
          width: 48px !important; height: 48px !important;
          margin-left: -24px !important; margin-top: -24px !important;
        }
      `}</style>
    </>
  )
}
