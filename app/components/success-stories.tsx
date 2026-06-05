'use client'

import { useEffect, useState } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid'
import { StarIcon } from '@heroicons/react/24/solid'
import AnimatedSection from './ui/animated-section'
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

  return (
    <section id="testimonials" className="texture-dots relative scroll-mt-28 bg-[linear-gradient(to_bottom,#101215,#0c0e11)] py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection direction="up" className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="text-3xl font-black sm:text-5xl">Success Stories</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-300 sm:text-lg">
            Real results from businesses and homes we have connected across the valley.
          </p>
        </AnimatedSection>

        {/* Testimonials Carousel */}
        <AnimatedSection direction="up" delay={200} className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#15181b]/80 backdrop-blur-sm">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {stories.map((story, storyIndex) => (
                <div
                  key={storyIndex}
                  className="w-full flex-shrink-0 px-8 py-12 sm:px-12 lg:px-16"
                >
                  <div className="mx-auto max-w-4xl border-l-4 border-[#FF4500] bg-white/[0.035] px-6 py-8 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-10">
                    <div className="mb-6 flex justify-center">
                      <div className="relative">
                        <div className="h-20 w-20 rounded-full border-2 border-[#FF4500] bg-gradient-to-br from-[#FF4500] to-[#FF4500] shadow-[0_8px_24px_rgba(20,184,166,0.18)] flex items-center justify-center text-2xl font-bold text-black">
                          {story.author.charAt(0)}
                        </div>
                        <div className="absolute -bottom-2 -right-2 rounded-full bg-[#FF4500] p-1.5">
                          <StarIcon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-5 text-center">
                      <p className="text-sm font-bold text-white">{story.author}</p>
                      <div className="mt-2 flex items-center justify-center gap-1">
                        {[...Array(story.rating)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < story.rating ? 'text-orange-400' : 'text-zinc-600'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                        {story.role} • {story.location}
                      </p>
                    </div>
                    
                    <blockquote className="mb-6 text-xl leading-relaxed text-zinc-100 sm:text-2xl">
                      "{story.quote}"
                    </blockquote>
                    <p className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                      {story.company} • {story.date}
                    </p>
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
                      ? 'w-8 bg-[#FF4500] shadow-[0_2px_8px_rgba(249,115,22,0.28)]' 
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
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition hover:text-[#FF4500]"
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


