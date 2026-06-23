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
      className="shapes-container shape-cursor-body relative min-h-[76vh] overflow-hidden lg:min-h-[84vh]"
    >
        <div className="shape-cursor-content">
          <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pb-12 pt-40 text-center sm:px-6 lg:px-8 lg:pb-16 lg:pt-48">
            <WifiIcon className="hero-wifi-flash h-6 w-6 text-[#ff7e26]" />
            <h1 ref={headlineRef} className="hero-headline mt-10 max-w-5xl font-black leading-[0.9] tracking-[-0.03em] text-black" style={{ fontSize: 'clamp(4.5rem, 9vw, 7rem)' }}>
              <span className="word">Riebeek</span>{' '}
              <span className="word">Valley's</span>{' '}
              <span className="word">Local</span>{' '}
              <span className="word">ISP</span>{' '}
              <span className="word">&amp;</span>{' '}
              <span className="word">IT</span>{' '}
              <span className="word">Experts</span>
              <span className="block min-h-[1.05em]">
                {displayText}
              </span>
            </h1>

            <p className="hero-subtitle mx-auto mt-10 max-w-3xl text-base leading-relaxed text-black sm:mt-12 sm:text-lg lg:text-xl">
              High-speed internet and expert IT support for homes and businesses across the Riebeek Valley.
            </p>

            <div className="mt-8 flex w-full max-w-2xl justify-center sm:mt-10">
              <PremiumButton
                variant="primary" className="hero-cta cta-highlight"
                size="lg"
                onClick={() => router.push('/isp#plans')}
              >
                Get Connected
              </PremiumButton>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Hero
