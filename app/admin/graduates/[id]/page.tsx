"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Pencil, FileText, Upload, Loader2, Check, X } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUploader } from "@/components/admin/FileUploader"

// Define interfaces for the graduate data structure
interface GraduateSimpleData {
  degree: string
  name: string
}

interface GraduateDetailedData {
  cgpa: number
  endDate: string | null
  institutionCountry: string
  institutionName: string
  isAccredited: boolean
  obtainedCertificate: string
  qualification: string
  studentFullName: string
  studentNationalId: string | number
  studyProgram: string
  yearOfGraduation: number
}

interface Graduate {
  id?: string
  data: GraduateSimpleData | GraduateDetailedData
  moe_signature_key: string
  signature: string
  year: string
  certificateUrl?: string
}

export default function GraduateDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [graduate, setGraduate] = useState<Graduate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("details")
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<any>({})
  const [isSaving, setIsSaving] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // Fetch graduate data
  useEffect(() => {
    const fetchGraduate = async () => {
      setIsLoading(true)
      try {
        // Fetch from the graduates API using "Addis Ababa University"
        const response = await fetch("http://127.0.0.1:5000/university/graduates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            university: "Addis Ababa University",
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch graduates: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        // Decode the URL parameter
        const decodedId = decodeURIComponent(unwrappedParams.id)

        // Find the graduate by studentNationalId or studentFullName
        const foundGraduate = data.graduates.find((g: any) => {
          const graduateData = g.data as any
          const nationalId = graduateData.studentNationalId?.toString()
          const fullName = graduateData.studentFullName || graduateData.name

          return nationalId === decodedId || fullName === decodedId
        })

        if (foundGraduate) {
          setGraduate(foundGraduate)
          // Initialize edited data with the current data
          setEditedData(foundGraduate.data)
        } else {
          toast({
            title: "Error",
            description: "Graduate not found",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching graduate:", error)
        toast({
          title: "Error",
          description: "Failed to load graduate details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchGraduate()
  }, [unwrappedParams.id, toast])

  // Helper function to get graduate name
  const getGraduateName = (): string => {
    if (!graduate) return "Graduate"
    const data = graduate.data as any
    return data.studentFullName || data.name || "Unknown"
  }

  // Helper function to get graduate identifier
  const getGraduateIdentifier = (): string => {
    if (!graduate) return "Unknown"
    const data = graduate.data as any
    return data.studentNationalId?.toString() || data.studentFullName || data.name || "Unknown"
  }

  // Handle input change for editing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedData({
      ...editedData,
      [name]: value,
    })
  }

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setEditedData({
      ...editedData,
      [name]: checked,
    })
  }

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!graduate) return

    setIsSaving(true)
    try {
      // In a real implementation, you would update the graduate data via API
      // For now, we'll just simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the graduate state with the edited data
      setGraduate({
        ...graduate,
        data: editedData,
      })

      setIsEditing(false)
      toast({
        title: "Success",
        description: "Graduate information updated successfully",
      })
    } catch (error) {
      console.error("Error updating graduate:", error)
      toast({
        title: "Error",
        description: "Failed to update graduate information",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle certificate upload
  const handleUploadCertificate = async () => {
    if (!graduate || files.length === 0) return

    setIsUploading(true)
    try {
      // In a real implementation, you would upload the certificate via API
      // For now, we'll just simulate a successful upload
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update the graduate state with the certificate URL
      setGraduate({
        ...graduate,
        certificateUrl: URL.createObjectURL(files[0]), // This is just for demo purposes
      })

      toast({
        title: "Success",
        description: "Certificate uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading certificate:", error)
      toast({
        title: "Error",
        description: "Failed to upload certificate",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setFiles([])
    }
  }

  if (isLoading) {
    return (
      <main className="w-full min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-12 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </main>
    )
  }

  if (!graduate) {
    return (
      <main className="w-full min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Graduate not found</h1>
            <p className="mt-2 text-gray-600">The graduate you're looking for doesn't exist or has been removed.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/graduates">Back to Graduates</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  const data = graduate.data as any

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
            <h1 className="text-3xl font-bold tracking-tight">{getGraduateName()}</h1>
            <p className="text-muted-foreground">Graduate ID: {getGraduateIdentifier()}</p>
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            {graduate.certificateUrl ? (
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Certificate
              </Button>
            ) : (
              <Button onClick={() => setActiveTab("certificate")}>
                <FileText className="mr-2 h-4 w-4" />
                Upload Certificate
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
                <CardDescription>
                  {isEditing ? "Edit graduate information" : "Detailed information about the graduate"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="studentFullName">Full Name</Label>
                        <Input
                          id="studentFullName"
                          name="studentFullName"
                          value={editedData.studentFullName || editedData.name || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentNationalId">National ID</Label>
                        <Input
                          id="studentNationalId"
                          name="studentNationalId"
                          value={editedData.studentNationalId || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="institutionName">Institution</Label>
                        <Input
                          id="institutionName"
                          name="institutionName"
                          value={editedData.institutionName || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="institutionCountry">Country</Label>
                        <Input
                          id="institutionCountry"
                          name="institutionCountry"
                          value={editedData.institutionCountry || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isAccredited"
                          name="isAccredited"
                          checked={editedData.isAccredited || false}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor="isAccredited">Accredited Institution</Label>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="qualification">Qualification</Label>
                        <Input
                          id="qualification"
                          name="qualification"
                          value={editedData.qualification || editedData.degree || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studyProgram">Study Program</Label>
                        <Input
                          id="studyProgram"
                          name="studyProgram"
                          value={editedData.studyProgram || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="obtainedCertificate">Certificate</Label>
                        <Input
                          id="obtainedCertificate"
                          name="obtainedCertificate"
                          value={editedData.obtainedCertificate || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yearOfGraduation">Year of Graduation</Label>
                        <Input
                          id="yearOfGraduation"
                          name="yearOfGraduation"
                          value={editedData.yearOfGraduation || graduate.year || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cgpa">CGPA</Label>
                        <Input
                          id="cgpa"
                          name="cgpa"
                          type="number"
                          step="0.1"
                          value={editedData.cgpa || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                        <p className="mt-1 text-base">{data.studentFullName || data.name || "N/A"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">National ID</h3>
                        <p className="mt-1 text-base">{data.studentNationalId || "N/A"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Institution</h3>
                        <p className="mt-1 text-base">{data.institutionName || "N/A"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Country</h3>
                        <p className="mt-1 text-base">{data.institutionCountry || "N/A"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Accredited</h3>
                        <p className="mt-1">
                          {data.isAccredited ? (
                            <Badge className="bg-green-500 hover:bg-green-600">
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Yes
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-500 border-red-200">
                              <X className="h-3.5 w-3.5 mr-1" />
                              No
                            </Badge>
                          )}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Verification Status</h3>
                        <p className="mt-1">
                          {graduate.signature ? (
                            <Badge className="bg-green-500 hover:bg-green-600">
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-500 border-red-200">
                              <X className="h-3.5 w-3.5 mr-1" />
                              Not Verified
                            </Badge>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Qualification</h3>
                        <p className="mt-1 text-base">{data.qualification || data.degree || "N/A"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Study Program</h3>
                        <p className="mt-1 text-base">{data.studyProgram || "N/A"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Certificate</h3>
                        <p className="mt-1 text-base">{data.obtainedCertificate || "N/A"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Year of Graduation</h3>
                        <p className="mt-1 text-base">{data.yearOfGraduation || graduate.year || "N/A"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">CGPA</h3>
                        <p className="mt-1 text-base">{data.cgpa || "N/A"}</p>
                      </div>
                      {graduate.moe_signature_key && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">MOE Signature Key</h3>
                          <p className="mt-1 text-xs text-gray-500 font-mono break-all">{graduate.moe_signature_key}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              {isEditing && (
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          <TabsContent value="certificate">
            <Card>
              <CardHeader>
                <CardTitle>Certificate</CardTitle>
                <CardDescription>View and manage the graduate's certificate</CardDescription>
              </CardHeader>
              <CardContent>
                {graduate.certificateUrl ? (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-blue-500" />
                          <div>
                            <p className="font-medium">Certificate Document</p>
                            <p className="text-sm text-gray-500">Uploaded on: {new Date().toLocaleDateString()}</p>
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
                  <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <FileText className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No Certificate Uploaded</h3>
                      <p className="mt-1 text-sm text-gray-500 max-w-md">
                        There is no certificate uploaded for this graduate yet. Upload a certificate to make it
                        available for verification.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-base font-medium">Upload Certificate Document</h3>
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

                      <div className="flex justify-end mt-4">
                        <Button onClick={handleUploadCertificate} disabled={isUploading || files.length === 0}>
                          {isUploading ? (
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
                      </div>
                    </div>
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
