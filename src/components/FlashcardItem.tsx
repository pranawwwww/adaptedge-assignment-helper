
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, X } from "lucide-react";

interface FlashcardItemProps {
  question: string;
  answer: string;
  explanation: string;
  onAnswer?: (correct: boolean) => void;
}

const FlashcardItem = ({
  question,
  answer,
  explanation,
  onAnswer
}: FlashcardItemProps) => {
  const [flipped, setFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleFlip = () => {
    if (!submitted) {
      setFlipped(!flipped);
    }
  };

  const handleSubmit = () => {
    const correct = userAnswer.toLowerCase().trim() === answer.toLowerCase().trim();
    setIsCorrect(correct);
    setSubmitted(true);
    setFlipped(true);
    
    if (onAnswer) {
      onAnswer(correct);
    }
  };

  const handleReset = () => {
    setFlipped(false);
    setUserAnswer("");
    setSubmitted(false);
    setIsCorrect(false);
  };

  return (
    <div className="w-full max-w-md mx-auto perspective-1000">
      <div 
        className={`relative w-full h-64 transition-transform duration-500 transform-style-3d cursor-pointer ${
          flipped ? "rotate-y-180" : ""
        }`}
        onClick={submitted ? undefined : handleFlip}
      >
        {/* Front side */}
        <Card className={`absolute w-full h-full backface-hidden p-6 flex flex-col justify-between ${
          submitted ? (isCorrect ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20") : "bg-card"
        }`}>
          <div className="text-center">
            <h3 className="text-xl font-medium mb-4">Question</h3>
            <p className="text-lg">{question}</p>
          </div>
          
          {!submitted && (
            <div className="mt-4">
              <div className="flex justify-center items-center space-x-2">
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Type your answer..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubmit();
                  }} 
                  disabled={!userAnswer.trim()}
                >
                  Submit
                </Button>
              </div>
              <p className="text-center text-sm mt-2">Click card to flip</p>
            </div>
          )}
          
          {submitted && (
            <div className="mt-4 text-center">
              {isCorrect ? (
                <div className="flex items-center justify-center text-green-600 dark:text-green-400">
                  <Check className="mr-2 h-5 w-5" />
                  <span>Correct!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center text-red-600 dark:text-red-400">
                  <X className="mr-2 h-5 w-5" />
                  <span>Incorrect</span>
                </div>
              )}
              <Button 
                className="mt-2" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
              >
                Next Card
              </Button>
            </div>
          )}
        </Card>
        
        {/* Back side */}
        <Card className="absolute w-full h-full backface-hidden p-6 rotate-y-180 flex flex-col justify-between bg-accent/20">
          <div className="text-center">
            <h3 className="text-xl font-medium mb-2">Answer</h3>
            <p className="text-lg font-bold mb-4">{answer}</p>
            <h4 className="text-md font-medium mb-2">Explanation</h4>
            <p className="text-sm">{explanation}</p>
          </div>
          
          <div className="mt-4 text-center">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                handleFlip();
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Back to Question
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FlashcardItem;
