import React, { memo, useCallback } from 'react';

type LevelChoicesProps = {
  selectedLevel: string;
  onChange: (value: string) => void;
};

const LevelChoices: React.FC<LevelChoicesProps> = ({ selectedLevel, onChange }) => {
  const options = [
    { value: 'blanks', label: 'Fill in the Blank Notes', description: 'Generate notes with blank spaces for key concepts, allowing you to actively engage with the material.' },
    { value: 'questions', label: 'Question Based Notes', description: 'Create notes in a question-and-answer format to test your understanding and retention of the material.' }
  ];

  const handleClick = useCallback((value: string) => {
    onChange(value);
  }, [onChange]);

  return (
    <div className="grid gap-4">
      {options.map((option) => (
        <div
          key={option.value}
          className={`p-4 rounded-lg border transition-colors cursor-pointer ${
            selectedLevel === option.value
              ? 'bg-primary text-primary-foreground border-primary'
              : 'hover:bg-muted'
          }`}
          onClick={() => handleClick(option.value)}
        >
          <h3 className="text-xl font-semibold">{option.label}</h3>
          <p className="text-muted-foreground">{option.description}</p>
        </div>
      ))}
    </div>
  );
};

export default memo(LevelChoices);
