
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, RotateCw } from "lucide-react";

interface FlashcardItemProps {
  question: string;
  answer: string;
  explanation: string;
  onAnswer: (correct: boolean) => void;
}

const FlashcardItem = ({ question, answer, explanation, onAnswer }: FlashcardItemProps) => {
  const [flipped, setFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleFlip = () => {
    if (!hasAnswered) {
      setFlipped(!flipped);
    }
  };

  const checkAnswer = () => {
    // Simple check - if the answer contains the correct answer (case insensitive)
    const isAnswerCorrect = userAnswer.toLowerCase().includes(answer.toLowerCase());
    setIsCorrect(isAnswerCorrect);
    setHasAnswered(true);
    setFlipped(true);
    
    // Delay the notification to the parent to show the result first
    setTimeout(() => {
      onAnswer(isAnswerCorrect);
      // Reset the state for next card
      setFlipped(false);
      setUserAnswer("");
      setHasAnswered(false);
      setIsCorrect(false);
    }, 1500);
  };

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto">
      <div
        className={`relative w-full transition-transform duration-500 transform-style-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front of card (Question) */}
        <Card
          className={`p-6 glass border-purple-100 dark:border-purple-900/30 ${
            flipped ? "hidden" : "block"
          } min-h-[280px] flex flex-col rounded-xl shadow-md`}
        >
          <div className="absolute top-4 right-4">
            <div className="w-8 h-8 rounded-full bg-pastel-lavender flex items-center justify-center text-xs font-semibold text-purple-700">
              Q
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-center">
            <h3 className="text-xl font-semibold mb-6 text-center">{question}</h3>
            
            <div className="w-full space-y-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-3 border border-purple-100 dark:border-purple-900/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white/70 dark:bg-gray-800/70"
                disabled={hasAnswered}
              />
              
              <div className="flex justify-center space-x-3 mt-4">
                <Button 
                  variant="outline" 
                  onClick={handleFlip}
                  className="rounded-xl border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/20"
                >
                  <RotateCw className="mr-2 h-4 w-4" />
                  Flip Card
                </Button>
                <Button 
                  onClick={checkAnswer} 
                  disabled={!userAnswer.trim() || hasAnswered}
                  className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Submit Answer
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Back of card (Answer and Explanation) */}
        <Card
          className={`p-6 rotate-y-180 absolute top-0 left-0 w-full ${
            flipped ? "block" : "hidden"
          } min-h-[280px] rounded-xl shadow-md ${
            hasAnswered
              ? isCorrect
                ? "bg-green-50/90 dark:bg-green-900/20 border-green-200"
                : "bg-red-50/90 dark:bg-red-900/20 border-red-200"
              : "glass border-purple-100 dark:border-purple-900/30"
          }`}
        >
          <div className="absolute top-4 right-4">
            <div className="w-8 h-8 rounded-full bg-pastel-blue flex items-center justify-center text-xs font-semibold text-blue-700">
              A
            </div>
          </div>
          
          <div className="flex flex-col justify-center items-center h-full">
            {hasAnswered && (
              <div className="mb-6">
                {isCorrect ? (
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                    <X className="h-8 w-8 text-red-600" />
                  </div>
                )}
                <p className={`text-center font-bold text-lg mt-2 ${
                  isCorrect ? "text-green-600" : "text-red-600"
                }`}>
                  {isCorrect ? "Correct!" : "Incorrect"}
                </p>
              </div>
            )}
            
            <h3 className="text-lg font-semibold mb-4">Answer: {answer}</h3>
            
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-4 bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Explanation:</h4>
              <p>{explanation}</p>
            </div>
            
            {!hasAnswered && (
              <Button 
                className="mt-6 rounded-xl" 
                variant="outline"
                onClick={handleFlip}
              >
                <RotateCw className="mr-2 h-4 w-4" />
                Back to Question
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FlashcardItem;
