'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  BuildingOffice2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CpuChipIcon,
  MapIcon,
} from '@heroicons/react/24/solid'
import { StarIcon } from '@heroicons/react/24/solid'
import AnimatedSection from './ui/animated-section'
import HoverCard from './ui/hover-card'
import PremiumButton from './ui/premium-button'

const stories = [
  {
    quote:
      "Valley Computers completely transformed our business connectivity. We went from constant downtime and slow speeds to rock-solid 99% uptime. The team was professional, installed everything in one day, and their local support is incredible - they actually answer the phone!",
    author: "Sarah J.",
    role: "Operations Manager",
    location: "Riebeek-Kasteel",
    company: "Riebeek Valley Logistics",
    rating: 5,
    date: "2 months ago"
  },
  {
    quote:
      "As a remote team, reliable internet is everything. Valley Computers delivered beyond expectations - our video calls are crystal clear, file transfers are instant, and the uncapped package means no surprises on our bill. Best decision we made for our business.",
    author: "David M.",
    role: "Business Owner",
    location: "Malmesbury",
    company: "Digital Marketing Agency",
    rating: 5,
    date: "3 months ago"
  },
  {
    quote:
      "Our old network was a mess - dead spots, slow speeds, constant complaints from staff. Valley Computers came in, did a complete network audit, redesigned our WiFi setup, and now we have perfect coverage everywhere. The difference is night and day.",
    author: "John P.",
    role: "IT Coordinator",
    location: "Swartland",
    company: "Manufacturing Company",
    rating: 4,
    date: "1 month ago"
  },
  {
    quote:
      "Working from home used to be frustrating with constant disconnections. Since switching to Valley Computers, I've had zero downtime, and their support team actually knows what they're doing. When I had a minor setup question, they remote-accessed and fixed it in 10 minutes.",
    author: "Alicia K.",
    role: "Office Manager",
    location: "Piketberg",
    company: "Financial Services Firm",
    rating: 5,
    date: "2 weeks ago"
  },
  {
    quote:
      "We moved our entire operation online during COVID and needed bulletproof connectivity. Valley Computers not only provided rock-solid internet but also helped us set up our entire network infrastructure. They're not just an ISP - they're technology partners.",
    author: "Mark T.",
    role: "Retail Owner",
    location: "Wellington",
    company: "Retail Chain",
    rating: 5,
    date: "4 months ago"
  },
];

const SuccessStories = () => {
  const [index, setIndex] = useState(0)
  const [cardsPerView, setCardsPerView] = useState(1)

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerView(3)
      } else if (window.innerWidth >= 640) {
        setCardsPerView(2)
      } else {
        setCardsPerView(1)
      }
    }

    updateCardsPerView()
    window.addEventListener('resize', updateCardsPerView)
    return () => window.removeEventListener('resize', updateCardsPerView)
  }, [])

  const maxIndex = Math.max(0, stories.length - cardsPerView)

  const activeIndex = Math.min(index, maxIndex)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIndex((current) => {
        const clamped = Math.min(current, maxIndex)
        return clamped >= maxIndex ? 0 : clamped + 1
      })
    }, 4500)
    return () => window.clearInterval(intervalId)
  }, [maxIndex])

  const translatePct = useMemo(() => (activeIndex * 100) / cardsPerView, [activeIndex, cardsPerView])

  return (
    <section id="testimonials" className="scroll-mt-28 bg-[#070707] py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection direction="up" className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="text-3xl font-black sm:text-5xl">Success Stories</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-300 sm:text-lg">
            Real results from businesses and homes we have connected across the valley.
          </p>
        </AnimatedSection>

        {/* Testimonials Carousel */}
        <AnimatedSection direction="up" delay={200} className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {stories.map((story, storyIndex) => (
                <div
                  key={storyIndex}
                  className="w-full flex-shrink-0 px-8 py-12 sm:px-12 lg:px-16"
                >
                  <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-6 flex justify-center">
                      <div className="relative">
                        <div className="h-20 w-20 rounded-full border-2 border-[#f97316] bg-gradient-to-br from-[#f97316] to-[#f97316]/80 shadow-[0_8px_24px_rgba(243,111,0,0.25)] flex items-center justify-center text-2xl font-bold text-white">
                          {story.author.charAt(0)}
                        </div>
                        <div className="absolute -bottom-2 -right-2 rounded-full bg-[#f97316] p-1.5">
                          <StarIcon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(story.rating)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < story.rating ? 'text-yellow-400' : 'text-zinc-600'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          Verified via Google
                        </span>
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                        {story.company} • {story.date}
                      </p>
                    </div>
                    
                    <blockquote className="mb-6 text-lg leading-relaxed text-zinc-200 sm:text-xl">
                      "{story.quote}"
                    </blockquote>
                    <div>
                      <p className="text-sm font-bold text-white">{story.author}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                        {story.role} • {story.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <PremiumButton
              variant="secondary"
              size="sm"
              onClick={() => setIndex((current) => {
                const clamped = Math.min(current, maxIndex)
                return clamped <= 0 ? maxIndex : clamped - 1
              })}
              className="rounded-full"
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </PremiumButton>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  type="button"
                  onClick={() => setIndex(dotIndex)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    dotIndex === activeIndex 
                      ? 'w-8 bg-[#f97316] shadow-[0_2px_8px_rgba(243,111,0,0.3)]' 
                      : 'w-2.5 bg-zinc-600 hover:bg-zinc-500'
                  }`}
                  aria-label={`Go to slide ${dotIndex + 1}`}
                />
              ))}
            </div>
            
            <PremiumButton
              variant="secondary"
              size="sm"
              onClick={() => setIndex((current) => {
                const clamped = Math.min(current, maxIndex)
                return clamped >= maxIndex ? 0 : clamped + 1
              })}
              className="rounded-full"
              aria-label="Next testimonial"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </PremiumButton>
          </div>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={300} className="mt-8 text-center">
          <a
            href="https://www.google.com/search?q=Valley+Computers+Riebeek+Kasteel+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition hover:text-[#f97316]"
          >
            See our Google Reviews
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </AnimatedSection>
      </div>
    </section>
  )
}

export default SuccessStories

