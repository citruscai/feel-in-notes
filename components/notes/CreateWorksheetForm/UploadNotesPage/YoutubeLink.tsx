import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateWorksheetContext } from '@/context/CreateWorksheetConext';
import { YoutubeTranscript } from 'youtube-transcript';

interface YoutubeLinkProps {
  onLinkSubmit: () => void;
}

const YoutubeLink: React.FC<YoutubeLinkProps> = ({ onLinkSubmit }) => {
  const [youtubeLink, setYoutubeLink] = useState('');
  const { setFormState } = useCreateWorksheetContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTranscript = async (videoId: string) => {
    try {
      setLoading(true);
      setError(null);
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      const transcriptText = transcript.map((item) => item.text).join(' ');
      setFormState((prev) => ({
        ...prev,
        notes: { ...prev.notes, text: transcriptText, youtubeLink },
      }));
      onLinkSubmit();
    } catch (err) {
      setError('Failed to fetch the transcript. Please check the link.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    const videoId = youtubeLink.split('v=')[1]?.split('&')[0];
    if (videoId) {
      fetchTranscript(videoId);
    } else {
      setError('Invalid YouTube link.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Paste YouTube Link</h2>
      <Input
        type="text"
        placeholder="Enter YouTube link"
        value={youtubeLink}
        onChange={(e) => setYoutubeLink(e.target.value)}
        className="w-full max-w-md"
      />
      {error && <p className="text-red-500">{error}</p>}
      <Button variant="outline" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Fetching Transcript...' : 'Create from YouTube'}
      </Button>
    </div>
  );
};

export default YoutubeLink;
