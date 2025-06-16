import { useEffect, useState, useCallback } from 'react';
import { login, register as apiRegister, logout as apiLogout, getCurrentUser } from '@/services/auth';
import { setAuthToken, getAuthToken } from '@/services/api';

export interface AuthUser {
  id: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  profile?: any;
  studentProfile?: any;
  enrollments?: { id: string; cohort_id: string; status: string }[];
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await getCurrentUser();
      setUser(data as AuthUser);
    } catch (err) {
      console.error('Failed to fetch current user', err);
      setAuthToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (email: string, password: string, _role?: 'student' | 'tutor' | 'admin') => {
    try {
      await login({ username: email, password });
      await fetchUser();
      return { user, error: null };
    } catch (error: any) {
      return { user: null, error };
    }
  };

  const signUp = async (userData: any) => {
    try {
      await apiRegister(userData);
      // After registration, auto login
      await login({ username: userData.email, password: userData.password });
      await fetchUser();
      return { user, error: null };
    } catch (error: any) {
      return { user: null, error };
    }
  };

  const signOut = async () => {
    await apiLogout();
    setUser(null);
  };

  return {
    user,
    session: user ? { user } : null,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isTutor: user?.role === 'tutor',
    isAdmin: user?.role === 'admin'
  };
};
