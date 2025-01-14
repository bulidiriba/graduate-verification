import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white shadow-sm p-2 md:p-1">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          <Image
            src="/moe-logo.svg"
            alt="MiNT Logo"
            width={80}
            height={80}
            
          />
          <div className="flex flex-col">
            <span className="text-[#4285f4] md:text">
              FDRE 
            </span>
            <h2 className="text-[#4285f4] md:text font-semibold">
              Minstry Of Education 
            </h2>
            <p className="text-[#184693] text-sm md:text-base">
                Graduate Verification System
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <a href="tel:+91.80.43740453" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Phone className="h-4 w-4" />
              <span>+251.80.43740453</span>
            </a>
            <a href="mailto:support@icredify.com" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Mail className="h-4 w-4" />
              <span>support@moe.com</span>
            </a>
          </div>
          
        </div>
      </div>
    </header>
  )
}

