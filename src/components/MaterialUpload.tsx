
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, FileText, Upload as UploadIcon, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MaterialUploadProps {
  type: "syllabus" | "notes" | "assignment";
  onUploadComplete?: (files: File[]) => void;
}

const MaterialUpload = ({ type, onUploadComplete }: MaterialUploadProps) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [course, setCourse] = useState("");
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
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
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
        description: "Please upload at least one file.",
        variant: "destructive",
      });
      return;
    }
    
    if (!course) {
      toast({
        title: "Course not selected",
        description: "Please select a course for these materials.",
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
        description: `${files.length} file(s) have been uploaded successfully.`,
      });
      
      if (onUploadComplete) {
        onUploadComplete(files);
      }
      
      // Reset form
      setFiles([]);
      setCourse("");
    }, 2000);
  };

  const getTitle = () => {
    switch (type) {
      case "syllabus":
        return "Upload Syllabus";
      case "notes":
        return "Upload Lecture Notes";
      case "assignment":
        return "Upload Assignment Instructions";
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
      default:
        return "Upload your course materials to help the AI understand your course.";
    }
  };

  const getAcceptedFileTypes = () => {
    return ".pdf,.doc,.docx,.txt,.rtf,.ppt,.pptx";
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
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
            
            <div>
              <div className="mb-2">
                <Label>{getTitle()}</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {getDescription()}
                </p>
              </div>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  dragging ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-700"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Drag & drop files here
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Or click to browse files. Supports PDF, DOC, DOCX, TXT, PPT, etc.
                </p>
                
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
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
                <h3 className="font-medium mb-2">Selected Files</h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-500 mr-2" />
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
            
            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? (
                <>
                  <UploadIcon className="animate-spin mr-2 h-4 w-4" />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Upload {files.length} file{files.length !== 1 ? "s" : ""}
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
