import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getStudents, StudentProfile } from '@/services/students';

interface RecentStudent {
  id: string;
  full_name: string;
  email: string;
  lastActive: string; // formatted string
}

const TutorDashboard = () => {
  const tutorName = 'Tutor';

  const [studentCount, setStudentCount] = useState(0);
  const [recentStudents, setRecentStudents] = useState<RecentStudent[]>([]);

  const uploadedMaterialsCount = 0; // TODO: fetch materials stats
  const assessmentsCount = 0; // TODO: fetch assessments stats

  const studentActivity = [] as { day: string; completionRate: number }[]; // placeholder until analytics endpoint wired

  useEffect(() => {
    getStudents()
      .then((students) => {
        setStudentCount(students.length);

        // sort by updated_at (or created_at) desc and take top 3
        const sorted = [...students].sort((a, b) => {
          const aDate = new Date(a.updated_at || a.created_at || 0).getTime();
          const bDate = new Date(b.updated_at || b.created_at || 0).getTime();
          return bDate - aDate;
        });

        const recents = sorted.slice(0, 3).map((s) => ({
          id: s.id,
          full_name: s.full_name || s.username || 'Student',
          email: s.email,
          lastActive: new Date(s.updated_at || s.created_at).toLocaleDateString(),
        }));
        setRecentStudents(recents);
      })
      .catch((err) => console.error('Failed to fetch students', err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} userRole="tutor" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-blue">Tutor Dashboard</h1>
          <p className="text-gray-600">Welcome back, {tutorName}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Students</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">{studentCount}</span>
                <Link to="/tutor/students" className="text-sm text-brand-blue hover:underline">View all</Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Materials Uploaded</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">{uploadedMaterialsCount}</span>
                <Link to="/tutor/materials" className="text-sm text-brand-blue hover:underline">View all</Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Assessments Created</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">{assessmentsCount}</span>
                <Link to="/tutor/assessments" className="text-sm text-brand-blue hover:underline">View all</Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Activity</CardTitle>
              <CardDescription>
                Lesson completion rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentActivity.map((activity) => (
                  <div key={activity.day} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{activity.day}</span>
                      <span className="text-gray-500">{activity.completionRate}% completion</span>
                    </div>
                    <Progress value={activity.completionRate} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Students</CardTitle>
              <CardDescription>
                Students who have been active recently
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentStudents.map((student, index) => (
                <div key={student.id} className={`py-3 ${index !== recentStudents.length - 1 ? 'border-b' : ''}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{student.full_name}</h4>
                      <p className="text-sm text-gray-500">{student.email} • Last active {student.lastActive}</p>
                    </div>
                    <Button asChild variant="ghost" className="text-brand-blue hover:text-brand-yellow hover:bg-brand-blue">
                      <Link to={`/tutor/students/${student.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold">Ready to add new content?</h3>
              <p className="text-gray-600">Upload new materials for your students</p>
            </div>
            <div className="flex space-x-4">
              <Button asChild variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
                <Link to="/tutor/materials">Manage Materials</Link>
              </Button>
              <Button asChild className="bg-brand-yellow text-brand-blue hover:brightness-95">
                <Link to="/tutor/upload">Upload New Content</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Let's Do It English. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TutorDashboard;
