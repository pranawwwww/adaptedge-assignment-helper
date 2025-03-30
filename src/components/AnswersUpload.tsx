import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, X, FileText, Upload as UploadIcon, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AnswersUploadProps {
  onUploadComplete?: (file: File) => void;
}

const AnswersUpload = ({ onUploadComplete }: AnswersUploadProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Only take the first file
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload your answers document.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate upload
    setUploading(true);
    
    setTimeout(() => {
      setUploading(false);
      
      toast({
        title: "Upload complete!",
        description: "Your answers document has been uploaded successfully.",
      });
      
      if (onUploadComplete) {
        onUploadComplete(file);
      }
    }, 1500);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md overflow-hidden">
      <CardHeader className="bg-green-50 dark:bg-green-900/30 border-b border-green-100 dark:border-green-800">
        <h2 className="text-2xl font-bold flex items-center">
          <Upload className="mr-2 h-5 w-5 text-green-600" />
          Submit Your Completed Assignment
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Upload your completed assignment to receive detailed feedback and evaluation
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  dragging ? "border-green-500 bg-green-50/50 dark:bg-green-900/20" : "border-gray-300 dark:border-gray-700"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Drag & drop your answers document here
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Or click to browse files. Supports PDF, DOC, DOCX, TXT, etc.
                </p>
                
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.rtf"
                  onChange={handleFileChange}
                />
                <div className="mt-4">
                  <label htmlFor="file-upload">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      Browse Files
                    </Button>
                  </label>
                </div>
              </div>
            </div>
            
            {file && (
              <div>
                <h3 className="font-medium mb-2">Selected File</h3>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({(file.size / 1024).toFixed(0)} KB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <Button type="submit" disabled={uploading || !file} className="w-full bg-green-600 hover:bg-green-700">
              {uploading ? (
                <>
                  <UploadIcon className="animate-spin mr-2 h-4 w-4" />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit for Final Review
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AnswersUpload;