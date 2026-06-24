'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { Quote, TrendingUp, ShieldCheck, Zap, Users } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const stories = [
  {
    category: 'Farmer',
    author: 'Kobus V.',
    location: 'Riebeek West',
    company: 'Wheat & Canola Farm',
    quote: "We had zero reliable internet on the farm for years. Valley Computers put up a dish and we've had solid connectivity ever since. They came out same day when we had a fault — that's what local support looks like.",
    result: 'Connected irrigation & remote silos',
    metric: '99.9% Up',
    metricIcon: ShieldCheck,
    bgGrad: 'from-orange-600/10 to-transparent',
  },
  {
    category: 'Guesthouse',
    author: 'Maria S.',
    location: 'Riebeek-Kasteel',
    company: 'Local Boutique Guesthouse',
    quote: "Our guests were constantly complaining about WiFi. Valley Computers upgraded our entire network and now we get 5-star reviews for our connectivity. They even helped us set up a guest portal — proper professional service.",
    result: '5-Star guest feedback ratings',
    metric: '100% Cover',
    metricIcon: Users,
    bgGrad: 'from-amber-600/10 to-transparent',
  },
  {
    category: 'Remote Worker',
    author: 'Pieter N.',
    location: 'Darling',
    company: 'Home Office / Tech Design',
    quote: "I work remotely from Darling and was struggling with mobile data. Valley Computers installed wireless at my house and it's been rock solid. Video calls with my team in Joburg work perfectly now.",
    result: 'Zero lag Zoom calls & design uploads',
    metric: '100 Mbps',
    metricIcon: Zap,
    bgGrad: 'from-orange-500/10 to-transparent',
  },
  {
    category: 'Local Business',
    author: 'Linda B.',
    location: 'Malmesbury',
    company: 'Malmesbury Bakery',
    quote: "As a small bakery, we can't afford downtime. Valley Computers set us up with a backup line so we never lose our EFT machine. Their team knows the valley and they actually care about local businesses.",
    result: 'Continuous card machine operations',
    metric: '0s Outage',
    metricIcon: TrendingUp,
    bgGrad: 'from-amber-500/10 to-transparent',
  }
]

export default function SuccessStoriesRedesign() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const pinSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Desktop horizontal slide pinning
      if (window.innerWidth >= 1024) {
        const panels = gsap.utils.toArray('.story-panel-card')
        
        gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: pinSectionRef.current,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => `+=${scrollContainerRef.current?.offsetWidth}`,
            invalidateOnRefresh: true,
            id: 'stories-horizontal-scroll',
          }
        })
      }
    }, pinSectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div 
      ref={pinSectionRef}
      className="relative bg-brand-bg-primary text-brand-text-primary overflow-hidden lg:h-screen w-full flex flex-col justify-center border-b border-brand-border"
      id="stories"
    >
      {/* Title block inside pin on desktop */}
      <div className="absolute top-12 left-6 md:left-12 lg:left-24 z-20">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-accent mb-2 block">Client Telemetry</span>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
          SUCCESS STORIES
        </h2>
      </div>

      {/* Horizontal Scroll container on Desktop, Standard vertical flex on Mobile */}
      <div 
        ref={scrollContainerRef}
        className="flex flex-col lg:flex-row w-full h-full lg:w-[400vw] pt-32 pb-16 px-6 md:px-12 lg:px-0"
      >
        {stories.map((story, index) => {
          const MetricIcon = story.metricIcon

          return (
            <div 
              key={index}
              className="story-panel-card w-full lg:w-screen h-auto lg:h-full flex-shrink-0 flex items-center justify-center lg:px-24 mb-16 lg:mb-0"
            >
              <div className={`relative w-full max-w-5xl h-full max-h-[500px] border border-brand-border bg-gradient-to-br ${story.bgGrad} bg-brand-bg-secondary/70 backdrop-blur-md rounded-3xl p-8 md:p-14 flex flex-col md:grid md:grid-cols-12 gap-8 justify-between overflow-hidden shadow-2xl`}>
                
                {/* Decorative background grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                {/* Left side: Case info / Quote */}
                <div className="md:col-span-8 flex flex-col justify-between h-full relative z-10">
                  <div>
                    {/* Category / Name */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="px-3 py-1 bg-brand-accent/10 border border-brand-accent/20 rounded-full text-xs font-bold uppercase tracking-wider text-brand-accent">
                        {story.category}
                      </span>
                      <span className="text-xs text-brand-text-secondary font-semibold font-mono">
                        {story.author} &bull; {story.location}
                      </span>
                    </div>

                    {/* Animated Quote */}
                    <div className="relative">
                      <Quote className="absolute -left-6 -top-4 w-12 h-12 text-brand-accent/15 rotate-180 pointer-events-none" />
                      <blockquote className="text-xl md:text-2xl lg:text-3xl font-light text-white leading-relaxed mb-6 pl-4 select-none">
                        "{story.quote}"
                      </blockquote>
                    </div>
                  </div>

                  {/* Outcome metadata */}
                  <div className="border-t border-brand-border/60 pt-6">
                    <span className="text-[10px] uppercase font-mono text-brand-text-secondary block">Grid Impact Outcome</span>
                    <span className="text-sm font-bold text-white mt-1 block">
                      {story.result}
                    </span>
                  </div>
                </div>

                {/* Right side: Stat block */}
                <div className="md:col-span-4 flex flex-col justify-center items-center text-center p-8 bg-black/40 border border-brand-border/60 rounded-2xl relative z-10 min-h-[180px]">
                  {MetricIcon && (
                    <div className="p-3 bg-brand-accent/10 border border-brand-accent/20 rounded-full text-brand-accent mb-4">
                      <MetricIcon className="w-6 h-6 animate-pulse" />
                    </div>
                  )}
                  <span className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                    {story.metric}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-brand-text-secondary mt-2 font-semibold">
                    {story.company}
                  </span>
                </div>

              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
