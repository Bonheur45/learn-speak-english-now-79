
import React from 'react';
import Navbar from '@/components/Navbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Assessments = () => {
  // Sample data - in a real app, this would come from an API
  const assessments = [
    { 
      id: 1, 
      day: 1, 
      vocabularyScore: 85, 
      topicScore: 90, 
      date: '2025-04-20' 
    },
    { 
      id: 2, 
      day: 2, 
      vocabularyScore: 78, 
      topicScore: 85, 
      date: '2025-04-21' 
    },
    { 
      id: 3, 
      day: 3, 
      vocabularyScore: 92, 
      topicScore: 88, 
      date: '2025-04-22' 
    },
    { 
      id: 4, 
      day: 4, 
      vocabularyScore: 95, 
      topicScore: 94, 
      date: '2025-04-23' 
    }
  ];

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
          <Card>
            <CardHeader>
              <CardTitle>Vocabulary Average</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{avgVocabularyScore.toFixed(1)}%</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Topic Average</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">{avgTopicScore.toFixed(1)}%</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Overall Average</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-purple-600">{overallAverage.toFixed(1)}%</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Assessment History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Vocabulary Score</TableHead>
                  <TableHead>Topic Score</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell>Day {assessment.day}</TableCell>
                    <TableCell>{assessment.vocabularyScore}%</TableCell>
                    <TableCell>{assessment.topicScore}%</TableCell>
                    <TableCell>{new Date(assessment.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default Assessments;
