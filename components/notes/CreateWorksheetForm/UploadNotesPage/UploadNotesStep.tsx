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
      <div className="mx-4 flex w-full max-w-4xl flex-col rounded-xl bg-card p-6 shadow-lg md:flex-row">
        <div className="relative flex flex-1 flex-col items-center justify-center gap-4 rounded-xl bg-muted p-6 text-center">
          {activeTab === 'upload' && <NotesUploadBox onUploadSuccess={handleUploadSuccess} />}
          {activeTab === 'youtube' && <YoutubeLink onLinkSubmit={handleLinkSubmit} />}
          {activeTab === 'text' && <TextPaste onTextSubmit={handleTextSubmit} />}
        </div>
        <div className="flex flex-col items-center justify-center gap-4 p-6">
          <Button
            variant={activeTab === 'upload' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('upload')}
            className="flex w-full flex-col items-center gap-2 rounded-xl p-4 hover:bg-muted"
          >
            <IconUpload className="h-8 w-8" />
            <span>Upload Document</span>
          </Button>
          <Button
            variant={activeTab === 'youtube' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('youtube')}
            className="flex w-full flex-col items-center gap-2 rounded-xl p-4 hover:bg-muted"
          >
            <IconYoutube className="h-8 w-8" />
            <span>Paste YouTube Link</span>
          </Button>
          <Button
            variant={activeTab === 'text' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('text')}
            className="flex w-full flex-col items-center gap-2 rounded-xl p-4 hover:bg-muted"
          >
            <IconPaste className="h-8 w-8" />
            <span>Paste Text</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadNotesStep;
