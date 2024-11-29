import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { verifyCertificate } from '@/utils/signatureUtils';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('certificate') as File;

    if (!file) {
      return NextResponse.json(
        { message: 'No certificate file provided' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer);
    
    // Extract metadata from PDF
    const metadata = pdfDoc.getTitle(); // Assuming we stored certificate data in PDF title
    if (!metadata) {
      throw new Error('No certificate metadata found in PDF');
    }

    // Parse the metadata
    const certificateData = JSON.parse(metadata);
    
    // Extract signature
    const signature = certificateData.signature;
    if (!signature) {
      throw new Error('No signature found in certificate');
    }

    // Verify the certificate
    const isValid = await verifyCertificate(certificateData.data, signature);

    return NextResponse.json({
      isValid,
      details: {
        certificateData: certificateData.data,
        verificationDate: new Date().toISOString(),
        signaturePresent: true,
      }
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    return NextResponse.json(
      { 
        isValid: false,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          verificationDate: new Date().toISOString(),
        }
      },
      { status: 200 } // Still return 200 but with isValid: false
    );
  }
}
