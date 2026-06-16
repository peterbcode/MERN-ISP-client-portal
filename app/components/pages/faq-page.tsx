'use client'

import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import {
  ComputerDesktopIcon,
  CreditCardIcon,
  LifebuoyIcon,
  SignalIcon,
} from '@heroicons/react/24/solid'
import AnimatedSection from '../ui/animated-section'

const faqItems = [
  {
    question: "What services do you offer?",
    answer:
      "We provide fibre and wireless internet, PC and laptop repairs, network setup, maintenance, and on-site IT support for home and business users.",
  },
  {
    question: "Which areas do you cover?",
    answer:
      "Our core coverage includes Riebeek Kasteel, the surrounding valley areas, and the greater Swartland region.",
  },
  {
    question: "Do you support both home and business clients?",
    answer: "Yes. We support residential users, remote workers, SMEs, and larger business environments.",
  },
  {
    question: "How do I request a new internet installation?",
    answer:
      "Use the contact page, call us, or message on WhatsApp. We will confirm coverage, recommend a plan, and book installation.",
  },
  {
    question: "How long does installation take?",
    answer:
      "Typical installations are completed within a few working days after approval, often same day, depending on area readiness and schedule availability.",
  },
  { question: "Do you offer uncapped internet?", answer: "Yes, we offer uncapped packages." },
  {
    question: "Is your network shaped or throttled?",
    answer:
      "Packages are designed for stable day-to-day performance. We can explain current policy details for each plan before signup.",
  },
  {
    question: "What speeds are available?",
    answer:
      "Available speeds depend on your location and service type. We will provide current speed options during the coverage check.",
  },
  {
    question: "What equipment is included?",
    answer:
      "Most installs include required line equipment; Wi-Fi routers and advanced networking gear can be supplied based on your package.",
  },
  {
    question: "Can I use my own router?",
    answer:
      "In most cases yes, provided it supports the required standards and profile. We can help verify compatibility.",
  },
  {
    question: "Do you offer static IP addresses?",
    answer:
      "Static IP options are available for selected plans and business needs. Ask us for pricing and setup details.",
  },
  {
    question: "What are your support hours?",
    answer:
      "Standard support runs during business hours, with rapid escalation for urgent outages and service interruptions.",
  },
  {
    question: "How do I report a fault?",
    answer:
      "Call us or use WhatsApp. Share your account details, location, and issue symptoms to speed up diagnostics.",
  },
  {
    question: "How quickly do you respond to outages?",
    answer:
      "We prioritize outages immediately and communicate progress while diagnostics and restoration are in progress.",
  },
  {
    question: "Can you help optimize slow Wi-Fi at home?",
    answer:
      "Yes. We troubleshoot signal coverage, channel interference, device load, and can add mesh solutions where needed.",
  },
  {
    question: "Do you repair laptops and desktops?",
    answer:
      "Yes, including hardware replacement, performance tuning, malware cleanup, and software troubleshooting.",
  },
  {
    question: "Do you offer on-site IT support?",
    answer: "Yes. On-site support is available for both home and business environments within our service area.",
  },
  {
    question: "Can you set up office networks?",
    answer:
      "Yes. We design and deploy business networks with secure Wi-Fi, switching, firewalling, and device segmentation.",
  },
  {
    question: "Do you provide backup and disaster recovery guidance?",
    answer:
      "Yes. We help clients implement practical backup strategies and recovery procedures for critical data.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "Payment methods depend on plan type and account setup. We provide the available options during signup.",
  },
  {
    question: "Do you offer month-to-month packages?",
    answer:
      "Some packages are available month-to-month. Contract terms vary based on infrastructure and promotion.",
  },
  {
    question: "Are there installation fees?",
    answer:
      "Installation fees depend on location, equipment, and selected package. We quote this clearly before activation.",
  },
  {
    question: "Can I upgrade my package later?",
    answer: "Yes, upgrades are usually straightforward and can often be completed with minimal downtime.",
  },
  {
    question: "Can I move my service if I relocate?",
    answer:
      "Yes, subject to service availability at the new address. Contact us in advance so we can plan a smooth move.",
  },
  {
    question: "Do you provide invoices and account statements?",
    answer: "Yes. Billing documentation is available for personal and business accounting needs.",
  },
  {
    question: "Is there a fair usage policy?",
    answer:
      "Plan-specific acceptable use and fair usage terms may apply. We provide these details at signup.",
  },
  {
    question: "Do you assist with gaming or streaming optimization?",
    answer:
      "Yes. We can tune router settings, suggest package changes, and optimize local network conditions.",
  },
  {
    question: "Can businesses get managed network maintenance?",
    answer:
      "Yes. We offer ongoing support and maintenance options tailored to business operations and uptime priorities.",
  },
  {
    question: "Do you help with email and cloud setup?",
    answer:
      "Yes. We can assist with account setup, migration, security hardening, and productivity tool configuration.",
  },
  {
    question: "How do I contact you fastest?",
    answer: "For fastest response, use WhatsApp or call us directly at 079 938 1260.",
  },
]

const faqStats = [
  { label: 'Internet', value: 'Coverage, speeds and installs', icon: SignalIcon },
  { label: 'Support', value: 'Faults, Wi-Fi and outages', icon: LifebuoyIcon },
  { label: 'IT Services', value: 'Repairs and office networks', icon: ComputerDesktopIcon },
  { label: 'Billing', value: 'Packages, upgrades and invoices', icon: CreditCardIcon },
]

const FaqPage = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]))

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  return (
    <main className="site-page text-white">
      <AnimatedSection direction="up" className="site-hero px-4 pb-20 pt-32 text-center sm:px-6 lg:pt-48">
        <div className="relative mx-auto max-w-4xl">
          <p className="site-eyebrow">Support Center</p>
          <h1 className="mt-6 text-5xl font-black leading-[0.9] tracking-[-0.03em] sm:text-6xl lg:text-8xl">
            Common <span className="text-[#f97316]">Questions</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
            Quick answers about our internet services, support process, billing, and technical assistance.
          </p>
          <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {faqStats.map((item) => (
              <div key={item.label} className="site-card rounded-2xl p-5 text-left border-zinc-800/50 backdrop-blur-md">
                <item.icon className="h-6 w-6 text-[#f97316]" />
                <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-white">{item.label}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-500 font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[340px_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-32 h-fit">
          <AnimatedSection direction="up" delay={200} className="site-panel rounded-2xl p-8 border-zinc-800/50 bg-zinc-900/30">
            <p className="site-eyebrow">Need it faster?</p>
            <h2 className="mt-4 text-3xl font-black text-white leading-tight">Talk to support directly</h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">
              If your connection is down or you need urgent help, call or WhatsApp the team so we can start diagnostics immediately.
            </p>
            <div className="mt-8 grid gap-3">
              <a className="rounded-xl bg-[#f97316] px-6 py-4 text-center text-sm font-black text-white transition-all duration-300 hover:brightness-110 shadow-lg shadow-[#f97316]/20" href="tel:+27799381260">
                Call Us Now
              </a>
              <a className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-4 text-center text-sm font-black text-zinc-300 transition-all duration-300 hover:border-[#f97316] hover:text-white" href="https://wa.me/27799381260" target="_blank" rel="noopener noreferrer">
                WhatsApp Support
              </a>
            </div>
          </AnimatedSection>
        </aside>

        <AnimatedSection direction="up" delay={300} className="site-card rounded-3xl p-4 sm:p-6 border-zinc-800/50 overflow-hidden">
          {faqItems.map((item, index) => {
            const isOpen = openItems.has(index)
            return (
              <div
                key={item.question}
                className="border-b border-zinc-800/80 px-2 py-5 last:border-b-0 sm:px-4"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="group flex w-full items-center justify-between text-left transition-all duration-500 ease-out hover:bg-zinc-800/30 p-3 rounded-2xl focus:outline-none"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="text-lg font-bold text-zinc-100 pr-4 transition-colors duration-300 group-hover:text-[#f97316] flex items-start">
                    <span className="mr-4 text-sm font-black text-[#f97316] opacity-50">{String(index + 1).padStart(2, '0')}</span>
                    {item.question}
                  </span>
                  <div className="flex-shrink-0 transform transition-transform duration-500 group-hover:scale-125">
                    {isOpen ? (
                      <ChevronUpIcon className="h-6 w-6 text-[#f97316]" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-6 text-zinc-600 group-hover:text-[#f97316]" />
                    )}
                  </div>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-14 text-base leading-relaxed text-zinc-400">
                    {item.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </AnimatedSection>
      </div>
    </main>
  )
}

export default FaqPage
