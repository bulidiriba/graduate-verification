"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  Key,
  Copy,
  Trash2,
  Download,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  ToggleLeft,
  ToggleRight,
  X,
  Loader2,
} from "lucide-react"
import Link from "next/link"

interface SignatureKey {
  id: string
  university: string
  year: number
  key: string
  status: "active" | "inactive"
  createdAt: string
}

export default function SignatureKeysPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [yearFilter, setYearFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([])
  const [bulkYear, setBulkYear] = useState("")
  const [bulkKey, setBulkKey] = useState("")
  const [isAddingBulk, setIsAddingBulk] = useState(false)
  const [universitySearchTerm, setUniversitySearchTerm] = useState("")

  // Mock data for signature keys
  const [signatureKeys, setSignatureKeys] = useState<SignatureKey[]>([
    {
      id: "1",
      university: "Addis Ababa University",
      year: 2024,
      key: "zzvs1by79EAW2eMphXV9q5tT/ZBdHcd4FRcGpcZd03A=",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      university: "Addis Ababa University",
      year: 2023,
      key: "abc123def456ghi789jkl012mno345pqr678stu901vwx=",
      status: "active",
      createdAt: "2023-01-15",
    },
    {
      id: "3",
      university: "Bahir Dar University",
      year: 2024,
      key: "xyz789abc123def456ghi789jkl012mno345pqr678=",
      status: "active",
      createdAt: "2024-02-01",
    },
    {
      id: "4",
      university: "Jimma University",
      year: 2024,
      key: "mno345pqr678stu901vwx234yzab567cdef890ghi=",
      status: "inactive",
      createdAt: "2024-03-10",
    },
    {
      id: "5",
      university: "Hawassa University",
      year: 2023,
      key: "pqr678stu901vwx234yzab567cdef890ghi123jkl=",
      status: "active",
      createdAt: "2023-06-20",
    },
  ])

  const universities = [
    "Addis Ababa University",
    "Bahir Dar University",
    "Jimma University",
    "Hawassa University",
    "Mekelle University",
    "Dire Dawa University",
    "Adama Science and Technology University",
    "Haramaya University",
    "Wollo University",
    "Debre Markos University",
    "Arba Minch University",
    "Dilla University",
  ]

  // Filter universities based on search term
  const filteredUniversities = universities.filter((university) =>
    university.toLowerCase().includes(universitySearchTerm.toLowerCase()),
  )

  // Filter signature keys based on search and filters
  const filteredKeys = signatureKeys.filter((key) => {
    const matchesSearch = key.university.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesYear = yearFilter === "all" || key.year.toString() === yearFilter
    const matchesStatus = statusFilter === "all" || key.status === statusFilter
    return matchesSearch && matchesYear && matchesStatus
  })

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast({
      title: "Copied",
      description: "Signature key copied to clipboard",
    })
  }

  const handleToggleStatus = (id: string) => {
    setSignatureKeys((prev) =>
      prev.map((key) => (key.id === id ? { ...key, status: key.status === "active" ? "inactive" : "active" } : key)),
    )
    toast({
      title: "Status Updated",
      description: "Signature key status has been updated",
    })
  }

  const handleDeleteKey = (id: string) => {
    setSignatureKeys((prev) => prev.filter((key) => key.id !== id))
    toast({
      title: "Deleted",
      description: "Signature key has been deleted",
      variant: "destructive",
    })
  }

  const generateRandomKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    let result = ""
    for (let i = 0; i < 44; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setBulkKey(result)
  }

  const handleSelectAllUniversities = (checked: boolean) => {
    if (checked) {
      setSelectedUniversities(filteredUniversities)
    } else {
      setSelectedUniversities([])
    }
  }

  const handleUniversitySelection = (university: string, checked: boolean) => {
    if (checked) {
      setSelectedUniversities((prev) => [...prev, university])
    } else {
      setSelectedUniversities((prev) => prev.filter((u) => u !== university))
    }
  }

  const isAllSelected =
    filteredUniversities.length > 0 && filteredUniversities.every((uni) => selectedUniversities.includes(uni))
  const isIndeterminate = filteredUniversities.some((uni) => selectedUniversities.includes(uni)) && !isAllSelected

  const handleBulkAdd = () => {
    if (!bulkYear || !bulkKey || selectedUniversities.length === 0) {
      toast({
        title: "Error",
        description: "Please select universities, year, and provide a signature key",
        variant: "destructive",
      })
      return
    }

    setIsAddingBulk(true)

    // Simulate API call
    setTimeout(() => {
      const newKeys = selectedUniversities.map((university, index) => ({
        id: `new_${Date.now()}_${index}`,
        university,
        year: Number.parseInt(bulkYear),
        key: bulkKey,
        status: "active" as const,
        createdAt: new Date().toISOString().split("T")[0],
      }))

      setSignatureKeys((prev) => [...prev, ...newKeys])
      setSelectedUniversities([])
      setBulkYear("")
      setBulkKey("")
      setUniversitySearchTerm("")
      setIsAddingBulk(false)

      toast({
        title: "Success",
        description: `Added signature keys for ${selectedUniversities.length} universities`,
      })
    }, 1000)
  }

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Signature keys are being exported...",
    })
  }

  const stats = {
    totalUniversities: universities.length,
    activeKeys: signatureKeys.filter((k) => k.status === "active").length,
    inactiveKeys: signatureKeys.filter((k) => k.status === "inactive").length,
    totalKeys: signatureKeys.length,
  }

  return (
    <main className="w-full min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/moe_dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Signature Key Management</h1>
              <p className="text-muted-foreground">Manage MOE signature keys for all universities</p>
            </div>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Keys
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Universities</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUniversities}</div>
              <p className="text-xs text-muted-foreground">Registered institutions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
              <ToggleRight className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeKeys}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Keys</CardTitle>
              <ToggleLeft className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.inactiveKeys}</div>
              <p className="text-xs text-muted-foreground">Currently inactive</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalKeys}</div>
              <p className="text-xs text-muted-foreground">All signature keys</p>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Add Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Bulk Add Signature Keys
            </CardTitle>
            <CardDescription>Add signature keys to multiple universities at once</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {/* First Column - University Selection */}
              <div className="space-y-2">
                <Label>Search & Select Universities</Label>

                {/* Search Universities */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search universities..."
                    value={universitySearchTerm}
                    onChange={(e) => setUniversitySearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Select All Checkbox */}
                <div className="flex items-center space-x-2 py-2 border-b">
                  <Checkbox
                    id="select-all"
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAllUniversities}
                    className={isIndeterminate ? "data-[state=checked]:bg-blue-600" : ""}
                  />
                  <Label htmlFor="select-all" className="text-sm font-medium">
                    Select All ({filteredUniversities.length})
                  </Label>
                </div>

                {/* Universities List */}
                <div className="border rounded-md p-3 max-h-56 overflow-y-auto space-y-1">
                  {filteredUniversities.length > 0 ? (
                    filteredUniversities.map((university) => (
                      <div key={university} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={university}
                          checked={selectedUniversities.includes(university)}
                          onCheckedChange={(checked) => handleUniversitySelection(university, checked as boolean)}
                        />
                        <Label htmlFor={university} className="text-sm font-normal cursor-pointer">
                          {university}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground py-2">No universities found</p>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">Available: {filteredUniversities.length} universities</p>
              </div>

              {/* Second Column - Selected Universities */}
              <div className="space-y-2">
                <Label>Selected Universities ({selectedUniversities.length})</Label>

                <div className="border rounded-md p-3 max-h-56 overflow-y-auto bg-blue-50">
                  {selectedUniversities.length > 0 ? (
                    <div className="space-y-1">
                      {selectedUniversities.map((university) => (
                        <div
                          key={university}
                          className="flex items-center justify-between py-1 px-2 bg-white rounded border"
                        >
                          <span className="text-sm font-medium">{university}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUniversitySelection(university, false)}
                            className="h-6 w-6 p-0 hover:bg-red-100"
                          >
                            <X className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Key className="h-8 w-8 text-gray-300 mb-2" />
                      <p className="text-sm text-muted-foreground">No universities selected</p>
                      <p className="text-xs text-muted-foreground">Select universities from the left</p>
                    </div>
                  )}
                </div>

                {selectedUniversities.length > 0 && (
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Total selected: {selectedUniversities.length}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUniversities([])}
                      className="h-6 text-xs"
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </div>

              {/* Third Column - Year and Signature Key */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bulkYear">Graduation Year</Label>
                  <Select value={bulkYear} onValueChange={setBulkYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bulkKey">MOE Signature Key</Label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        id="bulkKey"
                        value={bulkKey}
                        onChange={(e) => setBulkKey(e.target.value)}
                        placeholder="Enter or generate key"
                        className="font-mono text-xs"
                      />
                      <Button type="button" variant="outline" size="sm" onClick={generateRandomKey}>
                        Generate
                      </Button>
                    </div>
                    {bulkKey && (
                      <div className="p-2 bg-gray-50 rounded border">
                        <p className="text-xs text-muted-foreground mb-1">Generated Key Preview:</p>
                        <code className="text-xs break-all">{bulkKey}</code>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleBulkAdd}
                    disabled={isAddingBulk || selectedUniversities.length === 0 || !bulkYear || !bulkKey}
                    className="w-full"
                  >
                    {isAddingBulk ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding Keys...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Keys to {selectedUniversities.length} Universities
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filter Signature Keys
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search University</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search universities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {[2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Results</Label>
                <div className="flex items-center h-10 px-3 py-2 border rounded-md bg-muted">
                  <span className="text-sm text-muted-foreground">
                    {filteredKeys.length} of {signatureKeys.length} keys
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signature Keys Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Signature Keys</CardTitle>
            <CardDescription>Manage signature keys for all universities</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>University</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Signature Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.university}</TableCell>
                    <TableCell>{key.year}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">{key.key.substring(0, 20)}...</code>
                        <Button variant="ghost" size="sm" onClick={() => handleCopyKey(key.key)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.status === "active" ? "default" : "secondary"}>{key.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(key.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(key.id)}>
                          {key.status === "active" ? (
                            <ToggleLeft className="h-4 w-4" />
                          ) : (
                            <ToggleRight className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteKey(key.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
