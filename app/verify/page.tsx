"use client"

import { Header } from '@/components/header'
import VerifyStudentForm from '@/components/VerifyStudentForm'
import { Footer } from '@/components/footer'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      router.push('/')
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return <div></div>
  }

  return (
    <main className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="p-6 flex flex-col items-center">
        <div className="w-full max-w-7xl bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Verify Graduation Status</h1>
        <p className="text-gray-700 mb-8 text-center max-w-3xl mx-auto">
            GVS enables you to verify graduates by entering the graduate’s full name, institution name, program, and other relevant information.
        </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <VerifyStudentForm />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

