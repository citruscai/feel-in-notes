
import { PDFDocument } from 'pdf-lib';

export const uploadWorksheet = async (pdfBlob: Blob, fileName: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', pdfBlob, fileName);
  console.log('Uploading PDF:', fileName);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/worksheets/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload PDF: ${response.statusText}`);
    }

    const data = await response.json();
    return data.file_url;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};

export const saveWorksheetUrls = async (id: string, guidedNotesUrl: string, solutionsUrl: string): Promise<void> => {
  console.log('Saving URLs:', { id, guidedNotesUrl, solutionsUrl });
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/worksheets/save-urls`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, guidedNotesUrl, solutionsUrl }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save PDF URLs: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error saving URLs:', error);
    throw error;
  }
};
