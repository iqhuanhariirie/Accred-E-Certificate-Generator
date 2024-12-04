import React from 'react';
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
          signatureTimestamp: Timestamp.now(),
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

interface VerificationStep {
  title: string;
  description: string;
  status: 'pending' | 'success' | 'error' | 'loading';
  details: string | null;
}

type SetVerificationSteps = React.Dispatch<React.SetStateAction<VerificationStep[]>>;

export const verifyCertificate = async (
  certificateData: CertificateData,
  signatureBase64: string,
  setVerificationSteps?: SetVerificationSteps
): Promise<boolean> => {
  try {
    // Step 1: Original Data
    setVerificationSteps?.(prev => prev.map((step, i) => 
      i === 0 ? { 
        ...step, 
        status: 'success',
        details: JSON.stringify(certificateData, null, 2)
      } : step
    ));

    // Step 2: Calculate Data Hash
    const dataBuffer = objectToArrayBuffer(certificateData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const originalHash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
    
    setVerificationSteps?.(prev => prev.map((step, i) => 
      i === 1 ? { 
        ...step, 
        status: 'success',
        details: `SHA-256 Hash: ${originalHash}`
      } : step
    ));

    // Step 3: Show Digital Signature

    const partialSignature = signatureBase64.length > 16 
      ? `${signatureBase64.slice(0, 8)}...${signatureBase64.slice(-8)}`
      : signatureBase64;
    setVerificationSteps?.(prev => prev.map((step, i) => 
      i === 2 ? { 
        ...step, 
        status: 'success',
        details: `Signature: ${partialSignature}`
      } : step
    ));

    // Step 4: Public Key Verification
    const publicKey = await importPublicKey(
      process.env.NEXT_PUBLIC_CERTIFICATE_PUBLIC_KEY!
    );

    setVerificationSteps?.(prev => prev.map((step, i) => 
      i === 3 ? { 
        ...step, 
        status: 'success',
        details: `Public Key: ${process.env.NEXT_PUBLIC_CERTIFICATE_PUBLIC_KEY!}`
      } : step
    ));

    // Step 5: Hash Comparison
    const signatureBuffer = str2ab(atob(signatureBase64));
    const isValid = await window.crypto.subtle.verify(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      publicKey,
      signatureBuffer,
      dataBuffer
    );

    setVerificationSteps?.(prev => prev.map((step, i) => 
      i === 4 ? { 
        ...step, 
        status: isValid ? 'success' : 'error',
        details: isValid 
          ? " Hashes match - Certificate is valid"
          : " Hashes do not match - Certificate is invalid"
      } : step
    ));

    return isValid;
  } catch (err) {
    console.error('Error verifying signature:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    setVerificationSteps?.(prev => prev.map(step => ({ 
      ...step, 
      status: 'error',
      details: `Error: ${errorMessage}`
    })));
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
