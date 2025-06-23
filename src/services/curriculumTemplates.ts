import { api } from './api';

export interface CurriculumTemplate {
  id: string;
  level: string; // e.g., "A1-A2"
  name: string;
  description?: string;
  total_trimesters: number;
  created_at?: string;
  updated_at: string;
}

export const getCurriculumTemplates = async (): Promise<CurriculumTemplate[]> => {
  const { data } = await api.get('/curriculum/');
  return data;
};

export const getCurriculumTemplate = async (templateId: string): Promise<CurriculumTemplate> => {
  const { data } = await api.get(`/curriculum/${templateId}`);
  return data;
}; 