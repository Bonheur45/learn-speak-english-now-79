
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_COHORTS, MOCK_TRIMESTERS, Trimester, ProficiencyLevel } from '@/lib/types';
import { MOCK_CURRICULUM_TRIMESTERS } from '@/lib/curriculumTypes';
import { ArrowRight, BookOpen, Calendar, Check, CheckCircle, CircleDashed, Clock } from 'lucide-react';

const Trimesters = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cohortId = searchParams.get('cohort') || '1';
  
  const [selectedCohort, setSelectedCohort] = useState(MOCK_COHORTS.find(c => c.id === cohortId));
  const [trimesters, setTrimesters] = useState<Trimester[]>([]);
  const [curriculumDays, setCurriculumDays] = useState<any[]>([]);
  
  useEffect(() => {
    const cohort = MOCK_COHORTS.find(c => c.id === cohortId);
    setSelectedCohort(cohort);
    
    if (cohort) {
      // Get cohort's trimesters
      const cohortTrimesters = MOCK_TRIMESTERS.filter(trim => trim.cohort_id === cohortId);
      setTrimesters(cohortTrimesters);
      
      // Get curriculum template content based on cohort's curriculum_template_id
      const curriculumTrimester = MOCK_CURRICULUM_TRIMESTERS.find(
        ct => ct.curriculum_id === cohort.curriculum_template_id
      );
      
      if (curriculumTrimester) {
        setCurriculumDays(curriculumTrimester.days || []);
      }
    }
  }, [cohortId]);
  
  if (!selectedCohort) {
    return (
      <Layout isLoggedIn={true} userRole="student">
        <div className="container mx-auto px-4">
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold">Cohort not found</h2>
            <p className="mt-2">The requested cohort does not exist.</p>
            <Button asChild className="mt-4">
              <Link to="/student/cohorts">View All Cohorts</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  const calculateTrimesterProgress = (trimester: Trimester) => {
    if (selectedCohort!.current_trimester > trimester.number) {
      return 100; // Past trimester, fully completed
    } else if (selectedCohort!.current_trimester === trimester.number) {
      return Math.min((selectedCohort!.current_day_position || 0) / 24 * 100, 100);
    } else {
      return 0; // Future trimester, not started
    }
  };

  const getLevelColor = (level: ProficiencyLevel) => {
    switch (level) {
      case 'A1-A2':
        return 'bg-emerald-100 text-emerald-800';
      case 'B1-B2':
        return 'bg-blue-100 text-blue-800';
      case 'C1-C2':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get days for each trimester from curriculum template
  const getTrimesterDays = (trimesterNumber: number) => {
    const startIndex = (trimesterNumber - 1) * 24;
    const endIndex = startIndex + 24;
    return curriculumDays.slice(startIndex, endIndex);
  };
  
  return (
    <Layout isLoggedIn={true} userRole="student">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Trimesters for {selectedCohort.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getLevelColor(selectedCohort.proficiency_level)}>
                  {selectedCohort.proficiency_level}
                </Badge>
                <span className="text-gray-600">•</span>
                <span className="text-gray-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(selectedCohort.start_date).toLocaleDateString()} - {new Date(selectedCohort.end_date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link to="/student/cohorts">Back to Cohorts</Link>
            </Button>
          </div>
        </div>
        
        {/* Trimester information box */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-medium">Your Learning Journey</h2>
                <p className="text-gray-600">Each trimester consists of 24 days of learning materials from your curriculum template</p>
                <p className="text-sm text-gray-500 mt-1">
                  Using {selectedCohort.proficiency_level} curriculum template
                </p>
              </div>
              <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Completed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">In Progress</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                  <span className="text-sm">Upcoming</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-8">
          {trimesters.map((trimester, index) => {
            const progress = calculateTrimesterProgress(trimester);
            const isCompleted = progress === 100;
            const isInProgress = selectedCohort.current_trimester === trimester.number;
            const isUpcoming = selectedCohort.current_trimester < trimester.number;
            const trimesterDays = getTrimesterDays(trimester.number);
            
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
                      <CardDescription className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
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
                      <span className="text-sm font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Days in this Trimester</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                      {trimesterDays.map((day, dayIndex) => {
                        const globalDayNumber = (trimester.number - 1) * 24 + dayIndex + 1;
                        const isDayCompleted = (selectedCohort.current_day_position || 0) >= globalDayNumber;
                        const isDayInProgress = (selectedCohort.current_day_position || 0) === globalDayNumber - 1;
                        
                        return (
                          <div key={day.id} className="flex items-center justify-between border-b pb-3">
                            <div className="flex items-center">
                              <div 
                                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                                  ${isDayCompleted ? 'bg-green-100' : isDayInProgress ? 'bg-blue-100' : 'bg-gray-100'}`}
                              >
                                <span className={`font-medium text-sm
                                  ${isDayCompleted ? 'text-green-700' : isDayInProgress ? 'text-blue-700' : 'text-gray-700'}`}>
                                  {globalDayNumber}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium text-base truncate">{day.title}</h4>
                                <p className="text-sm text-gray-600 truncate max-w-[200px]">{day.description}</p>
                              </div>
                            </div>
                            
                            <Button 
                              asChild 
                              variant="ghost" 
                              disabled={isUpcoming} 
                              className={isDayCompleted ? "text-green-600" : "text-blue-600"}
                              size="sm"
                            >
                              <Link to={`/student/day/${day.id}`}>
                                {isDayCompleted ? 'Review' : 'Study'} <ArrowRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-gray-50">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{trimesterDays.length} Days</span>
                    </div>
                    
                    {isInProgress && (
                      <Button asChild>
                        <Link to={`/student/day/${trimesterDays[0]?.id || ''}`}>
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
      </div>
    </Layout>
  );
};

export default Trimesters;
