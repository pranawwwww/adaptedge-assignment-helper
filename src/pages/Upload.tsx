
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Upload as UploadIcon, FileText, BookOpen, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";

const Upload = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [studyMaterials, setStudyMaterials] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Get the help type from location state if available
  const helpType = location.state?.helpType || null;

  const handleAssignmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAssignmentFile(e.target.files[0]);
    }
  };

  const handleStudyMaterialsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setStudyMaterials(Array.from(e.target.files));
    }
  };

  const handleContinue = () => {
    if (!assignmentFile) {
      toast({
        title: "Assignment required",
        description: "Please upload your assignment before continuing.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      
      toast({
        title: "Upload successful!",
        description: "Your materials have been processed successfully.",
      });
      
      // Navigate to process or directly to flashcards based on whether help type is already selected
      if (helpType) {
        navigate("/flashcards", { state: { helpType } });
      } else {
        navigate("/process");
      }
    }, 1500);
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
                      accept=".pdf,.doc,.docx,.txt"
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
                      accept=".pdf,.doc,.docx,.txt"
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
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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
