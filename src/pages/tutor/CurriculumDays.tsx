import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Save, Edit, Calendar, BookOpen } from 'lucide-react';
import { CurriculumTemplate, getCurriculumTemplate } from '@/services/curriculumTemplates';
import { CurriculumTrimester, CurriculumDay, getTrimesterDays, updateCurriculumDay, createCurriculumDay } from '@/services/curriculum';
import { toast } from '@/hooks/use-toast';

const CurriculumDays = () => {
  const { curriculumId, trimesterId } = useParams();
  const navigate = useNavigate();
  
  const [template, setTemplate] = useState<CurriculumTemplate | null>(null);
  const [trimester, setTrimester] = useState<CurriculumTrimester | null>(null);
  const [daysData, setDaysData] = useState<CurriculumDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!curriculumId || !trimesterId) return;

    // Parallel fetches
    Promise.all([
      getCurriculumTemplate(curriculumId),
      getTrimesterDays(trimesterId),
    ])
      .then(([tmpl, days]) => {
        setTemplate(tmpl);
        setDaysData(days);
        // We still need trimester meta; easiest: find in tmpl?
        // fallback trim metadata fetch via getCurriculumTrimesters then find the one, but simpler we derive placeholder.
        setTrimester({ id: trimesterId, curriculum_id: curriculumId, name: `Trimester`, number: 0, description: '', total_days: days.length, days } as any);
      })
      .catch((err) => {
        console.error(err);
        toast({ title: 'Error', description: 'Failed to load curriculum days', variant: 'destructive' });
      })
      .finally(() => setLoading(false));
  }, [curriculumId, trimesterId]);

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!template || !trimester) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar isLoggedIn={true} userRole="tutor" />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Content Not Found</h1>
            <p className="mt-2 text-gray-600">The requested content could not be found.</p>
            <Button asChild className="mt-4">
              <Link to="/tutor/curriculum">Back to Curricula</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleEditDay = (dayId: string) => {
    navigate(`/tutor/curriculum/${curriculumId}/trimester/${trimesterId}/day/${dayId}/edit`);
  };

  const handleSaveAll = async () => {
    try {
      const synced: CurriculumDay[] = [];
      for (const day of daysData) {
        if (!day.id || day.id.startsWith('tmp_')) {
          // unlikely now but handle just in case
          const created = await createCurriculumDay(trimester!.id, day);
          synced.push(created as CurriculumDay);
        } else {
          const updated = await updateCurriculumDay(day.id, day);
          synced.push(updated as CurriculumDay);
        }
      }
      setDaysData(synced);
      toast({
        title: 'Curriculum Template Saved',
        description: `All day content for ${trimester.name} has been saved.`,
      });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to save days', variant: 'destructive' });
    }
  };

  const addNewDay = async () => {
    try {
      const payload: Partial<CurriculumDay> = {
        title: `New Lesson ${daysData.length + 1}`,
        description: `Learning objectives for day ${daysData.length + 1}`,
        day_number: daysData.length + 1,
        story_text: '<p>Enter the story content here...</p>',
        topic_notes: '<p>Enter topic notes here...</p>',
        british_audio_url: '',
        american_audio_url: '',
        glossary_terms: [],
      };

      const created = await createCurriculumDay(trimester!.id, payload);
      const dayNum = created.number ?? created.day_number ?? payload.number;
      setDaysData((prev) => [...prev, { ...created, day_number: dayNum } as CurriculumDay]);
      toast({ title: 'Day Added', description: `Day ${dayNum} created.` });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to create day', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} userRole="tutor" />
      
      <main className="flex-grow container mx-auto px-4 py-8 pt-24 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/tutor/curriculum" className="hover:text-brand-blue">Curriculum Templates</Link>
            <span>/</span>
            <Link to={`/tutor/curriculum/${curriculumId}`} className="hover:text-brand-blue">{template.level}</Link>
            <span>/</span>
            <span className="font-medium">{trimester.name}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-brand-blue">{trimester.name} - Template Days</h1>
              <p className="text-gray-600 mt-1">Edit master curriculum content for {template.level} level</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm">
                <Link to={`/tutor/curriculum/${curriculumId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Trimesters
                </Link>
              </Button>
              <Button onClick={addNewDay} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add New Day
              </Button>
              <Button onClick={handleSaveAll} className="bg-brand-yellow text-brand-blue hover:brightness-95">
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Days</CardDescription>
                <CardTitle className="text-2xl">{daysData.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Curriculum Level</CardDescription>
                <CardTitle className="text-lg">{template.level}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Trimester</CardDescription>
                <CardTitle className="text-lg">{trimester.name}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 mb-6">
            <p className="text-amber-800 text-sm">
              <strong>Template Editing:</strong> You are editing the master curriculum template for {template.level}. 
              Changes here will be available for new cohorts but won't affect existing cohorts automatically.
            </p>
          </div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {daysData.length === 0 ? (
            <div className="col-span-full">
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No days found for this trimester template.</p>
                  <Button onClick={addNewDay}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Day
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            daysData.map((day) => (
              <Card key={day.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Day {day.day_number}</CardTitle>
                      <CardDescription className="mt-1">{day.title}</CardDescription>
                    </div>
                    <Badge variant="secondary">Template</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {new Date(day.updated_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => handleEditDay(day.id)}
                      className="w-full"
                      variant="outline"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Day Template
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

export default CurriculumDays;
