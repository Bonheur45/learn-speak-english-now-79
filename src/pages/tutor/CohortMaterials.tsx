
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, BookOpen, ArrowRight } from 'lucide-react';
import { MOCK_COHORTS } from '@/lib/types';

const CohortMaterials = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} userRole="tutor" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-blue mb-2">Course Materials</h1>
          <p className="text-gray-600">Select a cohort to manage its course materials and lesson content</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_COHORTS.map((cohort) => (
            <Card key={cohort.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{cohort.name}</CardTitle>
                  <Badge variant={cohort.status === 'active' ? 'default' : 'secondary'}>
                    {cohort.status}
                  </Badge>
                </div>
                <CardDescription>
                  {cohort.proficiency_level} • Trimester {cohort.current_trimester}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{cohort.enrolled_students}/{cohort.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(cohort.start_date).getFullYear()}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button asChild className="w-full" variant="outline">
                    <Link to={`/tutor/materials/cohort/${cohort.id}`}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Manage Materials
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Let's Do It English. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CohortMaterials;
