import { api } from './api';

export interface Material {
  id: string;
  title: string;
  description?: string | null;
  type: 'audio' | 'video' | 'pdf' | 'doc' | 'form' | string;
  accent?: 'American' | 'British' | string | null;
  difficulty_level?: number | null;
  url: string;
  duration_minutes?: number | null;
  curriculum_id?: string;
  cohort_id?: string;
  day?: { id: string; title: string; number?: number } | null;
  created_at?: string;
  updated_at?: string;
}

export const getMaterials = async (params?: Record<string, any>): Promise<Material[]> => {
  const { data } = await api.get('/materials/', { params });
  return data;
};

export const getMaterial = async (materialId: string): Promise<Material> => {
  const { data } = await api.get(`/materials/${materialId}`);
  return data;
};

export const createMaterial = async (payload: Partial<Material>): Promise<Material> => {
  const { data } = await api.post('/materials/', payload);
  return data;
};

export const updateMaterial = async (
  materialId: string,
  payload: Partial<Material>
): Promise<Material> => {
  const { data } = await api.put(`/materials/${materialId}`, payload);
  return data;
};

export const deleteMaterial = async (materialId: string): Promise<void> => {
  await api.delete(`/materials/${materialId}`);
}; 