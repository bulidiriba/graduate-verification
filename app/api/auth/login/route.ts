import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  const apiBaseUrl = "http://hemis.ethernet.edu.et/backend"


  try {
    const response = await fetch(`${apiBaseUrl}/api/users/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  }
}

