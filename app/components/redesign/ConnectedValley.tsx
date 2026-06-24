'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Network, Activity } from 'lucide-react'

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const locations = [
  {
    id: 'rk',
    name: 'Riebeek-Kasteel',
    description: 'HQ Operations & Regional Backbone core routing.',
    x: 400,
    y: 350,
  },
  {
    id: 'rw',
    name: 'Riebeek West',
    description: 'Fibre and high-speed wireless distribution hub.',
    x: 420,
    y: 200,
  },
  {
    id: 'mb',
    name: 'Malmesbury',
    description: 'Connecting regional businesses and public institutions.',
    x: 200,
    y: 500,
  },
  {
    id: 'sl',
    name: 'Swartland Area',
    description: 'Extending long-range wireless networks to remote farming communities.',
    x: 600,
    y: 420,
  }
]

export default function ConnectedValley() {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftPinRef = useRef<HTMLDivElement>(null)
  const [activeLoc, setActiveLoc] = useState<string>('rk')

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the map section on desktop
      const pinTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: leftPinRef.current,
        pinSpacing: false,
        id: 'valley-pin',
      })

      // Setup ScrollTrigger for each story step to activate map points
      const sections = gsap.utils.toArray('.valley-story-step') as HTMLElement[]
      sections.forEach((section) => {
        const locId = section.getAttribute('data-location-id') || 'rk'
        
        ScrollTrigger.create({
          trigger: section,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => {
            setActiveLoc(locId)
            animateMapTransition(locId)
          },
          onEnterBack: () => {
            setActiveLoc(locId)
            animateMapTransition(locId)
          }
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const animateMapTransition = (locId: string) => {
    // Reset all lines and nodes
    gsap.set('.map-connection-line', { strokeDashoffset: 400, opacity: 0.15 })
    
    // Animate path to active node
    if (locId === 'rk') {
      gsap.to('.line-to-rw', { strokeDashoffset: 0, opacity: 0.8, duration: 1 })
    } else if (locId === 'rw') {
      gsap.to(['.line-to-rw', '.line-to-sl'], { strokeDashoffset: 0, opacity: 0.8, duration: 0.8, stagger: 0.2 })
    } else if (locId === 'mb') {
      gsap.to(['.line-to-rw', '.line-to-mb'], { strokeDashoffset: 0, opacity: 0.8, duration: 0.8, stagger: 0.2 })
    } else if (locId === 'sl') {
      gsap.to(['.line-to-rw', '.line-to-sl', '.line-to-mb'], { strokeDashoffset: 0, opacity: 0.8, duration: 1, stagger: 0.15 })
    }

    // Pulse active node
    gsap.fromTo(`.node-${locId}`, 
      { scale: 1, filter: 'drop-shadow(0px 0px 0px #FF6B00)' },
      { scale: 1.25, filter: 'drop-shadow(0px 0px 12px #FF6B00)', duration: 0.5, yoyo: true, repeat: 1 }
    )
  }

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-[300vh] w-full bg-brand-bg-primary text-brand-text-primary"
      id="valley-story"
    >
      {/* Pinned visual container */}
      <div 
        ref={leftPinRef} 
        className="hidden lg:flex absolute left-0 top-0 w-1/2 h-screen items-center justify-center p-12 z-10 border-r border-brand-border bg-brand-bg-primary"
      >
        <div className="relative w-full h-[80%] rounded-3xl border border-brand-border bg-brand-bg-secondary overflow-hidden flex flex-col justify-between p-8">
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#000_100%),linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

          {/* Map Title / Legend */}
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold uppercase tracking-wider text-white">Riebeek Valley Network Map</h3>
              <p className="text-xs text-brand-text-secondary mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Active regional routing node
              </p>
            </div>
            <Activity className="w-5 h-5 text-brand-accent animate-pulse" />
          </div>

          {/* Interactive Map Visual (SVG) */}
          <div className="flex-1 w-full flex items-center justify-center relative my-4">
            <svg 
              className="w-full h-full max-h-[450px]"
              viewBox="0 0 800 600" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Regional Grid outlines */}
              <circle cx="400" cy="300" r="280" stroke="rgba(255,107,0,0.03)" strokeWidth="1" strokeDasharray="5 5" />
              <circle cx="400" cy="300" r="180" stroke="rgba(255,107,0,0.04)" strokeWidth="1" strokeDasharray="3 3" />

              {/* Glowing Connection Paths */}
              {/* RK to RW */}
              <path 
                className="map-connection-line line-to-rw" 
                d="M 400 350 L 420 200" 
                stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="400" strokeDashoffset="400" opacity="0.15" 
              />
              {/* RK to MB */}
              <path 
                className="map-connection-line line-to-mb" 
                d="M 400 350 Q 280 420 200 500" 
                stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="400" strokeDashoffset="400" opacity="0.15" 
              />
              {/* RW to SL */}
              <path 
                className="map-connection-line line-to-sl" 
                d="M 420 200 Q 520 300 600 420" 
                stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="400" strokeDashoffset="400" opacity="0.15" 
              />

              {/* Network Node Coordinates */}
              {locations.map((loc) => {
                const isActive = activeLoc === loc.id
                return (
                  <g key={loc.id} className={`node-${loc.id} transition-all duration-300`}>
                    {/* Ring Pulse on Active */}
                    {isActive && (
                      <circle 
                        cx={loc.x} 
                        cy={loc.y} 
                        r="24" 
                        fill="none" 
                        stroke="#FF6B00" 
                        strokeWidth="1.5" 
                        className="animate-ping"
                        style={{ transformOrigin: `${loc.x}px ${loc.y}px` }}
                      />
                    )}
                    {/* Node base */}
                    <circle 
                      cx={loc.x} 
                      cy={loc.y} 
                      r={isActive ? "10" : "7"} 
                      fill={isActive ? "#FF6B00" : "#121212"} 
                      stroke={isActive ? "#FFFFFF" : "#FF6B00"} 
                      strokeWidth="2.5" 
                      className="cursor-pointer transition-colors duration-300"
                    />
                    {/* Node text */}
                    <text 
                      x={loc.x} 
                      y={loc.y - 18} 
                      textAnchor="middle" 
                      fill={isActive ? "#FFFFFF" : "#B3B3B3"} 
                      className="text-xs font-bold uppercase tracking-wider select-none transition-colors duration-300"
                    >
                      {loc.name}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Node detail display panel */}
          <div className="relative z-10 min-h-[90px] border border-brand-border bg-brand-bg-primary/90 rounded-2xl p-4 flex gap-4 items-center backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center text-brand-accent shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                {locations.find(l => l.id === activeLoc)?.name} Node
              </h4>
              <p className="text-xs text-brand-text-secondary mt-1 leading-relaxed">
                {locations.find(l => l.id === activeLoc)?.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Sections / Scroll track */}
      <div className="relative z-0 w-full lg:w-1/2 lg:ml-[50%] flex flex-col px-6 md:px-16 pt-[20vh] pb-[20vh] gap-[40vh] md:gap-[60vh]">
        {/* Intro Story Section */}
        <div className="flex flex-col justify-center min-h-[50vh] valley-story-step" data-location-id="rk">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-4 block">Connected Valley</span>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            BUILT FOR THE VALLEY
          </h2>
          <div className="h-1 w-20 bg-brand-accent mb-8" />
          <p className="text-xl md:text-2xl font-light text-brand-text-secondary leading-relaxed mb-6">
            We don't just provide internet. We are part of this valley.
          </p>
          <p className="text-base text-brand-text-secondary leading-relaxed max-w-lg">
            Valley Computers links town centers, farms, local businesses, and communities with robust local networking. Based in Riebeek-Kasteel, our core infrastructure keeps the valley connected at 10Gbps+ speeds.
          </p>
        </div>

        {/* Riebeek West story section */}
        <div className="flex flex-col justify-center min-h-[50vh] valley-story-step" data-location-id="rw">
          <div className="flex items-center gap-3 text-brand-accent mb-4">
            <MapPin className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Riebeek West Hub</span>
          </div>
          <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            We connect homes.
          </h3>
          <p className="text-base md:text-lg text-brand-text-secondary leading-relaxed max-w-lg mb-4">
            From smart homes in the suburbs to cozy cottages in the hills, our fibre rings and high-speed wireless networks bring premium entertainment and work-from-home reliability directly to families.
          </p>
        </div>

        {/* Malmesbury story section */}
        <div className="flex flex-col justify-center min-h-[50vh] valley-story-step" data-location-id="mb">
          <div className="flex items-center gap-3 text-brand-accent mb-4">
            <MapPin className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Malmesbury Link</span>
          </div>
          <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            We connect businesses.
          </h3>
          <p className="text-base md:text-lg text-brand-text-secondary leading-relaxed max-w-lg mb-4">
            Commercial spaces, storefronts, and bakeries in Malmesbury depend on our zero-downtime solutions. Managed failovers and redundant lines keep credit card machines and SaaS tools humming.
          </p>
        </div>

        {/* Swartland story section */}
        <div className="flex flex-col justify-center min-h-[50vh] valley-story-step" data-location-id="sl">
          <div className="flex items-center gap-3 text-brand-accent mb-4">
            <MapPin className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Swartland Outpost</span>
          </div>
          <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            We connect farms & communities.
          </h3>
          <p className="text-base md:text-lg text-brand-text-secondary leading-relaxed max-w-lg mb-4">
            Where others don't go, we thrive. Our long-range wireless relays connect remote wheat, canola, and wine farms. Irrigation monitoring, IoT sensors, and homestead web access run smoothly over the Swartland hills.
          </p>
        </div>
      </div>
    </div>
  )
}
