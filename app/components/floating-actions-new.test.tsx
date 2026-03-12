import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import FloatingActions from './floating-actions'

// Mock window.open
const mockOpen = jest.fn()
Object.defineProperty(window, 'open', { writable: true, value: mockOpen })

// Mock window.scrollTo
const mockScrollTo = jest.fn()
Object.defineProperty(window, 'scrollTo', { writable: true, value: mockScrollTo })

// Mock window.scrollY
Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 0 })

// Mock window.innerHeight
Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 800 })

// Mock document.documentElement.scrollHeight
Object.defineProperty(document.documentElement, 'scrollHeight', { writable: true, configurable: true, value: 1000 })

describe('FloatingActions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render WhatsApp button', () => {
    render(<FloatingActions />)

    const whatsappButton = screen.getByRole('button', { name: /Open WhatsApp chat/i })
    expect(whatsappButton).toBeTruthy()
  })

  it('should render chat prompt when chat is closed', () => {
    render(<FloatingActions />)

    expect(screen.getByText('Need help? Chat with us')).toBeTruthy()
  })

  it('should open chat when WhatsApp button is clicked', async () => {
    render(<FloatingActions />)

    const whatsappButton = screen.getByRole('button', { name: /Open WhatsApp chat/i })
    fireEvent.click(whatsappButton)

    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('Valley Computers Support'))).toBeTruthy()
    })
  })

  it('should render quick reply buttons', async () => {
    render(<FloatingActions />)

    // Open chat
    const whatsappButton = screen.getByRole('button', { name: /Open WhatsApp chat/i })
    fireEvent.click(whatsappButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Internet plans & pricing' })).toBeTruthy()
      expect(screen.getByRole('button', { name: 'PC repair support' })).toBeTruthy()
      expect(screen.getByRole('button', { name: 'Report an issue' })).toBeTruthy()
    })
  })

  it('should open WhatsApp with quick reply text', async () => {
    render(<FloatingActions />)

    // Open chat
    const whatsappButton = screen.getByRole('button', { name: /Open WhatsApp chat/i })
    fireEvent.click(whatsappButton)

    await waitFor(() => {
      const quickReplyButton = screen.getByRole('button', { name: 'Internet plans & pricing' })
      expect(quickReplyButton).toBeTruthy()
    })

    const quickReplyButton = screen.getByRole('button', { name: 'Internet plans & pricing' })
    fireEvent.click(quickReplyButton)

    expect(mockOpen).toHaveBeenCalledWith(
      'https://wa.me/27799381260?text=Internet%20plans%20%26%20pricing',
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('should send custom message', async () => {
    render(<FloatingActions />)

    // Open chat
    const whatsappButton = screen.getByRole('button', { name: /Open WhatsApp chat/i })
    fireEvent.click(whatsappButton)

    await waitFor(() => {
      const messageInput = screen.getByPlaceholderText('Type a message...')
      expect(messageInput).toBeTruthy()

      fireEvent.change(messageInput, { target: { value: 'Test message' } })
      expect(messageInput.getAttribute('value')).toBe('Test message')

      const sendButton = screen.getByRole('button', { name: /Send WhatsApp message/i })
      expect(sendButton).toBeTruthy()
    })

    const sendButton = screen.getByRole('button', { name: /Send WhatsApp message/i })
    fireEvent.click(sendButton)

    expect(mockOpen).toHaveBeenCalledWith(
      'https://wa.me/27799381260?text=Test%20message',
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('should close chat dialog', async () => {
    render(<FloatingActions />)

    // Open chat
    const whatsappButton = screen.getByRole('button', { name: /Open WhatsApp chat/i })
    fireEvent.click(whatsappButton)

    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('Valley Computers Support'))).toBeTruthy()
    })

    // Close chat
    const closeButton = screen.getByRole('button', { name: /Close WhatsApp dialog/i })
    fireEvent.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByText((content) => content.includes('Valley Computers Support'))).toBeFalsy()
    })
  })

  it('should have proper accessibility attributes', () => {
    render(<FloatingActions />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button.getAttribute('type')).toBe('button')
    })

    const whatsappButton = screen.getByRole('button', { name: /Open WhatsApp chat/i })
    expect(whatsappButton.getAttribute('aria-label')).toBe('Open WhatsApp chat')
  })
})
