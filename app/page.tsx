'use client'

import { useEffect } from 'react'
import Navbar from "./components/navbar"
import Hero from "./components/hero"
import BrandCarousel from "./components/brand-carousel"
import Services from "./components/services"
import Gallery from "./components/gallery"
import SuccessStories from "./components/success-stories"
import LocalFootprint from "./components/local-footprint"
import ContactStrip from "./components/contact-strip"
import EasterEggGames from "./components/easter-egg-games"
import SiteFooter from "./components/site-footer"
import WhatsAppButton from "./components/whatsapp-button"
import DraggableLogoField from '@/components/DraggableLogoField'

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
      <section className="relative bg-[#0a0a0b]">
        <Services />
        <Gallery />
        <SuccessStories />
        <LocalFootprint />
        <ContactStrip />
        <EasterEggGames />
      </section>
      <DraggableLogoField logos={[
        'Afrihost', 'Vox', 'Openserve', 'Fibre Internet',
        'CCTV', 'IT Support', 'Microsoft', 'Ubiquiti',
        'MikroTik', 'Web Hosting', 'VOIP', 'Riebeek Valley'
      ]} />
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}

export default Page
