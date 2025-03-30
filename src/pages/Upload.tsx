import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Upload as UploadIcon, FileText, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import { processFilesForUpload } from "@/lib/fileUploadService";

const Upload = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [studyMaterials, setStudyMaterials] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Get the help type from location state if available
  const helpType = location.state?.helpType || "master-it";

  // Configuration from environment variables
  const MAX_FILE_SIZE = import.meta.env.VITE_MAX_UPLOAD_SIZE_MB 
    ? parseInt(import.meta.env.VITE_MAX_UPLOAD_SIZE_MB) * 1024 * 1024 
    : 10 * 1024 * 1024; // Default to 10MB if not specified
  
  const ALLOWED_FILE_TYPES = import.meta.env.VITE_ALLOWED_FILE_TYPES || ".pdf,.doc,.docx,.txt";

  // DEBUG: Log environment variables to make sure they're loaded
  console.log("Environment variables:", {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA,
    MAX_UPLOAD_SIZE_MB: import.meta.env.VITE_MAX_UPLOAD_SIZE_MB,
    ALLOWED_FILE_TYPES: import.meta.env.VITE_ALLOWED_FILE_TYPES
  });

  const handleAssignmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        variant: "destructive",
      });
      return;
    }
    
    setAssignmentFile(file);
  };

  const handleStudyMaterialsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    // Check each file size
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    Array.from(e.target.files).forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Some files are too large",
        description: `The following files exceed the ${MAX_FILE_SIZE / (1024 * 1024)}MB limit: ${invalidFiles.join(', ')}`,
        variant: "destructive",
      });
    }
    
    if (validFiles.length > 0) {
      setStudyMaterials(prev => [...prev, ...validFiles]);
    }
  };

  const handleContinue = async () => {
    if (!assignmentFile) {
      toast({
        title: "Assignment required",
        description: "Please upload your assignment before continuing.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      console.log("🧹 CLEARING ALL PREVIOUS DATA FOR NEW ASSIGNMENT");
      
      // Clear all previous chat memory and level data from session storage
      console.log("Clearing previous chat memory and level data...");
      
      // Clear previous level data and responses
      sessionStorage.removeItem('previousLevelResponses');
      sessionStorage.removeItem('currentLevelData');
      sessionStorage.removeItem('previousQuestions');
      sessionStorage.removeItem('answeredQuestions');
      
      // Also clear any conversation history
      sessionStorage.removeItem('chatHistory');
      sessionStorage.removeItem('conversationContext');
      
      // Clear specifically flashcard related data
      sessionStorage.removeItem('flashcards');
      sessionStorage.removeItem('flashcardProgress');
      sessionStorage.removeItem('completedFlashcards');
      localStorage.removeItem('savedFlashcards');
      
      // Clear level-specific data for all levels (0-5)
      for (let level = 0; level <= 5; level++) {
        sessionStorage.removeItem(`level${level}_data`);
        sessionStorage.removeItem(`level${level}_progress`);
        sessionStorage.removeItem(`level${level}_questions`);
        sessionStorage.removeItem(`level${level}_answers`);
        console.log(`Cleared data for level ${level}`);
      }
      
      // Clear any other potential stored data
      sessionStorage.removeItem('currentAssignment');
      sessionStorage.removeItem('lastAccessedLevel');
      localStorage.removeItem('userProgress');
      localStorage.removeItem('completedLevels');
      
      console.log("✅ ALL PREVIOUS DATA CLEARED FOR NEW ASSIGNMENT");
      
      // Process files for API
      const allFiles = [assignmentFile, ...studyMaterials];
      console.log("Files to process:", allFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));
      
      const processedFiles = await processFilesForUpload(allFiles);
      console.log("Processed files:", processedFiles);
      
      // Store processed files in session storage for later use
      sessionStorage.setItem('uploadedFiles', JSON.stringify(processedFiles));
      
      // Verify the data was saved to session storage
      const savedFiles = sessionStorage.getItem('uploadedFiles');
      console.log("Saved to session storage:", savedFiles ? "yes" : "no", 
                  savedFiles ? JSON.parse(savedFiles).length : 0, "files");
      
      toast({
        title: "Upload successful!",
        description: "Your materials have been processed successfully.",
      });
      
      // If this is the Master It learning path, go directly to level 0
      if (helpType === "master-it") {
        navigate("/master-it/0");
      }
      // Otherwise, navigate based on help type
      else if (helpType) {
        navigate("/flashcards", { state: { helpType } });
      } else {
        navigate("/process");
      }
    } catch (error) {
      console.error("Error processing files:", error);
      toast({
        title: "Upload failed",
        description: "There was an error processing your files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pastel-pattern">
      <Navbar />
      
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Upload Your Materials</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Upload your assignment and optional study materials to help the AI provide personalized guidance.
            </p>
          </div>
          
          <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Assignment (Required)
              </CardTitle>
              <CardDescription>
                Upload your assignment instructions or questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  assignmentFile ? "border-green-300 bg-green-50 dark:bg-green-900/10" : "border-gray-300 dark:border-gray-700"
                }`}
              >
                {assignmentFile ? (
                  <div className="flex flex-col items-center">
                    <FileText className="h-10 w-10 text-green-500 mb-2" />
                    <p className="text-sm font-medium mb-1">{assignmentFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(assignmentFile.size / 1024).toFixed(0)} KB
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setAssignmentFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      Upload your assignment
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      PDF, DOC, DOCX, or TXT files up to 10MB
                    </p>
                    <input
                      id="assignment-upload"
                      type="file"
                      className="hidden"
                      accept={ALLOWED_FILE_TYPES}
                      onChange={handleAssignmentUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => document.getElementById("assignment-upload")?.click()}
                    >
                      Select File
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Study Materials (Optional)
              </CardTitle>
              <CardDescription>
                Upload any related lecture notes, textbook chapters, or study guides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  studyMaterials.length > 0 ? "border-blue-300 bg-blue-50 dark:bg-blue-900/10" : "border-gray-300 dark:border-gray-700"
                }`}
              >
                {studyMaterials.length > 0 ? (
                  <div className="flex flex-col items-center">
                    <BookOpen className="h-10 w-10 text-blue-500 mb-2" />
                    <p className="text-sm font-medium mb-1">
                      {studyMaterials.length} file{studyMaterials.length !== 1 ? "s" : ""} selected
                    </p>
                    <div className="text-xs text-gray-500 mb-4">
                      {studyMaterials.map((file, index) => (
                        <div key={index} className="mb-1">
                          {file.name} ({(file.size / 1024).toFixed(0)} KB)
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setStudyMaterials([])}
                    >
                      Remove All
                    </Button>
                  </div>
                ) : (
                  <>
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      Upload study materials
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      PDF, DOC, DOCX, or TXT files up to 10MB each
                    </p>
                    <input
                      id="materials-upload"
                      type="file"
                      className="hidden"
                      accept={ALLOWED_FILE_TYPES}
                      multiple
                      onChange={handleStudyMaterialsUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => document.getElementById("materials-upload")?.click()}
                    >
                      Select Files
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleContinue} 
              disabled={!assignmentFile || isUploading}
              className="px-6"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
