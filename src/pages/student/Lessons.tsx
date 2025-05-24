
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { MOCK_TRIMESTERS, MOCK_COHORTS } from '@/lib/types';
import { 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  Headphones, 
  FileCheck, 
  CheckCircle, 
  CircleDashed,
  Calendar,
  GraduationCap
} from 'lucide-react';

const Lessons = () => {
  const [openTrimesters, setOpenTrimesters] = useState<Record<string, boolean>>({
    '1': true, // First trimester open by default
  });

  // Get current cohort (in real app, this would come from user context)
  const currentCohort = MOCK_COHORTS[0]; // Assuming first cohort for demo
  
  // Filter trimesters for current cohort
  const trimesters = MOCK_TRIMESTERS.filter(t => t.cohort_id === currentCohort.id);

  const toggleTrimester = (trimesterId: string) => {
    setOpenTrimesters(prev => ({
      ...prev,
      [trimesterId]: !prev[trimesterId]
    }));
  };

  const getDayProgress = (dayNumber: number) => {
    // Mock progress data - in real app, this would come from user's actual progress
    const completedDays = Math.floor(Math.random() * 5) + 1; // Random for demo
    return {
      reading: dayNumber <= completedDays,
      listeningAmerican: dayNumber <= completedDays,
      listeningBritish: dayNumber <= completedDays - 1,
      vocabulary: dayNumber <= completedDays,
      topic: dayNumber <= completedDays - 1,
      totalCompleted: dayNumber <= completedDays ? 5 : Math.floor(Math.random() * 5),
      total: 5
    };
  };

  const getTrimesterProgress = (trimester: any) => {
    const currentTrimester = currentCohort.current_trimester;
    if (trimester.number < currentTrimester) return 100;
    if (trimester.number === currentTrimester) return 35; // Current progress
    return 0;
  };

  const getTrimesterStatus = (trimester: any) => {
    const currentTrimester = currentCohort.current_trimester;
    if (trimester.number < currentTrimester) return 'completed';
    if (trimester.number === currentTrimester) return 'current';
    return 'upcoming';
  };

  return (
    <Layout isLoggedIn={true} userRole="student">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Learning Journey</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="h-5 w-5" />
                <span>{currentCohort.name}</span>
                <Badge variant="outline">{currentCohort.proficiency_level}</Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Current Progress</p>
              <p className="text-2xl font-bold text-blue-600">Trimester {currentCohort.current_trimester}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {trimesters.map((trimester) => {
            const isOpen = openTrimesters[trimester.id] || false;
            const progress = getTrimesterProgress(trimester);
            const status = getTrimesterStatus(trimester);
            
            return (
              <Card key={trimester.id} className={`transition-all ${
                status === 'current' ? 'border-blue-500 shadow-md' : 
                status === 'completed' ? 'border-green-300' : 'border-gray-200'
              }`}>
                <Collapsible 
                  open={isOpen} 
                  onOpenChange={() => toggleTrimester(trimester.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className={`cursor-pointer hover:bg-gray-50 ${
                      status === 'current' ? 'bg-blue-50' : 
                      status === 'completed' ? 'bg-green-50' : ''
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isOpen ? (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                              {status === 'current' && <CircleDashed className="h-5 w-5 text-blue-500" />}
                              {trimester.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(trimester.start_date).toLocaleDateString()} - {new Date(trimester.end_date).toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-600">Progress</div>
                            <div className="text-lg font-semibold">{progress}%</div>
                          </div>
                          <Badge className={
                            status === 'current' ? 'bg-blue-100 text-blue-800' : 
                            status === 'completed' ? 'bg-green-100 text-green-800' : 
                            'bg-gray-100 text-gray-800'
                          }>
                            {status === 'current' ? 'In Progress' : 
                             status === 'completed' ? 'Completed' : 'Upcoming'}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Progress value={progress} className="h-2" />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {trimester.days.map((day) => {
                          const dayProgress = getDayProgress(day.day_number);
                          const isAccessible = status !== 'upcoming';
                          
                          return (
                            <Card key={day.id} className={`transition-all hover:shadow-md ${
                              !isAccessible ? 'opacity-60' : ''
                            }`}>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                      dayProgress.totalCompleted === dayProgress.total ? 'bg-green-100 text-green-700' :
                                      dayProgress.totalCompleted > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                      {day.day_number}
                                    </div>
                                    {dayProgress.totalCompleted === dayProgress.total && (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {dayProgress.totalCompleted}/{dayProgress.total}
                                  </div>
                                </div>
                                
                                <h4 className="font-medium text-sm mb-1 line-clamp-2">{day.title}</h4>
                                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{day.description}</p>
                                
                                <div className="mb-3">
                                  <Progress 
                                    value={(dayProgress.totalCompleted / dayProgress.total) * 100} 
                                    className="h-1.5" 
                                  />
                                </div>
                                
                                <div className="flex flex-wrap gap-1 mb-3">
                                  <div className="flex items-center" title="Reading">
                                    <BookOpen className={`h-3 w-3 ${dayProgress.reading ? 'text-green-500' : 'text-gray-400'}`} />
                                  </div>
                                  <div className="flex items-center" title="US Listening">
                                    <Headphones className={`h-3 w-3 ${dayProgress.listeningAmerican ? 'text-green-500' : 'text-gray-400'}`} />
                                  </div>
                                  <div className="flex items-center" title="UK Listening">
                                    <Headphones className={`h-3 w-3 ${dayProgress.listeningBritish ? 'text-green-500' : 'text-gray-400'}`} />
                                  </div>
                                  <div className="flex items-center" title="Vocabulary">
                                    <FileCheck className={`h-3 w-3 ${dayProgress.vocabulary ? 'text-green-500' : 'text-gray-400'}`} />
                                  </div>
                                  <div className="flex items-center" title="Topic">
                                    <FileCheck className={`h-3 w-3 ${dayProgress.topic ? 'text-green-500' : 'text-gray-400'}`} />
                                  </div>
                                </div>
                                
                                <Button 
                                  asChild 
                                  size="sm" 
                                  className="w-full text-xs"
                                  variant={dayProgress.totalCompleted === dayProgress.total ? "outline" : "default"}
                                  disabled={!isAccessible}
                                >
                                  <Link to={`/student/days/${day.id}`}>
                                    {!isAccessible ? 'Locked' :
                                     dayProgress.totalCompleted === dayProgress.total ? 'Review' : 'Continue'}
                                  </Link>
                                </Button>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Lessons;
