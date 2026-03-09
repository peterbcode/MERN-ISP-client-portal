const details = [
  { label: "Phone", value: "079 938 1260" },
  { label: "Email", value: "info@valley-computers.co.za" },
  { label: "Location", value: "Riebeek Kasteel, Western Cape" },
];

const ContactPage = () => {
  return (
    <main className="bg-black text-white">
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-32 sm:px-6 lg:px-8 lg:pt-40">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f36f00]">Contact</p>
        <h1 className="mt-4 text-4xl font-black sm:text-5xl lg:text-6xl">Get In Touch</h1>
        <p className="mt-5 max-w-3xl text-zinc-300">
          Reach out for ISP signups, support, repair requests, and project enquiries.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-3">
            {details.map((item) => (
              <article key={item.label} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#f36f00]">{item.label}</p>
                <p className="mt-2 text-sm text-zinc-200">{item.value}</p>
              </article>
            ))}
          </div>

          <form className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" placeholder="Your Name" />
              <input className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" placeholder="Phone Number" />
              <input className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm sm:col-span-2" placeholder="Email Address" />
              <textarea className="min-h-28 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm sm:col-span-2" placeholder="How can we help?" />
            </div>
            <button className="mt-4 rounded-full bg-[#f36f00] px-6 py-2.5 text-sm font-bold text-white transition hover:brightness-110">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
