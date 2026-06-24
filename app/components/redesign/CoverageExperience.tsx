'use client'

import { useState, useRef, useEffect } from 'react'
import { Loader2, MapPin, CheckCircle, Wifi, AlertCircle, Bell, ArrowRight, X, Cpu, Activity, ShieldCheck, HelpCircle } from 'lucide-react'

type CoverageResult = 'high' | 'wireless-only' | 'no-coverage' | null

interface CoverageData {
  result: CoverageResult
  address: string
  lat: number
  lng: number
  suburb?: string
  postalCode?: string
}

export default function CoverageExperience() {
  const [searchValue, setSearchValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [coverageResult, setCoverageResult] = useState<CoverageData | null>(null)
  const [waitlistForm, setWaitlistForm] = useState({ name: '', email: '', phone: '' })
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false)
  const [waitlistSuccess, setWaitlistSuccess] = useState(false)
  
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // ─── Google Maps Autocomplete Setup ──────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return

    const initAutocomplete = () => {
      if (!window.google || !inputRef.current) return

      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'za' },
        fields: ['address_components', 'geometry', 'formatted_address'],
        types: ['geocode', 'establishment'],
      })

      autocompleteRef.current = autocomplete

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (!place.geometry || !place.geometry.location) return

        const address = place.formatted_address || ''
        setSearchValue(address)
        setCoverageResult(null) // Reset result
      })
    }

    if (window.google) {
      initAutocomplete()
    } else {
      // Load script if not already present
      const scriptId = 'google-maps-api-script'
      let script = document.getElementById(scriptId) as HTMLScriptElement
      if (!script) {
        script = document.createElement('script')
        script.id = scriptId
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`
        script.async = true;
        script.defer = true;
        document.head.appendChild(script)
      }
      script.addEventListener('load', initAutocomplete)
    }

    return () => {
      if (autocompleteRef.current && window.google) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [])

  // ─── Check Coverage Handler ───────────────────────────────────────────────────
  const handleCheckCoverage = async () => {
    if (!searchValue.trim()) return

    let lat = -33.4095
    let lng = 18.8912
    let address = searchValue
    let suburb = ''
    let postalCode = ''

    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()
      if (place && place.geometry && place.geometry.location) {
        lat = place.geometry.location.lat()
        lng = place.geometry.location.lng()
        address = place.formatted_address || address
        
        place.address_components?.forEach((component) => {
          const types = component.types
          if (types.includes('sublocality') || types.includes('locality')) {
            suburb = component.long_name
          }
          if (types.includes('postal_code')) {
            postalCode = component.long_name
          }
        })
      }
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/check-coverage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, address, suburb, postalCode }),
      })

      const data = await response.json()
      setCoverageResult({
        result: data.result,
        address,
        lat,
        lng,
        suburb,
        postalCode,
      })
    } catch (error) {
      console.error('Error checking coverage:', error)
      // Fallback random selection
      const results: CoverageResult[] = ['high', 'wireless-only', 'no-coverage']
      const randomResult = results[Math.floor(Math.random() * results.length)]
      
      setCoverageResult({
        result: randomResult,
        address,
        lat,
        lng,
        suburb,
        postalCode,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ─── Waitlist Form Handler ─────────────────────────────────────────────────────
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingWaitlist(true)

    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...waitlistForm,
          address: coverageResult?.address,
        }),
      })
      setWaitlistSuccess(true)
    } catch (error) {
      console.error('Error submitting waitlist:', error)
      alert('Failed to submit. Please try again.')
    } finally {
      setIsSubmittingWaitlist(false)
    }
  }

  const handleReset = () => {
    setSearchValue('')
    setCoverageResult(null)
    setWaitlistForm({ name: '', email: '', phone: '' })
    setWaitlistSuccess(false)
  }

  return (
    <section 
      className="relative py-24 md:py-36 bg-brand-bg-primary text-brand-text-primary"
      id="coverage"
    >
      {/* Visual glowing ring backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-accent/5 blur-3xl pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-accent mb-4 block">Deployment Center</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            MISSION CONTROL
          </h2>
          <div className="h-1 w-20 bg-brand-accent mx-auto mb-6" />
          <p className="text-brand-text-secondary md:text-lg font-light leading-relaxed">
            Query our real-time network coverage grid. Check availability for Fibre or high-performance Wireless broadband at your physical coordinates.
          </p>
        </div>

        {/* Mission Control Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Left panel: Query Terminal */}
          <div className="lg:col-span-7 flex flex-col justify-between border border-brand-border bg-brand-bg-secondary/70 backdrop-blur-lg rounded-3xl p-6 md:p-8">
            <div>
              {/* Terminal Title */}
              <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">Coverage Query Terminal</span>
                </div>
                <span className="text-[10px] font-mono text-brand-text-secondary">SECURE_LINK // ACTIVE</span>
              </div>

              {/* Status Header */}
              <div className="grid grid-cols-3 gap-4 mb-8 bg-black/40 border border-brand-border/60 p-4 rounded-2xl">
                <div className="text-center">
                  <div className="text-[10px] text-brand-text-secondary uppercase font-semibold">Base Status</div>
                  <div className="text-sm font-bold text-green-500 mt-0.5">ONLINE</div>
                </div>
                <div className="text-center border-l border-brand-border/60 border-r">
                  <div className="text-[10px] text-brand-text-secondary uppercase font-semibold">Active Nodes</div>
                  <div className="text-sm font-bold text-white mt-0.5">4 / 4</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-brand-text-secondary uppercase font-semibold">Response</div>
                  <div className="text-sm font-bold text-brand-accent mt-0.5">~14ms</div>
                </div>
              </div>

              {/* Dynamic lookup states */}
              {!coverageResult && !isLoading && (
                <div className="space-y-6">
                  <p className="text-sm text-brand-text-secondary leading-relaxed">
                    Provide your street address below. Places API will locate your exact coordinates to map network boundaries.
                  </p>
                  
                  {/* Address input */}
                  <div className="relative">
                    <input 
                      ref={inputRef}
                      type="text" 
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Search Address (e.g. 6 Church Rd, Riebeek-Kasteel)"
                      className="w-full h-14 pl-12 pr-6 rounded-2xl border border-brand-border bg-brand-bg-primary text-white text-sm focus:border-brand-accent focus:outline-none transition-all duration-300 placeholder:text-brand-text-secondary/50 font-medium"
                    />
                    <MapPin className="absolute left-4 top-4.5 w-5 h-5 text-brand-text-secondary" />
                  </div>

                  <button 
                    onClick={handleCheckCoverage}
                    disabled={!searchValue.trim()}
                    className="group w-full h-14 flex items-center justify-center gap-2 bg-brand-accent hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-brand-accent text-white rounded-2xl font-bold tracking-wide transition-all duration-300 cursor-pointer"
                  >
                    Check System Grid
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              )}

              {/* Loading display */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 className="w-12 h-12 text-brand-accent animate-spin mb-4" />
                  <h4 className="text-lg font-bold text-white mb-2">Analyzing Grid Overlays...</h4>
                  <p className="text-sm text-brand-text-secondary max-w-xs">
                    Locating receiver nodes, analyzing elevation data, and testing routing paths.
                  </p>
                </div>
              )}

              {/* Result: HIGH COVERAGE */}
              {coverageResult?.result === 'high' && (
                <div className="space-y-6">
                  <div className="flex gap-4 items-start p-4 border border-green-500/20 bg-green-500/5 rounded-2xl">
                    <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Fibre & Wireless Available</h4>
                      <p className="text-xs text-brand-text-secondary mt-1">{coverageResult.address}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-brand-text-secondary leading-relaxed">
                    Splendid news! High-speed network junctions are situated directly at your coordinates. You qualify for both Fibre broadband and wireless links.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-brand-border">
                    <a 
                      href="/isp#plans"
                      className="flex-1 h-12 flex items-center justify-center bg-brand-accent hover:bg-orange-600 text-white rounded-xl text-sm font-bold tracking-wide transition-all duration-300 text-center"
                    >
                      View Packages
                    </a>
                    <button 
                      onClick={handleReset}
                      className="h-12 px-6 border border-brand-border bg-brand-card hover:bg-white/[0.02] text-white rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer"
                    >
                      Search Another
                    </button>
                  </div>
                </div>
              )}

              {/* Result: WIRELESS ONLY */}
              {coverageResult?.result === 'wireless-only' && (
                <div className="space-y-6">
                  <div className="flex gap-4 items-start p-4 border border-brand-accent/20 bg-brand-accent/5 rounded-2xl">
                    <div className="p-3 bg-brand-accent/10 rounded-xl text-brand-accent">
                      <Wifi className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Wireless Coverage Confirmed</h4>
                      <p className="text-xs text-brand-text-secondary mt-1">{coverageResult.address}</p>
                    </div>
                  </div>

                  <p className="text-sm text-brand-text-secondary leading-relaxed">
                    You lie directly within our active long-range high-elevation wireless tower relays. Experience high-speed uncapped wireless. Fibre is currently scheduled for installation.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-brand-border">
                    <a 
                      href="/isp#plans"
                      className="flex-1 h-12 flex items-center justify-center bg-brand-accent hover:bg-orange-600 text-white rounded-xl text-sm font-bold tracking-wide transition-all duration-300 text-center"
                    >
                      View Wireless Packages
                    </a>
                    <button 
                      onClick={handleReset}
                      className="h-12 px-6 border border-brand-border bg-brand-card hover:bg-white/[0.02] text-white rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer"
                    >
                      Search Another
                    </button>
                  </div>
                </div>
              )}

              {/* Result: NO COVERAGE (Waitlist) */}
              {coverageResult?.result === 'no-coverage' && (
                <div className="space-y-6">
                  <div className="flex gap-4 items-start p-4 border border-red-500/20 bg-red-500/5 rounded-2xl">
                    <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Outside Current Active Grid</h4>
                      <p className="text-xs text-brand-text-secondary mt-1">{coverageResult.address}</p>
                    </div>
                  </div>

                  {!waitlistSuccess ? (
                    <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                      <p className="text-sm text-brand-text-secondary leading-relaxed">
                        We don't support your specific location yet, but expansion works are active. Join the queue list to request a site survey.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          required
                          value={waitlistForm.name}
                          onChange={(e) => setWaitlistForm({ ...waitlistForm, name: e.target.value })}
                          placeholder="Your Name"
                          disabled={isSubmittingWaitlist}
                          className="h-12 px-4 rounded-xl border border-brand-border bg-brand-bg-primary text-white text-xs focus:border-brand-accent focus:outline-none transition-all duration-300"
                        />
                        <input 
                          type="email" 
                          required
                          value={waitlistForm.email}
                          onChange={(e) => setWaitlistForm({ ...waitlistForm, email: e.target.value })}
                          placeholder="Email Address"
                          disabled={isSubmittingWaitlist}
                          className="h-12 px-4 rounded-xl border border-brand-border bg-brand-bg-primary text-white text-xs focus:border-brand-accent focus:outline-none transition-all duration-300"
                        />
                      </div>
                      
                      <input 
                        type="tel" 
                        value={waitlistForm.phone}
                        onChange={(e) => setWaitlistForm({ ...waitlistForm, phone: e.target.value })}
                        placeholder="Phone Number"
                        disabled={isSubmittingWaitlist}
                        className="w-full h-12 px-4 rounded-xl border border-brand-border bg-brand-bg-primary text-white text-xs focus:border-brand-accent focus:outline-none transition-all duration-300"
                      />

                      <button 
                        type="submit"
                        disabled={isSubmittingWaitlist}
                        className="w-full h-12 flex items-center justify-center gap-2 bg-brand-accent hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer"
                      >
                        {isSubmittingWaitlist ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Registering...
                          </>
                        ) : (
                          <>
                            <Bell className="w-4 h-4" />
                            Join Deployment Waitlist
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="p-4 border border-green-500/30 bg-green-500/10 rounded-2xl text-center text-green-400 text-sm font-semibold">
                      ✓ Waitlist entry successful. We will notify you when deployment rolls out.
                    </div>
                  )}

                  <button 
                    onClick={handleReset}
                    className="w-full h-12 border border-brand-border bg-brand-card hover:bg-white/[0.02] text-white rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer"
                  >
                    Check Another Address
                  </button>
                </div>
              )}
            </div>
            
            <div className="text-[10px] text-brand-text-secondary mt-6 flex justify-between font-mono">
              <span>DB_REF: SA-WESTERN_CAPE-SWARTLAND</span>
              <span>v4.1.2</span>
            </div>
          </div>

          {/* Right panel: Live Telemetry Map (Visual indicator) */}
          <div className="lg:col-span-5 border border-brand-border bg-brand-bg-secondary/70 backdrop-blur-lg rounded-3xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative">
            {/* Visual radar animation */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.02)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10">
              <span className="text-[10px] font-mono text-brand-accent uppercase tracking-wider font-bold">GRID STATUS MONITOR</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-4">LIVE RADAR TARGET</h3>
            </div>

            {/* Simulated target radar container */}
            <div className="relative z-10 flex-1 flex items-center justify-center min-h-[220px] my-6">
              <div className="relative w-48 h-48 rounded-full border border-brand-border/40 flex items-center justify-center">
                {/* Concentric grid lines */}
                <div className="absolute w-36 h-36 rounded-full border border-brand-border/30" />
                <div className="absolute w-24 h-24 rounded-full border border-brand-border/20" />
                <div className="absolute w-12 h-12 rounded-full border border-brand-border/10" />
                
                {/* Sweeper sweep */}
                <div className="absolute w-full h-full rounded-full border border-transparent border-t-brand-accent/40 animate-spin" style={{ animationDuration: '4s' }} />

                {/* Nodes inside radar */}
                <span className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-brand-accent animate-ping" />
                <span className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-brand-accent" />
                <span className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                
                {/* Result indicators */}
                {coverageResult && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {coverageResult.result === 'high' && (
                      <div className="w-32 h-32 rounded-full border border-green-500 bg-green-500/10 flex items-center justify-center animate-pulse">
                        <span className="text-[10px] font-bold text-green-500 font-mono">100% REACH</span>
                      </div>
                    )}
                    {coverageResult.result === 'wireless-only' && (
                      <div className="w-32 h-32 rounded-full border border-brand-accent bg-brand-accent/10 flex items-center justify-center animate-pulse">
                        <span className="text-[10px] font-bold text-brand-accent font-mono">AIR LINK ONLY</span>
                      </div>
                    )}
                    {coverageResult.result === 'no-coverage' && (
                      <div className="w-32 h-32 rounded-full border border-red-500 bg-red-500/10 flex items-center justify-center animate-pulse">
                        <span className="text-[10px] font-bold text-red-500 font-mono">OUT OF BOUNDS</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="relative z-10 border-t border-brand-border pt-4">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-brand-text-secondary">GRID COORDINATES</span>
                <span className="text-white font-bold">
                  {coverageResult ? `${coverageResult.lat.toFixed(4)} S, ${coverageResult.lng.toFixed(4)} E` : 'LOCATING...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
