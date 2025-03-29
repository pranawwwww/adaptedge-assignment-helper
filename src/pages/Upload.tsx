
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookText, BookOpen, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import MaterialUpload from "@/components/MaterialUpload";
import { useToast } from "@/components/ui/use-toast";

const Upload = () => {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<{
    syllabus: File[];
    notes: File[];
    assignment: File[];
  }>({
    syllabus: [],
    notes: [],
    assignment: [],
  });

  const handleUploadComplete = (type: "syllabus" | "notes" | "assignment", files: File[]) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [type]: [...prev[type], ...files],
    }));

    toast({
      title: "Materials uploaded",
      description: `${files.length} ${type} file(s) have been uploaded successfully.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Upload Course Materials</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Upload your course materials to help the AI understand your course content. 
              This enables personalized guidance that references your specific materials.
            </p>
          </div>
          
          <Tabs defaultValue="syllabus">
            <TabsList className="grid grid-cols-3 w-full mb-8">
              <TabsTrigger value="syllabus" className="flex items-center">
                <BookText className="h-5 w-5 mr-2" />
                <span>Syllabus</span>
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                <span>Lecture Notes</span>
              </TabsTrigger>
              <TabsTrigger value="assignment" className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                <span>Assignments</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="syllabus">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Syllabus</CardTitle>
                  <CardDescription>
                    Upload your course syllabus to help the AI understand your course structure, requirements, and expectations.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <div className="mt-6">
                <MaterialUpload 
                  type="syllabus" 
                  onUploadComplete={(files) => handleUploadComplete("syllabus", files)} 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Lecture Notes</CardTitle>
                  <CardDescription>
                    Upload your lecture notes, textbook chapters, or other study materials. The AI will use these to provide context-specific assistance.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <div className="mt-6">
                <MaterialUpload 
                  type="notes" 
                  onUploadComplete={(files) => handleUploadComplete("notes", files)} 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="assignment">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Assignment Instructions</CardTitle>
                  <CardDescription>
                    Upload your assignment instructions, rubrics, or requirements. The AI will analyze these to provide targeted assistance.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <div className="mt-6">
                <MaterialUpload 
                  type="assignment" 
                  onUploadComplete={(files) => handleUploadComplete("assignment", files)} 
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Upload;
