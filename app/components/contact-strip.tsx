'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import AnimatedSection from './ui/animated-section'
import PremiumButton from './ui/premium-button'

const inputClass =
  'w-full rounded-xl border border-zinc-700 bg-zinc-900/70 px-4 py-3 text-base text-zinc-100 placeholder:text-zinc-500 focus:border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 transition-all duration-300'

const ContactStrip = () => {
  const [formData, setFormData] = useState({
    streetAddress: '',
    area: '',
    city: '',
    postalCode: ''
  })
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<'checking' | 'available' | 'unavailable' | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setResult(null)
  }

  const handleCheckCoverage = async () => {
    if (!formData.streetAddress || !formData.area || !formData.city || !formData.postalCode) {
      alert('Please fill in all fields to check coverage')
      return
    }

    setIsChecking(true)
    setResult('checking')

    // Simulate coverage check API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay
      
      // Simple coverage logic based on area/postal code
      const coveredAreas = ['riebeek kasteel', 'malmesbury', 'chatsworth', 'swartland']
      const coveredPostalCodes = ['7307', '7308', '7309', '7310']
      
      const isCovered = coveredAreas.some(area => 
        formData.area.toLowerCase().includes(area)
      ) || coveredPostalCodes.includes(formData.postalCode)

      setResult(isCovered ? 'available' : 'unavailable')
    } catch (error) {
      console.error('Coverage check failed:', error)
      setResult('unavailable')
    } finally {
      setIsChecking(false)
    }
  }

  const getResultMessage = () => {
    switch (result) {
      case 'available':
        return {
          message: '🎉 Great news! We provide service in your area.',
          submessage: 'Contact us to get started with fast, reliable internet.',
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
    <section className="scroll-mt-28 bg-[#f97316] py-16 text-white sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection direction="up" className="mx-auto mb-8 max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold !text-black sm:text-5xl">Check Your Coverage</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
            Enter your address to see if we provide service in your area.
          </p>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={200} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_16px_35px_rgba(0,0,0,0.35)] sm:p-8">
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleCheckCoverage() }}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block group">
                <span className="mb-2 block text-sm font-semibold text-zinc-200 transition-colors group-focus-within:text-[#f97316]">Street Address</span>
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
                <span className="mb-2 block text-sm font-semibold text-zinc-200 transition-colors group-focus-within:text-[#f97316]">Area/Suburb</span>
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
                <span className="mb-2 block text-sm font-semibold text-zinc-200 transition-colors group-focus-within:text-[#f97316]">City</span>
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
                <span className="mb-2 block text-sm font-semibold text-zinc-200 transition-colors group-focus-within:text-[#f97316]">Postal Code</span>
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
                className="lg:w-auto group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MagnifyingGlassIcon className={`h-5 w-5 transition-transform duration-300 ${isChecking ? 'animate-spin' : 'group-hover:scale-110'}`} />
                {isChecking ? 'Checking...' : 'Check Coverage'}
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
        </AnimatedSection>
      </div>
    </section>
  )
}

export default ContactStrip
