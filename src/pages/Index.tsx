import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Brain, Lightbulb, Award, Sparkles, Upload, FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 pastel-pattern">
      <Navbar />
      
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-float mb-8">
            <Brain className="h-20 w-20 text-primary mx-auto dark-icon" />
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight mb-6 gradient-text animate-fade-in">
            Your AI-Powered Study Assistant
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto animate-slide-up">
            AdaptED AI helps you understand your assignments better by providing personalized 
            learning materials and feedback tailored to your level of understanding.
          </p>
          
          <Button 
            size="lg" 
            className="px-8 py-7 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg rounded-full animate-scale-in"
            onClick={() => navigate("/upload")}
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5 dark-icon" />
          </Button>
          
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-purple-100 dark:border-purple-900/30 card-hover">
              <div className="absolute -top-3 left-0 right-0 mx-auto w-max bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                TO BE IMPLEMENTED
              </div>
              <CardHeader>
                <div className="w-16 h-16 bg-pastel-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-blue-600 dark-icon" />
                </div>
                <CardTitle>Quick Start</CardTitle>
                <CardDescription>
                  Basic tutorials and straightforward answers for a gentle introduction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Perfect for when you're just getting started with a new topic and need the fundamentals explained simply.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="w-full text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={() => navigate("/upload", { state: { helpType: "quick-start" } })}
                >
                  Select Quick Start
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-purple-100 dark:border-purple-900/30 card-hover">
              <div className="absolute -top-3 left-0 right-0 mx-auto w-max bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                TO BE IMPLEMENTED
              </div>
              <CardHeader>
                <div className="w-16 h-16 bg-pastel-pink rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-pink-600 dark-icon" />
                </div>
                <CardTitle>Learn Fast</CardTitle>
                <CardDescription>
                  Hints, nudges, and partial answers for grasping the basics quickly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ideal when you have some familiarity with the subject and want to build your knowledge efficiently.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="w-full text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20"
                  onClick={() => navigate("/upload", { state: { helpType: "learn-fast" } })}
                >
                  Select Learn Fast
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-purple-100 dark:border-purple-900/30 card-hover">
              <div className="absolute -top-3 left-0 right-0 mx-auto w-max bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                ADVANCED LEARNING
              </div>
              <CardHeader>
                <div className="w-16 h-16 bg-pastel-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-green-600 dark-icon" />
                </div>
                <CardTitle>Master It</CardTitle>
                <CardDescription>
                  Full tutorials and interactive material for comprehensive knowledge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  For when you want to truly understand a topic deeply before tackling your assignment.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="w-full text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                  onClick={() => navigate("/upload", { state: { helpType: "master-it" } })}
                >
                  Select Master It
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-24 glass rounded-xl p-8 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4">How AdaptED AI Works</h2>
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-pastel-lavender flex items-center justify-center mb-3">
                  <Upload className="h-6 w-6 text-purple-600 dark-icon" />
                </div>
                <h3 className="font-medium mb-2">Upload Materials</h3>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                  Upload your assignment and optional study materials
                </p>
              </div>
              
              <div className="hidden md:block w-24 h-0.5 bg-gradient-to-r from-transparent via-purple-200 to-transparent self-center"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-pastel-blue flex items-center justify-center mb-3">
                  <Sparkles className="h-6 w-6 text-blue-600 dark-icon" />
                </div>
                <h3 className="font-medium mb-2">Learn & Practice</h3>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                  Study with interactive flashcards and quizzes
                </p>
              </div>
              
              <div className="hidden md:block w-24 h-0.5 bg-gradient-to-r from-transparent via-purple-200 to-transparent self-center"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-pastel-green flex items-center justify-center mb-3">
                  <FileCheck className="h-6 w-6 text-green-600 dark-icon" />
                </div>
                <h3 className="font-medium mb-2">Get Feedback</h3>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                  Complete your assignment with personalized guidance
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-20 flex justify-center">
            <Button 
              size="lg" 
              className="px-8 py-7 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg rounded-full"
              onClick={() => navigate("/upload")}
            >
              Start Learning Now
              <ArrowRight className="ml-2 h-5 w-5 dark-icon" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
