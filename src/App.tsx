import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Upload from "./pages/Upload";
import Process from "./pages/Process";
import Flashcards from "./pages/Flashcards";
import Assignment from "./pages/Assignment";
import MasterIt from "./pages/MasterIt";
import AILoadingOverlay from "./components/AILoadingOverlay";

// Create a QueryClient for data fetching (will be used with Supabase)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="adaptedge-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Toast notifications */}
        <Toaster />
        <Sonner 
          position="top-right" 
          closeButton 
          className="glass" 
          toastOptions={{
            className: "glass border-purple-100 dark:border-purple-900/30 rounded-xl",
          }}
        />
        
        {/* Global AI Loading Overlay */}
        <AILoadingOverlay />
        
        {/* Main app routing */}
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/process" element={<Process />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/assignment" element={<Assignment />} />
              <Route path="/master-it" element={<MasterIt />} />
              <Route path="/master-it/:levelId" element={<MasterIt />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
