"use client"

import React from "react"
import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Copy,
  Eye,
  EyeOff,
  Key,
  Plus,
  Save,
  Trash,
  User,
  GraduationCap,
  BarChart3,
  Users,
  Calendar,
  Search,
  Download,
} from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

// Sample data for a university with graduates
const universityData = {
  id: 1,
  name: "Addis Ababa University",
  location: "Addis Ababa",
  established: 1950,
  totalGraduates: 124563,
  programs: 87,
  activePrograms: 65,
  credentials: {
    username: "aau_admin",
    password: "••••••••",
  },
  signatureKeys: [
    { id: 1, year: 2025, key: "zzvs1by79EAW2eMphXV9q5tT/ZBdHcd4FRcGpcZd03A=", active: true },
    { id: 2, year: 2024, key: "yYvs2by79EAW2eMphXV9q5tT/ZBdHcd4FRcGpcZd04B=", active: true },
    { id: 3, year: 2023, key: "xXvs3by79EAW2eMphXV9q5tT/ZBdHcd4FRcGpcZd05C=", active: false },
  ],
  graduatesByYear: [
    { year: 2020, graduates: 8500, verified: 8200 },
    { year: 2021, graduates: 9200, verified: 8900 },
    { year: 2022, graduates: 10100, verified: 9800 },
    { year: 2023, graduates: 11300, verified: 11000 },
    { year: 2024, graduates: 12400, verified: 12100 },
    { year: 2025, graduates: 8900, verified: 8600 },
  ],
  graduatesByProgram: [
    { program: "Engineering", graduates: 15600, color: "#8884d8" },
    { program: "Medicine", graduates: 12400, color: "#82ca9d" },
    { program: "Business", graduates: 18200, color: "#ffc658" },
    { program: "Computer Science", graduates: 14800, color: "#ff7300" },
    { program: "Law", graduates: 8900, color: "#00ff88" },
    { program: "Others", graduates: 54663, color: "#8dd1e1" },
  ],
  graduates: [
    {
      id: 1,
      name: "Alice Smith",
      nationalId: "1234567890",
      program: "Computer Science",
      qualification: "BSc",
      year: 2024,
      cgpa: 3.8,
      verified: true,
      certificateUploaded: true,
    },
    {
      id: 2,
      name: "John Doe",
      nationalId: "0987654321",
      program: "Engineering",
      qualification: "BSc",
      year: 2024,
      cgpa: 3.6,
      verified: true,
      certificateUploaded: false,
    },
    {
      id: 3,
      name: "Jane Wilson",
      nationalId: "1122334455",
      program: "Medicine",
      qualification: "MD",
      year: 2023,
      cgpa: 3.9,
      verified: false,
      certificateUploaded: true,
    },
    {
      id: 4,
      name: "Bob Johnson",
      nationalId: "5566778899",
      program: "Business",
      qualification: "MBA",
      year: 2023,
      cgpa: 3.7,
      verified: true,
      certificateUploaded: true,
    },
    {
      id: 5,
      name: "Sarah Davis",
      nationalId: "9988776655",
      program: "Law",
      qualification: "LLB",
      year: 2022,
      cgpa: 3.5,
      verified: true,
      certificateUploaded: false,
    },
    // Add more sample graduates...
    {
      id: 6,
      name: "Michael Brown",
      nationalId: "1357924680",
      program: "Computer Science",
      qualification: "MSc",
      year: 2024,
      cgpa: 3.8,
      verified: false,
      certificateUploaded: true,
    },
  ],
}

export default function UniversityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params)
  const [university, setUniversity] = useState(universityData)
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({
    username: university.credentials.username,
    password: "",
  })
  const [isAddingKey, setIsAddingKey] = useState(false)
  const [newKey, setNewKey] = useState({
    year: new Date().getFullYear().toString(),
    key: "",
  })
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)

  // Graduate filtering states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedProgram, setSelectedProgram] = useState<string>("all")

  // Filter graduates based on search and filters
  const filteredGraduates = useMemo(() => {
    return university.graduates.filter((graduate) => {
      const matchesSearch =
        graduate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        graduate.nationalId.includes(searchTerm) ||
        graduate.program.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesYear = selectedYear === "all" || graduate.year.toString() === selectedYear
      const matchesProgram = selectedProgram === "all" || graduate.program === selectedProgram

      return matchesSearch && matchesYear && matchesProgram
    })
  }, [university.graduates, searchTerm, selectedYear, selectedProgram])

  // Get unique years and programs for filters
  const availableYears = [...new Set(university.graduates.map((g) => g.year))].sort((a, b) => b - a)
  const availablePrograms = [...new Set(university.graduates.map((g) => g.program))].sort()

  // Handle credential updates
  const handleCredentialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials({
      ...credentials,
      [name]: value,
    })
  }

  // Save credentials
  const saveCredentials = () => {
    setUniversity({
      ...university,
      credentials: {
        username: credentials.username,
        password: credentials.password || university.credentials.password,
      },
    })

    toast({
      title: "Credentials Updated",
      description: "University credentials have been updated successfully.",
    })
  }

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: `${label} has been copied to clipboard.`,
    })
  }

  // Generate a random signature key
  const generateSignatureKey = () => {
    setIsGeneratingKey(true)

    setTimeout(() => {
      const randomKey = Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")

      setNewKey({
        ...newKey,
        key: btoa(randomKey),
      })

      setIsGeneratingKey(false)
    }, 1000)
  }

  // Add a new signature key
  const addSignatureKey = () => {
    if (!newKey.year || !newKey.key) {
      toast({
        title: "Validation Error",
        description: "Please provide both year and signature key.",
        variant: "destructive",
      })
      return
    }

    const updatedKeys = [
      ...university.signatureKeys,
      {
        id: Math.max(...university.signatureKeys.map((k) => k.id)) + 1,
        year: Number.parseInt(newKey.year),
        key: newKey.key,
        active: true,
      },
    ]

    setUniversity({
      ...university,
      signatureKeys: updatedKeys,
    })

    setNewKey({
      year: new Date().getFullYear().toString(),
      key: "",
    })

    setIsAddingKey(false)

    toast({
      title: "Signature Key Added",
      description: `Signature key for year ${newKey.year} has been added successfully.`,
    })
  }

  // Toggle key active status
  const toggleKeyStatus = (keyId: number) => {
    const updatedKeys = university.signatureKeys.map((key) =>
      key.id === keyId ? { ...key, active: !key.active } : key,
    )

    setUniversity({
      ...university,
      signatureKeys: updatedKeys,
    })

    const key = university.signatureKeys.find((k) => k.id === keyId)

    toast({
      title: key?.active ? "Key Deactivated" : "Key Activated",
      description: `Signature key for year ${key?.year} has been ${key?.active ? "deactivated" : "activated"}.`,
    })
  }

  // Delete a signature key
  const deleteKey = (keyId: number) => {
    const updatedKeys = university.signatureKeys.filter((key) => key.id !== keyId)

    setUniversity({
      ...university,
      signatureKeys: updatedKeys,
    })

    toast({
      title: "Signature Key Deleted",
      description: "The signature key has been deleted successfully.",
    })
  }

  return (
    <main className="w-full min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/moe_dashboard/universities">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{university.name}</h1>
            <p className="text-muted-foreground">Comprehensive university management and graduate analytics</p>
          </div>
        </div>

        {/* University Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Graduates</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{university.totalGraduates.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Since {university.established}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{university.activePrograms}</div>
              <p className="text-xs text-muted-foreground">Out of {university.programs} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Year</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {university.graduatesByYear.find((g) => g.year === 2025)?.graduates.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">Graduates in 2025</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verification Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96.8%</div>
              <p className="text-xs text-muted-foreground">Certificates verified</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="graduates">
              <Users className="h-4 w-4 mr-2" />
              Graduates
            </TabsTrigger>
            <TabsTrigger value="credentials">
              <User className="h-4 w-4 mr-2" />
              Credentials
            </TabsTrigger>
            <TabsTrigger value="signature-keys">
              <Key className="h-4 w-4 mr-2" />
              Signature Keys
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graduates by Year Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Graduates by Year</CardTitle>
                  <CardDescription>Number of graduates and verification status over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      graduates: {
                        label: "Total Graduates",
                        color: "hsl(var(--chart-1))",
                      },
                      verified: {
                        label: "Verified",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={university.graduatesByYear}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="graduates" fill="var(--color-graduates)" name="Total Graduates" />
                        <Bar dataKey="verified" fill="var(--color-verified)" name="Verified" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Graduates by Program Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Graduates by Program</CardTitle>
                  <CardDescription>Distribution of graduates across different programs</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      graduates: {
                        label: "Graduates",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={university.graduatesByProgram}
                          dataKey="graduates"
                          nameKey="program"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ program, graduates }) => `${program}: ${graduates.toLocaleString()}`}
                        >
                          {university.graduatesByProgram.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest graduate verifications and certificate uploads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Certificate verified for Alice Smith</p>
                      <p className="text-xs text-muted-foreground">Computer Science, Class of 2024 • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New graduate record added</p>
                      <p className="text-xs text-muted-foreground">John Doe, Engineering • 5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Certificate uploaded for Jane Wilson</p>
                      <p className="text-xs text-muted-foreground">Medicine, Class of 2023 • 1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="graduates" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Graduate Records</CardTitle>
                    <CardDescription>Manage and view all graduate records for {university.name}</CardDescription>
                  </div>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by name, ID, or program..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Programs</SelectItem>
                      {availablePrograms.map((program) => (
                        <SelectItem key={program} value={program}>
                          {program}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Results Summary */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredGraduates.length} of {university.graduates.length} graduates
                  </p>
                </div>

                {/* Graduates Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>National ID</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Qualification</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>CGPA</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Certificate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGraduates.map((graduate) => (
                        <TableRow key={graduate.id}>
                          <TableCell className="font-medium">{graduate.name}</TableCell>
                          <TableCell className="font-mono text-sm">{graduate.nationalId}</TableCell>
                          <TableCell>{graduate.program}</TableCell>
                          <TableCell>{graduate.qualification}</TableCell>
                          <TableCell>{graduate.year}</TableCell>
                          <TableCell>{graduate.cgpa}</TableCell>
                          <TableCell>
                            <Badge variant={graduate.verified ? "default" : "outline"}>
                              {graduate.verified ? "Verified" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={graduate.certificateUploaded ? "default" : "destructive"}>
                              {graduate.certificateUploaded ? "Uploaded" : "Missing"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredGraduates.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                            No graduates found matching your criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credentials">
            <Card>
              <CardHeader>
                <CardTitle>University Credentials</CardTitle>
                <CardDescription>Manage username and password for university access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="flex">
                      <Input
                        id="username"
                        name="username"
                        value={credentials.username}
                        onChange={handleCredentialChange}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="ml-2"
                        onClick={() => copyToClipboard(credentials.username, "Username")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="flex">
                      <div className="relative flex-1">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password to change"
                          value={credentials.password}
                          onChange={handleCredentialChange}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="ml-2"
                        onClick={() => {
                          const passwordToShow = credentials.password || university.credentials.password
                          if (passwordToShow !== "••••••••") {
                            copyToClipboard(passwordToShow, "Password")
                          }
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={saveCredentials}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Credentials
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signature-keys">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>MOE Signature Keys</CardTitle>
                    <CardDescription>Manage signature keys for each academic year</CardDescription>
                  </div>
                  <Dialog open={isAddingKey} onOpenChange={setIsAddingKey}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Signature Key
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Signature Key</DialogTitle>
                        <DialogDescription>
                          Create a new MOE signature key for a specific academic year.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="year">Academic Year</Label>
                          <Select value={newKey.year} onValueChange={(value) => setNewKey({ ...newKey, year: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => {
                                const year = new Date().getFullYear() - i
                                return (
                                  <SelectItem key={year} value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signature-key">Signature Key</Label>
                          <div className="flex">
                            <Input
                              id="signature-key"
                              value={newKey.key}
                              onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                              className="flex-1"
                              placeholder="Enter or generate a signature key"
                            />
                            <Button
                              variant="outline"
                              className="ml-2"
                              onClick={generateSignatureKey}
                              disabled={isGeneratingKey}
                            >
                              {isGeneratingKey ? "Generating..." : "Generate"}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingKey(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addSignatureKey}>Add Key</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead>Signature Key</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {university.signatureKeys.map((key) => (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">{key.year}</TableCell>
                          <TableCell className="font-mono text-xs truncate max-w-[200px]">{key.key}</TableCell>
                          <TableCell>
                            <Badge variant={key.active ? "default" : "outline"}>
                              {key.active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(key.key, "Signature Key")}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant={key.active ? "outline" : "default"}
                                size="sm"
                                onClick={() => toggleKeyStatus(key.id)}
                              >
                                {key.active ? "Deactivate" : "Activate"}
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => deleteKey(key.id)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {university.signatureKeys.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                            No signature keys found. Add a new key to get started.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
