
import { useEffect, useState } from 'react';

interface AuthUser {
  id: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  profile?: any;
  studentProfile?: any;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = (email: string, password: string, role?: 'student' | 'tutor' | 'admin') => {
    // Mock authentication - in a real app this would call your backend
    const selectedRole = role || 'student';
    const mockUser: AuthUser = {
      id: Math.random().toString(),
      email: email,
      role: selectedRole,
      profile: {
        full_name: selectedRole === 'student' ? 'Test Student' : selectedRole === 'tutor' ? 'Test Tutor' : 'Test Admin',
        username: email.split('@')[0]
      },
      studentProfile: selectedRole === 'student' ? {
        status: 'approved'
      } : undefined
    };
    
    setUser(mockUser);
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    return Promise.resolve({ user: mockUser, error: null });
  };

  const signUp = (userData: any) => {
    // Mock registration - always creates a student by default
    const mockUser: AuthUser = {
      id: Math.random().toString(),
      email: userData.email,
      role: 'student',
      profile: {
        full_name: userData.fullName,
        username: userData.username
      },
      studentProfile: {
        status: 'approved'
      }
    };
    
    setUser(mockUser);
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    return Promise.resolve({ user: mockUser, error: null });
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    return Promise.resolve();
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
