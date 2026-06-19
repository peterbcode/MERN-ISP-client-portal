'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  Bars3Icon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navigation = [
  { name: 'ISP', href: '/isp' },
  { name: 'Contact', href: '/contact' },
  { name: 'Dashboard', href: '/dashboard' },
]

export default function NavbarSoft() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [copied, setCopied] = useState(false)
  const pathname = usePathname()

  const handleEmailClick = () => {
    navigator.clipboard.writeText('info@valley-computers.co.za').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Top Bar - Soft Info */}
      <div className="bg-[#f97316] text-white py-2">
        <div className="container-soft">
          <div className="flex items-center justify-between text-xs">
            <div className="hidden items-center gap-4 md:flex">
              <a
                href="https://www.google.com/maps/search/?api=1&query=6%20Church%20Rd%2C%20Riebeek-Kasteel%2C%207307"
                target="_blank"
                rel="noopener noreferrer"
                className="no-accent-hover flex items-center gap-1.5 opacity-90 transition-all duration-200 hover:opacity-100 hover:scale-105"
              >
                <MapPinIcon className="h-3.5 w-3.5" />
                6 Church Rd, Riebeek-Kasteel, 7307
              </a>
              <span className="h-3 w-px bg-white/30" aria-hidden="true" />
              <div className="relative flex items-center">
                <a 
                  href="mailto:info@valley-computers.co.za?subject=Inquiry&body=Hi%20Valley%20Computers" 
                  onClick={handleEmailClick}
                  aria-label="Send email to info@valley-computers.co.za"
                  title="Send email to info@valley-computers.co.za (copies to clipboard)"
                  className="no-accent-hover flex items-center gap-1.5 opacity-90 transition-all duration-200 hover:opacity-100 hover:scale-105 cursor-pointer"
                >
                  <EnvelopeIcon className="h-3.5 w-3.5" />
                  info@valley-computers.co.za
                </a>
                {copied && (
                  <span className="absolute left-1/2 -bottom-8 z-[70] -translate-x-1/2 rounded bg-zinc-950 px-2 py-1 text-[10px] font-bold text-white shadow-lg ring-1 ring-white/10 whitespace-nowrap">
                    Email copied!
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="tel:+27799381260"
                className="no-accent-hover flex items-center gap-1.5 opacity-90 transition-all duration-200 hover:opacity-100 hover:scale-105"
              >
                <PhoneIcon className="h-3.5 w-3.5" />
                079 938 1260
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation - Soft Design */}
      <header className={cn(
        "nav-soft sticky top-0 z-50 transition-all duration-300",
        isScrolled ? "py-2" : "py-4"
      )}>
        <div className="container-soft">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-accent-primary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <span className="text-xl font-semibold text-text-primary">
                  Valley Computers
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href.startsWith('#') && pathname === '/' && window.location.hash === item.href)
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'nav-item-soft',
                      isActive ? 'active' : ''
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
              
              {/* CTA Button */}
              <Link
                href="/contact"
                className="btn-soft-primary ml-4 cursor-pointer"
              >
                Get Quote
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <Menu>
                <MenuButton className="btn-soft-ghost p-2">
                  <Bars3Icon className="h-5 w-5" />
                </MenuButton>
                <MenuItems className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-bg-card shadow-lg border border-border-light">
                  {navigation.map((item) => (
                    <MenuItem key={item.name}>
                      <Link
                        href={item.href}
                        className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-all duration-200 hover:scale-105"
                      >
                        {item.name}
                      </Link>
                    </MenuItem>
                  ))}
                  <div className="border-t border-border-light px-4 py-2">
                    <Link
                      href="/contact"
                      className="btn-soft-primary w-full text-center transition-all duration-200 hover:scale-105 cursor-pointer"
                    >
                      Get Quote
                    </Link>
                  </div>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
