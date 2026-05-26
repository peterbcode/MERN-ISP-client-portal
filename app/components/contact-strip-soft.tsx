'use client'

import { useState } from 'react'
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { SoftCard } from '@/components/ui/soft-card'
import { SoftButton } from '@/components/ui/soft-button'
import { SoftInput } from '@/components/ui/soft-input'

const ContactStripSoft = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section className="section-soft bg-gradient-soft">
      <div className="container-soft">
        <div className="grid-soft-2 gap-16">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex">
                <div className="soft-card-inset px-4 py-2">
                  <span className="text-xs font-medium text-accent-primary">GET IN TOUCH</span>
                </div>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-text-primary">
                Ready to Get Started?
              </h2>
              
              <p className="text-lg text-text-secondary leading-relaxed">
                Contact us today for a free consultation and let us help you find the perfect 
                internet and IT solutions for your needs.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <a href="mailto:info@valley-computers.co.za" className="flex items-start space-x-4 transition-transform duration-200 hover:scale-105 cursor-pointer">
                <div className="soft-card p-3">
                  <EnvelopeIcon className="h-5 w-5 text-accent-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Email</h3>
                  <p className="text-text-secondary">info@valley-computers.co.za</p>
                </div>
              </a>

              <a href="tel:+27799381260" className="flex items-start space-x-4 transition-transform duration-200 hover:scale-105 cursor-pointer">
                <div className="soft-card p-3">
                  <PhoneIcon className="h-5 w-5 text-accent-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Call Us</h3>
                  <p className="text-text-secondary">079 938 1260</p>
                </div>
              </a>

              <a href="https://www.google.com/maps/search/?api=1&query=Riebeek%20Kasteel%2C%20Western%20Cape" target="_blank" rel="noopener noreferrer" className="flex items-start space-x-4 transition-transform duration-200 hover:scale-105 cursor-pointer">
                <div className="soft-card p-3">
                  <MapPinIcon className="h-5 w-5 text-accent-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Location</h3>
                  <p className="text-text-secondary">Riebeek Kasteel, Western Cape</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right Content - Contact Form */}
          <div>
            <SoftCard className="p-8">
              <h3 className="text-xl font-semibold text-text-primary mb-6">
                Send us a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid-soft-2 gap-4">
                  <SoftInput
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <SoftInput
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <SoftInput
                  name="phone"
                  type="tel"
                  placeholder="Your Phone (Optional)"
                  value={formData.phone}
                  onChange={handleChange}
                />

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="input-soft resize-none"
                    placeholder="Tell us about your needs..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <SoftButton type="submit" className="w-full">
                  Send Message
                </SoftButton>
              </form>
            </SoftCard>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactStripSoft
