
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentLevel, setCurrentLevel] = useState('');
  const [studyExperience, setStudyExperience] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  const [tookProficiencyTest, setTookProficiencyTest] = useState('');
  const [certificate, setCertificate] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would connect to your backend API in a real app
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (tookProficiencyTest === 'yes' && !certificate) {
      alert('Please upload your proficiency test certificate!');
      return;
    }
    console.log('Registration attempt:', { 
      name, 
      username,
      email, 
      password, 
      currentLevel, 
      studyExperience, 
      learningGoals,
      tookProficiencyTest,
      certificate: certificate?.name 
    });
    // Redirect to login in a real app
    window.location.href = '/login';
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificate(file);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create Your Student Account</CardTitle>
        <CardDescription className="text-center">
          Apply to join our English learning program
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="johndoe123"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            <Label htmlFor="tookProficiencyTest">Have you taken an English proficiency test?</Label>
            <select
              id="tookProficiencyTest"
              value={tookProficiencyTest}
              onChange={(e) => setTookProficiencyTest(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
              required
            >
              <option value="">Select an option</option>
              <option value="yes">Yes, I have taken a test</option>
              <option value="no">No, I haven't taken any test</option>
            </select>
          </div>

          {tookProficiencyTest === 'yes' && (
            <div className="space-y-2">
              <Label htmlFor="certificate">Upload your proficiency test certificate</Label>
              <Input
                id="certificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                required
                onChange={handleCertificateUpload}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-yellow file:text-brand-blue hover:file:bg-brand-yellow/80"
              />
              {certificate && (
                <p className="text-sm text-green-600">File uploaded: {certificate.name}</p>
              )}
            </div>
          )}
          
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
          
          <Button type="submit" className="w-full bg-brand-yellow text-brand-blue hover:brightness-95">
            Submit Application
          </Button>
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
