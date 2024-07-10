"use client";
import React, { createContext, useContext, useState, ReactNode, FC } from 'react';
import { FormState, Notes, Worksheet } from '@/lib/interfaces';

const defaultNotes: Notes = { text: '', id: '', level: '' };
const defaultWorksheet: Worksheet = { date: '', id: '', text: '', level: '' };

const CreateWorksheetContext = createContext<{
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
}>({
  formState: { notes: defaultNotes, worksheet: defaultWorksheet },
  setFormState: () => {},
});

export const CreateWorksheetProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [formState, setFormState] = useState<FormState>({
    notes: defaultNotes,
    worksheet: defaultWorksheet,
  });

  return (
    <CreateWorksheetContext.Provider value={{ formState, setFormState }}>
      {children}
    </CreateWorksheetContext.Provider>
  );
};

export const useCreateWorksheetContext = () => useContext(CreateWorksheetContext);
