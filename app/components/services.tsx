'use client'

import Link from 'next/link'
import {
  ArrowRightIcon,
  BoltIcon,
  ClockIcon,
  ServerStackIcon,
  WifiIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import AnimatedSection from './ui/animated-section'
import HoverCard from './ui/hover-card'

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
    icon: WrenchScrewdriverIcon,
  },
  {
    title: 'Network Engineering',
    description:
      'Custom network design and installation for businesses. Managed switches, access points, and enterprise-grade security for reliable operations.',
    cta: 'Contact Us',
    href: '/contact',
    icon: ServerStackIcon,
  },
]

const stats = [
  { value: '99%', label: 'ISP Uptime', icon: WifiIcon },
  { value: '15k+', label: 'Repairs Done', icon: WrenchScrewdriverIcon },
  { value: '24/7', label: 'Network Monitoring', icon: ClockIcon },
  { value: 'Same Day', label: 'Response Time', icon: BoltIcon },
]

const Services = () => {
  return (
    <section
      id="services"
      className="scroll-mt-28 bg-[radial-gradient(circle_at_12%_20%,rgba(20,184,166,0.08),transparent_34%),radial-gradient(circle_at_88%_82%,rgba(245,158,11,0.09),transparent_38%),linear-gradient(to_bottom,#0b0d10,#111315)] py-20 text-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection direction="up" className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black sm:text-5xl">Our Services</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Comprehensive IT solutions and high-speed internet for homes and businesses.
          </p>
        </AnimatedSection>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {services.map((service, index) => (
            <AnimatedSection
              key={service.title}
              direction="up"
              delay={index * 150}
              duration={600}
            >
              <HoverCard hoverScale={1.03} shadowIntensity="heavy" className="h-full border-white/10 bg-[#14171a]/92 hover:border-[#f59e0b]/55">
                <div className="p-9 sm:p-10">
                  <div className="mb-7 inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-[#f59e0b]/35 bg-[#f59e0b]/12 text-[#f59e0b] shadow-[0_14px_30px_rgba(245,158,11,0.14)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-[#f59e0b] group-hover:text-black">
                    <service.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{service.title}</h3>
                  <p className="mt-5 text-base leading-relaxed text-zinc-300 sm:text-lg">{service.description}</p>
                  <Link
                    href={service.href}
                    className="mt-7 inline-flex items-center gap-2 text-lg font-bold text-[#f59e0b] transition hover:text-[#fbbf24] group-hover:translate-x-1 sm:text-xl"
                  >
                    {service.cta}
                    <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </HoverCard>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection direction="up" delay={450} className="mt-14">
          <div className="rounded-3xl border border-white/10 bg-[linear-gradient(135deg,#15181b,#14191a_55%,#0e1012)] p-5 shadow-[0_18px_38px_rgba(0,0,0,0.28)] sm:p-8">
            <div className="grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item, index) => (
                <AnimatedSection
                  key={item.label}
                  direction="up"
                  delay={index * 100}
                  duration={500}
                >
                  <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#14b8a6]/45 hover:bg-white/[0.055]">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f59e0b] text-black shadow-[0_8px_24px_rgba(245,158,11,0.26)]">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <p
                      className={`font-black tracking-tight text-[#f59e0b] transition-transform duration-300 group-hover:scale-105 ${
                        item.value.includes(' ') ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl lg:text-5xl'
                      }`}
                    >
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-zinc-400 transition-colors duration-300 group-hover:text-zinc-300">
                      {item.label}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

export default Services

