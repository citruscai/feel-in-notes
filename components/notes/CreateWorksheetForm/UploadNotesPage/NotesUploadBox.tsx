"use client";
import React, { useState } from 'react';
import { FileUploader, FileUploaderContent, FileUploaderItem, FileInput } from '@/components/ui/FileUploader'; 
import { Paperclip } from 'lucide-react';
import { useCreateWorksheetContext } from '@/context/CreateWorksheetConext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FormState } from '@/lib/interfaces';

type NotesUploadBoxProps = {
  onUploadSuccess: () => void;
};

const NotesUploadBox: React.FC<NotesUploadBoxProps> = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { setFormState, formState } = useCreateWorksheetContext();

  const dropZoneConfig = {
    maxFiles: 1,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'text/plain': ['.txt']
    }
  };

  const handleFileChange = async (newFiles: File[] | null) => {
    setFiles(newFiles);
    if (newFiles && newFiles.length > 0) {
      const file = newFiles[0];
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
            setFormState((prev: FormState) => ({
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
      reader.readAsDataURL(file);
    }
  };

 

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <LoadingSpinner />
        </div>
      )}
      <FileUploader
        value={files}
        onValueChange={handleFileChange}
        dropzoneOptions={dropZoneConfig}
        className="relative bg-background rounded-lg p-4 border border-border theme-custom"
      >
        <FileInput className="outline-dashed outline-1 outline-border text-foreground">
          <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full">
            <img src="/file-upload-icon.svg" alt="File upload icon" width={40} height={32} />
            <p className="mb-1 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Click to upload</span>
              &nbsp; or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              PPT, PPTX,TXT, PDF, DOC, DOCX
            </p>
          </div>
        </FileInput>
        <FileUploaderContent>
          {files &&
            files.length > 0 &&
            files.map((file, i) => (
              <FileUploaderItem key={i} index={i} className="border-b border-border text-foreground">
                <Paperclip className="h-4 w-4 stroke-current text-foreground" />
                <span>{file.name}</span>
              </FileUploaderItem>
            ))}
        </FileUploaderContent>
      </FileUploader>
    </div>
  );
};

export default NotesUploadBox;
