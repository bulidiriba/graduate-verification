import { Header } from '@/components/header'
import ContactForm from '@/components/contactForm'
import { Phone, Mail, MapPin, Home } from 'lucide-react'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import Image from 'next/image'

export default function ContactPage() {
  return (
    <main className="w-full min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/verify" className="flex items-center gap-1 hover:text-gray-900">
              <Home size={16} />
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900">Contact Us</span>
          </div>
          <h1 className="text-3xl font-bold text-[#2F4D8A]">Contact Us</h1>
        </div>
      </div>

      {/* Contact Info Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-[#2F4D8A]" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Phone</h2>
            <p className="text-gray-600 mb-4">Call us we are happy to talk to you.</p>
            <div className="space-y-1">
              <p className="text-gray-800">+251111565529</p>
              <p className="text-gray-800">+251111553133</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-[#2F4D8A]" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Email</h2>
            <p className="text-gray-600 mb-4">You can email us on anything you want</p>
            <div className="space-y-1">
              <p className="text-gray-800">info@moe.gov.et</p>
              <p className="text-gray-800">mofi@gmail.com</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-[#2F4D8A]" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Location</h2>
            <p className="text-gray-600 mb-4">4 kilo Arada Sub-City, Addis Ababa, Ethiopia</p>
            <Link 
              href="https://maps.google.com" 
              target="_blank"
              className="text-[#2F4D8A] hover:underline"
            >
              View on Google Map
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <Image
              src="/contact.avif"
              alt="Contact Illustration"
              width={500}
              height={400}
              className="w-full h-auto"
            />
          </div>
          <ContactForm />
        </div>
      </div>
      <Footer />
    </main>
  )
}

