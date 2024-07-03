import React, { useEffect, useContext } from 'react';
import { NotesContext } from '@/context/NotesContext';
import FillInTheBlankNotes from './FillInTheBlankNotes';
import QuestionAnswerNotes from './QuestionAnswerNotes';
import Sidebar from './Sidebar';
import PDFViewer from './PdfViewer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ViewWorksheetProps {
  worksheetId: string;
  view: 'pdf' | 'interactive';
  setView: (view: 'pdf' | 'interactive') => void;
}

const ViewWorksheet: React.FC<ViewWorksheetProps> = ({ worksheetId, view, setView }) => {
  const context = useContext(NotesContext);
  if (!context) throw new Error("NotesContext must be used within a NotesProvider");
  const { setWorksheet, setUserAnswers, setLoading, loading, worksheet, userAnswers } = context;

  useEffect(() => {
    const fetchAndSetWorksheet = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/worksheets/${worksheetId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch worksheet with ID: ${worksheetId}`);
        }
        const worksheetData = await response.json();
        setWorksheet(worksheetData);

        const numAnswers = worksheetData.questions ? worksheetData.questions.length : worksheetData.sections.reduce((count: number, section) => {
          return count + (section.content.join(' ').match(/<mark>/g) || []).length;
        }, 0);

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
          {worksheet.questions ? (
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
