
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
  const [tookTest, setTookTest] = useState<boolean | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RegistrationData>();
  
  const watchedTookTest = watch('tookProficiencyTest');

  const handleCertificateUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCertificateFile(file);
    }
  };

  const redirectToPlacementTest = () => {
    // Store form data temporarily and redirect to placement test
    const formData = new FormData();
    const form = document.getElementById('registration-form') as HTMLFormElement;
    if (form) {
      const data = new FormData(form);
      localStorage.setItem('pendingRegistration', JSON.stringify(Object.fromEntries(data)));
    }
    navigate('/assessment');
  };

  const onSubmit = async (data: RegistrationData) => {
    setIsLoading(true);

    try {
      // Check if user needs to take placement test
      if (!data.tookProficiencyTest) {
        toast({
          title: "Placement Test Required",
          description: "Please complete the placement test to determine your English level.",
          variant: "destructive"
        });
        redirectToPlacementTest();
        return;
      }

      // Validate required fields
      if (!data.currentLevel) {
        toast({
          title: "Error",
          description: "Please select your English proficiency level.",
          variant: "destructive"
        });
        return;
      }

      // Check for unique email and username
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('username, id')
        .or(`username.eq.${data.username}`);

      if (existingUsers && existingUsers.length > 0) {
        toast({
          title: "Registration Failed",
          description: "Username already exists. Please choose a different one.",
          variant: "destructive"
        });
        return;
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: 'temp-password', // Will be replaced with program ID
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: data.fullName,
          username: data.username,
          role: 'student'
        });

      if (profileError) {
        throw profileError;
      }

      // Upload certificate if provided
      let certificateUrl = null;
      if (certificateFile) {
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
        }
      }

      // Create student profile
      const { error: studentError } = await supabase
        .from('student_profiles')
        .insert({
          id: authData.user.id,
          current_level: data.currentLevel,
          study_experience: data.studyExperience,
          learning_goals: data.learningGoals,
          took_proficiency_test: data.tookProficiencyTest,
          test_type: data.tookProficiencyTest ? 'external' : 'none',
          test_score: data.testScore || null,
          certificate_url: certificateUrl,
          test_timestamp: data.tookProficiencyTest ? new Date().toISOString() : null,
          used_in_app_test: false
        });

      if (studentError) {
        throw studentError;
      }

      toast({
        title: "Registration Successful!",
        description: "Your account has been created. Please check your email for your Program ID and further instructions.",
      });

      // Redirect to a success page or login
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
          <form id="registration-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  {...register('email', { required: 'Email is required' })}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
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
                  setTookTest(boolValue);
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentRegistrationForm;
