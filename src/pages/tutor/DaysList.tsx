
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
  Users
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} userRole="tutor" />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/tutor/materials" className="hover:text-brand-blue">Materials</Link>
            <span>/</span>
            <Link to={`/tutor/materials/cohort/${cohortId}`} className="hover:text-brand-blue">{cohort.name}</Link>
            <span>/</span>
            <span className="font-medium">{trimester.name}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-brand-blue">{trimester.name}</h1>
              <p className="text-gray-600 mt-1">Manage day access and track student progress</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm">
                <Link to={`/tutor/materials/cohort/${cohortId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Trimesters
                </Link>
              </Button>
            </div>
          </div>

          {/* Cohort Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Cohort</CardDescription>
                <CardTitle className="text-lg">{cohort.name}</CardTitle>
              </CardHeader>
            </Card>
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
          </div>
        </div>

        {/* Days organized like student interface */}
        <Card className="overflow-hidden">
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50/50 transition-colors bg-blue-50/30">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <CircleDashed className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <span className="truncate">{trimester.name}</span>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm truncate">
                          {new Date(trimester.start_date).toLocaleDateString()} - {new Date(trimester.end_date).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Progress</div>
                      <div className="text-lg font-semibold">{Math.round(calculateProgress())}%</div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      In Progress
                    </Badge>
                  </div>
                </div>
                <div className="mt-3">
                  <Progress value={calculateProgress()} className="h-2" />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent className="pt-0 px-6">
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Day Access Control
                  </h3>
                  <div className="space-y-3">
                    {trimesterDays.map((day, dayIndex) => {
                      const globalDayNumber = dayIndex + 1;
                      const isCompleted = isDayCompleted(globalDayNumber);
                      const isInProgress = isDayInProgress(globalDayNumber);
                      const isLocked = isDayLocked(day.id);
                      
                      return (
                        <div key={day.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div 
                              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                                ${isCompleted ? 'bg-green-100' : isInProgress ? 'bg-blue-100' : 'bg-gray-100'}`}
                            >
                              <span className={`font-medium text-sm
                                ${isCompleted ? 'text-green-700' : isInProgress ? 'text-blue-700' : 'text-gray-700'}`}>
                                {globalDayNumber}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-base truncate">{day.title}</h4>
                              <p className="text-sm text-gray-600 truncate">{day.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {isCompleted && (
                              <Badge variant="outline" className="text-green-600 border-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                            {isInProgress && (
                              <Badge variant="outline" className="text-blue-600 border-blue-200">
                                <CircleDashed className="h-3 w-3 mr-1" />
                                In Progress
                              </Badge>
                            )}
                            
                            <div className="flex items-center gap-2">
                              {isLocked ? (
                                <Lock className="h-4 w-4 text-red-500" />
                              ) : (
                                <Unlock className="h-4 w-4 text-green-500" />
                              )}
                              <Switch
                                checked={!isLocked}
                                onCheckedChange={() => toggleDayAccess(day.id)}
                                aria-label={`Toggle access for ${day.title}`}
                              />
                              <span className="text-sm text-gray-600 min-w-[60px]">
                                {isLocked ? 'Locked' : 'Unlocked'}
                              </span>
                            </div>
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
