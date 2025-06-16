import { api } from './api';

export interface StudentProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  current_level: string;
  study_experience?: string;
  learning_goals?: string;
  took_proficiency_test?: boolean;
  test_score?: string;
  status: 'pending_approval' | 'approved' | 'rejected' | string;
  assigned_cohort_id?: string;
  created_at: string;
  cohort?: { name: string };
}

export const getStudents = async (): Promise<StudentProfile[]> => {
  const { data } = await api.get('/students/');
  return data;
};

export const updateStudentStatus = async (
  studentId: string,
  status: 'approved' | 'rejected'
): Promise<StudentProfile> => {
  const { data } = await api.put(`/students/${studentId}`, { status });
  return data;
}; 