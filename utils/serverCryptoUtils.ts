import { createPublicKey, createPrivateKey, sign } from 'crypto';

export async function signWithPrivateKey(privateKeyPem: string, data: any): Promise<string> {
  try {
    // Parse the private key
    const privateKey = createPrivateKey({
      key: privateKeyPem,
      format: 'pem',
      type: 'pkcs8'
    });

    // Convert data to buffer
    const dataBuffer = Buffer.from(JSON.stringify(data));

    // Create signature
    const signature = sign('sha256', dataBuffer, {
      key: privateKey,
      dsaEncoding: 'ieee-p1363'
    });

    // Convert signature to base64
    return signature.toString('base64');
  } catch (error) {
    console.error('Error in server-side signing:', error);
    throw new Error('Failed to sign data on server');
  }
}
