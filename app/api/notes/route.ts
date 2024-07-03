import { NextRequest, NextResponse } from 'next/server';



export async function uploadHandler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  try {
    const formData = await req.formData();
    const pdfBlob = formData.get('file') as Blob;
    const fileName = formData.get('fileName') as string;

    console.log('Uploading PDF:', fileName);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/worksheets/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload PDF: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ file_url: data.file_url });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


export async function saveUrlsHandler(req: NextRequest) {
  if (req.method !== 'PUT') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { id, guidedNotesUrl, solutionsUrl } = await req.json();

    console.log('Saving URLs:', { id, guidedNotesUrl, solutionsUrl });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/worksheets/save-urls`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, guidedNotesUrl, solutionsUrl }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save PDF URLs: ${response.statusText}`);
    }

    return NextResponse.json({ message: 'URLs saved successfully' });
  } catch (error) {
    console.error('Error saving URLs:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export default async function handler(req: NextRequest) {
  if (req.url.includes('/upload')) {
    return uploadHandler(req);
  } else if (req.url.includes('/save-urls')) {
    return saveUrlsHandler(req);
  } else {
    return NextResponse.json({ message: 'Not Found' }, { status: 404 });
  }
}
