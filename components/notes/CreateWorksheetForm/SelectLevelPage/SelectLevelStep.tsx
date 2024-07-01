import React, { useState } from 'react';
import { useCreateWorksheetContext } from '@/context/CreateWorksheetConext';
import LevelChoices from './LevelChoices';
import LevelDescriptions from './LevelDescriptions';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { generatePDF } from '@/lib/worksheetGenerator';
import { uploadWorksheet, saveWorksheetUrls } from '@/app/api/worksheets/route';

type SelectLevelStepProps = {
  prev: () => void;
};

const SelectLevelStep: React.FC<SelectLevelStepProps> = ({ prev }) => {
  const { formState, setFormState } = useCreateWorksheetContext();
  const [selectedLevel, setSelectedLevel] = useState(formState.notes.level);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLevelChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      notes: { ...prev.notes, level: value },
    }));
    setSelectedLevel(value);
  };

  const replaceNonStandardQuotes = (text: string) => {
    return text.replace(/‘/g, "'").replace(/’/g, "'");
  };

  const submitData = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: formState.notes.text, level: selectedLevel })
      });

      if (!response.ok) {
        throw new Error(`Failed to upload notes: ${response.statusText}`);
      }

      const jsonResponse = await response.json();

      // Log the entire response to see if there are any issues
      console.log('Full Response:', jsonResponse);

      let parsedText;
      try {
        const sanitizedText = jsonResponse.text
          .replace(/^```json\n/, '')
          .replace(/\n```$/, '')
          .replace(/\\n/g, '');
        const standardizedText = replaceNonStandardQuotes(sanitizedText);
        console.log('Sanitized Text:', standardizedText);  // Log sanitized text
        parsedText = JSON.parse(standardizedText);
        console.log('Parsed Text:', parsedText);  // Log parsed text
      } catch (parseError) {
        console.error('Error parsing text field:', parseError);
        console.error('Sanitized text:', jsonResponse.text);
        throw new Error('Invalid JSON structure in text field.');
      }

      // Always generate PDF using the simple template
      const guidedNotesPdf = await generatePDF(parsedText, jsonResponse.level);
      const solutionsPdf = await generatePDF(parsedText, jsonResponse.level, true);

      const sanitizedTitle = parsedText.title
        ? parsedText.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase()
        : 'guided-notes';

      const guidedNotesUrl = await uploadWorksheet(guidedNotesPdf, `${sanitizedTitle}-guided-notes.pdf`);
      const solutionsUrl = await uploadWorksheet(solutionsPdf, `${sanitizedTitle}-solutions.pdf`);
      console.log("Guided Notes URL: ", guidedNotesUrl);
      console.log("Solutions  URL: ", solutionsUrl);
      await saveWorksheetUrls(jsonResponse.id, guidedNotesUrl, solutionsUrl);

      router.push(`/guidednotes/${jsonResponse.id}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 theme-custom">
      <h1 className="text-2xl mb-4 text-primary">Select Level</h1>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <LevelChoices selectedLevel={selectedLevel} onChange={handleLevelChange} />
        </div>
        <div className="flex-1">
          <LevelDescriptions level={selectedLevel} />
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
  );
};

export default SelectLevelStep;
