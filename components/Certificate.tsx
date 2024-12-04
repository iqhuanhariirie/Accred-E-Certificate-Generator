"use client";

import { fetchImageSize } from "@/utils/fetchImageSize";
import {
  Document,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { fetchDominantColorFromImage } from "@/utils/fetchDominantColorFromImage";
import { getTextColor } from "@/utils/getTextColor";
import { Timestamp } from "firebase/firestore";
import QRCode from "qrcode";
import { prepareCertificateData, verifyCertificate } from "@/utils/signatureUtils";
import { calculatePDFHash } from '@/utils/pdfUtils';
import { PDFDocument } from 'pdf-lib';



interface CertificateProps {
  eventDate: Timestamp;
  certificateTemplate: string;
  guestName: string;
  studentID: string;
  course: string;
  part: number;
  group: string;
  signature?: string;
  eventId: string;
  certId: string;
  previewMode?: boolean;
}
// Add export interface for ref methods
export interface CertificateRef {
  generatePDFWithHash: () => Promise<{ pdfBlob: Blob; hash: string }>;
}

const Certificate = forwardRef<CertificateRef, CertificateProps>(({
  eventDate,
  certificateTemplate,
  guestName,
  studentID,
  course,
  part,
  group,
  signature,
  eventId,
  certId,
  previewMode = false,
}, ref) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [backgroundColor, setBackgroundColor] = useState({ r: 0, g: 0, b: 0 });
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfHash, setPdfHash] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingHash, setIsGeneratingHash] = useState(false);
  const documentRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    generatePDFWithHash
  }));

  const createDocumentContent = (styles: any) => (
    <View style={styles.wrapper}>
          <Image src={certificateTemplate} style={styles.image} />
          <View style={styles.textContainer}>
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.text}>{guestName}</Text>
            </View>
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.text}>{studentID}</Text>
            </View>
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.text}>{course}</Text>
            </View>
            {part && (
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.text}>Part {part}</Text>
              </View>
            )}
            {group && (
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.text}>{group}</Text>
              </View>
            )}
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.text}>
                {eventDate.toDate().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>

          <View style={styles.verificationContainer}>
            {signature && (
              <>
                <Text style={styles.verificationStatusText}>
                  Status: {isVerified ? "✓ Verified" : "⚠ Verification Pending"}
                </Text>
                <Text style={styles.signatureText}>
                  Digital Signature: {signature.slice(0, 8)}...{signature.slice(-8)}
                </Text>
              </>
            )}
            <Image src={qrCodeUrl} style={styles.qrCode} />
            <Text style={styles.verificationText}>
              Scan to verify certificate authenticity
            </Text>
          </View>
        </View>
  );

  // Generate basic PDF without metadata (for hash calculation)
  const generateBasicPDF = async () => {
    const textColor = getTextColor(backgroundColor.r, backgroundColor.g, backgroundColor.b);
    const doc = (
      <Document>
        <Page size={[imageSize.width, imageSize.height]} style={styles.page}>
          {createDocumentContent(styles)}
        </Page>
      </Document>
    );
    return await pdf(doc).toBlob();
  };

  // Generate final PDF with metadata
  const generateFinalPDF = async (hash: string) => {
    const metadata = {
      data: {
        name: guestName,
        studentID: studentID,
        course: course,
        part: part,
        group: group,
        eventId: eventId,
        eventDate: eventDate.toDate().toISOString(),
        certificateTemplate: certificateTemplate
      },
      signature: signature,
      pdfHash: hash,
      version: "1.0"
    };

    const doc = (
      <Document
        title={JSON.stringify(metadata)}
        author="UITMKT-E-Certificate-Generator"
        creator="UITMKT-E-Certificate-Generator"
        producer="UITMKT-E-Certificate-Generator"
      >
        <Page size={[imageSize.width, imageSize.height]} style={styles.page}>
          {createDocumentContent(styles)}
        </Page>
      </Document>
    );
    return await pdf(doc).toBlob();
  };

  // Function to be called by parent component for download
  const generatePDFWithHash = async () => {
    setIsGeneratingHash(true);
    try {
      // 1. Generate initial PDF with react-pdf
      console.log('Starting PDF generation...');
      const doc = (
        <Document>
          <Page size={[imageSize.width, imageSize.height]} style={styles.page}>
            {createDocumentContent(styles)}
          </Page>
        </Document>
      );
      
      const initialPdfBlob = await pdf(doc).toBlob();
      const initialPdfBytes = await initialPdfBlob.arrayBuffer();

      console.log('Initial PDF generation details:', {
        stage: 'initial',
        size: initialPdfBytes.byteLength,
      });
      
      // 2. Create standardized PDF
      const basicDoc = await PDFDocument.create();
      const tempDoc = await PDFDocument.load(initialPdfBytes);
      const [page] = await basicDoc.copyPages(tempDoc, [0]);
      basicDoc.addPage(page);
      
      // Save with deterministic options
      const basicPdfBytes = await basicDoc.save({
        useObjectStreams: false,
        addDefaultPage: false,
        updateFieldAppearances: false
      });
      
      // Calculate hash of standardized PDF
      const beforeMetadatahash = await calculatePDFHash(basicPdfBytes.buffer);

      console.log('Basic PDF generation details:', {
        stage: 'standardized',
        size: basicPdfBytes.byteLength,
        beforeMetadatahash,
      });
  
      // Create final PDF with metadata
      const finalDoc = await PDFDocument.load(basicPdfBytes);
      const metadata = {
        data: {
          name: guestName,
          studentID: studentID,
          course: course,
          part: part,
          group: group,
          eventId: eventId,
          eventDate: eventDate.toDate().toISOString(),
          certificateTemplate: certificateTemplate
        },
        signature: signature,
        pdfHash: beforeMetadatahash,
        version: "1.0"
      };
  
      finalDoc.setTitle(JSON.stringify(metadata));
      const finalPdfBytes = await finalDoc.save({
        useObjectStreams: false,
        addDefaultPage: false,
        updateFieldAppearances: false
      });

      // Calculate hash of final PDF (with metadata)
    const finalHash = await calculatePDFHash(finalPdfBytes);

      console.log('Final PDF generation details:', {
        stage: 'final',
        initialSize: initialPdfBytes.byteLength,
        basicSize: basicPdfBytes.byteLength,
        finalSize: finalPdfBytes.byteLength,
        beforeMetadatahash,

        finalHash,
        metadata: {
          ...metadata,
          signature: signature ? `${signature.slice(0, 8)}...${signature.slice(-8)}` : null
        }
      });
  
      return { 
        pdfBlob: new Blob([finalPdfBytes], { type: 'application/pdf' }), 
        hash: finalHash 
      };
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    } finally {
      setIsGeneratingHash(false);
    }
  };

  useEffect(() => {
    const initializeCertificate = async () => {
      try {
        setIsLoading(true);
        const size = await fetchImageSize(certificateTemplate);
        setImageSize(size);

        const color = await fetchDominantColorFromImage(certificateTemplate);
        setBackgroundColor(color);

        const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/event/${eventId}/certificate/${certId}`;
        const qrCode = await QRCode.toDataURL(verificationUrl);
        setQrCodeUrl(qrCode);

        if (signature) {
          const certificateData = prepareCertificateData(
            guestName,
            studentID,
            course,
            part,
            group,
            eventId,
            eventDate.toDate(),
            certificateTemplate
          );
          const verified = await verifyCertificate(certificateData, signature);
          setIsVerified(verified);
        }
      } catch (error) {
        console.error('Error in certificate initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCertificate();
  }, [
    certificateTemplate,
    eventId,
    certId,
    signature,
    guestName,
    studentID,
    course,
    part,
    group,
    eventDate,
  ]);
  

  if (imageSize.width === 0 || imageSize.height === 0 || !qrCodeUrl) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const { width, height } = imageSize;
  const scaleFactor = Math.min(width, height) / 1500;
  const textColor = getTextColor(
    backgroundColor.r,
    backgroundColor.g,
    backgroundColor.b
  );

  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#ffffff",
    },
    wrapper: {
      flex: 1,
      position: "relative",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
    textContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    },
    text: {
      textAlign: "center",
      fontSize: Math.min(60 * scaleFactor, 24),
      fontWeight: "bold",
      color: textColor,
      marginBottom: "10px",
    },
    verificationContainer: {
      position: "absolute",
      bottom: 20,
      right: 20,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      padding: "10px",
    },
    signatureText: {
      fontSize: Math.min(8 * scaleFactor, 12),
      color: textColor,
      marginBottom: 5,
    },
    verificationStatusText: {
      fontSize: Math.min(8 * scaleFactor, 12),
      color: textColor,
      marginBottom: 5,
      fontWeight: "bold",
    },
    qrCode: {
      width: Math.min(120 * scaleFactor, 150),
      height: Math.min(120 * scaleFactor, 150),
    },
    verificationText: {
      fontSize: Math.min(10 * scaleFactor, 14),
      color: textColor,
      marginTop: 5,
    },
  });


  if (previewMode) {
    return (
      <PDFViewer width="100%" height="600px">
        <Document>
          <Page size={[imageSize.width, imageSize.height]} style={styles.page}>
            {createDocumentContent(styles)}
          </Page>
        </Document>
      </PDFViewer>
    );
  }

  return null;
});



export default Certificate;
