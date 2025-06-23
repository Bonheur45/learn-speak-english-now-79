import { api } from './api';

export interface StudentPerformance {
  id: string;
  student_id: string;
  cohort_id: string;
  overall_score: number;
  attendance_rate: number;
  completion_rate: number;
  engagement_rate: number;
  period_start: string;
  period_end: string;
}

export interface CohortPerformance {
  id: string;
  cohort_id: string;
  total_students: number;
  active_students: number;
  average_score: number;
  completion_rate: number;
  engagement_rate: number;
  period_start: string;
  period_end: string;
}

export const getStudentPerformance = async (studentId: string): Promise<StudentPerformance> => {
  const { data } = await api.get(`/analytics/students/${studentId}/performance`);
  return data;
};

export const getCohortPerformance = async (cohortId: string): Promise<CohortPerformance> => {
  const { data } = await api.get(`/analytics/cohorts/${cohortId}/performance`);
  return data;
}; 