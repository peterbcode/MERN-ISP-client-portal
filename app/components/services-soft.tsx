'use client'

import { useState } from 'react'
import { 
  ComputerDesktopIcon, 
  WifiIcon, 
  CogIcon, 
  ShieldCheckIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline'
import { SoftCard } from '@/components/ui/soft-card'
import { SoftButton } from '@/components/ui/soft-button'

const services = [
  {
    id: 1,
    icon: ComputerDesktopIcon,
    title: 'PC Repairs',
    description: 'Professional diagnosis and repair for all computer issues, from hardware failures to software problems.',
    features: ['Hardware Upgrades', 'Virus Removal', 'Data Recovery', 'System Optimization'],
    color: 'text-blue-500'
  },
  {
    id: 2,
    icon: WifiIcon,
    title: 'Internet Solutions',
    description: 'High-speed fibre and wireless internet solutions tailored for your home or business needs.',
    features: ['Fibre Installation', 'Wireless Setup', 'Network Configuration', 'Speed Optimization'],
    color: 'text-green-500'
  },
  {
    id: 3,
    icon: CogIcon,
    title: 'Network Engineering',
    description: 'Enterprise-grade network design, implementation, and maintenance for optimal performance.',
    features: ['Network Design', 'Server Setup', 'Security Configuration', '24/7 Monitoring'],
    color: 'text-purple-500'
  },
  {
    id: 4,
    icon: ShieldCheckIcon,
    title: 'IT Support',
    description: 'Comprehensive IT support and maintenance services to keep your systems running smoothly.',
    features: ['Remote Support', 'On-site Service', 'Preventive Maintenance', 'Emergency Response'],
    color: 'text-orange-500'
  }
]

const ServicesSoft = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null)

  return (
    <section id="services" className="section-soft bg-bg-secondary">
      <div className="container-soft">
        {/* Section Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex">
            <div className="soft-card-inset px-4 py-2">
              <span className="text-xs font-medium text-accent-primary">OUR SERVICES</span>
            </div>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-text-primary">
            Complete IT & Internet
            <span className="text-gradient-soft"> Solutions</span>
          </h2>
          
          <p className="text-lg text-text-secondary leading-relaxed">
            From high-speed internet connectivity to comprehensive IT support, 
            we provide everything you need to keep your technology running smoothly.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid-soft-2 mt-16">
          {services.map((service) => (
            <SoftCard
              key={service.id}
              variant="elevated"
              className={cn(
                "p-8 cursor-pointer transition-all duration-300",
                hoveredService === service.id && "ring-2 ring-accent-primary ring-offset-2"
              )}
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              {/* Icon */}
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center mb-6",
                "bg-gradient-to-br from-accent-primary/10 to-accent-primary/5"
              )}>
                <service.icon className={cn("h-7 w-7", service.color)} />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-text-primary">
                  {service.title}
                </h3>
                
                <p className="text-text-secondary leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-text-tertiary">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent-primary mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="pt-4">
                  <SoftButton variant="ghost" className="group w-full justify-between">
                    Learn More
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </SoftButton>
                </div>
              </div>
            </SoftCard>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="soft-card-inset p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-text-primary mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-text-secondary mb-6">
              We specialize in creating tailored IT solutions for unique business requirements. 
              Let's discuss how we can help your organization thrive.
            </p>
            <SoftButton className="group">
              Schedule Consultation
              <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </SoftButton>
          </div>
        </div>
      </div>
    </section>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default ServicesSoft
