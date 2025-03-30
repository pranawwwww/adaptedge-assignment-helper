
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ArrowRight, Brain, Lightbulb, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import ScrollableQA from "@/components/ScrollableQA";

// Sample flashcard content for demonstration
const sampleFlashcardContents = [
  {
    id: 1,
    title: "Conservation of Energy",
    content: "The law of conservation of energy states that energy cannot be created or destroyed in an isolated system; it can only be transformed from one form to another. This fundamental principle is crucial in physics and engineering applications.",
    relatedQuestion: 1
  },
  {
    id: 2,
    title: "Newton's Second Law of Motion",
    content: "Newton's second law of motion states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. It is expressed mathematically as F = ma, where F is force, m is mass, and a is acceleration.",
    relatedQuestion: 2
  },
  {
    id: 3,
    title: "Gravitational Potential Energy",
    content: "Gravitational potential energy is the energy stored in an object due to its position in a gravitational field. The formula for calculating gravitational potential energy near Earth's surface is PE = mgh, where m is mass, g is gravitational acceleration, and h is height.",
    relatedQuestion: 3
  },
  {
    id: 4,
    title: "Ohm's Law",
    content: "Ohm's Law describes the relationship between voltage, current, and resistance in an electrical circuit. It states that the current through a conductor between two points is directly proportional to the voltage across the two points. The mathematical formula is V = IR, where V is voltage, I is current, and R is resistance.",
    relatedQuestion: 4
  },
  {
    id: 5,
    title: "Kinetic Energy",
    content: "Kinetic energy is the energy associated with motion. An object that has motion has kinetic energy, and the amount of energy depends on both its mass and speed. The formula for calculating kinetic energy is KE = 0.5mv², where m is mass and v is velocity.",
    relatedQuestion: 5
  }
];

// Sample questions for demonstration
const sampleQuestions = [
  {
    id: 1,
    question: "What is the law of conservation of energy?",
    answer: "Energy cannot be created or destroyed",
    explanation: "The law of conservation of energy states that energy cannot be created or destroyed in an isolated system; it can only be transformed from one form to another.",
    options: [
      "Energy cannot be created or destroyed",
      "Energy can be created but not destroyed",
      "Energy constantly increases in a system",
      "Energy naturally dissipates over time"
    ]
  },
  {
    id: 2,
    question: "What is Newton's second law of motion?",
    answer: "F = ma",
    explanation: "Newton's second law states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. The formula is F = ma.",
    options: [
      "F = ma",
      "F = mv",
      "F = m/a",
      "F = m²a"
    ]
  },
  {
    id: 3,
    question: "What is the formula for calculating potential energy?",
    answer: "PE = mgh",
    explanation: "The gravitational potential energy is calculated as mass (m) times gravitational acceleration (g) times height (h).",
    options: [
      "PE = mgh",
      "PE = mv²",
      "PE = mh/g",
      "PE = mg²h"
    ]
  },
  {
    id: 4,
    question: "What is Ohm's Law?",
    answer: "V = IR",
    explanation: "Ohm's Law states that the current through a conductor between two points is directly proportional to the voltage across the two points. The formula is V = IR, where V is voltage, I is current, and R is resistance.",
    options: [
      "V = IR",
      "I = VR",
      "R = VI",
      "V = I/R"
    ]
  },
  {
    id: 5,
    question: "What is the formula for kinetic energy?",
    answer: "KE = 0.5mv²",
    explanation: "Kinetic energy is the energy of motion, calculated as one-half times the mass of the object times the square of its velocity.",
    options: [
      "KE = 0.5mv²",
      "KE = mv",
      "KE = m²v",
      "KE = mv²/2g"
    ]
  }
];

const Flashcards = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [quizComplete, setQuizComplete] = useState(false);
  const [helpType, setHelpType] = useState<string>("master-it");

  useEffect(() => {
    // Extract help type from location state if available
    if (location.state && location.state.helpType) {
      setHelpType(location.state.helpType);
    }
  }, [location]);

  const handleQuizComplete = (score: number) => {
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
    }
  };

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
              <CardTitle>Two-Phase Learning</CardTitle>
              <CardDescription>
                First learn the concepts, then test your knowledge. You need to answer 80% correctly to proceed to the assignment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!quizComplete ? (
                <ScrollableQA 
                  flashcardContents={sampleFlashcardContents}
                  questions={sampleQuestions}
                  onComplete={handleQuizComplete}
                />
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-2xl font-bold mb-4">Learning Complete!</h3>
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
