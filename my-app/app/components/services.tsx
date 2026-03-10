'use client'

import Link from 'next/link'
import { ArrowRightIcon, ComputerDesktopIcon, CpuChipIcon, WifiIcon } from '@heroicons/react/24/outline'
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
              <HoverCard hoverScale={1.03} shadowIntensity="medium">
                <div className="p-8">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f97316] text-white shadow-[0_10px_25px_rgba(243,111,0,0.25)] transition-transform duration-300 group-hover:scale-110">
                    <service.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{service.title}</h3>
                  <p className="mt-5 text-base leading-relaxed text-zinc-300 sm:text-lg">{service.description}</p>
                  <Link
                    href={service.href}
                    className="mt-7 inline-flex items-center gap-2 text-lg font-bold text-[#f97316] transition hover:text-[#f97316] group-hover:translate-x-1 sm:text-xl"
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
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, index) => (
              <AnimatedSection
                key={item.label}
                direction="up"
                delay={index * 100}
                duration={500}
              >
                <div className="group">
                  <p
                    className={`font-black tracking-tight text-[#f97316] transition-transform duration-300 group-hover:scale-105 ${
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
        </AnimatedSection>
      </div>
    </section>
  )
}

export default Services

