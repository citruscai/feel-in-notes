"use client";
import React, { useState } from 'react';
import { useCreateWorksheetContext } from '@/context/CreateWorksheetConext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type NotesUploadBoxProps = {
  onUploadSuccess: () => void;
};

const NotesUploadBox: React.FC<NotesUploadBoxProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { setFormState, formState } = useCreateWorksheetContext();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFile = files[0];
      setFile(newFile);
      if (newFile) {
        const reader = new FileReader();
        reader.onload = async () => {
          if (typeof reader.result === 'string') {
            const base64File = reader.result.split(',')[1];
            setLoading(true);
            try {
              const response = await fetch('/api/textExtract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file: base64File })
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const data = await response.json();

              setFormState((prev) => ({
                ...prev,
                notes: { ...prev.notes, text: data.text },
              }));

              onUploadSuccess();
            } catch (error) {
              if (error instanceof Error) {
                console.error('Error during text extraction:', error.message);
              }
            } finally {
              setLoading(false);
            }
          }
        };
        reader.readAsDataURL(newFile);
      }
    }
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50" data-testid="loading-spinner">
          <LoadingSpinner />
        </div>
      )}
      <div className="relative bg-background rounded-lg p-4 border border-border theme-custom">
        <label htmlFor="file-upload" className="flex items-center justify-center flex-col pt-3 pb-4 w-full cursor-pointer">
          <img src="/file-upload-icon.svg" alt="File upload icon" width={40} height={32} />
          <p className="mb-1 text-sm text-muted-foreground">
            <span className="font-semibold text-primary">Click to upload</span>
            &nbsp; or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            PPT, PPTX,TXT, PDF, DOC, DOCX
          </p>
        </label>
        <input
          id="file-upload"
          data-testid="file-upload"
          type="file"
          accept="application/pdf,.pdf,application/msword,.doc,.docx,application/vnd.openxmlformats-officedocument.presentationml.presentation,.pptx,application/vnd.ms-powerpoint,.ppt,text/plain,.txt"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {file && (
          <div className="mt-2 text-foreground">
            <span>{file.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesUploadBox;
