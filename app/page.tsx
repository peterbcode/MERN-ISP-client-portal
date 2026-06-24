'use client'

import { useEffect } from 'react'
import Navbar from "./components/navbar"
import HeroRedesign from "./components/redesign/HeroRedesign"
import ConnectedValley from "./components/redesign/ConnectedValley"
import InfrastructureShowcase from "./components/redesign/InfrastructureShowcase"
import ServicesJourney from "./components/redesign/ServicesJourney"
import CoverageExperience from "./components/redesign/CoverageExperience"
import SuccessStoriesRedesign from "./components/redesign/SuccessStoriesRedesign"
import TechStack from "./components/redesign/TechStack"
import FinalCTA from "./components/redesign/FinalCTA"
import SiteFooter from "./components/site-footer"
import WhatsAppButton from "./components/whatsapp-button"

const Page = () => {
  useEffect(() => {
    // Scroll to top on page load/reload
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-brand-bg-primary min-h-screen text-brand-text-primary">
      <Navbar />
      
      {/* Scroll-driven digital valley storytelling flow */}
      <HeroRedesign />
      <ConnectedValley />
      <InfrastructureShowcase />
      <ServicesJourney />
      <CoverageExperience />
      <SuccessStoriesRedesign />
      <TechStack />
      <FinalCTA />
      
      <SiteFooter />
      <WhatsAppButton />
    </div>
  )
}

export default Page
