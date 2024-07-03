import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
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
