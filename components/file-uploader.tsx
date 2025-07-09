"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, File, X } from "lucide-react";

interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
}

export function FileUploader() {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const uploadFiles = async () => {
        if (files.length === 0) return;

        setUploading(true);

        // TODO: Implement actual file upload logic
        console.log("Uploading files:", files);

        // Mock upload delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock successful upload
        const uploadedFiles: UploadedFile[] = files.map((file, index) => ({
            id: `file-${Date.now()}-${index}`,
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
        }));

        // Save to localStorage for demo purposes
        const existingUploads = JSON.parse(localStorage.getItem("uploads") || "[]");
        localStorage.setItem("uploads", JSON.stringify([...existingUploads, ...uploadedFiles]));

        setFiles([]);
        setUploading(false);

        alert("Files uploaded successfully!");
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Upload Files</CardTitle>
                <CardDescription>Drag and drop your files here or click to browse</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">Drop files here to upload</p>
                    <p className="text-sm text-gray-500 mb-4">or click to browse from your computer</p>
                    <input type="file" multiple onChange={handleFileSelect} className="hidden" id="file-upload" />
                    <Button asChild variant="outline">
                        <label htmlFor="file-upload" className="cursor-pointer">
                            Browse Files
                        </label>
                    </Button>
                </div>

                {files.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="font-medium">Selected Files:</h3>
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <File className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium">{file.name}</p>
                                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button onClick={uploadFiles} disabled={uploading} className="w-full">
                            {uploading ? "Uploading..." : `Upload ${files.length} file${files.length > 1 ? "s" : ""}`}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
