import Link from 'next/link'
import { Facebook, Send, Youtube, Twitter, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="w-full bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Logo and Description Section */}
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              
            </div>
            <p className="text-sm text-gray-600 mt-4 max-w-md">
              FDRE Ministry of Education is a Governmental Organization Headquartered in Arada sub-city, Addis Ababa, Ethiopia
            </p>
            <div className="flex space-x-4 pt-4">
              <Link href="https://web.facebook.com/fdremoe/?_rdc=1&_rdr#" target="_blank" className="text-[#1877F2] hover:opacity-80 transition-opacity">
                <Facebook size={24} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://t.me/ethio_moe" target="_blank" className="text-[#0088cc] hover:opacity-80 transition-opacity">
                <Send size={24} />
                <span className="sr-only">Telegram</span>
              </Link>
              <Link href="https://www.youtube.com/@fdreministryofeducationeth8699" target="_blank" className="text-[#FF0000] hover:opacity-80 transition-opacity">
                <Youtube size={24} />
                <span className="sr-only">YouTube</span>
              </Link>
              <Link href="https://x.com/fdremoe?mx=2" target="_blank" className="text-[#1DA1F2] hover:opacity-80 transition-opacity">
                <Twitter size={24} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://www.linkedin.com/company/ministry-of-education-ethiopia" target="_blank" className="text-[#0A66C2] hover:opacity-80 transition-opacity">
                <Linkedin size={24} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Contact Section - Moved to right side */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                We value your input and want to hear from you. If you have any questions or feedback about our
                services, please contact us.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Working Hours</h3>
              <p className="text-gray-600">Monday to Friday</p>
              <p className="text-gray-600">8 AM - 5:30 PM</p>
            </div>

            <Button 
              className="w-full sm:w-auto bg-[#2F4D8A] hover:bg-[#243c6d] text-white"
              asChild
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Color Stripes */}
      <div className="h-3 flex">
        <div className="flex-1 bg-[#F4B223]" /> {/* Yellow */}
        <div className="flex-1 bg-[#DE3024]" /> {/* Red */}
        <div className="flex-1 bg-[#4B9CD3]" /> {/* Light Blue */}
        <div className="flex-1 bg-[#2F4D8A]" /> {/* Dark Blue */}
      </div>
    </footer>
  )
}

