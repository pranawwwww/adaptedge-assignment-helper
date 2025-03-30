
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Brain, Lightbulb, Award } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";

const Process = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedHelpType, setSelectedHelpType] = useState<string>(
    location.state?.helpType || "master-it"
  );
  
  const handleHelpTypeSelect = (type: string) => {
    setSelectedHelpType(type);
    
    // Navigate to flashcards page with selected help type
    navigate("/flashcards", { state: { helpType: type } });
    
    toast({
      title: "Help type selected",
      description: `You've selected ${type === "quick-start" ? "Quick Start" : type === "learn-fast" ? "Learn Fast" : "Master It"} mode.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pastel-pattern">
      <Navbar />
      
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => navigate("/upload")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Upload
            </Button>
            
            <h1 className="text-3xl font-bold tracking-tight">Select Help Type</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Choose the type of assistance that best matches your learning needs.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>How would you like to learn?</CardTitle>
              <CardDescription>
                Each option provides a different level of guidance and depth of understanding.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedHelpType} onValueChange={setSelectedHelpType} className="space-y-4">
                <Card className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${selectedHelpType === "quick-start" ? "border-primary bg-primary/5" : ""}`}>
                  <RadioGroupItem value="quick-start" id="quick-start" className="sr-only" />
                  <label htmlFor="quick-start" className="flex items-start cursor-pointer">
                    <div className="flex-shrink-0 mt-1">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium">Quick Start</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Basic tutorials, resources, and straightforward answers for a gentle introduction to the material.
                      </p>
                    </div>
                  </label>
                </Card>
                
                <Card className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${selectedHelpType === "learn-fast" ? "border-primary bg-primary/5" : ""}`}>
                  <RadioGroupItem value="learn-fast" id="learn-fast" className="sr-only" />
                  <label htmlFor="learn-fast" className="flex items-start cursor-pointer">
                    <div className="flex-shrink-0 mt-1">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium">Learn Fast</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Provides hints, nudges, and partial answers for grasping the basics quickly without diving too deep.
                      </p>
                    </div>
                  </label>
                </Card>
                
                <Card className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${selectedHelpType === "master-it" ? "border-primary bg-primary/5" : ""}`}>
                  <RadioGroupItem value="master-it" id="master-it" className="sr-only" />
                  <label htmlFor="master-it" className="flex items-start cursor-pointer">
                    <div className="flex-shrink-0 mt-1">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium">Master It</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Full tutorials, detailed examples, and interactive flashcards to help you gain comprehensive knowledge.
                      </p>
                    </div>
                  </label>
                </Card>
              </RadioGroup>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={() => handleHelpTypeSelect(selectedHelpType)}>
                  Continue to Flashcards
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Process;
