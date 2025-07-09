"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { File, Download, Trash2, ImageIcon } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export function UploadGrid() {
  const [uploads, setUploads] = useState<UploadedFile[]>([])

  useEffect(() => {
    // Load uploads from localStorage
    const savedUploads = JSON.parse(localStorage.getItem("uploads") || "[]")
    setUploads(savedUploads)
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const isImage = (type: string) => {
    return type.startsWith("image/")
  }

  const downloadFile = (file: UploadedFile) => {
    // TODO: Implement actual download logic
    console.log("Downloading file:", file)

    // Mock download
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const deleteFile = (fileId: string) => {
    // TODO: Implement actual delete logic
    console.log("Deleting file:", fileId)

    const updatedUploads = uploads.filter((file) => file.id !== fileId)
    setUploads(updatedUploads)
    localStorage.setItem("uploads", JSON.stringify(updatedUploads))
  }

  if (uploads.length === 0) {
    return (
      <div className="text-center py-12">
        <File className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No uploads yet</h3>
        <p className="text-gray-500">Upload some files to see them here.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {uploads.map((file) => (
        <Card key={file.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="aspect-square mb-3 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {isImage(file.type) ? (
                <img src={file.url || "/placeholder.svg"} alt={file.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500 uppercase">{file.type.split("/")[1] || "file"}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-sm truncate" title={file.name}>
                {file.name}
              </h3>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => downloadFile(file)} className="flex-1">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteFile(file.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
