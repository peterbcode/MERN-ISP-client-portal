import {
  BuildingOffice2Icon,
  ComputerDesktopIcon,
  CpuChipIcon,
  ServerStackIcon,
  Squares2X2Icon,
  WifiIcon,
} from "@heroicons/react/24/solid";

const brands = [
  { name: "Ubiquiti", icon: ServerStackIcon },
  { name: "Dell", icon: ComputerDesktopIcon },
  { name: "MikroTik", icon: WifiIcon },
  { name: "Tenda", icon: WifiIcon },
  { name: "Microsoft", icon: Squares2X2Icon },
  { name: "TP-Link", icon: CpuChipIcon },
  { name: "Cisco", icon: BuildingOffice2Icon },
  { name: "Netgear", icon: ServerStackIcon },
  { name: "Intel", icon: CpuChipIcon },
  { name: "AMD", icon: CpuChipIcon },
  { name: "ASUS", icon: ComputerDesktopIcon },
  { name: "D-Link", icon: WifiIcon },
];

const BrandCarousel = () => {
  return (
    <section className="relative overflow-hidden border-y border-zinc-900 bg-[#070707] py-8 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_55%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-white sm:text-xs">
          Trusted By Leading Technology Brands
        </p>
        <div className="relative mt-6 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#070707] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#070707] to-transparent" />

          <div className="brand-marquee-track flex min-w-max items-center gap-10 sm:gap-14">
            {[...brands, ...brands].map((brand, index) => (
              <article
                key={`${brand.name}-${index}`}
                className="flex items-center gap-2.5 text-zinc-500/95 transition-colors duration-300 hover:text-zinc-300"
              >
                <brand.icon className="h-5 w-5" />
                <span className="text-2xl font-extrabold tracking-tight sm:text-3xl">{brand.name}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;
