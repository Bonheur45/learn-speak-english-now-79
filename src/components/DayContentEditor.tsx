
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronDown, Save, Calendar, Clock } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { toast } from '@/hooks/use-toast';

interface DayData {
  id: string;
  day_number: number;
  title: string;
  date: string;
  story_text: string;
  topic_notes: string;
  british_audio_url: string;
  american_audio_url: string;
}

interface DayContentEditorProps {
  day: DayData;
  onSave: (dayData: DayData) => void;
}

const DayContentEditor = ({ day, onSave }: DayContentEditorProps) => {
  const [dayData, setDayData] = useState<DayData>(day);
  const [isExpanded, setIsExpanded] = useState(false);

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
    <Card className="mb-4 border-l-4 border-l-blue-500">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <CardTitle className="text-lg">Day {dayData.day_number}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{dayData.title}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(dayData.date).toLocaleDateString()}</span>
                </div>
                <Badge variant="secondary">Draft</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={(e) => { e.stopPropagation(); handleSave(); }} size="sm" variant="outline">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <Accordion type="single" collapsible className="w-full">
              {/* Basic Information */}
              <AccordionItem value="basic-info">
                <AccordionTrigger>Basic Information</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`title-${dayData.id}`}>Lesson Title</Label>
                      <Input
                        id={`title-${dayData.id}`}
                        value={dayData.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        placeholder="Enter lesson title..."
                      />
                    </div>
                    <div>
                      <Label htmlFor={`date-${dayData.id}`}>Date</Label>
                      <Input
                        id={`date-${dayData.id}`}
                        type="date"
                        value={dayData.date.split('T')[0]}
                        onChange={(e) => updateField('date', e.target.value)}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Story/Reading Content */}
              <AccordionItem value="story-content">
                <AccordionTrigger>Story/Reading Content</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <Label>Story Text</Label>
                    <RichTextEditor
                      value={dayData.story_text}
                      onChange={(value) => updateField('story_text', value)}
                      placeholder="Enter the story content for students to read..."
                      minHeight="300px"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Topic Notes */}
              <AccordionItem value="topic-notes">
                <AccordionTrigger>Grammar/Topic Notes</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <Label>Topic Explanation</Label>
                    <RichTextEditor
                      value={dayData.topic_notes}
                      onChange={(value) => updateField('topic_notes', value)}
                      placeholder="Enter detailed grammar or topic explanations..."
                      minHeight="250px"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Audio/Video Content */}
              <AccordionItem value="media-content">
                <AccordionTrigger>Watch/Listen to the Speaker</AccordionTrigger>
                <AccordionContent className="space-y-6">
                  {/* British Version */}
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`british-${dayData.id}`} className="flex items-center gap-2">
                        British Version
                        <Badge variant="outline">UK</Badge>
                      </Label>
                      <Input
                        id={`british-${dayData.id}`}
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
                      <Label htmlFor={`american-${dayData.id}`} className="flex items-center gap-2">
                        American Version
                        <Badge variant="outline">US</Badge>
                      </Label>
                      <Input
                        id={`american-${dayData.id}`}
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default DayContentEditor;
