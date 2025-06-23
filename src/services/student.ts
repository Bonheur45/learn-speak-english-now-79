import { api } from './api';

// ------------------------------------------------------------
//  Student-focused helpers
// ------------------------------------------------------------

export interface UserMe {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: string;
  enrollments?: { cohort_id: string }[];
  [key: string]: any; // allow passthrough fields
}

export const getMe = async (): Promise<UserMe> => {
  const { data } = await api.get('/auth/me');
  return data;
};

// ------------------------------------------------------------
//  Progress helpers
// ------------------------------------------------------------

export const getMyProgress = async (
  studentId: string,
  cohortId?: string
): Promise<any[]> => {
  const params: Record<string, any> = { student_id: studentId };
  if (cohortId) params.cohort_id = cohortId;
  const { data } = await api.get('/progress/', { params });
  return data;
};

// ------------------------------------------------------------
//  Cohort learning content helpers
// ------------------------------------------------------------

export const getCohortTrimesters = async (cohortId: string): Promise<any[]> => {
  const { data } = await api.get(`/cohorts/${cohortId}/trimesters`);
  return data;
};

export const getCohortTrimesterDays = async (
  cohortId: string,
  trimesterId: string
): Promise<any[]> => {
  const { data } = await api.get(
    `/cohorts/${cohortId}/trimesters/${trimesterId}/days`
  );
  return data;
};

// Convenience – grab **all** days across trimesters for a cohort
export const getCohortDays = async (cohortId: string): Promise<any[]> => {
  const trimesters = await getCohortTrimesters(cohortId);
  const dayPromises = trimesters.map((tri: any) =>
    getCohortTrimesterDays(cohortId, tri.id)
  );
  const daysByTri = await Promise.all(dayPromises);
  return daysByTri.flat();
};

// ------------------------------------------------------------
//  Enrollments (student-side)
// ------------------------------------------------------------

export const getMyEnrollments = async (): Promise<any[]> => {
  const { data } = await api.get('/enrollments/', {
    params: { skip: 0, limit: 100 },
  });
  return data;
};

// ------------------------------------------------------------
//  Cohort-wide analytics helpers
// ------------------------------------------------------------

export const getCohortProgress = async (
  cohortId: string,
  params: Record<string, any> = {}
): Promise<any[]> => {
  const query = { cohort_id: cohortId, skip: 0, limit: 1000, ...params };
  const { data } = await api.get('/progress/', { params: query });
  return data;
}; 