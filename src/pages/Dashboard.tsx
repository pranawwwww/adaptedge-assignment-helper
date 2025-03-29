
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Upload, Clock, Zap, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  // In a real app, these would be fetched from an API
  const recentAssignments = [
    { id: 1, title: "Calculus Assignment 3", course: "MATH 101", dueDate: "2023-11-15", status: "completed" },
    { id: 2, title: "Physics Lab Report", course: "PHYS 202", dueDate: "2023-11-20", status: "in-progress" },
    { id: 3, title: "Computer Science Project", course: "CS 301", dueDate: "2023-11-25", status: "not-started" },
  ];

  const courses = [
    { id: 1, title: "MATH 101 - Calculus I", materials: 12, assignments: 5 },
    { id: 2, title: "PHYS 202 - Modern Physics", materials: 8, assignments: 3 },
    { id: 3, title: "CS 301 - Data Structures", materials: 15, assignments: 7 },
    { id: 4, title: "CHEM 110 - Organic Chemistry", materials: 10, assignments: 4 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "not-started":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "not-started":
        return "Not Started";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Welcome back! Manage your assignments and course materials.
            </p>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-4">
            <Link to="/upload">
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Materials
              </Button>
            </Link>
            <Link to="/process">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                New Assignment
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-primary mr-2" />
                <span className="text-3xl font-bold">{courses.length}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Uploaded Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-primary mr-2" />
                <span className="text-3xl font-bold">
                  {courses.reduce((acc, course) => acc + course.materials, 0)}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-primary mr-2" />
                <span className="text-3xl font-bold">
                  {courses.reduce((acc, course) => acc + course.assignments, 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Assignments</CardTitle>
                <CardDescription>
                  Track your recent assignments and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAssignments.map((assignment) => (
                    <div 
                      key={assignment.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border bg-card hover:bg-accent/10 transition-colors"
                    >
                      <div className="flex-1 mb-2 sm:mb-0">
                        <h3 className="font-medium">{assignment.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{assignment.course}</p>
                      </div>
                      <div className="flex items-center space-x-4 w-full sm:w-auto">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          {getStatusIcon(assignment.status)}
                          <span className="ml-1 text-sm">{getStatusText(assignment.status)}</span>
                        </div>
                        <Link to={`/process?assignment=${assignment.id}`}>
                          <Button size="sm" variant="ghost">Work on it</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Link to="/process">
                    <Button variant="outline">View All Assignments</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>
                  Courses you are currently enrolled in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div 
                      key={course.id}
                      className="p-4 rounded-lg border bg-card hover:bg-accent/10 transition-colors"
                    >
                      <h3 className="font-medium">{course.title}</h3>
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <span>{course.materials} materials</span>
                        <span>{course.assignments} assignments</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline" className="w-full">Add New Course</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
