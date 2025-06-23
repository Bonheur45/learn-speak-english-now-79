import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStudents, StudentProfile } from '@/services/students';

const Students = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [studentsList, setStudentsList] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getStudents()
      .then(setStudentsList)
      .catch((err) => console.error('Failed to fetch students', err))
      .finally(() => setLoading(false));
  }, []);

  const mapProgress = (student: StudentProfile) => {
    // placeholder calculation until backend supplies progress field
    return {
      progress: 0,
      completedDays: 0,
      totalDays: 0,
      assessmentScore: 0,
    };
  };

  // Safely filter students based on search query and active tab. We normalise each searchable
  // field (name & email) to an empty string when it is null/undefined to ensure that
  // calling `toLowerCase()` never throws.
  const filteredStudents = studentsList.filter((student) => {
    const name = (student.full_name || student.user?.full_name || '').toLowerCase();
    const email = (student.email || student.user?.email || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = name.includes(query) || email.includes(query);
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && student.status === 'approved';
    if (activeTab === 'inactive') return matchesSearch && student.status !== 'approved';
    
    return false;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} userRole="tutor" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-blue">Students</h1>
            <p className="text-gray-600">View and manage all your students</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button asChild className="bg-brand-yellow text-brand-blue hover:brightness-95">
              <Link to="/tutor/invite">Invite New Students</Link>
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="mb-4 md:mb-0 md:w-1/3">
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Students</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3 pl-2">Student</th>
                  <th className="pb-3">Last Active</th>
                  <th className="pb-3">Progress</th>
                  <th className="pb-3">Assessment Score</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b">
                    <td className="py-4 pl-2">
                      <div>
                        <div className="font-medium">
                          {student.full_name || student.user?.full_name || student.username || student.user?.username || '—'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.email || student.user?.email || '—'}
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      {(() => {
                        const ts = student.updated_at || student.user?.updated_at || student.created_at || student.user?.created_at;
                        return ts ? new Date(ts).toLocaleDateString() : '—';
                      })()}
                    </td>
                    <td className="py-4">
                      {(() => {
                        const p = mapProgress(student);
                        return (
                          <>
                            <div className="flex items-center space-x-2">
                              <Progress value={p.progress} className="w-24 h-2" />
                              <span className="text-sm text-gray-600">{p.progress}%</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {p.completedDays}/{p.totalDays} days
                            </div>
                          </>
                        );
                      })()}
                    </td>
                    <td className="py-4">
                      <span className={`font-medium text-gray-600`}>–</span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Button asChild variant="ghost" size="sm" className="text-brand-blue hover:text-brand-yellow hover:bg-brand-blue">
                        <Link to={`/tutor/students/${student.id}`}>View Details</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No students found. Try adjusting your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Student Performance Summary</CardTitle>
            <CardDescription>Overall view of your students' performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Average Progress</h3>
                <div className="text-3xl font-bold text-brand-blue">
                  {studentsList.length > 0 ? Math.round(studentsList.reduce((sum, student) => sum + (student.progress ?? 0), 0) / studentsList.length) : 0}%
                </div>
                <Progress 
                  value={studentsList.length > 0 ? studentsList.reduce((sum, student) => sum + (student.progress ?? 0), 0) / studentsList.length : 0} 
                  className="h-2 mt-2"
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Average Assessment Score</h3>
                <div className="text-3xl font-bold text-brand-blue">
                  {studentsList.length > 0 ? Math.round(studentsList.reduce((sum, student) => sum + (student.assessmentScore ?? 0), 0) / studentsList.length) : 0}%
                </div>
                <Progress 
                  value={studentsList.length > 0 ? studentsList.reduce((sum, student) => sum + (student.assessmentScore ?? 0), 0) / studentsList.length : 0} 
                  className="h-2 mt-2"
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Active Students</h3>
                <div className="text-3xl font-bold text-brand-blue">
                  {studentsList.filter(student => student.status === 'active').length}/{studentsList.length}
                </div>
                <Progress 
                  value={(studentsList.filter(student => student.status === 'active').length / studentsList.length) * 100} 
                  className="h-2 mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Let's Do It English. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Students;
