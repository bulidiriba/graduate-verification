'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import Cookies from 'js-cookie'

export default function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      if (data.token) {
        localStorage.setItem('authToken', data.token)
        Cookies.set('authToken', data.token, { expires: 7 }) // Set cookie to expire in 7 days
        router.push('/verify')
      } else {
        throw new Error('No token received')
      }
    } catch (err) {
      setError('Invalid credentials or server error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Content Container */}
      <main className="flex flex-col relative z-10 justify-center w-full min-h-screen">
        <div className="px-6 md:px-20 py-10 relative z-10 flex flex-col justify-evenly backdrop-blur w-full md:max-w-xl bg-gradient-to-r from-white via-white/90 to-white/5">
          {/* Logo */}
          <div className="w-24 h-24 md:w-32 md:h-32 relative mx-auto mb-8">
            <Image
              src="/moe-logo.svg"
              alt="Ministry of Education Logo"
              fill
              className="object-contain"
            />
          </div>

          {/* Login Form */}
          <div className="space-y-6 md:space-y-8">
            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl text-gray-800 font-bold">
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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full"
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
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Log In'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Background Image with Gradient Blur */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/background2.jpg"
          alt="Background"
          fill
          className="object-cover object-center w-full h-full"
          priority
        />
      </div>

      {/* Footer Stripes */}
      <div className="fixed bottom-0 left-0 right-0 z-20 h-2 md:h-3 flex">
        <div className="flex-1 bg-[#F4B223]" /> {/* Yellow */}
        <div className="flex-1 bg-[#DE3024]" /> {/* Red */}
        <div className="flex-1 bg-[#4B9CD3]" /> {/* Light Blue */}
        <div className="flex-1 bg-[#2F4D8A]" /> {/* Dark Blue */}
      </div>
    </div>
  )
}

