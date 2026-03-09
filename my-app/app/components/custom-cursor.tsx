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
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const supportsCustomCursor = mediaQuery.matches
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
    let isDarkTone = false
    let currentLabel = ''
    let lastHoveredElement: Element | null = null
    let updateCounter = 0
    let lastMouseMoveTime = 0
    const mouseMoveThrottle = 16 // ~60fps

    const resolveBackgroundColor = (el: Element | null): string | null => {
      let current: Element | null = el
      while (current && current !== document.documentElement) {
        const bg = window.getComputedStyle(current).backgroundColor
        if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
          return bg
        }
        current = current.parentElement
      }
      return window.getComputedStyle(document.body).backgroundColor
    }

    const isLightColor = (color: string | null) => {
      if (!color) return false
      const match = color.match(/rgba?\(([^)]+)\)/)
      if (!match) return false
      const parts = match[1].split(',').map((part) => Number.parseFloat(part.trim()))
      const [r = 0, g = 0, b = 0, a = 1] = parts
      if (a === 0) return false
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b
      return luminance > 120
    }

    const isOrangeAccent = (color: string | null) => {
      if (!color) return false
      const match = color.match(/rgba?\(([^)]+)\)/)
      if (!match) return false
      const parts = match[1].split(',').map((part) => Number.parseFloat(part.trim()))
      const [r = 0, g = 0, b = 0, a = 1] = parts
      if (a === 0) return false
      // Detect orange-like brand accent tones (e.g. rgb(249,115,22)).
      return r >= 180 && g >= 70 && g <= 170 && b <= 90
    }

    const syncCursorTone = () => {
      // Throttle updates to every 5th frame for even better performance
      updateCounter++
      if (updateCounter % 5 !== 0) return
      
      // Add boundary checks to prevent errors
      if (mousePosition.x < 0 || mousePosition.y < 0 || 
          mousePosition.x > window.innerWidth || mousePosition.y > window.innerHeight) {
        // Reset states when cursor is outside viewport
        if (isDarkTone || currentLabel) {
          isDarkTone = false
          currentLabel = ''
          cursor.classList.remove('Cursor--dark')
          updateCursorLabel('')
        }
        return
      }
      
      const probeX = mousePosition.x + width / 2
      const probeY = mousePosition.y + width / 2
      
      // Ensure probe coordinates are within bounds
      if (probeX < 0 || probeY < 0 || probeX > window.innerWidth || probeY > window.innerHeight) {
        return
      }
      
      const hovered = document.elementFromPoint(probeX, probeY)
      
      // Only update if element changed
      if (hovered === lastHoveredElement) return
      lastHoveredElement = hovered
      
      if (!hovered) {
        // Reset to default when not hovering anything
        if (isDarkTone) {
          isDarkTone = false
          cursor.classList.remove('Cursor--dark')
        }
        if (currentLabel) {
          currentLabel = ''
          updateCursorLabel('')
        }
        return
      }
      
      // Batch all DOM reads together with error handling
      let computedStyle, textColor, bgColor
      try {
        computedStyle = window.getComputedStyle(hovered)
        textColor = computedStyle.color
        bgColor = resolveBackgroundColor(hovered)
      } catch (error) {
        // If we can't get styles, skip this frame
        return
      }
      
      const lightSurface = isLightColor(bgColor)
      const overOrangeText = isOrangeAccent(textColor)
      const shouldUseBlack = lightSurface || overOrangeText

      if (shouldUseBlack !== isDarkTone) {
        isDarkTone = shouldUseBlack
        cursor.classList.toggle('Cursor--dark', isDarkTone)
      }

      // Update cursor label based on hovered element
      const label = getCursorLabel(hovered)
      if (label !== currentLabel) {
        currentLabel = label
        updateCursorLabel(label)
      }
    }

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
      // Add boundary checks to prevent cursor from going off-screen
      const boundedX = Math.max(0, Math.min(window.innerWidth - width, mousePosition.x))
      const boundedY = Math.max(0, Math.min(window.innerHeight - width, mousePosition.y))
      
      let x = boundedX
      let y = boundedY

      for (let i = 0; i < dots.length; i += 1) {
        const dot = dots[i]
        const nextDot = dots[i + 1] || dots[0]
        
        // Ensure dots stay within bounds
        dot.x = Math.max(0, Math.min(window.innerWidth - width, x))
        dot.y = Math.max(0, Math.min(window.innerHeight - width, y))
        
        dot.draw(idle, sineDots)

        if (!idle || i <= sineDots) {
          // Smoother following with reduced lag
          const nextX = Math.max(0, Math.min(window.innerWidth - width, nextDot.x))
          const nextY = Math.max(0, Math.min(window.innerHeight - width, nextDot.y))
          x += (nextX - dot.x) * 0.25
          y += (nextY - dot.y) * 0.25
        }
      }
    }

    const render = () => {
      positionCursor()
      syncCursorTone()
      frameId = window.requestAnimationFrame(render)
    }

    const onMouseMove = (event: MouseEvent) => {
      const now = Date.now()
      if (now - lastMouseMoveTime < mouseMoveThrottle) return
      lastMouseMoveTime = now
      
      // Add boundary checks and smooth transitions
      const newX = Math.max(0, Math.min(window.innerWidth, event.clientX - width / 2))
      const newY = Math.max(0, Math.min(window.innerHeight, event.clientY - width / 2))
      
      // Smooth position updates to prevent jitter
      mousePosition.x += (newX - mousePosition.x) * 0.8
      mousePosition.y += (newY - mousePosition.y) * 0.8
      
      resetIdleTimer()
      // Reset hovered element on mouse move to force re-evaluation
      lastHoveredElement = null
    }

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return
      mousePosition.x = touch.clientX - width / 2
      mousePosition.y = touch.clientY - width / 2
      resetIdleTimer()
    }

    const getCursorLabel = (element: Element | null): string => {
      if (!element) return ''
      
      const tagName = element.tagName.toLowerCase()
      // Safely get className as string, handling both string and DOMTokenList
      const className = element.className ? 
        (typeof element.className === 'string' ? element.className : Array.from(element.className).join(' ')) : 
        ''
      const role = element.getAttribute('role')
      const ariaLabel = element.getAttribute('aria-label')
      
      // Links
      if (tagName === 'a' || role === 'link') {
        return 'Navigate'
      }
      
      // Buttons
      if (tagName === 'button' || role === 'button' || className.includes('btn')) {
        return 'Click'
      }
      
      // Form inputs
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        const inputType = element.getAttribute('type')
        if (inputType === 'submit' || inputType === 'button') return 'Submit'
        if (inputType === 'checkbox') return 'Select'
        if (inputType === 'radio') return 'Choose'
        return 'Type'
      }
      
      // Interactive elements
      if (role === 'tab' || className.includes('tab')) return 'Switch'
      if (role === 'menuitem' || className.includes('menu')) return 'Menu'
      if (role === 'option' || className.includes('option')) return 'Select'
      if (className.includes('card') || className.includes('tile')) return 'View'
      if (className.includes('slider') || className.includes('carousel')) return 'Slide'
      
      // Media elements
      if (tagName === 'img') return 'Image'
      if (tagName === 'video') return 'Video'
      if (tagName === 'audio') return 'Audio'
      
      // Navigation
      if (className.includes('nav') || className.includes('navigation')) return 'Navigate'
      if (className.includes('pagination')) return 'Page'
      
      // Content actions
      if (className.includes('expand') || className.includes('accordion')) return 'Expand'
      if (className.includes('close') || className.includes('dismiss')) return 'Close'
      if (className.includes('share')) return 'Share'
      if (className.includes('download')) return 'Download'
      if (className.includes('copy')) return 'Copy'
      if (className.includes('edit')) return 'Edit'
      if (className.includes('delete') || className.includes('remove')) return 'Delete'
      
      // Accessibility
      if (ariaLabel) return ariaLabel
      if (element.getAttribute('title')) return element.getAttribute('title')!
      
      return ''
    }

    const updateCursorLabel = (label: string) => {
      let labelElement = cursor.querySelector('.cursor-label') as HTMLElement
      
      if (!labelElement) {
        labelElement = document.createElement('div')
        labelElement.className = 'cursor-label'
        cursor.appendChild(labelElement)
      }
      
      if (label) {
        labelElement.textContent = label
        labelElement.style.display = 'block'
        cursor.classList.add('Cursor--with-label')
      } else {
        labelElement.style.display = 'none'
        cursor.classList.remove('Cursor--with-label')
      }
    }

    const onMediaChange = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        document.body.classList.remove('custom-cursor-enabled')
        document.body.classList.add('no-custom-cursor')
        document.documentElement.classList.remove('has-custom-cursor')
      }
    }

    const onMouseLeave = () => {
      // Reset cursor when mouse leaves the window
      mousePosition.x = -100
      mousePosition.y = -100
      lastHoveredElement = null
      if (isDarkTone || currentLabel) {
        isDarkTone = false
        currentLabel = ''
        cursor.classList.remove('Cursor--dark')
        updateCursorLabel('')
      }
    }

    const onMouseEnter = () => {
      // Reset when mouse re-enters the window
      lastHoveredElement = null
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave, { passive: true })
    window.addEventListener('mouseenter', onMouseEnter, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    mediaQuery.addEventListener('change', onMediaChange)

    buildDots()
    startIdleTimer()
    render()

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('mouseenter', onMouseEnter)
      window.removeEventListener('touchmove', onTouchMove)
      mediaQuery.removeEventListener('change', onMediaChange)
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
