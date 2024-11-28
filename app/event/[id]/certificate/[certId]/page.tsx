"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { RingLoader } from "@/components/RingLoader";
import { Timestamp } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { CheckCircle2, XCircle, FileCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Certificate from "@/components/Certificate";
import { verifyCertificate } from "@/utils/signatureUtils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface VerificationData {
  eventName: string;
  eventDate: Timestamp;
  participantName: string;
  studentId: string;
  course: string;
  group?: string;
  part?: number;
  signature?: string;
}

interface VerificationStep {
  title: string;
  description: string;
  status: 'pending' | 'success' | 'error' | 'loading';
  details: string | null;
}

export default function VerificationPage({ params }: { params: { id: string; certId: string } }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VerificationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [certificateTemplate, setCertificateTemplate] = useState<string>("");
  const [isVerified, setIsVerified] = useState(false);
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    {
      title: "Original Data",
      description: "Certificate data before hashing",
      status: 'pending',
      details: null
    },
    {
      title: "Data Hash",
      description: "SHA-256 hash of the certificate data",
      status: 'pending',
      details: null
    },
    {
      title: "Digital Signature",
      description: "Encrypted hash using private key",
      status: 'pending',
      details: null
    },
    {
      title: "Public Key Verification",
      description: "Using public key to decrypt signature",
      status: 'pending',
      details: null
    },
    {
      title: "Hash Comparison",
      description: "Comparing original and decrypted hashes",
      status: 'pending',
      details: null
    }
  ]);

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        const eventRef = doc(db, "events", params.id);
        const eventDoc = await getDoc(eventRef);

        if (!eventDoc.exists()) {
          setError("Event not found");
          setLoading(false);
          return;
        }

        const eventData = eventDoc.data();
        const participant = eventData.guestList.find(
          (guest: any) => guest.certId === params.certId
        );

        if (!participant) {
          setError("Certificate not found");
          setLoading(false);
          return;
        }

        setCertificateTemplate(eventData.certificateTemplate);

        const certificateData = {
          eventName: eventData.eventName,
          eventDate: eventData.eventDate,
          participantName: participant.name,
          studentId: participant.studentID,
          course: participant.course,
          group: participant.group,
          part: participant.part,
          signature: participant.signature,
        };

        setData(certificateData);

        if (participant.signature) {
          const verifyData = {
            name: participant.name,
            studentID: participant.studentID,
            course: participant.course,
            part: participant.part,
            group: participant.group,
            eventId: params.id,
            eventDate: eventData.eventDate.toDate().toISOString(),
            certificateTemplate: eventData.certificateTemplate
          };

          const verified = await verifyCertificate(verifyData, participant.signature, setVerificationSteps);
          setIsVerified(verified);
        }
      } catch (error) {
        console.error("Error fetching certificate data:", error);
        setError("Failed to fetch certificate data");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateData();
  }, [params.id, params.certId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <RingLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-destructive">
              Verification Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 pb-40">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Certificate Details</TabsTrigger>
          <TabsTrigger value="preview">Certificate Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          {data && (
            <Card className="mb-16">
              <CardHeader>
                <CardTitle className="text-center">Certificate Verification</CardTitle>
                <CardDescription className="text-center">
                  {data.eventName}
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-y-auto" 
              style={{ maxHeight: 'calc(100vh - 100px)' }}>
                {/* Certificate Details */}
                <div className="grid grid-cols-2 gap-4 text-sm mb-8">
                  <div className="font-semibold">Event Date:</div>
                  <div>{new Date(data.eventDate.seconds * 1000).toLocaleDateString()}</div>

                  <div className="font-semibold">Participant Name:</div>
                  <div>{data.participantName}</div>

                  <div className="font-semibold">Student ID:</div>
                  <div>{data.studentId}</div>

                  <div className="font-semibold">Course:</div>
                  <div>{data.course}</div>

                  {data.group && (
                    <>
                      <div className="font-semibold">Group:</div>
                      <div>{data.group}</div>
                    </>
                  )}

                  {data.part && (
                    <>
                      <div className="font-semibold">Part:</div>
                      <div>{data.part}</div>
                    </>
                  )}
                </div>

                {/* Digital Signature Verification Process */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-lg mb-4">Digital Signature Verification Process</h3>

                  {verificationSteps.map((step, index) => (
  <Alert 
    key={index} 
    variant={step.status === 'success' ? 'success' : 
            step.status === 'error' ? 'destructive' : 
            'default'}
    className="mb-4"
  >
    <div className="flex items-center gap-3">
      {step.status === 'success' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
      {step.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
      {step.status === 'pending' && <div className="h-5 w-5 rounded-full border-2 border-gray-300" />}
      {step.status === 'loading' && <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black" />}
      
      <div className="w-full">
        <AlertTitle>{step.title}</AlertTitle>
        <AlertDescription>{step.description}</AlertDescription>
        
        {step.details && (
          <div className="mt-2 p-2 bg-muted rounded-md text-xs font-mono overflow-x-auto">
            {step.details}
          </div>
        )}
      </div>
    </div>
  </Alert>
))}

                  {/* Final Verification Status */}
                  <Alert variant={isVerified ? "success" : "destructive"}>
                    <div className="mb-6">
                      {isVerified ? (
                        <FileCheck className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <div>
                        <AlertTitle>Final Verification Result</AlertTitle>
                        <AlertDescription>
                          {isVerified
                            ? "Certificate signature is valid and has not been tampered with."
                            : "Certificate signature is invalid or has been tampered with."
                          }
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="preview">
          <div className="w-full h-[calc(100vh-200px)]">
            {data && certificateTemplate && (
              <Certificate
                eventDate={data.eventDate}
                certificateTemplate={certificateTemplate}
                guestName={data.participantName}
                studentID={data.studentId}
                course={data.course}
                part={data.part || 0}
                group={data.group || ""}
                signature={data.signature}
                eventId={params.id}
                certId={params.certId}
                previewMode={true}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
