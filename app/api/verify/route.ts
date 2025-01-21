import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const studentNationalId = searchParams.get('studentNationalId')
  const name = searchParams.get('name')
  const institution = searchParams.get('institution')
  const year = searchParams.get('year')
  const apiToken = searchParams.get('token')

  if (!name || !institution || !year) {
    return NextResponse.json({ error: 'Full Name, Institution, and Year of Graduation are required' }, { status: 400 })
  }
  console.log("search params", searchParams)
  const apiBaseUrl = "http://hemis.ethernet.edu.et/backend"

  if (!apiToken || !apiBaseUrl) {
    return NextResponse.json({ error: 'API configuration is missing' }, { status: 500 })
  }

  try {
    const API_URL = `${apiBaseUrl}/StudentGraduate/GetStudentGraduatesByInstitution/${year}/${encodeURIComponent(institution)}`
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data from the API')
    }

    const data = await response.json()
    
    if (!Array.isArray(data)) {
      throw new Error('Unexpected data format received from the API')
    }

    const student = data.find((s: any) => {
      const nameMatch = s.studentFullName && s.studentFullName.toLowerCase().replaceAll(" ", "") === name.toLowerCase().replaceAll(" ", "");
      // Adding Elastic search
      const idMatch = !studentNationalId || (s.studentNationalId && s.studentNationalId === studentNationalId);
      return nameMatch && idMatch;
    });

    if (student) {
      return NextResponse.json({ exists: true, student })
    } else {
      return NextResponse.json({ exists: false })
    }
  } catch {
    return NextResponse.json({ error: 'Failed to verify graduates' }, { status: 500 })
  }
}

