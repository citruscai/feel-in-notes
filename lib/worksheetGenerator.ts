import React from 'react';
import { pdf } from '@react-pdf/renderer';
import SimpleTemplate from '@/components/ui/worksheetTemplates/SimpleTemplate';

export const generatePDF = async (jsonData: any, level: string, includeAnswers = false) => {
  const element = React.createElement(SimpleTemplate, { jsonData, includeAnswers });
  const pdfDoc = pdf(element);
  const blob = await pdfDoc.toBlob();
  return blob;
};
