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
        details: {
          error: 'No certificate file provided',
          verificationDate: new Date().toISOString(),
        }
      });
    }
    
    // Load the PDF and get metadata
    const buffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer);
    const title = pdfDoc.getTitle();
    
    if (!title) {
      return NextResponse.json({
        isValid: false,
        details: {
          error: 'No certificate metadata found',
          verificationDate: new Date().toISOString(),
        }
      });
    }

    // Parse metadata
    try {
      const metadata = JSON.parse(title);
      const { data, signature, pdfHash: storedHash } = metadata;

      // Create clean PDF without metadata
      const pdfWithoutMetadata = await PDFDocument.load(buffer);
      pdfWithoutMetadata.setTitle(''); // Remove metadata
      const cleanPdfBytes = await pdfWithoutMetadata.save();

      // Calculate hash of clean PDF
      const currentHash = await calculatePDFHash(cleanPdfBytes);

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
            message: storedHash 
              ? (isPdfValid ? 'PDF content is unchanged' : 'PDF has been modified')
              : 'No content hash found'
          }
        }
      });
    } catch (parseError) {
      return NextResponse.json({
        isValid: false,
        details: {
          error: 'Invalid certificate metadata format',
          verificationDate: new Date().toISOString(),
        }
      });
    }

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({
      isValid: false,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        verificationDate: new Date().toISOString(),
      }
    });
  }
}