'use client'

import { useEffect, useRef } from 'react'

// Smart goo cursor:
// - Reads the bg color under the cursor → black on light/orange, orange on dark
// - On interactive elements (links, buttons) → shrinks + goes semi-transparent so user can see what they're clicking

const INTERACTIVE =
  "a, button, input, textarea, select, label, [role='button'], [tabindex], [onclick]";

export default function MorphCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Disable cursor on touch devices to improve performance
    if ('ontouchstart' in window) return

    const cursor = cursorRef.current
    if (!cursor) return
    
    // Add required classes for cursor visibility
    document.body.classList.add('custom-cursor-enabled')
    cursor.classList.add('Cursor')

    const AMOUNT = 12 // Reduced from 20 for better performance
    const SINE_DOTS = Math.floor(AMOUNT * 0.3)
    const DOT_SIZE = 20 // Reduced from 26
    const IDLE_TIMEOUT = 150

    const COLOR_DARK    = "#0d0d0d"; // on light/orange backgrounds
    const COLOR_ORANGE  = "#ff6a00"; // on dark backgrounds

    let mousePosition = { x: 0, y: 0 } 
    let dots: Dot[] = []
    let timeoutID: ReturnType<typeof setTimeout>
    let idle = false
    let rafID: number
    let isHoveringInteractive = false
    let currentColor = COLOR_DARK
    let lastSampleTime = 0
    const SAMPLE_THROTTLE = 50 // Throttle color sampling to every 50ms

    // ── Color utils ───────────────────────────────────────────────────────────
    function getLuminance(r: number, g: number, b: number) {
      return 0.299 * r + 0.587 * g + 0.114 * b
    }

    // Walk up DOM from element to find first non-transparent background
    function getEffectiveBg(el: Element | null): { r: number; g: number; b: number } | null {
      let node = el
      while (node && node !== document.body) {
        const bg = window.getComputedStyle(node as Element).backgroundColor
        const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
        if (match) {
          const alpha = match[4] !== undefined ? parseFloat(match[4]) : 1
          if (alpha > 0.05) {
            return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) }
          }
        }
        node = (node as Element).parentElement
      }
      // Fall back to body bg
      const bodyBg = window.getComputedStyle(document.body).backgroundColor
      const m = bodyBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
      if (m) return { r: parseInt(m[1]), g: parseInt(m[2]), b: parseInt(m[3]) }
      return null
    }

    function colorForBg(r: number, g: number, b: number, element?: Element | null): string {
      const lum = getLuminance(r, g, b)
      // Orange hue range (approx): high red, mid green, low blue
      const isOrangish = r > 180 && g > 60 && g < 160 && b < 80
      
      // Special case: always use orange cursor on navbar elements
      const isNavbar = element?.closest('nav') || element?.closest('[class*="navbar"]') || element?.closest('[class*="nav"]')
      if (isNavbar) {
        return COLOR_ORANGE
      }
      
      // Light or orange bg → use dark cursor; dark bg → use orange cursor
      return (lum > 100 || isOrangish) ? COLOR_DARK : COLOR_ORANGE
    }

    // ── Dot class ─────────────────────────────────────────────────────────────
    class Dot {
      index: number
      anglespeed: number
      x: number
      y: number
      scale: number
      baseScale: number
      range: number
      lockX: number
      lockY: number
      angleX: number
      angleY: number
      element: HTMLSpanElement

      constructor(index = 0) {
        this.index = index
        this.anglespeed = 0.05
        this.x = 0
        this.y = 0
        this.baseScale = 1 - 0.05 * index
        this.scale = this.baseScale
        this.range = DOT_SIZE / 2 - (DOT_SIZE / 2) * this.baseScale + 2
        this.lockX = 0
        this.lockY = 0
        this.angleX = 0
        this.angleY = 0
        this.element = document.createElement("span")
        this.element.style.cssText = `
          position: absolute;
          display: block;
          width: ${DOT_SIZE}px;
          height: ${DOT_SIZE}px;
          border-radius: 50%;
          background-color: ${COLOR_DARK};
          transform-origin: center center;
          transform: translate(-50%, -50%) scale(${this.baseScale});
          transition: background-color 0.15s ease, opacity 0.15s ease;
          will-change: transform;
          pointer-events: none;
        `
        cursor!.appendChild(this.element)
      }

      setColor(color: string) {
        this.element.style.backgroundColor = color
      }

      setInteractive(on: boolean) {
        // On interactive: make slightly transparent so text underneath is visible
        this.element.style.opacity = on ? "0.7" : "1";
      }

      lock() {
        this.lockX = this.x
        this.lockY = this.y
        this.angleX = Math.PI * 2 * Math.random()
        this.angleY = Math.PI * 2 * Math.random()
      }

      draw() {
        if (!idle || this.index <= SINE_DOTS) {
          this.element.style.transform = `translate(${this.x}px, ${this.y}px) translate(-50%, -50%) scale(${this.baseScale})`
        } else {
          this.angleX += this.anglespeed
          this.angleY += this.anglespeed
          this.y = this.lockY + Math.sin(this.angleY) * this.range
          this.x = this.lockX + Math.sin(this.angleX) * this.range
          this.element.style.transform = `translate(${this.x}px, ${this.y}px) translate(-50%, -50%) scale(${this.baseScale})`
        }
      }
    }

    // ── Apply color to all dots ───────────────────────────────────────────────
    function applyColor(color: string) {
      if (color === currentColor) return
      currentColor = color
      dots.forEach((d) => d.setColor(color))
    }

    function applyInteractive(on: boolean) {
      if (on === isHoveringInteractive) return
      isHoveringInteractive = on
      dots.forEach((d) => d.setInteractive(on))
    }

    // ── Sample bg color at mouse position ────────────────────────────────────
    function sampleColor() {
      const now = Date.now()
      if (now - lastSampleTime < SAMPLE_THROTTLE) return // Throttle sampling
      lastSampleTime = now

      const el = document.elementFromPoint(
        mousePosition.x + DOT_SIZE / 2,
        mousePosition.y + DOT_SIZE / 2
      )
      if (!el || el === cursor) return
      const bg = getEffectiveBg(el)
      if (bg) applyColor(colorForBg(bg.r, bg.g, bg.b, el))

      // Interactive check
      const interactive = !!(el as Element).closest?.(INTERACTIVE)
      applyInteractive(interactive)
    }

    // ── Idle ──────────────────────────────────────────────────────────────────
    function startIdleTimer() {
      idle = false
      timeoutID = setTimeout(() => {
        idle = true
        dots.forEach((d) => d.lock())
      }, IDLE_TIMEOUT)
    }

    function resetIdleTimer() {
      clearTimeout(timeoutID)
      startIdleTimer()
    }

    // ── Mouse / touch ─────────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mousePosition.x = e.clientX - DOT_SIZE / 2
      mousePosition.y = e.clientY - DOT_SIZE / 2
      resetIdleTimer()
    }

    const onTouchMove = (e: TouchEvent) => {
      mousePosition.x = e.touches[0].clientX - DOT_SIZE / 2
      mousePosition.y = e.touches[0].clientY - DOT_SIZE / 2
      resetIdleTimer()
    }

    // ── Render loop ───────────────────────────────────────────────────────────
    const positionCursor = () => {
      sampleColor()
      let x = mousePosition.x
      let y = mousePosition.y
      dots.forEach((dot, index, arr) => {
        const next = arr[index + 1] || arr[0]
        dot.x = x
        dot.y = y
        dot.draw()
        if (!idle || index <= SINE_DOTS) {
          x += (next.x - dot.x) * 0.35
          y += (next.y - dot.y) * 0.35
        }
      })
    }

    const render = () => {
      positionCursor()
      rafID = requestAnimationFrame(render)
    }

    // ── Init ──────────────────────────────────────────────────────────────────
    for (let i = 0; i < AMOUNT; i++) dots.push(new Dot(i))

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("touchmove", onTouchMove)
    rafID = requestAnimationFrame(render)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("touchmove", onTouchMove)
      clearTimeout(timeoutID)
      cancelAnimationFrame(rafID)
      while (cursor.firstChild) cursor.removeChild(cursor.firstChild)
      dots = []
      // Clean up classes
      document.body.classList.remove('custom-cursor-enabled')
      cursor.classList.remove('Cursor')
    }
  }, [])

  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -15"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        ref={cursorRef}
        className="Cursor"
      />
    </>
  )
}
