'use client'

import Image from 'next/image'
import { Mail, Phone, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function Header() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    router.push('/')
  }

  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true'

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

        <nav className="flex items-center gap-6">
          <Link 
            href="/verify" 
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            About Us
          </Link>
          <Link 
            href="/contact" 
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Contact Us
          </Link>
          {isAuthenticated ? (
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Link href="/">
              <Button variant="ghost">Login</Button>
            </Link>
          )}
        </nav>

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

