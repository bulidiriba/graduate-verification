"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ExcelUploader } from "@/components/admin/ExcelUploader"
import { ImportPreview } from "@/components/admin/ImportPreview"
import { ArrowLeft, Upload, FileSpreadsheet, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Header } from "@/components/header"
import { parseExcelFile } from "@/utils/excelParser"
import { validateGraduateRecords, type ValidationResult } from "@/utils/validation"

// Generate years from 2010 to current year
const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 2010 + 1 }, (_, i) => 2010 + i)

// Add this function after the existing imports but before the component definition
const handleDownloadTemplate = () => {
  // Create a link element
  const link = document.createElement("a")
  link.href = "/studentgraduate.xlsx"
  link.download = "graduate_template.xlsx"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function ImportGraduatesPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [year, setYear] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [previewData, setPreviewData] = useState<any[] | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [validationResults, setValidationResults] = useState<Map<any, ValidationResult>>(new Map())

  // Then replace the handleUpload function with this implementation that actually parses the Excel file
  const handleUpload = async () => {
    if (!file || !year) {
      setErrors(["Please select both a year and an Excel file"])
      return
    }

    setErrors([])
    setIsUploading(true)

    try {
      // Parse the actual Excel file
      const graduateRecords = await parseExcelFile(file)

      // Add the selected year to each record if not already present
      const recordsWithYear = graduateRecords.map((record) => ({
        ...record,
        yearOfGraduation: record.yearOfGraduation || Number.parseInt(year),
      }))

      // Validate the data
      const { validRecords, invalidRecords, warningRecords, validationResults } =
        validateGraduateRecords(recordsWithYear)

      // If there are invalid records, show errors
      if (invalidRecords.length > 0) {
        setErrors([`${invalidRecords.length} records have validation errors and cannot be imported.`])
        // Still show the preview with all records
        setPreviewData(recordsWithYear)
      } else {
        setPreviewData(recordsWithYear)
        setSuccessMessage(
          `Excel file processed successfully. Found ${recordsWithYear.length} records. Please review the data before importing.`,
        )
      }

      setValidationResults(validationResults)
    } catch (error) {
      console.error("Error processing Excel file:", error)
      setErrors(["Failed to process the Excel file. Please check the file format and try again."])
    } finally {
      setIsUploading(false)
    }
  }

  const handleImport = async () => {
    if (!previewData) return

    setIsProcessing(true)

    try {
      // In a real application, you would send the processed data to your API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to graduates list after successful import
      router.push("/admin/graduates")
    } catch (error) {
      setErrors(["Failed to import the data. Please try again."])
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreviewData(null)
    setSuccessMessage(null)
    setErrors([])
  }

  return (
    <main className="w-full min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/graduates">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Import Graduates</h1>
            <p className="text-muted-foreground">Upload graduate information from an Excel file</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Excel Upload</CardTitle>
            <CardDescription>Upload an Excel file containing graduate information for a specific year</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {successMessage && !previewData && (
              <Alert className="bg-green-50 border-green-200">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            {!previewData ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="year">Graduation Year</Label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger id="year" className="w-full md:w-1/3">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <ExcelUploader file={file} setFile={setFile} />

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FileSpreadsheet className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Excel Template Format</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>Your Excel file should have the following columns:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>Student National ID</li>
                          <li>Student Full Name</li>
                          <li>Institution Name</li>
                          <li>Qualification</li>
                          <li>Study Program</li>
                          <li>CGPA</li>
                          <li>End Date</li>
                        </ul>
                      </div>
                      <div className="mt-3">
                        <Button variant="outline" size="sm" className="bg-white" onClick={handleDownloadTemplate}>
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          Download Template
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <ImportPreview data={previewData} validationResults={validationResults} />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {!previewData ? (
              <>
                <Button variant="outline" onClick={() => router.push("/admin/graduates")}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={!file || !year || isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload and Preview
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleReset}>
                  Upload Another File
                </Button>
                <Button onClick={handleImport} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Confirm Import
                    </>
                  )}
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
