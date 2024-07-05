import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, level } = await req.json();

    if (!text) {
      throw new Error('No text provided');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, level })
    });

    if (!response.ok) {
      throw new Error(`Failed to upload notes: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading notes:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
