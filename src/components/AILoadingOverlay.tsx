import React, { useEffect } from "react";
import AIThinkingLoader from "./AIThinkingLoader";
import { useLoadingState } from "@/lib/masterLevelService";

/**
 * A global overlay component that shows an AI thinking animation
 * when async operations are in progress. Uses the global loading state.
 */
const AILoadingOverlay: React.FC = () => {
  const { isLoading, message } = useLoadingState();
  
  // Prevent body scroll when overlay is active
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

  if (!isLoading) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300" 
      aria-hidden="true"
    >
      <div className="max-w-lg w-full px-4">
        <AIThinkingLoader message={message} />
      </div>
    </div>
  );
};

export default AILoadingOverlay;