import { useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCircle2,
  XCircle,
  User,
  Award,
  BookOpen,
  Scroll,
  CalendarIcon,
  School,
  Flag,
  CheckSquare,
  BarChart,
  FileDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { exportToPdf } from "../utils/pdfExport"

interface ResultContainerProps {
  result: { exists: boolean; student?: any } | null
  error: string | null
}

export default function ResultContainer({ result, error }: ResultContainerProps) {
  const componentRef = useRef<HTMLDivElement>(null)

  const handleExportPdf = () => {
    if (componentRef.current) {
      exportToPdf(componentRef.current)
    }
  }

  if (!result && !error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">Verification Result</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            The verification result will be displayed here after submitting the form.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {error && (
        <div className="mt-6 flex justify-center">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 w-full max-w-2xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 flex justify-center">
          <Card className="bg-white rounded-lg shadow-sm p-6 max-w-2xl w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold text-center">
                {result.exists ? (
                  <div className="flex items-center justify-center text-green-600">
                    <CheckCircle2 className="mr-2 h-8 w-8" />
                    Verified
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-red-600">
                    <XCircle className="mr-2 h-8 w-8" />
                    Not Found
                  </div>
                )}
              </CardTitle>
              <div>
                {result.exists && ( 
                  <Button onClick={handleExportPdf} variant="outline" size="sm">
                  <FileDown className="h-4 w-4 mr-2" />
                    Save Document
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div ref={componentRef}>
                {result.exists ? (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">Name:</span> {result.student.studentFullName}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">Student National ID:</span> {result.student.studentNationalId}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">Qualification:</span> {result.student.qualification}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">Study Program:</span> {result.student.studyProgram}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Scroll className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">Obtained Certificate:</span>{" "}
                        {result.student.obtainedCertificate}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">Year of Graduation:</span> {result.student.yearOfGraduation}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">End Date:</span> {result.student.endDate}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <School className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">Institution:</span> {result.student.institutionName}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Flag className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">Country:</span> {result.student.institutionCountry}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <CheckSquare className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">Accredited:</span> {result.student.isAccredited ? "Yes" : "No"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <BarChart className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">CGPA:</span> {result.student.cgpa}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-600">No graduates found with the provided information.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

