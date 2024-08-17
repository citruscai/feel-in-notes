import React, { useEffect, useContext } from 'react';
import { NotesContext } from '@/context/NotesContext';
import FillInTheBlankNotes from './FillInTheBlankNotes';
import QuestionAnswerNotes from './QuestionAnswerNotes';
import Sidebar from './Sidebar';
import PDFViewer from './PdfViewer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getWorksheet } from '@/lib/serverFunctions';

interface ViewWorksheetProps {
  worksheetId: string;
  view: 'pdf' | 'interactive';
  setView: (view: 'pdf' | 'interactive') => void;
}

const ViewWorksheet: React.FC<ViewWorksheetProps> = ({ worksheetId, view, setView }) => {
const context = useContext(NotesContext);
const { setWorksheet, setUserAnswers, setLoading, loading, worksheet, setGuidedNotesJSON,guidedNotesJSON} = context;
useEffect(() => {
  const fetchAndSetWorksheet = async () => {
    setLoading(true);
    try {
      const worksheetData = await getWorksheet(worksheetId);
      const worksheetText = worksheetData.text
        .replace(/^```json\n/, '')
        .replace(/\n```$/, '')
        .replace(/\\n/g, '');
      const worksheetJSON = JSON.parse(worksheetText);

      setGuidedNotesJSON(worksheetJSON);
      setWorksheet(worksheetData);

      
      let numAnswers = 0;
      if (worksheetJSON?.sections) {
        worksheetJSON.sections.forEach((section) => {
          if (section.content) {
            section.content.forEach((content) => {
              const matches = content.match(/<mark>(.*?)<\/mark>/g);
              if (matches) {
                numAnswers += matches.length;
              }
            });
          }
      
          if (section.lists) {
            section.lists.forEach((list) => {
              if (list.items) {
                list.items.forEach((item) => {
                  const matches = item.match(/<mark>(.*?)<\/mark>/g);
                  if (matches) {
                    numAnswers += matches.length;
                  }
                });
              }
            });
          }
        });
      }
      setUserAnswers(new Array(numAnswers).fill(''));
    } catch (error) {
      console.error("Failed to fetch worksheet", error);
    } finally {
      setLoading(false);
    }
  };

  fetchAndSetWorksheet();
}, [worksheetId]);



  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner className="w-12 h-12 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[1fr_300px] gap-6 items-start w-full min-h-screen bg-muted/40 p-6">
      {view === 'pdf' && worksheet && (
        <PDFViewer url={worksheet.guided_notes_url} />
      )}
      {view === 'interactive' && (
        <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-3xl mx-auto">
          {guidedNotesJSON.questions ? (
            <QuestionAnswerNotes />
          ) : (
            <FillInTheBlankNotes />
          )}
        </div>
      )}
      <Sidebar view={view} worksheet={worksheet} setView={setView} />
    </div>
  );
};

export default ViewWorksheet;
