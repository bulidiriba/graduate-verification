import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MoE | University Graduate Verification System',
  description: 'University Graduate Verification System',
  icons: {
    icon: '/moe-logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <div className="min-h-screen flex">
          {children}
        </div>
      </body>
    </html>
  )
}

