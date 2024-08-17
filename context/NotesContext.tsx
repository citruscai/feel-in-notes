import React, { createContext, useState } from 'react';
import { Worksheet, GuidedNotesJSON } from '@/lib/types';

interface NotesContextType {
  worksheet: Worksheet | null;
  setWorksheet: React.Dispatch<React.SetStateAction<Worksheet | null>>;
  guidedNotesJSON: GuidedNotesJSON | null;
  setGuidedNotesJSON: React.Dispatch<React.SetStateAction<GuidedNotesJSON | null>>;
  userAnswers: string[];
  setUserAnswers: React.Dispatch<React.SetStateAction<string[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [worksheet, setWorksheet] = useState<Worksheet | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [guidedNotesJSON, setGuidedNotesJSON] = useState<GuidedNotesJSON | null>(null);

  return (
    <NotesContext.Provider
      value={{
        worksheet,
        setWorksheet,
        userAnswers,
        setUserAnswers,
        loading,
        setLoading,
        guidedNotesJSON,
        setGuidedNotesJSON,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
