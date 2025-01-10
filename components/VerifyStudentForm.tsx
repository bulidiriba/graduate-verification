'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import institutions from "@/data/institutions.json"
import year from "@/data/years.json"
import qualificationsData from "@/data/qualifications.json"
import { Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function VerifyStudentForm() {
  const [studentId, setStudentId] = useState('')
  const [studentFullName, setStudentFullName] = useState("")
  const [institutionName, setInstitutionName] = useState('')
  const [institutionFullName, setInstitutionFullName] = useState('')
  const [ethiopianYear, setEthiopianYear] = useState("")
  const [internationalYear, setInternationalYear] = useState("")
  const [qualification, setQualification] = useState("")
  const [filteredDestinations, setFilteredDestinations] = useState(Object.keys(institutions))
  const [filteredYear, setFilteredYear] = useState(Object.keys(year))
  const [result, setResult] = useState<{ exists: boolean; student?: any } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [openYear, setOpenYear] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const yearInputRef = useRef<HTMLInputElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const yearPopoverRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const queryParams = new URLSearchParams({
        name: studentFullName,
        institution: institutionName,
        year: internationalYear,
        qualification: qualification
      })
      if (studentId) {
        queryParams.append('studentNationalId', studentId)
      }
      const response = await fetch(`/api/verify?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to verify student')
      }
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('An error occurred while verifying the student. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (newValue: string) => {
    setInstitutionFullName(newValue)
    setOpen(true)
    filterDestinations(newValue)
  } 

  const filterDestinations = (input: string) => {
    const filtered = Object.keys(institutions).filter(key => {
      const institution = institutions[key as keyof typeof institutions]
      return (
        institution.shortName.toLowerCase().includes(input.toLowerCase()) || 
        institution.fullName.toLowerCase().includes(input.toLowerCase())
      )
    })
    setFilteredDestinations(filtered)
  }

  const handleSelectInstitution = (destination: string) => {
    const institution = institutions[destination as keyof typeof institutions]
    setInstitutionName(institution.shortName)
    setInstitutionFullName(institution.fullName)
    setOpen(false)
    inputRef.current?.blur()
  }

  const handleYearChange = (newValue: string) => {
    setEthiopianYear(newValue)
    setOpenYear(true)
    filterYear(newValue)
  } 

  const filterYear = (input: string) => {
    const filtered = Object.keys(year).filter(key => 
      key.toLowerCase().includes(input.toLowerCase()) || 
      year[key as keyof typeof year].Ethiopian.toLowerCase().includes(input.toLowerCase())
    )
    setFilteredYear(filtered)
  }

  const handleSelectYear = (input: string) => {
    setEthiopianYear(year[input as keyof typeof year].Ethiopian)
    setInternationalYear(year[input as keyof typeof year].International)
    setOpenYear(false)
    yearInputRef.current?.blur()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
      if (yearPopoverRef.current && !yearPopoverRef.current.contains(event.target as Node)) {
        setOpenYear(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const resultContainer = document.getElementById('result-container')
    if (resultContainer) {
      if (error) {
        resultContainer.innerHTML = `
        <div class="mt-6 flex justify-center">
          <div class="bg-white rounded-lg shadow-sm p-6 max-w-2xl w-full">
            <h3 class="text-lg font-semibold mb-4 text-red-600">Error</h3>
            <p>${error}</p>
          </div>
        </div>
      `
      } else if (result) {
        resultContainer.innerHTML = `
        <div class="mt-6 flex justify-center">
          <div class="bg-white rounded-lg shadow-sm p-6 max-w-2xl w-full">
            <h3 class="text-lg font-semibold mb-4">${result.exists ? "This Student is Verified." : "The Student Not Found"}</h3>
            ${result.exists ? `
              <div class="space-y-2">
                <p><strong>Name:</strong> ${result.student.studentFullName}</p>
                <p><strong>National ID:</strong> ${result.student.studentNationalId}</p>
                <p><strong>Qualification:</strong> ${result.student.qualification}</p>
                <p><strong>Study Program:</strong> ${result.student.studyProgram}</p>
                <p><strong>Obtained Certificate:</strong> ${result.student.obtainedCertificate}</p>
                <p><strong>Year of Graduation:</strong> ${result.student.yearOfGraduation}</p>
                <p><strong>End Date:</strong> ${result.student.endDate}</p>
                <p><strong>Institution:</strong> ${result.student.institutionName}</p>
                <p><strong>Country:</strong> ${result.student.institutionCountry}</p>
                <p><strong>Accredited:</strong> ${result.student.isAccredited ? 'Yes' : 'No'}</p>
                <p><strong>CGPA:</strong> ${result.student.cgpa}</p>
              </div>
            ` : "No student found with the provided information."}
          </div>
        </div>
      `
      } else {
        resultContainer.innerHTML = ''
      }
    }
  }, [result, error])

  return (
    <>
      <Card>
      <CardHeader>
        <CardTitle className="text-xl text-gray-600">Fill the Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                Student National ID (Optional)
              </label>
              <input
                id="studentId"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter student national ID (optional)"
                className="h-14 w-full rounded-[8px] border-2 border-gray-300 bg-white px-4 text-base hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="studentFullName" className="block text-sm font-medium text-gray-700 mb-1">
                Student Full Name
              </label>
              <input
                id="studentFullName"
                type="text"
                value={studentFullName}
                onChange={(e) => setStudentFullName(e.target.value)}
                placeholder="Enter student full name"
                className="h-14 w-full rounded-[8px] border-2 border-gray-300 bg-white px-4 text-base hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-1">
                Institution Name
              </label>
              <input
                ref={inputRef}
                type="text"
                value={institutionFullName}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => setOpen(true)}
                placeholder="Where are you graduated?"
                className="h-14 w-full rounded-[8px] border-2 border-gray-300 bg-white px-4 text-base hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
              {open && (
                <div 
                  ref={popoverRef}
                  className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg"
                >
                  <div className="p-4 max-h-60 overflow-y-auto">
                    {filteredDestinations.length > 0 ? (
                      filteredDestinations.map((key) => (
                        <button
                          key={institutions[key as keyof typeof institutions].id}
                          className="flex w-full items-start gap-3 rounded-sm p-2 text-left hover:bg-gray-100"
                          onClick={() => handleSelectInstitution(key)}
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-[16px]">
                              {institutions[key as keyof typeof institutions].shortName}
                            </span>
                            <span className="text-[14px] text-gray-600">
                              {institutions[key as keyof typeof institutions].fullName}
                            </span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-gray-500 p-2">No matching institutions found</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
             <label htmlFor="yearOfGraduation" className="block text-sm font-medium text-gray-700 mb-1">
                Year of Graduation
              </label>
              <input
                ref={yearInputRef}
                type="text"
                value={ethiopianYear}
                onChange={(e) => handleYearChange(e.target.value)}
                onFocus={() => setOpenYear(true)}
                placeholder="When are you graduated?"
                className="h-14 w-full rounded-[8px] border-2 border-gray-300 bg-white px-4 text-base hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
              {openYear && (
                <div 
                  ref={yearPopoverRef}
                  className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg"
                >
                  <div className="p-4">
                    {filteredYear.length > 0 ? (
                      filteredYear.map((value, index) => (
                        <button
                          key={index}
                          className="flex w-full items-start gap-3 rounded-sm p-2 text-left hover:bg-gray-100"
                          onClick={() => handleSelectYear(value)}
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-[16px]">{value}</span>
                            <span className="text-[14px] text-gray-600">
                              {year[value as keyof typeof year].International}
                            </span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-gray-500 p-2">No matching Year found</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
                Qualification
              </label>
              <Select value={qualification} onValueChange={setQualification}>
                <SelectTrigger className="h-14 w-full rounded-[8px] border-2 border-gray-300 bg-white px-4 text-base hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors">
                  <SelectValue placeholder="Select qualification" />
                </SelectTrigger>
                <SelectContent>
                  {qualificationsData.qualifications.map((qual, index) => (
                    <SelectItem key={index} value={qual}>
                      {qual}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="h-14 w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-[8px] transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Check'
                )}
              </Button>
            </div>
          </form>
      </CardContent>
    </Card>
    <div id="result-container" className="flex justify-center"></div>
    </>
  )
}

