export const fetchWorksheet = async (worksheetId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/worksheets/${worksheetId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch worksheet with ID: ${worksheetId}`);
  }
  const data = await response.json();

  // Ensure that we return the entire worksheet object
  const cleanedText = data.text.replace(/```json|```/g, '');
  const worksheetData = JSON.parse(cleanedText);
  
  // Include other necessary fields
  return {
    ...data,
    ...worksheetData,
  };
};
