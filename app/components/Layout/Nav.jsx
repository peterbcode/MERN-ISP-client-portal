import Link from "next/link";

export default function Nav() {
  return (
    <nav className="w-full bg-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          VALLEY COMPUTERS
        </Link>

        {/* Menu */}
        <ul className="flex gap-6 text-gray-700 font-medium">
          <li>
            <Link href="/#services">Services</Link>
          </li>
          <li>
            <Link href="/isp">ISP</Link>
          </li>
          <li>
            <Link href="/#testimonials">Success Stories</Link>
          </li>
          <li>
            <Link href="/contact">Contact Us</Link>
          </li>
          <li>
            <Link href="/faq">FAQ</Link>
          </li>
          <li>
            <Link href="/contact">Partner With Us</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
