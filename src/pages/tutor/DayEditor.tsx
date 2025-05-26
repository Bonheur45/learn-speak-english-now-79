
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Upload,
  Save,
  Eye,
  Plus,
  Trash2,
  Volume2,
  Edit3
} from 'lucide-react';
import { MOCK_TRIMESTERS } from '@/lib/types';

const DayEditor = () => {
  const { dayId } = useParams();
  
  // Find the day from mock data
  const day = MOCK_TRIMESTERS.flatMap(t => t.days).find(d => d.id === dayId);
  
  // State for all day content
  const [storyContent, setStoryContent] = useState(day?.story_text || '');
  const [dayTitle, setDayTitle] = useState(day?.title || '');
  const [dayDescription, setDayDescription] = useState(day?.description || '');
  const [topicNotes, setTopicNotes] = useState('Comprehensive notes about today\'s grammar topic...');
  const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [movieUrl, setMovieUrl] = useState('https://www.youtube.com/watch?v=example');
  
  // Assessment states
  const [vocabularyQuestions, setVocabularyQuestions] = useState([
    { id: 1, question: 'What does "excellent" mean?', options: ['Very good', 'Bad', 'Medium', 'Terrible'], correct: 0 },
    { id: 2, question: 'Choose the synonym for "happy":', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correct: 1 }
  ]);
  
  const [topicQuestions, setTopicQuestions] = useState([
    { id: 1, question: 'Which sentence uses present tense correctly?', options: ['I am eating', 'I ate', 'I will eat', 'I have eaten'], correct: 0 },
    { id: 2, question: 'Complete: "She ___ to school every day"', options: ['go', 'goes', 'going', 'gone'], correct: 1 }
  ]);
  
  const [listeningQuestions, setListeningQuestions] = useState([
    { id: 1, question: 'What is the speaker\'s main topic?', options: ['Weather', 'Food', 'Travel', 'Work'], correct: 2 },
    { id: 2, question: 'How many people are mentioned?', options: ['Two', 'Three', 'Four', 'Five'], correct: 1 }
  ]);

  const [writingPrompt, setWritingPrompt] = useState('Write a 150-word essay about your daily routine. Include at least 5 different activities and use present tense verbs correctly.');

  if (!day) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar isLoggedIn={true} userRole="tutor" />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Day Not Found</h1>
            <p className="mt-2 text-gray-600">The requested day could not be found.</p>
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
      title: "Changes Saved",
      description: "All day content has been updated successfully.",
    });
  };

  const addQuestion = (type: 'vocabulary' | 'topic' | 'listening') => {
    const newQuestion = {
      id: Date.now(),
      question: 'New question...',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correct: 0
    };
    
    if (type === 'vocabulary') {
      setVocabularyQuestions([...vocabularyQuestions, newQuestion]);
    } else if (type === 'topic') {
      setTopicQuestions([...topicQuestions, newQuestion]);
    } else {
      setListeningQuestions([...listeningQuestions, newQuestion]);
    }
  };

  const removeQuestion = (type: 'vocabulary' | 'topic' | 'listening', id: number) => {
    if (type === 'vocabulary') {
      setVocabularyQuestions(vocabularyQuestions.filter(q => q.id !== id));
    } else if (type === 'topic') {
      setTopicQuestions(topicQuestions.filter(q => q.id !== id));
    } else {
      setListeningQuestions(listeningQuestions.filter(q => q.id !== id));
    }
  };

  const QuestionEditor = ({ question, onChange, onRemove }: any) => (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <Label>Question</Label>
            <Textarea
              value={question.question}
              onChange={(e) => onChange({ ...question, question: e.target.value })}
              placeholder="Enter your question..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option: string, index: number) => (
              <div key={index} className="space-y-2">
                <Label className="flex items-center gap-2">
                  Option {index + 1}
                  {question.correct === index && (
                    <Badge variant="secondary" className="text-xs">Correct</Badge>
                  )}
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...question.options];
                      newOptions[index] = e.target.value;
                      onChange({ ...question, options: newOptions });
                    }}
                  />
                  <Button
                    size="sm"
                    variant={question.correct === index ? "default" : "outline"}
                    onClick={() => onChange({ ...question, correct: index })}
                  >
                    ✓
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button variant="destructive" size="sm" onClick={onRemove}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Question
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} userRole="tutor" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-blue">Edit Day {day.day_number}</h1>
            <p className="text-gray-600">Manage all learning materials for this day</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-4">
            <Button asChild variant="outline">
              <Link to={`/student/days/${dayId}`} target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Link>
            </Button>
            <Button onClick={handleSave} className="bg-brand-yellow text-brand-blue hover:brightness-95">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="story">Story</TabsTrigger>
            <TabsTrigger value="topic">Topic</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="writing">Writing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Day Information
                </CardTitle>
                <CardDescription>Basic information about this learning day</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Day Title</Label>
                  <Input
                    id="title"
                    value={dayTitle}
                    onChange={(e) => setDayTitle(e.target.value)}
                    placeholder="Enter day title..."
                  />
                </div>
                <div>
                  <Label htmlFor="description">Day Description</Label>
                  <Textarea
                    id="description"
                    value={dayDescription}
                    onChange={(e) => setDayDescription(e.target.value)}
                    placeholder="Brief description of what students will learn..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="story" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Reading Story
                </CardTitle>
                <CardDescription>The main story students will read and analyze</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={storyContent}
                  onChange={(e) => setStoryContent(e.target.value)}
                  placeholder="Enter the story content here..."
                  className="min-h-[300px]"
                />
                <div className="mt-4 flex gap-4">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                  <Button variant="outline" size="sm">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Add Audio Narration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Topic Notes
                </CardTitle>
                <CardDescription>Detailed explanation of today's grammar or vocabulary topic</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={topicNotes}
                  onChange={(e) => setTopicNotes(e.target.value)}
                  placeholder="Enter detailed topic notes..."
                  className="min-h-[200px]"
                />
                <div className="mt-4">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Notes Document
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Topic Video
                </CardTitle>
                <CardDescription>Educational video explaining the topic</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="youtube">YouTube URL</Label>
                  <Input
                    id="youtube"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                {youtubeUrl && (
                  <div className="aspect-video">
                    <iframe
                      src={youtubeUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Movie/Episode
                </CardTitle>
                <CardDescription>Short movie or episode for listening practice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="movie">Movie/Episode URL</Label>
                  <Input
                    id="movie"
                    value={movieUrl}
                    onChange={(e) => setMovieUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                {movieUrl && (
                  <div className="aspect-video">
                    <iframe
                      src={movieUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Audio Materials
                </CardTitle>
                <CardDescription>Listening exercises and audio content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>American Accent Audio</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Upload MP3 file</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Choose File
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>British Accent Audio</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Upload MP3 file</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-6">
            <div className="grid gap-6">
              {/* Vocabulary Assessment */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Vocabulary Assessment</CardTitle>
                      <CardDescription>Test students' understanding of new vocabulary</CardDescription>
                    </div>
                    <Button onClick={() => addQuestion('vocabulary')} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {vocabularyQuestions.map((question, index) => (
                    <QuestionEditor
                      key={question.id}
                      question={question}
                      onChange={(updated: any) => {
                        const newQuestions = [...vocabularyQuestions];
                        newQuestions[index] = updated;
                        setVocabularyQuestions(newQuestions);
                      }}
                      onRemove={() => removeQuestion('vocabulary', question.id)}
                    />
                  ))}
                </CardContent>
              </Card>

              {/* Topic Assessment */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Topic Assessment</CardTitle>
                      <CardDescription>Test students' understanding of today's grammar topic</CardDescription>
                    </div>
                    <Button onClick={() => addQuestion('topic')} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {topicQuestions.map((question, index) => (
                    <QuestionEditor
                      key={question.id}
                      question={question}
                      onChange={(updated: any) => {
                        const newQuestions = [...topicQuestions];
                        newQuestions[index] = updated;
                        setTopicQuestions(newQuestions);
                      }}
                      onRemove={() => removeQuestion('topic', question.id)}
                    />
                  ))}
                </CardContent>
              </Card>

              {/* Listening Assessment */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Listening Assessment</CardTitle>
                      <CardDescription>Test students' listening comprehension</CardDescription>
                    </div>
                    <Button onClick={() => addQuestion('listening')} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {listeningQuestions.map((question, index) => (
                    <QuestionEditor
                      key={question.id}
                      question={question}
                      onChange={(updated: any) => {
                        const newQuestions = [...listeningQuestions];
                        newQuestions[index] = updated;
                        setListeningQuestions(newQuestions);
                      }}
                      onRemove={() => removeQuestion('listening', question.id)}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="writing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Writing Assessment
                </CardTitle>
                <CardDescription>Writing prompt and instructions for students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="prompt">Writing Prompt</Label>
                  <Textarea
                    id="prompt"
                    value={writingPrompt}
                    onChange={(e) => setWritingPrompt(e.target.value)}
                    placeholder="Enter the writing prompt and instructions..."
                    className="min-h-[150px]"
                  />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Word Count</Label>
                    <Input placeholder="e.g., 150-200 words" />
                  </div>
                  <div>
                    <Label>Time Limit</Label>
                    <Input placeholder="e.g., 30 minutes" />
                  </div>
                  <div>
                    <Label>Assessment Type</Label>
                    <Input placeholder="e.g., Creative Writing" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Let's Do It English. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DayEditor;
