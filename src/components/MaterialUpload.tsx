import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, FileText, Upload as UploadIcon, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MaterialUploadProps {
  type: "syllabus" | "notes" | "assignment" | "answer";
  onUploadComplete?: (files: File[] | File) => void;
  showCourseSelection?: boolean;
}

const MaterialUpload = ({ type, onUploadComplete, showCourseSelection = true }: MaterialUploadProps) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [course, setCourse] = useState("");
  const [uploading, setUploading] = useState(false);
  
  // Define whether we're in answer mode (single file upload)
  const isAnswerMode = type === "answer";

  // Define accepted MIME types for validation
  const acceptedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/rtf",
    "text/rtf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ];

  // Validate file type
  const validateFile = (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();
    
    // Check file extension
    const validExtension = getAcceptedFileTypes()
      .split(',')
      .some(ext => fileName.endsWith(ext));
    
    // Check MIME type
    const validMimeType = acceptedMimeTypes.includes(fileType);
    
    return validExtension || validMimeType;
  };

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
      // For answers, only take the first file
      if (isAnswerMode) {
        const droppedFile = e.dataTransfer.files[0];
        
        // Validate file type
        if (validateFile(droppedFile)) {
          setFiles([droppedFile]);
        } else {
          toast({
            title: "Invalid file type",
            description: "Please upload a PDF, DOC, DOCX, TXT, or RTF file.",
            variant: "destructive",
          });
        }
      } else {
        // For other types, accept multiple files
        const newFiles = Array.from(e.dataTransfer.files);
        const validFiles = newFiles.filter(file => {
          const isValid = validateFile(file);
          if (!isValid) {
            toast({
              title: "Invalid file type",
              description: "Please upload only PDF, DOC, DOCX, TXT, RTF, PPT, or PPTX files.",
              variant: "destructive",
            });
          }
          return isValid;
        });
        setFiles((prev) => [...prev, ...validFiles]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // For answers, only take the first file
      if (isAnswerMode) {
        const selectedFile = e.target.files[0];
        
        // Validate file type
        if (validateFile(selectedFile)) {
          setFiles([selectedFile]);
        } else {
          toast({
            title: "Invalid file type",
            description: "Please upload a PDF, DOC, DOCX, TXT, or RTF file.",
            variant: "destructive",
          });
          // Reset the input
          e.target.value = '';
        }
      } else {
        // For other types, accept multiple files
        const newFiles = Array.from(e.target.files);
        const validFiles = newFiles.filter(file => {
          const isValid = validateFile(file);
          if (!isValid) {
            toast({
              title: "Invalid file type",
              description: "Please upload only PDF, DOC, DOCX, TXT, RTF, PPT, or PPTX files.",
              variant: "destructive",
            });
          }
          return isValid;
        });
        
        // If there were invalid files, reset the input
        if (validFiles.length !== newFiles.length) {
          e.target.value = '';
        }
        
        setFiles((prev) => [...prev, ...validFiles]);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: isAnswerMode ? "Please upload your answers document." : "Please upload at least one file.",
        variant: "destructive",
      });
      return;
    }
    
    if (showCourseSelection && !course && !isAnswerMode) {
      toast({
        title: "Course not selected",
        description: "Please select a course for these materials.",
        variant: "destructive",
      });
      return;
    }
    
    // Verify all files have valid types before submission
    const allFilesValid = files.every(file => validateFile(file));
    if (!allFilesValid) {
      toast({
        title: "Invalid file type",
        description: isAnswerMode 
          ? "Please upload a PDF, DOC, DOCX, TXT, or RTF file."
          : "Please remove any unsupported file types before uploading.",
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
        description: isAnswerMode 
          ? "Your answers document has been uploaded successfully."
          : `${files.length} file(s) have been uploaded successfully.`,
      });
      
      if (onUploadComplete) {
        // For answers, pass just the single file
        if (isAnswerMode) {
          onUploadComplete(files[0]);
        } else {
          onUploadComplete(files);
        }
      }
      
      // Reset form
      setFiles([]);
      setCourse("");
    }, isAnswerMode ? 1500 : 2000);
  };

  const getTitle = () => {
    switch (type) {
      case "syllabus":
        return "Upload Syllabus";
      case "notes":
        return "Upload Lecture Notes";
      case "assignment":
        return "Upload Assignment Instructions";
      case "answer":
        return "Submit Your Completed Assignment";
      default:
        return "Upload Materials";
    }
  };

  const getDescription = () => {
    switch (type) {
      case "syllabus":
        return "Upload your course syllabus to help the AI understand your course structure and requirements.";
      case "notes":
        return "Upload your lecture notes, textbook chapters, or other study materials.";
      case "assignment":
        return "Upload your assignment instructions, rubrics, or requirements.";
      case "answer":
        return "Upload your completed assignment to receive detailed feedback and evaluation";
      default:
        return "Upload your course materials to help the AI understand your course.";
    }
  };

  const getAcceptedFileTypes = () => {
    return isAnswerMode 
      ? ".pdf,.doc,.docx,.txt,.rtf"
      : ".pdf,.doc,.docx,.txt,.rtf,.ppt,.pptx";
  };

  // Get border and background colors based on type
  const getBorderAndBgColors = () => {
    if (type === "answer") {
      return dragging 
        ? "border-green-500 bg-green-50/50 dark:bg-green-900/20" 
        : "border-gray-300 dark:border-gray-700";
    }
    
    return dragging 
      ? "border-primary bg-primary/5" 
      : "border-gray-300 dark:border-gray-700";
  };

  return (
    <Card className={type === "answer" ? "bg-white dark:bg-gray-800 shadow-md overflow-hidden" : "w-full"}>
      {type === "answer" && (
        <CardHeader className="bg-green-50 dark:bg-green-900/30 border-b border-green-100 dark:border-green-800">
          <h2 className="text-2xl font-bold flex items-center">
            <Upload className="mr-2 h-5 w-5 text-green-600" />
            {getTitle()}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {getDescription()}
          </p>
        </CardHeader>
      )}
      
      <CardContent className={type === "answer" ? "p-6" : "pt-6"}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {showCourseSelection && !isAnswerMode && (
              <div>
                <Label htmlFor="course">Select Course</Label>
                <Select value={course} onValueChange={setCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="math101">MATH 101 - Calculus I</SelectItem>
                      <SelectItem value="phys202">PHYS 202 - Modern Physics</SelectItem>
                      <SelectItem value="cs301">CS 301 - Data Structures</SelectItem>
                      <SelectItem value="chem110">CHEM 110 - Organic Chemistry</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              {!isAnswerMode && (
                <div className="mb-2">
                  <Label>{getTitle()}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {getDescription()}
                  </p>
                </div>
              )}
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${getBorderAndBgColors()}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Drag & drop {isAnswerMode ? "your answers document" : "files"} here
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Or click to browse files. Supports PDF, DOC, DOCX, TXT
                  {!isAnswerMode && ", PPT, etc."}
                </p>
                
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple={!isAnswerMode}
                  accept={getAcceptedFileTypes()}
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
            
            {files.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Selected {isAnswerMode ? "File" : "Files"}</h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-between p-2 ${
                        isAnswerMode ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-800"
                      } rounded-md`}
                    >
                      <div className="flex items-center">
                        <FileText className={`h-5 w-5 ${isAnswerMode ? "text-green-600" : "text-gray-500"} mr-2`} />
                        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(file.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={uploading || (isAnswerMode && files.length === 0)} 
              className={`w-full ${isAnswerMode ? "bg-green-600 hover:bg-green-700" : ""}`}
            >
              {uploading ? (
                <>
                  <UploadIcon className="animate-spin mr-2 h-4 w-4" />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {isAnswerMode ? "Submit for Final Review" : `Upload ${files.length} file${files.length !== 1 ? "s" : ""}`}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MaterialUpload;
