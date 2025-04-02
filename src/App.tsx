import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useOutlet } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PageTransition } from "@/components/PageTransition";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Upload from "./pages/Upload";
import Process from "./pages/Process";
import Flashcards from "./pages/Flashcards";
import Assignment from "./pages/Assignment";
import MasterIt from "./pages/MasterIt";

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

// AnimatedRoutes component to wrap all routes with PageTransition
function AnimatedRoutes() {
  const location = useLocation();
  const currentOutlet = useOutlet();
  
  return <PageTransition key={location.pathname}>{currentOutlet}</PageTransition>;
}

// Get the base URL from Vite's environment variable
const baseUrl = import.meta.env.BASE_URL;

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="adaptedge-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner 
          position="top-right" 
          closeButton 
          className="glass" 
          toastOptions={{
            className: "glass border-purple-100 dark:border-purple-900/30 rounded-xl",
          }}
        />
        
        <BrowserRouter basename={baseUrl}>
          <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 flex flex-col">
            <Routes>
              <Route element={<AnimatedRoutes />}>
                <Route path="/" element={<Index />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/process" element={<Process />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/assignment" element={<Assignment />} />
                <Route path="/master-it" element={<MasterIt />} />
                <Route path="/master-it/:levelId" element={<MasterIt />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
