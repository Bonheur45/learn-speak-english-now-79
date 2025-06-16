import axios from 'axios';

// ------------------------------------------------------------
// Generic API client configuration
// ------------------------------------------------------------

// `VITE_API_BASE_URL` should be like "http://localhost:8000/api/v1" for local dev.
// Fallback assumes FastAPI is served on :8000 with the /api/v1 prefix already.
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({ baseURL });

// ------------------------------------------------------------
// Auth token handling – stored in localStorage under `bonheur_token`
// ------------------------------------------------------------

const TOKEN_KEY = 'bonheur_token';

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Attach token on every request if available
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------------------------------------------------
// Curriculum (temporary – will be updated to match new backend)
// ------------------------------------------------------------

export const getCurricula = async () => {
  const { data } = await api.get('/curriculum/');
  return data;
};

export const getCurriculumTrimesters = async (curriculumId: string) => {
  const { data } = await api.get(`/curriculum/${curriculumId}/trimesters`);
  return data;
};

export const getTrimesterDays = async (trimesterId: string) => {
  const { data } = await api.get(`/trimesters/${trimesterId}/days`);
  return data;
};

export const getCurriculumDay = async (dayId: string) => {
  const { data } = await api.get(`/days/${dayId}`);
  return data;
}; 