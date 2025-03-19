"use client"

import type React from "react"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FileSpreadsheet, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExcelUploaderProps {
  file: File | null
  setFile: React.Dispatch<React.SetStateAction<File | null>>
}

export function ExcelUploader({ file, setFile }: ExcelUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0])
      }
    },
    [setFile],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  })

  const removeFile = () => {
    setFile(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            <FileSpreadsheet className="h-10 w-10 text-gray-400" />
            <p className="text-sm font-medium">
              {isDragActive ? "Drop the Excel file here..." : "Drag & drop an Excel file here, or click to select"}
            </p>
            <p className="text-xs text-gray-500">Supports .xlsx, .xls, and .csv files</p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={removeFile} className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

