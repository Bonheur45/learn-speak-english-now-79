
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would connect to your backend API in a real app
    console.log('Login attempt:', { email, password, role });
    // Redirect based on role (would use a proper auth system in a real app)
    window.location.href = role === 'student' ? '/student/dashboard' : '/tutor/dashboard';
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">I am a</Label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="studentRole"
                    name="role"
                    value="student"
                    checked={role === 'student'}
                    onChange={() => setRole('student')}
                    className="mr-2"
                  />
                  <Label htmlFor="studentRole">Student</Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="tutorRole"
                    name="role"
                    value="tutor"
                    checked={role === 'tutor'}
                    onChange={() => setRole('tutor')}
                    className="mr-2"
                  />
                  <Label htmlFor="tutorRole">Tutor</Label>
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full bg-brand-yellow text-brand-blue hover:brightness-95">
              Login
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-blue hover:underline">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
