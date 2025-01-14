import { Header } from '@/components/header'
import { DocumentUpload } from '@/components/documentUpload'
import VerifyStudentForm from '@/components/VerifyStudentForm'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <main className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="p-6 flex flex-col items-center">
        <div className="w-full max-w-7xl bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl text-gray-600 mb-6">Verify Student Graduation Status</h2>
          <p className="text-gray-700 mb-8">
            This is an interface for employers and any stakeholders who would like to check graduates of our university. Document verification is one of our main values!
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

