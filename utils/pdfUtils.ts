export async function calculatePDFHash(pdfBuffer: ArrayBuffer): Promise<string> {
    try {
      const uint8Array = new Uint8Array(pdfBuffer);
      const hashBuffer = await crypto.subtle.digest('SHA-256', uint8Array);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (error) {
      console.error('Error calculating PDF hash:', error);
      throw new Error('Failed to calculate PDF hash');
    }
  }