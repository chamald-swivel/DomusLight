"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  POExtractionService,
  type PODetails,
} from "@/lib/po-extraction-service";
import Link from "next/link";
import { FileUploadZone } from "@/components/molecules/file-upload-zone";
import { POHeaderDetails } from "@/components/molecules/po-header-details";
import { POFinancialSummary } from "@/components/molecules/po-financial-summary";
import { POItemsTable } from "@/components/molecules/po-items-table";

export default function UploadPOPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [poDetails, setPODetails] = useState<PODetails | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please select a PDF file");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
      setPODetails(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const details = await POExtractionService.extractPODetails(file);
      setPODetails(details);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to extract PO details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPODetails(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Upload Purchase Order</h1>
              <p className="text-muted-foreground">
                Upload a PDF to extract purchase order details
              </p>
            </div>
          </div>
        </div>

        {!poDetails && (
          <FileUploadZone
            file={file}
            loading={loading}
            error={error}
            onFileChange={handleFileChange}
            onUpload={handleUpload}
          />
        )}

        {poDetails && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={handleReset} variant="outline">
                Upload Another PO
              </Button>
            </div>

            <POHeaderDetails poDetails={poDetails} />
            <POFinancialSummary poDetails={poDetails} />
            <POItemsTable poDetails={poDetails} />
          </div>
        )}
      </div>
    </div>
  );
}
