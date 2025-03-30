
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Upload, Brain, FileUp, Lightbulb, Sparkles, ChevronDown, Award } from "lucide-react";
import Navbar from "@/components/Navbar";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Observer for scroll animations
  useEffect(() => {
    setIsVisible(true);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.add('opacity-100');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach(el => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      title: "Interactive Flashcards",
      description: "Test your knowledge with flip cards that adapt to your learning style",
      icon: <Sparkles className="h-12 w-12 text-primary mb-3" />,
      color: "pastel-gradient-blue"
    },
    {
      title: "Material Integration",
      description: "Upload lecture notes, textbooks, and class materials",
      icon: <Upload className="h-12 w-12 text-primary mb-3" />,
      color: "pastel-gradient-purple"
    },
    {
      title: "Contextual References",
      description: "AI refers to your course materials when explaining concepts",
      icon: <Lightbulb className="h-12 w-12 text-primary mb-3" />,
      color: "pastel-gradient-peach"
    },
    {
      title: "Personalized Feedback",
      description: "Get tailored feedback based on your chosen learning style",
      icon: <Award className="h-12 w-12 text-primary mb-3" />,
      color: "pastel-gradient-sunshine"
    }
  ];

  const helpTypes = [
    {
      title: "Quick Start",
      description: "Basic tutorials and resources for a gentle introduction to the material",
      icon: <Brain className="h-10 w-10 text-primary mb-3" />,
      color: "pastel-gradient-blue"
    },
    {
      title: "Learn Fast",
      description: "Hints and partial answers to grasp basics quickly without diving deep",
      icon: <Lightbulb className="h-10 w-10 text-primary mb-3" />,
      color: "pastel-gradient-lavender"
    },
    {
      title: "Master It",
      description: "Comprehensive tutorials and interactive flashcards for deep understanding",
      icon: <Award className="h-10 w-10 text-primary mb-3" />,
      color: "pastel-gradient-mint"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Navbar />
      
      {/* Hero Section with Animation */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 pastel-pattern opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 flex flex-col md:flex-row items-center relative z-10">
          <div className={`md:w-1/2 mb-10 md:mb-0 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              <span className="gradient-text">Adaptive</span> Learning
              <br /> For Your Assignments
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Don't just complete assignments—understand them. Our flashcard-based learning system adapts to your style and helps you master concepts through your own course materials.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/process">
                <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 rounded-full">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Assignment
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="w-full sm:w-auto hover-lift rounded-full">
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
          <div className={`md:w-1/2 flex justify-center ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
            <img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
              alt="Student learning with AI" 
              className="rounded-lg shadow-xl max-w-full h-auto hover-lift"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <button 
            onClick={scrollToFeatures}
            className="bg-white/30 backdrop-blur-sm p-2 rounded-full mb-4 hover:bg-white/50 transition-all duration-300 animate-pulse"
          >
            <ChevronDown className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </div>
      
      {/* Help Types Section */}
      <div id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Learning Style</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              AdaptED AI offers different learning approaches to match your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {helpTypes.map((type, index) => (
              <div key={index} className={`hover-lift rounded-xl overflow-hidden scroll-animate stagger-item`}>
                <div className={`h-full flex flex-col items-center text-center p-8 ${type.color}`}>
                  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-full mb-4">
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{type.title}</h3>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">{type.description}</p>
                  <Link to="/process" className="mt-6">
                    <Button variant="secondary" className="shadow-sm">
                      Start Learning
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Features That Enhance Your Learning</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              AdaptED AI doesn't just help you complete assignments—it helps you understand the concepts through interactive learning.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`hover-lift rounded-xl overflow-hidden scroll-animate stagger-item`}>
                <div className={`h-full flex flex-col items-center text-center p-6 ${feature.color}`}>
                  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-full mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800 pastel-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How AdaptED AI Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our flashcard-based approach ensures you not only complete assignments but truly understand the concepts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
            <div className="scroll-animate stagger-item">
              <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 overflow-hidden">
                <CardContent className="p-0">
                  <img 
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Interactive learning" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Step 1: Upload Materials</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Upload your assignment and course materials. Our AI analyzes them to create personalized flashcards and quizzes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="scroll-animate stagger-item">
              <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 overflow-hidden">
                <CardContent className="p-0">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Interactive flashcards" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Step 2: Learn with Flashcards</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Study interactive flashcards that test your knowledge. Flip cards to reveal answers and explanations.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="scroll-animate stagger-item">
              <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 overflow-hidden">
                <CardContent className="p-0">
                  <img 
                    src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Quiz completion" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Step 3: Test Your Knowledge</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Complete quizzes to verify your understanding. Get immediate feedback with detailed explanations.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="scroll-animate stagger-item">
              <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 overflow-hidden">
                <CardContent className="p-0">
                  <img 
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Assignment completion" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Step 4: Complete Your Assignment</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Apply what you've learned to complete your assignment. Receive personalized feedback to improve your work.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section with animation */}
      <div className="bg-primary/20 dark:bg-primary/10 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-purple-200/30 dark:from-blue-900/30 dark:to-purple-900/30"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-10 rounded-2xl shadow-xl max-w-4xl mx-auto scroll-animate">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to transform how you approach assignments?
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Join AdaptED AI today and experience interactive learning with flashcards that adapt to your needs and help you truly understand course concepts.
            </p>
            <Link to="/process">
              <Button size="lg" variant="default" className="font-medium rounded-full shadow-lg hover:shadow-xl px-8">
                Start Learning Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Brain className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">Adapt<span className="text-primary">ED AI</span></span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
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
