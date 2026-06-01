'use client'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'
import AnimatedSection from './ui/animated-section'

const coverageWhatsAppUrl =
  "https://wa.me/27799381260?text=Hi,%20I'd%20like%20to%20check%20coverage%20for%20my%20address"

const ContactStrip = () => {
  return (
    <section className="scroll-mt-28 bg-[#f97316] py-16 text-white sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection direction="up" className="mx-auto mb-8 max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold !text-black sm:text-5xl">Check Your Coverage</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
            Message us your address and we will confirm service availability.
          </p>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={200} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_16px_35px_rgba(0,0,0,0.35)] sm:p-8">
          <a
            href={coverageWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f97316] px-8 py-4 text-lg font-bold text-white shadow-[0_4px_24px_rgba(243,111,0,0.3)] transition hover:-translate-y-0.5 hover:brightness-110"
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
            Check Coverage on WhatsApp
          </a>
        </AnimatedSection>
      </div>
    </section>
  )
}

export default ContactStrip
