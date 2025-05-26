"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Search,
  Download,
  UserPlus,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  ToggleLeft,
  ToggleRight,
  Users,
  UserCheck,
  UserX,
  Clock,
  Loader2,
  Plus,
  Settings,
  Shuffle,
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"

interface UniversityCredential {
  id: string
  universityName: string
  username: string
  password: string
  status: "active" | "inactive"
  lastLogin: string
  createdAt: string
}

interface NewUniversity {
  name: string
  username: string
  password: string
}

export default function CredentialsManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCredentials, setSelectedCredentials] = useState<string[]>([])
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isBulkUpdateDialogOpen, setIsBulkUpdateDialogOpen] = useState(false)
  const [bulkOperation, setBulkOperation] = useState<"reset" | "create" | "toggle">("reset")

  // New university form state
  const [newUniversity, setNewUniversity] = useState<NewUniversity>({
    name: "",
    username: "",
    password: "",
  })

  // Bulk add universities state
  const [bulkUniversities, setBulkUniversities] = useState("")
  const [bulkPasswordOption, setBulkPasswordOption] = useState<"generate" | "same" | "custom">("generate")
  const [bulkPassword, setBulkPassword] = useState("")

  // Password generation options
  const [passwordLength, setPasswordLength] = useState(12)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)

  // Mock data - replace with actual API call
  const [credentials, setCredentials] = useState<UniversityCredential[]>([
    {
      id: "1",
      universityName: "Addis Ababa University",
      username: "aau_admin",
      password: "SecurePass123!",
      status: "active",
      lastLogin: "2024-01-15 14:30:00",
      createdAt: "2023-09-01",
    },
    {
      id: "2",
      universityName: "Bahir Dar University",
      username: "bdu_admin",
      password: "BDU2024@Pass",
      status: "active",
      lastLogin: "2024-01-14 09:15:00",
      createdAt: "2023-09-01",
    },
    {
      id: "3",
      universityName: "Jimma University",
      username: "ju_admin",
      password: "JimmaU2024#",
      status: "inactive",
      lastLogin: "2024-01-10 16:45:00",
      createdAt: "2023-09-01",
    },
    {
      id: "4",
      universityName: "Hawassa University",
      username: "hu_admin",
      password: "HawassaPass2024",
      status: "active",
      lastLogin: "2024-01-15 11:20:00",
      createdAt: "2023-09-01",
    },
    {
      id: "5",
      universityName: "Mekelle University",
      username: "mu_admin",
      password: "MekelleU@2024",
      status: "active",
      lastLogin: "2024-01-13 13:10:00",
      createdAt: "2023-09-01",
    },
  ])

  const filteredCredentials = credentials.filter((credential) => {
    const matchesSearch =
      credential.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credential.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || credential.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const activeCount = credentials.filter((c) => c.status === "active").length
  const inactiveCount = credentials.filter((c) => c.status === "inactive").length
  const recentlyUpdated = credentials.filter(
    (c) => new Date(c.lastLogin) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  ).length

  const generatePassword = (customOptions?: {
    length?: number
    uppercase?: boolean
    lowercase?: boolean
    numbers?: boolean
    symbols?: boolean
  }) => {
    const options = {
      length: customOptions?.length || passwordLength,
      uppercase: customOptions?.uppercase ?? includeUppercase,
      lowercase: customOptions?.lowercase ?? includeLowercase,
      numbers: customOptions?.numbers ?? includeNumbers,
      symbols: customOptions?.symbols ?? includeSymbols,
    }

    let chars = ""
    if (options.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (options.lowercase) chars += "abcdefghijklmnopqrstuvwxyz"
    if (options.numbers) chars += "0123456789"
    if (options.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (chars === "") chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    let password = ""
    for (let i = 0; i < options.length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const generateUsername = (universityName: string) => {
    return (
      universityName
        .toLowerCase()
        .replace(/university/g, "")
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "")
        .substring(0, 20) + "_admin"
    )
  }

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: `${type} copied to clipboard`,
    })
  }

  const handleTogglePasswordVisibility = (id: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleResetPassword = (id: string) => {
    const newPassword = generatePassword()
    setCredentials((prev) => prev.map((cred) => (cred.id === id ? { ...cred, password: newPassword } : cred)))
    toast({
      title: "Password Reset",
      description: "Password has been reset successfully",
    })
  }

  const handleToggleStatus = (id: string) => {
    setCredentials((prev) =>
      prev.map((cred) =>
        cred.id === id
          ? {
              ...cred,
              status: cred.status === "active" ? "inactive" : "active",
            }
          : cred,
      ),
    )
    toast({
      title: "Status Updated",
      description: "Account status has been updated",
    })
  }

  const handleAddUniversity = async () => {
    if (!newUniversity.name || !newUniversity.username || !newUniversity.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newCredential: UniversityCredential = {
      id: (credentials.length + 1).toString(),
      universityName: newUniversity.name,
      username: newUniversity.username,
      password: newUniversity.password,
      status: "active",
      lastLogin: "Never",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setCredentials((prev) => [...prev, newCredential])
    setNewUniversity({ name: "", username: "", password: "" })
    setIsLoading(false)
    setIsAddDialogOpen(false)

    toast({
      title: "University Added",
      description: "New university credentials have been created successfully",
    })
  }

  const handleBulkAddUniversities = async () => {
    const universityNames = bulkUniversities
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0)

    if (universityNames.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please enter at least one university name",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newCredentials: UniversityCredential[] = universityNames.map((name, index) => {
      let password = ""
      switch (bulkPasswordOption) {
        case "generate":
          password = generatePassword()
          break
        case "same":
          password = bulkPassword
          break
        case "custom":
          password = generatePassword()
          break
      }

      return {
        id: (credentials.length + index + 1).toString(),
        universityName: name,
        username: generateUsername(name),
        password: password,
        status: "active",
        lastLogin: "Never",
        createdAt: new Date().toISOString().split("T")[0],
      }
    })

    setCredentials((prev) => [...prev, ...newCredentials])
    setBulkUniversities("")
    setBulkPassword("")
    setIsLoading(false)
    setIsBulkUpdateDialogOpen(false)

    toast({
      title: "Universities Added",
      description: `${universityNames.length} universities have been added successfully`,
    })
  }

  const handleBulkOperation = async () => {
    if (selectedCredentials.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select at least one university",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    switch (bulkOperation) {
      case "reset":
        setCredentials((prev) =>
          prev.map((cred) =>
            selectedCredentials.includes(cred.id) ? { ...cred, password: generatePassword() } : cred,
          ),
        )
        toast({
          title: "Bulk Password Reset",
          description: `Passwords reset for ${selectedCredentials.length} universities`,
        })
        break
      case "toggle":
        setCredentials((prev) =>
          prev.map((cred) =>
            selectedCredentials.includes(cred.id)
              ? { ...cred, status: cred.status === "active" ? "inactive" : "active" }
              : cred,
          ),
        )
        toast({
          title: "Bulk Status Update",
          description: `Status updated for ${selectedCredentials.length} universities`,
        })
        break
    }

    setSelectedCredentials([])
    setIsLoading(false)
    setIsBulkDialogOpen(false)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCredentials(filteredCredentials.map((c) => c.id))
    } else {
      setSelectedCredentials([])
    }
  }

  const handleExport = () => {
    // Simulate export functionality
    toast({
      title: "Export Started",
      description: "Credentials are being exported to CSV",
    })
  }

  return (
    <main className="w-full min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/moe_dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">University Credentials Management</h1>
              <p className="text-muted-foreground">Manage login credentials for all universities</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add University
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New University</DialogTitle>
                  <DialogDescription>Create credentials for a new university.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="universityName">University Name</Label>
                    <Input
                      id="universityName"
                      value={newUniversity.name}
                      onChange={(e) => setNewUniversity({ ...newUniversity, name: e.target.value })}
                      placeholder="Enter university name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <div className="flex gap-2">
                      <Input
                        id="username"
                        value={newUniversity.username}
                        onChange={(e) => setNewUniversity({ ...newUniversity, username: e.target.value })}
                        placeholder="Enter username"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setNewUniversity({ ...newUniversity, username: generateUsername(newUniversity.name) })
                        }
                      >
                        <Shuffle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="flex gap-2">
                      <Input
                        id="password"
                        type="password"
                        value={newUniversity.password}
                        onChange={(e) => setNewUniversity({ ...newUniversity, password: e.target.value })}
                        placeholder="Enter password"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setNewUniversity({ ...newUniversity, password: generatePassword() })}
                      >
                        <Shuffle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUniversity} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add University
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isBulkUpdateDialogOpen} onOpenChange={setIsBulkUpdateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Bulk Add
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Bulk Add Universities</DialogTitle>
                  <DialogDescription>
                    Add multiple universities at once with automated credential generation.
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="universities" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="universities">Universities</TabsTrigger>
                    <TabsTrigger value="password-settings">Password Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="universities" className="space-y-4">
                    <div>
                      <Label htmlFor="bulkUniversities">University Names (one per line)</Label>
                      <Textarea
                        id="bulkUniversities"
                        value={bulkUniversities}
                        onChange={(e) => setBulkUniversities(e.target.value)}
                        placeholder="Arba Minch University&#10;Debre Markos University&#10;Wollo University"
                        rows={8}
                      />
                    </div>
                    <div>
                      <Label>Password Option</Label>
                      <Select value={bulkPasswordOption} onValueChange={(value: any) => setBulkPasswordOption(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="generate">Generate unique passwords</SelectItem>
                          <SelectItem value="same">Use same password for all</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {bulkPasswordOption === "same" && (
                      <div>
                        <Label htmlFor="bulkPassword">Password for all universities</Label>
                        <div className="flex gap-2">
                          <Input
                            id="bulkPassword"
                            type="password"
                            value={bulkPassword}
                            onChange={(e) => setBulkPassword(e.target.value)}
                            placeholder="Enter password"
                          />
                          <Button type="button" variant="outline" onClick={() => setBulkPassword(generatePassword())}>
                            <Shuffle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="password-settings" className="space-y-4">
                    <div>
                      <Label>Password Length: {passwordLength}</Label>
                      <Input
                        type="range"
                        min="8"
                        max="32"
                        value={passwordLength}
                        onChange={(e) => setPasswordLength(Number.parseInt(e.target.value))}
                        className="mt-2"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="uppercase"
                          checked={includeUppercase}
                          onCheckedChange={(checked) => setIncludeUppercase(checked as boolean)}
                        />
                        <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="lowercase"
                          checked={includeLowercase}
                          onCheckedChange={(checked) => setIncludeLowercase(checked as boolean)}
                        />
                        <Label htmlFor="lowercase">Lowercase (a-z)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="numbers"
                          checked={includeNumbers}
                          onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)}
                        />
                        <Label htmlFor="numbers">Numbers (0-9)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="symbols"
                          checked={includeSymbols}
                          onCheckedChange={(checked) => setIncludeSymbols(checked as boolean)}
                        />
                        <Label htmlFor="symbols">Symbols (!@#$...)</Label>
                      </div>
                    </div>
                    <div>
                      <Label>Sample Password</Label>
                      <div className="flex gap-2 mt-1">
                        <Input value={generatePassword()} readOnly className="font-mono" />
                        <Button type="button" variant="outline" onClick={() => {}}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsBulkUpdateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBulkAddUniversities} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Universities
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Bulk Operations
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Credential Operations</DialogTitle>
                  <DialogDescription>Perform operations on multiple university accounts at once.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Operation Type</Label>
                    <Select value={bulkOperation} onValueChange={(value: any) => setBulkOperation(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reset">Reset Passwords</SelectItem>
                        <SelectItem value="toggle">Toggle Account Status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Selected Universities: {selectedCredentials.length}</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedCredentials.length === 0
                        ? "No universities selected"
                        : `${selectedCredentials.length} universities selected`}
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsBulkDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBulkOperation} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Execute Operation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Universities</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{credentials.length}</div>
              <p className="text-xs text-muted-foreground">Registered accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCount}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Accounts</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inactiveCount}</div>
              <p className="text-xs text-muted-foreground">Currently inactive</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recently Updated</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentlyUpdated}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Table */}
        <Card>
          <CardHeader>
            <CardTitle>University Credentials</CardTitle>
            <CardDescription>
              Manage login credentials for all universities ({filteredCredentials.length} of {credentials.length} shown)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by university name or username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedCredentials.length === filteredCredentials.length && filteredCredentials.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCredentials.map((credential) => (
                    <TableRow key={credential.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCredentials.includes(credential.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCredentials([...selectedCredentials, credential.id])
                            } else {
                              setSelectedCredentials(selectedCredentials.filter((id) => id !== credential.id))
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{credential.universityName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{credential.username}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyToClipboard(credential.username, "Username")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {showPasswords[credential.id] ? credential.password : "••••••••••••"}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePasswordVisibility(credential.id)}
                          >
                            {showPasswords[credential.id] ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyToClipboard(credential.password, "Password")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={credential.status === "active" ? "default" : "secondary"}>
                          {credential.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {credential.lastLogin === "Never" ? "Never" : new Date(credential.lastLogin).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleResetPassword(credential.id)}>
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(credential.id)}>
                            {credential.status === "active" ? (
                              <ToggleRight className="h-3 w-3" />
                            ) : (
                              <ToggleLeft className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
