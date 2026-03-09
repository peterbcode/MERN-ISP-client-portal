'use client'

import { useEffect, useMemo, useState } from 'react'
import { WifiIcon } from '@heroicons/react/24/solid'

const rotatingWords = ['Connections', 'Networks', 'Coverage', 'Solutions']

const TYPE_SPEED_BASE = 95
const TYPE_SPEED_VARIANCE = 55
const DELETE_SPEED_BASE = 55
const DELETE_SPEED_VARIANCE = 30
const HOLD_DELAY = 1200
const NEXT_WORD_DELAY = 220

const Hero = () => {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  const nodes = useMemo(
    () => [
      { id: 1, x: '14%', y: '28%', size: 'h-2.5 w-2.5', delay: '0s' },
      { id: 2, x: '28%', y: '62%', size: 'h-2 w-2', delay: '0.6s' },
      { id: 3, x: '46%', y: '24%', size: 'h-3 w-3', delay: '1.1s' },
      { id: 4, x: '61%', y: '56%', size: 'h-2.5 w-2.5', delay: '1.7s' },
      { id: 5, x: '74%', y: '34%', size: 'h-2 w-2', delay: '0.9s' },
      { id: 6, x: '86%', y: '66%', size: 'h-3 w-3', delay: '1.4s' },
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
      className="relative min-h-[76vh] overflow-hidden bg-[#050505] text-white lg:min-h-[84vh]"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
        setPointer({ x, y })
      }}
      onMouseLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(243,111,0,0.22),transparent_42%),radial-gradient(circle_at_85%_10%,rgba(243,111,0,0.14),transparent_35%),linear-gradient(to_bottom,rgba(0,0,0,0.45),rgba(0,0,0,0.92))]" />
      <div className="hero-noise absolute inset-0 opacity-20" />
      <div className="hero-aurora absolute inset-0 opacity-55" />
      <div className="hero-scan absolute inset-0 opacity-45" />
      <div className="hero-orbital absolute inset-0 opacity-45" />
      <div className="hero-grid absolute inset-0 opacity-25" />

      <div
        className="pointer-events-none absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${pointer.x * 8}px, ${pointer.y * 8}px, 0)`,
        }}
      >
        <div className="absolute left-[10%] top-[20%] h-56 w-56 rounded-full bg-[#f36f00]/20 blur-3xl" />
        <div className="absolute bottom-[14%] right-[12%] h-72 w-72 rounded-full bg-[#f36f00]/15 blur-3xl" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 transition-transform duration-500 ease-out"
        style={{
          transform: `translate3d(${pointer.x * -10}px, ${pointer.y * -10}px, 0)`,
        }}
      >
        <div className="absolute left-[16%] top-[31%] h-px w-[23%] rotate-6 bg-gradient-to-r from-transparent via-[#f36f00]/30 to-transparent" />
        <div className="absolute left-[30%] top-[58%] h-px w-[30%] -rotate-12 bg-gradient-to-r from-transparent via-[#f36f00]/26 to-transparent" />
        <div className="absolute right-[18%] top-[38%] h-px w-[18%] -rotate-6 bg-gradient-to-r from-transparent via-[#f36f00]/30 to-transparent" />
        {nodes.map((node) => (
          <span
            key={node.id}
            className={`node-pulse absolute rounded-full border border-[#f8a258]/45 bg-[#f36f00]/70 shadow-[0_0_16px_rgba(243,111,0,0.65)] ${node.size}`}
            style={{ left: node.x, top: node.y, animationDelay: node.delay }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pb-6 pt-32 text-center sm:px-6 lg:px-8 lg:pb-10 lg:pt-40">
        <WifiIcon className="hero-wifi-flash h-6 w-6 text-[#f36f00]" />
        <h1 className="mt-6 max-w-5xl text-4xl font-black leading-[0.9] tracking-[-0.02em] sm:text-5xl lg:text-8xl">
          <span className="block text-[#f36f00] drop-shadow-[0_0_24px_rgba(243,111,0,0.35)]">We Build</span>
          <span className="block min-h-[1.05em] text-white [text-shadow:0_0_26px_rgba(255,255,255,0.12)]">
            {displayText}
            <span className="ml-1 inline-block h-[0.9em] w-[0.08em] animate-[cursor-blink_1s_steps(1,end)_infinite] bg-[#f36f00] align-[-0.08em]" />
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-zinc-300 sm:mt-8 sm:text-lg lg:text-xl">
          From blazing-fast Fibre &amp; Wireless to expert PC repairs and full network engineering - we keep Riebeek Valley connected.
        </p>

        <div className="mt-8 flex w-full max-w-2xl flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
          <button className="w-full rounded-full bg-[#f36f00] px-6 py-3 text-base font-bold text-white shadow-[0_0_28px_rgba(243,111,0,0.45)] transition hover:-translate-y-0.5 hover:brightness-110 sm:w-auto sm:px-8 sm:py-4 sm:text-lg">
            Get Connected
          </button>
          <button className="w-full rounded-full border border-zinc-700 bg-zinc-900/70 px-6 py-3 text-base font-bold text-zinc-100 transition hover:border-[#f36f00]/70 hover:bg-zinc-800/85 sm:w-auto sm:px-8 sm:py-4 sm:text-lg">
            Explore Services
          </button>
        </div>

      </div>
    </section>
  )
}

export default Hero


