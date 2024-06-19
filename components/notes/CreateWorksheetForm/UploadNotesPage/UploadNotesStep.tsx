import NotesUploadBox from './NotesUploadBox';

type UploadNotesStep = {
  next: () => void;
};

const UploadNotesStep: React.FC<NotesUploadPageProps> = ({ next }) => {
  return (
    <div>
      <h1 className="text-2xl mb-4 text-primary text-center">Upload Notes</h1>
      <NotesUploadBox onUploadSuccess={next} />
    </div>
  );
};

export default UploadNotesStep;
