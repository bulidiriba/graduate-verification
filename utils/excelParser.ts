import * as XLSX from "xlsx"
import type { GraduateRecord } from "./validation"

export async function parseExcelFile(file: File): Promise<GraduateRecord[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: "binary" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        // Map the Excel data to our GraduateRecord interface
        const graduateRecords = jsonData.map((record: any) => {
          return {
            studentNationalId: record["student_national_id"] || "",
            studentFullName: record["student_full_name"] || "",
            yearOfGraduation: Number.parseInt(record["graduation_date"] || "0"),
            endDate: record["end_date"] || null,
            obtainedCertificate: record["obtained_certificate"] || "",
            institutionName: record["institution_name"] || "",
            institutionCountry: record["institution_country"] || "Ethiopia",
            isAccredited: record["Is Accredited"] === "Yes" || record["Is Accredited"] === true,
            cgpa: Number.parseFloat(record["cgpa"] || "0"),
            qualification: record["qualification"] || "",
            studyProgram: record["study_program"] || "",
          }
        })

        resolve(graduateRecords)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsBinaryString(file)
  })
}
