import React from "react";

interface AIThinkingLoaderProps {
  message?: string;
}

export const AIThinkingLoader: React.FC<AIThinkingLoaderProps> = ({
  message = "AI is thinking...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      {/* Container with gradient border */}
      <div className="relative bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-purple-100 dark:border-purple-800">
        {/* Animated dots */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex space-x-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 animate-pulse`}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {message}
          </span>
        </div>

        {/* Neural network visualization */}
        <div className="relative h-12 w-48">
          <div className="absolute inset-0 flex justify-between">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-full w-0.5 rounded-full bg-gradient-to-b from-purple-200 to-purple-400 dark:from-purple-700 dark:to-purple-500 opacity-70"
              />
            ))}
          </div>

          {/* Animated connection lines and pulses */}
          <div className="absolute inset-0">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute h-2 w-2 rounded-full bg-indigo-500 animate-ping opacity-75"
                style={{
                  left: `${25 + i * 20}%`,
                  top: `${30 + (i % 3) * 20}%`,
                  animationDelay: `${0.5 + i * 0.4}s`,
                  animationDuration: `${1.5 + i * 0.3}s`,
                }}
              />
            ))}

            {/* Moving dot along the path */}
            <div className="absolute top-1/2 h-3 w-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 animate-move-right" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIThinkingLoader;