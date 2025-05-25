
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProgressCard from '@/components/student/ProgressCard';
import WeeklyRankings from '@/components/student/WeeklyRankings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOCK_DAYS, MOCK_PROGRESS } from '@/lib/types';

const StudentDashboard = () => {
  // In a real app, this would come from an API call
  const studentName = 'John Doe';
  const currentUserId = 'user1';
  const days = MOCK_DAYS;
  const progress = MOCK_PROGRESS;
  
  const currentDay = days[1]; // Assuming day 2 is the current day
  const completedDays = 1;
  const totalDays = days.length;
  
  // Mock data for weekly rankings
  const cohortStudents = [
    { id: 'user2', name: 'Alice Johnson', username: 'alice_j', score: 95 },
    { id: currentUserId, name: studentName, username: 'john_doe', score: 87 },
    { id: 'user3', name: 'Bob Smith', username: 'bob_smith', score: 82 },
    { id: 'user4', name: 'Carol Wilson', username: 'carol_w', score: 78 },
    { id: 'user5', name: 'David Brown', username: 'david_b', score: 75 },
  ];
  
  // Get today's activities
  const todayActivities = [
    { name: 'Reading', completed: true },
    { name: 'Listening (American)', completed: true },
    { name: 'Listening (British)', completed: false },
    { name: 'Vocabulary Assessment', completed: false },
    { name: 'Topic Assessment', completed: false }
  ];
  
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <ProgressCard
            title="Course Progress"
            value={completedDays}
            maxValue={totalDays}
            label={`${completedDays} of ${totalDays} days completed`}
          />
          <ProgressCard
            title="Vocabulary Score"
            value={progress[0].score_summary.vocabulary}
            maxValue={100}
            label={`${progress[0].score_summary.vocabulary}% correct`}
          />
          <ProgressCard
            title="Topic Assessments"
            value={progress[0].score_summary.topic}
            maxValue={100}
            label={`${progress[0].score_summary.topic}% correct`}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          <div className="lg:col-span-2 space-y-4">
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
                          Start
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
            <WeeklyRankings students={cohortStudents} currentUserId={currentUserId} />
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
