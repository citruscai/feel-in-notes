import { useCreateWorksheetContext } from '@/context/CreateWorksheetConext';
import LevelChoices from './LevelChoices';
import React, { useState } from 'react';
import LevelDescriptions from './LevelDescriptions';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

type SelectLevelStepProps = {
  prev: () => void;
};

const SelectLevelStep: React.FC<SelectLevelStepProps> = ({ prev }) => {
  const { formState, setFormState } = useCreateWorksheetContext();
  const [selectedLevel, setSelectedLevel] = useState(formState.notes.level);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const handleLevelChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      notes: { ...prev.notes, level: value },
    }));
   // console.log()
    setSelectedLevel(value);
  };
  console.log("Formstate in select level step:" ,formState.notes.text);

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

      console.log("Notes uploaded successfully", response);
      // Redirect to success page
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
