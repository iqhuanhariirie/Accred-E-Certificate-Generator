import { createPublicKey, verify } from 'crypto';
import { CertificateData } from './signatureUtils';

export async function verifySignatureServer(
  data: CertificateData,
  signatureBase64: string,
  publicKeyPem: string
): Promise<boolean> {
  try {
    // Create public key object
    const publicKey = createPublicKey({
      key: publicKeyPem,
      format: 'pem',
      type: 'spki'
    });

    // Convert data to buffer
    const dataBuffer = Buffer.from(JSON.stringify(data));

    // Convert base64 signature to buffer
    const signatureBuffer = Buffer.from(signatureBase64, 'base64');

    // Verify signature
    return verify(
      'sha256',
      dataBuffer,
      {
        key: publicKey,
        dsaEncoding: 'ieee-p1363'
      },
      signatureBuffer
    );
  } catch (error) {
    console.error('Error verifying signature on server:', error);
    throw new Error('Failed to verify signature on server');
  }
}