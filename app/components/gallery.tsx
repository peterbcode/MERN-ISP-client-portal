import AnimatedSection from './ui/animated-section'

const galleryItems = [
  { src: '/gallery/RBV-Dish.jpeg', alt: 'Wireless dish installation', tag: 'Installation', caption: 'Wireless dish installation' },
  { src: '/gallery/High-speed.png', alt: 'High-speed internet setup', tag: 'Network', caption: 'High-speed network equipment' },
  { src: '/gallery/solar-and-dish.jpeg', alt: 'Solar and dish installation', tag: 'Off-grid', caption: 'Solar-backed field connectivity' },
  { src: '/gallery/storefront.png', alt: 'Storefront service deployment', tag: 'Storefront', caption: 'Local support storefront' },
  { src: '/gallery/Rainbow.png', alt: 'Rainbow connectivity shot', tag: 'Coverage', caption: 'Riebeek Valley coverage' },
]

const Gallery = () => {
  return (
    <section id="gallerySection" className="scroll-mt-28 bg-[#f97316] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <AnimatedSection direction="up" className="mb-10">
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-black/60 mb-1.5">
            Portfolio
          </p>
          <h2 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl">
            Our work in action
          </h2>
          <p className="mt-2 text-sm font-light text-white/80">
            Transforming connectivity across the Riebeek Valley
          </p>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={150}>
          <div className="grid grid-cols-12 gap-2.5">
            {galleryItems.map((item, i) => (
              <article
                key={item.src}
                className={`group relative overflow-hidden rounded-xl bg-zinc-900 ${
                  i === 0
                    ? 'col-span-12 h-[340px] md:col-span-7'
                    : i === 1
                    ? 'col-span-12 h-[340px] md:col-span-5'
                    : 'col-span-12 h-[260px] md:col-span-4'
                }`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover brightness-[0.88] saturate-110
                             transition-all duration-[650ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                             group-hover:scale-[1.06] group-hover:brightness-100 group-hover:saturate-[1.2]"
                />

                {/* Directional gradient — appears on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/70
                                opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

                {/* Index counter */}
                <span className="absolute right-3.5 top-3.5 font-mono text-[11px] font-bold tracking-wide
                                 text-white/50 transition-colors duration-300 group-hover:text-white/85">
                  {String(i + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}
                </span>

                {/* Caption */}
                <div className="absolute inset-x-0 bottom-0 translate-y-1.5 p-4 opacity-0
                                transition-all duration-350 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="mb-1.5 inline-block rounded bg-[#f97316] px-2.5 py-1
                                   text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                    {item.tag}
                  </span>
                  <p className="text-[15px] font-light leading-snug text-white/92">
                    {item.caption}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Footer rule */}
          <div className="mt-5 flex items-center gap-3">
            <span className="font-mono text-[11px] font-bold tracking-widest text-black/50">
              {galleryItems.length} PROJECTS
            </span>
            <div className="h-px flex-1 bg-black/20" />
            <div className="h-1.5 w-1.5 rounded-full bg-black/50" />
          </div>
        </AnimatedSection>

      </div>
    </section>
  )
}

export default Gallery