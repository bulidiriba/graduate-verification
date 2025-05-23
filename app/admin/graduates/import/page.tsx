"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ExcelUploader } from "@/components/admin/ExcelUploader"
import { ImportPreview } from "@/components/admin/ImportPreview"
import { ArrowLeft, Upload, FileSpreadsheet, Loader2, Save, Key, RefreshCw, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Header } from "@/components/header"
import { parseExcelFile } from "@/utils/excelParser"
import { validateGraduateRecords, type ValidationResult } from "@/utils/validation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Steps, Step } from "@/components/ui/steps"

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

  // Add state for MOE signature key and private key
  const [moeSignatureKey, setMoeSignatureKey] = useState<string>("")
  const [privateKey, setPrivateKey] = useState<string>("")
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false)
  const [keyPairGenerated, setKeyPairGenerated] = useState(false)
  const [university, setUniversity] = useState<string>("Addis Ababa University")

  // Add state for the current step
  const [currentStep, setCurrentStep] = useState<number>(1)

  // Function to generate new key pairs
  const handleGenerateKeyPairs = async () => {
    if (!year || !university || !moeSignatureKey) {
      setErrors(["Please enter university name, year, and MOE signature key to generate key pairs"])
      return
    }

    setIsGeneratingKeys(true)
    setErrors([])

    try {
      const response = await fetch("http://127.0.0.1:5000/university/generate_private_key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          university: university,
          year: Number.parseInt(year),
          moe_signature_key: moeSignatureKey,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to generate key pairs: ${response.status} ${response.statusText}`)
      }

      // Set the private key from the response
      if (data.university_private_key) {
        setPrivateKey(data.university_private_key)
        setKeyPairGenerated(true)
        setSuccessMessage("Key pairs generated successfully. Please save your private key securely.")
      } else {
        throw new Error("No private key returned from the server")
      }
    } catch (error) {
      console.error("Error generating key pairs:", error)
      setErrors([error instanceof Error ? error.message : "Failed to generate key pairs. Please try again."])
    } finally {
      setIsGeneratingKeys(false)
    }
  }

  // Function to proceed to the next step
  const handleProceedToImport = () => {
    if (!moeSignatureKey || !privateKey) {
      setErrors(["Please provide both MOE signature key and private key before proceeding"])
      return
    }

    if (!year) {
      setErrors(["Please select a graduation year before proceeding"])
      return
    }

    setErrors([])
    setCurrentStep(2)
  }

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
      setCurrentStep(3)
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
      // Format the data according to the specified structure
      const payload = {
        graduates: previewData,
        institution_name: university || previewData[0]?.institutionName || "",
        year: year,
        moe_signature_key: moeSignatureKey,
        university_private_key: privateKey,
      }

      // Send the data to the external API
      const response = await fetch("http://127.0.0.1:5000/university/sign_graduate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to import graduates: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      // Show success message
      setSuccessMessage(`Successfully imported ${result.count || previewData.length} graduates.`)

      // Redirect to graduates list after successful import
      setTimeout(() => {
        router.push("/admin/graduates")
      }, 1500)
    } catch (error) {
      console.error("Error importing graduates:", error)
      setErrors([error instanceof Error ? error.message : "Failed to import the data. Please try again."])
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreviewData(null)
    setSuccessMessage(null)
    setErrors([])
    setCurrentStep(2) // Go back to file upload step
  }

  const handleBackToKeys = () => {
    setCurrentStep(1)
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

        <Steps activeStep={currentStep} className="mb-8">
          <Step step={1} label="Configure Keys" description="Set up signature keys" />
          <Step step={2} label="Upload Excel" description="Import graduate data" />
          <Step step={3} label="Review & Import" description="Confirm and complete" />
        </Steps>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Configure Signature Keys"}
              {currentStep === 2 && "Excel Upload"}
              {currentStep === 3 && "Review Graduate Data"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Set up the signature keys required for graduate verification"}
              {currentStep === 2 && "Upload an Excel file containing graduate information"}
              {currentStep === 3 && "Review and confirm graduate information before importing"}
            </CardDescription>
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

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="university">University</Label>
                    <Input
                      id="university"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="Enter university name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Graduation Year</Label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger id="year" className="w-full">
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
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="moeSignatureKey">MOE Signature Key</Label>
                    <Input
                      id="moeSignatureKey"
                      value={moeSignatureKey}
                      onChange={(e) => setMoeSignatureKey(e.target.value)}
                      placeholder="Enter MOE signature key"
                    />
                    <p className="text-sm text-muted-foreground">
                      This is the signature key provided by the Ministry of Education.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="privateKey">University Private Key</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateKeyPairs}
                        disabled={isGeneratingKeys || !year || !university || !moeSignatureKey}
                      >
                        {isGeneratingKeys ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Generate New Keys
                          </>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      id="privateKey"
                      value={privateKey}
                      onChange={(e) => setPrivateKey(e.target.value)}
                      placeholder="Enter or generate university private key"
                      rows={6}
                      className="font-mono text-sm"
                    />
                    <p className="text-sm text-muted-foreground">
                      This is the private key for the university. Keep this secure and do not share it.
                    </p>
                  </div>

                  {keyPairGenerated && (
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <Key className="h-4 w-4 text-yellow-600" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription>
                        Your private key has been generated. Please save it securely as it will not be stored on the
                        server. You will need this key for future operations.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Key className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Keys Configured</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>You have configured the following keys:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>University: {university}</li>
                          <li>Year: {year}</li>
                          <li>MOE Signature Key: {moeSignatureKey.substring(0, 10)}...</li>
                          <li>Private Key: {privateKey.substring(0, 10)}...</li>
                        </ul>
                      </div>
                      <div className="mt-3">
                        <Button variant="outline" size="sm" className="bg-white" onClick={handleBackToKeys}>
                          <Key className="h-4 w-4 mr-2" />
                          Edit Keys
                        </Button>
                      </div>
                    </div>
                  </div>
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
              </div>
            )}

            {currentStep === 3 && previewData && (
              <ImportPreview data={previewData} validationResults={validationResults} />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {currentStep === 1 && (
              <>
                <Button variant="outline" onClick={() => router.push("/admin/graduates")}>
                  Cancel
                </Button>
                <Button onClick={handleProceedToImport} disabled={!moeSignatureKey || !privateKey || !year}>
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Proceed to Upload
                </Button>
              </>
            )}

            {currentStep === 2 && (
              <>
                <Button variant="outline" onClick={handleBackToKeys}>
                  Back to Keys
                </Button>
                <Button onClick={handleUpload} disabled={!file || isUploading}>
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
            )}

            {currentStep === 3 && (
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
