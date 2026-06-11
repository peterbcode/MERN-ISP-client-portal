'use client'

import { useEffect, useState, useRef } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid'
import { StarIcon } from '@heroicons/react/24/solid'
import PremiumButton from './ui/premium-button'
import { revealSection } from './animations/sectionReveal'

const stories = [
  {
    quote:
      "We had zero reliable internet on the farm for years. Valley Computers put up a dish and we've had solid connectivity ever since. They came out same day when we had a fault — that's what local support looks like.",
    author: "Kobus V.",
    role: "Farmer",
    location: "Riebeek West",
    company: "Wheat & canola farm",
    rating: 5,
    date: "3 weeks ago"
  },
  {
    quote:
      "Our guests were constantly complaining about WiFi. Valley Computers upgraded our entire network and now we get 5-star reviews for our connectivity. They even helped us set up a guest portal — proper professional service.",
    author: "Maria S.",
    role: "Guesthouse Owner",
    location: "Riebeek-Kasteel",
    company: "Guesthouse",
    rating: 5,
    date: "1 month ago"
  },
  {
    quote:
      "Running a wine farm needs reliable internet for our irrigation systems and office. Valley Computers understood our needs and installed a solution that works perfectly in our remote location. No more driving to town just to send emails.",
    author: "Johan D.",
    role: "Farm Manager",
    location: "Riebeek-Kasteel",
    company: "Wine estate",
    rating: 5,
    date: "2 months ago"
  },
  {
    quote:
      "As a small bakery, we can't afford downtime. Valley Computers set us up with a backup line so we never lose our EFT machine. Their team knows the valley and they actually care about local businesses.",
    author: "Linda B.",
    role: "Business Owner",
    location: "Malmesbury",
    company: "Local bakery",
    rating: 5,
    date: "2 weeks ago"
  },
  {
    quote:
      "I work remotely from Darling and was struggling with mobile data. Valley Computers installed wireless at my house and it's been rock solid. Video calls with my team in Joburg work perfectly now.",
    author: "Pieter N.",
    role: "Remote Worker",
    location: "Darling",
    company: "Home office",
    rating: 5,
    date: "1 month ago"
  },
];

const SuccessStories = () => {
  const [index, setIndex] = useState(0)
  const [cardsPerView, setCardsPerView] = useState(1)

  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const cleanup = revealSection(sectionRef.current)
    return cleanup
  }, [])

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
    <section ref={sectionRef} id="testimonials" className="relative scroll-mt-28 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="reveal-heading relative inline-block text-3xl font-black sm:text-5xl">
            <span className="reveal-divider absolute -top-3 left-1/2 h-[2px] w-8 -translate-x-1/2 bg-[#ff7e26]"></span>
            Success Stories
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-300 sm:text-lg">
            Real results from businesses and homes we have connected across the valley.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="reveal-card relative">
          <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-[#16181c] backdrop-blur-sm">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {stories.map((story, storyIndex) => (
                <div
                  key={storyIndex}
                  className="w-full flex-shrink-0 px-8 py-12 sm:px-12 lg:px-16"
                >
                  <div className="mx-auto max-w-4xl border-l-[3px] border-[#ff7e26] bg-white/[0.035] px-6 py-8 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-10">
                    <div className="mb-6 flex justify-center">
                      <div className="relative">
                        <div className="h-20 w-20 rounded-full border-2 border-[#ff7e26] bg-gradient-to-br from-[#ff7e26] to-[#ff7e26] shadow-[0_8px_24px_rgba(255,126,38,0.18)] flex items-center justify-center text-2xl font-bold text-black">
                          {story.author.charAt(0)}
                        </div>
                        <div className="absolute -bottom-2 -right-2 rounded-full bg-[#ff7e26] p-1.5">
                          <StarIcon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-5 text-center">
                      <p className="text-sm font-bold text-[#e8ecf0]">{story.author}</p>
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
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
                        {story.role} • {story.location}
                      </p>
                    </div>

                    <blockquote className="mb-6 text-xl leading-relaxed text-[#9ca3af] sm:text-2xl">
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
                      ? 'w-8 bg-[#ff7e26] shadow-[0_2px_8px_rgba(255,126,38,0.28)]' 
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
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://www.google.com/search?q=Valley+Computers+Riebeek+Kasteel+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition hover:text-[#ff7e26]"
          >
            See our Google Reviews
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default SuccessStories


