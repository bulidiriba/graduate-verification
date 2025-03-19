"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Pencil, FileText } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"

// Mock data for a graduate
const mockGraduate = {
  id: "1",
  studentNationalId: "1234567890",
  studentFullName: "John Doe",
  yearOfGraduation: 2023,
  endDate: "2023-05-15",
  obtainedCertificate: "Bachelor of Science in Computer Science",
  institutionName: "University of Technology",
  institutionCountry: "Ethiopia",
  isAccredited: true,
  cgpa: 3.8,
  qualification: "Bachelor's Degree",
  studyProgram: "Computer Science",
  hasCertificate: true,
  certificateUrl: "/sample-certificate.pdf",
}

export default function GraduateDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [graduate, setGraduate] = useState(mockGraduate)
  const [activeTab, setActiveTab] = useState("details")

  // In a real app, you would fetch the graduate data based on the ID
  useEffect(() => {
    // Simulate API call
    console.log(`Fetching graduate with ID: ${params.id}`)
  }, [params.id])

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
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{graduate.studentFullName}</h1>
            <p className="text-muted-foreground">Graduate ID: {params.id}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/admin/graduates/${params.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            {graduate.hasCertificate ? (
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Certificate
              </Button>
            ) : (
              <Button asChild>
                <Link href={`/admin/graduates/${params.id}/upload`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Certificate
                </Link>
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Graduate Details</TabsTrigger>
            <TabsTrigger value="certificate">Certificate</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Graduate Information</CardTitle>
                <CardDescription>Detailed information about the graduate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
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
                      <h3 className="text-sm font-medium text-gray-500">Country</h3>
                      <p className="mt-1 text-base">{graduate.institutionCountry}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Accredited</h3>
                      <p className="mt-1">
                        {graduate.isAccredited ? (
                          <Badge className="bg-green-500 hover:bg-green-600">Yes</Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Qualification</h3>
                      <p className="mt-1 text-base">{graduate.qualification}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Study Program</h3>
                      <p className="mt-1 text-base">{graduate.studyProgram}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Certificate</h3>
                      <p className="mt-1 text-base">{graduate.obtainedCertificate}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Year of Graduation</h3>
                      <p className="mt-1 text-base">{graduate.yearOfGraduation}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">CGPA</h3>
                      <p className="mt-1 text-base">{graduate.cgpa}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="certificate">
            <Card>
              <CardHeader>
                <CardTitle>Certificate</CardTitle>
                <CardDescription>View and manage the graduate's certificate</CardDescription>
              </CardHeader>
              <CardContent>
                {graduate.hasCertificate ? (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-blue-500" />
                          <div>
                            <p className="font-medium">Certificate Document</p>
                            <p className="text-sm text-gray-500">Uploaded on: January 15, 2023</p>
                          </div>
                        </div>
                        <Button>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="aspect-[1/1.414] border rounded-lg overflow-hidden bg-white">
                      <iframe src={graduate.certificateUrl} className="w-full h-full" title="Certificate Preview" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No Certificate Uploaded</h3>
                    <p className="mt-1 text-sm text-gray-500 max-w-md">
                      There is no certificate uploaded for this graduate yet. Upload a certificate to make it available
                      for verification.
                    </p>
                    <Button className="mt-6" asChild>
                      <Link href={`/admin/graduates/${params.id}/upload`}>
                        <FileText className="mr-2 h-4 w-4" />
                        Upload Certificate
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

