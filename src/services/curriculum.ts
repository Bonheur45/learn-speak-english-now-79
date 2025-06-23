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

export const updateCurriculumDay = async (
  dayId: string,
  payload: Partial<CurriculumDay>
): Promise<CurriculumDay> => {
  const body = {
    ...payload,
    number: (payload.day_number ?? payload.number) as any,
  };
  delete (body as any).day_number;

  const { data } = await api.put(`/curriculum/days/${dayId}`, body);
  return data;
};

export const getCurriculumDay = async (dayId: string): Promise<CurriculumDay> => {
  const { data } = await api.get(`/curriculum/days/${dayId}`);
  return data;
};

// Create a new curriculum template day inside a trimester
export const createCurriculumDay = async (
  trimesterId: string,
  payload: Partial<CurriculumDay>
): Promise<CurriculumDay> => {
  const body = {
    trimester_id: trimesterId,
    number: (payload.day_number ?? payload.number) ?? 1,
    title: payload.title ?? 'Lesson',
    description: payload.description,
    // pass through other optional fields too
    story_text: payload.story_text,
    topic_notes: payload.topic_notes,
    british_audio_url: payload.british_audio_url,
    american_audio_url: payload.american_audio_url,
    glossary_terms: payload.glossary_terms,
  };
  const { data } = await api.post(`/curriculum/trimesters/${trimesterId}/days`, body);
  return data;
}; 