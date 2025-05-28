
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { MOCK_CURRICULA, MOCK_CURRICULUM_TRIMESTERS, CurriculumDay } from '@/lib/curriculumTypes';
import DayContentEditor from '@/components/DayContentEditor';
import { toast } from '@/hooks/use-toast';

const CurriculumDayEditor = () => {
  const { curriculumId, trimesterId, dayId } = useParams();
  const navigate = useNavigate();
  
  const curriculum = MOCK_CURRICULA.find(c => c.id === curriculumId);
  const trimester = MOCK_CURRICULUM_TRIMESTERS.find(t => t.id === trimesterId);
  const curriculumDay = trimester?.days.find(d => d.id === dayId);
  
  if (!curriculum || !trimester || !curriculumDay) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar isLoggedIn={true} userRole="tutor" />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Content Not Found</h1>
            <p className="mt-2 text-gray-600">The requested curriculum content could not be found.</p>
            <Button asChild className="mt-4">
              <Link to="/tutor/curriculum">Back to Curricula</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Convert curriculum day to the format expected by DayContentEditor
  const dayData = {
    id: curriculumDay.id,
    day_number: curriculumDay.day_number,
    title: curriculumDay.title,
    date: new Date().toISOString().split('T')[0], // Templates don't have specific dates
    story_text: curriculumDay.story_text,
    topic_notes: curriculumDay.topic_notes,
    british_audio_url: curriculumDay.british_audio_url,
    american_audio_url: curriculumDay.american_audio_url
  };

  const handleSave = (updatedDayData: any) => {
    toast({
      title: "Curriculum Template Saved",
      description: `Day ${updatedDayData.day_number} template has been updated successfully.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} userRole="tutor" />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/tutor/curriculum" className="hover:text-brand-blue">Curriculum Templates</Link>
            <span>/</span>
            <Link to={`/tutor/curriculum/${curriculumId}`} className="hover:text-brand-blue">{curriculum.level}</Link>
            <span>/</span>
            <Link to={`/tutor/curriculum/${curriculumId}/trimester/${trimesterId}`} className="hover:text-brand-blue">{trimester.name}</Link>
            <span>/</span>
            <span className="font-medium">Day {curriculumDay.day_number}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-brand-blue">Edit Template: Day {curriculumDay.day_number}</h1>
              <p className="text-gray-600 mt-1">Editing master curriculum template for {curriculum.level} level</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm">
                <Link to={`/tutor/curriculum/${curriculumId}/trimester/${trimesterId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Days
                </Link>
              </Button>
              <Badge variant="secondary" className="h-9 px-3 flex items-center">
                Template: {curriculum.level}
              </Badge>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 mb-6">
            <p className="text-amber-800 text-sm">
              <strong>Template Editing:</strong> You are editing the master curriculum template. 
              This content will be available for new cohorts to use as their starting point.
            </p>
          </div>
        </div>

        {/* Content Editor */}
        <DayContentEditor 
          day={dayData}
          onSave={handleSave}
        />
      </main>
      
      <footer className="bg-white border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Let's Do It English. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CurriculumDayEditor;
