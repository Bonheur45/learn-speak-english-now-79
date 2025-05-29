
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface RegistrationData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  studyExperience: string;
  learningGoals: string;
  tookProficiencyTest: boolean;
  currentLevel?: 'A1-A2' | 'B1-B2' | 'C1-C2';
  certificateFile?: File;
  testScore?: string;
}

const StudentRegistrationForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RegistrationData>();
  
  const watchedTookTest = watch('tookProficiencyTest');
  const watchedPassword = watch('password');

  const handleCertificateUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCertificateFile(file);
    }
  };

  const onSubmit = async (data: RegistrationData) => {
    setIsLoading(true);
    console.log('Starting registration process for:', data.email);

    try {
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match.",
          variant: "destructive"
        });
        return;
      }

      // Check if user needs to take placement test
      if (!data.tookProficiencyTest) {
        toast({
          title: "Placement Test Required",
          description: "Please complete the placement test to determine your English level.",
          variant: "destructive"
        });
        return;
      }

      // Validate required fields for test takers
      if (!data.currentLevel) {
        toast({
          title: "Error",
          description: "Please select your English proficiency level.",
          variant: "destructive"
        });
        return;
      }

      console.log('Creating auth user with email:', data.email);
      // Create auth user with explicit data
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            username: data.username,
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        if (authError.message.includes('User already registered')) {
          toast({
            title: "Registration Failed",
            description: "This email is already registered. Please use a different email or try logging in.",
            variant: "destructive"
          });
          return;
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('User creation failed - no user returned');
      }

      console.log('Auth user created successfully:', authData.user.id);

      // Check if email confirmation is required
      if (!authData.session) {
        toast({
          title: "Check Your Email",
          description: "Please check your email and click the confirmation link to activate your account, then try logging in.",
        });
        navigate('/login');
        return;
      }

      // Upload certificate if provided
      let certificateUrl = null;
      if (certificateFile) {
        console.log('Uploading certificate...');
        const fileExt = certificateFile.name.split('.').pop();
        const fileName = `${authData.user.id}/certificate.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('certificates')
          .upload(fileName, certificateFile);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('certificates')
            .getPublicUrl(fileName);
          certificateUrl = publicUrl;
          console.log('Certificate uploaded successfully');
        } else {
          console.warn('Certificate upload failed:', uploadError);
        }
      }

      // Create profile first
      console.log('Creating user profile...');
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: data.fullName,
          username: data.username,
          role: 'student'
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error(`Profile creation failed: ${profileError.message}`);
      }

      // Create student profile
      console.log('Creating student profile...');
      const { error: studentError } = await supabase
        .from('student_profiles')
        .insert({
          id: authData.user.id,
          study_experience: data.studyExperience,
          learning_goals: data.learningGoals,
          took_proficiency_test: data.tookProficiencyTest,
          current_level: data.currentLevel,
          test_score: data.testScore || null,
          certificate_url: certificateUrl,
          status: 'pending_approval'
        });

      if (studentError) {
        console.error('Student profile creation error:', studentError);
        throw new Error(`Student profile creation failed: ${studentError.message}`);
      }

      console.log('Registration completed successfully');

      toast({
        title: "Registration Successful!",
        description: "Your account has been created successfully. You can now log in.",
      });

      // Redirect to login page
      navigate('/login');

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Join Let's Do It English Program</CardTitle>
          <CardDescription className="text-center">
            Complete your registration to start your English learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  {...register('fullName', { required: 'Full name is required' })}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  {...register('username', { required: 'Username is required' })}
                  placeholder="Choose a unique username"
                />
                {errors.username && (
                  <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  placeholder="Create a password (min 6 characters)"
                />
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === watchedPassword || 'Passwords do not match'
                  })}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Study Experience */}
            <div>
              <Label htmlFor="studyExperience">Study Experience *</Label>
              <Textarea
                id="studyExperience"
                {...register('studyExperience', { required: 'Study experience is required' })}
                placeholder="Tell us about your previous English study experience..."
                rows={3}
              />
              {errors.studyExperience && (
                <p className="text-sm text-red-600 mt-1">{errors.studyExperience.message}</p>
              )}
            </div>

            {/* Learning Goals */}
            <div>
              <Label htmlFor="learningGoals">Learning Goals *</Label>
              <Textarea
                id="learningGoals"
                {...register('learningGoals', { required: 'Learning goals are required' })}
                placeholder="What are your English learning goals?"
                rows={3}
              />
              {errors.learningGoals && (
                <p className="text-sm text-red-600 mt-1">{errors.learningGoals.message}</p>
              )}
            </div>

            {/* Proficiency Test Question */}
            <div className="space-y-4">
              <Label>Have you taken an English proficiency test? *</Label>
              <RadioGroup 
                onValueChange={(value) => {
                  const boolValue = value === 'true';
                  setValue('tookProficiencyTest', boolValue);
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="test-yes" />
                  <Label htmlFor="test-yes">Yes, I have taken a test (IELTS, TOEFL, Cambridge, etc.)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="test-no" />
                  <Label htmlFor="test-no">No, I need to take a placement test</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Conditional fields based on test status */}
            {watchedTookTest && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentLevel">English Proficiency Level *</Label>
                  <Select onValueChange={(value) => setValue('currentLevel', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A1-A2">A1-A2 (Beginner to Elementary)</SelectItem>
                      <SelectItem value="B1-B2">B1-B2 (Intermediate to Upper Intermediate)</SelectItem>
                      <SelectItem value="C1-C2">C1-C2 (Advanced to Proficiency)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="testScore">Test Score (optional)</Label>
                  <Input
                    id="testScore"
                    {...register('testScore')}
                    placeholder="e.g., IELTS 6.5, TOEFL 85, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="certificate">Upload Certificate (optional)</Label>
                  <Input
                    id="certificate"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleCertificateUpload}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload your test certificate (PDF, JPG, PNG)
                  </p>
                </div>
              </div>
            )}

            {watchedTookTest === false && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  <strong>Placement Test Required:</strong> Since you haven't taken an English proficiency test, 
                  you'll need to complete our placement test to determine your level before registration.
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto"
                  onClick={() => navigate('/login')}
                >
                  Sign in here
                </Button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentRegistrationForm;
