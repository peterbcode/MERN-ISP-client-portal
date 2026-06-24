'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { Network, Server, Radio, Building, Home, ArrowDown } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const networkLayers = [
  {
    id: 'backbone',
    name: 'Internet Backbone',
    description: 'High-capacity dark fibre circuits linking to global tier-1 network exchanges.',
    icon: Network,
    delay: 0,
  },
  {
    id: 'core',
    name: 'Core Network',
    description: 'Riebeek-Kasteel HQ regional routing hub running high-performance carrier routers with redundant failover pathways.',
    icon: Server,
    delay: 0.2,
  },
  {
    id: 'towers',
    name: 'Wireless Towers',
    description: 'Strategically positioned high-elevation wireless masts providing broad, direct line-of-sight coverage over valleys.',
    icon: Radio,
    delay: 0.4,
  },
  {
    id: 'businesses',
    name: 'Businesses',
    description: 'High-availability connections customized with service level agreements (SLAs) for vital community entities.',
    icon: Building,
    delay: 0.6,
  },
  {
    id: 'homes',
    name: 'Homes',
    description: 'Lightning-fast uncapped home connections enabling 4K streaming, remote employment, and smart homes.',
    icon: Home,
    delay: 0.8,
  }
]

export default function InfrastructureShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create ScrollTrigger timeline for layer reveals and lines
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play none none reverse',
        }
      })

      // Animate layers sliding and fading in
      tl.fromTo('.infra-layer-card', 
        { opacity: 0, x: -30 }, 
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' }
      )

      // Draw vertical backbone path line
      .fromTo('.infra-backbone-line',
        { strokeDashoffset: 1000 },
        { strokeDashoffset: 0, duration: 1.5, ease: 'power1.inOut' },
        '-=1.2'
      )

      // Start data packet animations
      gsap.to('.infra-packet', {
        strokeDashoffset: -200,
        duration: 3,
        repeat: -1,
        ease: 'none',
        stagger: 0.5
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={containerRef}
      className="relative py-24 md:py-36 bg-brand-bg-secondary text-brand-text-primary overflow-hidden border-t border-b border-brand-border"
      id="infrastructure"
    >
      {/* Texture Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,0,0.02)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-20 md:mb-28">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-accent mb-4 block">Our Architecture</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            ENGINEERED FOR RELIABILITY
          </h2>
          <div className="h-1 w-24 bg-brand-accent mx-auto mb-6" />
          <p className="text-brand-text-secondary md:text-lg font-light leading-relaxed">
            From tier-1 fiber backbone loops to regional high-altitude wireless relays and home connections, see how data moves through our custom stack.
          </p>
        </div>

        {/* Network pipeline visualization */}
        <div className="relative flex flex-col md:grid md:grid-cols-[1fr_80px_1.5fr] gap-8 md:gap-0 max-w-4xl mx-auto">
          {/* Vertical Connecting Line SVG (Visible on desktop) */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-5 -ml-2.5 z-0">
            <svg className="w-full h-full" viewBox="0 0 20 800" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Backing connection line */}
              <line x1="10" y1="0" x2="10" y2="800" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
              {/* Glowing active backbone line */}
              <path 
                className="infra-backbone-line" 
                d="M 10 0 L 10 800" 
                stroke="#FF6B00" strokeWidth="3" strokeDasharray="1000" strokeDashoffset="1000" 
              />
              {/* Traveling packet dashes */}
              <path 
                className="infra-packet" 
                d="M 10 0 L 10 800" 
                stroke="#FFFFFF" strokeWidth="4" strokeDasharray="20 180" strokeDashoffset="0" 
                style={{ filter: 'drop-shadow(0px 0px 8px #FF6B00)' }}
              />
            </svg>
          </div>

          {/* Render layers */}
          {networkLayers.map((layer, index) => {
            const isLeft = index % 2 === 0
            const LayerIcon = layer.icon

            return (
              <div 
                key={layer.id}
                className="infra-layer-card relative z-10 flex flex-col md:grid md:grid-cols-[1fr_80px_1fr] md:col-span-3 items-center group mb-8 md:mb-16 last:mb-0"
              >
                {/* Text Side */}
                <div className={`w-full ${isLeft ? 'md:text-right md:order-1' : 'md:text-left md:order-3'}`}>
                  <div className={`p-6 border border-brand-border bg-brand-card rounded-2xl transition-all duration-300 group-hover:border-brand-accent/30 group-hover:shadow-[0_4px_24px_rgba(255,107,0,0.08)] backdrop-blur-md`}>
                    <div className={`inline-flex p-3 rounded-xl bg-brand-accent/5 border border-brand-accent/20 text-brand-accent mb-4 group-hover:bg-brand-accent group-hover:text-black transition-colors duration-300`}>
                      <LayerIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{layer.name}</h3>
                    <p className="text-sm text-brand-text-secondary leading-relaxed">
                      {layer.description}
                    </p>
                  </div>
                </div>

                {/* Node center sphere */}
                <div className="hidden md:flex justify-center items-center md:order-2">
                  <div className="relative w-12 h-12 rounded-full border border-brand-border bg-brand-bg-primary flex items-center justify-center transition-all duration-300 group-hover:border-brand-accent group-hover:scale-110">
                    <div className="w-4 h-4 rounded-full bg-brand-border group-hover:bg-brand-accent animate-pulse" />
                  </div>
                </div>

                {/* Empty side spacer */}
                <div className={`w-full hidden md:block ${isLeft ? 'md:order-3' : 'md:order-1'}`} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
