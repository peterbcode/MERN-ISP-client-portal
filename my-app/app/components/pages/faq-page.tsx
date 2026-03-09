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

const FaqPage = () => {
  return (
    <main className="bg-black text-white">
      <section className="mx-auto max-w-4xl px-4 pb-14 pt-32 text-center sm:px-6 lg:pt-40">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]">Support Center</p>
        <h1 className="mt-4 text-4xl font-black sm:text-5xl">Frequently Asked Questions</h1>
        <p className="mx-auto mt-5 max-w-2xl text-zinc-300">
          Quick answers about our internet services, support process, billing, and technical assistance.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-2 sm:p-3">
          {faqItems.map((item, index) => (
            <details
              key={item.question}
              open={index === 0}
              className="border-b border-zinc-800/80 px-4 py-4 last:border-b-0 sm:px-5"
            >
              <summary className="cursor-pointer list-none pr-8 text-left text-base font-semibold text-zinc-100">
                {index + 1}. {item.question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  )
}

export default FaqPage
