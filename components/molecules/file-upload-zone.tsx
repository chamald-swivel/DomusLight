"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, FileText } from "lucide-react"

interface FileUploadZoneProps {
  file: File | null
  loading: boolean
  error: string | null
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUpload: () => void
}

export function FileUploadZone({ file, loading, error, onFileChange, onUpload }: FileUploadZoneProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload PDF</CardTitle>
        <CardDescription>Select a PDF file containing purchase order details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pdf-upload">PDF File</Label>
          <div className="flex gap-2">
            <Input id="pdf-upload" type="file" accept=".pdf" onChange={onFileChange} disabled={loading} />
            <Button onClick={onUpload} disabled={!file || loading} className="min-w-[120px]">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>
          {file && !loading && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
