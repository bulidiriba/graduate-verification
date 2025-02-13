import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const studentNationalId = searchParams.get("studentNationalId")
  const name = searchParams.get("name")
  const institution = searchParams.get("institution")
  const year = searchParams.get("year")
  const apiToken = searchParams.get("token")

  if (!institution || !year) {
    return NextResponse.json({ error: "Institution and Year of Graduation are required" }, { status: 400 })
  }
  console.log("search params", searchParams)
  const apiBaseUrl = "http://hemis.ethernet.edu.et/backend"

  if (!apiToken || !apiBaseUrl) {
    return NextResponse.json({ error: "API configuration is missing" }, { status: 500 })
  }

  try {
    const API_URL = `${apiBaseUrl}/StudentGraduate/GetStudentGraduatesByInstitution/${year}/${encodeURIComponent(institution)}`
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch data from the API")
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error("Unexpected data format received from the API")
    }

    // Extract all student names
    const allStudentNames = data.map((s: any) => s.studentFullName)

    // Find the specific student if name is provided
    let student = null
    if (name) {
      student = data.find((s: any) => {
        const nameMatch =
          s.studentFullName &&
          s.studentFullName.toLowerCase().replaceAll(" ", "") === name.toLowerCase().replaceAll(" ", "")
        const idMatch = !studentNationalId || (s.studentNationalId && s.studentNationalId === studentNationalId)
        return nameMatch && idMatch
      })
    }

    if (student && student.studentFullName) {
      return NextResponse.json({ exists: true, student, allStudentNames })
    } else {
      return NextResponse.json({ exists: false, allStudentNames })
    }
  } catch (error) {
    console.error("Error in verify route:", error)
    return NextResponse.json({ error: "Failed to verify graduates" }, { status: 500 })
  }
}

