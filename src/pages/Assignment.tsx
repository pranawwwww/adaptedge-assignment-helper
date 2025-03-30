
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Brain, Lightbulb, Award, ThumbsUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";

const Assignment = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [helpType, setHelpType] = useState<string>("master-it");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Extract help type from location state if available
    if (location.state && location.state.helpType) {
      setHelpType(location.state.helpType);
    }
  }, [location]);

  const handleSubmit = () => {
    if (!answer.trim()) {
      toast({
        title: "Empty Answer",
        description: "Please provide an answer to the assignment question.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call to LLM backend
    setTimeout(() => {
      // Different feedback based on help type
      let feedbackText = "";
      
      if (helpType === "quick-start") {
        feedbackText = "Your answer shows basic understanding of the concept. Try to expand on the relationship between force and acceleration in your explanation. Consider how mass affects this relationship.";
      } else if (helpType === "learn-fast") {
        feedbackText = "Good work on explaining Newton's Second Law! Your explanation of F = ma is accurate, but you could strengthen your answer by including a real-world example that demonstrates this principle in action.";
      } else {
        feedbackText = "Excellent explanation of Newton's Second Law! You've clearly demonstrated understanding of how force, mass, and acceleration are related. Your example of a car accelerating perfectly illustrates the concept. To further enhance your response, consider discussing how this law applies in cases where the mass changes (like rockets).";
      }
      
      setFeedback(feedbackText);
      setSubmitted(true);
      setLoading(false);
      
      toast({
        title: "Assignment Submitted!",
        description: "Your answer has been analyzed and feedback is ready.",
      });
    }, 2000);
  };

  const handleRestart = () => {
    navigate("/");
    toast({
      title: "Learning Session Completed",
      description: "Start a new assignment when you're ready!",
    });
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
              onClick={() => navigate("/flashcards", { state: { helpType } })}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Flashcards
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
              <CardTitle>Assignment Question</CardTitle>
              <CardDescription>
                Apply the concepts you've learned to answer this question.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-accent/20 rounded-lg mb-6">
                <h3 className="font-medium text-lg mb-2">Physics Homework - Newton's Laws</h3>
                <p>
                  Explain Newton's Second Law of Motion and provide an example of how it applies in everyday life. 
                  Discuss the relationship between force, mass, and acceleration, and how changes in each variable 
                  affect the motion of an object.
                </p>
              </div>
              
              <Textarea
                placeholder="Type your answer here..."
                className="min-h-[200px]"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={submitted}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              {!submitted ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={!answer.trim() || loading}
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Answer
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={handleRestart}
                  className="w-full sm:w-auto"
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Complete & Start New Assignment
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {submitted && (
            <Card className="bg-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle>Personalized Feedback</CardTitle>
                <CardDescription>
                  Based on your answer and learning style
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">{feedback}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assignment;
