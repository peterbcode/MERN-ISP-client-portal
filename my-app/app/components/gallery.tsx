'use client'

import { useEffect, useState } from 'react'
import AnimatedSection from './ui/animated-section'

const galleryItems = [
  { src: '/gallery/RBV-Dish.jpeg', alt: 'RBV dish installation' },
  { src: '/gallery/Rainbow.png', alt: 'Rainbow connectivity shot' },
  { src: '/gallery/High-speed.png', alt: 'High-speed internet setup' },
  { src: '/gallery/storefront.png', alt: 'Storefront service deployment' },
  { src: '/gallery/solar-and-dish.jpeg', alt: 'Solar and dish installation' },
]

const Gallery = () => {
  const [autoIndex, setAutoIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    if (hoveredIndex !== null) return

    const intervalId = window.setInterval(() => {
      setAutoIndex((current) => {
        if (galleryItems.length < 2) return current

        let next = current
        while (next === current) {
          next = Math.floor(Math.random() * galleryItems.length)
        }
        return next
      })
    }, 3800)

    return () => window.clearInterval(intervalId)
  }, [hoveredIndex])

  return (
    <section
      id="gallerySection"
      className="scroll-mt-28 bg-[#f97316] py-20 text-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection direction="up" className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl !text-black">Our Work in Action</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
            See how we are transforming connectivity in the Riebeek Valley.
          </p>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={200} className="mx-auto w-full max-w-[1800px] pb-6 lg:pb-12">
          <div
            className="hidden h-[78vh] min-h-[420px] items-stretch overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_20px_35px_rgba(0,0,0,0.35)] lg:flex"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {galleryItems.map((item, index) => (
              <button
                key={item.src}
                type="button"
                onMouseEnter={() => setHoveredIndex(index)}
                onFocus={() => setHoveredIndex(index)}
                onClick={() => setHoveredIndex(index)}
                className="relative h-full border-0 p-0 transition-[flex-grow,transform,filter] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[flex-grow,transform,filter] focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-inset"
                style={{
                  flexGrow:
                    hoveredIndex === null ? 1 : hoveredIndex === index ? 8 : 0.65,
                  flexShrink: 1,
                  flexBasis: 0,
                  backgroundImage: `url(${item.src})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  transform: hoveredIndex === null && autoIndex === index ? 'scale(1.015)' : 'scale(1)',
                  filter: hoveredIndex === index ? 'brightness(1.1) contrast(1.05)' : hoveredIndex === null ? 'brightness(1)' : 'brightness(0.7)',
                  transition: 'transform 900ms ease, flex-grow 1000ms cubic-bezier(0.22,1,0.36,1), filter 300ms ease',
                }}
                aria-label={`Open gallery image ${index + 1}`}
              >
                <span
                  className="pointer-events-none absolute inset-0 transition-all duration-500"
                  style={{
                    backgroundColor:
                      hoveredIndex === null
                        ? autoIndex === index
                          ? 'rgba(0,0,0,0.12)'
                          : 'rgba(0,0,0,0.22)'
                        : hoveredIndex === index
                          ? 'rgba(0,0,0,0.05)'
                          : 'rgba(0,0,0,0.5)',
                  }}
                />
                {/* Premium overlay for hovered state */}
                {hoveredIndex === index && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300">
                    <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black opacity-0 transform translate-y-2 transition-all duration-300">
                      View Project
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 lg:hidden">
            {galleryItems.map((item, index) => (
              <div
                key={item.src}
                className="group h-[52vh] min-h-[320px] w-[85vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-zinc-800 shadow-[0_16px_28px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
                style={{
                  backgroundImage: `url(${item.src})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                }}
                aria-label={`Gallery image ${index + 1}: ${item.alt}`}
              />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

export default Gallery
