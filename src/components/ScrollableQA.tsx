import { useState, useEffect, Suspense, lazy } from "react";
import { Check, X, ChevronRight, MessageSquareQuote } from "lucide-react";
// Lazy load ReactMarkdown to improve initial load time
const ReactMarkdown = lazy(() => import('react-markdown'));
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Question {
  id: number;
  question: string;
  answer: string;
  explanation: string;
  options?: string[]; // For MCQ fallback
}

interface FlashcardContent {
  id: number;
  title: string;
  content: string;
  relatedQuestion: number; // ID of the related question
}

interface ScrollableQAProps {
  flashcardContents: FlashcardContent[];
  questions: Question[];
  onComplete: (score: number) => void;
  feedback_md?: string; // Feedback markdown content from LLM response
}

const ScrollableQA = ({ flashcardContents, questions, onComplete, feedback_md }: ScrollableQAProps) => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showMCQ, setShowMCQ] = useState<Record<number, boolean>>({});
  const [feedback, setFeedback] = useState<Record<number, { correct: boolean; message: string }>>({});
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);

  // Track learning phase completion
  const [learningPhaseComplete, setLearningPhaseComplete] = useState(false);
  const [viewedFlashcards, setViewedFlashcards] = useState<number[]>([]);
  const [currentPhase, setCurrentPhase] = useState<"learning" | "testing">("learning");
  const [currentTestIndex, setCurrentTestIndex] = useState(0);

  // Add the current flashcard to viewed cards when component loads
  useEffect(() => {
    if (!viewedFlashcards.includes(flashcardContents[currentIndex].id)) {
      setViewedFlashcards(prev => [...prev, flashcardContents[currentIndex].id]);
    }
  }, [currentIndex, flashcardContents, viewedFlashcards]);

  // Check if learning phase is complete
  useEffect(() => {
    if (viewedFlashcards.length === flashcardContents.length && !learningPhaseComplete) {
      setLearningPhaseComplete(true);
      toast({
        title: "Learning Phase Complete",
        description: "You've reviewed all the content. Let's test your knowledge!",
      });
    }
  }, [viewedFlashcards, flashcardContents.length, learningPhaseComplete, toast]);

  // Find the current flashcard and its related question
  const currentFlashcard = flashcardContents[currentIndex];

  // Get current test question based on phase
  const getCurrentQuestion = () => {
    if (currentPhase === "learning") {
      return questions.find(q => q.id === currentFlashcard.relatedQuestion);
    } else {
      return currentTestIndex < questions.length ? questions[currentTestIndex] : null;
    }
  };

  const currentQuestion = getCurrentQuestion();

  const handleAnswerSubmit = (questionId: number, answer: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    // Update user answer
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));

    // Check if answer is correct
    const isCorrect = answer.toLowerCase().includes(question.answer.toLowerCase());

    if (isCorrect) {
      // Feedback for correct answer
      setFeedback(prev => ({
        ...prev,
        [questionId]: {
          correct: true,
          message: "Correct! Well done."
        }
      }));

      // Mark question as completed
      if (!completedQuestions.includes(questionId)) {
        setCompletedQuestions(prev => [...prev, questionId]);
      }

      // Move to the next item after a delay
      setTimeout(() => {
        if (currentPhase === "learning") {
          if (currentIndex < flashcardContents.length - 1) {
            setCurrentIndex(prev => prev + 1);
            // Clear feedback for the next card
            setFeedback({});
          } else {
            // Ready to switch to testing phase
            setCurrentPhase("testing");
            toast({
              title: "Testing Phase Beginning",
              description: "Now let's test your knowledge of all the material.",
            });
          }
        } else {
          // In testing phase, move to next question
          if (currentTestIndex < questions.length - 1) {
            setCurrentTestIndex(prev => prev + 1);
            setFeedback({});
          } else {
            // All questions completed
            const score = (completedQuestions.length / questions.length) * 100;
            onComplete(score);
          }
        }
      }, 1500);
    } else {
      // Feedback for incorrect answer
      setFeedback(prev => ({
        ...prev,
        [questionId]: {
          correct: false,
          message: `Incorrect. ${question.explanation}`
        }
      }));

      // Show MCQ options for this question
      setShowMCQ(prev => ({ ...prev, [questionId]: true }));
    }
  };

  const handleMCQSelection = (questionId: number, option: string) => {
    handleAnswerSubmit(questionId, option);
  };

  const handleNextFlashcard = () => {
    if (currentIndex < flashcardContents.length - 1) {
      setCurrentIndex(prev => prev + 1);

      // Add next flashcard to viewed cards
      if (!viewedFlashcards.includes(flashcardContents[currentIndex + 1].id)) {
        setViewedFlashcards(prev => [...prev, flashcardContents[currentIndex + 1].id]);
      }
    } else {
      // All flashcards viewed, move to testing phase
      setCurrentPhase("testing");
      toast({
        title: "Testing Phase Beginning",
        description: "Now let's test your knowledge of all the material.",
      });
    }
  };

  // Generate MCQ options for a question
  const getMCQOptions = (question: Question) => {
    if (question.options) return question.options;

    // Create default options if none provided
    const correctAnswer = question.answer;
    const distractors = [
      `Not ${correctAnswer}`,
      `Alternative to ${correctAnswer}`,
      `Opposite of ${correctAnswer}`
    ];

    return [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);
  };

  // Calculate progress percentage based on current phase
  const progressPercentage = currentPhase === "learning"
    ? (viewedFlashcards.length / flashcardContents.length) * 100
    : (completedQuestions.length / questions.length) * 100;

  return (
    <Card className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="mb-4 px-6 pt-6">
        <div className="flex justify-between mb-2">
          <span>
            {currentPhase === "learning"
              ? `Learning Phase: ${viewedFlashcards.length} of ${flashcardContents.length} concepts reviewed`
              : `Testing Phase: ${completedQuestions.length} of ${questions.length} questions completed`
            }
          </span>
          <span>Progress: {progressPercentage.toFixed(0)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <ScrollArea className="h-[500px] px-6 pb-6">
        <div className="space-y-6">
          {currentPhase === "learning" ? (
            // Learning Phase
            currentFlashcard && (
              <div className="animate-fade-in">
                <Card className="p-6 bg-pastel-lavender/30 dark:bg-pastel-lavender/10 border-purple-100 dark:border-purple-900/30 mb-4">
                  <h3 className="text-xl font-bold mb-4">{currentFlashcard.title}</h3>
                  <div className="prose dark:prose-invert">
                    <p>{currentFlashcard.content}</p>
                  </div>
                  <div className="mt-6 text-right">
                    <Button
                      onClick={handleNextFlashcard}
                      className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {currentIndex < flashcardContents.length - 1 ? (
                        <>Next Concept <ChevronRight className="ml-1 h-4 w-4" /></>
                      ) : (
                        <>Start Testing <ChevronRight className="ml-1 h-4 w-4" /></>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>
            )
          ) : (
            // Testing Phase
            currentQuestion && (
              <div className="animate-fade-in">
                <Card className="p-6 border-purple-100 dark:border-purple-900/30">
                  <h3 className="text-xl font-bold mb-4">{currentQuestion.question}</h3>

                  {/* Feedback */}
                  {feedback[currentQuestion.id] && (
                    <div className={`mb-6 p-4 rounded-lg ${
                      feedback[currentQuestion.id].correct
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200'
                    }`}>
                      <div className="flex items-center mb-2">
                        {feedback[currentQuestion.id].correct ? (
                          <Check className="h-5 w-5 text-green-600 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-red-600 mr-2" />
                        )}
                        <span className={feedback[currentQuestion.id].correct ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {feedback[currentQuestion.id].correct ? 'Correct!' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="text-sm">{feedback[currentQuestion.id].message}</p>
                    </div>
                  )}

                  {/* MCQ options if answer was wrong */}
                  {showMCQ[currentQuestion.id] ? (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Select the correct answer:</h4>
                      <RadioGroup
                        defaultValue={userAnswers[currentQuestion.id]}
                        onValueChange={(value) => handleMCQSelection(currentQuestion.id, value)}
                        className="space-y-2"
                      >
                        {getMCQOptions(currentQuestion).map((option, idx) => (
                          <div key={idx} className="flex items-center space-x-2 p-3 rounded-lg border border-purple-100 dark:border-purple-800/30 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                            <RadioGroupItem value={option} id={`option-${idx}`} />
                            <label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">{option}</label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ) : (
                    // Free-form answer if first attempt
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="Type your answer here..."
                        value={userAnswers[currentQuestion.id] || ''}
                        onChange={(e) => setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                        className="w-full p-3 border border-purple-100 dark:border-purple-900/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white/70 dark:bg-gray-800/70"
                        disabled={!!feedback[currentQuestion.id]?.correct}
                      />

                      <div className="mt-4 flex justify-end">
                        <Button
                          onClick={() => handleAnswerSubmit(currentQuestion.id, userAnswers[currentQuestion.id] || '')}
                          disabled={!userAnswers[currentQuestion.id] || !!feedback[currentQuestion.id]?.correct}
                          className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          Submit Answer
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            )
          )}
        </div>
      </ScrollArea>
      {feedback_md && (
        <div className="px-6 pb-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Feedback</h3>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-4 w-full" />}>
                <ReactMarkdown>{feedback_md}</ReactMarkdown>
              </Suspense>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
};

export default ScrollableQA;
