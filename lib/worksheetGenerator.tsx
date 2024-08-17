import React from 'react';
import SimpleTemplate from '@/components/ui/worksheetTemplates/SimpleTemplate';
import { pdf, Document} from '@react-pdf/renderer';
import { GuidedNotesJSON } from '@/lib/types';


export const generatePDF = async (guidedNotesJSON: GuidedNotesJSON, level: string, includeAnswers = false): Promise<Blob> => {
  const element = (
    <Document>
      <SimpleTemplate guidedNotesJSON={guidedNotesJSON} includeAnswers={includeAnswers} />
    </Document>
  );
  const pdfDoc = pdf();
  pdfDoc.updateContainer(element);
  const blob = await pdfDoc.toBlob();
  return blob;
};
