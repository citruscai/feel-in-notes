import { useContext } from 'react';
import { NotesContext } from '../context/NotesContext';

const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export default useNotes;
