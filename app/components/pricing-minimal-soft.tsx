'use client'

import { useState } from 'react'
import { CheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { SoftCard } from '@/components/ui/soft-card'
import { SoftButton } from '@/components/ui/soft-button'

interface Plan {
  id: number
  name: string
  price: number
  speed: string
  description: string
  features: string[]
  recommended?: boolean
}

const plans: Plan[] = [
  {
    id: 1,
    name: 'Starter',
    price: 299,
    speed: '25 Mbps',
    description: 'Perfect for small households and basic internet needs',
    features: [
      '25 Mbps download speed',
      '5 Mbps upload speed', 
      '100 GB monthly data',
      'Email support',
      'Basic router included'
    ]
  },
  {
    id: 2,
    name: 'Professional',
    price: 499,
    speed: '50 Mbps',
    description: 'Ideal for remote work and streaming',
    features: [
      '50 Mbps download speed',
      '10 Mbps upload speed',
      '500 GB monthly data',
      'Priority support',
      'Premium router included',
      'Free installation',
      'Basic cybersecurity'
    ],
    recommended: true
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 899,
    speed: '100 Mbps',
    description: 'Maximum performance for businesses and power users',
    features: [
      '100 Mbps download speed',
      '20 Mbps upload speed',
      'Unlimited monthly data',
      '24/7 priority support',
      'Enterprise equipment',
      'Advanced security',
      'SLA guarantee',
      'Static IP address'
    ]
  }
]

const PricingMinimalSoft = () => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)

  return (
    <section id="pricing" className="section-soft bg-bg-secondary">
      <div className="container-soft">
        {/* Minimal Header */}
        <div className="text-center space-y-8 max-w-4xl mx-auto mb-20">
          <h2 className="text-4xl lg:text-6xl font-bold text-text-primary leading-tight">
            Transparent Pricing
          </h2>
          
          <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Choose your speed with straightforward monthly plans and local support included.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid-soft-3 gap-8 mb-20">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id
            
            return (
              <SoftCard
                key={plan.id}
                className={cn(
                  "relative p-10 cursor-pointer transition-all duration-500",
                  plan.recommended && "ring-1 ring-text-primary ring-offset-4",
                  isSelected && "transform scale-105 ring-2 ring-text-primary ring-offset-4"
                )}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {/* Recommended Badge */}
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="soft-card px-4 py-2">
                      <span className="text-xs font-medium text-text-primary tracking-wider">
                        RECOMMENDED
                      </span>
                    </div>
                  </div>
                )}

                {/* Plan Content */}
                <div className="space-y-6">
                  {/* Name */}
                  <div className="text-center">
                    <h3 className="text-2xl font-light text-text-primary tracking-wide">
                      {plan.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="text-center space-y-2">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-thin text-text-primary">
                        R{plan.price}
                      </span>
                      <span className="text-text-tertiary ml-2 text-sm">/month</span>
                    </div>
                    <div className="text-sm text-text-secondary font-light">
                      {plan.speed}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-center text-sm text-text-tertiary leading-relaxed font-light">
                    {plan.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="h-5 w-5 rounded-full border border-text-primary flex items-center justify-center flex-shrink-0">
                          <CheckIcon className="h-3 w-3 text-text-primary" />
                        </div>
                        <span className="text-sm text-text-secondary leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="pt-6">
                    <SoftButton 
                      className={cn(
                        "w-full transition-all duration-300",
                        isSelected ? "" : "variant-secondary"
                      )}
                    >
                      {isSelected ? 'Selected' : 'Choose Plan'}
                      {isSelected && <CheckIcon className="ml-2 h-4 w-4" />}
                    </SoftButton>
                  </div>
                </div>
              </SoftCard>
            )
          })}
        </div>

        {/* Trust Section */}
        <div className="text-center space-y-12">
          {/* Value Proposition */}
          <div className="soft-card-inset p-12 max-w-3xl mx-auto">
            <h3 className="text-2xl font-light text-text-primary mb-6">
              Why Choose Our Plans?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Local Support',
                  description: '24/7 customer service from our Western Cape team'
                },
                {
                  title: 'No Hidden Fees',
                  description: 'Transparent pricing with no surprises or extra charges'
                },
                {
                  title: 'Flexible Plans',
                  description: 'Change or cancel your plan anytime without penalties'
                }
              ].map((item, index) => (
                <div key={index} className="text-center space-y-2">
                  <h4 className="font-medium text-text-primary">{item.title}</h4>
                  <p className="text-sm text-text-tertiary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <h3 className="text-3xl font-light text-text-primary">
              Ready to get started?
            </h3>
            <p className="text-text-secondary">
              Join hundreds of satisfied customers in the Western Cape
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SoftButton className="group">
                Start Now
                <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </SoftButton>
              <SoftButton variant="ghost" className="group">
                Contact Sales
                <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </SoftButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export default PricingMinimalSoft
