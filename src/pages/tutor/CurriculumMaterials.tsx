import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, ArrowRight, Edit } from 'lucide-react';
import api from '@/lib/api';
import { useEffect, useState } from 'react';

const CurriculumMaterials = () => {
  const [curricula, setCurricula] = useState<any[]>([]);

  useEffect(() => {
    const fetchCurricula = async () => {
      try {
        const data = await api.curriculum.getCurriculumTemplates(0, 1000);
        setCurricula(data);
      } catch (err) {
        console.error('Failed to load curricula', err);
      }
    };
    fetchCurricula();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} userRole="tutor" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-blue mb-2">Curriculum Templates</h1>
          <p className="text-gray-600">Edit master curriculum templates that cohorts can use. Changes here will be available for new cohorts to adopt.</p>
        </div>

        <div className="mb-6 flex justify-end">
          <Button asChild>
            <Link to="/tutor/curriculum/new">Create New Template</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {curricula.map((curriculum) => (
            <Card key={curriculum.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{curriculum.name}</CardTitle>
                  <Badge variant="secondary">Template</Badge>
                </div>
                <CardDescription className="line-clamp-3">
                  {curriculum.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{curriculum.trimesters?.length ?? 0} Trimesters</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {new Date(curriculum.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button asChild className="w-full" variant="outline">
                    <Link to={`/tutor/curriculum/${curriculum.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Curriculum
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {curricula.length === 0 && (
          <p className="text-gray-500">No curriculum templates found.</p>
        )}

        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">How Curriculum Templates Work</h2>
          <div className="text-blue-800 space-y-2 text-sm">
            <p>• <strong>Templates:</strong> Edit master curriculum content here that applies to all cohorts of this level</p>
            <p>• <strong>Cohort Independence:</strong> Each cohort copies from these templates but maintains its own schedule and customizations</p>
            <p>• <strong>Content Updates:</strong> Changes to templates don't affect existing cohorts automatically - they maintain their independence</p>
            <p>• <strong>New Cohorts:</strong> When creating new cohorts, they will use the latest template content as their starting point</p>
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

export default CurriculumMaterials;
