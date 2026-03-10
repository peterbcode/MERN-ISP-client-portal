import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from '@jest/globals'
import FaqPage from './faq-page'

describe('FaqPage', () => {
  beforeEach(() => {
    render(<FaqPage />)
  })

  it('renders FAQ page with correct title and description', () => {
    expect(screen.getByText('Support Center')).toBeTruthy()
    expect(screen.getByText('Frequently Asked Questions')).toBeTruthy()
    expect(
      screen.getByText((content, element) => {
        return content.includes('Quick answers about our internet services')
      })
    ).toBeTruthy()
  })

  it('renders all FAQ items with numbered questions', () => {
    const firstQuestion = screen.getByText((content) => content.includes('1. What services do you offer?'))
    const secondQuestion = screen.getByText((content) => content.includes('2. Which areas do you cover?'))
    const lastQuestion = screen.getByText((content) => content.includes('44. How do I contact you fastest?'))

    expect(firstQuestion).toBeTruthy()
    expect(secondQuestion).toBeTruthy()
    expect(lastQuestion).toBeTruthy()
  })

  it('opens and closes FAQ items when clicked', () => {
    const firstFaqButton = screen.getByText((content) => content.includes('1. What services do you offer?')).closest('button')
    
    // Initially first item should be open (index 0 is open by default)
    expect(firstFaqButton?.getAttribute('aria-expanded')).toBe('true')
    
    // Find answer for first question
    const firstAnswer = screen.getByText((content) => {
      return content.includes('We provide fibre and wireless internet')
    })
    expect(firstAnswer).toBeTruthy()

    // Click to close
    fireEvent.click(firstFaqButton!)
    expect(firstFaqButton?.getAttribute('aria-expanded')).toBe('false')

    // Click to open again
    fireEvent.click(firstFaqButton!)
    expect(firstFaqButton?.getAttribute('aria-expanded')).toBe('true')
  })

  it('has proper accessibility attributes', () => {
    const faqButtons = screen.getAllByRole('button').filter(button => 
      button.getAttribute('aria-expanded') !== null
    )

    expect(faqButtons.length).toBeGreaterThan(0)

    faqButtons.forEach((button, index) => {
      expect(button.getAttribute('aria-expanded')).toBeTruthy()
      expect(button.getAttribute('aria-controls')).toBe(`faq-answer-${index}`)
    })
  })
})
