import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { getStudent, updateStudentStatus, StudentProfile } from '@/services/students';
import { getCohort, Cohort } from '@/services/cohorts';

const StudentDetails: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) {
      navigate('/tutor/students');
      return;
    }

    getStudent(studentId)
      .then(async (data) => {
        setStudent(data);

        // Attempt to resolve cohort if not present
        let cId: string | undefined;
        if (data.cohort?.id) {
          cId = data.cohort.id;
        } else if (data.user?.enrollments?.length) {
          cId = data.user.enrollments[0].cohort_id;
        }

        if (cId) {
          try {
            const c = await getCohort(cId);
            setCohort(c);
          } catch (err) {
            console.error('Failed to fetch cohort', err);
          }
        }
      })
      .catch((err) => {
        console.error(err);
        toast({ title: 'Error', description: 'Failed to load student', variant: 'destructive' });
        navigate('/tutor/students');
      })
      .finally(() => setLoading(false));
  }, [studentId, navigate]);

  const handleStatusChange = async (status: 'approved' | 'rejected') => {
    if (!student) return;
    try {
      const updated = await updateStudentStatus(student.id, status);
      setStudent(updated);
      toast({ title: 'Success', description: `Student ${status}.` });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Update failed', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading student...</div>
      </div>
    );
  }

  if (!student) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} userRole="tutor" />

      <main className="flex-grow container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/tutor/students">← Back to Students</Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{student.full_name || student.user?.full_name}</CardTitle>
            <CardDescription>@{student.username || student.user?.username}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Email:</span> {student.email || student.user?.email}
              </div>
              <div>
                <span className="font-medium">Level:</span> {student.current_level || 'Not specified'}
              </div>
              <div>
                <span className="font-medium">Cohort:</span> {student.cohort?.name || cohort?.name || 'Not assigned'}
              </div>
              <div>
                <span className="font-medium">Test Taken:</span> {student.took_proficiency_test ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-medium">Test Score:</span> {student.test_score || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Status:</span>{' '}
                <Badge variant="secondary">{student.status.replace('_', ' ')}</Badge>
              </div>
            </div>

            <div>
              <span className="font-medium text-sm">Study Experience:</span>
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{student.study_experience || '—'}</p>
            </div>

            <div>
              <span className="font-medium text-sm">Learning Goals:</span>
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{student.learning_goals || '—'}</p>
            </div>

            {student.status === 'pending_approval' && (
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange('approved')}>
                  Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleStatusChange('rejected')}>
                  Reject
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Placeholder for future analytics */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>Lesson completion and assessment performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Overall Progress</span>
                <span className="text-gray-600">{student.progress ?? 0}%</span>
              </div>
              <Progress value={student.progress ?? 0} className="h-2" />
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

export default StudentDetails; 