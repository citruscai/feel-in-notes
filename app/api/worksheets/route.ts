export const uploadWorksheet = async (pdfBlob: Blob, fileName: string): Promise<string> => {
    console.log(`Uploading file ${fileName}...`);
    try {
      const formData = new FormData();
      formData.append('file', pdfBlob, fileName);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/worksheets/upload`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload PDF");
      }
  
      const data = await response.json();
      console.log("Upload successful:", data);
      return data.file_url;
    } catch (error) {
      console.error("Error during PDF upload:", error);
      throw error;
    }
  };

export const saveWorksheetUrls = async  (id: string, guidedNotesUrl: string, solutionsUrl: string): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/worksheets/save-urls`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, guidedNotesUrl, solutionsUrl })
      });
    
      if (!response.ok) {
        throw new Error('Failed to save PDF URLs');
      }
      
};