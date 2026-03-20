import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - MERN ISP Client Portal',
  description: 'Privacy policy for MERN ISP Client Portal - Learn how we protect your data and privacy.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
            <p className="text-blue-100 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="px-6 py-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                Welcome to MERN ISP Client Portal. We are committed to protecting your personal information 
                and your right to privacy. This Privacy Policy explains how we collect, use, and protect 
                your information when you use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Personal Information</h3>
                  <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                    <li>Name and contact information (email, phone)</li>
                    <li>Account credentials (username, encrypted password)</li>
                    <li>Service address and billing information</li>
                    <li>Communication preferences</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Technical Information</h3>
                  <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Service usage data and statistics</li>
                    <li>Network performance metrics</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <p className="text-gray-700">
                    <strong>Service Provision:</strong> To provide and manage your ISP services
                  </p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <p className="text-gray-700">
                    <strong>Communication:</strong> To send service updates and support messages
                  </p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <p className="text-gray-700">
                    <strong>Security:</strong> To protect against fraud and ensure service security
                  </p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <p className="text-gray-700">
                    <strong>Improvement:</strong> To analyze usage patterns and improve our services
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>SSL/TLS encryption for all data transmissions</li>
                <li>Encrypted password storage using bcrypt</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication systems</li>
                <li>Secure database management with MongoDB Atlas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights and Choices</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Access and Correction</h3>
                  <p className="text-gray-600">
                    You can access and update your personal information through your account dashboard 
                    or by contacting our support team.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Data Deletion</h3>
                  <p className="text-gray-600">
                    You have the right to request deletion of your personal information, subject to 
                    legal and contractual obligations.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Communication Preferences</h3>
                  <p className="text-gray-600">
                    You can manage your communication preferences in your account settings.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may share information with trusted third-party service providers:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Payment Processors:</strong> For billing and payment processing</li>
                <li><strong>Analytics Services:</strong> For service improvement and analytics</li>
                <li><strong>Infrastructure Providers:</strong> For cloud hosting and data storage</li>
              </ul>
              <p className="text-gray-600 mt-4">
                All third-party providers are carefully vetted and contractually bound to protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Remember your login preferences</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content and features</li>
                <li>Ensure website security and functionality</li>
              </ul>
              <p className="text-gray-600 mt-4">
                You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
              <p className="text-gray-600 leading-relaxed">
                We retain your information only as long as necessary to provide our services and 
                comply with legal obligations. Retention periods vary based on the type of information 
                and legal requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                Our services are not intended for children under 13. We do not knowingly collect 
                personal information from children under 13. If we become aware of such collection, 
                we will take immediate steps to delete the information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Data Transfers</h2>
              <p className="text-gray-600 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place for such transfers in accordance with 
                applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any 
                significant changes by posting the new policy on our website and updating the 
                "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                  If you have questions about this Privacy Policy or how we handle your information, 
                  please contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Email:</strong> privacy@mern-isp.com
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

            <section className="border-t pt-8">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-gray-700">
                  <strong>Important:</strong> By using our services, you agree to the collection 
                  and use of information in accordance with this Privacy Policy.
                </p>
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
                href="/contact"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
