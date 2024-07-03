import { NextRequest, NextResponse } from 'next/server';
import { Params } from '@/lib/types';

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/worksheets/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch worksheet with ID: ${id}`);
    }
    const data = await response.json();

    const cleanedText = data.text.replace(/```json|```/g, '');
    const worksheetData = JSON.parse(cleanedText);

    return NextResponse.json({
      ...data,
      ...worksheetData,
    });
  } catch (error) {
    console.error('Error fetching worksheet:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
