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
import api from '@/lib/api';

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
  const [dayData, setDayData] = useState<DayData>(day);
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save the day content
      await api.curriculum.updateCurriculumTemplate(day.id, dayData);
      
      // Save glossary terms if any
      if (glossaryTerms.length > 0) {
        await api.curriculum.updateCurriculumTemplate(day.id, {
          glossary_terms: glossaryTerms
        });
      }

      toast({
        title: "Success",
        description: "Day content saved successfully.",
      });
      
      onSave(dayData);
    } catch (error) {
      console.error('Failed to save day content:', error);
      toast({
        title: "Error",
        description: "Failed to save day content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof DayData, value: string) => {
    setDayData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGlossaryTermAdd = () => {
    setGlossaryTerms(prev => [
      ...prev,
      { id: Date.now().toString(), term: '', definition: '' }
    ]);
  };

  const handleGlossaryTermChange = (id: string, field: 'term' | 'definition', value: string) => {
    setGlossaryTerms(prev =>
      prev.map(term =>
        term.id === id ? { ...term, [field]: value } : term
      )
    );
  };

  const handleGlossaryTermDelete = (id: string) => {
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
            <Button 
              onClick={handleSave} 
              className="bg-brand-yellow text-brand-blue hover:brightness-95"
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="story" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Story
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Audio
          </TabsTrigger>
          <TabsTrigger value="glossary" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Glossary
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={dayData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter the day's title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={dayData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter a brief description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="topic_notes">Topic Notes</Label>
              <RichTextEditor
                value={dayData.topic_notes}
                onChange={(value) => handleInputChange('topic_notes', value)}
                placeholder="Enter topic notes..."
              />
            </div>
          </div>
        </TabsContent>

        {/* Story Tab */}
        <TabsContent value="story" className="space-y-4">
          <div>
            <Label htmlFor="story_text">Story Text</Label>
            <RichTextEditor
              value={dayData.story_text}
              onChange={(value) => handleInputChange('story_text', value)}
              placeholder="Enter the story text..."
            />
          </div>
        </TabsContent>

        {/* Audio Tab */}
        <TabsContent value="audio" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="british_audio">British Pronunciation Audio URL</Label>
              <Input
                id="british_audio"
                value={dayData.british_audio_url}
                onChange={(e) => handleInputChange('british_audio_url', e.target.value)}
                placeholder="Enter British audio URL"
              />
            </div>
            <div>
              <Label htmlFor="american_audio">American Pronunciation Audio URL</Label>
              <Input
                id="american_audio"
                value={dayData.american_audio_url}
                onChange={(e) => handleInputChange('american_audio_url', e.target.value)}
                placeholder="Enter American audio URL"
              />
            </div>
          </div>
        </TabsContent>

        {/* Glossary Tab */}
        <TabsContent value="glossary" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Glossary Terms</h3>
            <Button
              onClick={handleGlossaryTermAdd}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Term
            </Button>
          </div>
          <div className="space-y-4">
            {glossaryTerms.map((term) => (
              <div key={term.id} className="grid gap-4 p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="grid gap-4 flex-1">
                    <div>
                      <Label htmlFor={`term-${term.id}`}>Term</Label>
                      <Input
                        id={`term-${term.id}`}
                        value={term.term}
                        onChange={(e) => handleGlossaryTermChange(term.id, 'term', e.target.value)}
                        placeholder="Enter term"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`definition-${term.id}`}>Definition</Label>
                      <Textarea
                        id={`definition-${term.id}`}
                        value={term.definition}
                        onChange={(e) => handleGlossaryTermChange(term.id, 'definition', e.target.value)}
                        placeholder="Enter definition"
                        rows={2}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleGlossaryTermDelete(term.id)}
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DayContentEditor;
