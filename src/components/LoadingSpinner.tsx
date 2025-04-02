import { cn } from "@/lib/utils";
import { Brain, Lightbulb, Sparkles, Star, Bot } from "lucide-react";

interface LoadingSpinnerProps {
  fullPage?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ 
  fullPage = false, 
  size = "md",
  className 
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };
  
  const sizeClass = sizes[size];
  
  return (
    <div className={cn(
      "flex flex-col items-center justify-center",
      fullPage ? "fixed inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-50" : "",
      className
    )}>
      {/* Fun animated spinner */}
      <div className="relative h-28 w-28">
        {/* Central brain with bounce-rotate animation */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Brain 
            className={cn(
              "text-primary animate-bounce-rotate", 
              size === "lg" ? "w-16 h-16" : "w-12 h-12"
            )} 
          />
        </div>
        
        {/* Orbiting elements */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-full">
          <div className="absolute h-full w-full animate-spin-slow">
            <Lightbulb className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-yellow-400" />
            <Star className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-6 h-6 text-blue-400" />
            <Sparkles className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-400" />
            <Bot className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-green-400" />
          </div>
        </div>
        
        {/* Outer ring with glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-28 h-28 border-4 border-primary/30 animate-pulse"></div>
      </div>
      
      <div className="mt-6 text-sm font-medium text-gray-700 dark:text-gray-300 animate-float">
        Processing Knowledge...
      </div>
      
      <div className="mt-3 max-w-[220px] text-center text-xs text-gray-500 dark:text-gray-400">
        Adapting content to your learning needs
      </div>
      
      <div className="mt-4 w-48 bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-loading-bar"></div>
      </div>
    </div>
  );
}