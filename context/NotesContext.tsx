import React, { createContext, useState } from 'react';

interface NotesContextType {
  worksheet: any;
  setWorksheet: React.Dispatch<React.SetStateAction<any>>;
  userAnswers: string[];
  setUserAnswers: React.Dispatch<React.SetStateAction<string[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [worksheet, setWorksheet] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <NotesContext.Provider value={{ worksheet, setWorksheet, userAnswers, setUserAnswers, loading, setLoading }}>
      {children}
    </NotesContext.Provider>
  );
};
