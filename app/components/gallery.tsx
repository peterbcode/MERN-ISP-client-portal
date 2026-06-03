'use client'
import { useRef, useCallback } from 'react'
import AnimatedSection from './ui/animated-section'

const galleryItems = [
  { src: '/gallery/RBV-Dish.jpeg',      alt: 'Wireless dish installation',   tag: 'Installation', caption: 'Wireless dish installation'    },
  { src: '/gallery/High-speed.png',     alt: 'High-speed internet setup',     tag: 'Network',      caption: 'High-speed network equipment'  },
  { src: '/gallery/solar-and-dish.jpeg',alt: 'Solar and dish installation',   tag: 'Off-grid',     caption: 'Solar-backed field connectivity'},
  { src: '/gallery/storefront.png',     alt: 'Storefront service deployment', tag: 'Storefront',   caption: 'Local support storefront'      },
  { src: '/gallery/Rainbow.png',        alt: 'Rainbow connectivity shot',     tag: 'Coverage',     caption: 'Riebeek Valley coverage'       },
]

function GalleryCard({ item, index }: { item: typeof galleryItems[0]; index: number }) {
  const cardRef   = useRef<HTMLDivElement>(null)
  const imgRef    = useRef<HTMLImageElement>(null)
  const shineRef  = useRef<HTMLDivElement>(null)

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current!
    const r = card.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const px = x / r.width
    const py = y / r.height

    const tiltX = (py - 0.5) * 10
    const tiltY = (px - 0.5) * -10
    card.style.transform    = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`
    card.style.transition   = 'transform .1s ease'
    card.style.zIndex       = '2'

    if (shineRef.current)
      shineRef.current.style.background = `radial-gradient(circle at ${px*100}% ${py*100}%,rgba(255,255,255,.15) 0%,transparent 60%)`

    if (imgRef.current) {
      const sx = (px - 0.5) * -10
      const sy = (py - 0.5) * -10
      imgRef.current.style.transform  = `scale(1.18) translate(${sx}px,${sy}px)`
      imgRef.current.style.transition = 'transform .1s ease, filter .6s ease'
    }
  }, [])

  const onLeave = useCallback(() => {
    const card = cardRef.current!
    card.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'
    card.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)'
    card.style.zIndex     = ''

    if (imgRef.current) {
      imgRef.current.style.transform  = 'scale(1) translate(0,0)'
      imgRef.current.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1), filter .6s ease'
    }
  }, [])

  const colSpan =
    index === 0 ? 'md:col-span-7' :
    index === 1 ? 'md:col-span-5' : 'md:col-span-4'

  return (
    <article
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative col-span-12 overflow-hidden rounded-xl bg-black
                  ${colSpan} ${index < 2 ? 'h-[320px]' : 'h-[240px]'}`}
    >
      {/* Main image — parallax + brightness */}
      <img
        ref={imgRef}
        src={item.src}
        alt={item.alt}
        loading="lazy"
        className={`block absolute inset-0 h-full w-full object-cover transition-[filter] duration-600
                   transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-125
                   ${index === 0 ? 'object-top' : 'object-center'} brightness-90`}
      />

      {/* Mouse-tracked radial shine */}
      <div ref={shineRef} className="absolute inset-0 opacity-0 transition-opacity duration-300
                                      group-hover:opacity-100 pointer-events-none" />

      {/* Always-on vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

      {/* Scan line on enter */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none
                      after:absolute after:inset-x-0 after:top-0 after:h-[2px]
                      after:bg-gradient-to-r after:from-transparent after:via-[#f97316]/80 after:to-transparent
                      after:-translate-y-full group-hover:after:animate-[scan_.6s_ease_forwards]" />

      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-5 h-5 pointer-events-none
                      before:absolute before:top-0 before:left-0 before:h-[2px] before:bg-[#f97316] before:w-0 group-hover:before:w-5 before:transition-[width] before:duration-300
                      after:absolute after:top-0 after:left-0 after:w-[2px] after:bg-[#f97316] after:h-0 group-hover:after:h-5 after:transition-[height] after:duration-300" />
      <div className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none
                      before:absolute before:bottom-0 before:right-0 before:h-[2px] before:bg-[#f97316] before:w-0 group-hover:before:w-5 before:transition-[width] before:duration-300
                      after:absolute after:bottom-0 after:right-0 after:w-[2px] after:bg-[#f97316] after:h-0 group-hover:after:h-5 after:transition-[height] after:duration-300" />

      {/* Index */}
      <span className="absolute top-3 right-3 font-mono text-[10px] font-bold tracking-wide
                       text-white/35 pointer-events-none transition-[color,transform] duration-300
                       group-hover:text-white/80 group-hover:-translate-y-0.5">
        {String(index + 1).padStart(2,'0')} / {String(galleryItems.length).padStart(2,'0')}
      </span>

      {/* Caption */}
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 pointer-events-none
                      transition-all duration-400 ease-[cubic-bezier(.16,1,.3,1)]
                      group-hover:translate-y-0 group-hover:opacity-100">
        <span className="inline-block mb-1.5 rounded-sm bg-[#f97316] px-2.5 py-1
                         font-mono text-[10px] font-bold uppercase tracking-[.14em] text-white">
          {item.tag}
        </span>
        <p className="text-[14px] font-light italic leading-snug text-white/90">{item.caption}</p>
      </div>

    </article>
  )
}

const Gallery = () => (
  <section id="gallerySection" className="scroll-mt-28 bg-[#f97316] py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <AnimatedSection direction="up" className="mb-10 text-center">
        <p className="text-[11px] font-bold tracking-[.18em] uppercase text-white mb-1.5">Portfolio</p>
        <h2 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl">
          Our work in action
        </h2>
        <p className="mt-2 text-sm font-light text-white">
          Transforming connectivity across the Riebeek Valley — hover to explore
        </p>
      </AnimatedSection>

      <AnimatedSection direction="up" delay={150}>
        <div className="grid grid-cols-12 gap-2">
          {galleryItems.map((item, i) => <GalleryCard key={item.src} item={item} index={i} />)}
        </div>
      </AnimatedSection>
    </div>
  </section>
)

export default Gallery