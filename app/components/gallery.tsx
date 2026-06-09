'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import AnimatedSection from './ui/animated-section'

const galleryItems = [
  {
    src: '/gallery/RBV-Dish.jpeg',
    alt: 'Wireless dish installation on a Riebeek Valley property',
    tag: 'Installation',
    caption: 'Precision wireless links for homes and farms',
    detail: 'Aligned for stable valley coverage',
  },
  {
    src: '/gallery/High-speed.png',
    alt: 'High-speed internet networking equipment',
    tag: 'Network',
    caption: 'High-speed equipment installed and tuned',
    detail: 'Built for clean throughput',
  },
  {
    src: '/gallery/solar-and-dish.jpeg',
    alt: 'Solar-backed dish installation',
    tag: 'Off-grid',
    caption: 'Solar-backed connectivity in the field',
    detail: 'Power-conscious site deployments',
  },
  {
    src: '/gallery/storefront.png',
    alt: 'Valley Computers storefront',
    tag: 'Support',
    caption: 'Local support with a real storefront',
    detail: 'Riebeek-Kasteel service desk',
  },
  {
    src: '/gallery/Rainbow.png',
    alt: 'Rainbow over the Riebeek Valley service area',
    tag: 'Coverage',
    caption: 'Coverage across the Riebeek Valley',
    detail: 'Local network, local terrain knowledge',
  },
  {
    src: '/gallery/tower-view.jpeg',
    alt: 'Communication tower view over the valley',
    tag: 'Infrastructure',
    caption: 'Strategic tower placement for valley coverage',
    detail: 'Elevated vantage points for reliable links',
  },
  {
    src: '/gallery/installation.jpeg',
    alt: 'Professional installation work in progress',
    tag: 'Installation',
    caption: 'Expert installation by trained technicians',
    detail: 'Clean, professional setup every time',
  },
]

const galleryStats = [
  { value: '7', label: 'field views' },
  { value: '24/7', label: 'network focus' },
  { value: 'Local', label: 'support team' },
]

function GalleryCard({
  item,
  index,
  isDragging,
}: {
  item: (typeof galleryItems)[number]
  index: number
  isDragging: boolean
}) {
  const cardRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)

  const onMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      // Don't run tilt while the user is dragging the scroll track
      if (isDragging) return
      const card = cardRef.current
      if (!card) return
      const rect = card.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width
      const py = (event.clientY - rect.top) / rect.height
      card.style.transform = `perspective(1000px) rotateX(${(py - 0.5) * 5}deg) rotateY(${(px - 0.5) * -5}deg) translateY(-4px)`
      card.style.transition = 'transform 120ms ease'
      if (shineRef.current) {
        shineRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,.18), transparent 42%)`
      }
      if (imgRef.current) {
        imgRef.current.style.transform = `scale(1.08) translate(${(px - 0.5) * -8}px, ${(py - 0.5) * -8}px)`
      }
    },
    [isDragging],
  )

  const onLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)'
      cardRef.current.style.transition = 'transform 520ms cubic-bezier(.16,1,.3,1)'
    }
    if (imgRef.current) imgRef.current.style.transform = 'scale(1) translate(0,0)'
    if (shineRef.current) shineRef.current.style.background = 'transparent'
  }, [])

  const isHero = index === 0

  return (
    <article
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="gallery"
      className="group relative overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-[0_24px_70px_rgba(0,0,0,0.34)]"
      style={{
        // Hero card is wider and spans 2 rows; all others are uniform
        width: isHero ? '380px' : '280px',
        minHeight: isHero ? '430px' : '210px',
        gridRow: isHero ? 'span 2' : undefined,
        // Prevent cards shrinking when the grid tries to fit them
        flexShrink: 0,
      }}
    >
      <Image
        ref={imgRef}
        src={item.src}
        alt={item.alt}
        fill
        priority={index < 2}
        // Hero is wider so give it a bigger size hint; rest are 280px columns
        sizes={isHero ? '380px' : '280px'}
        className={`absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:brightness-105 ${
          isHero ? 'object-top' : 'object-center'
        }`}
      />

      <div
        ref={shineRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.88),rgba(0,0,0,.28)_52%,rgba(0,0,0,.08))]" />
      <div className="pointer-events-none absolute inset-0 opacity-0 ring-1 ring-inset ring-white/30 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="absolute left-4 top-4">
        <span className="rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur">
          {item.tag}
        </span>
      </div>

      <span className="absolute right-4 top-4 rounded-full bg-black/40 px-2.5 py-1 font-mono text-[11px] font-semibold text-white/70 backdrop-blur">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="heading-compact max-w-[24rem] text-xl font-semibold leading-tight text-white sm:text-2xl">
          {item.caption}
        </p>
        <p className="mt-2 max-w-[25rem] text-sm leading-6 text-zinc-200">{item.detail}</p>
      </div>
    </article>
  )
}

export default function Gallery() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const drag = useRef({ x: 0, left: 0, vel: 0, last: 0 })
  const raf = useRef<number | undefined>(undefined)

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only respond to primary (left) mouse button
    if (e.button !== 0) return
    const el = scrollRef.current
    if (!el) return
    cancelAnimationFrame(raf.current!)
    setDragging(true)
    drag.current = { x: e.pageX, left: el.scrollLeft, vel: 0, last: e.pageX }
    // Prevent text/image selection while dragging
    e.preventDefault()
  }

  useEffect(() => {
    const onMove = (ev: MouseEvent) => {
      if (!dragging) return
      const el = scrollRef.current
      if (!el) return
      el.scrollLeft = drag.current.left - (ev.pageX - drag.current.x)
      drag.current.vel = ev.pageX - drag.current.last
      drag.current.last = ev.pageX
    }

    const onUp = () => {
      if (!dragging) return
      setDragging(false)
      let v = -drag.current.vel * 1.5
      const coast = () => {
        const el = scrollRef.current
        if (!el || Math.abs(v) < 0.4) return
        el.scrollLeft += v
        v *= 0.92
        raf.current = requestAnimationFrame(coast)
      }
      coast()
    }

    // Attach to window so drag continues even if cursor leaves the container
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    // Re-register whenever dragging toggles so closures stay fresh
  }, [dragging])

  // Clean up any in-flight RAF on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(raf.current!)
  }, [])

  return (
    <section
      id="gallerySection"
      className="relative scroll-mt-28 py-20 text-white sm:py-24"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <AnimatedSection direction="up" className="mb-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <p className="site-eyebrow mb-3 flex items-center gap-2">
                <Camera className="h-4 w-4" aria-hidden="true" />
                Field Portfolio
              </p>
              <h2 className="heading-compact relative inline-block max-w-3xl text-4xl font-bold leading-[1.04] tracking-tight text-white sm:text-5xl">
                <span className="absolute -top-3 left-0 h-[2px] w-8 bg-[#ff7e26]"></span>
                Real installations, local coverage, practical network work.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
                A closer look at the equipment, terrain, and support footprint behind Valley
                Computers connectivity.
              </p>
            </div>
            <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur">
              {galleryStats.map((stat) => (
                <div key={stat.label} className="border-r border-white/10 p-4 last:border-r-0">
                  <p className="heading-compact text-xl font-bold leading-none text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Horizontal scroll gallery */}
        <AnimatedSection direction="up" delay={120}>
          {/*
            OUTER: hides overflow + applies right-edge fade mask.
            Must be overflow-x:auto (NOT hidden) or scrolling won't work.
          */}
          <div
            ref={scrollRef}
            onMouseDown={onMouseDown}
            style={{
              overflowX: 'auto',
              overflowY: 'hidden',
              cursor: dragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              WebkitMaskImage:
                'linear-gradient(to right, black 0%, black 65%, transparent 100%)',
              maskImage:
                'linear-gradient(to right, black 0%, black 65%, transparent 100%)',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            } as React.CSSProperties}
          >
            {/*
              TRACK: 3 fixed rows, columns flow left→right automatically.
              width:max-content is mandatory — without it the grid collapses
              to the container width and items wrap downward instead.
            */}
            <div
              style={{
                display: 'grid',
                gridTemplateRows: 'repeat(3, minmax(210px, auto))',
                gridAutoFlow: 'column',
                gridAutoColumns: '280px',
                gap: '12px',
                width: 'max-content',
                paddingBottom: '2px',
              }}
            >
              {galleryItems.map((item, index) => (
                <GalleryCard
                  key={item.src}
                  item={item}
                  index={index}
                  isDragging={dragging}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>

      </div>
    </section>
  )
}
