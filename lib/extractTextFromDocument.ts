import { getTextExtractor } from 'office-text-extractor';

async function extractTextFromFile(file: Buffer): Promise<string> {
  try {
    const extractor = getTextExtractor();
 console.log("file received")
    // Extract text from the buffer
    const text = await extractor.extractText({ input: file, type: 'buffer' });

    return text;
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw error;
  }
}

export default extractTextFromFile;
