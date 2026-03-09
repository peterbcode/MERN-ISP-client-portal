const points = [
  { value: '99%', label: 'Service Reliability' },
  { value: '24/7', label: 'Team Support' },
  { value: 'Same Day', label: 'Fast Response' },
]

const WhyChooseUs = () => {
  return (
    <section className="bg-[#0d0d0d] py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f36f00]">Reliability</p>
        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Why Choose Valley Computers</h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {points.map((point) => (
            <div key={point.label} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-3xl font-extrabold text-[#f36f00]">{point.value}</p>
              <p className="mt-2 text-sm text-zinc-300">{point.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
