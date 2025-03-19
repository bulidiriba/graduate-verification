"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, FileText, School, Award, BookOpen } from "lucide-react"

// Mock data for demonstration
const mockStats = {
  totalGraduates: 1234,
  verifiedCertificates: 1024,
  institutions: 52,
  qualifications: {
    "Bachelors Degree": 850,
    "Master Degree": 320,
    PHD: 64,
  },
  topPrograms: [
    { name: "Computer Science", count: 210 },
    { name: "Business Administration", count: 180 },
    { name: "Mechanical Engineering", count: 150 },
    { name: "Electrical Engineering", count: 120 },
    { name: "Medicine", count: 100 },
  ],
  graduatesByYear: {
    "2020": 350,
    "2021": 380,
    "2022": 420,
    "2023": 450,
    "2024": 84,
  },
}

export function GraduateStats() {
  const [stats, setStats] = useState(mockStats)

  // In a real application, you would fetch the stats from your API
  useEffect(() => {
    // Simulate API call
    const fetchStats = async () => {
      // const response = await fetch('/api/admin/stats')
      // const data = await response.json()
      // setStats(data)
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Graduates</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGraduates.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(stats.totalGraduates * 0.12).toLocaleString()} from last year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Certificates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verifiedCertificates.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.verifiedCertificates / stats.totalGraduates) * 100)}% of total graduates
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Institutions</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.institutions}</div>
            <p className="text-xs text-muted-foreground">Across Ethiopia</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Year</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2024</div>
            <p className="text-xs text-muted-foreground">{stats.graduatesByYear["2024"]} graduates so far</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Graduates by Qualification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.qualifications).map(([qualification, count]) => (
                <div key={qualification} className="flex items-center">
                  <Award className="h-4 w-4 text-blue-500 mr-2" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{qualification}</div>
                    <div className="w-full h-2 bg-gray-100 rounded-full mt-1">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${(count / stats.totalGraduates) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium ml-2">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Study Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topPrograms.map((program, index) => (
                <div key={index} className="flex items-center">
                  <BookOpen className="h-4 w-4 text-green-500 mr-2" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{program.name}</div>
                    <div className="w-full h-2 bg-gray-100 rounded-full mt-1">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width: `${(program.count / stats.topPrograms[0].count) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium ml-2">{program.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>


      <Card>
        <CardHeader>
          <CardTitle className="text-base">Graduates by Year</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between space-x-2 overflow-x-auto pb-2">
            {Object.entries(stats.graduatesByYear).map(([year, count]) => (
              <div key={year} className="flex flex-col items-center">
                <div className="h-24 w-12 bg-gray-100 rounded-t-md relative">
                  <div
                    className="absolute bottom-0 w-full bg-[#2F4D8A] rounded-t-md"
                    style={{
                      height: `${(count / Math.max(...Object.values(stats.graduatesByYear))) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium mt-1">{year}</span>
                <span className="text-xs text-gray-500">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

