'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, HelpCircle, Activity } from 'lucide-react'

export default function FinalCTA() {
  const router = useRouter()

  const scrollToCoverage = () => {
    const el = document.getElementById('coverage')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      className="relative h-screen w-full flex flex-col items-center justify-center bg-brand-bg-primary text-brand-text-primary overflow-hidden px-6 text-center"
      id="cta"
    >
      {/* Night Valley Vector Backdrop */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-30">
        <svg 
          className="w-full h-full min-w-[1024px] max-h-screen"
          viewBox="0 0 1440 900" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="nightSky" x1="720" y1="0" x2="720" y2="900" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#020203" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Sky */}
          <rect width="1440" height="900" fill="url(#nightSky)" />

          {/* Mountains Silhouette */}
          <path d="M0 720 L300 580 L620 680 L890 530 L1150 670 L1440 550 L1440 900 L0 900 Z" fill="#050505" />
          <path d="M0 780 L200 680 L480 770 L720 620 L980 730 L1280 660 L1440 750 L1440 900 L0 900 Z" fill="#0A0A0A" />

          {/* Glowing Network paths (pulsing via CSS keyframes) */}
          <path className="animate-cta-pulse-path" d="M150 780 Q 420 590 720 620 T 1280 660" stroke="#FF6B00" strokeWidth="2.5" fill="none" opacity="0.6" strokeDasharray="12 12" />
          <path className="animate-cta-pulse-path-reverse" d="M200 680 Q 480 650 980 730" stroke="#FF6B00" strokeWidth="1.5" fill="none" opacity="0.4" strokeDasharray="8 8" />

          {/* Glowing Nodes */}
          <g transform="translate(420, 600)">
            <circle cx="0" cy="0" r="20" fill="url(#nodeGlow)" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle cx="0" cy="0" r="5" fill="#FF6B00" />
          </g>
          <g transform="translate(720, 620)">
            <circle cx="0" cy="0" r="25" fill="url(#nodeGlow)" className="animate-ping" style={{ animationDuration: '4s' }} />
            <circle cx="0" cy="0" r="6" fill="#FF6B00" />
          </g>
          <g transform="translate(980, 730)">
            <circle cx="0" cy="0" r="18" fill="url(#nodeGlow)" className="animate-ping" style={{ animationDuration: '2.5s' }} />
            <circle cx="0" cy="0" r="4" fill="#FF6B00" />
          </g>
        </svg>
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Glow Active Emblem */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 border border-brand-border bg-brand-card rounded-full text-[10px] font-bold uppercase tracking-[0.25em] text-brand-accent mb-8 shadow-sm backdrop-blur-md">
          <Activity className="w-3.5 h-3.5 animate-pulse text-brand-accent" />
          Network Status: 100% Operational
        </div>

        {/* Headline */}
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight uppercase leading-none mb-6">
          READY TO CONNECT?
        </h2>

        {/* Subtitle */}
        <p className="text-brand-text-secondary text-lg md:text-2xl font-light tracking-wide max-w-2xl mb-12">
          Experience premium internet and IT engineering engineered for the Riebeek Valley and surrounding Swartland.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
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
            Contact Us
          </button>
        </div>
      </div>

      <style>{`
        /* CTA path pulse animations */
        .animate-cta-pulse-path {
          animation: ctaPulsePath 8s infinite linear;
        }
        .animate-cta-pulse-path-reverse {
          animation: ctaPulsePath 6s infinite linear reverse;
        }
        @keyframes ctaPulsePath {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 240; }
        }
      `}</style>
    </section>
  )
}
