export const uploadNotes = async (text: string, level: string) => {
  const response = await fetchWithErrorHandling(`${process.env.NEXT_PUBLIC_API_URL}/notes/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text, level })
  });

  return response;
};

export const uploadWorksheet = async (pdf: Blob, fileName: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', pdf, fileName);

  const response = await fetchWithErrorHandling(`${process.env.NEXT_PUBLIC_API_URL}/worksheets/upload`, {
    method: 'POST',
    body: formData,
  });

  return response.file_url;
};

export const saveWorksheetUrls = async (id: string, guidedNotesUrl: string, solutionsUrl: string) => {
  await fetchWithErrorHandling(`${process.env.NEXT_PUBLIC_API_URL}/worksheets/save-urls`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, guidedNotesUrl, solutionsUrl })
  });
};

export const getWorksheet = async (id: string) => {
  const data = await fetchWithErrorHandling(`${process.env.NEXT_PUBLIC_API_URL}/worksheets/${id}`);
  return data;
};

export const fetchWithErrorHandling = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
  }

  return response.json();
};

export const extractTextFromFile = async (file: Buffer): Promise<string> => {
  try {
    const base64File = file.toString('base64');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/textExtract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file: base64File }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw error;
  }
};

export const fetchTranscript = async (videoId: string) => {
  const response = await fetchWithErrorHandling(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/youtubeTranscript`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ videoId }),
  });

  return response;
};

