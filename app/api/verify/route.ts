import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { calculatePDFHash } from '@/utils/pdfUtils';
import { verifySignatureServer } from '@/utils/serverVerificationUtils';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('certificate') as File;
    
    if (!file) {
      return NextResponse.json({
        isValid: false,
        details: { error: 'No certificate file provided' }
      });
    }
    
    const buffer = await file.arrayBuffer();

    // Get metadata from full version
    const fullPdfDoc = await PDFDocument.load(buffer);
    const title = fullPdfDoc.getTitle();
    
    if (!title) {
      return NextResponse.json({
        isValid: false,
        details: { error: 'No certificate metadata found' }
      });
    }

    try {
      const metadata = JSON.parse(title);
      const { data, signature, pdfHash: storedHash } = metadata;

      const originalSize = buffer.byteLength;
      // Calculate hash of original content
      const currentHash = await calculatePDFHash(buffer);

      console.log('Verification details:', {
        storedHash,
        currentHash,
        originalPdfSize: originalSize,
        hasMetadata: !!title,
        metadataLength: title?.length ?? 0
      });

      console.log('Stored hash:', storedHash);
      console.log('Current hash:', currentHash);

      // Verify signature
      const isSignatureValid = signature ? 
        await verifySignatureServer(data, signature, process.env.NEXT_PUBLIC_CERTIFICATE_PUBLIC_KEY!) :
        false;

      // Compare hashes
      const isPdfValid = storedHash === currentHash;

      return NextResponse.json({
        isValid: isSignatureValid && (storedHash ? isPdfValid : true),
        details: {
          certificateData: data,
          verificationDate: new Date().toISOString(),
          signaturePresent: !!signature,
          signature: signature,
          contentIntegrity: {
            isValid: storedHash ? isPdfValid : false,
            storedHash,
            currentHash,
            message: storedHash === currentHash 
              ? (isPdfValid ? 'PDF content is unchanged' : 'PDF has been modified')
              : 'No content hash found'
          }
        }
      });
    } catch (parseError) {
      console.error('Metadata parsing error:', parseError);
      return NextResponse.json({
        isValid: false,
        details: { error: 'Invalid certificate metadata format' }
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({
      isValid: false,
      details: { error: 'Verification failed' }
    });
  }
}