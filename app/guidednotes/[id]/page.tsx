"use client"
import ViewWorksheet from '@/components/notes/ViewWorksheet/ViewWorksheet';
import InteractiveGuidedNotes from '@/components/notes/ViewWorksheet/ViewWorksheet';
import { useParams } from 'next/navigation';

const NotesPage = () => {
const { id } = useParams();

if (!id) return null; 

return <ViewWorksheet id={id as string} />;
};

export default NotesPage;
