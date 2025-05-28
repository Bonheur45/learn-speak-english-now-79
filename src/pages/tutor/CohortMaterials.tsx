
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, BookOpen, ArrowRight, Settings } from 'lucide-react';
import { MOCK_COHORTS } from '@/lib/types';

const CohortMaterials = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} userRole="tutor" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-blue mb-2">Cohort Management</h1>
          <p className="text-gray-600">Manage individual cohort schedules, pacing, and customizations</p>
        </div>

        <div className="mb-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-blue-900 mb-2">Looking to edit curriculum content?</h2>
              <p className="text-blue-800 text-sm mb-3">
                Edit master curriculum templates that all cohorts can use as their foundation.
              </p>
              <Button asChild variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                <Link to="/tutor/curriculum">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Edit Curriculum Templates
                </Link>
              </Button>
            </div>
          </div>
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
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Cohort
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Cohort vs Curriculum Management</h2>
          <div className="text-gray-700 space-y-2 text-sm">
            <p>• <strong>Cohort Management:</strong> Adjust schedules, pacing, and cohort-specific customizations</p>
            <p>• <strong>Curriculum Templates:</strong> Edit master content that serves as the foundation for all cohorts</p>
            <p>• <strong>Independence:</strong> Each cohort maintains its own copy of content and can be customized individually</p>
            <p>• <strong>Template Updates:</strong> Changes to curriculum templates don't automatically affect existing cohorts</p>
          </div>
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
