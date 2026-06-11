'use client'

import { useState, useRef, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import PremiumButton from './ui/premium-button'
import { safeAlert } from '@/lib/native-dialog'
import { revealSection } from './animations/sectionReveal'

const inputClass =
  'w-full rounded-xl border border-white/10 bg-[#0f1114] px-4 py-3 text-base text-zinc-100 placeholder:text-zinc-500 focus:border-[#ff7e26] focus:outline-none focus:ring-2 focus:ring-[#ff7e26]/20 transition-all duration-300'

const ContactStrip = () => {
  const [formData, setFormData] = useState({
    streetAddress: '',
    area: '',
    city: '',
    postalCode: ''
  })
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<'checking' | 'available' | 'unavailable' | null>(null)

  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const cleanup = revealSection(sectionRef.current)
    return cleanup
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setResult(null)
  }

  const handleCheckCoverage = async () => {
    if (!formData.streetAddress || !formData.area || !formData.city || !formData.postalCode) {
      safeAlert('Please fill in all fields to check coverage')
      return
    }

    setIsChecking(true)

    // Simulate brief loading
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Show placeholder message
    setResult('available')
    setIsChecking(false)

    // Clear fields after submission
    setFormData({
      streetAddress: '',
      area: '',
      city: '',
      postalCode: ''
    })
  }

  const getResultMessage = () => {
    switch (result) {
      case 'available':
        return {
          message: 'Thanks! We\'ll check coverage at your address and contact you within 1 business day.',
          submessage: '',
          color: 'text-green-400'
        }
      case 'unavailable':
        return {
          message: '❌ Service not yet available in your area.',
          submessage: 'We\'re expanding! Leave your details and we\'ll notify you.',
          color: 'text-red-400'
        }
      case 'checking':
        return {
          message: '🔍 Checking coverage in your area...',
          submessage: 'This usually takes just a moment.',
          color: 'text-blue-400'
        }
      default:
        return null
    }
  }

  const resultMessage = getResultMessage()

  return (
    <section ref={sectionRef} className="relative scroll-mt-28 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <h2 className="reveal-heading relative inline-block text-3xl font-extrabold text-white sm:text-5xl">
            <span className="reveal-divider absolute -top-3 left-1/2 h-[2px] w-8 -translate-x-1/2 bg-[#ff7e26]"></span>
            Check Your Coverage
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-300 sm:text-lg">
            Enter your address to see if we provide service in your area.
          </p>
        </div>

        <div className="reveal-card rounded-3xl border border-white/10 bg-[#15181b]/95 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_16px_35px_rgba(0,0,0,0.3)] sm:p-8">
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleCheckCoverage() }}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block group">
                <span className="mb-2 block text-sm font-semibold text-zinc-200 transition-colors group-focus-within:text-[#ff7e26]">Street Address</span>
                <input
                  className={inputClass}
                  placeholder="6 Church Rd"
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                  onFocus={(e) => e.target.parentElement?.classList.add('focus-within')}
                  onBlur={(e) => e.target.parentElement?.classList.remove('focus-within')}
                />
              </label>
              <label className="block group">
                <span className="mb-2 block text-sm font-semibold text-zinc-200 transition-colors group-focus-within:text-[#ff7e26]">Area/Suburb</span>
                <input
                  className={inputClass}
                  placeholder="Riebeek Kasteel"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  onFocus={(e) => e.target.parentElement?.classList.add('focus-within')}
                  onBlur={(e) => e.target.parentElement?.classList.remove('focus-within')}
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
              <label className="block group">
                <span className="mb-2 block text-sm font-semibold text-zinc-200 transition-colors group-focus-within:text-[#ff7e26]">City</span>
                <input
                  className={inputClass}
                  placeholder="Western Cape"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  onFocus={(e) => e.target.parentElement?.classList.add('focus-within')}
                  onBlur={(e) => e.target.parentElement?.classList.remove('focus-within')}
                />
              </label>
              <label className="block group">
                <span className="mb-2 block text-sm font-semibold text-zinc-200 transition-colors group-focus-within:text-[#ff7e26]">Postal Code</span>
                <input
                  className={inputClass}
                  placeholder="7307"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  onFocus={(e) => e.target.parentElement?.classList.add('focus-within')}
                  onBlur={(e) => e.target.parentElement?.classList.remove('focus-within')}
                />
              </label>
              <PremiumButton
                variant="primary"
                size="lg"
                type="submit"
                disabled={isChecking}
                className="
    group
    relative
    lg:w-auto
    rounded-2xl
    px-7
    py-4
    font-semibold
    tracking-tight
    transition-all
    duration-300
    hover:-translate-y-0.5
    hover:shadow-lg
    active:scale-[0.98]
    disabled:opacity-60
    disabled:cursor-not-allowed
    disabled:hover:translate-y-0
    disabled:hover:shadow-none
  "
              >
                <span className="flex items-center gap-3">

                  {/* Icon container */}
                  <span
                    className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        bg-black/10
        transition-transform
        duration-300
        group-hover:scale-105
      "
                  >
                    <MagnifyingGlassIcon
                      className={`h-5 w-5 transition-all duration-300 ${isChecking
                          ? 'animate-spin'
                          : 'group-hover:rotate-6'
                        }`}
                    />
                  </span>

                  {/* Text */}
                  <span>
                    {isChecking ? 'Checking Coverage...' : 'Check Coverage'}
                  </span>

                </span>
              </PremiumButton>
            </div>
          </form>

          {/* Results Display */}
          {resultMessage && (
            <div className="mt-6 rounded-xl border border-zinc-700 bg-zinc-900/50 p-6 backdrop-blur-sm">
              <div className="text-center">
                <p className={`text-lg font-semibold mb-2 ${resultMessage.color}`}>
                  {resultMessage.message}
                </p>
                <p className="text-zinc-300">
                  {resultMessage.submessage}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ContactStrip
