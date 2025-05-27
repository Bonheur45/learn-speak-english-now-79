
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Calendar, BookOpen, Video, PenTool, FileText } from 'lucide-react';
import { MOCK_COHORTS, MOCK_TRIMESTERS } from '@/lib/types';
import RichTextEditor from '@/components/RichTextEditor';
import { toast } from '@/hooks/use-toast';

const DayEditor = () => {
  const { cohortId, trimesterId, dayId } = useParams();
  const navigate = useNavigate();
  
  const cohort = MOCK_COHORTS.find(c => c.id === cohortId);
  const trimester = MOCK_TRIMESTERS.find(t => t.id === trimesterId);
  const day = trimester?.days.find(d => d.id === dayId);
  
  const [dayData, setDayData] = useState({
    id: day?.id || '',
    day_number: day?.day_number || 1,
    title: day?.title || '',
    date: day?.date || new Date().toISOString().split('T')[0],
    story_text: day?.story_text || '<p>Enter the story content here...</p>',
    topic_notes: '<p>Today we will learn about present tense verbs. Present tense describes actions happening now or habitual actions...</p>',
    british_audio_url: '',
    american_audio_url: ''
  });

  if (!cohort || !trimester || !day) {
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

  const handleSave = () => {
    toast({
      title: "Day Content Saved",
      description: `Day ${dayData.day_number} has been updated successfully.`,
    });
  };

  const updateField = (field: string, value: string) => {
    setDayData(prev => ({ ...prev, [field]: value }));
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }
    return url.includes('embed') ? url : '';
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
            <Link to={`/tutor/materials/cohort/${cohortId}/trimester/${trimesterId}`} className="hover:text-brand-blue">{trimester.name}</Link>
            <span>/</span>
            <span className="font-medium">Day {dayData.day_number}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-brand-blue">Edit Day {dayData.day_number}</h1>
              <p className="text-gray-600 mt-1">Update lesson content and materials</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm">
                <Link to={`/tutor/materials/cohort/${cohortId}/trimester/${trimesterId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Days
                </Link>
              </Button>
              <Button onClick={handleSave} className="bg-brand-yellow text-brand-blue hover:brightness-95">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Day {dayData.day_number} - {dayData.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(dayData.date).toLocaleDateString()}</span>
                  <Badge variant="secondary" className="ml-2">Draft</Badge>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="media" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Media
                </TabsTrigger>
                <TabsTrigger value="assessments" className="flex items-center gap-2">
                  <PenTool className="h-4 w-4" />
                  Assessments
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Lesson Title</Label>
                    <Input
                      id="title"
                      value={dayData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="Enter lesson title..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={dayData.date.split('T')[0]}
                      onChange={(e) => updateField('date', e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-6 mt-6">
                <div className="space-y-6">
                  <div>
                    <Label className="text-lg font-semibold">Story/Reading Content</Label>
                    <p className="text-sm text-gray-600 mb-3">Enter the story content for students to read</p>
                    <RichTextEditor
                      value={dayData.story_text}
                      onChange={(value) => updateField('story_text', value)}
                      placeholder="Enter the story content for students to read..."
                      minHeight="300px"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-lg font-semibold">Grammar/Topic Notes</Label>
                    <p className="text-sm text-gray-600 mb-3">Enter detailed grammar or topic explanations</p>
                    <RichTextEditor
                      value={dayData.topic_notes}
                      onChange={(value) => updateField('topic_notes', value)}
                      placeholder="Enter detailed grammar or topic explanations..."
                      minHeight="250px"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-6 mt-6">
                <div>
                  <Label className="text-lg font-semibold mb-4 block">Watch/Listen to the Speaker</Label>
                  
                  <div className="space-y-6">
                    {/* British Version */}
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="british" className="flex items-center gap-2">
                          British Version
                          <Badge variant="outline">UK</Badge>
                        </Label>
                        <Input
                          id="british"
                          value={dayData.british_audio_url}
                          onChange={(e) => updateField('british_audio_url', e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </div>
                      {dayData.british_audio_url && getYouTubeEmbedUrl(dayData.british_audio_url) && (
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <iframe
                            src={getYouTubeEmbedUrl(dayData.british_audio_url)}
                            className="w-full h-full"
                            allowFullScreen
                            title="British Version"
                          />
                        </div>
                      )}
                    </div>

                    {/* American Version */}
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="american" className="flex items-center gap-2">
                          American Version
                          <Badge variant="outline">US</Badge>
                        </Label>
                        <Input
                          id="american"
                          value={dayData.american_audio_url}
                          onChange={(e) => updateField('american_audio_url', e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </div>
                      {dayData.american_audio_url && getYouTubeEmbedUrl(dayData.american_audio_url) && (
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <iframe
                            src={getYouTubeEmbedUrl(dayData.american_audio_url)}
                            className="w-full h-full"
                            allowFullScreen
                            title="American Version"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="assessments" className="space-y-6 mt-6">
                <div className="space-y-6">
                  <div>
                    <Label className="text-lg font-semibold">Assessment Types</Label>
                    <p className="text-sm text-gray-600 mb-4">Configure the three types of assessments for this day</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Vocabulary & Comprehension Test</CardTitle>
                          <CardDescription>Test vocabulary and reading comprehension</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="w-full">Configure Questions</Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Topic Test</CardTitle>
                          <CardDescription>Test understanding of grammar topics</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="w-full">Configure Questions</Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Writing Test</CardTitle>
                          <CardDescription>Creative writing assignments</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="w-full">Configure Prompts</Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      <footer className="bg-white border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Let's Do It English. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DayEditor;
