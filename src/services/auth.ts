import { api, setAuthToken } from './api';

interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export const login = async (payload: LoginPayload): Promise<TokenResponse> => {
  // FastAPI OAuth2PasswordBearer accepts form-data (application/x-www-form-urlencoded)
  const params = new URLSearchParams();
  params.append('username', payload.username);
  params.append('password', payload.password);

  const { data } = await api.post<TokenResponse>('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  setAuthToken(data.access_token);
  return data;
};

export const register = async (body: any) => {
  const { data } = await api.post('/auth/register', body);
  return data;
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    setAuthToken(null);
  }
};

export const getCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data;
}; 