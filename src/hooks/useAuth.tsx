
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) throw profileError;

      let studentProfile = null;
      if (profile.role === 'student') {
        const { data, error } = await supabase
          .from('student_profiles')
          .select('*, cohorts(*)')
          .eq('id', authUser.id)
          .single();

        if (!error) {
          studentProfile = data;
        }
      }

      setUser({
        id: authUser.id,
        email: authUser.email!,
        role: profile.role,
        profile,
        studentProfile
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isTutor: user?.role === 'tutor',
    isAdmin: user?.role === 'admin'
  };
};
