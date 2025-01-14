'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from "next/link"

export default function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')
    const remember = formData.get('remember')

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      localStorage.setItem('isAuthenticated', 'true')
      router.push('/verify')
    } catch (err) {
      setError('Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background Image with Gradient Blur */}
            <div className="fixed inset-0 z-0">
              <Image
                src="/background.jpg"
                alt="Background"
                fill
                className="object-cover blur-sm"
                priority
              />
                <div 
                className="absolute inset-0" 
                style={{
                  background: 'linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.95) 10%, rgba(255,255,255,0.8) 15%, rgba(255,255,255,0) 20%)',
                  backdropFilter: 'blur(1px)'
                }}
              />
            </div>

      {/* Content Container */}
      <main className=" flex-1 flex flex-col relative z-10 justify-center max-w-md pl-12">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Logo */}
                 <div className="w-24 h-24 relative mx-auto">
                   <Image
                     src="/moe-logo.svg"
                     alt="Ministry of Education Logo"
                     fill
                     className="object-contain"
                   />
                 </div>

        {/* Login Form */}
        <div className="space-y-8">
          
           {/* Title */}
           <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif text-gray-800 font-semibold">
              Graduate Verification System
            </h1>
            <p className="text-gray-600">Login to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm text-gray-600">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full h-12 px-4 rounded bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm text-gray-600">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full h-12 px-4 rounded bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className="w-4 h-4 rounded border-gray-300 text-[#2F4D8A] focus:ring-[#2F4D8A]"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/forgot-password"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Forgot your password?
              </Link>

              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-2 bg-[#2F4D8A] text-white text-sm rounded hover:bg-[#243c6d] disabled:opacity-50 transition-colors"
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
      </main>

      {/* Footer Stripes */}
      <div className="fixed bottom-0 left-0 right-0 z-20 h-2 flex">
        <div className="flex-1 bg-[#F4B223]" /> {/* Yellow */}
        <div className="flex-1 bg-[#DE3024]" /> {/* Red */}
        <div className="flex-1 bg-[#4B9CD3]" /> {/* Light Blue */}
        <div className="flex-1 bg-[#2F4D8A]" /> {/* Dark Blue */}
      </div>
    </div>
  )
}

