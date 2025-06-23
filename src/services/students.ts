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
  progress?: number;
  assessmentScore?: number;
  updated_at?: string;
  user?: {
    id: string;
    email: string;
    full_name: string;
    username: string;
    created_at?: string;
    updated_at?: string;
    enrollments?: { cohort_id: string; status: string }[];
  };
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

// Fetch a single student profile by ID
export const getStudent = async (studentId: string): Promise<StudentProfile> => {
  const { data } = await api.get(`/students/${studentId}`);
  return data;
}; 