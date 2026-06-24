'use client'

import { motion } from 'framer-motion'
import { Network, Cable, Radio, ShieldAlert, Cpu } from 'lucide-react'

const techCategories = [
  {
    name: 'Networking',
    description: 'Carrier-grade routing protocols, BGP peering paths, and secure VLAN topologies.',
    icon: Network,
    stats: 'Core Backbone',
    delay: 0.1,
  },
  {
    name: 'Fibre infrastructure',
    description: 'GPON & active optical setups transmitting gigabit packet streams at the speed of light.',
    icon: Cable,
    stats: 'Optical Fiber',
    delay: 0.2,
  },
  {
    name: 'Wireless Relays',
    description: 'Concentric 5GHz arrays & high-capacity 60GHz backhaul links bridging Swartland hills.',
    icon: Radio,
    stats: 'Microwave / RF',
    delay: 0.3,
  },
  {
    name: 'Security Shield',
    description: 'Managed packet inspection firewalls, end-to-end encryption, and licensed ICASA structures.',
    icon: ShieldAlert,
    stats: 'Active Guard',
    delay: 0.4,
  },
  {
    name: 'Hardware Lab',
    description: 'SSD caching drives, UPS backup battery banks, and certified replacements.',
    icon: Cpu,
    stats: 'Lab Diagnostic',
    delay: 0.5,
  }
]

export default function TechStack() {
  return (
    <section 
      className="relative py-24 md:py-36 bg-brand-bg-secondary text-brand-text-primary overflow-hidden border-t border-b border-brand-border"
      id="tech-stack"
    >
      {/* Background grid details */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,107,0,0.02)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-accent mb-4 block">Hardware & Infrastructure</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            TECHNOLOGY STACK
          </h2>
          <div className="h-1 w-20 bg-brand-accent mx-auto mb-6" />
          <p className="text-brand-text-secondary md:text-lg font-light leading-relaxed">
            We use premium, enterprise-grade hardware and standard architectures to guarantee speed and stability across the region.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {techCategories.map((tech, idx) => {
            const TechIcon = tech.icon

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: tech.delay }}
                className="group relative border border-brand-border bg-brand-card rounded-2xl p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-brand-accent/30 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(255,107,0,0.06)]"
              >
                {/* Floating motion effect (CSS keyframe overlay) */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,0,0.015)_0%,transparent_70%)] pointer-events-none" />

                <div className="relative z-10">
                  {/* Floating Icon */}
                  <div className="inline-flex p-3 rounded-xl bg-brand-accent/5 border border-brand-accent/20 text-brand-accent mb-6 group-hover:bg-brand-accent group-hover:text-black transition-all duration-300 transform group-hover:scale-110">
                    <TechIcon className="w-5 h-5 animate-float-slow" style={{ animationDelay: `${idx * 0.2}s` }} />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wide group-hover:text-brand-accent transition-colors duration-300">
                    {tech.name}
                  </h3>
                  
                  <p className="text-xs text-brand-text-secondary leading-relaxed font-light">
                    {tech.description}
                  </p>
                </div>

                {/* Subhead Tag */}
                <div className="relative z-10 border-t border-brand-border/60 pt-4 mt-6 flex justify-between items-center text-[10px] font-mono text-brand-text-secondary">
                  <span>{tech.stats}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent opacity-50 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <style>{`
        /* Floating micro-animations */
        .animate-float-slow {
          animation: floatSlow 4s infinite ease-in-out;
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </section>
  )
}
