'use client'

import { useEffect } from 'react'

class Dot {
  index: number
  anglespeed: number
  x: number
  y: number
  scale: number
  range: number
  element: HTMLSpanElement
  lockX: number
  lockY: number
  angleX: number
  angleY: number

  constructor(index: number, width: number, cursor: HTMLElement) {
    this.index = index
    this.anglespeed = 0.05
    this.x = 0
    this.y = 0
    this.scale = 1 - 0.05 * index
    this.range = width / 2 - (width / 2) * this.scale + 2
    this.element = document.createElement('span')
    this.element.style.transform = `translate3d(0px,0px,0) scale(${this.scale})`
    cursor.appendChild(this.element)
    this.lockX = 0
    this.lockY = 0
    this.angleX = 0
    this.angleY = 0
  }

  lock() {
    this.lockX = this.x
    this.lockY = this.y
    this.angleX = Math.PI * 2 * Math.random()
    this.angleY = Math.PI * 2 * Math.random()
  }

  draw(idle: boolean, sineDots: number) {
    if (!idle || this.index <= sineDots) {
      this.element.style.transform = `translate3d(${this.x}px,${this.y}px,0) scale(${this.scale})`
      return
    }

    this.angleX += this.anglespeed
    this.angleY += this.anglespeed
    this.y = this.lockY + Math.sin(this.angleY) * this.range
    this.x = this.lockX + Math.sin(this.angleX) * this.range
    this.element.style.transform = `translate3d(${this.x}px,${this.y}px,0) scale(${this.scale})`
  }
}

const CustomCursor = () => {
  useEffect(() => {
    const supportsCustomCursor = window.matchMedia('(any-pointer: fine)').matches
    const cursor = document.getElementById('cursor')

    if (!supportsCustomCursor || !cursor) {
      document.body.classList.add('no-custom-cursor')
      return
    }

    document.body.classList.add('custom-cursor-enabled')
    document.documentElement.classList.add('has-custom-cursor')

    const amount = 12
    const sineDots = Math.floor(amount * 0.3)
    const width = 26
    const idleTimeout = 150

    const mousePosition = { x: 0, y: 0 }
    const dots: Dot[] = []
    let timeoutID: ReturnType<typeof setTimeout> | null = null
    let idle = false
    let frameId = 0

    const startIdleTimer = () => {
      timeoutID = setTimeout(() => {
        idle = true
        for (const dot of dots) dot.lock()
      }, idleTimeout)
      idle = false
    }

    const resetIdleTimer = () => {
      if (timeoutID) clearTimeout(timeoutID)
      startIdleTimer()
    }

    const buildDots = () => {
      for (let i = 0; i < amount; i += 1) {
        dots.push(new Dot(i, width, cursor))
      }
    }

    const positionCursor = () => {
      let x = mousePosition.x
      let y = mousePosition.y

      for (let i = 0; i < dots.length; i += 1) {
        const dot = dots[i]
        const nextDot = dots[i + 1] || dots[0]
        dot.x = x
        dot.y = y
        dot.draw(idle, sineDots)

        if (!idle || i <= sineDots) {
          x += (nextDot.x - dot.x) * 0.35
          y += (nextDot.y - dot.y) * 0.35
        }
      }
    }

    const render = () => {
      positionCursor()
      frameId = window.requestAnimationFrame(render)
    }

    const onMouseMove = (event: MouseEvent) => {
      mousePosition.x = event.clientX - width / 2
      mousePosition.y = event.clientY - width / 2
      resetIdleTimer()
    }

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return
      mousePosition.x = touch.clientX - width / 2
      mousePosition.y = touch.clientY - width / 2
      resetIdleTimer()
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    buildDots()
    startIdleTimer()
    render()

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      if (timeoutID) clearTimeout(timeoutID)
      window.cancelAnimationFrame(frameId)
      if (cursor) cursor.innerHTML = ''
      document.body.classList.remove('custom-cursor-enabled')
      document.body.classList.remove('no-custom-cursor')
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <>
      <svg id="cursorFilter" aria-hidden="true">
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
      <div id="cursor" className="Cursor" />
    </>
  )
}

export default CustomCursor
