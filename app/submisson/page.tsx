"use client";

import React, { useState, useCallback, DragEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SubmissionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  const handleFileProcessing = useCallback((file: File | undefined) => {
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setMessage({ type: 'success', text: `"${file.name}" is ready for upload.` });
    } else {
      setSelectedFile(null);
      setMessage({ type: 'error', text: "Please upload a PDF file." });
    }
  }, []);

  const handleDragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // Set drop effect to copy
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFileProcessing(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }, [handleFileProcessing]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileProcessing(event.target.files?.[0]);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      // Here you would typically handle the file upload, e.g., send it to an API
      console.log("Submitting file:", selectedFile.name);
      setMessage({ type: 'info', text: `Uploading "${selectedFile.name}"... (This is a placeholder action)` });
      // Simulate upload success
      setTimeout(() => {
        setMessage({ type: 'success', text: `"${selectedFile.name}" has been uploaded successfully.` });
        setSelectedFile(null); // Clear selected file after successful upload
      }, 2000);
    } else {
      setMessage({ type: 'error', text: "Please select a PDF file to submit." });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">PDF Submission</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed p-8 text-center rounded-lg transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            }`}
          >
            <input
              id="file-upload-drag-drop"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden" // Hide the default input
            />
            <label htmlFor="file-upload-drag-drop" className="cursor-pointer block w-full h-full">
              {isDragActive ? (
                <p className="text-blue-600">Drop the PDF here ...</p>
              ) : (
                <p className="text-gray-600">Drag 'n' drop a PDF file here, or click to select one</p>
              )}
            </label>
            {selectedFile && (
              <p className="mt-2 text-green-600 font-medium">Selected file: {selectedFile.name}</p>
            )}
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-md text-center ${
              message.type === 'success' ? 'bg-green-100 text-green-800' :
              message.type === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {message.text}
            </div>
          )}

          <div className="my-4 text-center text-gray-500">OR</div>

          <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
            <Label htmlFor="pdf-upload">Upload PDF</Label>
            <Input id="pdf-upload" type="file" accept="application/pdf" onChange={handleFileChange} />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full mt-6"
            disabled={!selectedFile}
          >
            Submit PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
