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

    // First, load PDF and get metadata
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

      // Get PDF data without metadata
      const strippedPdf = await PDFDocument.create();
      const [page] = await strippedPdf.copyPages(pdfDoc, [0]);
      strippedPdf.addPage(page);

      // Save with consistent options
      const strippedPdfBytes = await strippedPdf.save({
        useObjectStreams: false,
        addDefaultPage: false,
      });

      // Calculate hash of stripped PDF
      const currentHash = await calculatePDFHash(strippedPdfBytes);

      console.log('Verification details:', {
        storedHash,
        currentHash,
        originalSize: buffer.byteLength,
        strippedSize: strippedPdfBytes.byteLength,
        hasMetadata: !!title,
        metadataLength: title?.length ?? 0,
        metadata: {
          ...metadata,
          signature: signature ? `${signature.slice(0, 8)}...${signature.slice(-8)}` : null
        }
      });

      // Verify signature
      const isSignatureValid = signature ? 
        await verifySignatureServer(data, signature, process.env.NEXT_PUBLIC_CERTIFICATE_PUBLIC_KEY!) :
        false;

      return NextResponse.json({
        isValid: isSignatureValid && storedHash === currentHash,
        details: {
          certificateData: data,
          verificationDate: new Date().toISOString(),
          signaturePresent: !!signature,
          signature: signature,
          contentIntegrity: {
            isValid: storedHash === currentHash,
            storedHash,
            currentHash,
            originalSize: buffer.byteLength,
            strippedSize: strippedPdfBytes.byteLength,
            message: storedHash === currentHash 
              ? 'PDF content is unchanged' 
              : 'PDF has been modified'
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