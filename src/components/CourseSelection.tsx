
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, BookOpen, Plus } from "lucide-react";

interface Course {
  id: string;
  title: string;
  code: string;
}

interface CourseSelectionProps {
  onCourseSelect: (courseId: string) => void;
}

const CourseSelection = ({ onCourseSelect }: CourseSelectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  
  // In a real app, these would be fetched from an API
  const courses: Course[] = [
    { id: "math101", title: "Calculus I", code: "MATH 101" },
    { id: "phys202", title: "Modern Physics", code: "PHYS 202" },
    { id: "cs301", title: "Data Structures", code: "CS 301" },
    { id: "chem110", title: "Organic Chemistry", code: "CHEM 110" },
    { id: "bio201", title: "Molecular Biology", code: "BIO 201" },
    { id: "eng104", title: "Technical Writing", code: "ENG 104" },
  ];
  
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId);
  };
  
  const handleContinue = () => {
    if (selectedCourse) {
      onCourseSelect(selectedCourse);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="course-search">Search Your Courses</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <Input
                id="course-search"
                placeholder="Search by course name or code..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label className="mb-2 block">Select a Course</Label>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedCourse === course.id
                        ? "border-primary bg-accent/20"
                        : "hover:border-primary/50 hover:bg-accent/10"
                    }`}
                    onClick={() => handleCourseSelect(course.id)}
                  >
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {course.code}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                  <p>No courses found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add New Course
            </Button>
            <Button onClick={handleContinue} disabled={!selectedCourse}>
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseSelection;
