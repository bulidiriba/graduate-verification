import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Home } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
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
            <span className="text-gray-900">About Us</span>
          </div>
          <h1 className="text-3xl font-bold text-[#2F4D8A]">About Us</h1>
        </div>
      </div>



      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <p className="text-gray-600">
            The Federal Democratic Republic of Ethiopia Ministry of Education is dedicated to ensuring quality education 
            and maintaining high academic standards across all educational institutions in Ethiopia.
          </p>
          <p className="text-gray-600">
            Our Graduate Verification System provides a reliable and efficient way for employers and stakeholders 
            to verify the academic credentials of graduates from Ethiopian universities and colleges.
          </p>
          <p className="text-gray-600">
            We are committed to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
            <li>Maintaining accurate and up-to-date graduation records</li>
            <li>Providing quick and reliable verification services</li>
            <li>Ensuring the security and privacy of student information</li>
            <li>Supporting educational institutions in record-keeping</li>
            <li>Facilitating the authentication process for employers</li>
          </ul>
        </div>
      </div>


    <Footer />
    </main>
  )
}

