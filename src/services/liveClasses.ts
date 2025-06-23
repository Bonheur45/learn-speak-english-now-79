import { api } from './api';

export interface LiveClass {
  id: string;
  title: string;
  description?: string | null;
  date_time: string; // ISO string
  link: string;
  cohort_id: string;
}

export const getLiveClasses = async (cohortId: string): Promise<LiveClass[]> => {
  const { data } = await api.get('/live-classes/', {
    params: { cohort_id: cohortId, limit: 100, skip: 0 },
  });
  return data;
}; 