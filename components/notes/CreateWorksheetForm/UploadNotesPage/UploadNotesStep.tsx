import React, { useState } from 'react';
import NotesUploadBox from './NotesUploadBox';
import YoutubeLink from './YoutubeLink';
import TextPaste from './TextPaste';
import { Button } from "@/components/ui/button";
import IconUpload from '@/components/ui/icons/IconUpload';
import IconPaste from '@/components/ui/icons/IconPaste';
import IconYoutube from '@/components/ui/icons/IconYoutube';

interface UploadNotesStepProps {
  next: () => void;
}

const UploadNotesStep: React.FC<UploadNotesStepProps> = ({ next }) => {
  const [activeTab, setActiveTab] = useState('upload');

  const handleUploadSuccess = () => {
    next();
  };

  const handleLinkSubmit = () => {
    next();
  };

  const handleTextSubmit = () => {
    next();
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="mx-8 flex w-full max-w-5xl flex-col rounded-2xl bg-card p-8 shadow-2xl md:flex-row">
        <div className="relative flex flex-1 flex-col items-center justify-center gap-6 rounded-2xl bg-muted p-8 text-center">
          {activeTab === 'upload' && <NotesUploadBox onUploadSuccess={handleUploadSuccess} />}
          {activeTab === 'youtube' && <YoutubeLink onLinkSubmit={handleLinkSubmit} />}
          {activeTab === 'text' && <TextPaste onTextSubmit={handleTextSubmit} />}
        </div>
        <div className="flex flex-col items-center justify-center gap-6 p-8">
          <Button
            variant={activeTab === 'upload' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('upload')}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl p-6 hover:bg-muted"
          >
            <IconUpload className="h-10 w-10" />
            Upload Document
          </Button>
          <Button
            variant={activeTab === 'youtube' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('youtube')}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl p-6 hover:bg-muted"
          >
            <IconYoutube className="h-10 w-10" />
            Paste YouTube Link
          </Button>
          <Button
            variant={activeTab === 'text' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('text')}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl p-6 hover:bg-muted"
          >
            <IconPaste className="h-10 w-10" />
            Paste Text
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadNotesStep;
