const SiteFooter = () => {
  return (
    <footer className="bg-black py-12 text-zinc-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="text-lg font-extrabold text-white">
            <span className="text-[#f36f00]">VALLEY</span> COMPUTERS
          </p>
          <p className="mt-3 text-sm">Trusted local ISP and IT partner.</p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">Services</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Fibre Internet</li>
            <li>Wireless Internet</li>
            <li>Network Engineering</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">Company</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>About</li>
            <li>Success Stories</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Riebeek Kasteel</li>
            <li>079 938 1260</li>
            <li>info@valley-computers.co.za</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
