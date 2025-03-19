"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, FileText, Pencil, Trash2, Eye, ArrowLeft, FileSpreadsheet } from "lucide-react"
import { Header } from "@/components/header"
// Mock data for graduates

const mockGraduates = [
  {
    id: "1",
    studentNationalId: "1234567890",
    studentFullName: "Amanuel Teshome",
    yearOfGraduation: 2023,
    institutionName: "Jimma University",
    qualification: "Bachelor of Science in Computer Science",
    hasCertificate: true,
  },
  {
    id: "2",
    studentNationalId: "2345678901",
    studentFullName: "Baaca Tesfa",
    yearOfGraduation: 2022,
    institutionName: "Jimma University",
    qualification: "Master of Business Administration",
    hasCertificate: true,
  },
  {
    id: "3",
    studentNationalId: "3456789012",
    studentFullName: "Ahmed Al-Mansour",
    yearOfGraduation: 2021,
    institutionName: "Jimma University",
    qualification: "Bachelor of Arts in Psychology",
    hasCertificate: false,
  },
  {
    id: "4",
    studentNationalId: "4567890123",
    studentFullName: "Baya Gobena",
    yearOfGraduation: 2023,
    institutionName: "Jimma University",
    qualification: "Bachelor of Science in Computer Science",
    hasCertificate: true,
  },
  {
    id: "5",
    studentNationalId: "5678901234",
    studentFullName: "Yuki Tanaka",
    yearOfGraduation: 2022,
    institutionName: "Jimma University",
    qualification: "Master of Engineering in Robotics",
    hasCertificate: false,
  },
]

export default function GraduatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [graduates] = useState(mockGraduates)

  const filteredGraduates = graduates.filter(
    (graduate) =>
      graduate.studentFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      graduate.studentNationalId.includes(searchTerm) ||
      graduate.institutionName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
              <p className="text-muted-foreground">Manage graduate information and certificates</p>
            </div>
          </div>
          <Button className="bg-[#2F4D8A] hover:bg-[#243c6d] text-white self-start sm:self-center" asChild>
            <Link href="/admin/graduates/import">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Import from Excel
            </Link>
          </Button>
        </div>

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
                <TableHead className="w-[400px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGraduates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No graduates found
                  </TableCell>
                </TableRow>
              ) : (
                filteredGraduates.map((graduate) => (
                  <TableRow key={graduate.id}>
                    <TableCell className="font-medium">{graduate.studentFullName}</TableCell>
                    <TableCell>{graduate.studentNationalId}</TableCell>
                    <TableCell>{graduate.institutionName}</TableCell>
                    <TableCell>{graduate.yearOfGraduation}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={graduate.qualification}>
                      {graduate.qualification}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {graduate.hasCertificate ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Show Certificate
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="h-8" asChild>
                            <Link href={`/admin/graduates/${graduate.id}/upload`}>
                              <FileText className="h-3.5 w-3.5 mr-1" />
                              Upload Certificate
                            </Link>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="h-8" asChild>
                          <Link href={`/admin/graduates/${graduate.id}/edit`}>
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Link>
                        </Button>
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
    </main>
  )
}

