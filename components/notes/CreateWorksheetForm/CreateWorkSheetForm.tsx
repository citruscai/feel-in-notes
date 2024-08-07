'use client'
import React, { useState, ReactElement } from "react";
import UploadNotesStep from "@/components/notes/CreateWorksheetForm/UploadNotesPage/UploadNotesStep";
import SelectLevelStep from "@/components/notes/CreateWorksheetForm/SelectLevelPage/SelectLevelStep";
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const CreateWorksheetForm: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
 

  const steps: ReactElement[] = [
    <UploadNotesStep key="upload" next={() => setStep(step + 1)} startLoading={() => setLoading(true)} stopLoading={() => setLoading(false)} />,
    <SelectLevelStep key="select-level" prev={() => setStep(step - 1)} startLoading={() => setLoading(true)} stopLoading={() => setLoading(false)} />,
  ];

  return (
    <div className="container mx-auto p-4 theme-custom">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
      ) : (
        <div>{steps[step]}</div>
      )}
    </div>
  );
};

export default CreateWorksheetForm;
