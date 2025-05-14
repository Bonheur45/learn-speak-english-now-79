
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Students = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data for students
  const studentsList = [
    { 
      id: '1', 
      name: 'John Doe', 
      email: 'john@example.com', 
      lastActive: '2 hours ago', 
      progress: 75,
      completedDays: 15,
      totalDays: 30,
      assessmentScore: 82,
      status: 'active'
    },
    { 
      id: '2', 
      name: 'Sarah Johnson', 
      email: 'sarah@example.com', 
      lastActive: '5 hours ago', 
      progress: 92,
      completedDays: 24,
      totalDays: 30,
      assessmentScore: 95,
      status: 'active'
    },
    { 
      id: '3', 
      name: 'Michael Brown', 
      email: 'michael@example.com', 
      lastActive: '1 day ago', 
      progress: 45,
      completedDays: 9,
      totalDays: 30,
      assessmentScore: 68,
      status: 'active'
    },
    { 
      id: '4', 
      name: 'Emily Davis', 
      email: 'emily@example.com', 
      lastActive: '3 days ago', 
      progress: 60,
      completedDays: 12,
      totalDays: 30,
      assessmentScore: 76,
      status: 'inactive'
    },
    { 
      id: '5', 
      name: 'David Wilson', 
      email: 'david@example.com', 
      lastActive: '1 week ago', 
      progress: 30,
      completedDays: 6,
      totalDays: 30,
      assessmentScore: 58,
      status: 'inactive'
    },
  ];

  // Filter students based on search query and active tab
  const filteredStudents = studentsList.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && student.status === 'active';
    if (activeTab === 'inactive') return matchesSearch && student.status === 'inactive';
    
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
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </td>
                    <td className="py-4">{student.lastActive}</td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <Progress value={student.progress} className="w-24 h-2" />
                        <span className="text-sm text-gray-600">{student.progress}%</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {student.completedDays}/{student.totalDays} days
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`font-medium ${student.assessmentScore >= 80 ? 'text-green-600' : student.assessmentScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                        {student.assessmentScore}%
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {student.status === 'active' ? 'Active' : 'Inactive'}
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
                  {Math.round(studentsList.reduce((sum, student) => sum + student.progress, 0) / studentsList.length)}%
                </div>
                <Progress 
                  value={studentsList.reduce((sum, student) => sum + student.progress, 0) / studentsList.length} 
                  className="h-2 mt-2"
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Average Assessment Score</h3>
                <div className="text-3xl font-bold text-brand-blue">
                  {Math.round(studentsList.reduce((sum, student) => sum + student.assessmentScore, 0) / studentsList.length)}%
                </div>
                <Progress 
                  value={studentsList.reduce((sum, student) => sum + student.assessmentScore, 0) / studentsList.length} 
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
