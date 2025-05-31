import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Medal, FileText, Check, BookOpen, Calendar, PenLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AssessmentProps {
  title: string;
  description: string;
  id: string;
  completed?: boolean;
  score?: number;
  courseId: string;
  lessonId: string;
  dueDate?: string;
}

const EmbeddedAssessmentExample = () => {
  const [activeTab, setActiveTab] = useState("day-1");
  
  // Mock course data
  const courseDays = [
    { id: "day-1", label: "Day 1: Introduction" },
    { id: "day-2", label: "Day 2: Basic Concepts" },
    { id: "day-3", label: "Day 3: Advanced Topics" },
  ];
  
  // Mock assessment data organized by day
  const assessmentsByDay: Record<string, AssessmentProps[]> = {
    "day-1": [
      { 
        title: "Vocabulary Test", 
        description: "Test your vocabulary knowledge",
        id: "vocab-test-1",
        completed: true,
        score: 100,
        courseId: "example-course",
        lessonId: "day-1",
        dueDate: "May 24, 2025"
      },
      { 
        title: "Topic Test", 
        description: "Test your knowledge on this topic",
        id: "topic-test-1",
        courseId: "example-course",
        lessonId: "day-1",
        dueDate: "May 25, 2025"
      },
      { 
        title: "Daily Journal Entry", 
        description: "Write about your daily routine and how you spend your time",
        id: "writing-assignment-1",
        courseId: "example-course",
        lessonId: "day-1",
        dueDate: "May 26, 2025"
      }
    ],
    "day-2": [
      { 
        title: "Reading Comprehension", 
        description: "Read the passage and answer questions",
        id: "reading-test-1",
        completed: true,
        score: 85,
        courseId: "example-course",
        lessonId: "day-2",
        dueDate: "May 27, 2025"
      },
      { 
        title: "Opinion Essay", 
        description: "Write an essay about technology in education",
        id: "writing-assignment-1",
        courseId: "example-course",
        lessonId: "day-2",
        dueDate: "May 28, 2025"
      }
    ],
    "day-3": [
      { 
        title: "Grammar Test", 
        description: "Test your grammar knowledge",
        id: "grammar-test-1",
        courseId: "example-course",
        lessonId: "day-3",
        dueDate: "May 29, 2025"
      },
      { 
        title: "Listening Exercise", 
        description: "Listen to the audio and answer questions",
        id: "listening-test-1",
        courseId: "example-course",
        lessonId: "day-3",
        dueDate: "May 30, 2025"
      },
      { 
        title: "Story Writing", 
        description: "Write a short story with the given prompt",
        id: "writing-assignment-1",
        courseId: "example-course",
        lessonId: "day-3",
        dueDate: "May 31, 2025"
      }
    ]
  };

  const navigate = useNavigate();

  const startAssessment = (assessment: AssessmentProps) => {
    if (assessment.id.includes("writing")) {
      // We now have two options for writing assessments:
      // 1. Use the embedded assessment tool
      // 2. Go to the dedicated writing assessment page
      
      // For demonstration, we'll show a direct path to both options
      if (activeTab === "day-1") {
        // Navigate to the embedded assessment tool 
        navigate(`/embedded-assessment/${assessment.courseId}/${assessment.lessonId}/${assessment.id}?returnUrl=/`);
      } else {
        // Navigate to the integrated writing assessment page
        navigate(`/student/writing-assessment/${assessment.lessonId}`);
      }
    } else {
      // This would typically navigate to different types of assessments
      alert(`Starting assessment: ${assessment.id}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <BookOpen className="h-6 w-6 mr-3 text-blue-600" />
          <h1 className="text-2xl font-bold">Example Course: English Fundamentals</h1>
        </div>

        <Tabs 
          defaultValue="day-1" 
          className="w-full mb-8"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4 w-full flex overflow-x-auto">
            {courseDays.map((day) => (
              <TabsTrigger 
                key={day.id} 
                value={day.id}
                className="flex-1"
              >
                {day.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {courseDays.map((day) => (
            <TabsContent key={day.id} value={day.id}>
              <div className="flex items-center mb-6">
                <FileText className="h-6 w-6 mr-3 text-blue-600" />
                <h2 className="text-xl font-bold">Assessments</h2>
              </div>

              <div className="space-y-4">
                {assessmentsByDay[day.id]?.map((assessment) => (
                  <Card key={assessment.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-blue-600">{assessment.title}</h3>
                        <p className="text-gray-600 text-sm">{assessment.description}</p>
                        {assessment.dueDate && (
                          <p className="text-gray-500 text-xs mt-1 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" /> 
                            Due: {assessment.dueDate}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        {assessment.completed ? (
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Check className="mr-1 h-3 w-3" />
                              Score: {assessment.score}%
                            </span>
                            <span className="ml-3 text-gray-500">Completed</span>
                          </div>
                        ) : (
                          <Button 
                            onClick={() => startAssessment(assessment)}
                            className={assessment.id.includes("writing") 
                              ? "bg-amber-400 hover:bg-amber-500 text-black" 
                              : "bg-blue-600 hover:bg-blue-700 text-white"}
                          >
                            {assessment.id.includes("writing") ? (
                              <>
                                <PenLine className="mr-2 h-4 w-4" />
                                Start Writing Task
                              </>
                            ) : (
                              "Start Test"
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Explanatory card */}
        <Card className="p-6 mt-8 bg-blue-50 border-blue-100">
          <h3 className="text-lg font-bold mb-2">About Writing Assessments</h3>
          <p className="mb-4 text-gray-700">
            This demo shows two integration options for writing assessments:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-700">
            <li>
              <strong>Day 1 assessments</strong> use the embedded assessment tool that can be integrated into any platform via iframe
            </li>
            <li>
              <strong>Day 2 & 3 assessments</strong> use the fully integrated assessment page with student progress tracking
            </li>
          </ul>
          <p className="text-gray-700">
            Both methods use the same assessment engine and results display, but the integrated version allows for deeper integration with your learning management system.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default EmbeddedAssessmentExample; 