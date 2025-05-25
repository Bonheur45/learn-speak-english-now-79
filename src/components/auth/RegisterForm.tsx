
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [currentLevel, setCurrentLevel] = useState('');
  const [studyExperience, setStudyExperience] = useState('');
  const [learningGoals, setLearningGoals] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would connect to your backend API in a real app
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Registration attempt:', { 
      name, 
      email, 
      password, 
      role, 
      currentLevel, 
      studyExperience, 
      learningGoals 
    });
    // Redirect to login in a real app
    window.location.href = '/login';
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
        <CardDescription className="text-center">
          Register to start learning English today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">I want to register as</Label>
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
            
            {role === 'student' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="currentLevel">What is your current English level?</Label>
                  <select
                    id="currentLevel"
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    required
                  >
                    <option value="">Select your level</option>
                    <option value="A1">A1 - Beginner</option>
                    <option value="A2">A2 - Elementary</option>
                    <option value="B1">B1 - Intermediate</option>
                    <option value="B2">B2 - Upper Intermediate</option>
                    <option value="C1">C1 - Advanced</option>
                    <option value="C2">C2 - Proficient</option>
                    <option value="unsure">I'm not sure</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="studyExperience">How long have you been studying English?</Label>
                  <select
                    id="studyExperience"
                    value={studyExperience}
                    onChange={(e) => setStudyExperience(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    required
                  >
                    <option value="">Select duration</option>
                    <option value="less-than-1">Less than 1 year</option>
                    <option value="1-2">1-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="more-than-10">More than 10 years</option>
                    <option value="just-starting">Just starting</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="learningGoals">What are your main learning goals?</Label>
                  <select
                    id="learningGoals"
                    value={learningGoals}
                    onChange={(e) => setLearningGoals(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    required
                  >
                    <option value="">Select your goal</option>
                    <option value="academic">Academic purposes (university, tests)</option>
                    <option value="professional">Professional development</option>
                    <option value="travel">Travel and communication</option>
                    <option value="personal">Personal interest</option>
                    <option value="immigration">Immigration requirements</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </>
            )}
            
            <Button type="submit" className="w-full bg-brand-yellow text-brand-blue hover:brightness-95">
              Register
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-blue hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
