import Link from 'next/link'
import { ArrowRightIcon, ComputerDesktopIcon, CpuChipIcon, WifiIcon } from '@heroicons/react/24/outline'

const services = [
  {
    title: 'Fibre & Wireless ISP',
    description:
      'Lightning-fast fibre to the home and reliable wireless solutions for farms and remote businesses. Uncapped, unshaped internet that just works.',
    cta: 'Learn More',
    href: '/isp',
    icon: WifiIcon,
  },
  {
    title: 'PC Repairs',
    description:
      'Expert diagnostics, repairs, and upgrades. Data recovery, virus removal, hardware replacement, and performance optimization with same-day service available.',
    cta: 'Get Support',
    href: '/contact',
    icon: ComputerDesktopIcon,
  },
  {
    title: 'Network Engineering',
    description:
      'Custom network design and installation for businesses. Managed switches, access points, and enterprise-grade security for reliable operations.',
    cta: 'Contact Us',
    href: '/contact',
    icon: CpuChipIcon,
  },
]

const stats = [
  { value: '99%', label: 'ISP Uptime' },
  { value: '15k+', label: 'Repairs Done' },
  { value: '24/7', label: 'Network Monitoring' },
  { value: 'Same Day', label: 'Response Time' },
]

const Services = () => {
  return (
    <section
      id="services"
      className="scroll-mt-28 bg-[radial-gradient(circle_at_50%_85%,rgba(243,111,0,0.08),transparent_52%),linear-gradient(to_bottom,#070707,#0b0b0b)] py-20 text-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black sm:text-5xl">Our Services</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Comprehensive IT solutions and high-speed internet for homes and businesses.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="rounded-3xl border border-[#f36f00]/25 bg-[linear-gradient(135deg,rgba(243,111,0,0.09),rgba(255,255,255,0.03)_56%,rgba(255,255,255,0.015))] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-sm transition hover:-translate-y-1 hover:border-[#f36f00]/45"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f36f00] text-white shadow-[0_10px_25px_rgba(243,111,0,0.25)]">
                <service.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{service.title}</h3>
              <p className="mt-5 text-base leading-relaxed text-zinc-300 sm:text-lg">{service.description}</p>
              <Link
                href={service.href}
                className="mt-7 inline-flex items-center gap-2 text-lg font-bold text-[#f36f00] transition hover:text-[#ff8a2a] sm:text-xl"
              >
                {service.cta}
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-14 grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label}>
              <p
                className={`font-black tracking-tight text-[#f36f00] ${
                  item.value.includes(' ') ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl lg:text-5xl'
                }`}
              >
                {item.value}
              </p>
              <p className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-zinc-400">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
