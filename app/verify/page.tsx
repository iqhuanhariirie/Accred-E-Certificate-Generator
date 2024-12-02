"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from 'react-hot-toast';
import { sign } from 'crypto';

interface VerificationDetails {
  certificateData?: {
    name: string;
    studentID: string;
    course: string;
    part?: number;
    group?: string;
    eventId: string;
    eventDate: string;
    certificateTemplate: string;
  };
  verificationDate: string;
  signaturePresent?: boolean;
  signature?: string;
  error?: string;
}

interface VerificationResponse {
  isValid: boolean;
  details: VerificationDetails;
}

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null);

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

      const result: VerificationResponse = await response.json();

      setVerificationResult(result);
      if (result.isValid) {
        toast.success('Certificate verified successfully!');
      } else {
        toast.error(result.details.error || 'Invalid certificate');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to verify certificate");
    } finally {
      setVerifying(false);
    }
  };

  const renderCertificateDetails = (details: VerificationDetails) => {
    if (!details.certificateData) return null;

    const { certificateData } = details;
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Certificate Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="font-semibold">Name:</div>
          <div>{certificateData.name}</div>

          <div className="font-semibold">Student ID:</div>
          <div>{certificateData.studentID}</div>

          <div className="font-semibold">Course:</div>
          <div>{certificateData.course}</div>

          {certificateData.part && (
            <>
              <div className="font-semibold">Part:</div>
              <div>{certificateData.part}</div>
            </>
          )}

          {certificateData.group && (
            <>
              <div className="font-semibold">Group:</div>
              <div>{certificateData.group}</div>
            </>
          )}

          <div className="font-semibold">Event Date:</div>
          <div>{new Date(certificateData.eventDate).toLocaleDateString()}</div>

          <div className="font-semibold">Verification Date:</div>
          <div>{new Date(details.verificationDate).toLocaleDateString()}</div>

          {/* Digital Signature from metadata */}
          <div className="font-semibold">Digital Signature:</div>
          <div>
          {details.signature ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="font-mono text-xs">
                {`${details.signature.slice(0, 8)}...${details.signature.slice(-8)}`}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span>Not found in metadata</span>
            </div>
          )}
        </div>
        
        </div>
      </div>
    );
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
                        : verificationResult.details.error || "This certificate could not be verified."}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>

              {/* Certificate Details */}
              {verificationResult.isValid && renderCertificateDetails(verificationResult.details)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}