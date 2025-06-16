import { api } from './api';

export interface Cohort {
  id: string;
  name: string;
  description?: string | null;
  proficiency_level: string; // e.g., "A1-A2"
  current_trimester: number;
  capacity: number; // alias for max_students
  enrolled_students: number; // alias for current_students
  current_day_position?: number;
  status: 'planning' | 'active' | 'completed' | 'cancelled' | string;
  start_date: string;
  end_date: string;
  curriculum_id: string;
}

export const getCohorts = async (params?: Record<string, any>): Promise<Cohort[]> => {
  const { data } = await api.get('/cohorts/', { params });
  return data;
};

export const getCohort = async (cohortId: string): Promise<Cohort> => {
  const { data } = await api.get(`/cohorts/${cohortId}`);
  return data;
};

export interface CohortPayload {
  name: string;
  proficiency_level: string; // e.g., "A1-A2"
  curriculum_id?: string;
  max_students?: number;
  start_date?: string;
  end_date?: string;
}

export const createCohort = async (payload: CohortPayload): Promise<Cohort> => {
  const { data } = await api.post('/cohorts/', payload);
  return data;
};

export const updateCohort = async (cohortId: string, payload: Partial<CohortPayload> & { status?: string }): Promise<Cohort> => {
  const { data } = await api.put(`/cohorts/${cohortId}`, payload);
  return data;
};

export const refreshCohort = async (cohortId: string): Promise<Cohort> => {
  const { data } = await api.post(`/cohorts/${cohortId}/refresh`);
  return data;
};

// ---------------- Cohort-specific trimesters ----------------
export interface CohortTrimester {
  id: string;
  cohort_id: string;
  curriculum_trimester_id: string;
  name: string;
  number: number;
  start_date: string;
  end_date: string;
  total_days?: number;
}

export const getCohortTrimesters = async (cohortId: string): Promise<CohortTrimester[]> => {
  const { data } = await api.get(`/cohorts/${cohortId}/trimesters`);
  return data;
};

export const getCohortTrimesterDays = async (cohortId: string, trimesterId: string) => {
  const { data } = await api.get(`/cohorts/${cohortId}/trimesters/${trimesterId}/days`);
  return data;
};

export const updateCohortDay = async (cohortId: string, dayId: string, payload: any) => {
  const { data } = await api.put(`/cohorts/${cohortId}/days/${dayId}`, payload);
  return data;
}; 