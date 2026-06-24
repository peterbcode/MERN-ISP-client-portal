'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ArrowRight, Cpu, Radio, Shield, HelpCircle } from 'lucide-react'

export default function HeroRedesign() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadlineRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 0-4s Page Load Animation timeline
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // 0-1s: Fade in background
      tl.to(svgRef.current, {
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
      })

      // 1-2s: Network lines illuminate
      .to('.net-line', {
        strokeDashoffset: 0,
        opacity: 0.8,
        stagger: 0.1,
        duration: 1.2,
        ease: 'power1.inOut'
      }, '-=0.4')

      // 2-3s: Data particles flow (infinite repeat, starts at 2s)
      .to('.data-particle', {
        motionPath: {
          path: (i: number, target: SVGElement) => {
            const pathId = target.getAttribute('data-path-id')
            return `#${pathId}`
          },
          align: (i: number, target: SVGElement) => {
            const pathId = target.getAttribute('data-path-id')
            return `#${pathId}`
          },
          autoRotate: true,
          alignOrigin: [0.5, 0.5]
        },
        opacity: 1,
        duration: 3,
        repeat: -1,
        ease: 'none',
        stagger: {
          each: 0.5,
          repeat: -1
        }
      }, '-=0.8')

      // 3-4s: Text reveals
      .fromTo([headlineRef.current, subheadlineRef.current], 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' },
        '-=1.2'
      )
      .fromTo([statsRef.current, buttonsRef.current],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
        '-=0.6'
      )

      // Slow pulse on towers
      gsap.to('.tower-glow', {
        scale: 1.5,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: 'sine.out',
        stagger: 0.4
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const scrollToCoverage = () => {
    const el = document.getElementById('coverage')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen w-full flex flex-col justify-between bg-brand-bg-primary text-brand-text-primary overflow-hidden pt-28 pb-12 px-6 md:px-12 lg:px-24"
    >
      {/* Background Graphic: Styled Digital Valley */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-40">
        <svg 
          ref={svgRef}
          className="w-full h-full min-w-[1024px] max-h-screen opacity-0 transition-opacity duration-1000"
          viewBox="0 0 1440 900" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Defs for gradients/paths */}
          <defs>
            <linearGradient id="mountainsGrad" x1="720" y1="900" x2="720" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#050505" />
              <stop offset="100%" stopColor="#121212" />
            </linearGradient>
            <linearGradient id="orangeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF8C39" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="towerRadial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Mountains Silhouette */}
          <path d="M0 650 L180 500 L380 620 L580 430 L850 660 L1100 480 L1300 580 L1440 450 L1440 900 L0 900 Z" fill="url(#mountainsGrad)" opacity="0.6" />
          <path d="M0 720 L250 580 L520 700 L790 530 L1050 680 L1280 590 L1440 700 L1440 900 L0 900 Z" fill="#0A0A0A" />

          {/* Network Paths (Illuminating lines) */}
          <path id="path1" className="net-line" d="M150 780 Q 320 620 500 660 T 900 600 T 1300 750" stroke="#FF6B00" strokeWidth="2" fill="none" opacity="0" strokeDasharray="1000" strokeDashoffset="1000" />
          <path id="path2" className="net-line" d="M280 720 Q 450 550 720 590 T 1150 700" stroke="#FF6B00" strokeWidth="1.5" fill="none" opacity="0" strokeDasharray="1000" strokeDashoffset="1000" />
          <path id="path3" className="net-line" d="M500 660 L 720 590" stroke="#FF6B00" strokeWidth="2" strokeDasharray="500" strokeDashoffset="500" fill="none" opacity="0" />
          <path id="path4" className="net-line" d="M720 590 L 900 600" stroke="#FF6B00" strokeWidth="2" strokeDasharray="500" strokeDashoffset="500" fill="none" opacity="0" />
          <path id="path5" className="net-line" d="M900 600 L 1050 680" stroke="#FF6B00" strokeWidth="1.5" strokeDasharray="500" strokeDashoffset="500" fill="none" opacity="0" />

          {/* Data Particles flowing (animated via GSAP motionPath) */}
          <circle className="data-particle" r="4" fill="#FFFFFF" opacity="0" data-path-id="path1" style={{ filter: 'drop-shadow(0px 0px 8px #FF6B00)' }} />
          <circle className="data-particle" r="3" fill="#FF8C39" opacity="0" data-path-id="path2" style={{ filter: 'drop-shadow(0px 0px 6px #FF6B00)' }} />
          <circle className="data-particle" r="4" fill="#FFFFFF" opacity="0" data-path-id="path3" style={{ filter: 'drop-shadow(0px 0px 8px #FF6B00)' }} />
          <circle className="data-particle" r="3" fill="#FF8C39" opacity="0" data-path-id="path4" style={{ filter: 'drop-shadow(0px 0px 6px #FF6B00)' }} />

          {/* Infrastructure Nodes (Homes, Farms, Towers) */}
          {/* Towers */}
          <g transform="translate(500, 660)">
            <circle className="tower-glow" r="25" fill="url(#towerRadial)" />
            <circle r="6" fill="#FF6B00" />
            <line x1="0" y1="0" x2="0" y2="-40" stroke="#FF6B00" strokeWidth="3" />
            <line x1="-10" y1="0" x2="0" y2="-40" stroke="#FF6B00" strokeWidth="1.5" />
            <line x1="10" y1="0" x2="0" y2="-40" stroke="#FF6B00" strokeWidth="1.5" />
          </g>

          <g transform="translate(900, 600)">
            <circle className="tower-glow" r="30" fill="url(#towerRadial)" />
            <circle r="7" fill="#FF6B00" />
            <line x1="0" y1="0" x2="0" y2="-50" stroke="#FF6B00" strokeWidth="3" />
            <line x1="-12" y1="0" x2="0" y2="-50" stroke="#FF6B00" strokeWidth="1.5" />
            <line x1="12" y1="0" x2="0" y2="-50" stroke="#FF6B00" strokeWidth="1.5" />
          </g>

          {/* Farm/Home nodes */}
          <g transform="translate(150, 780)">
            <rect x="-10" y="-10" width="20" height="20" rx="3" fill="#121212" stroke="#FF6B00" strokeWidth="1.5" />
            <path d="M-12 -10 L0 -20 L12 -10 Z" fill="#FF6B00" />
          </g>
          <g transform="translate(280, 720)">
            <rect x="-8" y="-8" width="16" height="16" rx="2" fill="#121212" stroke="#FF6B00" strokeWidth="1.5" />
            <path d="M-10 -8 L0 -16 L10 -8 Z" fill="#FF6B00" />
          </g>
          <g transform="translate(720, 590)">
            <circle r="12" fill="#121212" stroke="#FF6B00" strokeWidth="2" />
            <rect x="-6" y="-6" width="12" height="12" fill="#FF6B00" />
          </g>
          <g transform="translate(1150, 700)">
            <rect x="-9" y="-9" width="18" height="18" rx="2" fill="#121212" stroke="#FF6B00" strokeWidth="1.5" />
            <path d="M-11 -9 L0 -18 L11 -9 Z" fill="#FF6B00" />
          </g>
          <g transform="translate(1300, 750)">
            <rect x="-11" y="-11" width="22" height="22" rx="3" fill="#121212" stroke="#FF6B00" strokeWidth="1.5" />
            <path d="M-13 -11 L0 -22 L13 -11 Z" fill="#FF6B00" />
          </g>
        </svg>
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center max-w-4xl mx-auto select-none mt-12 md:mt-20">
        {/* Subhead Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 border border-brand-border bg-brand-card rounded-full text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent mb-8 shadow-sm backdrop-blur-md"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse text-brand-accent" />
          The Digital Backbone of Swartland
        </motion.div>

        {/* Headline */}
        <h1 
          ref={headlineRef} 
          className="opacity-0 font-extrabold text-white leading-[0.95] tracking-[-0.04em] mb-6 text-5xl md:text-7xl lg:text-8xl select-none"
          style={{ textShadow: '0 0 40px rgba(255,255,255,0.05)' }}
        >
          TECHNOLOGY<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-orange-500 to-amber-500">
            WITHOUT LIMITS
          </span>
        </h1>

        {/* Subheadline */}
        <p 
          ref={subheadlineRef} 
          className="opacity-0 text-brand-text-secondary text-lg md:text-2xl font-light tracking-wide max-w-2xl mb-12"
        >
          Premium Internet. &bull; Expert IT. &bull; Local Support.
        </p>

        {/* Actions Buttons */}
        <div ref={buttonsRef} className="opacity-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
          <button 
            onClick={scrollToCoverage}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-brand-accent hover:bg-orange-600 text-white rounded-full font-bold tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,107,0,0.4)] cursor-pointer"
          >
            Check Coverage
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          
          <button 
            onClick={() => router.push('/contact')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-brand-border hover:border-brand-accent bg-brand-card hover:bg-white/[0.02] text-white rounded-full font-semibold tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            Get Support
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div 
        ref={statsRef}
        className="opacity-0 relative z-10 w-full grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-brand-border bg-black/40 backdrop-blur-md max-w-6xl mx-auto rounded-2xl"
      >
        <div className="flex flex-col items-center justify-center text-center px-4 border-r border-brand-border/40 last:border-0">
          <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">99%</span>
          <span className="text-xs md:text-sm text-brand-text-secondary uppercase tracking-[0.1em] mt-1 font-semibold">Uptime</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4 md:border-r border-brand-border/40 last:border-0">
          <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">5000+</span>
          <span className="text-xs md:text-sm text-brand-text-secondary uppercase tracking-[0.1em] mt-1 font-semibold">Devices Managed</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4 border-r border-brand-border/40 last:border-0">
          <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">24/7</span>
          <span className="text-xs md:text-sm text-brand-text-secondary uppercase tracking-[0.1em] mt-1 font-semibold">Monitoring</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4 last:border-0">
          <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Same-Day</span>
          <span className="text-xs md:text-sm text-brand-text-secondary uppercase tracking-[0.1em] mt-1 font-semibold">Support</span>
        </div>
      </div>
    </div>
  )
}
