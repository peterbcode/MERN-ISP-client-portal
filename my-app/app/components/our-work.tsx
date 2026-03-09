'use client'

import { useEffect, useState } from 'react'

const galleryItems = [
  { src: '/gallery/RBV-Dish.jpeg', alt: 'RBV dish installation' },
  { src: '/gallery/Rainbow.png', alt: 'Rainbow connectivity shot' },
  { src: '/gallery/High-speed.png', alt: 'High-speed internet setup' },
  { src: '/gallery/storefront.png', alt: 'Storefront service deployment' },
  { src: '/gallery/solar-and-dish.jpeg', alt: 'Solar and dish installation' },
]

const OurWork = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (isHovered) return

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => {
        if (galleryItems.length < 2) return current

        let next = current
        while (next === current) {
          next = Math.floor(Math.random() * galleryItems.length)
        }
        return next
      })
    }, 2600)

    return () => window.clearInterval(intervalId)
  }, [isHovered])

  return (
    <section
      id="gallerySection"
      className="bg-gradient-to-br from-black to-black py-20 text-white md:from-orange-600/90 md:to-orange-500/85"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-extrabold sm:text-5xl">Our Work in Action</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-orange-100 sm:text-xl">
            See how we&apos;re transforming connectivity in the Riebeek Valley
          </p>
        </div>

        <div className="mx-auto w-full max-w-[1800px] pb-6 lg:pb-12">
          <div
            className="hidden h-[78vh] min-h-[420px] items-stretch overflow-hidden rounded-2xl shadow-[0_20px_35px_rgba(0,0,0,0.35)] lg:flex"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {galleryItems.map((item, index) => (
              <button
                key={item.src}
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className="relative h-full border-0 p-0 transition-[flex] duration-700 ease-out focus:outline-none"
                style={{
                  flexGrow: activeIndex === null ? 1 : activeIndex === index ? 3.8 : 2.2,
                  flexShrink: 1,
                  flexBasis: 0,
                  backgroundImage: `url(${item.src})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                }}
                aria-label={`Open gallery image ${index + 1}`}
              >
                <span className="pointer-events-none absolute inset-0 bg-black/20" />
              </button>
            ))}
          </div>

          <div className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 lg:hidden">
            {galleryItems.map((item, index) => (
              <div
                key={item.src}
                className="h-[52vh] min-h-[320px] w-[85vw] shrink-0 snap-center overflow-hidden rounded-2xl shadow-[0_16px_28px_rgba(0,0,0,0.35)]"
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
        </div>
      </div>
    </section>
  )
}

export default OurWork
