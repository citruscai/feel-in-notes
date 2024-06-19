import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type LevelChoicesProps = {
  selectedLevel: string;
  onChange: (value: string) => void;
};

const LevelChoices: React.FC<LevelChoicesProps> = ({ selectedLevel, onChange }) => {
  return (
    <RadioGroup
      defaultValue={selectedLevel}
      onValueChange={onChange}
      className="mb-4 theme-custom p-4 border border-border rounded-lg bg-background"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="moderate" id="r1" />
        <Label htmlFor="r1" className="">Moderate Support</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="high" id="r2" />
        <Label htmlFor="r2" className="">High Support</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="questions" id="r3" />
        <Label htmlFor="r3" className="">Questions</Label>
      </div>
    </RadioGroup>
  );
};

export default LevelChoices;
