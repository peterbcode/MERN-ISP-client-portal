import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { ConsentProvider, useConsent, COOKIE_CHOICE_KEY, OPEN_COOKIE_SETTINGS_EVENT } from './consent-provider'

describe('ConsentProvider', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('should provide default consent context values', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConsentProvider>{children}</ConsentProvider>
    )

    const { result } = renderHook(() => useConsent(), { wrapper })

    expect(result.current.consent).toBe(null)
    expect(result.current.bannerOpen).toBe(true)
    expect(result.current.isMounted).toBe(false)
    expect(typeof result.current.setConsent).toBe('function')
    expect(typeof result.current.openBanner).toBe('function')
    expect(typeof result.current.closeBanner).toBe('function')
  })

  it('should load saved consent from localStorage', () => {
    // Set a saved consent choice
    localStorage.setItem(COOKIE_CHOICE_KEY, 'accepted')

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConsentProvider>{children}</ConsentProvider>
    )

    const { result } = renderHook(() => useConsent(), { wrapper })

    expect(result.current.consent).toBe('accepted')
    expect(result.current.bannerOpen).toBe(false)
  })

  it('should handle essential consent choice', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConsentProvider>{children}</ConsentProvider>
    )

    const { result } = renderHook(() => useConsent(), { wrapper })

    act(() => {
      result.current.setConsent('essential')
    })

    expect(result.current.consent).toBe('essential')
    expect(result.current.bannerOpen).toBe(false)
    expect(localStorage.setItem).toHaveBeenCalledWith(COOKIE_CHOICE_KEY, 'essential')
  })

  it('should handle accepted consent choice', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConsentProvider>{children}</ConsentProvider>
    )

    const { result } = renderHook(() => useConsent(), { wrapper })

    act(() => {
      result.current.setConsent('accepted')
    })

    expect(result.current.consent).toBe('accepted')
    expect(result.current.bannerOpen).toBe(false)
    expect(localStorage.setItem).toHaveBeenCalledWith(COOKIE_CHOICE_KEY, 'accepted')
  })

  it('should handle opening and closing banner', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConsentProvider>{children}</ConsentProvider>
    )

    const { result } = renderHook(() => useConsent(), { wrapper })

    // Initially banner should be open
    expect(result.current.bannerOpen).toBe(true)

    // Close banner
    act(() => {
      result.current.closeBanner()
    })

    expect(result.current.bannerOpen).toBe(false)

    // Open banner
    act(() => {
      result.current.openBanner()
    })

    expect(result.current.bannerOpen).toBe(true)
  })

  it('should handle custom cookie settings event', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConsentProvider>{children}</ConsentProvider>
    )

    const { result } = renderHook(() => useConsent(), { wrapper })

    // Initially close banner
    act(() => {
      result.current.closeBanner()
    })

    expect(result.current.bannerOpen).toBe(false)

    // Dispatch custom event
    act(() => {
      const event = new Event(OPEN_COOKIE_SETTINGS_EVENT)
      window.dispatchEvent(event)
    })

    expect(result.current.bannerOpen).toBe(true)
  })

  it('should set isMounted to true after mount', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConsentProvider>{children}</ConsentProvider>
    )

    const { result } = renderHook(() => useConsent(), { wrapper })

    // Initially should be false
    expect(result.current.isMounted).toBe(false)

    // Wait for useEffect to run
    act(() => {
      // Trigger a re-render
      result.current.openBanner()
    })

    // Should still be false until after mount effect
    expect(result.current.isMounted).toBe(false)
  })

  it('should not show banner if consent already given', () => {
    // Set saved consent
    localStorage.setItem(COOKIE_CHOICE_KEY, 'accepted')

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConsentProvider>{children}</ConsentProvider>
    )

    const { result } = renderHook(() => useConsent(), { wrapper })

    expect(result.current.consent).toBe('accepted')
    expect(result.current.bannerOpen).toBe(false)
  })

  it('should throw error when useConsent is used outside provider', () => {
    const { result } = renderHook(() => useConsent())

    expect(() => result.current).toThrow('useConsent must be used inside ConsentProvider')
  })

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage to throw error
    const originalSetItem = localStorage.setItem
    localStorage.setItem = jest.fn(() => {
      throw new Error('Storage quota exceeded')
    })

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConsentProvider>{children}</ConsentProvider>
    )

    const { result } = renderHook(() => useConsent(), { wrapper })

    // Should not throw error when setConsent is called
    expect(() => {
      act(() => {
        result.current.setConsent('accepted')
      })
    }).not.toThrow()

    // Restore original localStorage
    localStorage.setItem = originalSetItem
  })

  it('should handle invalid saved consent values', () => {
    // Set invalid consent value
    localStorage.setItem(COOKIE_CHOICE_KEY, 'invalid')

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConsentProvider>{children}</ConsentProvider>
    )

    const { result } = renderHook(() => useConsent(), { wrapper })

    // Should treat invalid as null
    expect(result.current.consent).toBe(null)
    expect(result.current.bannerOpen).toBe(true)
  })
})
