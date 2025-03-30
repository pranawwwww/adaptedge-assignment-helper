
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Brain, Lightbulb, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pastel-pattern">
      <Navbar />
      
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Your AI-Powered Assignment Helper
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            AdaptED AI helps you understand your assignments better by providing personalized 
            learning materials and feedback tailored to your level of understanding.
          </p>
          
          <Button 
            size="lg" 
            className="px-8 py-6 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
            onClick={() => navigate("/upload")}
          >
            Upload Your Assignment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-purple-100 dark:border-purple-900/30 hover:shadow-md transition-all">
              <CardHeader>
                <Brain className="h-12 w-12 mx-auto text-purple-500 mb-4" />
                <CardTitle>Quick Start</CardTitle>
                <CardDescription>
                  Basic tutorials and straightforward answers for a gentle introduction to the material
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
                  className="w-full"
                  onClick={() => navigate("/upload", { state: { helpType: "quick-start" } })}
                >
                  Select Quick Start
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-purple-100 dark:border-purple-900/30 hover:shadow-md transition-all">
              <CardHeader>
                <Lightbulb className="h-12 w-12 mx-auto text-purple-500 mb-4" />
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
                  className="w-full"
                  onClick={() => navigate("/upload", { state: { helpType: "learn-fast" } })}
                >
                  Select Learn Fast
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-purple-100 dark:border-purple-900/30 hover:shadow-md transition-all">
              <CardHeader>
                <Award className="h-12 w-12 mx-auto text-purple-500 mb-4" />
                <CardTitle>Master It</CardTitle>
                <CardDescription>
                  Full tutorials and interactive material to help you gain comprehensive knowledge
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
                  className="w-full"
                  onClick={() => navigate("/upload", { state: { helpType: "master-it" } })}
                >
                  Select Master It
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-16 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-purple-100 dark:border-purple-900/30">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">1</span>
                </div>
                <h3 className="font-medium mb-2">Upload</h3>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                  Upload your assignment and optional study materials
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">2</span>
                </div>
                <h3 className="font-medium mb-2">Learn</h3>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                  Study with interactive flashcards and quizzes
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">3</span>
                </div>
                <h3 className="font-medium mb-2">Apply</h3>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                  Complete your assignment with personalized guidance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
