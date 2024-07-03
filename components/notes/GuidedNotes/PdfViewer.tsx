import React from 'react';

interface PDFViewerProps {
  url: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url }) => {
  return (
    <div className="bg-background rounded-lg shadow-lg overflow-hidden h-[80vh] w-full">
      <iframe
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
        title="Lecture Notes PDF"
        className="w-full h-full"
      />
    </div>
  );
};

export default PDFViewer;
