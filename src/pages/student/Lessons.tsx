import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Cohort, getCohort } from '@/services/cohorts';
import { CurriculumTrimester, getCurriculumTrimesters, getTrimesterDays } from '@/services/curriculum';
import { getStudentProgress, ProgressEntry } from '@/services/progress';
import { useAuth } from '@/hooks/useAuth';
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
  const [openTrimesters, setOpenTrimesters] = useState<Record<string, boolean>>({});
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [trimesters, setTrimesters] = useState<CurriculumTrimester[]>([]);
  const [daysByTrimester, setDaysByTrimester] = useState<Record<string, any[]>>({});
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    if (!user?.enrollments?.length) return;
    const cohortId = user.enrollments[0].cohort_id;

    // Fetch cohort
    getCohort(cohortId)
      .then(async (c) => {
        setCohort(c);
        // open the current trimester accordion by default
        setOpenTrimesters({ [c.current_trimester.toString()]: true });

        const tris = await getCurriculumTrimesters(c.curriculum_id);
        setTrimesters(tris);

        const dayMap: Record<string, any[]> = {};
        await Promise.all(
          tris.map(async (tri) => {
            let days = tri.days && tri.days.length > 0 ? tri.days : await getTrimesterDays(tri.id);
            days = days.map((d: any) => ({ ...d, day_number: d.day_number ?? d.number }));
            dayMap[tri.id] = days;
          })
        );
        setDaysByTrimester(dayMap);

        // Progress
        const progress = await getStudentProgress(user.id, c.id);
        setProgressEntries(progress);
      })
      .catch((err) => console.error('Failed to load lessons data', err));
  }, [user]);

  const toggleTrimester = (trimesterId: string) => {
    setOpenTrimesters(prev => ({
      ...prev,
      [trimesterId]: !prev[trimesterId]
    }));
  };

  const getTrimesterDaysLocal = (trimester: CurriculumTrimester) => daysByTrimester[trimester.id] || [];

  const buildDayProgress = (dayId: string) => {
    const entry = progressEntries.find((p) => p.day.id === dayId);
    if (!entry) {
      return {
        reading: false,
        listeningAmerican: false,
        listeningBritish: false,
        vocabulary: false,
        topic: false,
        totalCompleted: 0,
        total: 5,
      };
    }

    const activities = entry.completed_activities || [];
    const isDone = (act: string) => activities.includes(act);

    return {
      reading: entry.completed || isDone('reading'),
      listeningAmerican: isDone('listening_american'),
      listeningBritish: isDone('listening_british'),
      vocabulary: isDone('vocabulary_test'),
      topic: isDone('topic_test'),
      totalCompleted: entry.completed ? 5 : activities.length,
      total: 5,
    };
  };

  const getTrimesterProgress = (trimester: CurriculumTrimester) => {
    if (!cohort) return 0;
    const currentTrimester = cohort.current_trimester;
    if (trimester.number < currentTrimester) return 100;
    if (trimester.number === currentTrimester) {
      // crude calc based on day completion entries
      const days = getTrimesterDaysLocal(trimester);
      if (!days.length) return 0;
      const completedCount = days.filter((d) => {
        const entry = progressEntries.find((p) => p.day.id === d.id);
        return entry?.completed;
      }).length;
      return Math.round((completedCount / days.length) * 100);
    }
    return 0;
  };

  const getTrimesterStatus = (trimester: CurriculumTrimester) => {
    if (!cohort) return 'upcoming';
    const currentTrimester = cohort.current_trimester;
    if (trimester.number < currentTrimester) return 'completed';
    if (trimester.number === currentTrimester) return 'current';
    return 'upcoming';
  };

  return (
    <Layout isLoggedIn={true} userRole="student">
      <div className="container mx-auto px-2 sm:px-4 max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 truncate">Your Learning Journey</h1>
              <div className="flex items-center gap-2 text-gray-600 flex-wrap">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="truncate">{cohort?.name}</span>
                <Badge variant="outline" className="flex-shrink-0">{cohort?.proficiency_level}</Badge>
              </div>
            </div>
            <div className="text-left sm:text-right flex-shrink-0">
              <p className="text-sm text-gray-600">Current Progress</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">Trimester {cohort?.current_trimester}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {trimesters.map((trimester) => {
            const isOpen = openTrimesters[trimester.id] || false;
            const progress = getTrimesterProgress(trimester);
            const status = getTrimesterStatus(trimester);
            const trimesterDays = getTrimesterDaysLocal(trimester);
            
            return (
              <Card key={trimester.id} className={`transition-all duration-200 ${
                status === 'current' ? 'border-blue-200 shadow-lg bg-gradient-to-r from-blue-50/50 to-transparent' : 
                status === 'completed' ? 'border-green-200 shadow-md bg-gradient-to-r from-green-50/30 to-transparent' : 
                'border-gray-100 shadow-sm'
              }`}>
                <Collapsible 
                  open={isOpen} 
                  onOpenChange={() => toggleTrimester(trimester.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className={`cursor-pointer hover:bg-gray-50/50 transition-colors ${
                      status === 'current' ? 'bg-blue-50/30' : 
                      status === 'completed' ? 'bg-green-50/20' : ''
                    }`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                              {status === 'completed' && <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />}
                              {status === 'current' && <CircleDashed className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />}
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
                            <div className="text-sm sm:text-lg font-semibold">{progress}%</div>
                          </div>
                          <Badge className={`text-xs ${
                            status === 'current' ? 'bg-blue-100 text-blue-800' : 
                            status === 'completed' ? 'bg-green-100 text-green-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {status === 'current' ? 'In Progress' : 
                             status === 'completed' ? 'Completed' : 'Upcoming'}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Progress value={progress} className="h-1.5 sm:h-2" />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0 px-3 sm:px-6">
                      <div className="mt-4 sm:mt-6">
                        <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Days in this Trimester</h3>
                        <div className="space-y-2 sm:space-y-3">
                          {trimesterDays.map((day, dayIndex) => {
                            const dayProgress = buildDayProgress(day.id);
                            const isAccessible = status !== 'upcoming';
                            
                            return (
                              <div key={day.id} className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-b-0">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                  <div 
                                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0
                                      ${status === 'completed' || dayProgress.totalCompleted === dayProgress.total ? 'bg-green-100' : 
                                        status === 'current' ? 'bg-blue-100' : 'bg-gray-100'}`}
                                  >
                                    <span className={`font-medium text-xs sm:text-sm
                                      ${status === 'completed' || dayProgress.totalCompleted === dayProgress.total ? 'text-green-700' : 
                                        status === 'current' ? 'text-blue-700' : 'text-gray-700'}`}>
                                      {day.day_number}
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-medium text-sm sm:text-base truncate">{day.title}</h4>
                                    <p className="text-xs sm:text-sm text-gray-600 truncate">{day.description}</p>
                                    
                                    {/* Activity icons */}
                                    <div className="flex items-center gap-1 mt-1">
                                      <BookOpen className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${dayProgress.reading ? 'text-green-500' : 'text-gray-400'}`} />
                                      <Headphones className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${dayProgress.listeningAmerican ? 'text-green-500' : 'text-gray-400'}`} />
                                      <Headphones className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${dayProgress.listeningBritish ? 'text-green-500' : 'text-gray-400'}`} />
                                      <FileCheck className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${dayProgress.vocabulary ? 'text-green-500' : 'text-gray-400'}`} />
                                      <FileCheck className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${dayProgress.topic ? 'text-green-500' : 'text-gray-400'}`} />
                                    </div>
                                    
                                    {/* Progress bar */}
                                    <div className="mt-1.5 sm:mt-2">
                                      <Progress 
                                        value={(dayProgress.totalCompleted / dayProgress.total) * 100} 
                                        className="h-1 sm:h-1.5 w-24 sm:w-32" 
                                      />
                                    </div>
                                  </div>
                                </div>
                                <Button 
                                  asChild 
                                  variant="ghost" 
                                  disabled={!isAccessible} 
                                  className={`${
                                    status === 'completed' || dayProgress.totalCompleted === dayProgress.total 
                                      ? "text-green-600" 
                                      : "text-blue-600"
                                  } ${!isAccessible ? 'opacity-50' : ''} flex-shrink-0`}
                                  size="sm"
                                >
                                  <Link to={`/student/day/${day.id}`} className="text-xs sm:text-sm">
                                    {!isAccessible ? 'Locked' :
                                     status === 'completed' || dayProgress.totalCompleted === dayProgress.total ? 'Review' : 'Study'}
                                  </Link>
                                </Button>
                              </div>
                            );
                          })}
                        </div>
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
