
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { MOCK_COHORTS, MOCK_TRIMESTERS, Trimester } from '@/lib/types';
import { ArrowRight, BookOpen, Check, CheckCircle, CircleDashed } from 'lucide-react';

const Trimesters = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cohortId = searchParams.get('cohort') || '1';
  
  const [selectedCohort, setSelectedCohort] = useState(MOCK_COHORTS.find(c => c.id === cohortId));
  const [trimesters, setTrimesters] = useState<Trimester[]>([]);
  
  useEffect(() => {
    // Filter trimesters by cohort ID
    const cohortTrimesters = MOCK_TRIMESTERS.filter(trim => trim.cohort_id === cohortId);
    setTrimesters(cohortTrimesters);
    
    const cohort = MOCK_COHORTS.find(c => c.id === cohortId);
    setSelectedCohort(cohort);
  }, [cohortId]);
  
  if (!selectedCohort) {
    return (
      <>
        <Navbar isLoggedIn={true} userRole="student" />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold">Cohort not found</h2>
            <p className="mt-2">The requested cohort does not exist.</p>
            <Button asChild className="mt-4">
              <Link to="/student/cohorts">View All Cohorts</Link>
            </Button>
          </div>
        </main>
      </>
    );
  }
  
  const calculateTrimesterProgress = (trimester: Trimester) => {
    // In a real app, this would calculate based on user's actual progress
    if (selectedCohort!.current_trimester > trimester.number) {
      return 100; // Past trimester, fully completed
    } else if (selectedCohort!.current_trimester === trimester.number) {
      return 60; // Current trimester, partially completed
    } else {
      return 0; // Future trimester, not started
    }
  };
  
  return (
    <>
      <Navbar isLoggedIn={true} userRole="student" />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Trimesters for {selectedCohort.name}</h1>
              <p className="text-gray-600">Your learning journey is organized into 3 trimesters</p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link to="/student/cohorts">Back to Cohorts</Link>
            </Button>
          </div>
        </div>
        
        <div className="space-y-8">
          {trimesters.map((trimester, index) => {
            const progress = calculateTrimesterProgress(trimester);
            const isCompleted = progress === 100;
            const isInProgress = selectedCohort.current_trimester === trimester.number;
            const isUpcoming = selectedCohort.current_trimester < trimester.number;
            
            return (
              <Card 
                key={trimester.id}
                className={`overflow-hidden transition-all ${
                  isInProgress ? 'border-blue-500 shadow-md' : 
                  isCompleted ? 'border-green-300' : 'border-gray-200'
                }`}
              >
                <CardHeader 
                  className={`${
                    isInProgress ? 'bg-blue-50' : 
                    isCompleted ? 'bg-green-50' : 
                    'bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        {isCompleted && <CheckCircle className="w-5 h-5 text-green-500 mr-2" />}
                        {isInProgress && <CircleDashed className="w-5 h-5 text-blue-500 mr-2" />}
                        {trimester.name}
                      </CardTitle>
                      <CardDescription>
                        {new Date(trimester.start_date).toLocaleDateString()} - {new Date(trimester.end_date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className={`
                        px-3 py-1 rounded-full text-sm font-medium ${
                          isInProgress ? 'bg-blue-100 text-blue-800' : 
                          isCompleted ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'
                        }
                      `}>
                        {isInProgress ? 'In Progress' : isCompleted ? 'Completed' : 'Upcoming'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Days in this Trimester</h3>
                    <div className="space-y-3">
                      {trimester.days.map((day, dayIndex) => (
                        <div key={day.id} className="flex items-center justify-between border-b pb-3">
                          <div className="flex items-center">
                            <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                              <span className="font-medium text-gray-700">{day.day_number}</span>
                            </div>
                            <div>
                              <h4 className="font-medium">{day.title}</h4>
                              <p className="text-sm text-gray-600">{day.description}</p>
                            </div>
                          </div>
                          <Button 
                            asChild 
                            variant="ghost" 
                            disabled={isUpcoming} 
                            className={isCompleted ? "text-green-600" : "text-blue-600"}
                          >
                            <Link to={`/student/days/${day.id}`}>
                              {isCompleted ? 'Review' : 'Study'} <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-gray-50">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{trimester.days.length} Days</span>
                    </div>
                    
                    {isInProgress && (
                      <Button asChild>
                        <Link to={`/student/days/${trimester.days[0].id}`}>
                          Continue Learning
                        </Link>
                      </Button>
                    )}
                    
                    {isCompleted && (
                      <div className="flex items-center text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        <span className="font-medium">Completed</span>
                      </div>
                    )}
                    
                    {isUpcoming && (
                      <span className="text-gray-500 text-sm">Available after completing previous trimester</span>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
};

export default Trimesters;
