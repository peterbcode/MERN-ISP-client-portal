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
  { name: "Vodacom", icon: WifiIcon, href: "https://www.vodacom.com/", color: "text-red-600" },
  { name: "MTN", icon: GlobeAltIcon, href: "https://www.mtn.co.za/", color: "text-orange-500" },
  { name: "Telkom", icon: ServerStackIcon, href: "https://www.telkom.co.za/", color: "text-green-600" },
  { name: "Rain", icon: CloudIcon, href: "https://www.rain.co.za/", color: "text-blue-500" },
  { name: "Afrihost", icon: ShieldCheckIcon, href: "https://www.afrihost.com/", color: "text-purple-500" },
  { name: "Web Africa", icon: SignalIcon, href: "https://www.webafrica.co.za/", color: "text-orange-600" },
  { name: "Mweb", icon: GlobeAltIcon, href: "https://www.mweb.co.za/", color: "text-red-500" },
  { name: "IS", icon: ServerStackIcon, href: "https://www.is.co.za/", color: "text-blue-700" },
  { name: "Axxess", icon: WifiIcon, href: "https://www.axxess.co.za/", color: "text-green-500" },
  { name: "Cool Ideas", icon: CpuChipIcon, href: "https://www.coolideas.co.za/", color: "text-blue-400" },
  { name: "Cybersmart", icon: ComputerDesktopIcon, href: "https://www.cybersmart.co.za/", color: "text-red-600" },
  { name: "Incredible", icon: WifiIcon, href: "https://www.incredible.co.za/", color: "text-orange-500" },
  { name: "Cell C", icon: SignalIcon, href: "https://www.cellc.co.za/", color: "text-blue-600" },
  { name: "Supersonic", icon: CubeIcon, href: "https://www.supersonic.com/", color: "text-purple-600" },
  { name: "Vox", icon: ServerStackIcon, href: "https://www.vox.co.za/", color: "text-teal-500" },
  { name: "Afrihost", icon: ShieldCheckIcon, href: "https://www.afrihost.com/", color: "text-indigo-600" },
  { name: "Xnekon", icon: WifiIcon, href: "https://www.xnekon.co.za/", color: "text-green-600" },
  { name: "RSAWeb", icon: GlobeAltIcon, href: "https://www.rsaweb.co.za/", color: "text-blue-500" },
  { name: "Host Africa", icon: ServerStackIcon, href: "https://www.hostafrica.com/", color: "text-orange-600" },
  { name: "Hetzner", icon: CloudIcon, href: "https://www.hetzner.co.za/", color: "text-red-600" },
  { name: "GloNet", icon: WifiIcon, href: "https://www.glonet.co.za/", color: "text-purple-500" },
  { name: "OpenWeb", icon: GlobeAltIcon, href: "https://www.openweb.co.za/", color: "text-blue-700" },
  { name: "Afrihost", icon: ShieldCheckIcon, href: "https://www.afrihost.com/", color: "text-green-500" },
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
