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
import { useEffect, useState, useRef } from "react";
import { fetchDominantColorFromImage } from "@/utils/fetchDominantColorFromImage";
import { getTextColor } from "@/utils/getTextColor";
import { Timestamp } from "firebase/firestore";
import QRCode from "qrcode";
import { prepareCertificateData, verifyCertificate } from "@/utils/signatureUtils";
import { calculatePDFHash } from '@/utils/pdfUtils';

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

const Certificate = ({
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
}: CertificateProps) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [backgroundColor, setBackgroundColor] = useState({ r: 0, g: 0, b: 0 });
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfHash, setPdfHash] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingHash, setIsGeneratingHash] = useState(false);
  const documentRef = useRef<any>(null);

  // Helper function to wait for image loading
  const waitForImageLoad = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = src;
    });
  };

  const generatePDFWithoutMetadata = async (size: { width: number; height: number }, textColorValue: string, qrCode: string) => {

    // Wait for images to load
    try {
      await Promise.all([
        waitForImageLoad(certificateTemplate),
        waitForImageLoad(qrCode)
      ]);
      const docStyles = StyleSheet.create({
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
          fontSize: Math.min(60 * (Math.min(size.width, size.height) / 1500), 24),
          fontWeight: "bold",
          color: textColorValue,
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
          fontSize: Math.min(8 * (Math.min(size.width, size.height) / 1500), 12),
          color: textColorValue,
          marginBottom: 5,
        },
        verificationStatusText: {
          fontSize: Math.min(8 * (Math.min(size.width, size.height) / 1500), 12),
          color: textColorValue,
          marginBottom: 5,
          fontWeight: "bold",
        },
        qrCode: {
          width: Math.min(120 * (Math.min(size.width, size.height) / 1500), 150),
          height: Math.min(120 * (Math.min(size.width, size.height) / 1500), 150),
        },
        verificationText: {
          fontSize: Math.min(10 * (Math.min(size.width, size.height) / 1500), 14),
          color: textColorValue,
          marginTop: 5,
        },
      });
  
      const doc = (
        <Document>
          <Page size={[size.width, size.height]} style={docStyles.page}>
            <View style={docStyles.wrapper}>
              <Image src={certificateTemplate} style={docStyles.image} />
              <View style={docStyles.textContainer}>
                <View style={{ marginBottom: 20 }}>
                  <Text style={docStyles.text}>{guestName}</Text>
                </View>
                <View style={{ marginBottom: 20 }}>
                  <Text style={docStyles.text}>{studentID}</Text>
                </View>
                <View style={{ marginBottom: 20 }}>
                  <Text style={docStyles.text}>{course}</Text>
                </View>
                {part && (
                  <View style={{ marginBottom: 20 }}>
                    <Text style={docStyles.text}>Part {part}</Text>
                  </View>
                )}
                {group && (
                  <View style={{ marginBottom: 20 }}>
                    <Text style={docStyles.text}>{group}</Text>
                  </View>
                )}
                <View style={{ marginBottom: 20 }}>
                  <Text style={docStyles.text}>
                    {eventDate.toDate().toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              </View>
              <View style={docStyles.verificationContainer}>
                {signature && (
                  <>
                    <Text style={docStyles.verificationStatusText}>
                      Status: {isVerified ? "✓ Verified" : "⚠ Verification Pending"}
                    </Text>
                    <Text style={docStyles.signatureText}>
                      Digital Signature: {signature.slice(0, 8)}...{signature.slice(-8)}
                    </Text>
                  </>
                )}
                <Image src={qrCodeUrl} style={docStyles.qrCode} />
                <Text style={docStyles.verificationText}>
                  Scan to verify certificate authenticity
                </Text>
              </View>
            </View>
          </Page>
        </Document>
      );
      return await pdf(doc).toBlob();
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
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

        //Preload images
        await Promise.all([
          waitForImageLoad(certificateTemplate),
          waitForImageLoad(qrCode)
        ]);

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

          // Generate PDF without metadata and calculate hash
          const textColor = getTextColor(color.r, color.g, color.b);
          try {
            const pdfBlob = await generatePDFWithoutMetadata(size, textColor, qrCode);
            const arrayBuffer = await pdfBlob.arrayBuffer();
            const hash = await calculatePDFHash(arrayBuffer);
            setPdfHash(hash);
          } catch (error) {
            console.error('Error generating PDF hash:', error);
          }
        }
      } catch (error) {
        console.error('Error in certificate initialization:', error);
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


  // Create the metadata object with hash
  const certificateMetadata = {
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
    pdfHash: pdfHash,
    version: "1.0"
  };

  

  // Create document component with metadata
  const documentWithMetadata = (
    <Document
      title={JSON.stringify(certificateMetadata)}
      author="UITMKT-E-Certificate-Generator"
      creator="UITMKT-E-Certificate-Generator"
      producer="UITMKT-E-Certificate-Generator"
      ref={documentRef}
    >
      <Page size={[width, height]} style={styles.page}>
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
      </Page>
    </Document>
  );

  if (previewMode) {
    return (
      <PDFViewer width="100%" height="600px">
        {documentWithMetadata}
      </PDFViewer>
    );
  }

  return documentWithMetadata;
};

export default Certificate;
