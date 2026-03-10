import {
  BuildingOffice2Icon,
  ComputerDesktopIcon,
  CpuChipIcon,
  GlobeAltIcon,
  ServerStackIcon,
  WifiIcon,
  CloudIcon,
  ShieldCheckIcon,
  SignalIcon,
  CubeIcon,
  CircleStackIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  CogIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

const brands = [
  { name: "Microsoft", icon: ComputerDesktopIcon, href: "https://www.microsoft.com/", color: "text-blue-500" },
  { name: "Dell", icon: ComputerDesktopIcon, href: "https://www.dell.com/", color: "text-gray-300" },
  { name: "HP", icon: ComputerDesktopIcon, href: "https://www.hp.com/", color: "text-blue-400" },
  { name: "Lenovo", icon: ComputerDesktopIcon, href: "https://www.lenovo.com/", color: "text-red-500" },
  { name: "Intel", icon: CpuChipIcon, href: "https://www.intel.com/", color: "text-blue-600" },
  { name: "AMD", icon: CpuChipIcon, href: "https://www.amd.com/", color: "text-red-600" },
  { name: "Cisco", icon: BuildingOffice2Icon, href: "https://www.cisco.com/", color: "text-blue-500" },
  { name: "Huawei", icon: GlobeAltIcon, href: "https://carrier.huawei.com/", color: "text-red-500" },
  { name: "Tenda", icon: WifiIcon, href: "https://www.tenda.com/", color: "text-green-500" },
  { name: "Ubiquiti", icon: ServerStackIcon, href: "https://ui.com/", color: "text-orange-500" },
  { name: "MikroTik", icon: CogIcon, href: "https://mikrotik.com/", color: "text-blue-400" },
  { name: "TP-Link", icon: WifiIcon, href: "https://www.tp-link.com/", color: "text-green-600" },
  { name: "Netgear", icon: WifiIcon, href: "https://www.netgear.com/", color: "text-teal-500" },
  { name: "D-Link", icon: ArrowPathIcon, href: "https://www.dlink.com/", color: "text-red-400" },
  { name: "Linksys", icon: WifiIcon, href: "https://www.linksys.com/", color: "text-blue-300" },
  { name: "ASUS", icon: ComputerDesktopIcon, href: "https://www.asus.com/", color: "text-gray-400" },
  { name: "Fortinet", icon: ShieldCheckIcon, href: "https://www.fortinet.com/", color: "text-orange-600" },
  { name: "Juniper", icon: ServerStackIcon, href: "https://www.juniper.net/", color: "text-blue-700" },
  { name: "Aruba", icon: WifiIcon, href: "https://www.arubanetworks.com/", color: "text-red-600" },
  { name: "Ruckus", icon: SignalIcon, href: "https://www.ruckuswireless.com/", color: "text-orange-500" },
  { name: "Synology", icon: ServerStackIcon, href: "https://www.synology.com/", color: "text-blue-500" },
  { name: "QNAP", icon: CubeIcon, href: "https://www.qnap.com/", color: "text-green-600" },
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
