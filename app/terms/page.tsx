import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service - Riebeek Valley Computers',
  description: 'Terms of Service for Riebeek Valley Computers internet, support, and IT services.',
}

const lastUpdated = '4 May 2026'

const prohibitedActivities = [
  'Illegal file sharing, copyright infringement, or unlawful content distribution',
  'Spam, phishing, malware, botnets, or other malicious activity',
  'Unauthorized access to networks, accounts, routers, or systems',
  'Using the service in a way that disrupts other customers or network stability',
  'Reselling or sharing the service outside your approved installation address without written consent',
]

const dataUseItems = [
  'Package speeds depend on your selected plan, location, equipment, and local network conditions.',
  'Fair-use and acceptable-use limits may apply where usage affects network quality for other customers.',
  'We may manage traffic during faults, maintenance, abuse investigations, or severe congestion.',
  'Upgrades, relocations, and equipment changes may require a new quote or coverage check.',
]

const billingItems = [
  'Service fees are billed according to the plan or quote accepted by you.',
  'Late or missed payments may lead to restricted access, suspension, or reconnection fees.',
  'Any once-off installation, call-out, repair, or equipment charges will be quoted separately where applicable.',
  'Prices may change with reasonable notice, especially where supplier, infrastructure, or regulatory costs change.',
]

const Section = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <section className="border-t border-zinc-800 pt-8 first:border-t-0 first:pt-0">
    <h2 className="heading-compact text-2xl font-bold text-zinc-100">{title}</h2>
    <div className="mt-4 space-y-4 text-base leading-8 text-zinc-300">{children}</div>
  </section>
)

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#070707] text-zinc-100">
      <section className="border-b border-zinc-800 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.14),transparent_34%),linear-gradient(180deg,#101010,#070707)] px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#f97316]">
            Legal
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            These terms explain how Riebeek Valley Computers provides internet, technical support,
            repairs, network services, and related customer portal features.
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
              <Link className="block hover:text-[#f97316]" href="/privacy">
                Privacy Policy
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
              <Section title="1. Agreement to These Terms">
                <p>
                  By using our website, client portal, internet services, repair services, or support
                  channels, you agree to these Terms of Service. If you do not agree, please do not use
                  the service and contact us so we can help close or adjust your account.
                </p>
              </Section>

              <Section title="2. Services We Provide">
                <p>
                  Riebeek Valley Computers provides internet connectivity, network installation, PC and
                  laptop repairs, managed IT support, account administration, and customer support for
                  homes and businesses in our service areas.
                </p>
                <div className="border-l-4 border-[#f97316] bg-zinc-900/80 p-4">
                  <p className="text-zinc-200">
                    Service availability depends on coverage, infrastructure, equipment, payment status,
                    and technical feasibility at the installation address.
                  </p>
                </div>
              </Section>

              <Section title="3. Customer Responsibilities">
                <p>
                  You are responsible for keeping your account details, router credentials, and devices
                  secure. You must also make sure anyone using your connection follows these terms.
                </p>
                <div className="bg-red-950/30 p-4 ring-1 ring-red-900/60">
                  <h3 className="heading-compact text-lg font-semibold text-red-100">
                    Prohibited Activities
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-300">
                    {prohibitedActivities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </Section>

              <Section title="4. Service Availability and Support">
                <p>
                  We work to keep services stable and respond quickly to faults, but we cannot guarantee
                  uninterrupted service. Outages may happen because of weather, power failures, upstream
                  provider issues, maintenance, equipment failure, or other events outside our control.
                </p>
                <p>
                  Planned maintenance will be communicated where practical. Urgent repairs may happen
                  without advance notice when needed to protect the network.
                </p>
              </Section>

              <Section title="5. Billing and Payments">
                <ul className="list-disc space-y-2 pl-5">
                  {billingItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Section>

              <Section title="6. Data Usage, Speeds, and Fair Use">
                <ul className="list-disc space-y-2 pl-5">
                  {dataUseItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Section>

              <Section title="7. Equipment and Installation">
                <p>
                  Equipment supplied by us may remain our property unless your quote or invoice says
                  otherwise. You must take reasonable care of installed equipment and allow access for
                  maintenance, repairs, recovery, or upgrades when needed.
                </p>
              </Section>

              <Section title="8. Privacy and Personal Information">
                <p>
                  We handle personal information according to our Privacy Policy. This includes account
                  details, contact information, support history, billing information, and technical
                  information needed to provide the service.
                </p>
                <Link className="font-semibold text-[#f97316] hover:text-orange-300" href="/privacy">
                  Read the Privacy Policy
                </Link>
              </Section>

              <Section title="9. Suspension or Termination">
                <p>
                  You may cancel your service by contacting us. We may suspend or terminate service for
                  non-payment, abuse, illegal activity, safety risks, repeated breach of these terms, or
                  technical reasons that prevent continued service.
                </p>
              </Section>

              <Section title="10. Limitation of Liability">
                <p>
                  To the fullest extent allowed by law, we are not liable for indirect losses such as
                  lost profit, lost data, business interruption, or losses caused by third-party outages.
                  Nothing in these terms removes rights you have under applicable consumer protection
                  laws.
                </p>
              </Section>

              <Section title="11. Changes to These Terms">
                <p>
                  We may update these terms when services, laws, supplier requirements, or operating
                  practices change. The latest version will be posted on this page with an updated date.
                </p>
              </Section>

              <Section title="12. Contact Information">
                <div className="bg-zinc-900/80 p-5 ring-1 ring-zinc-800">
                  <p className="text-zinc-300">
                    Questions about these terms can be sent to Riebeek Valley Computers.
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
