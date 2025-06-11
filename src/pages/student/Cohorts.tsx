import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ProficiencyLevel, PROFICIENCY_DESCRIPTIONS } from '@/lib/types';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Users } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

const Cohorts = () => {
  const { user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<ProficiencyLevel>('A1-A2');
  const [cohorts, setCohorts] = useState<any[]>([]);
  
  // Determine the cohort(s) the current user is enrolled in (if any)
  const userCohortIds = user?.enrollments?.map((e: any) => e.cohort_id) || [];

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const data = await api.cohorts.getCohorts(0, 1000);
        setCohorts(data);
      } catch (err) {
        console.error('Failed to load cohorts:', err);
      }
    };

    fetchCohorts();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: ProficiencyLevel) => {
    switch (level) {
      case 'A1-A2':
        return 'bg-emerald-100 text-emerald-800';
      case 'B1-B2':
        return 'bg-blue-100 text-blue-800';
      case 'C1-C2':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Layout isLoggedIn={true} userRole="student">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Cohorts</h1>
        <p className="text-gray-600 mb-6">Join a cohort to start learning with a group of peers at your level</p>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Enrolled Cohort</h2>
          <div className="grid grid-cols-1 gap-6">
            {cohorts
              .filter(cohort => userCohortIds.includes(cohort.id))
              .map(cohort => (
                <Card key={cohort.id} className="hover:shadow-md transition-shadow border-l-4 border-l-brand-blue">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                      <div>
                        <CardTitle>{cohort.name}</CardTitle>
                        <CardDescription>
                          {new Date(cohort.start_date).toLocaleDateString()} to {new Date(cohort.end_date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={`${getStatusColor(cohort.status)}`}>
                          {cohort.status === 'active' ? 'Currently Active' : cohort.status}
                        </Badge>
                        <Badge className={`${getLevelColor(cohort.proficiency_level)}`}>
                          {cohort.proficiency_level}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-lg">Current Progress</h3>
                        <p className="text-gray-600">
                          {/* TODO: replace with real current trimester when backend supports it */}
                          Currently in Trimester –
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-4">
                        {[1, 2, 3].map(trimNum => (
                          <div 
                            key={trimNum}
                            className={`p-4 rounded-lg border flex-1 min-w-[200px] ${trimNum === cohort.current_trimester ? 'border-blue-500 bg-blue-50' : trimNum < cohort.current_trimester ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                          >
                            <h4 className="font-medium">Trimester {trimNum}</h4>
                            <p className="text-sm text-gray-600">
                              {trimNum === cohort.current_trimester ? 'In Progress' : trimNum < cohort.current_trimester ? 'Completed' : 'Upcoming'}
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Users className="h-5 w-5 text-brand-blue mr-2" />
                            <span className="font-medium">Cohort Enrollment</span>
                          </div>
                          <span className="text-sm text-gray-600">{cohort.current_students}/{cohort.max_students} students</span>
                        </div>
                        <Progress value={(cohort.current_students && cohort.max_students ? (cohort.current_students / cohort.max_students) * 100 : 0)} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-gray-50">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm text-gray-600 flex items-center">
                        <GraduationCap className="h-4 w-4 mr-1" />
                        {PROFICIENCY_DESCRIPTIONS[cohort.proficiency_level].name}
                      </span>
                      <Button asChild>
                        <Link to={`/student/trimesters?cohort=${cohort.id}`}>View Trimesters</Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Explore Available Cohorts</h2>
          
          <Tabs value={selectedLevel} onValueChange={(value) => setSelectedLevel(value as ProficiencyLevel)} className="mb-6">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="A1-A2">Beginner (A1-A2)</TabsTrigger>
              <TabsTrigger value="B1-B2">Intermediate (B1-B2)</TabsTrigger>
              <TabsTrigger value="C1-C2">Advanced (C1-C2)</TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-lg mb-2 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-brand-blue" />
                  {PROFICIENCY_DESCRIPTIONS[selectedLevel].name}
                </h3>
                <p className="text-gray-600 mb-3">
                  {PROFICIENCY_DESCRIPTIONS[selectedLevel].description}
                </p>
              </div>
            </div>
            
            {(Object.keys(PROFICIENCY_DESCRIPTIONS) as ProficiencyLevel[]).map(level => (
              <TabsContent key={level} value={level} className="focus-visible:outline-none focus-visible:ring-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cohorts
                    .filter(cohort => cohort.proficiency_level === level)
                    .map(cohort => (
                      <Card 
                        key={cohort.id} 
                        className={`hover:shadow-md transition-shadow ${userCohortIds.includes(cohort.id) ? 'border-blue-500' : ''}`}
                      >
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{cohort.name}</CardTitle>
                              <CardDescription>
                                {new Date(cohort.start_date).toLocaleDateString()} to {new Date(cohort.end_date).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <Badge className={`${getStatusColor(cohort.status)}`}>
                              {cohort.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <p>
                              {/* Placeholder until trimester progress is available */}
                              Trimester Progress: –
                            </p>
                            
                            <div className="bg-gray-50 p-3 rounded">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm flex items-center">
                                  <Users className="h-4 w-4 mr-1" /> 
                                  Enrollment
                                </span>
                                <span className="text-sm font-medium">{cohort.current_students}/{cohort.max_students}</span>
                              </div>
                              <Progress 
                                value={(cohort.current_students && cohort.max_students ? (cohort.current_students / cohort.max_students) * 100 : 0)} 
                                className="h-2" 
                              />
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="justify-between border-t pt-4">
                          {userCohortIds.includes(cohort.id) ? (
                            <span className="text-sm font-medium text-blue-600 flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              Currently Enrolled
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">
                              {cohort.max_students - cohort.current_students} spots left
                            </span>
                          )}
                          <Button 
                            asChild
                            variant={userCohortIds.includes(cohort.id) ? "default" : "outline"} 
                            disabled={cohort.status === 'completed'}
                          >
                            <Link to={`/student/trimesters?cohort=${cohort.id}`}>
                              {userCohortIds.includes(cohort.id) ? 'Continue Learning' : 'View Details'}
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Cohorts;
