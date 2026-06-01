const brands = [
  { name: "Tenda", href: "https://www.tendacn.com/", logo: "https://logo.clearbit.com/tendacn.com" },
  { name: "MikroTik", href: "https://mikrotik.com/", logo: "https://logo.clearbit.com/mikrotik.com" },
  { name: "Ubiquiti", href: "https://ui.com/", logo: "https://logo.clearbit.com/ui.com" },
  { name: "Genius", href: "https://www.geniusnet.com/", logo: "https://logo.clearbit.com/geniusnet.com" },
  { name: "ADATA", href: "https://www.adata.com/", logo: "https://logo.clearbit.com/adata.com" },
  { name: "Canon", href: "https://www.canon.co.za/", logo: "https://logo.clearbit.com/canon.co.za" },
];

const BrandCarousel = () => {
  return (
    <section className="relative overflow-hidden border-y border-zinc-800 bg-[#090909] py-8 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08),transparent_55%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-500/95 sm:text-xs">
          Hardware Brands We Work With
        </p>
        <div className="relative mt-6 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#090909] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#090909] to-transparent" />

          <div className="brand-marquee-track flex min-w-max items-center gap-10 sm:gap-14">
            {[...brands, ...brands].map((brand, index) => (
              <a
                key={`${brand.name}-${index}`}
                href={brand.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-20 w-40 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/80 px-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f97316]/60 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-inset"
              >
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  loading="lazy"
                  className="max-h-10 max-w-28 object-contain grayscale opacity-70 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;
