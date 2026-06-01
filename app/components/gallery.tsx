import AnimatedSection from './ui/animated-section'

const galleryItems = [
  { src: '/gallery/RBV-Dish.jpeg', alt: 'RBV dish installation', caption: 'Wireless dish installation' },
  { src: '/gallery/High-speed.png', alt: 'High-speed internet setup', caption: 'High-speed network equipment' },
  { src: '/gallery/solar-and-dish.jpeg', alt: 'Solar and dish installation', caption: 'Solar-backed field connectivity' },
  { src: '/gallery/storefront.png', alt: 'Storefront service deployment', caption: 'Local support storefront' },
  { src: '/gallery/Rainbow.png', alt: 'Rainbow connectivity shot', caption: 'Riebeek Valley coverage' },
]

const Gallery = () => {
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
          <div className="grid gap-4 md:grid-cols-3">
            {galleryItems.map((item, index) => (
              <article
                key={item.src}
                className={`group relative h-[320px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_18px_32px_rgba(0,0,0,0.35)] md:h-[360px] lg:h-[420px] ${
                  index === 0 ? 'md:col-span-2' : ''
                }`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="absolute inset-0 !h-full !w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-90 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="inline-flex rounded-full bg-[#f97316] px-4 py-2 text-sm font-bold text-white shadow-lg">
                    {item.caption}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

export default Gallery
