import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Calendar, FileText, BookOpen, Play, Plus, Trash2, TestTube } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { toast } from '@/hooks/use-toast';

interface VocabularyQuestion {
  id?: string;
  question: string;
  options: string[];
  correct_answer_index: number;
  type?: string;
}

interface TopicQuestion {
  id?: string;
  question: string;
  options: string[];
  correct_answer_index: number;
  explanation: string;
}

interface WritingPrompt {
  id?: string;
  prompt: string;
  instructions: string;
  example: string;
}

interface DayData {
  id: string;
  day_number: number;
  title: string;
  description: string;
  story_text: string;
  topic_notes: string;
  british_audio_url: string;
  american_audio_url: string;

  vocabulary_questions?: VocabularyQuestion[];
  topic_questions?: TopicQuestion[];
  writing_prompts?: WritingPrompt[];
  glossary_terms?: GlossaryTerm[];
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
  
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>(
    (day.glossary_terms && day.glossary_terms.length > 0)
      ? day.glossary_terms
      : []
  );

  // Question/Prompt state (inline editors)
  const [vocabularyQuestions, setVocabularyQuestions] = useState<VocabularyQuestion[]>(
    Array.isArray(day.vocabulary_questions)
      ? day.vocabulary_questions.map((q) => ({
          id: q.id ?? Date.now().toString(),
          question: (q as any).question ?? (q as any).prompt ?? '',
          options: (q as any).options ?? (q as any).choices ?? [],
          correct_answer_index: (q as any).correct_answer_index ?? (q as any).correct_index ?? 0,
          type: (q as any).type ?? 'multiple-choice',
        }))
      : []
  );

  const [topicQuestions, setTopicQuestions] = useState<TopicQuestion[]>(
    Array.isArray(day.topic_questions)
      ? day.topic_questions.map((tq) => ({
          id: tq.id ?? Date.now().toString(),
          question: (tq as any).question ?? (tq as any).prompt ?? '',
          options: (tq as any).options ?? [],
          correct_answer_index: (tq as any).correct_answer_index ?? (tq as any).correct_index ?? 0,
          explanation: (tq as any).explanation ?? (tq as any).answer ?? '',
        }))
      : []
  );

  const [writingPrompts, setWritingPrompts] = useState<WritingPrompt[]>(
    Array.isArray(day.writing_prompts)
      ? day.writing_prompts.map((wp) => ({
          id: wp.id ?? Date.now().toString(),
          prompt: wp.prompt ?? '',
          instructions: (wp as any).instructions ?? '',
          example: (wp as any).example ?? '',
        }))
      : []
  );

  const handleSave = () => {
    const updated = {
      ...dayData,
      glossary_terms: glossaryTerms,
      vocabulary_questions: vocabularyQuestions,
      topic_questions: topicQuestions,
      writing_prompts: writingPrompts,
    } as any;
    onSave(updated);
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

  // ----- Vocabulary Question helpers -----
  const createEmptyVocabQuestion = (): VocabularyQuestion => ({
    id: Date.now().toString(),
    question: '',
    options: ['', '', '', ''],
    correct_answer_index: 0,
  });

  const addVocabQuestion = () => setVocabularyQuestions(prev => [...prev, createEmptyVocabQuestion()]);

  const updateVocabQuestion = (id: string, field: keyof VocabularyQuestion, value: any) => {
    setVocabularyQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateVocabChoice = (questionId: string, optionIndex: number, value: string) => {
    setVocabularyQuestions(prev => prev.map(q =>
      q.id === questionId
        ? { ...q, options: (q.options ?? []).map((c, idx) => idx === optionIndex ? value : c) }
        : q
    ));
  };

  const deleteVocabQuestion = (id: string) => setVocabularyQuestions(prev => prev.filter(q => q.id !== id));

  // ----- Topic Question helpers -----
  const createEmptyTopicQuestion = (): TopicQuestion => ({
    id: Date.now().toString(),
    question: '',
    options: [],
    correct_answer_index: 0,
    explanation: '',
  });

  const addTopicQuestion = () => setTopicQuestions(prev => [...prev, createEmptyTopicQuestion()]);

  const updateTopicQuestion = (id: string, field: keyof TopicQuestion, value: any) => {
    setTopicQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateTopicOption = (questionId: string, optionIndex: number, value: string) => {
    setTopicQuestions(prev => prev.map(q =>
      q.id === questionId
        ? { ...q, options: (q.options ?? []).map((opt, idx) => idx === optionIndex ? value : opt) }
        : q
    ));
  };

  const addTopicOption = (questionId: string) => {
    setTopicQuestions(prev => prev.map(q =>
      q.id === questionId
        ? { ...q, options: [...q.options, ''] }
        : q
    ));
  };

  const deleteTopicQuestion = (id: string) => setTopicQuestions(prev => prev.filter(q => q.id !== id));

  // ----- Writing Prompt helpers -----
  const createEmptyWritingPrompt = (): WritingPrompt => ({
    id: Date.now().toString(),
    prompt: '',
    instructions: '',
    example: '',
  });

  const addWritingPrompt = () => setWritingPrompts(prev => [...prev, createEmptyWritingPrompt()]);

  const updateWritingPrompt = (id: string, field: keyof WritingPrompt, value: string) => {
    setWritingPrompts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const deleteWritingPrompt = (id: string) => setWritingPrompts(prev => prev.filter(p => p.id !== id));

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
          <Tabs defaultValue="vocabulary" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              <TabsTrigger value="vocabulary" className="data-[state=active]:bg-white">Vocabulary</TabsTrigger>
              <TabsTrigger value="topic" className="data-[state=active]:bg-white">Topic</TabsTrigger>
              <TabsTrigger value="writing" className="data-[state=active]:bg-white">Writing</TabsTrigger>
            </TabsList>

            {/* Vocabulary Questions */}
            <TabsContent value="vocabulary">
              <Card className="mt-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Vocabulary & Comprehension Questions</CardTitle>
                      <p className="text-sm text-gray-600">Configure questions to test vocabulary and comprehension</p>
                    </div>
                    <Button onClick={addVocabQuestion} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" /> Add Question
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {vocabularyQuestions.map((question, index) => (
                    <Card key={question.id} className="border border-gray-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{question.type || 'multiple-choice'}</Badge>
                            <Button variant="outline" size="sm" onClick={() => deleteVocabQuestion(question.id!)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Question Text</Label>
                          <Input
                            value={question.question}
                            onChange={(e) => updateVocabQuestion(question.id!, 'question', e.target.value)}
                            placeholder="Enter your question..."
                          />
                        </div>

                        <div>
                          <Label>Answer Options</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                            {(question.options ?? []).map((option, cIdx) => (
                              <div key={cIdx} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`vocab-correct-${question.id}`}
                                  checked={question.correct_answer_index === cIdx}
                                  onChange={() => updateVocabQuestion(question.id!, 'correct_answer_index', cIdx)}
                                  className="mt-1"
                                />
                                <Input
                                  value={option}
                                  onChange={(e) => updateVocabChoice(question.id!, cIdx, e.target.value)}
                                  placeholder={`Option ${cIdx + 1}`}
                                  className="flex-1"
                                />
                              </div>
                            ))}
                            {(question.options?.length ?? 0) < 6 && (
                              <Button type="button" size="sm" variant="outline" onClick={() => updateVocabQuestion(question.id!, 'options', [...(question.options ?? []), ''])}>
                                <Plus className="h-4 w-4 mr-1" /> Add Option
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Select the radio button next to the correct answer</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {vocabularyQuestions.length === 0 && (
                    <p className="text-gray-500 text-sm">No vocabulary questions yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Topic Questions */}
            <TabsContent value="topic">
              <Card className="mt-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Topic / Grammar Questions</CardTitle>
                      <p className="text-sm text-gray-600">Configure questions to test grammar understanding</p>
                    </div>
                    <Button onClick={addTopicQuestion} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" /> Add Question
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {topicQuestions.map((question, index) => (
                    <Card key={question.id} className="border border-gray-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                          <Button variant="outline" size="sm" onClick={() => deleteTopicQuestion(question.id!)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Question Text</Label>
                          <Input
                            value={question.question}
                            onChange={(e) => updateTopicQuestion(question.id!, 'question', e.target.value)}
                            placeholder="Enter your question..."
                          />
                        </div>
                        <div>
                          <Label>Answer Options</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                            {question.options.map((option, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`topic-correct-${question.id}`}
                                  checked={question.correct_answer_index === oIdx}
                                  onChange={() => updateTopicQuestion(question.id!, 'correct_answer_index', oIdx)}
                                  className="mt-1"
                                />
                                <Input
                                  value={option}
                                  onChange={(e) => updateTopicOption(question.id!, oIdx, e.target.value)}
                                  placeholder={`Option ${oIdx + 1}`}
                                  className="flex-1"
                                />
                              </div>
                            ))}
                            {(question.options?.length ?? 0) < 6 && (
                              <Button type="button" size="sm" variant="outline" onClick={() => addTopicOption(question.id!)}>
                                <Plus className="h-4 w-4 mr-1" /> Add Option
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Select the radio button next to the correct option</p>
                        </div>

                        <div className="mt-4">
                          <Label>Explanation (Optional)</Label>
                          <Input
                            value={question.explanation}
                            onChange={(e) => updateTopicQuestion(question.id!, 'explanation', e.target.value)}
                            placeholder="Explain why this answer is correct..."
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {topicQuestions.length === 0 && (
                    <p className="text-gray-500 text-sm">No topic questions yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Writing Prompts */}
            <TabsContent value="writing">
              <Card className="mt-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Writing Prompts</CardTitle>
                      <p className="text-sm text-gray-600">Configure creative writing assignments</p>
                    </div>
                    <Button onClick={addWritingPrompt} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" /> Add Prompt
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {writingPrompts.map((prompt) => (
                    <Card key={prompt.id} className="border border-gray-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Prompt</CardTitle>
                          <Button variant="outline" size="sm" onClick={() => deleteWritingPrompt(prompt.id!)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label>Prompt</Label>
                            <Textarea
                              value={prompt.prompt}
                              onChange={(e) => updateWritingPrompt(prompt.id!, 'prompt', e.target.value)}
                              placeholder="Enter the writing prompt..."
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label>Instructions</Label>
                            <Textarea
                              value={prompt.instructions}
                              onChange={(e) => updateWritingPrompt(prompt.id!, 'instructions', e.target.value)}
                              placeholder="Add any specific instructions for students..."
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label>Example (Optional)</Label>
                            <Textarea
                              value={prompt.example}
                              onChange={(e) => updateWritingPrompt(prompt.id!, 'example', e.target.value)}
                              placeholder="Provide an example answer (optional)..."
                              rows={2}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {writingPrompts.length === 0 && (
                    <p className="text-gray-500 text-sm">No writing prompts yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DayContentEditor;
