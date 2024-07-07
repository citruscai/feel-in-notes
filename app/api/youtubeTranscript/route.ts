import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

export async function POST(req: NextRequest) {
  const { videoId } = await req.json();

  if (!videoId) {
    return NextResponse.json({ error: 'No video ID provided' }, { status: 400 });
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return NextResponse.json(transcript);
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return NextResponse.json({ error: 'Failed to fetch the transcript' }, { status: 500 });
  }
}
