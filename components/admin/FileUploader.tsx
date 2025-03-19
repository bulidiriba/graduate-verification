"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FileText, X, Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileUploaderProps {
  files: File[]
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
  maxFiles?: number
  acceptedFileTypes?: Record<string, string[]>
  maxSizeInMB?: number
}

export function FileUploader({
  files,
  setFiles,
  maxFiles = 1,
  acceptedFileTypes = {
    "application/pdf": [".pdf"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
  },
  maxSizeInMB = 10,
}: FileUploaderProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null)

      // Check if adding these files would exceed the max files limit
      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`You can only upload up to ${maxFiles} file${maxFiles === 1 ? "" : "s"}.`)
        return
      }

      // Check file sizes
      const oversizedFiles = acceptedFiles.filter((file) => file.size > maxSizeInMB * 1024 * 1024)

      if (oversizedFiles.length > 0) {
        setError(`Some files exceed the maximum size of ${maxSizeInMB}MB.`)
        return
      }

      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
    },
    [files, maxFiles, maxSizeInMB, setFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize: maxSizeInMB * 1024 * 1024,
    maxFiles,
  })

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <p className="text-sm font-medium">
            {isDragActive ? "Drop the files here..." : "Drag & drop files here, or click to select files"}
          </p>
          <p className="text-xs text-gray-500">
            {`Supports ${Object.values(acceptedFileTypes).flat().join(", ")} (Max: ${maxSizeInMB}MB)`}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Files:</p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="h-8 w-8 rounded-full">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

