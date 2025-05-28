
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { MOCK_CURRICULA, MOCK_CURRICULUM_TRIMESTERS } from '@/lib/curriculumTypes';

const CurriculumTrimesters = () => {
  const { curriculumId } = useParams();
  
  const curriculum = MOCK_CURRICULA.find(c => c.id === curriculumId);
  const trimesters = MOCK_CURRICULUM_TRIMESTERS.filter(t => t.curriculum_id === curriculumId);
  
  if (!curriculum) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar isLoggedIn={true} userRole="tutor" />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Curriculum Not Found</h1>
            <p className="mt-2 text-gray-600">The requested curriculum could not be found.</p>
            <Button asChild className="mt-4">
              <Link to="/tutor/curriculum">Back to Curricula</Link>
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
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/tutor/curriculum" className="hover:text-brand-blue">Curriculum Templates</Link>
            <span>/</span>
            <span className="font-medium">{curriculum.level}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-brand-blue">{curriculum.name}</h1>
              <p className="text-gray-600 mt-1">{curriculum.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm">
                <Link to="/tutor/curriculum">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Curricula
                </Link>
              </Button>
              <Badge variant="secondary" className="h-9 px-3 flex items-center">
                Template Level: {curriculum.level}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trimesters.length === 0 ? (
            <div className="col-span-full">
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No trimesters found for this curriculum level.</p>
                  <p className="text-sm text-gray-400">Trimesters will be created automatically when the curriculum is initialized.</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            trimesters.map((trimester) => (
              <Card key={trimester.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{trimester.name}</CardTitle>
                    <Badge variant="outline">T{trimester.number}</Badge>
                  </div>
                  <CardDescription className="line-clamp-3">
                    {trimester.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{trimester.total_days} Days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Trimester {trimester.number}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button asChild className="w-full" variant="outline">
                      <Link to={`/tutor/curriculum/${curriculumId}/trimester/${trimester.id}`}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Edit Days
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Let's Do It English. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CurriculumTrimesters;
