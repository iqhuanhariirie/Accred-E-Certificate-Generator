"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from 'react-hot-toast';

interface DownloadCertificateButtonProps {
  onDownload: () => Promise<{ pdfBlob: Blob; hash: string }>;
  filename: string;
}

const DownloadCertificateButton = ({
  onDownload,
  filename,
}: DownloadCertificateButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    const downloadToast = toast.loading('Generating certificate...');
    setIsDownloading(true);
    try {
      const result = await onDownload();
      const { pdfBlob, hash } = result;
      
      // Log download details
      console.log('Certificate download details:', {
        filename: `${filename}.pdf`,
        hash,
        timestamp: new Date().toISOString(),
        pdfSize: pdfBlob.size,
      });
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Certificate downloaded successfully!", {
        id: downloadToast
      });
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error("Failed to download certificate. Please try again.", {
        id: downloadToast
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className="w-full sm:w-auto"
    >
      {isDownloading ? (
        <>
          <span className="animate-spin mr-2">◌</span>
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Download Certificate
        </>
      )}
    </Button>
  );
};

export default DownloadCertificateButton;