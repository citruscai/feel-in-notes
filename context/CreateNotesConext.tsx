import { createContext, useContext, useState, ReactNode, FC } from 'react';
import { Notes,Worksheet } from '@/lib/types';

type FormState = {
    notes: Notes;
    worksheet: Worksheet;
};
const defaultNotes: Notes = { text: '', id: '', level: '' };
const defaultWorksheet: Worksheet = { date: '', id: '', text: '', level: '' };

const CreateNotesContext = createContext<{
    formState: FormState;
    setFormState: React.Dispatch<React.SetStateAction<FormState>>;
}>  ({ formState: { notes: defaultNotes, worksheet: defaultWorksheet }, setFormState: () => {} });
export const CreateNotesProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [formState, setFormState] = useState<FormState>({ notes: defaultNotes, worksheet: defaultWorksheet });
    return <CreateNotesContext.Provider value={{ formState, setFormState }}>{children}</CreateNotesContext.Provider>;
};

export const useCreateNotesContext = () => useContext(CreateNotesContext);

