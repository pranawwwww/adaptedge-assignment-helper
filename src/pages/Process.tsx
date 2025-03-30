
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, BookOpen, Upload, Brain, BarChart4, FileText, Lightbulb, CheckCircle, Award } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import MaterialUpload from "@/components/MaterialUpload";
import CourseSelection from "@/components/CourseSelection";

const Process = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [uploadedMaterials, setUploadedMaterials] = useState<File[]>([]);
  const [uploadedAssignment, setUploadedAssignment] = useState<File[]>([]);
  const [selectedHelpType, setSelectedHelpType] = useState<string>("master-it");
  
  const steps = [
    {
      id: 1,
      title: "Select Course",
      description: "Choose the course for which you need assignment help.",
      icon: BookOpen
    },
    {
      id: 2,
      title: "Upload Materials",
      description: "Upload lecture notes, textbook chapters, and other study materials.",
      icon: Upload
    },
    {
      id: 3,
      title: "Upload Assignment",
      description: "Upload your assignment instructions, rubrics, and requirements.",
      icon: FileText
    },
    {
      id: 4,
      title: "Material Analysis",
      description: "AI processes your materials to understand course concepts.",
      icon: Brain
    },
    {
      id: 5,
      title: "Select Help Type",
      description: "Choose the type of help you need for your assignment.",
      icon: BarChart4
    },
    {
      id: 6,
      title: "Study & Learn",
      description: "Study flashcards and complete the assignment with guidance.",
      icon: Lightbulb
    }
  ];
  
  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId);
    goToNextStep();
  };
  
  const handleMaterialsUpload = (files: File[]) => {
    setUploadedMaterials(files);
    goToNextStep();
  };
  
  const handleAssignmentUpload = (files: File[]) => {
    setUploadedAssignment(files);
    simulateMaterialAnalysis();
  };
  
  const simulateMaterialAnalysis = () => {
    setCurrentStep(4);
    
    // Simulate AI processing time
    setTimeout(() => {
      goToNextStep();
    }, 3000);
  };
  
  const handleHelpTypeSelect = (type: string) => {
    setSelectedHelpType(type);
    
    // Navigate to flashcards page with selected help type
    navigate("/flashcards", { state: { helpType: type } });
  };
  
  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <CourseSelection onCourseSelect={handleCourseSelect} />;
      case 2:
        return (
          <MaterialUpload
            type="notes"
            onUploadComplete={handleMaterialsUpload}
          />
        );
      case 3:
        return (
          <MaterialUpload
            type="assignment"
            onUploadComplete={handleAssignmentUpload}
          />
        );
      case 4:
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-10">
                <Brain className="h-16 w-16 text-primary animate-pulse mb-4" />
                <h3 className="text-xl font-medium mb-2">Analyzing Your Materials</h3>
                <p className="text-center text-gray-500 dark:text-gray-400 max-w-md mb-6">
                  Our AI is processing your course materials and assignment instructions to understand the concepts and requirements.
                </p>
                <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full animate-progress" style={{ width: '75%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Select Help Type</CardTitle>
              <CardDescription>
                Choose the type of assistance that best matches your learning needs.
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
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={goToPreviousStep}
              disabled={currentStep === 1 || currentStep === 4}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <h1 className="text-3xl font-bold tracking-tight">Assignment Helper</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Get personalized assistance that adapts to your learning style.
            </p>
          </div>
          
          <div className="mb-8">
            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                {steps.map((step) => (
                  <div 
                    key={step.id}
                    className={`flex flex-col items-center ${step.id <= currentStep ? "text-primary" : "text-gray-400"}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.id < currentStep ? "bg-primary text-white" : 
                      step.id === currentStep ? "border-2 border-primary" : "border-2 border-gray-300"
                    }`}>
                      {step.id < currentStep ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className="text-xs mt-2 hidden md:block">{step.title}</span>
                  </div>
                ))}
              </div>
              
              <div className="absolute top-5 left-0 right-0 h-0.5 -z-10">
                <div className="bg-gray-200 dark:bg-gray-700 h-full w-full">
                  <div 
                    className="bg-primary h-full transition-all duration-500" 
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <Card className="bg-accent/10 border-none shadow-none">
              <CardHeader>
                <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                <CardDescription>{steps[currentStep - 1].description}</CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default Process;
