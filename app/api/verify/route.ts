import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { verifySignatureServer } from '@/utils/serverVerificationUtils';

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
    
    // Get metadata from PDF title
    const title = pdfDoc.getTitle();
    
    if (!title) {
      return NextResponse.json({
        isValid: false,
        details: {
          error: 'No certificate metadata found in PDF',
          verificationDate: new Date().toISOString(),
        }
      });
    }

    try {
      // Parse the metadata from the title
      const certificateInfo = JSON.parse(title);
      const { data, signature } = certificateInfo;

      if (!signature) {
        return NextResponse.json({
          isValid: false,
          details: {
            error: 'No signature found in certificate',
            verificationDate: new Date().toISOString(),
          }
        });
      }

      // Verify using server-side verification
      const isValid = await verifySignatureServer(
        data,
        signature,
        process.env.NEXT_PUBLIC_CERTIFICATE_PUBLIC_KEY!
      );

      return NextResponse.json({
        isValid,
        details: {
          certificateData: data,
          verificationDate: new Date().toISOString(),
          signaturePresent: true,
          signature: signature,
        }
      });

    } catch (parseError) {
      console.error('Error parsing certificate metadata:', parseError);
      return NextResponse.json({
        isValid: false,
        details: {
          error: 'Invalid certificate metadata format',
          verificationDate: new Date().toISOString(),
        }
      });
    }

  } catch (error) {
    console.error('Certificate verification error:', error);
    return NextResponse.json({ 
      isValid: false,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        verificationDate: new Date().toISOString(),
      }
    });
  }
}