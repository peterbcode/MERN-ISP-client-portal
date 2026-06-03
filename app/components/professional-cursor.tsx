'use client'

import { useEffect, useRef, useState } from 'react'

type CursorMode = 'default' | 'action' | 'gallery' | 'hidden'

const hiddenTargets =
  'input, textarea, select, [contenteditable="true"], [data-cursor="native"]'

const actionTargets =
  'a[href], button:not(:disabled), [role="button"], summary, input[type="button"], input[type="submit"], input[type="reset"]'

export default function ProfessionalCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const position = useRef({ x: 0, y: 0 })
  const ringPosition = useRef({ x: 0, y: 0 })
  const frame = useRef<number | null>(null)
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<CursorMode>('default')

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)')
    const coarsePointer = window.matchMedia('(pointer: coarse)')
    const shouldEnable = finePointer.matches && !coarsePointer.matches

    if (!shouldEnable) return

    setEnabled(true)
    document.body.classList.add('cursor-enhanced')

    const animate = () => {
      ringPosition.current.x += (position.current.x - ringPosition.current.x) * 0.22
      ringPosition.current.y += (position.current.y - ringPosition.current.y) * 0.22

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0) translate(-50%, -50%)`
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPosition.current.x}px, ${ringPosition.current.y}px, 0) translate(-50%, -50%)`
      }

      frame.current = window.requestAnimationFrame(animate)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return

      position.current = { x: event.clientX, y: event.clientY }
      setVisible(true)

      const target = event.target instanceof Element ? event.target : null

      if (target?.closest(hiddenTargets)) {
        setMode('hidden')
      } else if (target?.closest('[data-cursor="gallery"]')) {
        setMode('gallery')
      } else if (target?.closest(actionTargets)) {
        setMode('action')
      } else {
        setMode('default')
      }
    }

    const onPointerLeave = () => setVisible(false)
    const onPointerDown = () => document.body.classList.add('cursor-pressed')
    const onPointerUp = () => document.body.classList.remove('cursor-pressed')

    frame.current = window.requestAnimationFrame(animate)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      document.body.classList.remove('cursor-enhanced', 'cursor-pressed')
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)

      if (frame.current) {
        window.cancelAnimationFrame(frame.current)
      }
    }
  }, [])

  if (!enabled) return null

  const isHidden = !visible || mode === 'hidden'

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`professional-cursor professional-cursor__ring professional-cursor--${mode} ${
          isHidden ? 'professional-cursor--hidden' : ''
        }`}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`professional-cursor professional-cursor__dot professional-cursor--${mode} ${
          isHidden ? 'professional-cursor--hidden' : ''
        }`}
      />
    </>
  )
}
