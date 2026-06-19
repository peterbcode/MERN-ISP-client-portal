jest.mock('./consent-provider', () => ({
  ConsentProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useConsent: () => mockUseConsent(),
}))

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from '@jest/globals'
import CookieConsent from './cookie-consent'

const mockUseConsent = jest.fn()

describe('CookieConsent', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('should not render when banner is closed', () => {
    mockUseConsent.mockReturnValue({
      consent: 'accepted',
      bannerOpen: false,
      isMounted: true,
      setConsent: jest.fn(),
      openBanner: jest.fn(),
      closeBanner: jest.fn(),
    })

    render(<CookieConsent />)

    expect(screen.queryByText('Cookie Preferences')).toBeFalsy()
    expect(screen.queryByText('We use essential cookies')).toBeFalsy()
  })

  it('should render when banner is open', () => {
    mockUseConsent.mockReturnValue({
      consent: null,
      bannerOpen: true,
      isMounted: true,
      setConsent: jest.fn(),
      openBanner: jest.fn(),
      closeBanner: jest.fn(),
    })

    render(<CookieConsent />)

    expect(screen.getByText('Cookie Preferences')).toBeTruthy()
    expect(screen.getByText('We use essential cookies for site performance and optional cookies for analytics and improvements.')).toBeTruthy()
  })

  it('should render all action buttons', () => {
    mockUseConsent.mockReturnValue({
      consent: null,
      bannerOpen: true,
      isMounted: true,
      setConsent: jest.fn(),
      openBanner: jest.fn(),
      closeBanner: jest.fn(),
    })

    render(<CookieConsent />)

    expect(screen.getByRole('button', { name: 'Accept all' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Essential only' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Later' })).toBeTruthy()
  })

  it('should handle accept all button click', () => {
    const setConsent = jest.fn()
    mockUseConsent.mockReturnValue({
      consent: null,
      bannerOpen: true,
      isMounted: true,
      setConsent,
      openBanner: jest.fn(),
      closeBanner: jest.fn(),
    })

    render(<CookieConsent />)

    const acceptButton = screen.getByRole('button', { name: 'Accept all' })
    fireEvent.click(acceptButton)

    expect(setConsent).toHaveBeenCalledWith('accepted')
  })

  it('should handle essential only button click', () => {
    const setConsent = jest.fn()
    mockUseConsent.mockReturnValue({
      consent: null,
      bannerOpen: true,
      isMounted: true,
      setConsent,
      openBanner: jest.fn(),
      closeBanner: jest.fn(),
    })

    render(<CookieConsent />)

    const essentialButton = screen.getByRole('button', { name: 'Essential only' })
    fireEvent.click(essentialButton)

    expect(setConsent).toHaveBeenCalledWith('essential')
  })

  it('should handle later button click', () => {
    const closeBanner = jest.fn()
    mockUseConsent.mockReturnValue({
      consent: null,
      bannerOpen: true,
      isMounted: true,
      setConsent: jest.fn(),
      openBanner: jest.fn(),
      closeBanner,
    })

    render(<CookieConsent />)

    const laterButton = screen.getByRole('button', { name: 'Later' })
    fireEvent.click(laterButton)

    expect(closeBanner).toHaveBeenCalled()
  })

  it('should have correct styling classes', () => {
    mockUseConsent.mockReturnValue({
      consent: null,
      bannerOpen: true,
      isMounted: true,
      setConsent: jest.fn(),
      openBanner: jest.fn(),
      closeBanner: jest.fn(),
    })

    render(<CookieConsent />)

    const banner = screen.getByText('Cookie Preferences').closest('.fixed')
    expect(banner?.classList.contains('fixed')).toBe(true)
    expect(banner?.classList.contains('bottom-4')).toBe(true)
    expect(banner?.classList.contains('left-4')).toBe(true)
    expect(banner?.classList.contains('rounded-2xl')).toBe(true)
  })

  it('should have correct button styling', () => {
    mockUseConsent.mockReturnValue({
      consent: null,
      bannerOpen: true,
      isMounted: true,
      setConsent: jest.fn(),
      openBanner: jest.fn(),
      closeBanner: jest.fn(),
    })

    render(<CookieConsent />)

    const acceptButton = screen.getByRole('button', { name: 'Accept all' })
    expect(acceptButton.classList.contains('bg-[#f97316]')).toBe(true)

    const essentialButton = screen.getByRole('button', { name: 'Essential only' })
    expect(essentialButton.classList.contains('bg-zinc-800')).toBe(true)

    const laterButton = screen.getByRole('button', { name: 'Later' })
    expect(laterButton.classList.contains('border-transparent')).toBe(true)
  })

  it('should render with correct text content', () => {
    mockUseConsent.mockReturnValue({
      consent: null,
      bannerOpen: true,
      isMounted: true,
      setConsent: jest.fn(),
      openBanner: jest.fn(),
      closeBanner: jest.fn(),
    })

    render(<CookieConsent />)

    expect(screen.getByText('Cookie Preferences')).toBeTruthy()
    expect(screen.getByText('We use essential cookies for site performance and optional cookies for analytics and improvements.')).toBeTruthy()
  })

  it('should have proper accessibility attributes', () => {
    mockUseConsent.mockReturnValue({
      consent: null,
      bannerOpen: true,
      isMounted: true,
      setConsent: jest.fn(),
      openBanner: jest.fn(),
      closeBanner: jest.fn(),
    })

    render(<CookieConsent />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button.getAttribute('type')).toBe('button')
    })
  })

  it('should not render when isMounted is false', () => {
    mockUseConsent.mockReturnValue({
      consent: null,
      bannerOpen: true,
      isMounted: false,
      setConsent: jest.fn(),
      openBanner: jest.fn(),
      closeBanner: jest.fn(),
    })

    render(<CookieConsent />)

    expect(screen.queryByText('Cookie Preferences')).toBeFalsy()
  })
})
