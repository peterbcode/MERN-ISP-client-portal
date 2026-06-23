'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function ShapeCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const shape1Ref = useRef<HTMLDivElement>(null)
  const shape2Ref = useRef<HTMLDivElement>(null)
  const shape3Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if device is mobile/touch based
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    const isSmallScreen = window.innerWidth <= 768
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (isTouchDevice || isSmallScreen || prefersReducedMotion) {
      return
    }

    const cursor = cursorRef.current
    const shape1 = shape1Ref.current
    const shape2 = shape2Ref.current
    const shape3 = shape3Ref.current

    if (!cursor || !shape1 || !shape2 || !shape3) return

    const onMouseMove = (evt: MouseEvent) => {
      const mouseX = evt.clientX
      const mouseY = evt.clientY
      
      gsap.set(cursor, {
        x: mouseX,
        y: mouseY
      })
      
      gsap.to([shape1, shape2, shape3], {
        x: mouseX,
        y: mouseY,
        stagger: -0.1,
        duration: 0.5,
        ease: 'power2.out'
      })
    }

    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <>
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className="cursor fixed pointer-events-none z-[2147483647] w-4 h-4 rounded-full bg-[#ff6600]"
        style={{
          transform: 'translate(-50%, -50%)',
          willChange: 'transform'
        }}
      />

      {/* Shape 1 - Largest */}
      <div
        ref={shape1Ref}
        className="shape shape-1 fixed pointer-events-none z-[2147483646] rounded-full bg-[#ff6600]"
        style={{
          width: '650px',
          height: '650px',
          margin: '-325px 0 0 -325px',
          willChange: 'transform'
        }}
      />

      {/* Shape 2 - Medium */}
      <div
        ref={shape2Ref}
        className="shape shape-2 fixed pointer-events-none z-[2147483646] rounded-full bg-[#ff8800]"
        style={{
          width: '440px',
          height: '440px',
          margin: '-220px 0 0 -220px',
          willChange: 'transform'
        }}
      />

      {/* Shape 3 - Smallest */}
      <div
        ref={shape3Ref}
        className="shape shape-3 fixed pointer-events-none z-[2147483646] rounded-full bg-[#ffaa33]"
        style={{
          width: '270px',
          height: '270px',
          margin: '-135px 0 0 -135px',
          willChange: 'transform'
        }}
      />
    </>
  )
}
