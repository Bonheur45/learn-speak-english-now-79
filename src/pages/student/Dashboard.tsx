import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProgressCard from '@/components/student/ProgressCard';
import WeeklyRankings from '@/components/student/WeeklyRankings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Video, Clock } from 'lucide-react';
import { getMe, getMyProgress, getCohortDays, getCohortProgress } from '@/services/student';
import { getLiveClasses, LiveClass } from '@/services/liveClasses';
import { getStudents, StudentProfile } from '@/services/students';

const StudentDashboard = () => {
  const [studentName, setStudentName] = useState('');
  const [userId, setUserId] = useState('');
  const [cohortId, setCohortId] = useState('');
  const [days, setDays] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(async (profile) => {
        const name = (profile.full_name || profile.name || profile.username || '').split(' ')[0];
        setStudentName(name);
        setUserId(profile.id);

        const cId = profile.cohort_id || profile.enrollments?.[0]?.cohort_id || '';
        setCohortId(cId);

        if (!cId) {
          return {
            days: [],
            myProgress: [],
            cohortProgress: [],
            liveClasses: [],
            students: [],
          } as any;
        }

        const [daysRes, myProgRes, cohortProgRes, liveClassesRes, studentsRes] = await Promise.all([
          getCohortDays(cId),
          getMyProgress(profile.id, cId),
          getCohortProgress(cId),
          getLiveClasses(cId),
          getStudents(),
        ]);

        return {
          days: daysRes,
          myProgress: myProgRes,
          cohortProgress: cohortProgRes,
          liveClasses: liveClassesRes,
          students: studentsRes,
        } as any;
      })
      .then((data) => {
        setDays(data.days);
        setProgress(data.myProgress);

        // Determine upcoming live class
        if (data.liveClasses && data.liveClasses.length) {
          const upcoming = [...data.liveClasses]
            .filter((c) => new Date(c.date_time) >= new Date())
            .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())[0];
          setLiveClass(upcoming || null);
        }

        // Build weekly ranking based on cohort progress
        if (data.cohortProgress && data.cohortProgress.length) {
          const map: Record<string, { id: string; name: string; username: string; score: number }> = {};
          data.cohortProgress.forEach((p: any) => {
            const sid = p.student_id;
            if (!map[sid]) {
              const stu = data.students.find((s: StudentProfile) => s.id === sid);
              map[sid] = {
                id: sid,
                name: stu?.full_name || stu?.username || 'Student',
                username: stu?.username || '',
                score: 0,
              };
            }
            map[sid].score += p.score ?? 0;
          });
          const rankingArr = Object.values(map).sort((a, b) => b.score - a.score);
          setRanking(rankingArr);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Layout isLoggedIn={true} userRole="student"><div className="p-10">Loading...</div></Layout>;
  }

  if (!cohortId || days.length === 0) {
    return <Layout isLoggedIn={true} userRole="student"><div className="p-10">No days available.</div></Layout>;
  }

  const currentDayIndex = progress.find((p:any) => p.completed_at === undefined) ? progress.length : progress.length; // simplistic
  const currentDay = days[currentDayIndex] || days[0];
  const completedDays = progress.filter((p:any) => p.completed_at).length;
  const totalDays = days.length;

  const cohortStudents:any[] = ranking;

  // Get today's activities including Writing
  const todayActivities = [
    { name: 'Reading', completed: true },
    { name: 'Listening (American)', completed: true },
    { name: 'Listening (British)', completed: false },
    { name: 'Writing Assessment', completed: false },
    { name: 'Vocabulary Assessment', completed: false },
    { name: 'Topic Assessment', completed: false }
  ];

  // Live class details
  const liveClassData = liveClass ? {
    title: liveClass.title,
    time: `${new Date(liveClass.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    meetLink: liveClass.link,
    isLive: new Date(liveClass.date_time) <= new Date() && new Date() <= new Date(new Date(liveClass.date_time).getTime() + 60*60*1000),
  } : null;
  
  // Helpers to map CEFR -> percentage (rough)
  const cefrToPercent = (level?: string): number => {
    switch (level) {
      case 'A1':
      case 'A1-A2':
        return 20;
      case 'A2':
        return 35;
      case 'B1':
      case 'B1-B2':
        return 55;
      case 'B2':
        return 70;
      case 'C1':
        return 85;
      case 'C2':
      case 'C1-C2':
        return 100;
      default:
        return 0;
    }
  };

  const latestProgress: any = [...progress].sort((a, b) => new Date(b.last_updated || b.day?.date || 0).getTime() - new Date(a.last_updated || a.day?.date || 0).getTime())[0];

  const vocabularyScore = latestProgress ? cefrToPercent(latestProgress.vocabulary_level) : 0;
  const writingScore = latestProgress ? cefrToPercent(latestProgress.writing_level) : 0;
  const topicScore = latestProgress?.score ?? 0;

  return (
    <Layout isLoggedIn={true} userRole="student">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-blue">Welcome back, {studentName}</h1>
            <p className="text-gray-600 mt-1">Here's your learning progress for today.</p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <Button asChild className="w-full md:w-auto bg-brand-yellow text-brand-blue hover:brightness-95">
              <Link to={`/student/days/${currentDay.id}`}>Continue Learning</Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <ProgressCard
            title="Course Progress"
            value={completedDays}
            maxValue={totalDays}
            label={`${completedDays} of ${totalDays} days completed`}
          />
          <ProgressCard
            title="Vocabulary Level"
            value={vocabularyScore}
            maxValue={100}
            label={`${vocabularyScore}% proficiency`}
          />
          <ProgressCard
            title="Writing Level"
            value={writingScore}
            maxValue={100}
            label={`${writingScore}% proficiency`}
          />
          <ProgressCard
            title="Overall Assessment Score"
            value={topicScore}
            maxValue={100}
            label={`${topicScore}% average`}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Live Class Notice */}
            {liveClassData && (
              <Alert className="border-green-200 bg-green-50">
                <Video className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-800">{liveClassData.title}</p>
                      <p className="text-green-700 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {liveClassData.time}
                      </p>
                    </div>
                    <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                      <a href={liveClassData.meetLink} target="_blank" rel="noopener noreferrer">
                        {liveClassData.isLive ? 'Join Live Class' : 'View Details'}
                      </a>
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Today's Learning Plan</CardTitle>
                <CardDescription>
                  Day {currentDay.id}: {currentDay.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-700">{currentDay.description}</p>
                <ul className="divide-y">
                  {todayActivities.map((activity, index) => (
                    <li key={index} className="py-2 flex justify-between items-center">
                      <span className="flex items-center">
                        {activity.completed ? (
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                          </svg>
                        )}
                        {activity.name}
                      </span>
                      {!activity.completed && (
                        <Button variant="ghost" size="sm" className="text-brand-blue hover:text-brand-yellow hover:bg-brand-blue">
                          {activity.name === 'Writing Assessment' ? (
                            <Link to={`/student/writing-assessment/${currentDay.id}`}>Start</Link>
                          ) : (
                            'Start'
                          )}
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Lessons</CardTitle>
                <CardDescription>
                  Your latest learning materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                {days.slice(0, 3).map((day, index) => (
                  <div key={day.id} className={`py-3 ${index !== days.slice(0, 3).length - 1 ? 'border-b' : ''}`}>
                    <div className="flex justify-between items-center">
                      <div className="pr-2">
                        <h4 className="font-medium text-sm sm:text-base">Day {day.id}: {day.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">{day.description}</p>
                      </div>
                      <Button asChild variant="ghost" className="text-brand-blue hover:text-brand-yellow hover:bg-brand-blue ml-2">
                        <Link to={`/student/days/${day.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <WeeklyRankings students={cohortStudents} currentUserId={userId} />
          </div>
        </div>
      </div>
      
      <footer className="bg-white border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Let's Do It English. All rights reserved.</p>
        </div>
      </footer>
    </Layout>
  );
};

export default StudentDashboard;
