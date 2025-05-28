
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Calendar, 
  BookOpen, 
  Lock, 
  Unlock, 
  CheckCircle,
  CircleDashed,
  Settings,
  Users,
  Headphones,
  FileCheck,
  Edit,
  GraduationCap,
  ArrowRight,
  Eye
} from 'lucide-react';
import { MOCK_COHORTS, MOCK_TRIMESTERS } from '@/lib/types';
import { MOCK_CURRICULUM_TRIMESTERS } from '@/lib/curriculumTypes';
import { toast } from '@/hooks/use-toast';

const DaysList = () => {
  const { cohortId, trimesterId } = useParams();
  const navigate = useNavigate();
  
  const cohort = MOCK_COHORTS.find(c => c.id === cohortId);
  const trimester = MOCK_TRIMESTERS.find(t => t.id === trimesterId);
  
  // Debug logging
  console.log('DaysList Debug:', {
    cohortId,
    trimesterId,
    foundCohort: cohort?.name,
    foundTrimester: trimester?.name,
    curriculumTrimesterId: trimester?.curriculum_trimester_id
  });
  
  // Get days from curriculum template
  const getTrimesterDays = () => {
    if (!trimester) {
      console.log('No trimester found');
      return [];
    }
    
    const curriculumTrimester = MOCK_CURRICULUM_TRIMESTERS.find(
      ct => ct.id === trimester.curriculum_trimester_id
    );
    
    console.log('Curriculum lookup:', {
      looking_for: trimester.curriculum_trimester_id,
      available: MOCK_CURRICULUM_TRIMESTERS.map(ct => ct.id),
      found: curriculumTrimester?.name
    });
    
    if (!curriculumTrimester) {
      // Fallback: create sample days for demonstration
      console.log('Creating fallback days for demonstration');
      return Array.from({ length: 24 }, (_, index) => ({
        id: `fallback_day_${index + 1}`,
        day_number: index + 1,
        title: `Day ${index + 1}: Sample Lesson`,
        description: `Sample lesson content for day ${index + 1}`,
        story_text: '<p>Sample story content...</p>',
        topic_notes: '<p>Sample topic notes...</p>',
        british_audio_url: '',
        american_audio_url: ''
      }));
    }
    
    return curriculumTrimester?.days || [];
  };
  
  const [dayAccessControl, setDayAccessControl] = useState<Record<string, boolean>>({});
  
  const trimesterDays = getTrimesterDays();

  if (!cohort || !trimester) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar isLoggedIn={true} userRole="tutor" />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Content Not Found</h1>
            <p className="mt-2 text-gray-600">The requested content could not be found.</p>
            <div className="mt-4 p-4 bg-gray-100 rounded text-left">
              <p><strong>Debug Info:</strong></p>
              <p>Cohort ID: {cohortId} - Found: {cohort ? 'Yes' : 'No'}</p>
              <p>Trimester ID: {trimesterId} - Found: {trimester ? 'Yes' : 'No'}</p>
            </div>
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
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 truncate">Managing {trimester.name}</h1>
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

        {/* Debug info for development */}
        {trimesterDays.length === 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <p className="text-orange-800">
                <strong>Debug:</strong> No days found for trimester. 
                Curriculum trimester ID: {trimester.curriculum_trimester_id}
              </p>
            </CardContent>
          </Card>
        )}

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

        {/* Trimester information box - like student view */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-medium">Cohort Learning Management</h2>
                <p className="text-gray-600">Manage access and track progress for each day in this trimester</p>
                <p className="text-sm text-gray-500 mt-1">
                  Using {cohort.proficiency_level} curriculum template
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

        {/* Days Grid - Student-style layout */}
        {trimesterDays.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {trimesterDays.map((day, dayIndex) => {
              const dayProgress = getDayProgress(day.day_number);
              const globalDayNumber = dayIndex + 1;
              const isCompleted = isDayCompleted(globalDayNumber);
              const isInProgress = isDayInProgress(globalDayNumber);
              const isLocked = isDayLocked(day.id);
              
              return (
                <Card 
                  key={day.id} 
                  className={`transition-all duration-200 hover:shadow-md border-2 ${
                    isCompleted 
                      ? 'border-green-200 bg-green-50/30' 
                      : isInProgress 
                        ? 'border-blue-200 bg-blue-50/30' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          isCompleted ? 'bg-green-100' : isInProgress ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <span className={`font-medium text-sm ${
                            isCompleted ? 'text-green-700' : isInProgress ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                            {globalDayNumber}
                          </span>
                        </div>
                        {isLocked ? (
                          <Lock className="h-4 w-4 text-red-500" />
                        ) : (
                          <Unlock className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      
                      {/* Status badges */}
                      <div className="flex gap-1">
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
                      </div>
                    </div>
                    
                    <div>
                      <CardTitle className="text-base font-medium line-clamp-2">
                        {day.title}
                      </CardTitle>
                      <CardDescription className="text-xs line-clamp-2 mt-1">
                        {day.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Activity icons - same as student view */}
                    <div className="flex items-center gap-1 mb-3">
                      <BookOpen className={`h-3 w-3 ${dayProgress.reading ? 'text-green-500' : 'text-gray-400'}`} />
                      <Headphones className={`h-3 w-3 ${dayProgress.listeningAmerican ? 'text-green-500' : 'text-gray-400'}`} />
                      <Headphones className={`h-3 w-3 ${dayProgress.listeningBritish ? 'text-green-500' : 'text-gray-400'}`} />
                      <FileCheck className={`h-3 w-3 ${dayProgress.vocabulary ? 'text-green-500' : 'text-gray-400'}`} />
                      <FileCheck className={`h-3 w-3 ${dayProgress.topic ? 'text-green-500' : 'text-gray-400'}`} />
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mb-4">
                      <Progress 
                        value={(dayProgress.totalCompleted / dayProgress.total) * 100} 
                        className="h-1.5" 
                      />
                    </div>
                    
                    {/* Tutor controls */}
                    <div className="flex flex-col gap-2">
                      {/* Access Control */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Student Access:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{isLocked ? 'Locked' : 'Unlocked'}</span>
                          <Switch
                            checked={!isLocked}
                            onCheckedChange={() => toggleDayAccess(day.id)}
                            aria-label={`Toggle access for ${day.title}`}
                          />
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <Button 
                          asChild 
                          variant="outline" 
                          className="flex-1 text-xs"
                          size="sm"
                        >
                          <Link to={`/student/day/${day.id}`}>
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Link>
                        </Button>
                        <Button 
                          asChild 
                          variant="default" 
                          className="flex-1 text-xs"
                          size="sm"
                        >
                          <Link to={`/tutor/materials/cohort/${cohortId}/trimester/${trimesterId}/day/${day.id}/edit`}>
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Days Available</h3>
              <p className="text-gray-600 mb-4">
                This trimester doesn't have any days configured yet.
              </p>
              <Button asChild>
                <Link to={`/tutor/curriculum`}>
                  Set Up Curriculum
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

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
