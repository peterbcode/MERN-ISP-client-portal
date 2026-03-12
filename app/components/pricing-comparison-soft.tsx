'use client'

import { useState } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { SoftCard } from '@/components/ui/soft-card'
import { SoftButton } from '@/components/ui/soft-button'

const plans = [
  {
    name: 'Starter',
    price: 299,
    speed: '25 Mbps',
    color: 'var(--text-tertiary)'
  },
  {
    name: 'Professional', 
    price: 499,
    speed: '50 Mbps',
    color: 'var(--text-primary)',
    recommended: true
  },
  {
    name: 'Enterprise',
    price: 899,
    speed: '100 Mbps',
    color: 'var(--text-tertiary)'
  }
]

const features = [
  { name: 'Download Speed', starter: '25 Mbps', professional: '50 Mbps', enterprise: '100 Mbps' },
  { name: 'Upload Speed', starter: '5 Mbps', professional: '10 Mbps', enterprise: '20 Mbps' },
  { name: 'Monthly Data', starter: '100 GB', professional: '500 GB', enterprise: 'Unlimited' },
  { name: 'Email Support', starter: true, professional: true, enterprise: true },
  { name: 'Priority Support', starter: false, professional: true, enterprise: true },
  { name: 'Free Installation', starter: false, professional: true, enterprise: true },
  { name: 'Advanced Security', starter: false, professional: false, enterprise: true },
  { name: 'Static IP', starter: false, professional: false, enterprise: true },
  { name: 'SLA Guarantee', starter: false, professional: false, enterprise: true }
]

const PricingComparisonSoft = () => {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  return (
    <section className="section-soft bg-bg-primary">
      <div className="container-soft">
        {/* Section Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto mb-16">
          <div className="inline-flex">
            <div className="soft-card-inset px-4 py-2">
              <span className="text-xs font-medium text-text-tertiary">COMPARE PLANS</span>
            </div>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-text-primary">
            Transparent Pricing Comparison
          </h2>
          
          <p className="text-lg text-text-secondary leading-relaxed">
            Choose your speed with straightforward monthly plans and local support included.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid-soft-3 gap-8 mb-16">
          {plans.map((plan) => (
            <SoftCard
              key={plan.name}
              className={cn(
                "relative p-8 text-center transition-all duration-300",
                plan.recommended ? "ring-2 ring-text-primary ring-offset-2" : "",
                hoveredPlan === plan.name ? "transform -translate-y-2" : ""
              )}
              onMouseEnter={() => setHoveredPlan(plan.name)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="soft-card-inset px-3 py-1">
                    <span className="text-xs font-medium text-text-primary">RECOMMENDED</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-xl font-semibold" style={{ color: plan.color }}>
                  {plan.name}
                </h3>
                
                <div>
                  <span className="text-4xl font-bold text-text-primary">R{plan.price}</span>
                  <span className="text-text-tertiary ml-1">/month</span>
                </div>
                
                <div className="text-sm font-medium text-text-secondary">
                  {plan.speed}
                </div>
              </div>
            </SoftCard>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="soft-card p-8 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left py-4 px-4 text-sm font-medium text-text-tertiary">Features</th>
                {plans.map((plan) => (
                  <th key={plan.name} className="text-center py-4 px-4 text-sm font-medium" style={{ color: plan.color }}>
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-b border-border-light last:border-0">
                  <td className="py-4 px-4 text-sm text-text-primary font-medium">
                    {feature.name}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {typeof feature.starter === 'boolean' ? (
                      feature.starter ? (
                        <CheckIcon className="h-5 w-5 text-success mx-auto" />
                      ) : (
                        <XMarkIcon className="h-5 w-5 text-text-tertiary mx-auto" />
                      )
                    ) : (
                      <span className="text-sm text-text-secondary">{feature.starter}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {typeof feature.professional === 'boolean' ? (
                      feature.professional ? (
                        <CheckIcon className="h-5 w-5 text-success mx-auto" />
                      ) : (
                        <XMarkIcon className="h-5 w-5 text-text-tertiary mx-auto" />
                      )
                    ) : (
                      <span className="text-sm text-text-primary font-medium">{feature.professional}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {typeof feature.enterprise === 'boolean' ? (
                      feature.enterprise ? (
                        <CheckIcon className="h-5 w-5 text-success mx-auto" />
                      ) : (
                        <XMarkIcon className="h-5 w-5 text-text-tertiary mx-auto" />
                      )
                    ) : (
                      <span className="text-sm text-text-secondary">{feature.enterprise}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="soft-card-inset p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-text-primary mb-4">
              Still have questions?
            </h3>
            <p className="text-text-secondary mb-6">
              Our local support team is here to help you choose the perfect plan for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SoftButton className="group">
                Get Started
                <CheckIcon className="ml-2 h-4 w-4" />
              </SoftButton>
              <SoftButton variant="ghost" className="group">
                Contact Support
                <CheckIcon className="ml-2 h-4 w-4" />
              </SoftButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default PricingComparisonSoft
