import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Calendar, BookOpen, Video, PenTool, FileText, Eye, Plus, Trash2, Edit } from 'lucide-react';
import { Cohort, getCohort, CohortTrimester, getCohortTrimesters, getCohortTrimesterDays, updateCohortDay } from '@/services/cohorts';
import RichTextEditor from '@/components/RichTextEditor';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const DayEditor = () => {
  const { cohortId, trimesterId, dayId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [trimester, setTrimester] = useState<CohortTrimester | null>(null);
  const [day, setDay] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [dayData, setDayData] = useState<any>({
    id: '',
    day_number: 1,
    title: '',
    date: new Date().toISOString().split('T')[0],
    story_text: '<p>Enter story...</p>',
    topic_notes: '<p>Enter topic notes...</p>',
    british_audio_url: '',
    american_audio_url: '',
  });

  const [audioVersions, setAudioVersions] = useState({
    includeBritish: true,
    includeAmerican: true
  });

  const [glossaryTerms, setGlossaryTerms] = useState([
    { id: '1', term: 'Present Tense', definition: 'A verb form that describes actions happening now or habitual actions.' },
    { id: '2', term: 'Vocabulary', definition: 'The body of words used in a particular language.' }
  ]);

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!cohortId || !trimesterId || !dayId) return;

    // Fetch cohort + trimester list then day
    Promise.all([
      getCohort(cohortId),
      getCohortTrimesters(cohortId),
    ])
      .then(([c, tris]) => {
        setCohort(c);
        const tri = tris.find((t) => t.id === trimesterId) || null;
        setTrimester(tri);
        if (!tri) return Promise.resolve(null);
        return getCohortTrimesterDays(cohortId, trimesterId);
      })
      .then((days: any) => {
        if (days && Array.isArray(days)) {
          const d = days.find((d) => d.id === dayId) || null;
          setDay(d);
          if (d) {
            setDayData({
              id: d.id,
              day_number: d.day_number,
              title: d.title,
              date: d.date || new Date().toISOString().split('T')[0],
              story_text: d.story_text,
              topic_notes: d.topic_notes,
              british_audio_url: d.british_audio_url,
              american_audio_url: d.american_audio_url,
            });
          }
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [cohortId, trimesterId, dayId]);

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

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

  const handleSave = async () => {
    try {
      await updateCohortDay(cohortId!, dayId!, dayData);
      toast({
        title: 'Day Content Saved',
        description: `Day ${dayData.day_number} has been updated successfully.`,
      });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to save day', variant: 'destructive' });
    }
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

  const addGlossaryTerm = () => {
    const newTerm = {
      id: Date.now().toString(),
      term: '',
      definition: ''
    };
    setGlossaryTerms(prev => [...prev, newTerm]);
  };

  const updateGlossaryTerm = (id: string, field: string, value: string) => {
    setGlossaryTerms(prev => prev.map(term => 
      term.id === id ? { ...term, [field]: value } : term
    ));
  };

  const removeGlossaryTerm = (id: string) => {
    setGlossaryTerms(prev => prev.filter(term => term.id !== id));
  };

  const openQuestionEditor = (type: string) => {
    navigate(`/tutor/materials/cohort/${cohortId}/trimester/${trimesterId}/day/${dayId}/questions/${type}`);
  };

  if (showPreview) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar isLoggedIn={true} userRole="tutor" />
        
        <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-brand-blue">Preview: Day {dayData.day_number}</h1>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowPreview(false)} 
                className="bg-brand-yellow text-brand-blue hover:bg-yellow-400"
              >
                <Edit className="h-4 w-4 mr-2" />
                Back to Editor
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Day {dayData.day_number} - {dayData.title}</CardTitle>
              <CardDescription>{new Date(dayData.date).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="story" className="w-full">
                <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} bg-gray-100`}>
                  <TabsTrigger value="story" className={`${isMobile ? 'text-xs px-2' : ''} data-[state=active]:bg-white hover:bg-gray-200 rounded-md transition-colors`}>Story</TabsTrigger>
                  <TabsTrigger value="topic" className={`${isMobile ? 'text-xs px-2' : ''} data-[state=active]:bg-white hover:bg-gray-200 rounded-md transition-colors`}>Topic</TabsTrigger>
                  {!isMobile && <TabsTrigger value="media" className="data-[state=active]:bg-white hover:bg-gray-200 rounded-md transition-colors">Media</TabsTrigger>}
                  {!isMobile && <TabsTrigger value="glossary" className="data-[state=active]:bg-white hover:bg-gray-200 rounded-md transition-colors">Glossary</TabsTrigger>}
                  {isMobile && <TabsTrigger value="more" className="text-xs px-2 data-[state=active]:bg-white hover:bg-gray-200 rounded-md transition-colors">More</TabsTrigger>}
                </TabsList>

                <TabsContent value="story" className="mt-6">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: dayData.story_text }} />
                </TabsContent>

                <TabsContent value="topic" className="mt-6">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: dayData.topic_notes }} />
                </TabsContent>

                {!isMobile && (
                  <>
                    <TabsContent value="media" className="mt-6">
                      <div className="space-y-6">
                        {audioVersions.includeBritish && dayData.british_audio_url && getYouTubeEmbedUrl(dayData.british_audio_url) && (
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              British Version <Badge variant="outline">UK</Badge>
                            </h3>
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                              <iframe
                                src={getYouTubeEmbedUrl(dayData.british_audio_url)}
                                className="w-full h-full"
                                allowFullScreen
                                title="British Version"
                              />
                            </div>
                          </div>
                        )}
                        
                        {audioVersions.includeAmerican && dayData.american_audio_url && getYouTubeEmbedUrl(dayData.american_audio_url) && (
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              American Version <Badge variant="outline">US</Badge>
                            </h3>
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                              <iframe
                                src={getYouTubeEmbedUrl(dayData.american_audio_url)}
                                className="w-full h-full"
                                allowFullScreen
                                title="American Version"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="glossary" className="mt-6">
                      <div className="space-y-4">
                        {glossaryTerms.map(term => (
                          <div key={term.id} className="border rounded-lg p-4">
                            <h4 className="font-semibold text-lg">{term.term}</h4>
                            <p className="text-gray-600 mt-1">{term.definition}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </>
                )}

                {isMobile && (
                  <TabsContent value="more" className="mt-6">
                    <Tabs defaultValue="media" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                        <TabsTrigger value="media" className="text-xs data-[state=active]:bg-white hover:bg-gray-200 rounded-md transition-colors">Media</TabsTrigger>
                        <TabsTrigger value="glossary" className="text-xs data-[state=active]:bg-white hover:bg-gray-200 rounded-md transition-colors">Glossary</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="media" className="mt-4">
                        <div className="space-y-6">
                          {audioVersions.includeBritish && dayData.british_audio_url && getYouTubeEmbedUrl(dayData.british_audio_url) && (
                            <div>
                              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                British Version <Badge variant="outline">UK</Badge>
                              </h3>
                              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <iframe
                                  src={getYouTubeEmbedUrl(dayData.british_audio_url)}
                                  className="w-full h-full"
                                  allowFullScreen
                                  title="British Version"
                                />
                              </div>
                            </div>
                          )}
                          
                          {audioVersions.includeAmerican && dayData.american_audio_url && getYouTubeEmbedUrl(dayData.american_audio_url) && (
                            <div>
                              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                American Version <Badge variant="outline">US</Badge>
                              </h3>
                              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <iframe
                                  src={getYouTubeEmbedUrl(dayData.american_audio_url)}
                                  className="w-full h-full"
                                  allowFullScreen
                                  title="American Version"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="glossary" className="mt-4">
                        <div className="space-y-4">
                          {glossaryTerms.map(term => (
                            <div key={term.id} className="border rounded-lg p-4">
                              <h4 className="font-semibold text-lg">{term.term}</h4>
                              <p className="text-gray-600 mt-1">{term.definition}</p>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                )}
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
  }

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
              <Button onClick={() => setShowPreview(true)} variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSave} className="bg-brand-yellow text-brand-blue hover:bg-yellow-400">
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
              <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-5'} bg-gray-100`}>
                <TabsTrigger value="overview" className={`flex items-center gap-2 ${isMobile ? 'flex-col text-xs px-1' : ''} data-[state=active]:bg-white hover:bg-gray-200 rounded-md transition-colors`}>
                  <FileText className="h-4 w-4" />
                  {!isMobile && 'Overview'}
                </TabsTrigger>
                <TabsTrigger value="content" className={`flex items-center gap-2 ${isMobile ? 'flex-col text-xs px-1' : ''} data-[state=active]:bg-white hover:bg-gray-200 rounded-md transition-colors`}>
                  <BookOpen className="h-4 w-4" />
                  {!isMobile && 'Content'}
                </TabsTrigger>
                {!isMobile && (
                  <>
                    <TabsTrigger value="media" className="flex items-center gap-2 data-[state=active]:bg-white hover:bg-gray-200 rounded-md transition-colors">
                      <Video className="h-4 w-4" />
                      Media
                    </TabsTrigger>
                    <TabsTrigger value="glossary" className="flex items-center gap-2 data-[state=active]:bg-white hover:bg-gray-200 rounded-md transition-colors">
                      <BookOpen className="h-4 w-4" />
                      Glossary
                    </TabsTrigger>
                    <TabsTrigger value="assessments" className="flex items-center gap-2 data-[state=active]:bg-white hover:bg-gray-200 rounded-md transition-colors">
                      <PenTool className="h-4 w-4" />
                      Assessments
                    </TabsTrigger>
                  </>
                )}
                {isMobile && (
                  <TabsTrigger value="more" className="flex items-center gap-2 flex-col text-xs px-1 data-[state=active]:bg-white hover:bg-gray-200 rounded-md transition-colors">
                    <PenTool className="h-4 w-4" />
                    More
                  </TabsTrigger>
                )}
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

              {!isMobile && (
                <>
                  <TabsContent value="media" className="space-y-6 mt-6">
                    <div>
                      <Label className="text-lg font-semibold mb-4 block">Watch/Listen to the Speaker</Label>
                      
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <Label className="text-base font-medium mb-3 block">Audio Version Options</Label>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="british" 
                              checked={audioVersions.includeBritish}
                              onCheckedChange={(checked) => setAudioVersions(prev => ({ ...prev, includeBritish: !!checked }))}
                            />
                            <Label htmlFor="british" className="flex items-center gap-2">
                              Include British Version <Badge variant="outline">UK</Badge>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="american" 
                              checked={audioVersions.includeAmerican}
                              onCheckedChange={(checked) => setAudioVersions(prev => ({ ...prev, includeAmerican: !!checked }))}
                            />
                            <Label htmlFor="american" className="flex items-center gap-2">
                              Include American Version <Badge variant="outline">US</Badge>
                            </Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        {audioVersions.includeBritish && (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="british-url" className="flex items-center gap-2">
                                British Version
                                <Badge variant="outline">UK</Badge>
                              </Label>
                              <Input
                                id="british-url"
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
                        )}

                        {audioVersions.includeAmerican && (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="american-url" className="flex items-center gap-2">
                                American Version
                                <Badge variant="outline">US</Badge>
                              </Label>
                              <Input
                                id="american-url"
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
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="glossary" className="space-y-6 mt-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-lg font-semibold">Glossary Terms</Label>
                          <p className="text-sm text-gray-600">Define important vocabulary for this lesson</p>
                        </div>
                        <Button onClick={addGlossaryTerm} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Term
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {glossaryTerms.map((term) => (
                          <Card key={term.id}>
                            <CardContent className="pt-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`term-${term.id}`}>Term</Label>
                                  <Input
                                    id={`term-${term.id}`}
                                    value={term.term}
                                    onChange={(e) => updateGlossaryTerm(term.id, 'term', e.target.value)}
                                    placeholder="Enter vocabulary term..."
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <div className="flex-1">
                                    <Label htmlFor={`definition-${term.id}`}>Definition</Label>
                                    <Input
                                      id={`definition-${term.id}`}
                                      value={term.definition}
                                      onChange={(e) => updateGlossaryTerm(term.id, 'definition', e.target.value)}
                                      placeholder="Enter definition..."
                                    />
                                  </div>
                                  <div className="flex items-end">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => removeGlossaryTerm(term.id)}
                                      className="h-10"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
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
                              <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => openQuestionEditor('vocabulary')}
                              >
                                Configure Questions
                              </Button>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">Topic Test</CardTitle>
                              <CardDescription>Test understanding of grammar topics</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => openQuestionEditor('topic')}
                              >
                                Configure Questions
                              </Button>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">Writing Test</CardTitle>
                              <CardDescription>Creative writing assignments</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => openQuestionEditor('writing')}
                              >
                                Configure Prompts
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </>
              )}

              {isMobile && (
                <TabsContent value="more" className="space-y-6 mt-6">
                  <Tabs defaultValue="media" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                      <TabsTrigger value="media" className="text-xs data-[state=active]:bg-white hover:bg-gray-200 rounded-md transition-colors">Media</TabsTrigger>
                      <TabsTrigger value="glossary" className="text-xs data-[state=active]:bg-white hover:bg-gray-200 rounded-md transition-colors">Glossary</TabsTrigger>
                      <TabsTrigger value="assessments" className="text-xs data-[state=active]:bg-white hover:bg-gray-200 rounded-md transition-colors">Tests</TabsTrigger>
                    </TabsList>

                    <TabsContent value="media" className="mt-4">
                      <div>
                        <Label className="text-lg font-semibold mb-4 block">Watch/Listen to the Speaker</Label>
                        
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                          <Label className="text-base font-medium mb-3 block">Audio Version Options</Label>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="british-mobile" 
                                checked={audioVersions.includeBritish}
                                onCheckedChange={(checked) => setAudioVersions(prev => ({ ...prev, includeBritish: !!checked }))}
                              />
                              <Label htmlFor="british-mobile" className="flex items-center gap-2 text-sm">
                                Include British Version <Badge variant="outline" className="text-xs">UK</Badge>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="american-mobile" 
                                checked={audioVersions.includeAmerican}
                                onCheckedChange={(checked) => setAudioVersions(prev => ({ ...prev, includeAmerican: !!checked }))}
                              />
                              <Label htmlFor="american-mobile" className="flex items-center gap-2 text-sm">
                                Include American Version <Badge variant="outline" className="text-xs">US</Badge>
                              </Label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          {audioVersions.includeBritish && (
                            <div className="space-y-3">
                              <div>
                                <Label htmlFor="british-url-mobile" className="flex items-center gap-2 text-sm">
                                  British Version
                                  <Badge variant="outline" className="text-xs">UK</Badge>
                                </Label>
                                <Input
                                  id="british-url-mobile"
                                  value={dayData.british_audio_url}
                                  onChange={(e) => updateField('british_audio_url', e.target.value)}
                                  placeholder="https://www.youtube.com/watch?v=..."
                                  className="text-sm"
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
                          )}

                          {audioVersions.includeAmerican && (
                            <div className="space-y-3">
                              <div>
                                <Label htmlFor="american-url-mobile" className="flex items-center gap-2 text-sm">
                                  American Version
                                  <Badge variant="outline" className="text-xs">US</Badge>
                                </Label>
                                <Input
                                  id="american-url-mobile"
                                  value={dayData.american_audio_url}
                                  onChange={(e) => updateField('american_audio_url', e.target.value)}
                                  placeholder="https://www.youtube.com/watch?v=..."
                                  className="text-sm"
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
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="glossary" className="mt-4">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base font-semibold">Glossary Terms</Label>
                            <p className="text-xs text-gray-600">Define important vocabulary for this lesson</p>
                          </div>
                          <Button onClick={addGlossaryTerm} size="sm" className="text-xs">
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {glossaryTerms.map((term) => (
                            <Card key={term.id}>
                              <CardContent className="pt-4">
                                <div className="space-y-3">
                                  <div>
                                    <Label htmlFor={`term-mobile-${term.id}`} className="text-sm">Term</Label>
                                    <Input
                                      id={`term-mobile-${term.id}`}
                                      value={term.term}
                                      onChange={(e) => updateGlossaryTerm(term.id, 'term', e.target.value)}
                                      placeholder="Enter vocabulary term..."
                                      className="text-sm"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <div className="flex-1">
                                      <Label htmlFor={`definition-mobile-${term.id}`} className="text-sm">Definition</Label>
                                      <Input
                                        id={`definition-mobile-${term.id}`}
                                        value={term.definition}
                                        onChange={(e) => updateGlossaryTerm(term.id, 'definition', e.target.value)}
                                        placeholder="Enter definition..."
                                        className="text-sm"
                                      />
                                    </div>
                                    <div className="flex items-end">
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => removeGlossaryTerm(term.id)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="assessments" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-semibold">Assessment Types</Label>
                          <p className="text-xs text-gray-600 mb-4">Configure the three types of assessments for this day</p>
                          
                          <div className="space-y-3">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Vocabulary & Comprehension Test</CardTitle>
                                <CardDescription className="text-xs">Test vocabulary and reading comprehension</CardDescription>
                              </CardHeader>
                              <CardContent className="pt-2">
                                <Button 
                                  variant="outline" 
                                  className="w-full text-xs"
                                  size="sm"
                                  onClick={() => openQuestionEditor('vocabulary')}
                                >
                                  Configure Questions
                                </Button>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Topic Test</CardTitle>
                                <CardDescription className="text-xs">Test understanding of grammar topics</CardDescription>
                              </CardHeader>
                              <CardContent className="pt-2">
                                <Button 
                                  variant="outline" 
                                  className="w-full text-xs"
                                  size="sm"
                                  onClick={() => openQuestionEditor('topic')}
                                >
                                  Configure Questions
                                </Button>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Writing Test</CardTitle>
                                <CardDescription className="text-xs">Creative writing assignments</CardDescription>
                              </CardHeader>
                              <CardContent className="pt-2">
                                <Button 
                                  variant="outline" 
                                  className="w-full text-xs"
                                  size="sm"
                                  onClick={() => openQuestionEditor('writing')}
                                >
                                  Configure Prompts
                                </Button>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>
              )}
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
