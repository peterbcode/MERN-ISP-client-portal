'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  ChevronDownIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { initNavbarScroll } from './animations/navbarScroll'

const phoneHref = 'tel:+27799381260'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false)
  
  const router = useRouter()
  const pathname = usePathname()
  const orangeTopBarRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileOverlayRef = useRef<HTMLDivElement>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Scroll listener for standard animations/scroll styling
  useEffect(() => {
    if (!navRef.current) return
    return initNavbarScroll(navRef.current)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Close menus when route/pathname changes
  useEffect(() => {
    setIsDropdownOpen(false)
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Reset mobile products accordion state when mobile menu closes
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setIsMobileProductsOpen(false)
    }
  }, [isMobileMenuOpen])

  // Event handlers for desktop dropdown hover
  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
    setIsDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 150)
  }

  // Handle outside clicks and Escape key to close menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false)
        setIsMobileMenuOpen(false)
      }
    }

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleOutsideClick)
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
    }
  }, [])

  // Focus trap for mobile overlay menu accessibility
  useEffect(() => {
    if (!isMobileMenuOpen || !mobileOverlayRef.current) return

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = mobileOverlayRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusableElements || focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    window.addEventListener('keydown', handleFocusTrap)
    const focusable = mobileOverlayRef.current.querySelectorAll<HTMLElement>('a[href], button')
    if (focusable.length > 0) {
      setTimeout(() => {
        focusable[0].focus()
      }, 50)
    }

    return () => {
      window.removeEventListener('keydown', handleFocusTrap)
    }
  }, [isMobileMenuOpen])

  // Stagger delays calculation for mobile menu links
  const getTransitionStyle = (index: number) => {
    if (isMobileMenuOpen) {
      const delay = 90 + index * 60
      return {
        transitionProperty: 'transform, opacity',
        transitionDuration: '350ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}ms`,
      }
    } else {
      return {
        transitionProperty: 'transform, opacity',
        transitionDuration: '180ms',
        transitionTimingFunction: 'ease-in',
        transitionDelay: '0ms',
      }
    }
  }

  return (
    <header ref={navRef} className="relative z-[1000] w-full">
      {/* Orange top bar - will translate up and fade when mobile menu is open */}
      <div
        id="orange-top-bar"
        ref={orangeTopBarRef}
        className={`relative z-[60] border-b border-white/20 bg-[#ff7e26] text-white transition-all duration-300 ${
          isMobileMenuOpen ? '-translate-y-full opacity-0' : ''
        }`}
      >
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-3 text-[10px] font-medium sm:px-6 sm:text-xs lg:px-8">
          <div className="flex items-center gap-3 md:gap-5">
            <div className="relative flex items-center">
              <a
                href="mailto:info@valley-computers.co.za?subject=Inquiry&body=Hi%20Valley%20Computers"
                aria-label="Send email to info@valley-computers.co.za"
                className="no-accent-hover flex items-center gap-1.5 whitespace-nowrap text-white transition-colors duration-200 hover:text-white/90 cursor-pointer"
              >
                <EnvelopeIcon className="h-3.5 w-3.5 stroke-[2.25]" />
                <span className="hidden md:inline">info@valley-computers.co.za</span>
                <span className="md:hidden">Email</span>
              </a>
            </div>
            <span className="hidden h-3 w-px bg-white/30 md:block" aria-hidden="true" />
            <a
              href="https://www.google.com/maps/search/?api=1&query=6%20Church%20Rd%2C%20Riebeek-Kasteel%2C%207307"
              target="_blank"
              rel="noopener noreferrer"
              className="no-accent-hover hidden items-center gap-1.5 whitespace-nowrap text-white transition-all duration-200 hover:text-white/90 hover:scale-105 md:flex"
            >
              <MapPinIcon className="h-3.5 w-3.5 stroke-[2.25]" />
              6 Church Rd, Riebeek-Kasteel, 7307
            </a>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <a
              href={phoneHref}
              aria-label="Call Valley Computers at 079 938 1260"
              title="Call 079 938 1260"
              className="no-accent-hover relative z-10 flex touch-manipulation items-center gap-1.5 whitespace-nowrap text-white transition-all duration-200 hover:scale-105 hover:text-white/90"
            >
              <PhoneIcon className="h-3.5 w-3.5 stroke-[2.25]" />
              <span className="hidden font-bold sm:inline">Call Us:</span>
              <span className="hidden sm:inline">079 938 1260</span>
            </a>
          </div>
        </div>
      </div>

      <nav
        className={`transition-all duration-300 z-[1000] ${
          isScrolled
            ? 'fixed left-0 right-0 top-0 border-b border-white/6 metal-bg shadow-[0_8px_28px_rgba(0,0,0,0.55)] backdrop-blur supports-[backdrop-filter]:bg-[#111214]/86'
            : 'absolute inset-x-0 top-10 bg-gradient-to-b from-black/42 to-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between sm:h-20">
            {/* Brand Logo */}
            <div
              className="-ml-1 flex items-center gap-3 px-3 py-1.5 text-left leading-none transition-all duration-300 ease-out cursor-pointer sm:ml-0 sm:gap-4 sm:px-3.5 sm:py-2 z-[1010]"
              onClick={() => router.push('/')}
            >
              <span className="flex items-center transition-all duration-300 ease-out hover:scale-105">
                <span className="text-[1.05rem] font-black tracking-tight sm:text-[1.2rem] lg:text-[1.3rem] text-[#ff7e26]">
                  VALLEY
                </span>
                <span className={`ml-1.5 text-[1.05rem] font-extrabold tracking-tight sm:text-[1.2rem] lg:text-[1.3rem] transition-all duration-300 ease-out ${
                  isScrolled || isMobileMenuOpen ? 'text-white' : 'text-zinc-100'
                }`}>
                  COMPUTERS
                </span>
              </span>
            </div>

            {/* Desktop Link items */}
            <div className="hidden items-center gap-8 lg:gap-10 md:flex">
              {/* Products Dropdown Trigger */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                ref={dropdownRef}
              >
                <Link
                  href="/products"
                  className="nav-link relative text-sm font-semibold uppercase tracking-[0.08em] transition-all duration-200 inline-flex items-center gap-1 group py-2 text-[#F5F5F0] focus:outline-none cursor-pointer text-left"
                >
                  <span className="relative flex items-center gap-1">
                    Products
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-[#ff7e26] transition-all duration-300 ${
                      isDropdownOpen ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </span>
                </Link>

                {/* Dropdown Panel matching mindmarket.com 3-column category structure */}
                <div
                  className={`absolute left-1/2 w-[760px] pt-2 transition-all duration-200 ease-out z-[1000] ${
                    isDropdownOpen
                      ? 'pointer-events-auto opacity-100'
                      : 'pointer-events-none opacity-0'
                  }`}
                  style={{
                    top: '100%',
                    transform: isDropdownOpen
                      ? 'translateX(-50%) translateY(0px)'
                      : 'translateX(-50%) translateY(-8px)',
                  }}
                >
                  <div className="border border-zinc-800/80 bg-[#0c0c0e]/95 backdrop-blur-md p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-6">
                      
                      {/* Column 1: Network Installation Services */}
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col">
                          <span className="text-xs uppercase tracking-widest text-[#ff7e26] font-bold">
                            Services
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                          <Link
                            href="/contact?service=Network Installation"
                            onClick={() => setIsDropdownOpen(false)}
                            className="group flex items-center gap-2.5 py-1 text-sm text-zinc-300 hover:text-[#ff7e26] transition-colors font-medium"
                          >
                            <span className="h-1 w-1 rounded-full bg-zinc-600 transition-all group-hover:w-1.5 group-hover:h-1.5 group-hover:bg-[#ff7e26]" />
                            Network Installation
                          </Link>
                          <Link
                            href="/contact?service=WiFi Setup"
                            onClick={() => setIsDropdownOpen(false)}
                            className="group flex items-center gap-2.5 py-1 text-sm text-zinc-300 hover:text-[#ff7e26] transition-colors font-medium"
                          >
                            <span className="h-1 w-1 rounded-full bg-zinc-600 transition-all group-hover:w-1.5 group-hover:h-1.5 group-hover:bg-[#ff7e26]" />
                            WiFi Setup
                          </Link>
                          <Link
                            href="/contact?service=Network Troubleshooting"
                            onClick={() => setIsDropdownOpen(false)}
                            className="group flex items-center gap-2.5 py-1 text-sm text-zinc-300 hover:text-[#ff7e26] transition-colors font-medium"
                          >
                            <span className="h-1 w-1 rounded-full bg-zinc-600 transition-all group-hover:w-1.5 group-hover:h-1.5 group-hover:bg-[#ff7e26]" />
                            Network Troubleshooting
                          </Link>
                        </div>
                      </div>

                      {/* Column 2: Cables */}
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col">
                          <Link
                            href="/products?category=cable"
                            onClick={() => setIsDropdownOpen(false)}
                            className="text-xs uppercase tracking-widest text-[#ff7e26] font-bold hover:text-white transition-colors"
                          >
                            Products
                          </Link>
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                          <Link
                            href="/products?category=cable"
                            onClick={() => setIsDropdownOpen(false)}
                            className="group flex items-center gap-2.5 py-1 text-sm text-zinc-300 hover:text-[#ff7e26] transition-colors font-medium"
                          >
                            <span className="h-1 w-1 rounded-full bg-zinc-600 transition-all group-hover:w-1.5 group-hover:h-1.5 group-hover:bg-[#ff7e26]" />
                            Ethernet Cables
                          </Link>
                        </div>
                      </div>

                    </div>

                    {/* Bottom bar */}
                    <div className="border-t border-zinc-800/80 pt-4 flex justify-between items-center text-xs">
                      <span className="text-zinc-500 font-medium">Looking for something else?</span>
                      <Link
                        href="/products"
                        onClick={() => setIsDropdownOpen(false)}
                        className="text-[#ff7e26] hover:text-[#ff7e26]/80 hover:underline font-extrabold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        Shop All Products &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* ISP */}
              <Link
                href="/isp"
                className={`nav-link relative text-sm font-semibold uppercase tracking-[0.08em] transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 inline-block group ${
                  pathname === '/isp'
                    ? 'text-[#ff7e26]'
                    : 'text-[#d1d5db] hover:text-[#ff7e26]'
                }`}
              >
                <span className="relative">
                  ISP
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#ff7e26] transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>

              {/* Contact Us */}
              <Link
                href="/contact"
                className={`nav-link relative text-sm font-semibold uppercase tracking-[0.08em] transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 inline-block group ${
                  pathname === '/contact'
                    ? 'text-[#ff7e26]'
                    : 'text-[#d1d5db] hover:text-[#ff7e26]'
                }`}
              >
                <span className="relative">
                  Contact Us
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#ff7e26] transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>

              {/* Extras Dropdown (FAQ, Login, Signup) */}
              <Menu as="div" className="relative">
                <MenuButton className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition cursor-pointer ${
                  isScrolled
                    ? 'border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/20 hover:text-white'
                    : 'border-white/20 bg-white/5 text-white/95 hover:border-[#ff7e26]/60 hover:bg-white/10 hover:text-[#ff7e26]'
                }`}>
                  <ChevronDownIcon className="h-5 w-5" />
                </MenuButton>
                <MenuItems className="absolute right-0 z-50 mt-2 w-44 rounded-xl border border-white/20 bg-zinc-950 p-2 shadow-[0_14px_30px_rgba(0,0,0,0.5)]">
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        href="/faq"
                        className={`block rounded-md px-3 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 hover:bg-white/12 hover:text-[#ff7e26] ${
                          focus ? 'bg-white/12 text-[#ff7e26]' : 'text-white/95'
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
                        className={`block rounded-md px-3 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 hover:bg-white/12 hover:text-[#ff7e26] ${
                          focus ? 'bg-white/12 text-[#ff7e26]' : 'text-white/95'
                        }`}
                      >
                        Login
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        href="/signup"
                        className={`block rounded-md px-3 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 hover:bg-white/12 hover:text-[#ff7e26] ${
                          focus ? 'bg-white/12 text-[#ff7e26]' : 'text-white/95'
                        }`}
                      >
                        Sign Up
                      </Link>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden md:block">
              <button
                type="button"
                onClick={() => router.push('/signup')}
                className="rounded-full bg-black px-6 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(0,0,0,0.3)] ring-1 ring-white/40 transition-all hover:-translate-y-0.5 hover:brightness-110 lg:px-7 lg:py-3 cursor-pointer"
              >
                Partner With Us
              </button>
            </div>

            {/* Mobile Hamburger menu morph button */}
            <div className="md:hidden flex items-center relative z-[1030]">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative flex h-10 w-10 flex-col justify-center items-center gap-1.5 focus:outline-none rounded-md p-2 text-white hover:bg-white/10 cursor-pointer"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                <div className="relative w-6 h-5">
                  <span className={`absolute left-0 right-0 h-0.5 bg-[#F5F5F0] transition-all duration-300 ${
                    isMobileMenuOpen ? 'top-[9px] rotate-45' : 'top-0'
                  }`} />
                  <span className={`absolute left-0 right-0 h-0.5 bg-[#F5F5F0] transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : 'top-2'
                  }`} />
                  <span className={`absolute left-0 right-0 h-0.5 bg-[#F5F5F0] transition-all duration-300 ${
                    isMobileMenuOpen ? 'top-[9px] -rotate-45' : 'top-4'
                  }`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className={`fixed inset-0 z-[1040] bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
            isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Mobile Menu Slide-out Drawer */}
        <div
          ref={mobileOverlayRef}
          className={`fixed right-0 top-0 bottom-0 z-[1050] w-[85vw] max-w-[380px] bg-[#0c0c0e] border-l border-zinc-800/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-between p-6 md:hidden transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header inside drawer */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/50">
            <span className="text-sm font-black tracking-tight text-[#ff7e26]">
              VALLEY <span className="text-white font-extrabold">COMPUTERS</span>
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 -mr-2 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800/50 cursor-pointer"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable menu content */}
          <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 scrollbar-none">
            {/* Quick Links */}
            <div className="flex flex-col gap-2">
              {pathname !== '/' && (
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-zinc-900/30 border border-zinc-800/30 text-sm font-semibold text-zinc-100 hover:bg-zinc-800/50 hover:text-[#ff7e26] transition-colors"
                >
                  <span>Home</span>
                  <span className="text-zinc-600">&rarr;</span>
                </Link>
              )}
              <Link
                href="/isp"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-zinc-900/30 border border-zinc-800/30 text-sm font-semibold text-zinc-100 hover:bg-zinc-800/50 hover:text-[#ff7e26] transition-colors"
              >
                <span>ISP Services</span>
                <span className="text-zinc-600">&rarr;</span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-zinc-900/30 border border-zinc-800/30 text-sm font-semibold text-zinc-100 hover:bg-zinc-800/50 hover:text-[#ff7e26] transition-colors"
              >
                <span>Contact Us</span>
                <span className="text-zinc-600">&rarr;</span>
              </Link>
            </div>

            {/* Products Accordion Section */}
            <div className="flex flex-col border border-zinc-800/50 rounded-2xl bg-zinc-900/10 p-3">
              <button
                onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                className="flex items-center justify-between w-full py-1 px-1 text-sm font-bold text-zinc-100 hover:text-[#ff7e26] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#ff7e26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Products
                </span>
                <ChevronDownIcon
                  className={`h-5 w-5 transition-transform duration-300 text-zinc-400 ${
                    isMobileProductsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className="transition-all duration-300 ease-in-out overflow-hidden"
                style={{
                  maxHeight: isMobileProductsOpen ? '600px' : '0px',
                  opacity: isMobileProductsOpen ? 1 : 0,
                  marginTop: isMobileProductsOpen ? '0.75rem' : '0px',
                }}
              >
                <div className="flex flex-col gap-4 pl-2 border-l border-zinc-800/80">
                  {/* Category 1 */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-1.5">Services</span>
                    <div className="flex flex-wrap gap-1.5">
                      <Link href="/contact?service=Network Installation" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] bg-zinc-900/60 border border-zinc-800 hover:border-[#ff7e26]/30 text-zinc-300 hover:text-[#ff7e26] px-2.5 py-1.5 rounded-lg transition-colors">
                        Network Installation
                      </Link>
                      <Link href="/contact?service=WiFi Setup" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] bg-zinc-900/60 border border-zinc-800 hover:border-[#ff7e26]/30 text-zinc-300 hover:text-[#ff7e26] px-2.5 py-1.5 rounded-lg transition-colors">
                        WiFi Setup
                      </Link>
                      <Link href="/contact?service=Network Troubleshooting" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] bg-zinc-900/60 border border-zinc-800 hover:border-[#ff7e26]/30 text-zinc-300 hover:text-[#ff7e26] px-2.5 py-1.5 rounded-lg transition-colors">
                        Troubleshooting
                      </Link>
                    </div>
                  </div>

                  {/* Category 2 */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-1.5">Products</span>
                    <div className="flex flex-wrap gap-1.5">
                      <Link href="/products?category=cable" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] bg-zinc-900/60 border border-zinc-800 hover:border-[#ff7e26]/30 text-zinc-300 hover:text-[#ff7e26] px-2.5 py-1.5 rounded-lg transition-colors">
                        Ethernet Cables
                      </Link>
                    </div>
                  </div>

                  <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-xs text-[#ff7e26] hover:underline font-bold mt-1 block">
                    View Products &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Portal Actions */}
            <div className="flex flex-col gap-2 border-t border-zinc-800/50 pt-4">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block px-1">Customer Portal</span>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-bold text-zinc-300 bg-zinc-900/80 border border-zinc-800 rounded-xl hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-bold text-white bg-[#ff7e26] rounded-xl hover:brightness-110 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

          {/* Drawer Footer / Contact Info */}
          <div className="pt-4 border-t border-zinc-800/50 flex flex-col gap-3">
            <a
              href={phoneHref}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <PhoneIcon className="h-4 w-4 text-[#ff7e26]" />
              079 938 1260
            </a>
            <div className="text-center text-[10px] text-zinc-500 flex flex-col">
              <span>6 Church Rd, Riebeek-Kasteel</span>
              <span className="mt-0.5">info@valley-computers.co.za</span>
            </div>
          </div>

        </div>
      </nav>
    </header>
  )
}
