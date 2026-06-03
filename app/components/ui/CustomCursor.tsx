'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dot  = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const mx   = useRef(0)
  const my   = useRef(0)
  const rx   = useRef(0)
  const ry   = useRef(0)
  const raf  = useRef<number | undefined>(undefined)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mx.current = e.clientX
      my.current = e.clientY
      if (dot.current) {
        dot.current.style.left = e.clientX + 'px'
        dot.current.style.top  = e.clientY + 'px'
      }
    }

    const tick = () => {
      rx.current += (mx.current - rx.current) * 0.1
      ry.current += (my.current - ry.current) * 0.1
      if (ring.current) {
        ring.current.style.left = rx.current + 'px'
        ring.current.style.top  = ry.current + 'px'
      }
      raf.current = requestAnimationFrame(tick)
    }

    const grow = () => {
      dot.current?.classList.add('vc-dot-hover')
      ring.current?.classList.add('vc-ring-hover')
    }
    const shrink = () => {
      dot.current?.classList.remove('vc-dot-hover')
      ring.current?.classList.remove('vc-ring-hover')
    }

    const bindHover = () => {
      document.querySelectorAll('a, button, [role="button"], article').forEach(el => {
        el.addEventListener('mouseenter', grow)
        el.addEventListener('mouseleave', shrink)
      })
    }

    window.addEventListener('mousemove', move)
    raf.current = requestAnimationFrame(tick)
    bindHover()

    const obs = new MutationObserver(bindHover)
    obs.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf.current!)
      obs.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dot}  className="vc-dot" />
      <div ref={ring} className="vc-ring" />
    </>
  )
}
