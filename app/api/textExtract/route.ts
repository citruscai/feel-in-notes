import { NextRequest, NextResponse } from 'next/server';
import extractTextFromFile from '@/lib/extractTextFromFile';

export async function POST(req: NextRequest) {
  console.log('API handler called');
  
  const { file } = await req.json();
  console.log('File received:', file ? 'yes' : 'no');

  if (!file) {
    console.log('No file provided');
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  try {
    console.log('Converting base64 to buffer');
    const buffer = Buffer.from(file, 'base64');
    console.log('Starting text extraction');
    const text = await extractTextFromFile(buffer);
    console.log('Text extraction successful');
    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error extracting text from file:', error);
    return NextResponse.json({ error: 'Failed to extract text' }, { status: 500 });
  }
}
