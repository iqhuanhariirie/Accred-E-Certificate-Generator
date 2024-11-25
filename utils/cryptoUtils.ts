export async function importPublicKey(pemKey: string): Promise<CryptoKey> {
  try {
    // Remove PEM headers and whitespace
    const pemContents = pemKey
      .replace('-----BEGIN PUBLIC KEY-----', '')
      .replace('-----END PUBLIC KEY-----', '')
      .replace(/[\r\n\s]/g, '');

    // Convert base64 to buffer
    const binaryDer = str2ab(atob(pemContents));

    return await window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      true,
      ["verify"]
    );
  } catch (error) {
    console.error('Error importing public key:', error);
    throw new Error('Failed to import public key');
  }
}

// Helper function to convert string to ArrayBuffer
export function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export function objectToArrayBuffer(obj: any): ArrayBuffer {
  // Ensure consistent property ordering
  const orderedObj = {
    name: obj.name,
    studentID: obj.studentID,
    course: obj.course,
    part: obj.part,
    group: obj.group,
    eventId: obj.eventId,
    eventDate: obj.eventDate,
    certificateTemplate: obj.certificateTemplate
  };

  const str = JSON.stringify(orderedObj);
  return new TextEncoder().encode(str);
}
