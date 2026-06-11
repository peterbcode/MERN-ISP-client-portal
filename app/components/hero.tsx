'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { WifiIcon } from '@heroicons/react/24/solid'
import PremiumButton from './ui/premium-button'
import { runHeroAnimations, initHeroTilt } from './animations/heroAnimations'

const rotatingWords = ['Connections', 'Networks', 'Coverage', 'Solutions']

const TYPE_SPEED_BASE = 95
const TYPE_SPEED_VARIANCE = 55
const DELETE_SPEED_BASE = 55
const DELETE_SPEED_VARIANCE = 30
const HOLD_DELAY = 1200
const NEXT_WORD_DELAY = 220
const heroImageUrl = '/hero-riebeek-valley.png'

const Hero = () => {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const router = useRouter()

  const containerRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!containerRef.current || !headlineRef.current) return
    const cleanupAnim = runHeroAnimations(containerRef.current)
    const cleanupTilt = initHeroTilt(containerRef.current, headlineRef.current)
    return () => { cleanupAnim?.(); cleanupTilt(); }
  }, [])

  const nodes = useMemo(
    () => [
      { id: 1, x: '14%', y: '28%', size: 'h-2.5 w-2.5', delay: '0s', type: 'router' },
      { id: 2, x: '28%', y: '62%', size: 'h-2 w-2', delay: '0.6s', type: 'server' },
      { id: 3, x: '46%', y: '24%', size: 'h-3 w-3', delay: '1.1s', type: 'core' },
      { id: 4, x: '61%', y: '56%', size: 'h-2.5 w-2.5', delay: '1.7s', type: 'router' },
      { id: 5, x: '74%', y: '34%', size: 'h-2 w-2', delay: '0.9s', type: 'client' },
      { id: 6, x: '86%', y: '66%', size: 'h-3 w-3', delay: '1.4s', type: 'server' },
    ],
    [],
  )

  const connections = useMemo(
    () => [
      { from: 1, to: 3 },
      { from: 3, to: 4 },
      { from: 2, to: 4 },
      { from: 4, to: 5 },
      { from: 4, to: 6 },
      { from: 1, to: 2 },
    ],
    [],
  )

  useEffect(() => {
    const currentWord = rotatingWords[wordIndex]
    let timeout: NodeJS.Timeout

    if (!isDeleting && displayText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), HOLD_DELAY)
    } else if (isDeleting && displayText === '') {
      timeout = setTimeout(() => {
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % rotatingWords.length)
      }, NEXT_WORD_DELAY)
    } else {
      const randomDelay = isDeleting
        ? DELETE_SPEED_BASE + Math.floor(Math.random() * DELETE_SPEED_VARIANCE)
        : TYPE_SPEED_BASE + Math.floor(Math.random() * TYPE_SPEED_VARIANCE)

      timeout = setTimeout(() => {
        const nextText = isDeleting
          ? currentWord.slice(0, displayText.length - 1)
          : currentWord.slice(0, displayText.length + 1)

        setDisplayText(nextText)
      }, randomDelay)
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, wordIndex])

  return (
    <section
      ref={containerRef}
      className="hero-section metal-bg relative min-h-[76vh] overflow-hidden text-white lg:min-h-[84vh]"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
        setPointer({ x, y })
      }}
      onMouseLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${heroImageUrl}')` }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="hero-glow absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
      <div className="hero-grid absolute inset-0 opacity-10" />

      <div
        className="pointer-events-none absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${pointer.x * 4}px, ${pointer.y * 4}px, 0)`,
        }}
      >
        <div className="absolute left-[10%] top-[20%] h-56 w-56 rounded-full bg-[#22c55e]/10 blur-3xl" />
        <div className="absolute bottom-[14%] right-[12%] h-72 w-72 rounded-full bg-[#3b82f6]/8 blur-3xl" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 transition-transform duration-500 ease-out"
        style={{
          transform: `translate3d(${pointer.x * -6}px, ${pointer.y * -6}px, 0)`,
        }}
      >
        {/* Simplified network connection lines */}
        {connections.map((connection, index) => {
          const fromNode = nodes.find(n => n.id === connection.from)
          const toNode = nodes.find(n => n.id === connection.to)
          if (!fromNode || !toNode) return null
          
          return (
            <div
              key={`connection-${index}`}
              className="absolute h-px bg-gradient-to-r from-transparent via-[#22c55e]/30 to-transparent"
              style={{
                left: fromNode.x,
                top: fromNode.y,
                width: '100px',
                transform: `rotate(${Math.atan2(
                  parseFloat(toNode.y) - parseFloat(fromNode.y),
                  parseFloat(toNode.x) - parseFloat(fromNode.x)
                ) * 180 / Math.PI}deg)`,
                transformOrigin: '0 50%',
              }}
            />
          )
        })}
        
        {/* Simplified network nodes */}
        {nodes.map((node) => (
          <span
            key={node.id}
            className={`node-pulse absolute rounded-full border shadow-lg ${
              node.type === 'core' 
                ? 'border-[#ff7e26]/40 bg-[#ff7e26]/50 shadow-[0_0_12px_rgba(255,126,38,0.4)]' 
                : node.type === 'router'
                ? 'border-[#22c55e]/30 bg-[#22c55e]/40 shadow-[0_0_8px_rgba(34,197,94,0.3)]'
                : node.type === 'server'
                ? 'border-[#3b82f6]/30 bg-[#3b82f6]/40 shadow-[0_0_8px_rgba(59,130,246,0.3)]'
                : 'border-[#f8a258]/25 bg-[#ff7e26]/30 shadow-[0_0_6px_rgba(255,126,38,0.2)]'
            } ${node.size}`}
            style={{ left: node.x, top: node.y, animationDelay: node.delay }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`h-1 w-1 rounded-full bg-white ${
                node.type === 'core' ? 'animate-pulse' : ''
              }`} />
            </div>
          </span>
        ))}
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pb-6 pt-32 text-center sm:px-6 lg:px-8 lg:pb-10 lg:pt-40">
        <WifiIcon className="hero-wifi-flash h-6 w-6 text-[#ff7e26]" />
        <h1 ref={headlineRef} className="hero-headline mt-6 max-w-5xl font-black leading-[0.9] tracking-[-0.03em] text-white [text-shadow:0_0_26px_rgba(255,255,255,0.12)]" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <span className="word block text-[#ff7e26] drop-shadow-[0_0_24px_rgba(255,126,38,0.35)]">Riebeek</span>{' '}
          <span className="word block text-[#ff7e26] drop-shadow-[0_0_24px_rgba(255,126,38,0.35)]">Valley's</span>{' '}
          <span className="word block text-[#ff7e26] drop-shadow-[0_0_24px_rgba(255,126,38,0.35)]">Local</span>{' '}
          <span className="word block text-[#ff7e26] drop-shadow-[0_0_24px_rgba(255,126,38,0.35)]">ISP</span>{' '}
          <span className="word block text-[#ff7e26] drop-shadow-[0_0_24px_rgba(255,126,38,0.35)]">&amp;</span>{' '}
          <span className="word block text-[#ff7e26] drop-shadow-[0_0_24px_rgba(255,126,38,0.35)]">IT</span>{' '}
          <span className="word block text-[#ff7e26] drop-shadow-[0_0_24px_rgba(255,126,38,0.35)]">Experts</span>
          <span className="block min-h-[1.05em]">
            {displayText}
          </span>
        </h1>

        <p className="hero-subtitle mx-auto mt-6 max-w-3xl text-base leading-relaxed text-[#9ca3af] sm:mt-8 sm:text-lg lg:text-xl">
          High-speed internet and expert IT support for homes and businesses across the Riebeek Valley.
        </p>

        <div className="mt-8 flex w-full max-w-2xl flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
          <PremiumButton
            variant="primary" className="hero-cta cta-highlight"
            size="lg"
            onClick={() => router.push('/isp#plans')}
          >
            Get Connected
          </PremiumButton>
          <PremiumButton
            variant="secondary" className="hero-cta cta-highlight"
            size="lg"
            onClick={() => window.location.href = '#services'}
          >
            Explore Services
          </PremiumButton>
          <PremiumButton
            variant="secondary" className="hero-cta cta-highlight"
            size="lg"
            onClick={() => window.open('https://wa.me/27799381260', '_blank')}
          >
            Chat on WhatsApp
          </PremiumButton>
        </div>

      </div>
    </section>
  )
}

export default Hero
