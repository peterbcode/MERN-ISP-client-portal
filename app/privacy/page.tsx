import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'

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
  <section className="border-t border-zinc-800 pt-8 first:border-t-0 first:pt-0">
    <h2 className="heading-compact text-2xl font-bold text-zinc-100">{title}</h2>
    <div className="mt-4 space-y-4 text-base leading-8 text-zinc-300">{children}</div>
  </section>
)

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#070707] text-zinc-100">
      <section className="border-b border-zinc-800 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.14),transparent_34%),linear-gradient(180deg,#101010,#070707)] px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#f97316]">
            Legal
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            This policy explains how Riebeek Valley Computers collects, uses, protects, and
            stores information when you use our website, client portal, internet services, repairs,
            and support channels.
          </p>
          <p className="mt-4 text-sm text-zinc-400">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit border border-zinc-800 bg-zinc-950/70 p-5 lg:sticky lg:top-8">
            <h2 className="heading-compact text-lg font-bold text-zinc-100">Quick Links</h2>
            <nav className="mt-4 space-y-3 text-sm text-zinc-400">
              <Link className="block hover:text-[#f97316]" href="/">
                Home
              </Link>
              <Link className="block hover:text-[#f97316]" href="/terms">
                Terms of Service
              </Link>
              <Link className="block hover:text-[#f97316]" href="/contact">
                Contact Us
              </Link>
              <a className="block hover:text-[#f97316]" href="tel:+27799381260">
                079 938 1260
              </a>
            </nav>
          </aside>

          <article className="border border-zinc-800 bg-zinc-950/70 p-6 shadow-2xl shadow-black/20 sm:p-8 lg:p-10">
            <div className="space-y-10">
              <Section title="1. Who We Are">
                <p>
                  Riebeek Valley Computers provides connectivity, technical support, computer repairs,
                  network installation, and related customer portal services. We only collect information
                  we need to deliver, support, secure, and improve those services.
                </p>
              </Section>

              <Section title="2. Information We Collect">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-zinc-900/80 p-4 ring-1 ring-zinc-800">
                    <h3 className="heading-compact text-lg font-semibold text-zinc-100">
                      Personal Information
                    </h3>
                    <ul className="mt-3 list-disc space-y-2 pl-5">
                      {personalInformation.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-zinc-900/80 p-4 ring-1 ring-zinc-800">
                    <h3 className="heading-compact text-lg font-semibold text-zinc-100">
                      Technical Information
                    </h3>
                    <ul className="mt-3 list-disc space-y-2 pl-5">
                      {technicalInformation.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Section>

              <Section title="3. How We Use Information">
                <ul className="list-disc space-y-2 pl-5">
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
                <div className="border-l-4 border-[#f97316] bg-zinc-900/80 p-4">
                  <p className="text-zinc-200">
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
                <ul className="list-disc space-y-2 pl-5">
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
                <div className="bg-zinc-900/80 p-5 ring-1 ring-zinc-800">
                  <p className="text-zinc-300">
                    Questions about privacy or personal information can be sent to Riebeek Valley
                    Computers.
                  </p>
                  <div className="mt-4 space-y-2 text-zinc-300">
                    <p>
                      <strong className="text-zinc-100">Phone:</strong>{' '}
                      <a className="text-[#f97316] hover:text-orange-300" href="tel:+27799381260">
                        079 938 1260
                      </a>
                    </p>
                    <p>
                      <strong className="text-zinc-100">Address:</strong> 6 Church Rd,
                      Riebeek-Kasteel, 7307
                    </p>
                  </div>
                </div>
              </Section>
            </div>

            <div className="mt-10 flex flex-col gap-3 border-t border-zinc-800 pt-8 sm:flex-row">
              <Link
                href="/"
                className="inline-flex justify-center bg-[#f97316] px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Back to Home
              </Link>
              <Link
                href="/contact"
                className="inline-flex justify-center border border-zinc-700 bg-zinc-900 px-5 py-3 font-semibold text-zinc-100 transition hover:border-[#f97316]"
              >
                Contact Us
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
