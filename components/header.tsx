'use client'

import Image from 'next/image'
import { Mail, Phone, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export function Header() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    setIsAuthenticated(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    setIsAuthenticated(false)
    router.push('/')
  }

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

        <div className="items-center -mr-2 flex-0 text-mgray">
            <span className="text-[10px] tracking-wide text-gray-500 flex pl-3 -mb-2">
                FDRE
            </span>
            <span className="inline-flex items-center text-gray-600 justify-center font-bold px-3 -mt-2">
                Ministry of Education
            </span>
            <span className="text-[#263E6E] flex mx-3 -mt-2">
                Graduate Verification System
            </span>
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
        </nav>

        <div className="flex items-center gap-6">
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
          
        </div>
      </div>
    </header>
  )
}

