
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileCheck } from 'lucide-react';

const Assessments = () => {
  // Sample data structure with improved details
  const [assessments, setAssessments] = useState([
    { 
      id: 1, 
      day: 1, 
      vocabularyScore: 85, 
      topicScore: 90, 
      date: '2025-04-20',
      vocabularyCompleted: true,
      topicCompleted: true,
      title: "Introduction to English"
    },
    { 
      id: 2, 
      day: 2, 
      vocabularyScore: 78, 
      topicScore: 85, 
      date: '2025-04-21',
      vocabularyCompleted: true,
      topicCompleted: true,
      title: "Common Greetings"
    },
    { 
      id: 3, 
      day: 3, 
      vocabularyScore: 92, 
      topicScore: 88, 
      date: '2025-04-22',
      vocabularyCompleted: true,
      topicCompleted: true,
      title: "Basic Conversation"
    },
    { 
      id: 4, 
      day: 4, 
      vocabularyScore: 95, 
      topicScore: 94, 
      date: '2025-04-23',
      vocabularyCompleted: true,
      topicCompleted: true,
      title: "Present Tenses"
    }
  ]);

  // Check localStorage for any saved assessment scores on component mount
  useEffect(() => {
    const updatedAssessments = [...assessments];
    let hasUpdates = false;

    // Loop through assessments and check if we have scores in localStorage
    updatedAssessments.forEach((assessment, index) => {
      const vocabScore = localStorage.getItem(`day${assessment.day}-vocabulary-score`);
      const topicScore = localStorage.getItem(`day${assessment.day}-topic-score`);
      
      if (vocabScore) {
        updatedAssessments[index].vocabularyScore = parseInt(vocabScore);
        hasUpdates = true;
      }
      
      if (topicScore) {
        updatedAssessments[index].topicScore = parseInt(topicScore);
        hasUpdates = true;
      }
    });

    if (hasUpdates) {
      setAssessments(updatedAssessments);
    }
  }, []);

  // Calculate average scores
  const avgVocabularyScore = assessments.reduce((sum, assessment) => sum + assessment.vocabularyScore, 0) / assessments.length;
  const avgTopicScore = assessments.reduce((sum, assessment) => sum + assessment.topicScore, 0) / assessments.length;
  const overallAverage = (avgVocabularyScore + avgTopicScore) / 2;

  return (
    <>
      <Navbar isLoggedIn={true} userRole="student" />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Assessment Scores</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-t-4 border-t-blue-500">
            <CardHeader>
              <CardTitle>Vocabulary Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="relative w-16 h-16 mr-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#e5e5e5" 
                      strokeWidth="10"
                    />
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="10" 
                      strokeDasharray={`${avgVocabularyScore * 2.83} 283`} 
                      strokeDashoffset="0" 
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
                <p className="text-4xl font-bold text-blue-600">{avgVocabularyScore.toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-green-500">
            <CardHeader>
              <CardTitle>Topic Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="relative w-16 h-16 mr-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#e5e5e5" 
                      strokeWidth="10"
                    />
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#22c55e" 
                      strokeWidth="10" 
                      strokeDasharray={`${avgTopicScore * 2.83} 283`} 
                      strokeDashoffset="0" 
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
                <p className="text-4xl font-bold text-green-600">{avgTopicScore.toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-purple-500">
            <CardHeader>
              <CardTitle>Overall Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="relative w-16 h-16 mr-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#e5e5e5" 
                      strokeWidth="10"
                    />
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#8b5cf6" 
                      strokeWidth="10" 
                      strokeDasharray={`${overallAverage * 2.83} 283`} 
                      strokeDashoffset="0" 
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
                <p className="text-4xl font-bold text-purple-600">{overallAverage.toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Assessment History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Day</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Vocabulary</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((assessment) => (
                  <TableRow key={assessment.id} className="border-b last:border-0">
                    <TableCell className="font-medium">Day {assessment.day}</TableCell>
                    <TableCell>{assessment.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {assessment.vocabularyCompleted ? (
                          <>
                            <span className={`inline-block w-3 h-3 rounded-full ${assessment.vocabularyScore >= 70 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                            <span>{assessment.vocabularyScore}%</span>
                          </>
                        ) : (
                          <span className="text-gray-400">Not taken</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {assessment.topicCompleted ? (
                          <>
                            <span className={`inline-block w-3 h-3 rounded-full ${assessment.topicScore >= 70 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                            <span>{assessment.topicScore}%</span>
                          </>
                        ) : (
                          <span className="text-gray-400">Not taken</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(assessment.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600" 
                        asChild
                      >
                        <Link to={`/student/days/${assessment.day}`}>
                          View Day <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold">Upcoming Assessments</h2>
          
          <Card className="p-6 flex items-start gap-4">
            <div className="p-2 rounded-full bg-blue-100">
              <FileCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Day 5 - Past Tenses</h3>
                  <p className="text-gray-500">Available from May 20, 2025</p>
                </div>
                <Button asChild className="bg-yellow-400 text-blue-900 hover:bg-yellow-500">
                  <Link to="/student/days/5">
                    View Content
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 flex items-start gap-4">
            <div className="p-2 rounded-full bg-blue-100">
              <FileCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Day 6 - Future Tenses</h3>
                  <p className="text-gray-500">Available from May 27, 2025</p>
                </div>
                <Button asChild disabled className="bg-gray-200 text-gray-500 cursor-not-allowed">
                  <Link to="/student/days/6">
                    Not Available Yet
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Assessments;
