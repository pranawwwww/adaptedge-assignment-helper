import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, ArrowRight, ArrowLeft, Lightbulb, BookText, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import AIThinkingLoader from "@/components/AIThinkingLoader";

interface GuidedLearningProps {
  level: number;
  assignmentTitle: string;
  onComplete: () => void;
  onBack: () => void;
}

const GuidedLearning = ({ level, assignmentTitle, onComplete, onBack }: GuidedLearningProps) => {
  const [activeStep, setActiveStep] = useState(1);
  const totalSteps = 4;
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Processing your request...");
  
  // In a real app, these would be generated based on the uploaded materials and level
  const steps = [
    {
      title: "Understanding the Assignment",
      content: (
        <div className="space-y-4">
          <p>Let's break down what this assignment requires:</p>
          
          <div className="bg-accent/20 p-4 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center">
              <BookText className="h-4 w-4 mr-2 text-primary" />
              From your assignment instructions:
            </h3>
            <p className="text-sm italic">
              "Develop a mathematical model that describes the relationship between variables X and Y, and analyze how changes in X affect the outcome of Y."
            </p>
          </div>
          
          <p>This assignment is asking you to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Create a mathematical model for X and Y variables</li>
            <li>Analyze the relationship between these variables</li>
            <li>Discuss how changes in X impact Y</li>
          </ul>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-6">
            <h3 className="font-medium mb-2 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
              Reference Materials:
            </h3>
            <p className="text-sm">
              In your <span className="font-medium">Lecture 4 notes</span>, there's a section on "Relationships Between Variables" that explains the concepts you'll need.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Key Concepts",
      content: (
        <div className="space-y-4">
          <p>Let's review the key concepts needed for this assignment:</p>
          
          <div className="space-y-4">
            <div className="bg-accent/20 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-primary" />
                From your textbook (Chapter 3, page 42):
              </h3>
              <p className="text-sm">
                "Mathematical modeling is the process of using mathematical language to describe the behavior of a system. A model helps us understand, explain, and make predictions about a system."
              </p>
            </div>
            
            <div className="bg-accent/20 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <BookText className="h-4 w-4 mr-2 text-primary" />
                From your lecture notes (Week 3):
              </h3>
              <p className="text-sm">
                "When analyzing relationships between variables, consider both correlation and causation. Not all correlations imply causation."
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Types of Relationships:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Linear relationships (Y = mx + b)</li>
              <li>Exponential relationships (Y = a•e^(bx))</li>
              <li>Logarithmic relationships (Y = a + b•ln(x))</li>
              <li>Power relationships (Y = a•x^b)</li>
            </ul>
          </div>
          
          {level <= 3 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-6">
              <h3 className="font-medium mb-2 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                Guidance:
              </h3>
              <p className="text-sm">
                For this assignment, a linear or exponential model might work best depending on your data. Your textbook has examples of both on pages 45-47.
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Step-by-Step Approach",
      content: (
        <div className="space-y-4">
          <p>Here's how to approach solving this assignment:</p>
          
          <ol className="list-decimal pl-5 space-y-4">
            <li>
              <p className="font-medium">Identify the variables</p>
              <p className="text-sm">Clearly define what X and Y represent in your model.</p>
              
              {level <= 2 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-2 text-sm">
                  <p><span className="font-medium">Example:</span> If analyzing temperature vs. ice cream sales, X would be temperature and Y would be sales volume.</p>
                </div>
              )}
            </li>
            
            <li>
              <p className="font-medium">Collect and organize your data</p>
              <p className="text-sm">Create a table of X and Y values from your data source.</p>
              

              {level <= 3 && (
                <div className="bg-accent/20 p-3 rounded-lg mt-2 text-sm">
                  <h3 className="font-medium mb-1 flex items-center">
                    <BookText className="h-4 w-4 mr-1 text-primary" />
                    From your lab manual (page 15):
                  </h3>
                  <p>"Always plot your data before attempting to fit a model to understand the general pattern."</p>
                </div>
              )}
            </li>
            
            <li>
              <p className="font-medium">Determine the type of relationship</p>
              <p className="text-sm">Based on your plot, determine if the relationship appears linear, exponential, etc.</p>
            </li>
            
            <li>
              <p className="font-medium">Develop your mathematical model</p>
              <p className="text-sm">Create an equation that describes the relationship between X and Y.</p>
              

              {level <= 2 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-2 text-sm">
                  <p><span className="font-medium">Tip:</span> Remember the least squares method from your lecture notes in week 4 for finding the best-fit line.</p>
                </div>
              )}
            </li>
            
            <li>
              <p className="font-medium">Analyze how changes in X affect Y</p>
              <p className="text-sm">Describe the effect of increasing or decreasing X on the value of Y.</p>
            </li>
          </ol>
          
          {level <= 3 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-6">
              <h3 className="font-medium mb-2 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                From your materials:
              </h3>
              <p className="text-sm">
                Your textbook has examples of analyzing relationships on pages 50-52, and your lecture notes from Week 5 cover interpretation techniques in detail.
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Practice & Verification",
      content: (
        <div className="space-y-4">
          <p>Let's check your understanding with some practice questions:</p>
          
          <div className="space-y-6">
            <div className="border p-4 rounded-lg">
              <p className="font-medium mb-2">Question 1:</p>
              <p className="mb-4">If a linear model is represented as Y = 2X + 5, what happens to Y when X increases by 3 units?</p>
              

              {level <= 3 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4 text-sm">
                  <p><span className="font-medium">Hint:</span> Substitute the values into the equation and calculate the difference.</p>
                </div>
              )}
              

              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start mb-2"
              >
                Y increases by 3 units
              </Button>
              

              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start mb-2"
              >
                Y increases by 5 units
              </Button>
              

              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start mb-2 bg-green-50 dark:bg-green-900/20 border-green-500"
              >
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Y increases by 6 units
              </Button>
              

              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start"
              >
                Y increases by 8 units
              </Button>
            </div>
            
            <div className="border p-4 rounded-lg">
              <p className="font-medium mb-2">Question 2:</p>
              <p className="mb-4">Which of the following best describes a logarithmic relationship between X and Y?</p>
              

              {level <= 4 && (
                <div className="bg-accent/20 p-3 rounded-lg mb-4 text-sm">
                  <h3 className="font-medium mb-1 flex items-center">
                    <BookOpen className="h-4 w-4 mr-1 text-primary" />
                    From your textbook (Chapter 3, page 48):
                  </h3>
                  <p>"Logarithmic relationships show rapid growth initially, followed by slower growth as X increases."</p>
                </div>
              )}
              

              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start mb-2"
              >
                Y grows at a constant rate as X increases
              </Button>
              

              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start mb-2 bg-green-50 dark:bg-green-900/20 border-green-500"
              >
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Y grows quickly at first, then more slowly as X increases
              </Button>
              

              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start mb-2"
              >
                Y grows slowly at first, then more quickly as X increases
              </Button>
              

              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start"
              >
                Y decreases as X increases
              </Button>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mt-6">
            <h3 className="font-medium mb-2 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Ready to complete your assignment!
            </h3>
            <p className="text-sm">
              You now have the core concepts and approach needed to complete your assignment on modeling relationships between variables X and Y.
            </p>
          </div>
        </div>
      )
    }
  ];
  
  const handleNext = () => {
    if (activeStep < totalSteps) {
      // Show the AI thinking loader with step-specific messages
      setIsLoading(true);
      const nextStep = activeStep + 1;
      
      // Set loading message based on the next step being loaded
      switch(nextStep) {
        case 2:
          setLoadingMessage("Analyzing key concepts for your assignment...");
          break;
        case 3:
          setLoadingMessage("Developing a step-by-step approach for your level...");
          break;
        case 4:
          setLoadingMessage("Creating practice questions to verify your understanding...");
          break;
        default:
          setLoadingMessage("Processing your request...");
      }
      
      // Simulate AI processing time - in a real app, this would be an API call
      setTimeout(() => {
        setActiveStep(nextStep);
        setIsLoading(false);
      }, 1500);
    } else {
      onComplete();
    }
  };
  
  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    } else {
      onBack();
    }
  };

  // Modal effect when the loader is active
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  return (
    <div className="space-y-6">
      {/* Full-page AI Thinking Loader overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="max-w-lg w-full">
            <AIThinkingLoader message={loadingMessage} />
          </div>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>{assignmentTitle}</CardTitle>
          <CardDescription>
            Level {level} assistance - {level <= 2 ? "Detailed guidance" : level <= 4 ? "Moderate guidance" : "Minimal guidance"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {activeStep}
              </div>
              <div className="ml-2 text-sm font-medium">
                Step {activeStep} of {totalSteps}: {steps[activeStep - 1].title}
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round((activeStep / totalSteps) * 100)}% Complete
            </div>
          </div>
          
          <div className="relative pt-2">
            <div className="mb-4 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-primary transition-all"
                style={{ width: `${(activeStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
          
          <Tabs defaultValue="content" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Learning Content</TabsTrigger>
              <TabsTrigger value="materials">Reference Materials</TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <Card>
                <CardContent className="pt-6">
                  <ScrollArea className="h-[400px] pr-4">
                    {steps[activeStep - 1].content}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="materials">
              <Card>
                <CardContent className="pt-6">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2 flex items-center">
                          <BookText className="h-5 w-5 mr-2 text-primary" />
                          Assignment Instructions
                        </h3>
                        <div className="border p-4 rounded-lg text-sm">
                          <p className="mb-2 font-medium">Mathematical Modeling Assignment</p>
                          <p className="mb-2">
                            Develop a mathematical model that describes the relationship between variables X and Y, and analyze how changes in X affect the outcome of Y.
                          </p>
                          <p className="mb-2">Requirements:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Define your variables clearly</li>
                            <li>Use appropriate mathematical notation</li>
                            <li>Include graphs or visualizations</li>
                            <li>Analyze the implications of your model</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2 flex items-center">
                          <BookOpen className="h-5 w-5 mr-2 text-primary" />
                          Textbook References
                        </h3>
                        <div className="border p-4 rounded-lg text-sm">
                          <p className="mb-2 font-medium">Chapter 3: Mathematical Modeling</p>
                          <p className="mb-2">
                            "Mathematical modeling is the process of using mathematical language to describe the behavior of a system. A model helps us understand, explain, and make predictions about a system."
                          </p>
                          <p>Pages 42-53 cover techniques for modeling relationships between variables.</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2 flex items-center">
                          <BookText className="h-5 w-5 mr-2 text-primary" />
                          Lecture Notes
                        </h3>
                        <div className="border p-4 rounded-lg text-sm">
                          <p className="mb-2 font-medium">Week 3: Relationships Between Variables</p>
                          <p className="mb-2">
                            "When analyzing relationships between variables, consider both correlation and causation. Not all correlations imply causation."
                          </p>
                          <p>Key points covered:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Differentiating correlation and causation</li>
                            <li>Types of variable relationships</li>
                            <li>Methods for analyzing data patterns</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={isLoading}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {activeStep === 1 ? "Back to Level Selection" : "Previous Step"}
            </Button>
            <Button 
              onClick={handleNext}
              disabled={isLoading}
              className="flex items-center"
            >
              {activeStep === totalSteps ? "Complete" : "Next Step"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuidedLearning;
