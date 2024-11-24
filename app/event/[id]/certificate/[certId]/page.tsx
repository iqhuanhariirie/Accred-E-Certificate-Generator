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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Certificate from "@/components/Certificate";
import { Button } from "@/components/ui/button";

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

export default function VerificationPage({ params }: { params: { id: string; certId: string } }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VerificationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [certificateTemplate, setCertificateTemplate] = useState<string>("");
  const [zoom, setZoom] = useState(1);

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

        setData({
          eventName: eventData.eventName,
          eventDate: eventData.eventDate,
          participantName: participant.name,
          studentId: participant.studentID,
          course: participant.course,
          group: participant.group,
          part: participant.part,
          signature: participant.signature,
        });
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
    <div className="container mx-auto py-10 px-4">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Certificate Details</TabsTrigger>
          <TabsTrigger value="preview">Certificate Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          {data && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Certificate Verification</CardTitle>
                <CardDescription className="text-center">
                  {data.eventName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
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
                  
                  <div className="font-semibold">Verification Status:</div>
                  <div>
                    {data.signature ? (
                      <Badge variant="success">Valid Certificate</Badge>
                    ) : (
                      <Badge variant="destructive">Invalid Certificate</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="preview">
  <div className="w-full h-[1000px]"> {/* Match the height with PDFViewer */}
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