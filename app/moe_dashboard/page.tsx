import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCheck, School, Users, BookOpen, Key } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"

export default function MoeDashboard() {
  return (
    <main className="w-full min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ministry of Education Dashboard</h1>
            <p className="text-muted-foreground">Monitor and verify graduate information across universities</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="bg-[#2F4D8A] hover:bg-[#243c6d] text-white" asChild>
              <Link href="/moe_dashboard/universities">
                <School className="mr-2 h-4 w-4" />
                Manage Universities
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-[#2F4D8A] text-[#2F4D8A] hover:bg-[#2F4D8A] hover:text-white"
              asChild
            >
              <Link href="/moe_dashboard/signature-keys">
                <Key className="mr-2 h-4 w-4" />
                Manage All Signature Keys
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Universities</CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">Registered institutions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Graduates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156,289</div>
              <p className="text-xs text-muted-foreground">Across all universities</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Certificates</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124,563</div>
              <p className="text-xs text-muted-foreground">Digitally signed certificates</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Programs</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,245</div>
              <p className="text-xs text-muted-foreground">Across all universities</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Verifications</CardTitle>
              <CardDescription>Latest certificate verification requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {
                          [
                            "BSc in Computer Science",
                            "BA in Economics",
                            "MSc in Engineering",
                            "PhD in Physics",
                            "MD in Medicine",
                          ][i - 1]
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {
                          [
                            "Addis Ababa University",
                            "Bahir Dar University",
                            "Jimma University",
                            "Hawassa University",
                            "Mekelle University",
                          ][i - 1]
                        }{" "}
                        • {new Date(Date.now() - i * 3600000).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>University Activity</CardTitle>
              <CardDescription>Recent graduate data submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {
                          [
                            "Addis Ababa University",
                            "Bahir Dar University",
                            "Jimma University",
                            "Hawassa University",
                            "Mekelle University",
                          ][i - 1]
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {[124, 87, 56, 42, 31][i - 1]} graduates submitted •{" "}
                        {new Date(Date.now() - i * 7200000).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
