
import React from 'react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, CircleDashed, BookOpen, Headphones, FileCheck } from 'lucide-react';

const Lessons = () => {
  // Sample data - in a real app, this would come from an API
  const days = [
    { 
      id: 1, 
      title: "Day 1: Introduction", 
      description: "Basic introduction to the course",
      progress: {
        reading: true,
        listeningAmerican: true,
        listeningBritish: true,
        vocabulary: true,
        topic: true,
        totalCompleted: 5,
        total: 5
      }
    },
    { 
      id: 2, 
      title: "Day 2: Basics", 
      description: "Fundamentals of English language",
      progress: {
        reading: true,
        listeningAmerican: true,
        listeningBritish: false,
        vocabulary: true,
        topic: false,
        totalCompleted: 3,
        total: 5
      }
    },
    { 
      id: 3, 
      title: "Day 3: Simple Present", 
      description: "Learning the simple present tense",
      progress: {
        reading: true,
        listeningAmerican: false,
        listeningBritish: false,
        vocabulary: false,
        topic: false,
        totalCompleted: 1,
        total: 5
      }
    },
    { 
      id: 4, 
      title: "Day 4: Past Tense", 
      description: "Understanding the past tense",
      progress: {
        reading: false,
        listeningAmerican: false,
        listeningBritish: false,
        vocabulary: false,
        topic: false,
        totalCompleted: 0,
        total: 5
      }
    },
    { 
      id: 5, 
      title: "Day 5: Future Tense", 
      description: "Working with future tense",
      progress: {
        reading: false,
        listeningAmerican: false,
        listeningBritish: false,
        vocabulary: false,
        topic: false,
        totalCompleted: 0,
        total: 5
      }
    }
  ];

  return (
    <>
      <Navbar isLoggedIn={true} userRole="student" />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Available Lessons</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {days.map((day) => (
            <Link to={`/student/days/${day.id}`} key={day.id}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>{day.title}</CardTitle>
                  <CardDescription>{day.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium">
                        {day.progress.totalCompleted}/{day.progress.total}
                      </span>
                    </div>
                    <Progress value={(day.progress.totalCompleted / day.progress.total) * 100} className="h-2" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1" title="Reading">
                      <BookOpen className={`h-4 w-4 ${day.progress.reading ? 'text-green-500' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex items-center gap-1" title="American Listening">
                      <Headphones className={`h-4 w-4 ${day.progress.listeningAmerican ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-xs">US</span>
                    </div>
                    <div className="flex items-center gap-1" title="British Listening">
                      <Headphones className={`h-4 w-4 ${day.progress.listeningBritish ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-xs">UK</span>
                    </div>
                    <div className="flex items-center gap-1" title="Vocabulary Assessment">
                      <FileCheck className={`h-4 w-4 ${day.progress.vocabulary ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-xs">Vocab</span>
                    </div>
                    <div className="flex items-center gap-1" title="Topic Assessment">
                      <FileCheck className={`h-4 w-4 ${day.progress.topic ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-xs">Topic</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <span className="text-blue-500 hover:underline flex items-center">
                    {day.progress.totalCompleted === day.progress.total ? 
                      <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> : 
                      <CircleDashed className="w-4 h-4 mr-1" />}
                    View Lesson
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export default Lessons;
