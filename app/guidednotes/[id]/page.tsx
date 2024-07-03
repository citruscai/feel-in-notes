"use client"
import React, {  useState } from 'react';
import { NotesProvider } from '@/context/NotesContext';
import ViewWorksheet from '@/components/notes/GuidedNotes/ViewWorksheet';
import { useParams } from 'next/navigation';

const GuidedNotesPage: React.FC = () => {
  const { id } = useParams();
  const [view, setView] = useState<'pdf' | 'interactive'>('pdf');

  if (!id) {
    return <div>Error: Invalid worksheet ID</div>;
  }

  return (
    <NotesProvider>
      <ViewWorksheet worksheetId={id as string} view={view} setView={setView} />
    </NotesProvider>
  );
};

export default GuidedNotesPage;
