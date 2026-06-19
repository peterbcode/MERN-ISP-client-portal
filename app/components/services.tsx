'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowRightIcon,
  BoltIcon,
  ClockIcon,
  ServerStackIcon,
  WifiIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import HoverCard from './ui/hover-card'
import { revealSection } from './animations/sectionReveal'

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
    cta: 'Learn More',
    href: '/contact',
    icon: WrenchScrewdriverIcon,
  },
  {
    title: 'Network Engineering',
    description:
      'Custom network design and installation for businesses. Managed switches, access points, and enterprise-grade security for reliable operations.',
    cta: 'Learn More',
    href: '/contact',
    icon: ServerStackIcon,
  },
]

const stats = [
  { value: '99%', label: 'ISP Uptime', icon: WifiIcon },
  { value: '5 000+', label: 'Repairs since 2015', icon: WrenchScrewdriverIcon },
  { value: '24/7', label: 'Network Monitoring', icon: ClockIcon },
  { value: 'Same Day', label: 'Response Time', icon: BoltIcon },
]

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const cleanup = revealSection(sectionRef.current)
    return cleanup
  }, [])

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative scroll-mt-28 py-20 text-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="reveal-heading relative inline-block text-3xl font-black sm:text-5xl">
            <span className="reveal-divider absolute -top-3 left-1/2 h-[2px] w-8 -translate-x-1/2 bg-[#ff7e26]"></span>
            Our Services
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Comprehensive IT solutions and high-speed internet for homes and businesses.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <Link key={service.title} href={service.href} className="reveal-card block group h-full">
              <HoverCard hoverScale={1.03} shadowIntensity="heavy" className="h-full rounded-[10px] border border-white/8 bg-[#16181c] hover:border-[#ff7e26]/50 hover:shadow-[0_0_0_1px_rgba(255,126,38,0.15)]">
                <div className="p-9 sm:p-10">
                  <div className="mb-7 inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-[#ff7e26]/35 bg-[#ff7e26]/12 text-[#ff7e26] shadow-[0_14px_30px_rgba(255,126,38,0.14)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-[#ff7e26] group-hover:text-black">
                    <service.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{service.title}</h3>
                  <p className="mt-5 text-base leading-relaxed text-zinc-300 sm:text-lg">{service.description}</p>
                  <div
                    className="mt-7 inline-flex items-center gap-2 text-lg font-bold text-[#ff7e26] transition hover:text-[#ff7e26] group-hover:translate-x-1 sm:text-xl"
                  >
                    {service.cta}
                    <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </HoverCard>
            </Link>
          ))}
        </div>

        <div className="mt-14">
          <div className="relative rounded-3xl border border-white/10 bg-[#0d0e10] p-5 shadow-[0_18px_38px_rgba(0,0,0,0.28)] sm:p-8">
            <div className="grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="group rounded-2xl border border-white/8 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#ff7e26]/40 hover:bg-white/[0.055]"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ff7e26] text-black shadow-[0_8px_24px_rgba(255,126,38,0.26)]">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <p
                    className="stat-number font-semibold tracking-tight text-[#ff7e26] transition-transform duration-300 group-hover:scale-105 text-[2.5rem] sm:text-[2.5rem]"
                    style={{ textShadow: '0 0 18px rgba(255,126,38,0.45)' }}
                    data-target={item.value.replace(/[^0-9.]/g, '')}
                  >
                    {item.value}
                  </p>
                  <p className="mt-2 text-[13px] font-bold uppercase tracking-[0.14em] text-[#6b7280] transition-colors duration-300 group-hover:text-zinc-300">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services

