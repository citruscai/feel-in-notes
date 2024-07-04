/* eslint-disable */
/* tslint:disable */

import React from 'react';
import { pdf, Document } from '@react-pdf/renderer';
import SimpleTemplate from '@/components/ui/worksheetTemplates/SimpleTemplate';
import { JsonData } from './types';
/* eslint-disable-next-line */
export const generatePDF = async (jsonData: JsonData, level: string, includeAnswers = false): Promise<Blob> => {
  const element = (
    <Document> /* eslint-disable-next-line */
      <SimpleTemplate jsonData={jsonData} includeAnswers={includeAnswers} /> /* eslint-disable-line */
      /* eslint-disable-next-line */
    </Document>
    /* eslint-disable-next-line */
  );
  /* eslint-disable-next-line */
  const pdfDoc = pdf();
  /* eslint-disable-next-line */
  pdfDoc.updateContainer(element);
  const blob = await pdfDoc.toBlob();
  return blob;
};
