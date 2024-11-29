"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from 'react-hot-toast';

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    details: any;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setVerificationResult(null);
    }
  };

  const handleVerification = async () => {
    if (!file) {
      toast.error('Please select a certificate file');
      return;
    }

    setVerifying(true);
    try {
      const formData = new FormData();
      formData.append('certificate', file);

      const response = await fetch('/api/verify', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Verification failed');
      }

      setVerificationResult(result);
      if (result.isValid) {
        toast.success('Certificate verified successfully!');
      } else {
        toast.error('Invalid certificate');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to verify certificate");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Certificate Verification</CardTitle>
          <CardDescription className="text-center">
            Upload a certificate to verify its authenticity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-md">
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
            <Button
              onClick={handleVerification}
              disabled={!file || verifying}
              className="w-full max-w-md"
            >
              {verifying ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Verify Certificate
                </div>
              )}
            </Button>
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <div className="space-y-4">
              <Alert
                variant={verificationResult.isValid ? "success" : "destructive"}
              >
                <div className="flex items-center gap-3">
                  {verificationResult.isValid ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  <div>
                    <AlertTitle>
                      {verificationResult.isValid
                        ? "Valid Certificate"
                        : "Invalid Certificate"}
                    </AlertTitle>
                    <AlertDescription>
                      {verificationResult.isValid
                        ? "This certificate is authentic and has not been tampered with."
                        : "This certificate could not be verified or may have been tampered with."}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>

              {/* Verification Details */}
              {verificationResult.details && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Verification Details</h3>
                  <div className="space-y-2">
                    <div className="p-4 bg-muted rounded-lg">
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(verificationResult.details, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
