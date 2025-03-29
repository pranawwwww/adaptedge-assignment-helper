
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Upload, BarChart4, Brain, BookText, FileUp, Lightbulb, Sparkles, GraduationCap } from "lucide-react";
import Navbar from "@/components/Navbar";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const features = [
    {
      title: "Personalized Learning",
      description: "Adaptive assignments that match your learning level (1-5)",
      icon: <GraduationCap className="h-8 w-8 text-primary mb-2" />
    },
    {
      title: "Material Integration",
      description: "Upload lecture notes, textbooks, and class materials",
      icon: <BookText className="h-8 w-8 text-primary mb-2" />
    },
    {
      title: "Contextual References",
      description: "AI refers to your course materials when explaining concepts",
      icon: <Lightbulb className="h-8 w-8 text-primary mb-2" />
    },
    {
      title: "Knowledge Verification",
      description: "Quiz to ensure understanding of key concepts",
      icon: <Sparkles className="h-8 w-8 text-primary mb-2" />
    }
  ];

  const steps = [
    {
      title: "Material Integration",
      description: "Upload lecture notes, textbook chapters, and assignment instructions.",
      icon: <Upload className="h-6 w-6 text-primary" />
    },
    {
      title: "Material Analysis",
      description: "AI processes uploaded content to understand course concepts and requirements.",
      icon: <Brain className="h-6 w-6 text-primary" />
    },
    {
      title: "Level Selection",
      description: "Choose assistance level (1-5) based on your learning needs.",
      icon: <BarChart4 className="h-6 w-6 text-primary" />
    },
    {
      title: "Guided Learning",
      description: "Get contextualized explanations connecting your materials to the assignment.",
      icon: <BookOpen className="h-6 w-6 text-primary" />
    },
    {
      title: "Knowledge Verification",
      description: "Complete quizzes that check your understanding of material-specific concepts.",
      icon: <BookText className="h-6 w-6 text-primary" />
    },
    {
      title: "Contribution Assessment",
      description: "Receive feedback on your comprehension and application of course concepts.",
      icon: <FileUp className="h-6 w-6 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              <span className="gradient-text">Adaptive</span> Assignment
              <br /> Helper for Students
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Don't just complete assignments—understand them. Our AI-powered assistant adapts to your level and helps you grasp concepts through your own course materials.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">Get Started</Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">Try Demo</Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
              alt="Student learning with AI" 
              className="rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Features That Enhance Your Learning</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              AdaptED AI doesn't just help you complete assignments—it helps you understand the concepts behind them.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="flex flex-col items-center text-center">
                  {feature.icon}
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-2">{feature.title}</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How AdaptED AI Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our step-by-step process ensures that you not only complete your assignments but understand the concepts behind them.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`step-card ${currentStep === index + 1 ? 'step-card-active' : ''}`}
                onMouseEnter={() => setCurrentStep(index + 1)}
              >
                <div className="step-number">{index + 1}</div>
                <div className="flex flex-col">
                  <div className="flex items-center mb-4">
                    {step.icon}
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white ml-2">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to transform how you approach assignments?
          </h2>
          <p className="text-xl text-primary-foreground mb-8 max-w-3xl mx-auto">
            Join AdaptED AI today and experience a new way of learning that adapts to your needs and helps you truly understand course concepts.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="font-medium">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Brain className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">AdaptED <span className="text-primary">AI</span></span>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
              <a href="#" className="text-gray-300 hover:text-white">About</a>
              <a href="#" className="text-gray-300 hover:text-white">Features</a>
              <a href="#" className="text-gray-300 hover:text-white">Privacy</a>
              <a href="#" className="text-gray-300 hover:text-white">Terms</a>
              <a href="#" className="text-gray-300 hover:text-white">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} AdaptED AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
