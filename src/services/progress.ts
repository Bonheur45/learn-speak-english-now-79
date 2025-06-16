import { api } from './api';

export interface ProgressEntry {
  id: string;
  student_id: string;
  cohort_id: string;
  day: {
    id: string;
    number: number;
  };
  completed: boolean;
  completed_activities?: string[]; // optional if backend adds
}

export const getStudentProgress = async (studentId: string, cohortId?: string): Promise<ProgressEntry[]> => {
  const params: Record<string, any> = { student_id: studentId };
  if (cohortId) params.cohort_id = cohortId;
  const { data } = await api.get('/progress/', { params });
  return data;
};

export const upsertProgressActivity = async (
  existingEntry: ProgressEntry | undefined,
  studentId: string,
  cohortId: string,
  dayId: string,
  activity: string
) => {
  if (existingEntry) {
    const updated = {
      completed_activities: Array.from(new Set([...(existingEntry.completed_activities || []), activity])),
      completed: activity === 'reading' ? existingEntry.completed : existingEntry.completed, // keep as is
    };
    await api.put(`/progress/${existingEntry.id}`, updated);
    return { ...existingEntry, ...updated } as ProgressEntry;
  } else {
    const body = {
      student_id: studentId,
      cohort_id: cohortId,
      completed_activities: [activity],
      completed: false,
      score: 0,
    };
    const { data } = await api.post('/progress/', body);
    return data;
  }
}; 