const brands = [
  {
    name: "Tenda",
    href: "https://www.tendacn.com/",
    logo: "https://static.tenda.com.cn/public/logo-light.png?x-oss-process=image%2Fresize%2Cw_320%2Fformat%2Cavif",
  },
  {
    name: "Genius",
    href: "https://www.geniusnet.com/",
    logo: "https://www.geniusnet.com/images/logo-w.svg",
  },
  {
    name: "MikroTik",
    href: "https://mikrotik.com/",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/MikroTik_Logo_%282022%29.svg/3840px-MikroTik_Logo_%282022%29.svg.png",
  },
  { name: "Canon", href: "https://www.canon.co.za/", logo: "/brands/canon-logo.png" },
  {
    name: "Ubiquiti",
    href: "https://ui.com/",
    logo: "/brands/ubiquiti-logo.png",
  },
  { name: "ADATA", href: "https://www.adata.com/", logo: "/brands/adata-logo.png" },
];

const BrandCarousel = () => {
  return (
    <section className="relative overflow-hidden border-y border-white/6 bg-[#0d0e10] py-8 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-500/95 sm:text-xs">
          Hardware Brands We Work With
        </p>
        <div className="relative mt-6 overflow-hidden pt-4 pb-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#0d0e10] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#0d0e10] to-transparent" />

          <div className="brand-marquee-track flex min-w-max items-center gap-12 sm:gap-16">
            {[...brands, ...brands].map((brand, index) => (
              <a
                key={`${brand.name}-${index}`}
                href={brand.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-20 w-44 items-center justify-center rounded-xl border border-white/8 bg-zinc-950/80 px-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ff7e26]/40 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-inset"
              >
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  loading="lazy"
                  className="max-h-12 max-w-36 object-contain transition duration-300 brightness-0 invert-[0.55] opacity-70 group-hover:brightness-0 group-hover:invert-[0.55] group-hover:opacity-100"
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
