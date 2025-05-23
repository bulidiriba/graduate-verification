"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Trash2, Eye, ArrowLeft, FileSpreadsheet, Loader2, Check, X } from "lucide-react"
import { Header } from "@/components/header"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Add this import for the university selector
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

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
  id?: string // We'll generate this if not provided
  data: GraduateSimpleData | GraduateDetailedData
  moe_signature_key: string
  signature: string
  year: string
}

interface ApiResponse {
  graduates: Graduate[]
  university: string
}

export default function GraduatesPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [graduates, setGraduates] = useState<Graduate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedUniversity, setSelectedUniversity] = useState<string>("Addis Ababa University")
  const [universityName, setUniversityName] = useState<string>("")

  useEffect(() => {
    fetchGraduates()
  }, [selectedUniversity])

  const fetchGraduates = async () => {
    setIsLoading(true)
    try {
      // Send the selected university in the request payload
      const response = await fetch("http://127.0.0.1:5000/university/graduates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          university: selectedUniversity || "ALL",
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch graduates: ${response.status} ${response.statusText}`)
      }

      const responseData: ApiResponse = await response.json()

      // Extract the graduates array and add unique IDs if they don’t exist
      const graduatesWithIds = responseData.graduates.map((graduate, index) => ({
        ...graduate,
        id: graduate.id || `grad-${index}-${Date.now()}`, // Generate a unique ID if none exists
      }))

      setGraduates(graduatesWithIds)
      setUniversityName(responseData.university || "")
    } catch (error) {
      console.error("Error fetching graduates:", error)
      toast({
        title: "Error",
        description: "Failed to load graduates",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/graduates/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete graduate")
      }

      // Remove from state
      setGraduates(graduates.filter((g) => g.id !== id))

      toast({
        title: "Success",
        description: "Graduate deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting graduate:", error)
      toast({
        title: "Error",
        description: "Failed to delete graduate",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  // Helper function to get graduate name based on data structure
  const getGraduateName = (graduate: Graduate): string => {
    const data = graduate.data as any
    return data.studentFullName || data.name || "Unknown"
  }

  // Helper function to get graduate qualification/degree
  const getGraduateQualification = (graduate: Graduate): string => {
    const data = graduate.data as any
    return data.qualification || data.degree || "Unknown"
  }

  // Helper function to get graduate study program
  const getGraduateProgram = (graduate: Graduate): string => {
    const data = graduate.data as any
    return data.studyProgram || ""
  }

  // Helper function to get graduate ID
  const getGraduateId = (graduate: Graduate): string => {
    const data = graduate.data as any
    return data.studentNationalId?.toString() || "N/A"
  }

  // Helper function to get graduate institution
  const getGraduateInstitution = (graduate: Graduate): string => {
    const data = graduate.data as any
    return data.institutionName || universityName || "Unknown"
  }

  // Helper function to get graduate year
  const getGraduateYear = (graduate: Graduate): string => {
    const data = graduate.data as any
    return data.yearOfGraduation?.toString() || graduate.year || "Unknown"
  }

  const filteredGraduates = graduates.filter((graduate) => {
    const name = getGraduateName(graduate).toLowerCase()
    const id = getGraduateId(graduate).toLowerCase()
    const institution = getGraduateInstitution(graduate).toLowerCase()

    return (
      name.includes(searchTerm.toLowerCase()) ||
      id.includes(searchTerm.toLowerCase()) ||
      institution.includes(searchTerm.toLowerCase())
    )
  })

  return (
    <main className="w-full min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Graduates</h1>
              <p className="text-muted-foreground">
                {universityName
                  ? `Viewing graduates from ${universityName}`
                  : "Manage graduate information and certificates"}
              </p>
            </div>
          </div>
          <Button className="bg-[#2F4D8A] hover:bg-[#243c6d] text-white self-start sm:self-center" asChild>
            <Link href="/admin/graduates/import">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Import from Excel
            </Link>
          </Button>
        </div>

        {/* Add the university selector */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search graduates..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Add the university selector */}
          <div className="w-64">
            <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
              <SelectTrigger>
                <SelectValue placeholder="Select university" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Universities</SelectItem>
                <SelectItem value="ASTU">Adama Science and Technology University</SelectItem>
                <SelectItem value="AASTU">Addis Ababa Science and Technology University</SelectItem>
                <SelectItem value="JU">Jimma University</SelectItem>
                <SelectItem value="WU">Wolaita University</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>National ID</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Graduation Year</TableHead>
                <TableHead>Qualification</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead className="w-[300px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredGraduates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No graduates found
                  </TableCell>
                </TableRow>
              ) : (
                filteredGraduates.map((graduate) => (
                  <TableRow key={graduate.id}>
                    <TableCell className="font-medium">{getGraduateName(graduate)}</TableCell>
                    <TableCell>{getGraduateId(graduate)}</TableCell>
                    <TableCell>{getGraduateInstitution(graduate)}</TableCell>
                    <TableCell>{getGraduateYear(graduate)}</TableCell>
                    <TableCell>{getGraduateQualification(graduate)}</TableCell>
                    <TableCell>{getGraduateProgram(graduate)}</TableCell>
                    <TableCell>
                      {graduate.signature ? (
                        <Badge className="bg-green-500">
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-500 border-red-200">
                          <X className="h-3.5 w-3.5 mr-1" />
                          Unverified
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8" asChild>
                          <Link href={`/admin/graduates/${graduate.id}`}>
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View Details
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteId(graduate.id || null)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the graduate record and any associated
              certificate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
