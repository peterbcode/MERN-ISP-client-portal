'use client'

import { useState } from 'react'
import { CheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { SoftCard } from '@/components/ui/soft-card'
import { SoftButton } from '@/components/ui/soft-button'

const plans = [
  {
    id: 1,
    name: 'Starter',
    price: 299,
    speed: '25 Mbps',
    features: [
      '25 Mbps download speed',
      '5 Mbps upload speed',
      '100 GB monthly data',
      'Email support',
      'Basic router included',
      'Local customer service'
    ],
    recommended: false,
    popular: false
  },
  {
    id: 2,
    name: 'Professional',
    price: 499,
    speed: '50 Mbps',
    features: [
      '50 Mbps download speed',
      '10 Mbps upload speed',
      '500 GB monthly data',
      'Priority email support',
      'Premium router included',
      '24/7 local support',
      'Free installation',
      'Basic cybersecurity'
    ],
    recommended: true,
    popular: true
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 899,
    speed: '100 Mbps',
    features: [
      '100 Mbps download speed',
      '20 Mbps upload speed',
      'Unlimited monthly data',
      'Dedicated account manager',
      'Enterprise-grade router',
      '24/7 priority support',
      'Free installation & setup',
      'Advanced cybersecurity',
      'SLA guarantee',
      'Static IP address'
    ],
    recommended: false,
    popular: false
  }
]

const PricingSoft = () => {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  const getDiscountedPrice = (price: number) => {
    return billingCycle === 'annual' ? Math.floor(price * 0.9) : price
  }

  return (
    <section id="pricing" className="section-soft bg-bg-secondary">
      <div className="container-soft">
        {/* Section Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto mb-16">
          <div className="inline-flex">
            <div className="soft-card-inset px-4 py-2">
              <span className="text-xs font-medium text-text-tertiary">PRICING PLANS</span>
            </div>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-text-primary">
            Transparent Pricing
          </h2>
          
          <p className="text-lg text-text-secondary leading-relaxed">
            Choose your speed with straightforward monthly plans and local support included.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm transition-colors ${
              billingCycle === 'monthly' ? 'text-text-primary' : 'text-text-tertiary'
            }`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              style={{
                backgroundColor: billingCycle === 'annual' ? 'var(--accent-primary)' : 'var(--bg-tertiary)'
              }}
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                style={{
                  transform: billingCycle === 'annual' ? 'translateX(1.25rem)' : 'translateX(0.25rem)'
                }}
              />
            </button>
            <span className={`text-sm transition-colors ${
              billingCycle === 'annual' ? 'text-text-primary' : 'text-text-tertiary'
            }`}>
              Annual <span className="text-accent-primary font-medium"> (10% off)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid-soft-3 gap-8">
          {plans.map((plan) => {
            const discountedPrice = getDiscountedPrice(plan.price)
            const isHovered = hoveredPlan === plan.id
            
            return (
              <SoftCard
                key={plan.id}
                className={cn(
                  "relative p-8 cursor-pointer transition-all duration-300",
                  plan.recommended && "ring-2 ring-text-primary ring-offset-2",
                  isHovered && "transform -translate-y-2"
                )}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {/* Recommended Badge */}
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="soft-card-inset px-3 py-1">
                      <span className="text-xs font-medium text-text-primary">MOST POPULAR</span>
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center space-y-4 pb-6 border-b border-border-light">
                  <h3 className="text-xl font-semibold text-text-primary">{plan.name}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-text-primary">
                        R{discountedPrice}
                      </span>
                      <span className="text-text-tertiary ml-1">/month</span>
                    </div>
                    
                    {billingCycle === 'annual' && (
                      <div className="text-xs text-text-tertiary">
                        Save R{(plan.price - discountedPrice) * 12} annually
                      </div>
                    )}
                    
                    <div className="text-sm font-medium text-text-secondary">
                      {plan.speed}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 py-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-bg-tertiary flex items-center justify-center mt-0.5">
                        <CheckIcon className="h-3 w-3 text-text-primary" />
                      </div>
                      <span className="text-sm text-text-secondary leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="pt-6 border-t border-border-light">
                  <SoftButton 
                    className={cn(
                      "w-full group",
                      plan.recommended 
                        ? "" 
                        : "variant-secondary"
                    )}
                  >
                    {plan.recommended ? 'Get Started Now' : 'Choose Plan'}
                    <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </SoftButton>
                </div>
              </SoftCard>
            )
          })}
        </div>

        {/* Additional Information */}
        <div className="mt-20 space-y-8">
          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'No Hidden Fees', value: '100% Transparent' },
              { label: 'Local Support', value: '24/7 Available' },
              { label: 'Installation', value: 'Free on Pro Plans' },
              { label: 'Satisfaction', value: '30-Day Guarantee' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-semibold text-text-primary mb-1">
                  {item.value}
                </div>
                <div className="text-sm text-text-tertiary">{item.label}</div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="soft-card-inset p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-text-primary mb-6 text-center">
              Frequently Asked Questions
            </h3>
            
            <div className="space-y-4">
              {[
                {
                  q: 'Can I change my plan anytime?',
                  a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.'
                },
                {
                  q: 'What equipment is included?',
                  a: 'All plans include a router. Professional and Enterprise plans include premium routers with advanced features.'
                },
                {
                  q: 'Is there a contract?',
                  a: 'No long-term contracts. All plans are month-to-month, giving you the flexibility to change or cancel anytime.'
                }
              ].map((faq, index) => (
                <div key={index} className="border-b border-border-light pb-4 last:border-0">
                  <div className="font-medium text-text-primary mb-2">{faq.q}</div>
                  <div className="text-sm text-text-secondary">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center">
            <div className="soft-card p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-text-primary mb-4">
                Need a Custom Solution?
              </h3>
              <p className="text-text-secondary mb-6">
                We can create tailored plans for businesses with specific requirements. 
                Contact us for a custom quote.
              </p>
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

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default PricingSoft
