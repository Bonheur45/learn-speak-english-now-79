import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL,
});

// Curriculum
export const getCurricula = async () => {
  const { data } = await api.get('/curricula');
  return data;
};

export const getCurriculumTrimesters = async (curriculumId: string) => {
  const { data } = await api.get(`/curricula/${curriculumId}/trimesters`);
  return data;
};

export const getTrimesterDays = async (trimesterId: string) => {
  const { data } = await api.get(`/curricula/trimester/${trimesterId}/days`);
  return data;
};

export const getCurriculumDay = async (dayId: string) => {
  const { data } = await api.get(`/curricula/day/${dayId}`);
  return data;
}; 