
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Save, Edit, Calendar, BookOpen } from 'lucide-react';
import { MOCK_COHORTS, MOCK_TRIMESTERS } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

const DaysList = () => {
  const { cohortId, trimesterId } = useParams();
  const navigate = useNavigate();
  
  const cohort = MOCK_COHORTS.find(c => c.id === cohortId);
  const trimester = MOCK_TRIMESTERS.find(t => t.id === trimesterId);
  
  // Convert mock days to the format expected by the editor
  const [daysData, setDaysData] = useState(
    trimester?.days.map(day => ({
      id: day.id,
      day_number: day.day_number,
      title: day.title,
      date: day.date,
      story_text: day.story_text || '<p>Enter the story content here...</p>',
      topic_notes: '<p>Today we will learn about present tense verbs. Present tense describes actions happening now or habitual actions...</p>',
      british_audio_url: '',
      american_audio_url: ''
    })) || []
  );

  if (!cohort || !trimester) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar isLoggedIn={true} userRole="tutor" />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Content Not Found</h1>
            <p className="mt-2 text-gray-600">The requested content could not be found.</p>
            <Button asChild className="mt-4">
              <Link to="/tutor/materials">Back to Materials</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleEditDay = (dayId: string) => {
    navigate(`/tutor/materials/cohort/${cohortId}/trimester/${trimesterId}/day/${dayId}/edit`);
  };

  const handleSaveAll = () => {
    toast({
      title: "All Changes Saved",
      description: `All day content for ${trimester.name} has been saved successfully.`,
    });
  };

  const addNewDay = () => {
    const newDay = {
      id: `day_${Date.now()}`,
      day_number: daysData.length + 1,
      title: `New Lesson ${daysData.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      story_text: '<p>Enter the story content here...</p>',
      topic_notes: '<p>Enter topic notes here...</p>',
      british_audio_url: '',
      american_audio_url: ''
    };
    setDaysData(prev => [...prev, newDay]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} userRole="tutor" />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/tutor/materials" className="hover:text-brand-blue">Materials</Link>
            <span>/</span>
            <Link to={`/tutor/materials/cohort/${cohortId}`} className="hover:text-brand-blue">{cohort.name}</Link>
            <span>/</span>
            <span className="font-medium">{trimester.name}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-brand-blue">{trimester.name} - Daily Materials</h1>
              <p className="text-gray-600 mt-1">Manage lesson content for each day in this trimester</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm">
                <Link to={`/tutor/materials/cohort/${cohortId}`}>
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
                Save All Changes
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
                <CardDescription>Cohort</CardDescription>
                <CardTitle className="text-lg">{cohort.name}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Trimester</CardDescription>
                <CardTitle className="text-lg">{trimester.name}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {daysData.length === 0 ? (
            <div className="col-span-full">
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No days found for this trimester.</p>
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
                    <Badge variant="secondary">Draft</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(day.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => handleEditDay(day.id)}
                      className="w-full"
                      variant="outline"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Day
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

export default DaysList;
