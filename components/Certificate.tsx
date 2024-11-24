"use client";

import { fetchImageSize } from "@/utils/fetchImageSize";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { fetchDominantColorFromImage } from "@/utils/fetchDominantColorFromImage";
import { getTextColor } from "@/utils/getTextColor";
import { Timestamp } from "firebase/firestore";
import QRCode from "qrcode";
import { prepareCertificateData, verifyCertificate } from "@/utils/signatureUtils";

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

  useEffect(() => {
    const initializeCertificate = async () => {
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
    return null;
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
    },
    text: {
      textAlign: "center",
      fontSize: 120 * scaleFactor,
      fontWeight: "bold",
      color: textColor,
    },
    verificationContainer: {
      position: "absolute",
      bottom: 20,
      right: 20,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
    },
    signatureText: {
      fontSize: 8 * scaleFactor,
      color: textColor,
      marginBottom: 5,
    },
    verificationStatusText: {
      fontSize: 8 * scaleFactor,
      color: textColor,
      marginBottom: 5,
      fontWeight: "bold",
    },
    qrCode: {
      width: 80 * scaleFactor,
      height: 80 * scaleFactor,
    },
    verificationText: {
      fontSize: 6 * scaleFactor,
      color: textColor,
      marginTop: 5,
    },
  });

  return (
    <Document>
      <Page size={[width, height]} style={styles.page}>
        <View style={styles.wrapper}>
          <Image src={certificateTemplate} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.text}>{guestName}</Text>
            <Text style={styles.text}>{studentID}</Text>
            <Text style={styles.text}>{course}</Text>
            <Text style={styles.text}>{part}</Text>
            <Text style={styles.text}>{group}</Text>
            <Text style={styles.text}>
              {eventDate.toDate().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
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
};

export default Certificate;
