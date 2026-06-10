'use client'

import { useEffect } from 'react'
import Navbar from "./components/navbar"
import Hero from "./components/hero"
import BrandCarousel from "./components/brand-carousel"
import CoverageChecker from "./components/coverage-checker"
import Services from "./components/services"
import Gallery from "./components/gallery"
import SuccessStories from "./components/success-stories"
import LocalFootprint from "./components/local-footprint"
import ContactStrip from "./components/contact-strip"
import EasterEggGames from "./components/easter-egg-games"
import SiteFooter from "./components/site-footer"
import WhatsAppButton from "./components/whatsapp-button"

const Page = () => {
  useEffect(() => {
    // Scroll to top on page load/reload
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <BrandCarousel />
      <section className="relative bg-[#0a0a0b] py-16 px-6">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">Check Your Coverage</h2>
          <p className="text-gray-400">Enter your address to see if high-speed internet is available in your area</p>
        </div>
        <CoverageChecker />
      </section>
      <section className="relative bg-[#0a0a0b]">
        <Services />
        <Gallery />
        <SuccessStories />
        <LocalFootprint />
        <ContactStrip />
        <EasterEggGames />
      </section>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}

export default Page
