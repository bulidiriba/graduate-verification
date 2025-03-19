import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
// Import the GraduateStats component
import { GraduateStats } from "@/components/admin/GraduateStats"

export default function AdminDashboard() {
  return (
    <main className="w-full min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">University Dashboard</h1>
            <p className="text-muted-foreground">Manage graduate information and certificates</p>
          </div>
          <Button className="bg-[#2F4D8A] hover:bg-[#243c6d] text-white self-start sm:self-center" asChild>
            <Link href="/admin/graduates">
              <GraduationCap className="mr-2 h-4 w-4" />
              Manage Graduates
            </Link>
          </Button>
        </div>

        <GraduateStats />

        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest graduate records and certificate uploads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {i % 2 === 0 ? "New graduate added" : "Certificate uploaded"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(Date.now() - i * 3600000).toLocaleString()}
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

