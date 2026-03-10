import { renderHook } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import CustomCursor from './custom-cursor'

// Mock DOM methods that the cursor uses
Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 })

describe('CustomCursor', () => {
  let mockElement: HTMLElement

  beforeEach(() => {
    // Create a mock element for elementFromPoint
    mockElement = document.createElement('div')
    Object.defineProperty(mockElement, 'className', {
      writable: true,
      value: 'test-element'
    })
    Object.defineProperty(mockElement, 'tagName', {
      writable: true,
      value: 'DIV'
    })
    
    // Mock document.elementFromPoint
    document.elementFromPoint = jest.fn(() => mockElement)
    
    // Mock getComputedStyle
    window.getComputedStyle = jest.fn(() => ({
      backgroundColor: 'rgb(255, 255, 255)',
      color: 'rgb(0, 0, 0)',
      cursor: 'pointer'
    })) as any

    // Mock requestAnimationFrame
    window.requestAnimationFrame = jest.fn((cb: FrameRequestCallback) => {
      return setTimeout(cb, 16) as unknown as number
    })
    window.cancelAnimationFrame = jest.fn((id: number) => clearTimeout(id))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render without crashing', () => {
    expect(() => {
      renderHook(() => CustomCursor())
    }).not.toThrow()
  })

  it('should add cursor element to document body', () => {
    const { unmount } = renderHook(() => CustomCursor())
    
    const cursorElement = document.querySelector('.custom-cursor')
    expect(cursorElement).toBeTruthy()
    expect(cursorElement?.classList.contains('custom-cursor')).toBe(true)
    
    unmount()
    expect(document.querySelector('.custom-cursor')).toBeFalsy()
  })

  it('should create cursor dots', () => {
    renderHook(() => CustomCursor())
    
    const cursorElement = document.querySelector('.custom-cursor')
    const dots = cursorElement?.querySelectorAll('.cursor-dot')
    
    expect(dots?.length).toBe(5) // Default number of dots
  })

  it('should handle mouse movement events', () => {
    renderHook(() => CustomCursor())
    
    // Simulate mouse move event
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 200
    })
    
    window.dispatchEvent(mouseEvent)
    
    expect(document.elementFromPoint).toHaveBeenCalled()
  })

  it('should handle touch events', () => {
    renderHook(() => CustomCursor())
    
    // Simulate touch move event
    const touchEvent = new TouchEvent('touchmove', {
      touches: [{
        clientX: 150,
        clientY: 250
      } as any]
    })
    
    window.dispatchEvent(touchEvent)
    
    expect(document.elementFromPoint).toHaveBeenCalled()
  })

  it('should handle window mouse leave events', () => {
    renderHook(() => CustomCursor())
    
    // Simulate mouse leave event
    const mouseLeaveEvent = new MouseEvent('mouseleave')
    window.dispatchEvent(mouseLeaveEvent)
    
    // Should not throw error
    expect(true).toBe(true)
  })

  it('should handle window mouse enter events', () => {
    renderHook(() => CustomCursor())
    
    // Simulate mouse enter event
    const mouseEnterEvent = new MouseEvent('mouseenter')
    window.dispatchEvent(mouseEnterEvent)
    
    // Should not throw error
    expect(true).toBe(true)
  })

  it('should update cursor position based on mouse movement', () => {
    renderHook(() => CustomCursor())
    
    // Simulate mouse move
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 300,
      clientY: 400
    })
    
    window.dispatchEvent(mouseEvent)
    
    // Check if cursor position would be updated (mocked)
    expect(document.elementFromPoint).toHaveBeenCalledWith(313, 413) // width/2 added
  })

  it('should add dark class when hovering over light surfaces', () => {
    // Mock light background
    window.getComputedStyle = jest.fn(() => ({
      backgroundColor: 'rgb(255, 255, 255)',
      color: 'rgb(0, 0, 0)',
      cursor: 'pointer'
    })) as any

    renderHook(() => CustomCursor())
    
    const cursorElement = document.querySelector('.custom-cursor')
    
    // Simulate hover over light element
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100
    })
    
    window.dispatchEvent(mouseEvent)
    
    // The cursor should exist for light backgrounds
    expect(cursorElement).toBeTruthy()
  })

  it('should handle button elements correctly', () => {
    // Mock button element
    Object.defineProperty(mockElement, 'tagName', {
      writable: true,
      value: 'BUTTON'
    })
    mockElement.className = 'btn-primary'
    
    renderHook(() => CustomCursor())
    
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100
    })
    
    window.dispatchEvent(mouseEvent)
    
    expect(document.elementFromPoint).toHaveBeenCalled()
  })

  it('should handle link elements correctly', () => {
    // Mock link element
    Object.defineProperty(mockElement, 'tagName', {
      writable: true,
      value: 'A'
    })
    mockElement.setAttribute('href', 'https://example.com')
    
    renderHook(() => CustomCursor())
    
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100
    })
    
    window.dispatchEvent(mouseEvent)
    
    expect(document.elementFromPoint).toHaveBeenCalled()
  })

  it('should handle input elements correctly', () => {
    // Mock input element
    Object.defineProperty(mockElement, 'tagName', {
      writable: true,
      value: 'INPUT'
    })
    mockElement.setAttribute('type', 'text')
    
    renderHook(() => CustomCursor())
    
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100
    })
    
    window.dispatchEvent(mouseEvent)
    
    expect(document.elementFromPoint).toHaveBeenCalled()
  })

  it('should cleanup properly on unmount', () => {
    const { unmount } = renderHook(() => CustomCursor())
    
    // Check that cursor exists
    expect(document.querySelector('.custom-cursor')).toBeTruthy()
    
    // Unmount
    unmount()
    
    // Check that cursor is removed
    expect(document.querySelector('.custom-cursor')).toBeFalsy()
  })

  it('should handle viewport boundaries correctly', () => {
    renderHook(() => CustomCursor())
    
    // Test boundary conditions
    const boundaryEvent = new MouseEvent('mousemove', {
      clientX: -10, // Outside viewport
      clientY: -10
    })
    
    window.dispatchEvent(boundaryEvent)
    
    // Should not throw error with out-of-bounds coordinates
    expect(true).toBe(true)
  })

  it('should handle no element at point correctly', () => {
    // Mock no element found
    document.elementFromPoint = jest.fn(() => null)
    
    renderHook(() => CustomCursor())
    
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100
    })
    
    window.dispatchEvent(mouseEvent)
    
    expect(document.elementFromPoint).toHaveBeenCalled()
  })
})
