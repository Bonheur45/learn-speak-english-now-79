
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  profile?: any;
  studentProfile?: any;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Defer profile loading to prevent recursion
          setTimeout(() => {
            fetchUserProfile(session.user);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      console.log('Fetching profile for user:', authUser.id);
      
      // Get user profile with error handling
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        // If profile doesn't exist, user might need to complete registration
        setUser({
          id: authUser.id,
          email: authUser.email!,
          role: 'student' // default role
        });
        setLoading(false);
        return;
      }

      console.log('Profile loaded:', profile);

      let studentProfile = null;
      if (profile.role === 'student') {
        const { data, error } = await supabase
          .from('student_profiles')
          .select('*, cohorts(*)')
          .eq('id', authUser.id)
          .single();

        if (!error && data) {
          studentProfile = data;
          console.log('Student profile loaded:', studentProfile);
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
      // Set basic user info even if profile fetch fails
      setUser({
        id: authUser.id,
        email: authUser.email!,
        role: 'student'
      });
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
    session,
    loading,
    signOut,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isTutor: user?.role === 'tutor',
    isAdmin: user?.role === 'admin'
  };
};
