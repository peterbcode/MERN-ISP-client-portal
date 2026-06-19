'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  ChevronDownIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
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
      const delay = 90 + index * 80
      return {
        transitionProperty: 'transform, opacity',
        transitionDuration: '400ms',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: `${delay}ms`,
      }
    } else {
      return {
        transitionProperty: 'transform, opacity',
        transitionDuration: '200ms',
        transitionTimingFunction: 'ease-in',
        transitionDelay: '0ms',
      }
    }
  }

  return (
    <header ref={navRef} className="relative z-50 w-full">
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
        className={`transition-all duration-300 ${
          isScrolled
            ? 'fixed left-0 right-0 top-0 border-b border-white/6 metal-bg shadow-[0_8px_28px_rgba(0,0,0,0.55)] backdrop-blur supports-[backdrop-filter]:bg-[#111214]/86'
            : 'absolute inset-x-0 top-10 bg-gradient-to-b from-black/42 to-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between sm:h-20">
            {/* Brand Logo */}
            <div
              className="-ml-1 flex items-center gap-3 px-3 py-1.5 text-left leading-none transition-all duration-300 ease-out cursor-pointer sm:ml-0 sm:gap-4 sm:px-3.5 sm:py-2 z-[100]"
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
                <button
                  onClick={() => router.push('/products')}
                  className="nav-link relative text-sm font-semibold uppercase tracking-[0.08em] transition-all duration-200 inline-flex items-center gap-1 group py-2 text-[#F5F5F0] focus:outline-none cursor-pointer text-left"
                >
                  <span className="relative flex items-center gap-1">
                    Products
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-[#FF4500] transition-all duration-300 ${
                      isDropdownOpen ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </span>
                </button>

                {/* Dropdown Panel */}
                <div
                  className={`absolute left-1/2 w-64 border-t border-[#F5F5F0]/10 bg-[#080807] transition-all duration-200 ease-out ${
                    isDropdownOpen
                      ? 'pointer-events-auto opacity-100'
                      : 'pointer-events-none opacity-0'
                  }`}
                  style={{
                    transform: isDropdownOpen
                      ? 'translateX(-50%) translateY(4px)'
                      : 'translateX(-50%) translateY(-4px)',
                  }}
                >
                  <div className="flex flex-col py-2">
                    <Link
                      href="/products?category=router"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-6 py-4 text-sm font-semibold text-[#F5F5F0] transition-colors duration-200 hover:text-[#FF4500] hover:bg-white/5"
                    >
                      Routers
                    </Link>
                    <Link
                      href="/products?category=radio"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-6 py-4 text-sm font-semibold text-[#F5F5F0] transition-colors duration-200 hover:text-[#FF4500] hover:bg-white/5"
                    >
                      Access Points
                    </Link>
                    <Link
                      href="/products?category=accessory"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-6 py-4 text-sm font-semibold text-[#F5F5F0] transition-colors duration-200 hover:text-[#FF4500] hover:bg-white/5"
                    >
                      Switches
                    </Link>
                    <div className="border-t border-[#F5F5F0]/10 my-1" />
                    <Link
                      href="/products"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-6 py-4 text-sm font-semibold text-[#F5F5F0] transition-colors duration-200 hover:text-[#FF4500] hover:bg-white/5"
                    >
                      Shop All
                    </Link>
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
            <div className="md:hidden z-[100] flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative flex h-10 w-10 flex-col justify-center items-center gap-1.5 focus:outline-none rounded-md p-2 text-white hover:bg-white/10 cursor-pointer"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                <div className="relative w-6 h-5">
                  <span className={`absolute left-0 right-0 h-0.5 bg-[#F5F5F0] transition-all duration-300 ${
                    isMobileMenuOpen ? 'top-[9px] rotate-45' : 'top-1'
                  }`} />
                  <span className={`absolute left-0 right-0 h-0.5 bg-[#F5F5F0] transition-all duration-300 ${
                    isMobileMenuOpen ? 'top-[9px] -rotate-45' : 'top-3.5'
                  }`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Full-Screen Overlay Menu */}
        <div
          ref={mobileOverlayRef}
          className="fixed inset-0 z-[90] bg-[#080807] flex flex-col justify-between px-8 py-24 sm:px-16 md:hidden overflow-y-auto"
          style={{
            transitionProperty: 'opacity, transform, visibility',
            transitionDuration: '400ms',
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            opacity: isMobileMenuOpen ? 1 : 0,
            transform: isMobileMenuOpen ? 'scale(1)' : 'scale(0.98)',
            visibility: isMobileMenuOpen ? 'visible' : 'hidden',
          }}
        >
          {/* Decorative background textures */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Faint dot grid */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(245,245,240,0.05) 1px, transparent 1px)',
                backgroundSize: '22px 22px'
              }}
            />
            {/* Soft orange radial glow */}
            <div
              className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,69,0,0.15), transparent 70%)',
              }}
            />
          </div>

          {/* Links content container */}
          <div className="flex-1 flex flex-col justify-center relative z-10 my-auto">
            <div className="flex flex-col gap-6 max-w-lg">
              
              {/* Products Item */}
              <div className="overflow-hidden">
                <div
                  style={getTransitionStyle(0)}
                  className={`transition-all duration-400 ${
                    isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-[110%] opacity-0'
                  }`}
                >
                  <button
                    onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                    className="flex items-center gap-3 text-left focus:outline-none text-[#F5F5F0] hover:text-[#FF4500] transition-colors w-full cursor-pointer"
                    style={{ fontSize: 'clamp(32px, 9vw, 44px)', fontWeight: 500 }}
                  >
                    Products
                    <ChevronDownIcon
                      className={`h-8 w-8 transition-transform duration-300 text-[#F5F5F0]/60 ${
                        isMobileProductsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Accordion sub-links */}
                  <div
                    className="transition-all duration-300 ease-in-out overflow-hidden"
                    style={{
                      maxHeight: isMobileProductsOpen ? '250px' : '0px',
                      opacity: isMobileProductsOpen ? 1 : 0,
                      marginTop: isMobileProductsOpen ? '1rem' : '0px',
                      marginBottom: isMobileProductsOpen ? '0.5rem' : '0px',
                    }}
                  >
                    <div className="pl-6 flex flex-col gap-4 border-l border-[#F5F5F0]/10 py-1">
                      <Link
                        href="/products?category=router"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-2xl font-medium text-[#F5F5F0]/80 hover:text-[#FF4500] transition-colors"
                      >
                        Routers
                      </Link>
                      <Link
                        href="/products?category=radio"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-2xl font-medium text-[#F5F5F0]/80 hover:text-[#FF4500] transition-colors"
                      >
                        Access Points
                      </Link>
                      <Link
                        href="/products?category=accessory"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-2xl font-medium text-[#F5F5F0]/80 hover:text-[#FF4500] transition-colors"
                      >
                        Switches
                      </Link>
                      <Link
                        href="/products"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-2xl font-medium text-[#F5F5F0]/80 hover:text-[#FF4500] transition-colors"
                      >
                        Shop All
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* ISP Item */}
              <div className="overflow-hidden">
                <div
                  style={getTransitionStyle(1)}
                  className={`transition-all duration-400 ${
                    isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-[110%] opacity-0'
                  }`}
                >
                  <Link
                    href="/isp"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block font-medium text-[#F5F5F0] hover:text-[#FF4500] transition-colors"
                    style={{ fontSize: 'clamp(32px, 9vw, 44px)' }}
                  >
                    ISP
                  </Link>
                </div>
              </div>

              {/* Contact Us Item */}
              <div className="overflow-hidden">
                <div
                  style={getTransitionStyle(2)}
                  className={`transition-all duration-400 ${
                    isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-[110%] opacity-0'
                  }`}
                >
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block font-medium text-[#F5F5F0] hover:text-[#FF4500] transition-colors"
                    style={{ fontSize: 'clamp(32px, 9vw, 44px)' }}
                  >
                    Contact us
                  </Link>
                </div>
              </div>

              {/* Partner With Us Item */}
              <div className="overflow-hidden mt-6">
                <div
                  style={getTransitionStyle(3)}
                  className={`transition-all duration-400 ${
                    isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-[110%] opacity-0'
                  }`}
                >
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block font-medium text-[#FF4500] hover:brightness-110 transition-colors"
                    style={{ fontSize: '18px' }}
                  >
                    Partner with us
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* Mobile Menu Footer */}
          <div className="relative z-10 pt-6 border-t border-[#F5F5F0]/10">
            <div
              style={getTransitionStyle(4)}
              className={`flex flex-col gap-1 transition-all duration-400 ${
                isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-[110%] opacity-0'
              }`}
            >
              <a
                href={phoneHref}
                className="text-[13px] text-[#F5F5F0]/50 hover:text-[#FF4500] transition-colors"
              >
                079 938 1260
              </a>
              <span className="text-[13px] text-[#F5F5F0]/50">
                Riebeek Kasteel, WC
              </span>
            </div>
          </div>

        </div>
      </nav>
    </header>
  )
}
