
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    <div className="perspective-1000">
      <div
        className={`relative w-full transition-transform duration-500 transform-style-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front of card (Question) */}
        <Card
          className={`p-6 bg-white dark:bg-gray-800 ${
            flipped ? "hidden" : "block"
          } min-h-[250px] flex flex-col`}
        >
          <div className="flex-1 flex flex-col justify-center items-center">
            <h3 className="text-lg font-semibold mb-4 text-center">{question}</h3>
            
            <div className="w-full space-y-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={hasAnswered}
              />
              
              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={handleFlip}>
                  Flip Card
                </Button>
                <Button onClick={checkAnswer} disabled={!userAnswer.trim() || hasAnswered}>
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
          } min-h-[250px] ${
            hasAnswered
              ? isCorrect
                ? "bg-green-50 dark:bg-green-900/20 border-green-200"
                : "bg-red-50 dark:bg-red-900/20 border-red-200"
              : "bg-white dark:bg-gray-800"
          }`}
        >
          <div className="flex flex-col justify-center items-center h-full">
            {hasAnswered && (
              <div
                className={`font-bold text-xl mb-4 ${
                  isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                {isCorrect ? "Correct!" : "Incorrect"}
              </div>
            )}
            
            <h3 className="text-lg font-semibold mb-2">Answer: {answer}</h3>
            
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-4">
              <h4 className="font-medium mb-2">Explanation:</h4>
              <p>{explanation}</p>
            </div>
            
            {!hasAnswered && (
              <Button className="mt-6" onClick={handleFlip}>
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
