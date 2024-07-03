import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
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
