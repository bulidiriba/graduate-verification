"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import institutions from "@/data/institutions.json"
import year from "@/data/years.json"
import qualificationsData from "@/data/qualifications.json"
import { Loader2, Search, User, Building, GraduationCap, Calendar, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ResultContainer from "./ResultContainer"

export default function VerifyStudentForm() {
  const [studentId, setStudentId] = useState("")
  const [studentFullName, setStudentFullName] = useState("")
  const [institutionName, setInstitutionName] = useState("")
  const [institutionFullName, setInstitutionFullName] = useState("")
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
  const [yearError, setYearError] = useState<string | null>(null)
  const [isInstitutionSelected, setIsInstitutionSelected] = useState(false)
  const [isYearSelected, setIsYearSelected] = useState(false)
  const [studentNames, setStudentNames] = useState<string[]>([]) // Added state for student names
  const [openStudentList, setOpenStudentList] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const yearInputRef = useRef<HTMLInputElement>(null)
  const studentNameInputRef = useRef<HTMLInputElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const verifyGraduate = async () => {
    if (!institutionName || !internationalYear[0]) {
      return // Don't submit if required fields are missing
    }

    setIsLoading(true)
    setError(null)
    setResult(null)
    setYearError(null)

    if (!year.hasOwnProperty(ethiopianYear)) {
      setYearError("The selected year doesn't exist in our records.")
      setIsLoading(false)
      return
    }

    const token = localStorage.getItem("authToken")
    if (!token) {
      setError("Authentication failed. Please login to continue.")
      setIsLoading(false)
      return
    }

    try {
      const queryParams = new URLSearchParams({
        institution: institutionName,
        year: internationalYear[0],
        token: token,
      })
      if (studentFullName) {
        queryParams.append("name", studentFullName)
      }
      if (studentId) {
        queryParams.append("studentNationalId", studentId)
      }
      if (qualification) {
        queryParams.append("qualification", qualification)
      }

      const response = await fetch(`/api/verify?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to verify graduates")
      }
      const data = await response.json()

      // Update studentNames with the received data
      if (Array.isArray(data.allStudentNames)) {
        setStudentNames(data.allStudentNames)
      }

      if(studentFullName) {
        setResult({"exists": data.exists, "student": data.student})
      }

    } catch (err) {
      setError("An error occurred while verifying the student. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (newValue: string) => {
    setInstitutionFullName(newValue)
    setOpen(true)
    filterDestinations(newValue)
    setIsInstitutionSelected(false)
  }

  const filterDestinations = (input: string) => {
    const filtered = Object.keys(institutions).filter((key) => {
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
    setIsInstitutionSelected(true)
    inputRef.current?.blur()
  }

  const clearInstitution = () => {
    setInstitutionName("")
    setInstitutionFullName("")
    setIsInstitutionSelected(false)
    setOpen(true)
    setResult(null) // Clear the result when institution is cleared
  }

  const handleYearChange = (newValue: string) => {
    setEthiopianYear(newValue)
    setYearError(null)
    setOpenYear(true)
    filterYear(newValue)
    setIsYearSelected(false)
  }

  const filterYear = (input: string) => {
    const filtered = Object.keys(year).filter(
      (key) =>
        key.toLowerCase().includes(input.toLowerCase()) ||
        year[key as keyof typeof year].Ethiopian.toLowerCase().includes(input.toLowerCase()),
    )
    setFilteredYear(filtered)
  }

  const handleSelectYear = (input: string) => {
    setEthiopianYear(year[input as keyof typeof year].Ethiopian)
    setInternationalYear([year[input as keyof typeof year].hemisCode, year[input as keyof typeof year].International])
    setOpenYear(false)
    setIsYearSelected(true)
    yearInputRef.current?.blur()
  }

  const clearYear = () => {
    setEthiopianYear("")
    setInternationalYear(["", ""])
    setIsYearSelected(false)
    setOpenYear(true)
    setResult(null) // Clear the result when year is cleared
  }

  const handleStudentFullNameChange = (newValue: string) => {
    setStudentFullName(newValue)
    setOpenStudentList(true)
  }

  const handleSelectStudentName = (name: string) => {
    setStudentFullName(name)
    setOpenStudentList(false)
  }

  const filterStudentNames = (input: string) => {
    return studentNames.filter((name) => name.toLowerCase().includes(input.toLowerCase()))
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (studentNameInputRef.current && !studentNameInputRef.current.contains(event.target as Node)) {
        const dropdownElement = document.querySelector(".student-name-dropdown")
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setOpenStudentList(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (internationalYear[0] && institutionName) {
      verifyGraduate()
    }
  }, [internationalYear, institutionName])

  return (
    <>
      <Card className="bg-white shadow-lg rounded-lg overflow-visible relative z-20">
        <CardHeader className="p-6 bg-[#2F4D8A]">
          <CardTitle className="text-2xl font-bold text-center text-white">Graduates Info</CardTitle>
        </CardHeader>
        <CardContent className="p-6" style={{ minHeight: "600px" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              verifyGraduate()
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label htmlFor="studentId" className="text-sm font-medium text-gray-700 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Student National ID (Optional)
              </label>
              <Input
                id="studentId"
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value)
                }}
                placeholder="Enter student national ID"
                className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="institutionName" className="text-sm font-medium text-gray-700 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Institution Name <span className="text-red-500 ml-1">(∗)</span>
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
                {isInstitutionSelected && (
                  <button
                    type="button"
                    onClick={clearInstitution}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                {open && (
                  <div ref={popoverRef} className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
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
              <label htmlFor="qualification" className="text-sm font-medium text-gray-700 flex items-center">
                <GraduationCap className="w-4 h-4 mr-2" />
                Qualification <span className="text-red-500 ml-1">(∗)</span>
              </label>
              <Select
                value={qualification}
                onValueChange={(value) => {
                  setQualification(value)
                }}
              >
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

            <div className="space-y-2">
              <label htmlFor="ethiopianYear" className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Year of Graduation <span className="text-red-500 ml-1">(∗)</span>
              </label>
              <div className="relative">
                <Input
                  ref={yearInputRef}
                  type="text"
                  value={ethiopianYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                  onFocus={() => setOpenYear(true)}
                  placeholder="Select year"
                  className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                />
                {isYearSelected && (
                  <button
                    type="button"
                    onClick={clearYear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                {yearError && <p className="text-red-500 text-sm mt-1">{yearError}</p>}
                {openYear && (
                  <div ref={popoverRef} className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                    <div className="p-4 max-h-60 overflow-y-auto">
                      {filteredYear.length > 0 ? (
                        filteredYear.map((value, index) => (
                          <button
                            key={index}
                            className="flex w-full items-start gap-3 rounded-sm p-2 text-left hover:bg-gray-100"
                            onClick={() => handleSelectYear(value)}
                          >
                            <div className="flex flex-col">
                              <span className="font-bold text-[16px]">EC: {value}</span>
                              <span className="text-[14px] text-gray-600">
                                GC:{" "}
                                {year[value as keyof typeof year].hemisCode.slice(0, 4) +
                                  "/" +
                                  year[value as keyof typeof year].hemisCode.slice(4)}
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
              <label htmlFor="studentFullName" className="text-sm font-medium text-gray-700 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Graduate Full Name <span className="text-red-500 ml-1">(∗)</span>
              </label>
              <div className="relative">
                <Input
                  ref={studentNameInputRef}
                  id="studentFullName"
                  value={studentFullName}
                  onChange={(e) => handleStudentFullNameChange(e.target.value)}
                  onFocus={() => {
                    setOpenStudentList(true)
                  }}
                  placeholder="Enter graduate full name"
                  className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                  required
                />
                {openStudentList && studentNames.length > 0 && (
                  <div
                    className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg student-name-dropdown"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    <div className="p-4">
                      {filterStudentNames(studentFullName).map((name, index) => (
                        <button
                          key={index}
                          className="flex w-full items-start gap-3 rounded-sm p-2 text-left hover:bg-gray-100"
                          onClick={() => handleSelectStudentName(name)}
                        >
                          <span className="font-medium">{name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2F4D8A] hover:bg-[#243c6d] text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Verify Graduates
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

