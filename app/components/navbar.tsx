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
  { name: 'Contact Us', href: '/contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHoveringSection, setIsHoveringSection] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Helper function to check if a navigation item is active
  const isActive = (href: string) => {
    // Services link should never be orange/active - it's an anchor link
    if (href === '/#services' || href === '/#success-stories') {
      return false
    }
    return pathname === href
  }

  // Handle anchor navigation only (for smooth scrolling)
  const handleAnchorNavigation = (href: string, e: React.MouseEvent) => {
    if (!href.startsWith('/#')) return // Only handle anchor links
    
    e.preventDefault()
    const targetId = href.replace('/#', '')
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      // Fallback: navigate to home then scroll
      router.push('/')
      setTimeout(() => {
        const element = document.getElementById(targetId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }

    // Check which section is currently in view
    const checkSectionHover = () => {
      const sections = document.querySelectorAll('section[id]')
      const scrollPosition = window.scrollY + 100 // Offset for navbar height
      
      let foundSection = false
      sections.forEach((section) => {
        const element = section as HTMLElement
        const rect = element.getBoundingClientRect()
        const elementTop = rect.top + window.scrollY
        const elementBottom = elementTop + rect.height
        
        // Check if we're within this section
        if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
          setIsHoveringSection(true)
          foundSection = true
        }
      })
      
      // If not in any section, reset to false
      if (!foundSection) {
        setIsHoveringSection(false)
      }
    }

    onScroll()
    checkSectionHover()
    
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scroll', checkSectionHover, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', checkSectionHover)
    }
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
            <a href="mailto:info@valley-computers.co.za" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 whitespace-nowrap text-white/95 transition-all duration-200 hover:text-white hover:scale-105">
              <EnvelopeIcon className="h-3.5 w-3.5 stroke-[2.25]" />
              info@valley-computers.co.za
            </a>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <a href="tel:+27799381260" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 whitespace-nowrap text-white/95 transition-all duration-200 hover:text-white hover:scale-105">
              <PhoneIcon className="h-3.5 w-3.5 stroke-[2.25]" />
              <span className="hidden font-bold sm:inline">Call Us:</span> 079 938 1260
            </a>
            <span className="hidden h-3 w-px bg-white/30 sm:block" aria-hidden="true" />
            <a href="https://wa.me/27799381260" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 whitespace-nowrap text-white/95 transition-all duration-200 hover:text-white hover:scale-105">
              <ChatBubbleOvalLeftEllipsisIcon className="h-3.5 w-3.5 stroke-[2.25]" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <Disclosure
        as="nav"
        className={`transition-all duration-300 ${
          isScrolled
            ? isHoveringSection
              ? 'fixed left-0 right-0 top-0 border-b border-gray-800 bg-black/95 shadow-[0_8px_28px_rgba(0,0,0,0.8)] backdrop-blur supports-[backdrop-filter]:bg-black/85'
              : 'fixed left-0 right-0 top-0 border-b border-orange-600/30 bg-[#f97316]/95 shadow-[0_8px_28px_rgba(249,115,22,0.45)] backdrop-blur supports-[backdrop-filter]:bg-[#f97316]/85'
            : 'absolute inset-x-0 top-10 bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between sm:h-20">
            <div
              className="-ml-1 flex items-center gap-3 px-3 py-1.5 text-left leading-none transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:bg-orange-500/10 hover:shadow-[0_10px_24px_rgba(249,115,22,0.3)] hover:px-4 cursor-pointer sm:ml-0 sm:gap-4 sm:px-3.5 sm:py-2 hover:sm:px-4.5"
              onClick={() => router.push('/')}
            >
              <span className="flex items-center transition-all duration-300 ease-out hover:scale-110">
                <span className={`text-[1.1rem] font-black tracking-tight sm:text-[1.2rem] lg:text-[1.3rem] transition-all duration-300 ease-out hover:tracking-widest ${
                  isScrolled && isHoveringSection
                    ? 'text-[#f97316]'
                    : isScrolled
                      ? 'text-white'
                      : 'text-[#f97316]'
                }`}>
                  VALLEY
                </span>
                <span className={`ml-1.5 text-[0.95rem] font-extrabold tracking-tight sm:text-[1.05rem] lg:text-[1.15rem] transition-all duration-300 ease-out hover:tracking-wider ${
                  isScrolled && isHoveringSection
                    ? 'text-white'
                    : isScrolled
                      ? 'text-white'
                      : 'text-zinc-100'
                } hover:text-white`}>
                  COMPUTERS
                </span>
              </span>
            </div>

            <div className="hidden items-center gap-8 lg:gap-10 md:flex">
              {navigation.map((item) => (
                item.href.startsWith('/#') ? (
                  // Services anchor link - use custom handler
                  <button
                    key={item.name}
                    onClick={(e) => handleAnchorNavigation(item.href, e)}
                    className={`relative text-[15px] font-semibold transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 inline-block group bg-transparent border-none cursor-pointer ${
                      isScrolled && isHoveringSection
                        ? 'text-white hover:text-gray-300'
                        : isScrolled
                          ? 'text-white hover:text-gray-200'
                          : isActive(item.href)
                            ? 'text-white'
                            : 'text-white/90 hover:text-white'
                    }`}
                  >
                    <span className="relative">
                      {item.name}
                      <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                        isScrolled && isHoveringSection
                          ? 'bg-[#f97316]'
                          : isScrolled
                            ? 'bg-white'
                            : 'bg-white'
                      }`}></span>
                    </span>
                  </button>
                ) : (
                  // Regular page links - use Next.js Link for fast navigation
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative text-[15px] font-semibold transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 inline-block group ${
                      isScrolled && isHoveringSection
                        ? 'text-white hover:text-gray-300'
                        : isScrolled
                          ? 'text-white hover:text-gray-200'
                          : isActive(item.href)
                            ? 'text-white'
                            : 'text-white/90 hover:text-white'
                    }`}
                  >
                    <span className="relative">
                      {item.name}
                      <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                        isScrolled && isHoveringSection
                          ? 'bg-[#f97316]'
                          : isScrolled
                            ? 'bg-white'
                            : 'bg-white'
                      }`}></span>
                    </span>
                  </Link>
                )
              ))}
              <Menu as="div" className="relative">
                <MenuButton className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition ${
                  isScrolled && isHoveringSection
                    ? 'border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/20 hover:text-white'
                    : isScrolled
                      ? 'border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/20 hover:text-white'
                      : 'border-white/20 bg-white/5 text-white/95 hover:border-[#f97316]/60 hover:bg-white/10 hover:text-[#f97316]'
                }`}>
                  <ChevronDownIcon className="h-5 w-5" />
                </MenuButton>
                <MenuItems className="absolute right-0 z-50 mt-2 w-44 rounded-xl border border-white/20 bg-zinc-950 p-2 shadow-[0_14px_30px_rgba(0,0,0,0.5)]">
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        href="/faq"
                        className={`block rounded-md px-3 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 hover:bg-white/12 hover:text-[#f97316] ${
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
                        className={`block rounded-md px-3 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 hover:bg-white/12 hover:text-[#f97316] ${
                          focus ? 'bg-white/12 text-[#f97316]' : 'text-white/95'
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
                        className={`block rounded-md px-3 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 hover:bg-white/12 hover:text-[#f97316] ${
                          focus ? 'bg-white/12 text-[#f97316]' : 'text-white/95'
                        }`}
                      >
                        Sign Up
                      </Link>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>

            <div className="hidden md:block">
              <button
                type="button"
                onClick={() => router.push('/signup')}
                className="rounded-full bg-[#f97316] px-6 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(243,111,0,0.3)] ring-1 ring-[#f8a258]/40 transition-all hover:-translate-y-0.5 hover:brightness-110 lg:px-7 lg:py-3"
              >
                Partner With Us
              </button>
            </div>

            <div className="md:hidden">
              <DisclosureButton className={`group inline-flex items-center justify-center rounded-md p-2 transition ${
                isScrolled && isHoveringSection
                  ? 'text-white hover:bg-white/10' 
                  : isScrolled
                    ? 'text-white hover:bg-white/10' 
                    : 'text-white hover:bg-white/10'
              }`}>
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="block h-6 w-6 group-data-open:hidden" aria-hidden="true" />
                <XMarkIcon className="hidden h-6 w-6 group-data-open:block" aria-hidden="true" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="md:hidden">
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/80" />
            
            {/* Menu Panel */}
            <div className="relative flex w-full max-w-sm flex-1 flex-col bg-black/95 backdrop-blur-sm">
              {/* Close button at top */}
              <div className="flex justify-end p-4">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10">
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </DisclosureButton>
              </div>
              
              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    {navigation.map((item) => (
                      item.href.startsWith('/#') ? (
                        // Services anchor link - use custom handler
                        <button
                          key={item.name}
                          onClick={(e) => handleAnchorNavigation(item.href, e)}
                          className="block w-full rounded-lg px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:scale-105 hover:-translate-y-0.5 hover:text-[#f97316] bg-transparent border-none cursor-pointer text-left"
                        >
                          {item.name}
                        </button>
                      ) : (
                        // Regular page links - use Next.js Link for fast navigation
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block rounded-lg px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:scale-105 hover:-translate-y-0.5 hover:text-[#f97316]"
                        >
                          {item.name}
                        </Link>
                      )
                    ))}
                  </div>
                  
                  <div className="border-t border-white/10 pt-4">
                    <div className="space-y-2">
                      <Link 
                        href="/faq" 
                        className="block rounded-lg px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:scale-105 hover:-translate-y-0.5 hover:text-[#f97316]"
                      >
                        FAQ
                      </Link>
                      <Link 
                        href="/login" 
                        className="block rounded-lg px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:scale-105 hover:-translate-y-0.5 hover:text-[#f97316]"
                      >
                        Login
                      </Link>
                      <Link 
                        href="/signup" 
                        className="block rounded-lg px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:scale-105 hover:-translate-y-0.5 hover:text-[#f97316]"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => router.push('/signup')}
                      className="w-full rounded-full bg-[#f97316] px-6 py-3 text-base font-bold text-white shadow-[0_10px_24px_rgba(243,111,0,0.3)] ring-1 ring-[#f8a258]/40 transition-all hover:-translate-y-0.5 hover:brightness-110"
                    >
                      Partner With Us
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </header>
  )
}
