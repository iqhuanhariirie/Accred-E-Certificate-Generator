import { NextRequest, NextResponse } from 'next/server';
import { signWithPrivateKey } from '@/utils/serverCryptoUtils';
import { Guest } from '@/utils/uploadToFirestore';
import { Timestamp } from 'firebase/firestore';
import { objectToArrayBuffer } from '@/utils/cryptoUtils';

interface CertificateData extends Guest {
  eventId: string;
  eventDate: string;
  certificateTemplate: string;
  timestamp: number;
}

export async function POST(request: NextRequest) {
  try {
    const data: CertificateData = await request.json();
    
    console.log('Signing data structure:', JSON.stringify(data, null, 2));
    console.log('Data buffer:', new TextDecoder().decode(objectToArrayBuffer(data)));

    if (!process.env.CERTIFICATE_PRIVATE_KEY) {
      throw new Error('Private key not configured on server');
    }

    const signature = await signWithPrivateKey(
      process.env.CERTIFICATE_PRIVATE_KEY,
      data
    );

    return NextResponse.json({ signature });
  } catch (error) {
    console.error('Error in sign API:', error);
    return NextResponse.json(
      { error: 'Failed to sign certificate' },
      { status: 500 }
    );
  }
}
