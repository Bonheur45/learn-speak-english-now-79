
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, BookOpen, ArrowRight } from 'lucide-react';
import { MOCK_COHORTS, MOCK_TRIMESTERS } from '@/lib/types';
import { MOCK_CURRICULUM_TRIMESTERS } from '@/lib/curriculumTypes';

const TrimesterMaterials = () => {
  const { cohortId } = useParams();
  
  const cohort = MOCK_COHORTS.find(c => c.id === cohortId);
  const trimesters = MOCK_TRIMESTERS.filter(t => t.cohort_id === cohortId);

  // Helper function to get days count from curriculum template
  const getTrimesterDaysCount = (trimester: any) => {
    const curriculumTrimester = MOCK_CURRICULUM_TRIMESTERS.find(
      ct => ct.id === trimester.curriculum_trimester_id
    );
    return curriculumTrimester?.days?.length || 0;
  };

  if (!cohort) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar isLoggedIn={true} userRole="tutor" />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Cohort Not Found</h1>
            <p className="mt-2 text-gray-600">The requested cohort could not be found.</p>
            <Button asChild className="mt-4">
              <Link to="/tutor/materials">Back to Materials</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} userRole="tutor" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/tutor/materials" className="hover:text-brand-blue">Materials</Link>
            <span>/</span>
            <span className="font-medium">{cohort.name}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-brand-blue">{cohort.name} - Trimesters</h1>
              <p className="text-gray-600 mt-1">Select a trimester to manage its lesson content</p>
            </div>
            
            <Button asChild variant="outline" size="sm">
              <Link to="/tutor/materials">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cohorts
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trimesters.map((trimester) => {
            const daysCount = getTrimesterDaysCount(trimester);
            
            return (
              <Card key={trimester.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{trimester.name}</CardTitle>
                  <CardDescription>
                    Trimester {trimester.number} • {daysCount} days
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(trimester.start_date).toLocaleDateString()} - {new Date(trimester.end_date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button asChild className="w-full" variant="outline">
                      <Link to={`/tutor/materials/cohort/${cohortId}/trimester/${trimester.id}`}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        View Days ({daysCount})
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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

export default TrimesterMaterials;
