'use client'

import { useEffect, useMemo, useState } from 'react'
import { WifiIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { SoftButton } from '@/components/ui/soft-button'
import Link from 'next/link'

const rotatingWords = ['Connections', 'Networks', 'Coverage', 'Solutions']

const TYPE_SPEED_BASE = 95
const TYPE_SPEED_VARIANCE = 55
const DELETE_SPEED_BASE = 55
const DELETE_SPEED_VARIANCE = 30
const HOLD_DELAY = 1200
const NEXT_WORD_DELAY = 220

const HeroSoft = () => {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = rotatingWords[wordIndex]
    let timeout: NodeJS.Timeout

    if (!isDeleting && displayText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), HOLD_DELAY)
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setWordIndex((prev) => (prev + 1) % rotatingWords.length)
    } else {
      const typeSpeed = isDeleting
        ? DELETE_SPEED_BASE + Math.random() * DELETE_SPEED_VARIANCE
        : TYPE_SPEED_BASE + Math.random() * TYPE_SPEED_VARIANCE

      timeout = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting ? prev.slice(0, -1) : currentWord.slice(0, prev.length + 1)
        )
      }, typeSpeed)
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, wordIndex])

  return (
    <section className="section-soft relative overflow-hidden bg-gradient-soft">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-bg-secondary/50" />
      </div>

      <div className="container-soft relative">
        <div className="grid-soft-2 items-center gap-16 lg:gap-24">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex">
              <div className="soft-card-inset px-4 py-2">
                <span className="text-xs font-medium text-accent-primary">
                  🌐 Western Cape's Trusted ISP
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-text-primary">
                Reliable
                <br />
                <span className="text-gradient-soft">{displayText}</span>
                <span className="text-accent-primary animate-pulse">|</span>
              </h1>
              <p className="text-lg lg:text-xl text-text-secondary leading-relaxed max-w-lg">
                Providing high-speed fibre, wireless internet, and comprehensive IT solutions 
                for homes and businesses throughout the Western Cape.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <SoftButton className="w-full sm:w-auto group">
                  Get Started
                  <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </SoftButton>
              </Link>
              <Link href="/isp">
                <SoftButton variant="ghost" className="w-full sm:w-auto">
                  View Plans
                </SoftButton>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">500+</div>
                <div className="text-sm text-text-tertiary">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">99%</div>
                <div className="text-sm text-text-tertiary">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">24/7</div>
                <div className="text-sm text-text-tertiary">Support</div>
              </div>
            </div>
          </div>

          {/* Right Content - Network Visualization */}
          <div className="relative h-96 lg:h-full min-h-96">
            {/* Central Hub */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="soft-card p-4 hover-lift">
                <WifiIcon className="h-8 w-8 text-accent-primary" />
                <div className="text-xs font-medium mt-2 text-center">Core Hub</div>
              </div>
            </div>

            {/* Network Nodes */}
            {[
              { id: 1, x: '20%', y: '30%', label: 'Router A', delay: '0s' },
              { id: 2, x: '70%', y: '25%', label: 'Server B', delay: '0.3s' },
              { id: 3, x: '75%', y: '70%', label: 'Client C', delay: '0.6s' },
              { id: 4, x: '25%', y: '75%', label: 'Router D', delay: '0.9s' },
              { id: 5, x: '50%', y: '15%', label: 'AP E', delay: '1.2s' },
            ].map((node) => (
              <div
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: node.x, top: node.y }}
              >
                <div 
                  className="soft-card p-3 hover-lift animate-fade-in"
                  style={{ animationDelay: node.delay }}
                >
                  <div className="h-4 w-4 rounded-full bg-accent-primary/20 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-accent-primary" />
                  </div>
                  <div className="text-xs text-text-tertiary mt-1 text-center">{node.label}</div>
                </div>
              </div>
            ))}

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {[{ x1: 50, y1: 50, x2: 20, y2: 30 }, { x1: 50, y1: 50, x2: 70, y2: 25 }].map((line, i) => (
                <line
                  key={i}
                  x1={`${line.x1}%`}
                  y1={`${line.y1}%`}
                  x2={`${line.x2}%`}
                  y2={`${line.y2}%`}
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
    </section>
  )
}

export default HeroSoft
