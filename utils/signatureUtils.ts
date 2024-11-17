import { Timestamp } from 'firebase/firestore';
import { Guest } from './uploadToFirestore';
import { importPublicKey, objectToArrayBuffer } from './cryptoUtils';

interface CertificateData extends Guest {
  eventId: string;
  eventDate: string;
  certificateTemplate: string;
  timestamp: number;
}

export const prepareCertificateData = (
  guest: Guest,
  eventId: string,
  eventDate: Date,
  certificateTemplate: string
): CertificateData => {
  return {
    ...guest,
    eventId,
    eventDate: eventDate.toISOString(),
    certificateTemplate,
    timestamp: Date.now()
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
          guest,
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
    const publicKey = await importPublicKey(
      process.env.NEXT_PUBLIC_CERTIFICATE_PUBLIC_KEY!
    );

    const dataBuffer = objectToArrayBuffer(certificateData);
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

// Helper function to convert string to ArrayBuffer
function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
