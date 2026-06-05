'use client'

import { useCallback, useRef } from 'react'
import Image from 'next/image'
import { Camera, MapPin, RadioTower, ShieldCheck } from 'lucide-react'
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
]

const galleryStats = [
  { value: '5', label: 'field views' },
  { value: '24/7', label: 'network focus' },
  { value: 'Local', label: 'support team' },
]

function GalleryCard({ item, index }: { item: (typeof galleryItems)[number]; index: number }) {
  const cardRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)

  const onMove = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const px = x / rect.width
    const py = y / rect.height

    const tiltX = (py - 0.5) * 5
    const tiltY = (px - 0.5) * -5

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`
    card.style.transition = 'transform 120ms ease'

    if (shineRef.current) {
      shineRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,.18), transparent 42%)`
    }

    if (imgRef.current) {
      const sx = (px - 0.5) * -8
      const sy = (py - 0.5) * -8
      imgRef.current.style.transform = `scale(1.08) translate(${sx}px, ${sy}px)`
    }
  }, [])

  const onLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)'
      cardRef.current.style.transition = 'transform 520ms cubic-bezier(.16,1,.3,1)'
    }

    if (imgRef.current) {
      imgRef.current.style.transform = 'scale(1) translate(0, 0)'
    }

    if (shineRef.current) {
      shineRef.current.style.background = 'transparent'
    }
  }, [])

  const cardSize =
    index === 0
      ? 'lg:col-span-7 lg:row-span-2 min-h-[420px]'
      : index === 1
        ? 'lg:col-span-5 min-h-[250px]'
        : 'lg:col-span-4 min-h-[260px]'

  return (
    <article
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="gallery"
      className={`group relative col-span-12 overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-[0_24px_70px_rgba(0,0,0,0.34)] ${cardSize}`}
    >
      <Image
        ref={imgRef}
        src={item.src}
        alt={item.alt}
        fill
        priority={index < 2}
        sizes={index === 0 ? '(min-width: 1024px) 58vw, 100vw' : '(min-width: 1024px) 34vw, 100vw'}
        className={`absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:brightness-105 ${
          index === 0 ? 'object-top' : 'object-center'
        }`}
      />

      <div ref={shineRef} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.88),rgba(0,0,0,.28)_52%,rgba(0,0,0,.08))]" />
      <div className="pointer-events-none absolute inset-0 opacity-0 ring-1 ring-inset ring-white/30 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="absolute left-4 top-4 flex items-center gap-2">
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

const Gallery = () => (
  <section
    id="gallerySection"
    className="section-spaced relative scroll-mt-28 overflow-hidden text-white sm:py-24"
  >
    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(115deg,rgba(245,158,11,.12),transparent_34%),linear-gradient(245deg,rgba(20,184,166,.1),transparent_32%)]" />
    <div className="hero-grid absolute inset-0 opacity-10" />

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <AnimatedSection direction="up" className="mb-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="site-eyebrow mb-3 flex items-center gap-2">
              <Camera className="h-4 w-4" aria-hidden="true" />
              Field Portfolio
            </p>
            <h2 className="heading-compact max-w-3xl text-4xl font-bold leading-[1.04] tracking-tight text-white sm:text-5xl">
              Real installations, local coverage, practical network work.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
              A closer look at the equipment, terrain, and support footprint behind Valley Computers connectivity.
            </p>
          </div>

          <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur">
            {galleryStats.map((stat) => (
              <div key={stat.label} className="border-r border-white/10 p-4 last:border-r-0">
                <p className="heading-compact text-xl font-bold leading-none text-white">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection direction="up" delay={120}>
        <div className="grid auto-rows-[minmax(230px,auto)] grid-cols-12 gap-3 lg:gap-4">
          {galleryItems.map((item, index) => (
            <GalleryCard key={item.src} item={item} index={index} />
          ))}
        </div>
      </AnimatedSection>
    </div>
  </section>
)

export default Gallery
