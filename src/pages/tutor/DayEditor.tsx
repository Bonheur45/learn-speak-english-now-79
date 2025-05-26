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
  Save,
  Eye,
  Plus,
  Trash2,
  Volume2,
  Edit3,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { MOCK_TRIMESTERS } from '@/lib/types';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

const DayEditor = () => {
  const { dayId } = useParams();
  
  // Find the day and its context from mock data
  const day = MOCK_TRIMESTERS.flatMap(t => t.days).find(d => d.id === dayId);
  const trimester = MOCK_TRIMESTERS.find(t => t.days.some(d => d.id === dayId));
  
  // Basic day information
  const [dayTitle, setDayTitle] = useState(day?.title || '');
  const [dayDescription, setDayDescription] = useState(day?.description || '');
  
  // Content states
  const [storyContent, setStoryContent] = useState(day?.story_text || '');
  const [topicNotes, setTopicNotes] = useState('Today we will learn about present tense verbs. Present tense describes actions happening now or habitual actions...');
  const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [movieUrl, setMovieUrl] = useState('');
  
  // Assessment states
  const [vocabularyQuestions, setVocabularyQuestions] = useState<Question[]>([
    { id: 1, question: 'What does "excellent" mean?', options: ['Very good', 'Bad', 'Medium', 'Terrible'], correct: 0 },
    { id: 2, question: 'Choose the synonym for "happy":', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correct: 1 }
  ]);
  
  const [grammarQuestions, setGrammarQuestions] = useState<Question[]>([
    { id: 1, question: 'Which sentence uses present tense correctly?', options: ['I am eating', 'I ate', 'I will eat', 'I have eaten'], correct: 0 },
    { id: 2, question: 'Complete: "She ___ to school every day"', options: ['go', 'goes', 'going', 'gone'], correct: 1 }
  ]);
  
  const [listeningQuestions, setListeningQuestions] = useState<Question[]>([
    { id: 1, question: 'What is the speaker\'s main topic?', options: ['Weather', 'Food', 'Travel', 'Work'], correct: 2 },
    { id: 2, question: 'How many people are mentioned?', options: ['Two', 'Three', 'Four', 'Five'], correct: 1 }
  ]);

  const [writingPrompt, setWritingPrompt] = useState('Write a 150-word essay about your daily routine. Include at least 5 different activities and use present tense verbs correctly.');
  const [writingWordCount, setWritingWordCount] = useState('150-200');
  const [writingTimeLimit, setWritingTimeLimit] = useState('30 minutes');

  if (!day || !trimester) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar isLoggedIn={true} userRole="tutor" />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Content Not Found</h1>
            <p className="mt-2 text-gray-600">The requested day content could not be found.</p>
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
      title: "Content Saved Successfully",
      description: `All content for Day ${day.day_number} has been updated.`,
    });
  };

  const addQuestion = (type: 'vocabulary' | 'grammar' | 'listening') => {
    const newQuestion: Question = {
      id: Date.now(),
      question: 'Enter your question here...',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct: 0
    };
    
    if (type === 'vocabulary') {
      setVocabularyQuestions([...vocabularyQuestions, newQuestion]);
    } else if (type === 'grammar') {
      setGrammarQuestions([...grammarQuestions, newQuestion]);
    } else {
      setListeningQuestions([...listeningQuestions, newQuestion]);
    }
  };

  const removeQuestion = (type: 'vocabulary' | 'grammar' | 'listening', id: number) => {
    if (type === 'vocabulary') {
      setVocabularyQuestions(vocabularyQuestions.filter(q => q.id !== id));
    } else if (type === 'grammar') {
      setGrammarQuestions(grammarQuestions.filter(q => q.id !== id));
    } else {
      setListeningQuestions(listeningQuestions.filter(q => q.id !== id));
    }
  };

  const updateQuestion = (type: 'vocabulary' | 'grammar' | 'listening', index: number, updated: Question) => {
    if (type === 'vocabulary') {
      const newQuestions = [...vocabularyQuestions];
      newQuestions[index] = updated;
      setVocabularyQuestions(newQuestions);
    } else if (type === 'grammar') {
      const newQuestions = [...grammarQuestions];
      newQuestions[index] = updated;
      setGrammarQuestions(newQuestions);
    } else {
      const newQuestions = [...listeningQuestions];
      newQuestions[index] = updated;
      setListeningQuestions(newQuestions);
    }
  };

  const QuestionEditor = ({ question, onChange, onRemove }: {
    question: Question;
    onChange: (updated: Question) => void;
    onRemove: () => void;
  }) => (
    <Card className="mb-4 border-l-4 border-l-blue-500">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Question</Label>
            <Textarea
              value={question.question}
              onChange={(e) => onChange({ ...question, question: e.target.value })}
              placeholder="Enter your question..."
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option: string, index: number) => (
              <div key={index} className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  Option {String.fromCharCode(65 + index)}
                  {question.correct === index && (
                    <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Correct
                    </Badge>
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
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  />
                  <Button
                    size="sm"
                    variant={question.correct === index ? "default" : "outline"}
                    onClick={() => onChange({ ...question, correct: index })}
                    className="shrink-0"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end pt-2 border-t">
            <Button variant="destructive" size="sm" onClick={onRemove}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
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
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/tutor/materials" className="hover:text-brand-blue">Materials</Link>
            <span>/</span>
            <span className="font-medium">{trimester.name}</span>
            <span>/</span>
            <span className="font-medium text-brand-blue">Day {day.day_number}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-brand-blue">Edit Day {day.day_number}</h1>
              <p className="text-gray-600 mt-1">{trimester.name} • Manage lesson content and assessments</p>
            </div>
            
            <div className="flex gap-3">
              <Button asChild variant="outline" size="sm">
                <Link to="/tutor/materials">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Materials
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to={`/student/days/${dayId}`} target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Link>
              </Button>
              <Button onClick={handleSave} className="bg-brand-yellow text-brand-blue hover:brightness-95">
                <Save className="h-4 w-4 mr-2" />
                Save All Changes
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 h-12 bg-white border">
            <TabsTrigger value="overview" className="text-sm font-medium">Overview</TabsTrigger>
            <TabsTrigger value="content" className="text-sm font-medium">Reading & Notes</TabsTrigger>
            <TabsTrigger value="media" className="text-sm font-medium">Video Content</TabsTrigger>
            <TabsTrigger value="assessments" className="text-sm font-medium">Assessments</TabsTrigger>
            <TabsTrigger value="writing" className="text-sm font-medium">Writing Task</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Lesson Information
                </CardTitle>
                <CardDescription>Basic information and learning objectives for this day</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Lesson Title</Label>
                      <Input
                        id="title"
                        value={dayTitle}
                        onChange={(e) => setDayTitle(e.target.value)}
                        placeholder="Enter lesson title..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Lesson Description</Label>
                      <Textarea
                        id="description"
                        value={dayDescription}
                        onChange={(e) => setDayDescription(e.target.value)}
                        placeholder="Brief description of what students will learn..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Lesson Context</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Trimester:</span> {trimester.name}</p>
                      <p><span className="font-medium">Day Number:</span> {day.day_number}</p>
                      <p><span className="font-medium">Current Status:</span> <Badge variant="secondary">Draft</Badge></p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Reading Story
                </CardTitle>
                <CardDescription>The main story students will read and analyze</CardDescription>
              </CardHeader>
              <CardContent>
                <Label className="text-sm font-medium">Story Content</Label>
                <Textarea
                  value={storyContent}
                  onChange={(e) => setStoryContent(e.target.value)}
                  placeholder="Enter the story content here..."
                  className="min-h-[300px] mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Grammar/Topic Notes
                </CardTitle>
                <CardDescription>Detailed explanation of today's grammar or vocabulary topic</CardDescription>
              </CardHeader>
              <CardContent>
                <Label className="text-sm font-medium">Topic Explanation</Label>
                <Textarea
                  value={topicNotes}
                  onChange={(e) => setTopicNotes(e.target.value)}
                  placeholder="Enter detailed topic notes and explanations..."
                  className="min-h-[250px] mt-2"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Educational Video
                </CardTitle>
                <CardDescription>YouTube video explaining today's topic</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="youtube">YouTube URL</Label>
                  <Input
                    id="youtube"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="mt-1"
                  />
                </div>
                {youtubeUrl && youtubeUrl.includes('youtube.com/watch') && (
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={youtubeUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                      title="Educational Video"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Short Movie/Episode
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
                    className="mt-1"
                  />
                </div>
                {movieUrl && movieUrl.includes('youtube.com/watch') && (
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={movieUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                      title="Movie/Episode"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-6 mt-8">
            {/* Vocabulary Assessment */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Vocabulary Assessment</CardTitle>
                    <CardDescription>Test students' understanding of new vocabulary words</CardDescription>
                  </div>
                  <Button onClick={() => addQuestion('vocabulary')} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vocabularyQuestions.map((question, index) => (
                    <QuestionEditor
                      key={question.id}
                      question={question}
                      onChange={(updated) => updateQuestion('vocabulary', index, updated)}
                      onRemove={() => removeQuestion('vocabulary', question.id)}
                    />
                  ))}
                  {vocabularyQuestions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No vocabulary questions added yet.</p>
                      <Button onClick={() => addQuestion('vocabulary')} size="sm" className="mt-2">
                        Add First Question
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Grammar Assessment */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Grammar Assessment</CardTitle>
                    <CardDescription>Test students' understanding of today's grammar topic</CardDescription>
                  </div>
                  <Button onClick={() => addQuestion('grammar')} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {grammarQuestions.map((question, index) => (
                    <QuestionEditor
                      key={question.id}
                      question={question}
                      onChange={(updated) => updateQuestion('grammar', index, updated)}
                      onRemove={() => removeQuestion('grammar', question.id)}
                    />
                  ))}
                  {grammarQuestions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No grammar questions added yet.</p>
                      <Button onClick={() => addQuestion('grammar')} size="sm" className="mt-2">
                        Add First Question
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Listening Assessment */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Listening Assessment</CardTitle>
                    <CardDescription>Test students' listening comprehension skills</CardDescription>
                  </div>
                  <Button onClick={() => addQuestion('listening')} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {listeningQuestions.map((question, index) => (
                    <QuestionEditor
                      key={question.id}
                      question={question}
                      onChange={(updated) => updateQuestion('listening', index, updated)}
                      onRemove={() => removeQuestion('listening', question.id)}
                    />
                  ))}
                  {listeningQuestions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No listening questions added yet.</p>
                      <Button onClick={() => addQuestion('listening')} size="sm" className="mt-2">
                        Add First Question
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="writing" className="space-y-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Writing Assignment
                </CardTitle>
                <CardDescription>Writing prompt and instructions for students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="prompt" className="text-sm font-medium">Writing Prompt</Label>
                  <Textarea
                    id="prompt"
                    value={writingPrompt}
                    onChange={(e) => setWritingPrompt(e.target.value)}
                    placeholder="Enter the writing prompt and detailed instructions..."
                    className="min-h-[150px] mt-2"
                  />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="wordcount" className="text-sm font-medium">Expected Word Count</Label>
                    <Input
                      id="wordcount"
                      value={writingWordCount}
                      onChange={(e) => setWritingWordCount(e.target.value)}
                      placeholder="e.g., 150-200 words"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timelimit" className="text-sm font-medium">Time Limit</Label>
                    <Input
                      id="timelimit"
                      value={writingTimeLimit}
                      onChange={(e) => setWritingTimeLimit(e.target.value)}
                      placeholder="e.g., 30 minutes"
                      className="mt-1"
                    />
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
