import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCreateWorksheetContext } from '@/context/CreateWorksheetConext';

interface TextPasteProps {
  onTextSubmit: () => void;
}

const TextPaste: React.FC<TextPasteProps> = ({ onTextSubmit }) => {
  const [text, setText] = useState('');
  const { setFormState } = useCreateWorksheetContext();

  const handleSubmit = () => {
    setFormState((prev) => ({
      ...prev,
      notes: { ...prev.notes, text },
    }));
    onTextSubmit();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Paste Text</h2>
      <Textarea
        placeholder="Enter text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full max-w-md"
        rows={5}
      />
      <Button variant="outline" onClick={handleSubmit}>Create from Text</Button>
    </div>
  );
};

export default TextPaste;
