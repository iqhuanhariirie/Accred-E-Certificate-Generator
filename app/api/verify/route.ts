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

    // Load PDF and get metadata
    const pdfDoc = await PDFDocument.load(buffer);
    const title = pdfDoc.getTitle();
    
    if (!title) {
      return NextResponse.json({
        isValid: false,
        details: { error: 'No certificate metadata found' }
      });
    }

    try {
      const metadata = JSON.parse(title);
      const { data, signature, pdfHash: storedHash } = metadata;

      // Calculate current hash of the PDF
      const currentHash = await calculatePDFHash(buffer);

      console.log('Verification details:', {
        stage: 'hash verification',
        storedHash,    // Reference hash from before metadata was added
        currentHash,   // Current hash of complete PDF
        fileSize: buffer.byteLength,
        hasMetadata: !!title,
        metadataLength: title?.length ?? 0,
        metadata: {
          ...metadata,
          signature: signature ? `${signature.slice(0, 8)}...${signature.slice(-8)}` : null
        }
      });

      // Verify signature of certificate data
      const isSignatureValid = signature ? 
        await verifySignatureServer(data, signature, process.env.NEXT_PUBLIC_CERTIFICATE_PUBLIC_KEY!) :
        false;

      return NextResponse.json({
        isValid: isSignatureValid,
        details: {
          certificateData: data,
          verificationDate: new Date().toISOString(),
          signaturePresent: !!signature,
          signature: signature,
          contentIntegrity: {
            referenceHash: storedHash,
            currentHash,
            message: isSignatureValid 
              ? 'Certificate data is authentic'
              : 'Certificate data has been tampered'
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