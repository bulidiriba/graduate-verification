'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import institutions from "@/data/institutions.json"
import year from "@/data/years.json"
import qualificationsData from "@/data/qualifications.json"
import { Loader2, Search, User, Building, GraduationCap, Calendar } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ResultContainer from './ResultContainer'

export default function VerifyStudentForm() {
  const [studentId, setStudentId] = useState('')
  const [studentFullName, setStudentFullName] = useState("")
  const [institutionName, setInstitutionName] = useState('')
  const [institutionFullName, setInstitutionFullName] = useState('')
  const [ethiopianYear, setEthiopianYear] = useState("")
  const [internationalYear, setInternationalYear] = useState(["", ""])
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

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication failed. Please login to continue.')
      setIsLoading(false)
      return
    }

    try {
      const queryParams = new URLSearchParams({
        name: studentFullName,
        institution: institutionName,
        year: internationalYear[0],
        qualification: qualification,
        token: token
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
    setInternationalYear([year[input as keyof typeof year].hemisCode, year[input as keyof typeof year].International])
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

  return (
    <>
      <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="p-6 bg-[#2F4D8A]">
          <CardTitle className="text-2xl font-bold text-center text-white">Student Info</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="studentId" className="text-sm font-medium text-gray-700 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Student National ID (Optional)
              </label>
              <Input
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter student national ID"
                className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="studentFullName" className="text-sm font-medium text-gray-700 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Student Full Name
              </label>
              <Input
                id="studentFullName"
                value={studentFullName}
                onChange={(e) => setStudentFullName(e.target.value)}
                placeholder="Enter student full name"
                className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="institutionName" className="text-sm font-medium text-gray-700 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Institution Name
              </label>
              <div className="relative">
                <Input
                  ref={inputRef}
                  type="text"
                  value={institutionFullName}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => setOpen(true)}
                  placeholder="Select institution"
                  className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
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
            </div>

            <div className="space-y-2">
              <label htmlFor="ethiopianYear" className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Year of Graduation
              </label>
              <div className="relative">
                <Input
                  ref={yearInputRef}
                  type="text"
                  value={"Eth: "+ethiopianYear+" (Int: "+internationalYear[1]+")"}
                  onChange={(e) => handleYearChange(e.target.value)}
                  onFocus={() => setOpenYear(true)}
                  placeholder="Select year"
                  className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                />
                {openYear && (
                  <div 
                    ref={yearPopoverRef}
                    className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg"
                  >
                    <div className="p-4 max-h-60 overflow-y-auto">
                      {filteredYear.length > 0 ? (
                        filteredYear.map((value, index) => (
                          <button
                            key={index}
                            className="flex w-full items-start gap-3 rounded-sm p-2 text-left hover:bg-gray-100"
                            onClick={() => handleSelectYear(value)}
                          >
                            <div className="flex flex-col">
                              <span className="font-bold text-[16px]">Ethiopia: {value}</span>
                              <span className="text-[14px] text-gray-600">
                                International: {year[value as keyof typeof year].International}
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
            </div>

            <div className="space-y-2">
              <label htmlFor="qualification" className="text-sm font-medium text-gray-700 flex items-center">
                <GraduationCap className="w-4 h-4 mr-2" />
                Qualification
              </label>
              <Select value={qualification} onValueChange={setQualification}>
                <SelectTrigger className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm">
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

            <Button
              type="submit"
              className="w-full bg-[#2F4D8A] hover:bg-[#243c6d] text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Verify Student
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ResultContainer result={result} error={error} />
    </>
  )
}

