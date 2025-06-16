import { api } from './api';

// Update (grant/revoke) day access for a student (or cohort-wide by progress entry)
// The backend exposes:
//   PATCH /progress/{progress_id}/access          body: { allowed: boolean }
//   DELETE /progress/student/{student_id}/access  query param day_id=<id>
// For the tutor UI we only need a simple helper that flips the allowed flag
// on a given progress row. We assume we know the progress_id.

export const setDayAccess = async (progressId: string, allowed: boolean) => {
  const { data } = await api.patch(`/progress/${progressId}/access`, { allowed });
  return data;
};

export const revokeDayAccessForStudent = async (studentId: string, dayId: string) => {
  await api.delete(`/progress/student/${studentId}/access`, { params: { day_id: dayId } });
}; 