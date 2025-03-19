"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUploader } from "@/components/admin/FileUploader"
import { ArrowLeft, Upload, Loader2 } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"

// Mock data for a graduate
const mockGraduate = {
  id: "1",
  studentFullName: "John Doe",
  studentNationalId: "1234567890",
  yearOfGraduation: 2023,
  institutionName: "University of Technology",
  qualification: "Bachelor of Science in Computer Science",
}

export default function UploadCertificatePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [graduate, setGraduate] = useState(mockGraduate)
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // In a real app, you would fetch the graduate data based on the ID
  useEffect(() => {
    // Simulate API call
    console.log(`Fetching graduate with ID: ${params.id}`)
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (files.length === 0) {
      alert("Please upload a certificate file")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to graduates list after successful upload
    router.push("/admin/graduates")
  }

  return (
    <main className="w-full min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/graduates">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Upload Certificate</h1>
            <p className="text-muted-foreground">Upload a certificate for {graduate.studentFullName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Certificate Upload</CardTitle>
              <CardDescription>Upload the scanned certificate document for the graduate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Graduate Name</h3>
                  <p className="mt-1 text-base">{graduate.studentFullName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">National ID</h3>
                  <p className="mt-1 text-base">{graduate.studentNationalId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Institution</h3>
                  <p className="mt-1 text-base">{graduate.institutionName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Qualification</h3>
                  <p className="mt-1 text-base">{graduate.qualification}</p>
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium mb-4">Upload Certificate Document</h3>
                <FileUploader
                  files={files}
                  setFiles={setFiles}
                  maxFiles={1}
                  acceptedFileTypes={{
                    "application/pdf": [".pdf"],
                    "image/jpeg": [".jpg", ".jpeg"],
                    "image/png": [".png"],
                  }}
                  maxSizeInMB={10}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push("/admin/graduates")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || files.length === 0}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Certificate
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </main>
  )
}

