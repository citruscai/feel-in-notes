import React, { useState, useCallback } from 'react';
import { useCreateWorksheetContext } from '@/context/CreateWorksheetConext';
import LevelChoices from './LevelChoices';
import LevelDescriptions from './LevelDescriptions';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { generatePDF } from '@/lib/worksheetGenerator';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { uploadNotes, uploadWorksheet, saveWorksheetUrls } from '@/lib/serverFunctions';

type SelectLevelStepProps = {
  prev: () => void;
  startLoading: () => void;
  stopLoading: () => void;
};

const SelectLevelStep: React.FC<SelectLevelStepProps> = ({ prev, startLoading, stopLoading }) => {
  const { formState, setFormState } = useCreateWorksheetContext();
  const [selectedLevel, setSelectedLevel] = useState(formState.notes.level);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLevelChange = useCallback((value: string) => {
    setFormState((prev) => ({
      ...prev,
      notes: { ...prev.notes, level: value },
    }));
    setSelectedLevel(value);
  }, [setFormState]);

  const replaceNonStandardQuotes = (text: string) => {
    return text.replace(/‘/g, "'").replace(/’/g, "'");
  };

  const submitData = async () => {
    startLoading();
    setIsSubmitting(true);
    try {
      const jsonResponse = await uploadNotes(formState.notes.text, selectedLevel);

      let parsedText;
      try {
        const sanitizedText = jsonResponse.text
          .replace(/^```json\n/, '')
          .replace(/\n```$/, '')
          .replace(/\\n/g, '');
        const standardizedText = replaceNonStandardQuotes(sanitizedText);
        parsedText = JSON.parse(standardizedText);
      } catch (parseError) {
        console.error('Error parsing text field:', parseError);
        throw new Error('Invalid JSON structure in text field.');
      }

      const guidedNotesPdf = await generatePDF(parsedText, jsonResponse.level);
      const solutionsPdf = await generatePDF(parsedText, jsonResponse.level, true);

      const sanitizedTitle = parsedText.title
        ? parsedText.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase()
        : 'guided-notes';

      const guidedNotesUrl = await uploadWorksheet(guidedNotesPdf, `${sanitizedTitle}-guided-notes.pdf`);
      const solutionsUrl = await uploadWorksheet(solutionsPdf, `${sanitizedTitle}-solutions.pdf`);

      await saveWorksheetUrls(jsonResponse.id, guidedNotesUrl, solutionsUrl);

      router.push(`/guidednotes/${jsonResponse.id}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      }
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  return (
    <div className="relative">
      {isSubmitting && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <LoadingSpinner />
        </div>
      )}

      <div className="grid grid-cols-[1fr_300px] gap-8 w-full max-w-6xl mx-auto py-12 px-4 md:px-6">
        <div className="flex flex-col justify-between h-full">
          <div>
            <h1 className="text-4xl font-bold mb-6">Select a level</h1>
            <div className="grid gap-4">
              <LevelChoices selectedLevel={selectedLevel} onChange={handleLevelChange} />
            </div>
          </div>
          <div className="w-full mt-4 flex justify-between space-x-2">
            <Button onClick={prev} variant="default" className="mr-2">
              Back
            </Button>
            <Button
              onClick={submitData}
              disabled={isSubmitting}
              variant="default"
              className={`${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
        {selectedLevel && (
          <LevelDescriptions level={selectedLevel} />
        )}
      </div>
    </div>
  );
};

export default SelectLevelStep;
