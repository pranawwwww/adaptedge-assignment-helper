
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ArrowRight, Brain, Lightbulb, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import FlashcardItem from "@/components/FlashcardItem";

// Sample flashcards for demonstration
const sampleFlashcards = [
  {
    id: 1,
    question: "What is the law of conservation of energy?",
    answer: "Energy cannot be created or destroyed",
    explanation: "The law of conservation of energy states that energy cannot be created or destroyed in an isolated system; it can only be transformed from one form to another."
  },
  {
    id: 2,
    question: "What is Newton's second law of motion?",
    answer: "F = ma",
    explanation: "Newton's second law states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. The formula is F = ma."
  },
  {
    id: 3,
    question: "What is the formula for calculating potential energy?",
    answer: "PE = mgh",
    explanation: "The gravitational potential energy is calculated as mass (m) times gravitational acceleration (g) times height (h)."
  },
  {
    id: 4,
    question: "What is Ohm's Law?",
    answer: "V = IR",
    explanation: "Ohm's Law states that the current through a conductor between two points is directly proportional to the voltage across the two points. The formula is V = IR, where V is voltage, I is current, and R is resistance."
  },
  {
    id: 5,
    question: "What is the formula for kinetic energy?",
    answer: "KE = 0.5mv²",
    explanation: "Kinetic energy is the energy of motion, calculated as one-half times the mass of the object times the square of its velocity."
  }
];

const Flashcards = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [helpType, setHelpType] = useState<string>("master-it");

  useEffect(() => {
    // Extract help type from location state if available
    if (location.state && location.state.helpType) {
      setHelpType(location.state.helpType);
    }
  }, [location]);

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    setTotalAnswered(prev => prev + 1);
    
    // Check if we should move to the next card
    setTimeout(() => {
      if (currentIndex < sampleFlashcards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // Calculate score
        const score = ((correctAnswers + (correct ? 1 : 0)) / sampleFlashcards.length) * 100;
        
        if (score >= 80) {
          setQuizComplete(true);
          toast({
            title: "Quiz Complete!",
            description: `You scored ${score.toFixed(0)}%. Great job!`,
          });
        } else {
          toast({
            title: "Quiz Complete",
            description: `You scored ${score.toFixed(0)}%. You need 80% to proceed. Let's try again.`,
          });
          // Reset quiz
          setCurrentIndex(0);
          setCorrectAnswers(0);
          setTotalAnswered(0);
        }
      }
    }, 1500);
  };

  const progressPercentage = (totalAnswered / sampleFlashcards.length) * 100;
  const scorePercentage = totalAnswered > 0 
    ? (correctAnswers / totalAnswered) * 100 
    : 0;

  const proceedToAssignment = () => {
    navigate("/assignment", { state: { helpType } });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pastel-pattern">
      <Navbar />
      
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <Button 
              variant="ghost" 
              className="flex items-center" 
              onClick={() => navigate("/process")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Help Selection
            </Button>
            
            <div className="flex items-center">
              {helpType === "quick-start" && (
                <Button variant="outline" className="flex items-center" disabled>
                  <Brain className="mr-2 h-4 w-4" />
                  Quick Start Mode
                </Button>
              )}
              {helpType === "learn-fast" && (
                <Button variant="outline" className="flex items-center" disabled>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Learn Fast Mode
                </Button>
              )}
              {helpType === "master-it" && (
                <Button variant="outline" className="flex items-center" disabled>
                  <Award className="mr-2 h-4 w-4" />
                  Master It Mode
                </Button>
              )}
            </div>
          </div>
          
          <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Interactive Flashcards</CardTitle>
              <CardDescription>
                Test your knowledge on these concepts. You need to answer 80% correctly to proceed to the assignment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span>Progress: {totalAnswered} of {sampleFlashcards.length} cards</span>
                  <span>Score: {scorePercentage.toFixed(0)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              {!quizComplete ? (
                <FlashcardItem 
                  key={sampleFlashcards[currentIndex].id}
                  question={sampleFlashcards[currentIndex].question}
                  answer={sampleFlashcards[currentIndex].answer}
                  explanation={sampleFlashcards[currentIndex].explanation}
                  onAnswer={handleAnswer}
                />
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-2xl font-bold mb-4">Quiz Completed!</h3>
                  <p className="mb-6">
                    You've demonstrated a good understanding of the material. 
                    Now you can proceed to the assignment.
                  </p>
                  <Button onClick={proceedToAssignment}>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Continue to Assignment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
