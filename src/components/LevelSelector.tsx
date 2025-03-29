
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { InfoIcon } from "lucide-react";

interface LevelSelectorProps {
  onLevelSelect: (level: number) => void;
  defaultLevel?: number;
}

const LevelSelector = ({ onLevelSelect, defaultLevel = 3 }: LevelSelectorProps) => {
  const [level, setLevel] = useState(defaultLevel);
  
  const handleLevelChange = (newLevel: number[]) => {
    const selectedLevel = newLevel[0];
    setLevel(selectedLevel);
    onLevelSelect(selectedLevel);
  };
  
  const handleRadioChange = (value: string) => {
    const selectedLevel = parseInt(value);
    setLevel(selectedLevel);
    onLevelSelect(selectedLevel);
  };

  const getLevelDescription = (level: number) => {
    switch (level) {
      case 1:
        return "Maximum assistance with detailed, step-by-step guidance. Best for beginners or complex topics.";
      case 2:
        return "Comprehensive assistance with detailed explanations and frequent hints.";
      case 3:
        return "Balanced assistance with clear explanations and occasional hints.";
      case 4:
        return "Minimal assistance with concise explanations and rare hints. For advanced learners.";
      case 5:
        return "Expert level with minimal guidance. Only essential hints are provided.";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-base font-medium">Select Assistance Level</Label>
              <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                {level}
              </div>
            </div>
            
            <Slider
              defaultValue={[defaultLevel]}
              max={5}
              min={1}
              step={1}
              onValueChange={handleLevelChange}
              value={[level]}
              className="mb-6"
            />
            
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>More Help</span>
              <span>Less Help</span>
            </div>
          </div>
          
          <div className="bg-accent/30 p-4 rounded-lg flex">
            <InfoIcon className="h-5 w-5 text-primary flex-shrink-0 mt-1 mr-3" />
            <div className="text-sm">
              <p className="font-medium mb-1">Level {level} Assistance</p>
              <p>{getLevelDescription(level)}</p>
            </div>
          </div>
          
          <div>
            <Label className="text-base font-medium mb-2 block">Or Select a Preset Level</Label>
            <RadioGroup
              defaultValue={defaultLevel.toString()}
              value={level.toString()}
              onValueChange={handleRadioChange}
              className="grid grid-cols-1 sm:grid-cols-5 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="level-1" />
                <Label htmlFor="level-1">Level 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="level-2" />
                <Label htmlFor="level-2">Level 2</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="level-3" />
                <Label htmlFor="level-3">Level 3</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="level-4" />
                <Label htmlFor="level-4">Level 4</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="level-5" />
                <Label htmlFor="level-5">Level 5</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button onClick={() => onLevelSelect(level)} className="w-full">
            Continue with Level {level}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LevelSelector;
