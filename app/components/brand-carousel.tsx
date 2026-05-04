import {
  ComputerDesktopIcon,
  CpuChipIcon,
  ServerStackIcon,
  WifiIcon,
  SignalIcon,
} from "@heroicons/react/24/solid";

const brands = [
  { name: "Tenda", icon: WifiIcon, href: "https://www.tendacn.com/", color: "text-orange-500" },
  { name: "MikroTik", icon: ServerStackIcon, href: "https://mikrotik.com/", color: "text-blue-500" },
  { name: "Ubiquiti", icon: SignalIcon, href: "https://ui.com/", color: "text-sky-400" },
  { name: "Genius", icon: ComputerDesktopIcon, href: "https://www.geniusnet.com/", color: "text-red-500" },
  { name: "ADATA", icon: CpuChipIcon, href: "https://www.adata.com/", color: "text-cyan-400" },
];

const BrandCarousel = () => {
  return (
    <section className="relative overflow-hidden border-y border-zinc-900 bg-[#070707] py-8 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_55%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-500/95 sm:text-xs">
          Hardware Brands We Work With
        </p>
        <div className="relative mt-6 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#070707] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#070707] to-transparent" />

          <div className="brand-marquee-track flex min-w-max items-center gap-10 sm:gap-14">
            {[...brands, ...brands].map((brand, index) => (
              <a
                key={`${brand.name}-${index}`}
                href={brand.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-zinc-500/95 transition-all duration-300 hover:text-zinc-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-inset rounded-lg group"
              >
                <brand.icon className={`h-5 w-5 transition-colors duration-300 ${brand.color}`} />
                <span className="text-2xl font-extrabold tracking-tight sm:text-3xl transition-colors duration-300 group-hover:text-white">{brand.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;
