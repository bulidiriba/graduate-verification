export interface ValidationResult {
  isValid: boolean
  warnings: string[]
  errors: string[]
}

export interface GraduateRecord {
  studentNationalId: string
  studentFullName: string
  yearOfGraduation: number
  endDate: string | Date | null
  obtainedCertificate: string
  institutionName: string
  institutionCountry: string
  isAccredited: boolean
  cgpa: number
  qualification: string
  studyProgram: string
  [key: string]: any
}

export function validateGraduateRecord(record: GraduateRecord): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    warnings: [],
    errors: [],
  }

  // Check for required fields
  if (!record.studentNationalId) {
    result.errors.push("Student National ID is required")
    result.isValid = false
  }

  if (!record.studentFullName) {
    result.errors.push("Student Full Name is required")
    result.isValid = false
  }

  if (!record.institutionName) {
    result.errors.push("Institution Name is required")
    result.isValid = false
  }

  if (!record.yearOfGraduation) {
    result.errors.push("Year of Graduation is required")
    result.isValid = false
  }

  // Add warnings for potentially problematic data
  if (record.cgpa > 4.0 || record.cgpa < 0) {
    result.warnings.push("CGPA should be between 0 and 4.0")
  }

  if (record.yearOfGraduation < 2000 || record.yearOfGraduation > new Date().getFullYear()) {
    result.warnings.push("Year of Graduation seems unusual")
  }

  return result
}

export function validateGraduateRecords(records: GraduateRecord[]): {
  validRecords: GraduateRecord[]
  invalidRecords: GraduateRecord[]
  warningRecords: GraduateRecord[]
  validationResults: Map<GraduateRecord, ValidationResult>
} {
  const validationResults = new Map<GraduateRecord, ValidationResult>()
  const validRecords: GraduateRecord[] = []
  const invalidRecords: GraduateRecord[] = []
  const warningRecords: GraduateRecord[] = []

  records.forEach((record) => {
    const result = validateGraduateRecord(record)
    validationResults.set(record, result)

    if (!result.isValid) {
      invalidRecords.push(record)
    } else if (result.warnings.length > 0) {
      warningRecords.push(record)
      validRecords.push(record)
    } else {
      validRecords.push(record)
    }
  })

  return {
    validRecords,
    invalidRecords,
    warningRecords,
    validationResults,
  }
}
