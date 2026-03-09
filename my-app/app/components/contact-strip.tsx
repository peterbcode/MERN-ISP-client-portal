const ContactStrip = () => {
  return (
    <section data-cursor-invert className="bg-[#f36f00] py-14 text-black">
      <div className="mx-auto max-w-4xl rounded-2xl bg-black p-8 text-white shadow-xl">
        <h2 className="text-center text-2xl font-extrabold">Get Your Connect</h2>
        <p className="mt-2 text-center text-sm text-zinc-300">
          Share your details and our team will contact you.
        </p>
        <form className="mt-6 grid gap-3 sm:grid-cols-2">
          <input className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" placeholder="Your Name" />
          <input className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" placeholder="Phone Number" />
          <input className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm sm:col-span-2" placeholder="Email Address" />
          <button className="rounded-md bg-[#f36f00] px-4 py-2 text-sm font-bold text-white sm:col-span-2">
            Get Connected
          </button>
        </form>
      </div>
    </section>
  )
}

export default ContactStrip
