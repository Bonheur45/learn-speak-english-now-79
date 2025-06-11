import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface AuthUser {
  id: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  profile?: {
    full_name: string;
    username: string;
  };
  studentProfile?: {
    status: 'pending_approval' | 'approved' | 'rejected';
    cohorts?: {
      name: string;
    };
  };
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const userData = await api.auth.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      // First, obtain tokens
      await api.auth.login(username, password);

      // Then, fetch the current user using the stored access token
      const userData = await api.auth.getCurrentUser();
      setUser(userData);
      return { user: userData, error: null };
    } catch (error) {
      console.error('Login failed:', error);
      return { user: null, error };
    }
  };

  const signUp = async (userData: {
    email: string;
    password: string;
    full_name: string;
    username: string;
  }) => {
    try {
      // Create account
      await api.auth.register(userData);

      // Immediately log the user in and fetch their profile
      await api.auth.login(userData.username, userData.password);
      const currentUser = await api.auth.getCurrentUser();
      setUser(currentUser);
      return { user: currentUser, error: null };
    } catch (error) {
      console.error('Registration failed:', error);
      return { user: null, error };
    }
  };

  const signOut = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
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
