'use client'
import { useState } from "react";
import { useCreateWorksheetContext } from "@/context/CreateWorksheetConext";
import UploadNotesStep from "@/components/notes/CreateWorksheetForm/UploadNotesPage/UploadNotesStep";
import SelectLevelStep from "@/components/notes/CreateWorksheetForm/SelectLevelPage/SelectLevelStep";

const CreateWorksheetForm = () => {
  const [step, setStep] = useState(0);
  const { formState } = useCreateWorksheetContext();

  const steps = [
    <UploadNotesStep key="upload" next={() => setStep(step + 1)} />,
    <SelectLevelStep key="select-level" prev={() => setStep(step - 1)} />,
  ];

  return (
    <div className="container mx-auto p-4 theme-custom">
      <div>{steps[step]}</div>
    </div>
  );
};

export default CreateWorksheetForm;
