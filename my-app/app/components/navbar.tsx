'use client'

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  Bars3Icon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const navigation = [
  { name: 'Services', href: '/#services' },
  { name: 'ISP', href: '/isp' },
  { name: 'Success Stories', href: '/#success-stories' },
  { name: 'Contact Us', href: '/contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="relative z-50 w-full">
      <div data-cursor-invert className="bg-[#f97316] text-white">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-3 text-[10px] font-medium sm:px-6 sm:text-xs lg:px-8">
          <div className="hidden items-center gap-5 md:flex">
            <span className="flex items-center gap-1.5 whitespace-nowrap text-white/95">
              <MapPinIcon className="h-3.5 w-3.5 stroke-[2.25]" />
              Riebeek Kasteel, Western Cape
            </span>
            <span className="h-3 w-px bg-white/30" aria-hidden="true" />
            <a href="mailto:info@valley-computers.co.za" className="flex items-center gap-1.5 whitespace-nowrap text-white/95 transition hover:text-white">
              <EnvelopeIcon className="h-3.5 w-3.5 stroke-[2.25]" />
              info@valley-computers.co.za
            </a>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <a href="tel:+27799381260" className="flex items-center gap-1.5 whitespace-nowrap text-white/95 transition hover:text-white">
              <PhoneIcon className="h-3.5 w-3.5 stroke-[2.25]" />
              <span className="hidden font-bold sm:inline">Call Us:</span> 079 938 1260
            </a>
            <span className="hidden h-3 w-px bg-white/30 sm:block" aria-hidden="true" />
            <a href="https://wa.me/27799381260" className="flex items-center gap-1.5 whitespace-nowrap text-white/95 transition hover:text-white">
              <ChatBubbleOvalLeftEllipsisIcon className="h-3.5 w-3.5 stroke-[2.25]" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <Disclosure
        as="nav"
        className={`text-white transition-all duration-300 ${
          isScrolled
            ? 'fixed left-0 right-0 top-0 border-b border-white/10 bg-black/95 shadow-[0_8px_28px_rgba(0,0,0,0.45)] backdrop-blur supports-[backdrop-filter]:bg-black/85'
            : 'absolute inset-x-0 top-10 bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between sm:h-20">
            <button
              type="button"
              aria-label="Valley Computers Home"
              className="-ml-1 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-left leading-none transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:border-[#f97316]/55 hover:bg-white/[0.05] hover:shadow-[0_10px_24px_rgba(249,115,22,0.2)] sm:ml-0 sm:gap-3.5 sm:px-3 sm:py-2"
              onClick={() => router.push('/')}
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#f97316] text-sm font-black tracking-tight text-white shadow-[0_10px_24px_rgba(249,115,22,0.45)] sm:h-10 sm:w-10">
                VC
              </span>
              <span className="flex flex-col">
                <span className="text-[1rem] font-black tracking-tight text-[#f97316] sm:text-[1.08rem] lg:text-[1.15rem]">
                  VALLEY
                </span>
                <span className="-mt-0.5 text-[0.86rem] font-extrabold tracking-tight text-zinc-100 sm:text-[0.94rem] lg:text-[1rem]">
                  COMPUTERS
                </span>
              </span>
            </button>

            <div className="hidden items-center gap-8 lg:gap-10 md:flex">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative text-[15px] font-semibold transition-colors after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-[#f97316] after:transition-all hover:text-[#f97316] hover:after:w-full ${
                    (item.href === '/#services' || item.href === '/#success-stories') && pathname === '/'
                      ? 'text-white/95'
                      : pathname === item.href
                        ? 'text-[#f97316] after:w-full'
                        : 'text-white/90'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Menu as="div" className="relative">
                <MenuButton className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 bg-white/5 text-white/95 transition hover:border-[#f97316]/60 hover:bg-white/10 hover:text-[#f97316]">
                  <ChevronDownIcon className="h-5 w-5" />
                </MenuButton>
                <MenuItems className="absolute right-0 z-50 mt-3 w-44 rounded-xl border border-white/20 bg-zinc-950 p-2 shadow-[0_14px_30px_rgba(0,0,0,0.5)]">
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        href="/faq"
                        className={`block rounded-md px-3 py-2.5 text-sm font-semibold text-white ${
                          focus ? 'bg-white/12 text-[#f97316]' : 'text-white/95'
                        }`}
                      >
                        FAQ
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        href="/login"
                        className={`block rounded-md px-3 py-2.5 text-sm font-semibold text-white ${
                          focus ? 'bg-white/12 text-[#f97316]' : 'text-white/95'
                        }`}
                      >
                        Login
                      </Link>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>

            <div className="hidden md:block">
              <button
                type="button"
                className="rounded-full bg-[#f97316] px-6 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(243,111,0,0.3)] ring-1 ring-[#f8a258]/40 transition-all hover:-translate-y-0.5 hover:brightness-110 lg:px-7 lg:py-3"
              >
                Partner With Us
              </button>
            </div>

            <div className="md:hidden">
              <DisclosureButton className="group inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10">
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="block h-6 w-6 group-data-open:hidden" aria-hidden="true" />
                <XMarkIcon className="hidden h-6 w-6 group-data-open:block" aria-hidden="true" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="border-t border-white/10 bg-black md:hidden">
          <div className="space-y-2 px-4 py-4">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="block rounded-md px-3 py-2 text-sm font-semibold text-white hover:bg-white/10">
                {item.name}
              </Link>
            ))}
            <Link href="/faq" className="block rounded-md px-3 py-2 text-sm font-semibold text-white hover:bg-white/10">
              FAQ
            </Link>
            <Link href="/login" className="block rounded-md px-3 py-2 text-sm font-semibold text-white hover:bg-white/10">
              Login
            </Link>
            <button
              type="button"
              className="mt-2 w-full rounded-full bg-[#f97316] px-6 py-3 text-sm font-bold text-white transition hover:brightness-110"
            >
              Partner With Us
            </button>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </header>
  )
}


