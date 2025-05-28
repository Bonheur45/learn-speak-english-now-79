
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ArrowLeft, 
  Calendar, 
  BookOpen, 
  Lock, 
  Unlock, 
  ChevronDown, 
  ChevronRight,
  CheckCircle,
  CircleDashed,
  Settings,
  Users,
  Headphones,
  FileCheck,
  Edit,
  GraduationCap
} from 'lucide-react';
import { MOCK_COHORTS, MOCK_TRIMESTERS } from '@/lib/types';
import { MOCK_CURRICULUM_TRIMESTERS } from '@/lib/curriculumTypes';
import { toast } from '@/hooks/use-toast';

const DaysList = () => {
  const { cohortId, trimesterId } = useParams();
  const navigate = useNavigate();
  
  const cohort = MOCK_COHORTS.find(c => c.id === cohortId);
  const trimester = MOCK_TRIMESTERS.find(t => t.id === trimesterId);
  
  // Get days from curriculum template
  const getTrimesterDays = () => {
    if (!trimester) return [];
    const curriculumTrimester = MOCK_CURRICULUM_TRIMESTERS.find(
      ct => ct.id === trimester.curriculum_trimester_id
    );
    return curriculumTrimester?.days || [];
  };
  
  const [dayAccessControl, setDayAccessControl] = useState<Record<string, boolean>>({});
  const [isExpanded, setIsExpanded] = useState(true);
  
  const trimesterDays = getTrimesterDays();

  if (!cohort || !trimester) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar isLoggedIn={true} userRole="tutor" />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Content Not Found</h1>
            <p className="mt-2 text-gray-600">The requested content could not be found.</p>
            <Button asChild className="mt-4">
              <Link to="/tutor/materials">Back to Materials</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const toggleDayAccess = (dayId: string) => {
    setDayAccessControl(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
    toast({
      title: "Day Access Updated",
      description: `Day access has been ${dayAccessControl[dayId] ? 'unlocked' : 'locked'} for students.`,
    });
  };

  const calculateProgress = () => {
    const currentDay = cohort.current_day_position || 0;
    const totalDays = trimesterDays.length;
    return totalDays > 0 ? Math.min((currentDay / totalDays) * 100, 100) : 0;
  };

  const isDayCompleted = (dayNumber: number) => {
    return (cohort.current_day_position || 0) >= dayNumber;
  };

  const isDayInProgress = (dayNumber: number) => {
    return (cohort.current_day_position || 0) === dayNumber - 1;
  };

  const isDayLocked = (dayId: string) => {
    return dayAccessControl[dayId] === true;
  };

  const getDayProgress = (dayNumber: number) => {
    // Mock progress data - in real app, this would come from aggregated student data
    const completedDays = Math.floor(Math.random() * 5) + 1;
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} userRole="tutor" />
      
      <main className="flex-grow container mx-auto px-2 sm:px-4 max-w-7xl py-8">
        {/* Header - matching student layout */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/tutor/materials" className="hover:text-brand-blue">Materials</Link>
            <span>/</span>
            <Link to={`/tutor/materials/cohort/${cohortId}`} className="hover:text-brand-blue">{cohort.name}</Link>
            <span>/</span>
            <span className="font-medium">{trimester.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 truncate">Cohort Learning Management</h1>
              <div className="flex items-center gap-2 text-gray-600 flex-wrap">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="truncate">{cohort.name}</span>
                <Badge variant="outline" className="flex-shrink-0">{cohort.proficiency_level}</Badge>
              </div>
            </div>
            <div className="text-left sm:text-right flex-shrink-0">
              <p className="text-sm text-gray-600">Class Progress</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{Math.round(calculateProgress())}%</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Students</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {cohort.enrolled_students}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Progress</CardDescription>
              <CardTitle className="text-2xl">{Math.round(calculateProgress())}%</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Days</CardDescription>
              <CardTitle className="text-2xl">{trimesterDays.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Current Day</CardDescription>
              <CardTitle className="text-2xl">{cohort.current_day_position || 0}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Days organized like student interface */}
        <div className="space-y-4 sm:space-y-6">
          <Card className={`transition-all duration-200 border-blue-200 shadow-lg bg-gradient-to-r from-blue-50/50 to-transparent`}>
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <CardHeader className={`cursor-pointer hover:bg-gray-50/50 transition-colors bg-blue-50/30`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                          <CircleDashed className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                          <span className="truncate">{trimester.name}</span>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm truncate">
                            {new Date(trimester.start_date).toLocaleDateString()} - {new Date(trimester.end_date).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-xs sm:text-sm text-gray-600">Progress</div>
                        <div className="text-sm sm:text-lg font-semibold">{Math.round(calculateProgress())}%</div>
                      </div>
                      <Badge className="text-xs bg-blue-100 text-blue-800">
                        Managing
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress value={calculateProgress()} className="h-1.5 sm:h-2" />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0 px-3 sm:px-6">
                  <div className="mt-4 sm:mt-6">
                    <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Day Access Control & Content Management
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {trimesterDays.map((day, dayIndex) => {
                        const dayProgress = getDayProgress(day.day_number);
                        const globalDayNumber = dayIndex + 1;
                        const isCompleted = isDayCompleted(globalDayNumber);
                        const isInProgress = isDayInProgress(globalDayNumber);
                        const isLocked = isDayLocked(day.id);
                        
                        return (
                          <div key={day.id} className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                              <div 
                                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0
                                  ${isCompleted ? 'bg-green-100' : isInProgress ? 'bg-blue-100' : 'bg-gray-100'}`}
                              >
                                <span className={`font-medium text-xs sm:text-sm
                                  ${isCompleted ? 'text-green-700' : isInProgress ? 'text-blue-700' : 'text-gray-700'}`}>
                                  {globalDayNumber}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium text-sm sm:text-base truncate">{day.title}</h4>
                                <p className="text-xs sm:text-sm text-gray-600 truncate">{day.description}</p>
                                
                                {/* Activity icons - same as student view */}
                                <div className="flex items-center gap-1 mt-1">
                                  <BookOpen className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${dayProgress.reading ? 'text-green-500' : 'text-gray-400'}`} />
                                  <Headphones className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${dayProgress.listeningAmerican ? 'text-green-500' : 'text-gray-400'}`} />
                                  <Headphones className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${dayProgress.listeningBritish ? 'text-green-500' : 'text-gray-400'}`} />
                                  <FileCheck className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${dayProgress.vocabulary ? 'text-green-500' : 'text-gray-400'}`} />
                                  <FileCheck className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${dayProgress.topic ? 'text-green-500' : 'text-gray-400'}`} />
                                </div>
                                
                                {/* Progress bar - same as student view */}
                                <div className="mt-1.5 sm:mt-2">
                                  <Progress 
                                    value={(dayProgress.totalCompleted / dayProgress.total) * 100} 
                                    className="h-1 sm:h-1.5 w-24 sm:w-32" 
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* Tutor controls */}
                            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                              {isCompleted && (
                                <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Done
                                </Badge>
                              )}
                              {isInProgress && (
                                <Badge variant="outline" className="text-blue-600 border-blue-200 text-xs">
                                  <CircleDashed className="h-3 w-3 mr-1" />
                                  Active
                                </Badge>
                              )}
                              
                              {/* Access Control */}
                              <div className="flex items-center gap-1">
                                {isLocked ? (
                                  <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                                ) : (
                                  <Unlock className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                                )}
                                <Switch
                                  checked={!isLocked}
                                  onCheckedChange={() => toggleDayAccess(day.id)}
                                  aria-label={`Toggle access for ${day.title}`}
                                  className="scale-75 sm:scale-100"
                                />
                              </div>
                              
                              {/* Edit Button */}
                              <Button 
                                asChild 
                                variant="ghost" 
                                className="text-blue-600 flex-shrink-0 px-2 sm:px-3"
                                size="sm"
                              >
                                <Link to={`/tutor/materials/cohort/${cohortId}/trimester/${trimesterId}/day/${day.id}/edit`} className="text-xs sm:text-sm">
                                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                  Edit
                                </Link>
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>

        {/* Back button */}
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to={`/tutor/materials/cohort/${cohortId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Trimesters
            </Link>
          </Button>
        </div>
      </main>
      
      <footer className="bg-white border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Let's Do It English. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DaysList;
