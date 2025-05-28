import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Calendar, FileText, BookOpen, Play, TestTube, Plus, Trash2 } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { toast } from '@/hooks/use-toast';

interface DayData {
  id: string;
  day_number: number;
  title: string;
  description: string;
  story_text: string;
  topic_notes: string;
  british_audio_url: string;
  american_audio_url: string;
}

interface DayContentEditorProps {
  day: DayData;
  onSave: (dayData: DayData) => void;
}

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
}

const DayContentEditor = ({ day, onSave }: DayContentEditorProps) => {
  const [dayData, setDayData] = useState<DayData>({
    ...day,
    description: day.description || ''
  });
  
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([
    { id: '1', term: 'Present Tense', definition: 'A verb form that describes actions happening now or habitual actions' },
    { id: '2', term: 'Vocabulary', definition: 'The body of words used in a particular language' }
  ]);

  // Extract route parameters from current URL
  const currentPath = window.location.pathname;
  const pathParts = currentPath.split('/');
  const curriculumId = pathParts[3];
  const trimesterId = pathParts[5];
  const dayId = pathParts[7];

  const handleSave = () => {
    onSave(dayData);
    toast({
      title: "Day Content Saved",
      description: `Day ${dayData.day_number} has been updated successfully.`,
    });
  };

  const updateField = (field: keyof DayData, value: string) => {
    setDayData(prev => ({ ...prev, [field]: value }));
  };

  const addGlossaryTerm = () => {
    const newTerm: GlossaryTerm = {
      id: Date.now().toString(),
      term: '',
      definition: ''
    };
    setGlossaryTerms(prev => [...prev, newTerm]);
  };

  const updateGlossaryTerm = (id: string, field: 'term' | 'definition', value: string) => {
    setGlossaryTerms(prev => prev.map(term => 
      term.id === id ? { ...term, [field]: value } : term
    ));
  };

  const deleteGlossaryTerm = (id: string) => {
    setGlossaryTerms(prev => prev.filter(term => term.id !== id));
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
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Day {dayData.day_number} - {dayData.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Template Editing Mode</span>
                <Badge variant="secondary">Draft</Badge>
              </div>
            </div>
            <Button onClick={handleSave} className="bg-brand-yellow text-brand-blue hover:brightness-95">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger value="content" className="flex items-center gap-2 data-[state=active]:bg-white">
            <FileText className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2 data-[state=active]:bg-white">
            <Play className="h-4 w-4" />
            Media
          </TabsTrigger>
          <TabsTrigger value="glossary" className="flex items-center gap-2 data-[state=active]:bg-white">
            <BookOpen className="h-4 w-4" />
            Glossary
          </TabsTrigger>
          <TabsTrigger value="tests" className="flex items-center gap-2 data-[state=active]:bg-white">
            <TestTube className="h-4 w-4" />
            Tests
          </TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={dayData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Enter lesson description..."
                  />
                </div>
              </div>

              <div>
                <Label>Story/Reading Content</Label>
                <p className="text-sm text-gray-600 mb-2">Enter the story content for students to read</p>
                <RichTextEditor
                  value={dayData.story_text}
                  onChange={(value) => updateField('story_text', value)}
                  placeholder="Enter the story content for students to read..."
                  minHeight="300px"
                />
              </div>

              <div>
                <Label>Grammar/Topic Notes</Label>
                <p className="text-sm text-gray-600 mb-2">Enter detailed grammar or topic explanations</p>
                <RichTextEditor
                  value={dayData.topic_notes}
                  onChange={(value) => updateField('topic_notes', value)}
                  placeholder="Enter detailed grammar or topic explanations..."
                  minHeight="250px"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Watch/Listen to the Speaker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <Label className="flex items-center gap-2">
                      Include British Version
                      <Badge variant="outline">UK</Badge>
                    </Label>
                  </div>
                  <Input
                    value={dayData.british_audio_url}
                    onChange={(e) => updateField('british_audio_url', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
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

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <Label className="flex items-center gap-2">
                      Include American Version
                      <Badge variant="outline">US</Badge>
                    </Label>
                  </div>
                  <Input
                    value={dayData.american_audio_url}
                    onChange={(e) => updateField('american_audio_url', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Glossary Tab */}
        <TabsContent value="glossary">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Glossary Terms</CardTitle>
                  <p className="text-sm text-gray-600">Define important vocabulary for this lesson</p>
                </div>
                <Button onClick={addGlossaryTerm} className="bg-brand-yellow text-brand-blue hover:brightness-95">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {glossaryTerms.map((term) => (
                <Card key={term.id} className="border border-gray-200">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <Label>Term</Label>
                        <Input
                          value={term.term}
                          onChange={(e) => updateGlossaryTerm(term.id, 'term', e.target.value)}
                          placeholder="Enter vocabulary term..."
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Label>Definition</Label>
                          <Textarea
                            value={term.definition}
                            onChange={(e) => updateGlossaryTerm(term.id, 'definition', e.target.value)}
                            placeholder="Enter definition..."
                            rows={3}
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteGlossaryTerm(term.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tests Tab */}
        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Types</CardTitle>
              <p className="text-sm text-gray-600">Configure the three types of assessments for this day</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card className="border border-gray-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Vocabulary & Comprehension Test</h3>
                      <p className="text-sm text-gray-600">Test vocabulary and reading comprehension</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/tutor/materials/cohort/${curriculumId}/trimester/${trimesterId}/day/${dayId}/vocabulary-questions`}>
                      Configure Questions
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Topic Test</h3>
                      <p className="text-sm text-gray-600">Test understanding of grammar topics</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/tutor/materials/cohort/${curriculumId}/trimester/${trimesterId}/day/${dayId}/topic-questions`}>
                      Configure Questions
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Writing Test</h3>
                      <p className="text-sm text-gray-600">Creative writing assignments</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/tutor/materials/cohort/${curriculumId}/trimester/${trimesterId}/day/${dayId}/writing-prompts`}>
                      Configure Prompts
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DayContentEditor;
