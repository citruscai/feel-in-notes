import React from 'react';
import { Button } from "@/components/ui/button";
import IconFileWord from '@/components/ui/icons/IconFileWord';
import IconFilePdf from '@/components/ui/icons/IconFilePdf';
import { Worksheet } from '@/lib/types';

interface SidebarProps {
  view: 'pdf' | 'interactive';
  worksheet: Worksheet; 
  setView: (view: 'pdf' | 'interactive') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ view, worksheet, setView }) => {
  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('There was an error downloading the file:', error);
    }
  };

  return (
    <div className="bg-background rounded-lg shadow-lg p-6 grid gap-6">
      {view === 'pdf' ? (
        <>
          <div>
            <h3 className="text-lg font-semibold">Download Options</h3>
            <div className="grid gap-2 mt-2">
              <Button size="sm" variant="outline" onClick={() => downloadFile(worksheet.guided_notes_url, 'worksheet.pdf')}>
                <IconFilePdf className="w-4 h-4 mr-2" />
                Download Guided Notes (.pdf)
              </Button>
              <Button size="sm" variant="outline" onClick={() => downloadFile(worksheet.solutions_url, 'solutions.pdf')}>
                <IconFilePdf className="w-4 h-4 mr-2" />
                Download Solutions (.pdf)
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Interactive Version</h3>
            <p className="text-muted-foreground text-sm mt-2">
              View an interactive version of your guided notes to use digitally!
            </p>
            <Button size="sm" className="mt-2" onClick={() => setView('interactive')}>
              View Interactive Version
            </Button>
          </div>
        </>
      ) : (
        <>
          <div>
            <Button size="sm" className="mt-4" onClick={() => setView('pdf')}>
              Back to PDF View
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
