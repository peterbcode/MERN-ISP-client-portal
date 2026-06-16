import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Navbar from '../components/navbar'
import SiteFooter from '../components/site-footer'

export const metadata: Metadata = {
  title: 'Privacy Policy - Riebeek Valley Computers',
  description: 'Privacy Policy for Riebeek Valley Computers internet, support, and IT services.',
}

const lastUpdated = '4 May 2026'

const personalInformation = [
  'Name, email address, phone number, and account details',
  'Installation address, service address, and support location information',
  'Billing, invoice, service plan, and payment status information',
  'Support requests, repair notes, fault reports, and communication history',
]

const technicalInformation = [
  'IP address, device information, browser type, and login activity',
  'Service usage, speed-test results, connection status, and network diagnostics',
  'Router, wireless, device, and installation information needed for support',
  'Website analytics and cookie preferences where enabled',
]

const useCases = [
  'Provide, activate, maintain, and troubleshoot internet and IT services',
  'Manage customer accounts, billing, invoices, and service communications',
  'Respond to support requests, faults, repairs, and coverage checks',
  'Protect customers, systems, and networks against abuse, fraud, and security risks',
  'Improve our services, website, client portal, and customer support processes',
]

const rights = [
  'Ask us what personal information we hold about you',
  'Ask us to correct inaccurate or outdated information',
  'Ask us to delete information where we no longer have a lawful reason to keep it',
  'Opt out of marketing messages while still receiving important service notices',
]

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Navbar from '../components/navbar'
import SiteFooter from '../components/site-footer'
import AnimatedSection from '../components/ui/animated-section'

export const metadata: Metadata = {
  title: 'Privacy Policy - Riebeek Valley Computers',
  description: 'Privacy Policy for Riebeek Valley Computers internet, support, and IT services.',
}

const lastUpdated = '4 May 2026'

const personalInformation = [
  'Name, email address, phone number, and account details',
  'Installation address, service address, and support location information',
  'Billing, invoice, service plan, and payment status information',
  'Support requests, repair notes, fault reports, and communication history',
]

const technicalInformation = [
  'IP address, device information, browser type, and login activity',
  'Service usage, speed-test results, connection status, and network diagnostics',
  'Router, wireless, device, and installation information needed for support',
  'Website analytics and cookie preferences where enabled',
]

const useCases = [
  'Provide, activate, maintain, and troubleshoot internet and IT services',
  'Manage customer accounts, billing, invoices, and service communications',
  'Respond to support requests, faults, repairs, and coverage checks',
  'Protect customers, systems, and networks against abuse, fraud, and security risks',
  'Improve our services, website, client portal, and customer support processes',
]

const rights = [
  'Ask us what personal information we hold about you',
  'Ask us to correct inaccurate or outdated information',
  'Ask us to delete information where we no longer have a lawful reason to keep it',
  'Opt out of marketing messages while still receiving important service notices',
]

const Section = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => (
  <section className="border-t border-zinc-800/60 pt-10 first:border-t-0 first:pt-0">
    <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
    <div className="mt-5 space-y-4 text-base leading-relaxed text-zinc-400">{children}</div>
  </section>
)

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="site-page min-h-screen text-zinc-100">
        <AnimatedSection direction="up" className="site-hero px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pt-48">
          <div className="mx-auto max-w-4xl text-center">
            <p className="site-eyebrow">Legal</p>
            <h1 className="mt-6 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-8xl">
              Privacy <span className="text-[#f97316]">Policy</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
              This policy explains how Riebeek Valley Computers collects, uses, protects, and
              stores information when you use our services.
            </p>
            <p className="mt-6 text-sm font-black text-[#f97316] uppercase tracking-[0.2em]">Last updated: {lastUpdated}</p>
          </div>
        </AnimatedSection>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
          <aside className="lg:sticky lg:top-32 h-fit">
            <AnimatedSection direction="up" delay={200} className="site-panel rounded-2xl p-6 border-zinc-800/50 bg-zinc-900/30">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#f97316]">Quick Links</h2>
              <nav className="mt-6 space-y-4 text-sm font-bold text-zinc-500">
                <Link className="block transition-colors hover:text-[#f97316]" href="/">
                  Home
                </Link>
                <Link className="block transition-colors hover:text-[#f97316]" href="/terms">
                  Terms of Service
                </Link>
                <Link className="block transition-colors hover:text-[#f97316]" href="/contact">
                  Contact Us
                </Link>
                <a className="block transition-colors hover:text-[#f97316]" href="tel:+27799381260">
                  079 938 1260
                </a>
              </nav>
            </AnimatedSection>
          </aside>

          <AnimatedSection direction="up" delay={300} className="site-card rounded-3xl p-8 sm:p-12 lg:p-16 border-zinc-800/50 backdrop-blur-md">
            <div className="space-y-12">
              <Section title="1. Who We Are">
                <p>
                  Riebeek Valley Computers provides connectivity, technical support, computer repairs,
                  network installation, and related customer portal services. We only collect information
                  we need to deliver, support, secure, and improve those services.
                </p>
              </Section>

              <Section title="2. Information We Collect">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl bg-black/40 p-6 border border-zinc-800/50">
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">
                      Personal Information
                    </h3>
                    <ul className="mt-4 list-disc space-y-3 pl-5 text-sm font-medium">
                      {personalInformation.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-black/40 p-6 border border-zinc-800/50">
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">
                      Technical Information
                    </h3>
                    <ul className="mt-4 list-disc space-y-3 pl-5 text-sm font-medium">
                      {technicalInformation.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Section>

              <Section title="3. How We Use Information">
                <ul className="list-disc space-y-3 pl-5 font-medium">
                  {useCases.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Section>

              <Section title="4. Mailing List and Marketing">
                <p>
                  If you join our mailing list, we use your email address to send relevant updates,
                  service news, and announcements. You can ask us to remove you from the list at any
                  time. Service-critical notices may still be sent even if you opt out of marketing.
                </p>
              </Section>

              <Section title="5. Cookies and Analytics">
                <p>
                  We use cookies and similar browser storage for essential site functions such as
                  login sessions, cookie preferences, and security. Analytics may be used to understand
                  site performance and improve the customer experience where enabled.
                </p>
              </Section>

              <Section title="6. Sharing Information">
                <p>
                  We do not sell your personal information. We may share limited information with trusted
                  providers when needed for hosting, database storage, support tools, payment processing,
                  email delivery, analytics, legal compliance, or network operations.
                </p>
              </Section>

              <Section title="7. Data Security">
                <p>
                  We use reasonable technical and organizational safeguards to protect customer
                  information, including access controls, encrypted password storage, secure hosting
                  practices, and careful handling of support information.
                </p>
                <div className="rounded-2xl border-l-4 border-[#f97316] bg-zinc-900/40 p-6 border-y border-r border-zinc-800/50">
                  <p className="text-zinc-300 font-medium">
                    No online system is risk-free, so please keep your account password and router
                    credentials private and tell us quickly if you suspect unauthorized access.
                  </p>
                </div>
              </Section>

              <Section title="8. Data Retention">
                <p>
                  We keep information only as long as needed for service delivery, billing, support,
                  legal obligations, security, and legitimate business records. Retention periods vary
                  depending on the type of information and why it was collected.
                </p>
              </Section>

              <Section title="9. Your Choices and Rights">
                <ul className="list-disc space-y-3 pl-5 font-medium">
                  {rights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Section>

              <Section title="10. Children">
                <p>
                  Our services are intended for customers who can lawfully enter into a service
                  agreement. We do not knowingly collect personal information from children without
                  appropriate consent.
                </p>
              </Section>

              <Section title="11. Changes to This Policy">
                <p>
                  We may update this policy when our services, systems, legal requirements, or operating
                  practices change. The latest version will be posted on this page with an updated date.
                </p>
              </Section>

              <Section title="12. Contact Information">
                <div className="rounded-2xl bg-black/40 p-8 border border-zinc-800/50">
                  <p className="text-zinc-400 font-medium">
                    Questions about privacy or personal information can be sent to Riebeek Valley
                    Computers.
                  </p>
                  <div className="mt-6 space-y-3">
                    <p className="flex items-center gap-3">
                      <strong className="text-xs font-black uppercase tracking-widest text-zinc-500">Phone:</strong>{' '}
                      <a className="text-lg font-bold text-[#f97316] hover:text-orange-300 transition-colors" href="tel:+27799381260">
                        079 938 1260
                      </a>
                    </p>
                    <p className="flex items-center gap-3">
                      <strong className="text-xs font-black uppercase tracking-widest text-zinc-500">Address:</strong>
                      <span className="text-zinc-200 font-bold">6 Church Rd, Riebeek-Kasteel, 7307</span>
                    </p>
                  </div>
                </div>
              </Section>
            </div>

            <div className="mt-16 flex flex-col gap-4 border-t border-zinc-800/60 pt-10 sm:flex-row">
              <Link
                href="/"
                className="inline-flex justify-center rounded-xl bg-[#f97316] px-8 py-4 text-sm font-black text-white transition-all duration-300 hover:brightness-110 shadow-lg shadow-[#f97316]/20"
              >
                Back to Home
              </Link>
              <Link
                href="/contact"
                className="inline-flex justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 px-8 py-4 text-sm font-black text-zinc-300 transition-all duration-300 hover:border-[#f97316] hover:text-white"
              >
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
      </main>
      <SiteFooter />
    </>
  )
}
