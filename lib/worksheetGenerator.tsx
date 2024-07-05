import React from 'react';
import SimpleTemplate from '@/components/ui/worksheetTemplates/SimpleTemplate';
import { pdf, Document} from '@react-pdf/renderer';
import { JsonData } from '@/lib/types';


export const generatePDF = async (jsonData: JsonData, level: string, includeAnswers = false): Promise<Blob> => {
  const element = (
    <Document>
      <SimpleTemplate jsonData={jsonData} includeAnswers={includeAnswers} />
    </Document>
  );
  const pdfDoc = pdf();
  pdfDoc.updateContainer(element);
  const blob = await pdfDoc.toBlob();
  return blob;
};
