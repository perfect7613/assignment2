"use client"

import { useState } from "react"
import { Upload, X, Check, FileText } from "lucide-react"
import { importCandidates } from "../services/api"

export default function ImportCandidates({ onImportSuccess, onCancel }) {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "text/csv") {
        setFile(droppedFile)
        setError(null)
      } else {
        setError("Please upload a CSV file")
      }
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === "text/csv") {
        setFile(selectedFile)
        setError(null)
      } else {
        setError("Please upload a CSV file")
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const result = await importCandidates(file)
      setSuccess(true)
      setTimeout(() => {
        onImportSuccess(result)
      }, 1500)
    } catch (err) {
      setError("Failed to import candidates. Please check the file format and try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#222222] rounded-lg p-6 w-[500px] max-w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Import Candidates</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            <X />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg font-medium mb-2">Import Successful!</p>
            <p className="text-gray-400">Candidates have been added to your list.</p>
          </div>
        ) : (
          <>
            <div 
              className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center ${
                dragging ? "border-[#6E38E0] bg-[#6E38E0]/10" : "border-gray-600"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-6 h-6 text-[#6E38E0]" />
                  <span>{file.name}</span>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="mb-2">Drag and drop your CSV file here</p>
                  <p className="text-gray-400 text-sm mb-4">or</p>
                  <label className="bg-[#6E38E0] text-white py-2 px-4 rounded-md cursor-pointer">
                    Browse Files
                    <input 
                      type="file" 
                      accept=".csv" 
                      className="hidden" 
                      onChange={handleFileChange} 
                    />
                  </label>
                </>
              )}
            </div>

            {error && (
              <div className="text-red-500 text-sm mb-4">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button 
                onClick={handleUpload}
                disabled={!file || isUploading}
                className={`flex-1 bg-gradient-to-r from-[#6E38E0] to-[#FF5F36] text-white py-2 px-4 rounded-md ${
                  (!file || isUploading) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isUploading ? "Uploading..." : "Import Candidates"}
              </button>
              <button 
                onClick={onCancel}
                className="bg-[#333333] text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-400">
              <p>CSV file should contain the following columns:</p>
              <p className="font-mono text-xs mt-1">name, avatar, rating, stage, role, files, email, phone, experience</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}