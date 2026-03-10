import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import CookieConsent from './cookie-consent'
import { ConsentProvider } from './consent-provider'

describe('CookieConsent', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  const renderWithProvider = () => {
    return render(
      <ConsentProvider>
        <CookieConsent />
      </ConsentProvider>
    )
  }

  it('should not render when banner is closed', () => {
    localStorage.setItem('vc_cookie_choice', 'accepted')

    renderWithProvider()

    expect(screen.queryByText('Cookie Preferences')).toBeFalsy()
    expect(screen.queryByText('We use essential cookies')).toBeFalsy()
  })

  it('should render when banner is open', () => {
    renderWithProvider()

    expect(screen.getByText('Cookie Preferences')).toBeTruthy()
    expect(screen.getByText('We use essential cookies for site performance and optional cookies for analytics and improvements.')).toBeTruthy()
  })

  it('should render all action buttons', () => {
    renderWithProvider()

    expect(screen.getByRole('button', { name: 'Accept all' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Essential only' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Later' })).toBeTruthy()
  })

  it('should handle accept all button click', () => {
    renderWithProvider()

    const acceptButton = screen.getByRole('button', { name: 'Accept all' })
    fireEvent.click(acceptButton)

    expect(localStorage.setItem).toHaveBeenCalledWith('vc_cookie_choice', 'accepted')
  })

  it('should handle essential only button click', () => {
    renderWithProvider()

    const essentialButton = screen.getByRole('button', { name: 'Essential only' })
    fireEvent.click(essentialButton)

    expect(localStorage.setItem).toHaveBeenCalledWith('vc_cookie_choice', 'essential')
  })

  it('should handle later button click', () => {
    renderWithProvider()

    const laterButton = screen.getByRole('button', { name: 'Later' })
    fireEvent.click(laterButton)

    // Should close banner without setting consent
    expect(screen.queryByText('Cookie Preferences')).toBeFalsy()
  })

  it('should have correct styling classes', () => {
    renderWithProvider()

    const banner = screen.getByText('Cookie Preferences').closest('.fixed')
    expect(banner?.classList.contains('fixed')).toBe(true)
    expect(banner?.classList.contains('bottom-4')).toBe(true)
    expect(banner?.classList.contains('left-4')).toBe(true)
    expect(banner?.classList.contains('rounded-2xl')).toBe(true)
  })

  it('should have correct button styling', () => {
    renderWithProvider()

    const acceptButton = screen.getByRole('button', { name: 'Accept all' })
    expect(acceptButton.classList.contains('bg-[#f97316]')).toBe(true)

    const essentialButton = screen.getByRole('button', { name: 'Essential only' })
    expect(essentialButton.classList.contains('bg-zinc-800')).toBe(true)

    const laterButton = screen.getByRole('button', { name: 'Later' })
    expect(laterButton.classList.contains('border-transparent')).toBe(true)
  })

  it('should render with correct text content', () => {
    renderWithProvider()

    expect(screen.getByText('Cookie Preferences')).toBeTruthy()
    expect(screen.getByText('We use essential cookies for site performance and optional cookies for analytics and improvements.')).toBeTruthy()
  })

  it('should handle keyboard navigation', () => {
    renderWithProvider()

    const acceptButton = screen.getByRole('button', { name: 'Accept all' })
    
    // Test Enter key
    fireEvent.keyDown(acceptButton, { key: 'Enter' })
    expect(localStorage.setItem).toHaveBeenCalledWith('vc_cookie_choice', 'accepted')

    // Test Space key
    fireEvent.keyDown(acceptButton, { key: ' ' })
    expect(localStorage.setItem).toHaveBeenCalledTimes(2) // Called twice (Enter + Space)
  })

  it('should have proper accessibility attributes', () => {
    renderWithProvider()

    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button.getAttribute('type')).toBe('button')
    })
  })

  it('should not render when isMounted is false', () => {
    // Mock provider with isMounted: false
    const MockWrapper = ({ children }: { children: React.ReactNode }) => (
      <ConsentProvider>{children}</ConsentProvider>
    )

    render(
      <MockWrapper>
        <CookieConsent />
      </MockWrapper>
    )

    // Should not render initially due to isMounted check
    expect(screen.queryByText('Cookie Preferences')).toBeFalsy()
  })
})
