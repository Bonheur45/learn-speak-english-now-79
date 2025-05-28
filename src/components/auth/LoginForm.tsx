
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface LoginData {
  email: string;
  programId: string;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>();

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);

    try {
      // First, find the user by program ID to get their email
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, program_id, role')
        .eq('program_id', data.programId)
        .single();

      if (profileError || !profileData) {
        throw new Error('Invalid Program ID. Please check your credentials.');
      }

      // Sign in with email and program ID as password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.programId,
      });

      if (authError) {
        throw new Error('Invalid email or Program ID. Please check your credentials.');
      }

      // Check if the authenticated user matches the profile
      if (authData.user?.id !== profileData.id) {
        await supabase.auth.signOut();
        throw new Error('Email and Program ID do not match.');
      }

      toast({
        title: "Login Successful",
        description: "Welcome back to Let's Do It English Program!",
      });

      // Redirect based on user role
      if (profileData.role === 'student') {
        navigate('/student/dashboard');
      } else if (profileData.role === 'tutor') {
        navigate('/tutor/dashboard');
      } else {
        navigate('/admin/dashboard');
      }

    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Sign in to Let's Do It English Program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="programId">Program ID</Label>
              <Input
                id="programId"
                {...register('programId', { required: 'Program ID is required' })}
                placeholder="Enter your Program ID (e.g., ENG25-001)"
              />
              {errors.programId && (
                <p className="text-sm text-red-600 mt-1">{errors.programId.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Your Program ID was sent to your email after registration
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto"
                  onClick={() => navigate('/register')}
                >
                  Register here
                </Button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
