import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type PDFUrls = {
  guidedNotesUrl: string;
  solutionsUrl: string;
};

const ViewWorksheet: React.FC<{ id: string }> = ({ id }) => {
  const [pdfUrls, setPdfUrls] = useState<PDFUrls | null>(null);

  useEffect(() => {
    const fetchPdfUrls = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/worksheets/${id}/urls`);
        const data = await response.json();
        setPdfUrls(data);
      } catch (error) {
        console.error("Failed to fetch PDF URLs", error);
      }
    };
    fetchPdfUrls();
  }, [id]);

  if (!pdfUrls) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen p-8">
      <header className="bg-gray-900 text-white p-4">
        <h1 className="text-2xl font-bold">Worksheet</h1>
      </header>
      <div className="flex-1 overflow-auto">
        <Document file={pdfUrls.guidedNotesUrl}>
          <Page pageNumber={1} />
        </Document>
      </div>
      <div className="space-x-4 mt-4">
        <Button as="a" href={pdfUrls.guidedNotesUrl} download="guided-notes.pdf" variant="default">
          Download Guided Notes
        </Button>
        <Button as="a" href={pdfUrls.solutionsUrl} download="solutions.pdf" variant="default">
          Download Solutions
        </Button>
      </div>
    </div>
  );
};

export default ViewWorksheet;
