import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service - MERN ISP Client Portal',
  description: 'Terms of Service for MERN ISP Client Portal - Rules and guidelines for using our ISP services.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
            <p className="text-blue-100 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="px-6 py-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using MERN ISP Client Portal, you accept and agree to be bound by the 
                terms and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description of Service</h2>
              <p className="text-gray-600 leading-relaxed">
                MERN ISP Client Portal provides internet service management, account administration, 
                customer support, and related services. These services are provided "as is" and are 
                subject to the terms and conditions outlined in this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Responsibilities</h2>
              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Prohibited Activities</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Illegal file sharing or copyright infringement</li>
                    <li>Spam, phishing, or malicious activities</li>
                    <li>Unauthorized access to networks or systems</li>
                    <li>Distribution of malware or viruses</li>
                    <li>Exceeding bandwidth or usage limitations</li>
                  </ul>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Account Security</h3>
                  <p className="text-gray-600">
                    You are responsible for maintaining the confidentiality of your account credentials 
                    and for all activities that occur under your account.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Availability</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                While we strive to maintain high service availability, we do not guarantee uninterrupted 
                service. Service may be temporarily unavailable for maintenance, updates, or other 
                technical reasons.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-gray-700">
                  <strong>Service Level:</strong> We aim for 99.9% uptime, excluding planned maintenance 
                  and force majeure events.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment and Billing</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Service Fees</h3>
                  <p className="text-gray-600">
                    Service fees are billed monthly or annually as specified in your service plan. 
                    Rates are subject to change with 30 days notice.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Payment Methods</h3>
                  <p className="text-gray-600">
                    We accept major credit cards, debit cards, and other electronic payment methods. 
                    All payments are processed securely through our payment partners.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Late Payments</h3>
                  <p className="text-gray-600">
                    Late payments may incur additional fees and may result in service suspension 
                    after 15 days of non-payment.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Usage and Limits</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Your service plan includes specific data allowances and speed limits:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Data caps may apply based on your service tier</li>
                <li>Speed throttling may occur after reaching data limits</li>
                <li>Additional data can be purchased at current rates</li>
                <li>Fair use policy applies to prevent network abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy and Data Protection</h2>
              <p className="text-gray-600 leading-relaxed">
                Your privacy is important to us. Our collection, use, and protection of your personal 
                information is governed by our Privacy Policy, which is incorporated into these 
                Terms of Service by reference.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                The service and its original content, features, and functionality are owned by 
                MERN ISP and are protected by international copyright, trademark, and other 
                intellectual property laws.
              </p>
              <p className="text-gray-600">
                You may not copy, modify, distribute, or create derivative works based on our 
                service without explicit written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">By You</h3>
                  <p className="text-gray-600">
                    You may terminate your account at any time through your account dashboard or 
                    by contacting customer support. No early termination fees apply.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">By Us</h3>
                  <p className="text-gray-600">
                    We may terminate or suspend your account for violation of these terms, 
                    non-payment, or other legitimate business reasons.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimer of Warranties</h2>
              <p className="text-gray-600 leading-relaxed">
                Our service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, 
                expressed or implied, and hereby disclaim all other warranties including, without 
                limitation, implied warranties of merchantability, fitness for a particular purpose, 
                and non-infringement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                In no event shall MERN ISP, its directors, employees, partners, agents, suppliers, 
                or affiliates be liable for any indirect, incidental, special, consequential, 
                or punitive damages, including loss of profits, data, use, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms of Service and any separate agreements whereby we provide you services 
                shall be governed by and construed in accordance with the laws of the State of 
                California, United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify these terms at any time. If we make material changes, 
                we will notify you by email or by posting a notice on our site prior to the change 
                becoming effective.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                  Questions about the Terms of Service should be sent to us at:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Email:</strong> legal@mern-isp.com
                  </p>
                  <p className="text-gray-700">
                    <strong>Phone:</strong> 1-800-MERN-ISP
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong> 123 Tech Street, Silicon Valley, CA 94000
                  </p>
                </div>
              </div>
            </section>

            <div className="flex justify-center space-x-4 pt-8">
              <Link 
                href="/"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </Link>
              <Link 
                href="/privacy"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
