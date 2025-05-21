"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Search } from "lucide-react"
import type { ValidationResult } from "@/utils/validation"

interface ImportPreviewProps {
  data: any[]
  validationResults?: Map<any, ValidationResult>
}

export function ImportPreview({ data, validationResults }: ImportPreviewProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData = data.filter(
    (item) =>
      item.studentFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentNationalId?.includes(searchTerm) ||
      item.institutionName?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get all unique column names from the data
  const columns =
    data.length > 0
      ? Object.keys(data[0]).filter(
          (key) =>
            // Filter out some columns that we don't want to display
            !["isAccredited", "institutionCountry"].includes(key),
        )
      : []

  // Function to determine row status icon
  const getRowStatusIcon = (item: any) => {
    if (!validationResults) {
      return <CheckCircle className="h-5 w-5 text-green-500" title="Valid" />
    }

    const result = validationResults.get(item)
    if (!result) {
      return <CheckCircle className="h-5 w-5 text-green-500" title="Valid" />
    }

    if (!result.isValid) {
      return <AlertTriangle className="h-5 w-5 text-red-500" title="Error" />
    }

    if (result.warnings.length > 0) {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" title="Warning" />
    }

    return <CheckCircle className="h-5 w-5 text-green-500" title="Valid" />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Preview Data</h3>
        <Badge className="bg-green-500">{data.length} Records</Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search records..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Status</TableHead>
                {columns.map((column) => (
                  <TableHead key={column}>
                    {column
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())
                      .replace(/([a-z])([A-Z])/g, "$1 $2")}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{getRowStatusIcon(item)}</TableCell>
                    {columns.map((column) => (
                      <TableCell key={column}>
                        {typeof item[column] === "boolean" ? (item[column] ? "Yes" : "No") : String(item[column] || "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {validationResults && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Validation Results</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Please review the data before confirming the import. The following issues were found:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {Array.from(validationResults.values()).some((r) => !r.isValid) && (
                    <li>
                      {Array.from(validationResults.values()).filter((r) => !r.isValid).length} records have errors that
                      must be fixed
                    </li>
                  )}
                  {Array.from(validationResults.values()).some((r) => r.warnings.length > 0) && (
                    <li>
                      {Array.from(validationResults.values()).filter((r) => r.warnings.length > 0).length} records have
                      warnings that should be reviewed
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
