import { Timestamp } from 'firebase/firestore';
import { Guest } from './uploadToFirestore';
import { importPublicKey, objectToArrayBuffer } from './cryptoUtils';

export interface CertificateData {
  name: string;
  studentID: string;
  course: string;
  part: number;
  group: string;
  eventId: string;
  eventDate: string;
  certificateTemplate: string;
  
}

export const prepareCertificateData = (
  name: string,
  studentID: string,
  course: string,
  part: number,
  group: string,
  eventId: string,
  eventDate: Date,
  certificateTemplate: string
): CertificateData => {
  return {
    name,
    studentID,
    course,
    part,
    group,
    eventId,
    eventDate: eventDate.toISOString(),
    certificateTemplate,
    
  };
};

export const generateBulkSignatures = async (
  eventId: string,
  guestList: Guest[],
  eventDate: Date,
  certificateTemplate: string
): Promise<Guest[]> => {
  try {
    const signedGuests = await Promise.all(
      guestList.map(async (guest) => {
        const certificateData = prepareCertificateData(
          guest.name,
          guest.studentID,
          guest.course,
          guest.part,
          guest.group,
          eventId,
          eventDate,
          certificateTemplate
        );

        const signature = await signCertificate(certificateData);

        return {
          ...guest,
          signature,
          signatureTimestamp: Timestamp.now()
        };
      })
    );

    return signedGuests;
  } catch (error) {
    console.error('Error generating bulk signatures:', error);
    throw error;
  }
};

const signCertificate = async (certificateData: CertificateData): Promise<string> => {
  try {
    const response = await fetch('/api/sign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(certificateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to sign certificate');
    }

    const { signature } = await response.json();
    return signature;
  } catch (error) {
    console.error('Error signing certificate:', error);
    throw error;
  }
};

export const verifyCertificate = async (
  certificateData: CertificateData,
  signatureBase64: string
): Promise<boolean> => {
  try {
    const verificationData = {
      name: certificateData.name,
      studentID: certificateData.studentID,
      course: certificateData.course,
      part: certificateData.part,
      group: certificateData.group,
      eventId: certificateData.eventId,
      eventDate: certificateData.eventDate,
      certificateTemplate: certificateData.certificateTemplate
    };

    console.log('Verification data structure:', JSON.stringify(verificationData, null, 2));
    console.log('Verification data buffer:', new TextDecoder().decode(objectToArrayBuffer(verificationData)));

    const publicKey = await importPublicKey(
      process.env.NEXT_PUBLIC_CERTIFICATE_PUBLIC_KEY!
    );

    const dataBuffer = objectToArrayBuffer(verificationData);
    const signatureBuffer = str2ab(atob(signatureBase64));

    return await window.crypto.subtle.verify(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      publicKey,
      signatureBuffer,
      dataBuffer
    );
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
};

function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
