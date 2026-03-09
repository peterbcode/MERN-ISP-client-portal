import {
  BuildingOffice2Icon,
  ComputerDesktopIcon,
  CpuChipIcon,
  GlobeAltIcon,
  ServerStackIcon,
  WifiIcon,
} from "@heroicons/react/24/solid";

const brands = [
  { name: "Microsoft", icon: ComputerDesktopIcon, href: "https://www.microsoft.com/" },
  { name: "Dell", icon: ComputerDesktopIcon, href: "https://www.dell.com/" },
  { name: "HP", icon: ComputerDesktopIcon, href: "https://www.hp.com/" },
  { name: "Lenovo", icon: ComputerDesktopIcon, href: "https://www.lenovo.com/" },
  { name: "Intel", icon: CpuChipIcon, href: "https://www.intel.com/" },
  { name: "AMD", icon: CpuChipIcon, href: "https://www.amd.com/" },
  { name: "Cisco", icon: BuildingOffice2Icon, href: "https://www.cisco.com/" },
  { name: "Nokia", icon: GlobeAltIcon, href: "https://www.nokia.com/networks/" },
  { name: "Huawei", icon: GlobeAltIcon, href: "https://carrier.huawei.com/" },
  { name: "Ubiquiti", icon: ServerStackIcon, href: "https://ui.com/" },
  { name: "MikroTik", icon: WifiIcon, href: "https://mikrotik.com/" },
  { name: "TP-Link", icon: WifiIcon, href: "https://www.tp-link.com/" },
  { name: "Netgear", icon: WifiIcon, href: "https://www.netgear.com/" },
  { name: "D-Link", icon: WifiIcon, href: "https://www.dlink.com/" },
  { name: "Linksys", icon: WifiIcon, href: "https://www.linksys.com/" },
  { name: "ASUS", icon: ComputerDesktopIcon, href: "https://www.asus.com/" },
];

const BrandCarousel = () => {
  return (
    <section className="relative overflow-hidden border-y border-zinc-900 bg-[#070707] py-8 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_55%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-500/95 sm:text-xs">
          Trusted by Top Brands
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
                className="flex items-center gap-2.5 text-zinc-500/95 transition-colors duration-300 hover:text-zinc-300"
              >
                <brand.icon className="h-5 w-5" />
                <span className="text-2xl font-extrabold tracking-tight sm:text-3xl">{brand.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;
