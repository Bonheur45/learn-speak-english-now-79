
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface StudentProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  current_level: string;
  study_experience: string;
  learning_goals: string;
  took_proficiency_test: boolean;
  test_score: string;
  status: string;
  assigned_cohort_id: string;
  created_at: string;
  cohort?: {
    name: string;
  };
}

const StudentApprovalDashboard = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, statusFilter, levelFilter, searchTerm]);

  const fetchStudents = async () => {
    // Mock data for demonstration
    const mockStudents: StudentProfile[] = [
      {
        id: '1',
        full_name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        current_level: 'B1-B2',
        study_experience: '2 years of English study',
        learning_goals: 'Improve speaking skills',
        took_proficiency_test: true,
        test_score: 'IELTS 6.0',
        status: 'pending_approval',
        assigned_cohort_id: '',
        created_at: new Date().toISOString(),
        cohort: { name: 'Intermediate Group A' }
      },
      {
        id: '2',
        full_name: 'Jane Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        current_level: 'A1-A2',
        study_experience: '6 months of English study',
        learning_goals: 'Basic conversation skills',
        took_proficiency_test: false,
        test_score: 'N/A',
        status: 'approved',
        assigned_cohort_id: '',
        created_at: new Date().toISOString(),
        cohort: { name: 'Beginner Group B' }
      }
    ];

    setStudents(mockStudents);
    setLoading(false);
  };

  const filterStudents = () => {
    let filtered = students;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(student => student.status === statusFilter);
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(student => student.current_level === levelFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  };

  const updateStudentStatus = async (studentId: string, newStatus: 'approved' | 'rejected') => {
    // Mock update - in a real app this would call your backend
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, status: newStatus }
        : student
    ));

    toast({
      title: "Success",
      description: `Student ${newStatus} successfully.`,
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending_approval': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Student Management Dashboard</h1>
        <p className="text-gray-600">Review and approve student registrations</p>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending_approval">Pending Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="A1-A2">A1-A2 (Beginner)</SelectItem>
            <SelectItem value="B1-B2">B1-B2 (Intermediate)</SelectItem>
            <SelectItem value="C1-C2">C1-C2 (Advanced)</SelectItem>
          </SelectContent>
        </Select>

        <div className="text-sm text-gray-600 flex items-center">
          Total: {filteredStudents.length} students
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{student.full_name}</CardTitle>
                  <CardDescription>@{student.username}</CardDescription>
                </div>
                <Badge variant={getStatusBadgeVariant(student.status)}>
                  {student.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Level:</span> {student.current_level || 'Not specified'}
                </div>
                <div>
                  <span className="font-medium">Test Taken:</span> {student.took_proficiency_test ? 'Yes' : 'No'}
                </div>
                <div>
                  <span className="font-medium">Test Score:</span> {student.test_score}
                </div>
                <div>
                  <span className="font-medium">Cohort:</span> {student.cohort?.name || 'Not assigned'}
                </div>
              </div>

              <div>
                <span className="font-medium text-sm">Study Experience:</span>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{student.study_experience}</p>
              </div>

              <div>
                <span className="font-medium text-sm">Learning Goals:</span>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{student.learning_goals}</p>
              </div>

              {student.status === 'pending_approval' && (
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    onClick={() => updateStudentStatus(student.id, 'approved')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => updateStudentStatus(student.id, 'rejected')}
                  >
                    Reject
                  </Button>
                </div>
              )}

              <div className="text-xs text-gray-500">
                Registered: {new Date(student.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No students found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default StudentApprovalDashboard;
