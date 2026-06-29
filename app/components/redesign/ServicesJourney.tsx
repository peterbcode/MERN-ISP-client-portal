'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { Wifi, Radio, Server, ShieldCheck, Cpu, ArrowRight } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const services = [
  {
    id: 'fibre',
    title: 'Fibre Internet',
    subtitle: 'High-speed light-guided connectivity',
    description: 'Uncapped, unshaped pure optical fibre to the home. Experience gigabit capability with low latency, unaffected by weather conditions.',
    icon: Wifi,
    stats: ['Up to 1000Mbps', '100% Uncapped', 'No contracts'],
  },
  {
    id: 'wireless',
    title: 'Wireless Internet',
    subtitle: 'Long-range air-bridged coverage',
    description: 'Custom high-altitude dishes connecting remote farms, vineyards, and Swartland smallholdings. Robust service, even in remote regions.',
    icon: Radio,
    stats: ['Up to 100Mbps', '99.9% Tower Uptime', 'Solar backup powered'],
  },
  {
    id: 'networking',
    title: 'Network Engineering',
    subtitle: 'Enterprise-grade systems architecture',
    description: 'Tailored local network topologies, corporate cabling, managed switches, secure VPN access, and comprehensive wireless coverage solutions.',
    icon: Server,
    stats: ['10G Core backbone', 'Proactive security', 'Hardware warranty'],
  },
  {
    id: 'support',
    title: 'IT Support',
    subtitle: '24/7 Remote & on-site technical solutions',
    description: 'System health monitoring, automatic cloud backups, client management dashboards, server routing maintenance, and rapid troubleshooting.',
    icon: ShieldCheck,
    stats: ['24/7 Monitoring', 'Remote agent assistance', 'SLA contracts available'],
  },
  {
    id: 'repairs',
    title: 'PC Repairs',
    subtitle: 'Precision hardware engineering',
    description: 'Comprehensive lab repairs, component diagnostic testing, performance upgrades, solid-state drive (SSD) conversions, and data rescue.',
    icon: Cpu,
    stats: ['Same-day diagnostics', 'Data retrieval labs', 'Quality parts guaranteed'],
  }
]

export default function ServicesJourney() {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftVisualRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState<number>(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: leftVisualRef.current,
          pinSpacing: false,
          id: 'services-pin',
        })
      })

      const steps = gsap.utils.toArray('.service-step-trigger') as HTMLElement[]
      steps.forEach((step, idx) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActiveIdx(idx),
          onEnterBack: () => setActiveIdx(idx),
        })
      })

      return () => mm.revert()
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[500vh] w-full bg-brand-bg-primary text-brand-text-primary"
      id="services"
    >
      {/* LEFT: Pinned Visual Column (Desktop only) */}
      <div 
        ref={leftVisualRef}
        className="hidden lg:flex absolute left-0 top-0 w-1/2 h-screen items-center justify-center p-16 z-10 bg-brand-bg-primary border-r border-brand-border"
      >
        <div className="relative w-full h-[85%] rounded-xl border border-brand-border bg-brand-bg-secondary overflow-hidden flex items-center justify-center">
          {/* Animated Matrix grid backing */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,107,0,0.015)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* SERVICE 1: Fibre Animated SVG */}
          {activeIdx === 0 && (
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Core line */}
                <path d="M 50 200 C 150 100, 250 300, 350 200" stroke="rgba(255,107,0,0.15)" strokeWidth="8" strokeLinecap="round" />
                <path className="animate-fibre-glow" d="M 50 200 C 150 100, 250 300, 350 200" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" strokeDasharray="300" strokeDashoffset="300" />
                <circle cx="50" cy="200" r="6" fill="#FF6B00" />
                <circle cx="350" cy="200" r="6" fill="#FF6B00" />
                {/* Secondary light lines */}
                <path d="M 50 200 C 150 150, 250 250, 350 200" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                {/* Speed particle */}
                <circle r="4" fill="#FFFFFF" style={{ offsetPath: "path('M 50 200 C 150 100, 250 300, 350 200')", animation: 'moveParticle 2s infinite linear' }} />
              </svg>
            </div>
          )}

          {/* SERVICE 2: Wireless Propagation */}
          {activeIdx === 1 && (
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <svg className="w-full h-[70%]" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Sending Dish */}
                <g transform="translate(100, 150)">
                  <path d="M -15 -30 C -30 -15, -30 15, -15 30 L 0 0 Z" fill="#FF6B00" opacity="0.8" />
                  <line x1="0" y1="0" x2="30" y2="0" stroke="#FF6B00" strokeWidth="3" />
                  <circle cx="30" cy="0" r="4" fill="#FFFFFF" />
                </g>
                {/* Propagation Waves */}
                <circle cx="130" cy="150" r="20" stroke="#FF6B00" strokeWidth="2" className="animate-wifi-pulse-1" opacity="0" />
                <circle cx="130" cy="150" r="50" stroke="#FF6B00" strokeWidth="2.5" className="animate-wifi-pulse-2" opacity="0" />
                <circle cx="130" cy="150" r="80" stroke="#FF6B00" strokeWidth="1.5" className="animate-wifi-pulse-3" opacity="0" />
                {/* Receiving Mast */}
                <g transform="translate(300, 150)">
                  <line x1="0" y1="50" x2="0" y2="-40" stroke="#FF6B00" strokeWidth="3" />
                  <circle cx="0" cy="-40" r="6" fill="#FFFFFF" />
                  <path d="M -10 -25 L 0 -40 L 10 -25" stroke="#FF6B00" strokeWidth="2" fill="none" />
                </g>
              </svg>
            </div>
          )}

          {/* SERVICE 3: Network Engineering Rack */}
          {activeIdx === 2 && (
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <div className="w-[200px] h-[340px] border border-brand-border rounded-xl bg-brand-bg-primary p-4 flex flex-col justify-between relative shadow-2xl">
                {/* Grid vents */}
                <div className="absolute top-0 left-0 right-0 h-4 border-b border-brand-border bg-black/40 flex items-center justify-around px-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
                {/* Shelves */}
                {[1, 2, 3, 4].map((shelf) => (
                  <div key={shelf} className="h-14 border border-brand-border/60 bg-brand-bg-secondary rounded-lg flex items-center justify-between px-3 relative overflow-hidden group">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-2.5 h-2.5 rounded bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-brand-accent" />
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-brand-text-secondary font-mono">U{shelf}</span>
                    </div>
                    {/* Blinkers */}
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: `${shelf * 0.15}s` }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" style={{ animationDelay: `${shelf * 0.3}s` }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: `${shelf * 0.45}s` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SERVICE 4: IT Support Telemetry */}
          {activeIdx === 3 && (
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <svg className="w-full h-2/3 border border-brand-border rounded-2xl bg-brand-bg-primary p-6 shadow-2xl" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Grid backdrop */}
                <line x1="40" y1="40" x2="360" y2="40" stroke="rgba(255,255,255,0.03)" />
                <line x1="40" y1="80" x2="360" y2="80" stroke="rgba(255,255,255,0.03)" />
                <line x1="40" y1="120" x2="360" y2="120" stroke="rgba(255,255,255,0.03)" />
                <line x1="40" y1="160" x2="360" y2="160" stroke="rgba(255,255,255,0.03)" />
                <line x1="40" y1="200" x2="360" y2="200" stroke="rgba(255,255,255,0.06)" />

                {/* Telemetry line */}
                <path d="M 40 180 L 80 150 L 120 160 L 160 110 L 200 130 L 240 60 L 280 90 L 320 40 L 360 80" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 40 180 L 80 150 L 120 160 L 160 110 L 200 130 L 240 60 L 280 90 L 320 40 L 360 80 L 360 200 L 40 200 Z" fill="url(#telemetryGrad)" />
                
                {/* Glow circle */}
                <circle cx="320" cy="40" r="5" fill="#FFFFFF" style={{ filter: 'drop-shadow(0px 0px 6px #FF6B00)' }} />

                <defs>
                  <linearGradient id="telemetryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          )}

          {/* SERVICE 5: Exploded PC Assembly */}
          {activeIdx === 4 && (
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <svg className="w-full h-full max-h-[360px] animate-float-exploded" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Motherboard base layer */}
                <rect x="80" y="200" width="240" height="120" rx="6" fill="#121212" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" transform="rotate(-25 200 260)" />
                {/* Chip floating above */}
                <rect className="exploded-chip" x="170" y="100" width="60" height="60" rx="4" fill="#0A0A0A" stroke="#FF6B00" strokeWidth="2" transform="rotate(-25 200 130)" />
                {/* Lines tracing socket */}
                <line x1="200" y1="130" x2="200" y2="230" stroke="#FF6B00" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                <line x1="170" y1="120" x2="160" y2="240" stroke="#FF6B00" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                <line x1="230" y1="140" x2="240" y2="220" stroke="#FF6B00" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Story scroll sections */}
      <div className="relative z-0 w-full lg:w-1/2 lg:ml-[50%] flex flex-col">
        {services.map((service) => {
          const ServiceIcon = service.icon

          return (
            <div 
              key={service.id}
              className="service-step-trigger w-full min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 py-16"
            >
              {/* Standalone card style visible on mobile, simple container on desktop */}
              <div className="p-6 md:p-12 border border-transparent lg:border-none bg-brand-bg-secondary lg:bg-transparent rounded-xl border-brand-border/40">
                
                {/* Mobile visual backdrop (hidden on desktop) */}
                <div className="lg:hidden flex items-center justify-center p-6 border border-brand-border bg-brand-bg-primary rounded-lg mb-8 relative overflow-hidden h-[180px]">
                  {ServiceIcon && (
                    <div className="w-16 h-16 rounded-lg bg-brand-accent/10 border border-brand-accent/30 text-brand-accent flex items-center justify-center">
                      <ServiceIcon className="w-8 h-8" />
                    </div>
                  )}
                  {/* Subtle decorative circles */}
                  <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full border border-brand-accent/10 animate-pulse" />
                </div>

                <div className="flex items-center gap-3 text-brand-accent mb-4">
                  <div className="hidden lg:flex p-2 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent rounded-lg">
                    <ServiceIcon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-normal">{service.subtitle}</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-normal text-white mb-6">
                  {service.title}
                </h2>
                
                <p className="text-base md:text-lg text-brand-text-secondary leading-relaxed mb-8 max-w-lg">
                  {service.description}
                </p>

                {/* Key stats */}
                <div className="flex flex-col gap-3 border-t border-brand-border pt-6 mb-8 max-w-md">
                  {service.stats.map((stat, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                      <span className="text-sm font-semibold text-white tracking-normal">{stat}</span>
                    </div>
                  ))}
                </div>

                {/* Contact CTA */}
                <a 
                  href="/contact" 
                  className="group inline-flex items-center gap-2 text-sm font-bold text-brand-accent hover:text-white transition-colors duration-300"
                >
                  Configure package
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          )
        })}
      </div>

      {/* Styled animation components inline */}
      <style>{`
        /* GSAP Fibre line path glow */
        @keyframes moveParticle {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        .animate-fibre-glow {
          animation: drawFibre 4s infinite ease-in-out;
        }
        @keyframes drawFibre {
          0%, 100% { stroke-dashoffset: 300; }
          50% { stroke-dashoffset: 0; }
        }

        /* Wifi pulses */
        .animate-wifi-pulse-1 {
          animation: wifiPulse 2s infinite ease-out;
        }
        .animate-wifi-pulse-2 {
          animation: wifiPulse 2s infinite ease-out;
          animation-delay: 0.4s;
        }
        .animate-wifi-pulse-3 {
          animation: wifiPulse 2s infinite ease-out;
          animation-delay: 0.8s;
        }
        @keyframes wifiPulse {
          0% { r: 10; opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.1; }
          100% { r: 120; opacity: 0; }
        }

        /* Exploded PC float */
        .animate-float-exploded {
          animation: explodedFloat 5s infinite ease-in-out;
        }
        .exploded-chip {
          animation: explodedChip 5s infinite ease-in-out;
        }
        @keyframes explodedFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes explodedChip {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-25deg); }
          50% { transform: translate3d(-10px, -24px, 0) rotate(-28deg); }
        }
      `}</style>
    </div>
  )
}
