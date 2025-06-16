import { api } from './api';

export interface CurriculumTrimester {
  id: string;
  number: number; // 1,2,3
  name: string;
  description?: string | null;
  start_date?: string; // optional depending on backend
  end_date?: string;
  days?: CurriculumDay[];
}

export interface CurriculumDay {
  id: string;
  title: string;
  description?: string;
  day_number: number; // 1-72 globally or 1-24 inside trimester
  story_text?: string;
  topic_notes?: string;
  british_audio_url?: string;
  american_audio_url?: string;
  glossary_terms?: GlossaryTerm[];
  updated_at?: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
}

export const getCurriculumTrimesters = async (templateId: string): Promise<CurriculumTrimester[]> => {
  const { data } = await api.get(`/curriculum/${templateId}/trimesters`);
  return data;
};

export const getTrimesterDays = async (trimesterId: string): Promise<CurriculumDay[]> => {
  const { data } = await api.get(`/curriculum/trimesters/${trimesterId}/days`);
  return data.map((d: any) => ({
    ...d,
    day_number: d.day_number ?? d.number, // alias
  }));
};

export const updateCurriculumDay = async (dayId: string, payload: Partial<CurriculumDay>) => {
  const { data } = await api.put(`/curriculum/days/${dayId}`, payload);
  return data;
}; 