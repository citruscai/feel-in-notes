import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type LevelChoicesProps = {
  selectedLevel: string;
  onChange: (value: string) => void;
};

const LevelChoices: React.FC<LevelChoicesProps> = ({ selectedLevel, onChange }) => {
  const options = [
    { value: 'moderate', label: 'Moderate Support' },
    { value: 'high', label: 'High Support' },
    { value: 'questions', label: 'Questions' }
  ];

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
          onClick={() => onChange(option.value)}
        >
          <h3 className="text-xl font-semibold">{option.label}</h3>
        </div>
      ))}
    </div>
  );
};

export default LevelChoices;
