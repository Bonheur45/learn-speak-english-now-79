import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Plus, Trash2, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getCurriculumDay, updateCurriculumDay } from '@/services/curriculum';

interface VocabularyQuestion {
  id?: string;
  question: string;        // UI prompt
  options: string[];       // UI choices
  correctAnswer: number;   // UI index
  type: 'multiple-choice' | 'fill-blank';
}

const createEmptyQuestion = (index:number): VocabularyQuestion => ({
  id: Date.now().toString()+index,
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  type: 'multiple-choice',
});

const VocabularyQuestionEditor = () => {
  const { curriculumId, trimesterId, dayId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<VocabularyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [dayData, setDayData] = useState<any | null>(null);

  useEffect(() => {
    if (!dayId) return;
    getCurriculumDay(dayId)
      .then((day) => {
        setDayData(day);
        const mapped = (day.vocabulary_questions || []).map((q: any) => ({
          id: q.id,
          question: q.prompt,
          options: q.choices,
          correctAnswer: q.correct_answer_index,
          type: q.type ?? 'multiple-choice',
        }));
        setQuestions(mapped);
      })
      .catch((err) => {
        console.error(err);
        toast({ title: 'Error', description: 'Failed to load questions', variant: 'destructive' });
      })
      .finally(() => setLoading(false));
  }, [dayId]);

  const addQuestion = () => {
    setQuestions(prev => [...prev, createEmptyQuestion(prev.length)]);
  };

  const addOption = (questionId: string) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, options: [...q.options, ''] } : q));
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
        : q
    ));
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleSave = async () => {
    if (!dayId) return;
    try {
      const apiPayload = questions.map((q) => ({
        id: q.id,
        prompt: q.question,
        choices: q.options,
        correct_answer_index: q.correctAnswer,
        type: q.type,
      }));
      if (!dayData) return;
      await updateCurriculumDay(dayId, {
        ...dayData,
        vocabulary_questions: apiPayload,
      });
      toast({ title: 'Saved', description: 'Vocabulary questions updated.' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} userRole="tutor" />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/tutor/materials" className="hover:text-brand-blue">Materials</Link>
            <span>/</span>
            <Link to={`/tutor/curriculum/${curriculumId}/trimester/${trimesterId}/day/${dayId}/edit`} className="hover:text-brand-blue">Day Editor</Link>
            <span>/</span>
            <span className="font-medium">Vocabulary Questions</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-brand-blue">Vocabulary & Comprehension Questions</h1>
              <p className="text-gray-600 mt-1">Configure questions to test vocabulary and reading comprehension</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm">
                <Link to={`/tutor/curriculum/${curriculumId}/trimester/${trimesterId}/day/${dayId}/edit`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Editor
                </Link>
              </Button>
              <Button onClick={addQuestion} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
              <Button onClick={handleSave} className="bg-brand-yellow text-brand-blue hover:brightness-95">
                <Save className="h-4 w-4 mr-2" />
                Save Questions
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{question.type}</Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`question-${question.id}`}>Question Text</Label>
                  <Input
                    id={`question-${question.id}`}
                    value={question.question}
                    onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                    placeholder="Enter your question..."
                  />
                </div>
                
                <div>
                  <Label>Answer Options</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={question.correctAnswer === optionIndex}
                          onChange={() => updateQuestion(question.id, 'correctAnswer', optionIndex)}
                          className="mt-1"
                        />
                        <Input
                          value={option}
                          onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1"
                        />
                      </div>
                    ))}
                    {question.options.length < 6 && (
                      <Button type="button" size="sm" variant="outline" onClick={() => addOption(question.id)}>
                        <Plus className="h-4 w-4 mr-1" /> Add Option
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Select the radio button next to the correct answer</p>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {questions.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">No questions created yet.</p>
                <Button onClick={addQuestion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Question
                </Button>
              </CardContent>
            </Card>
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

export default VocabularyQuestionEditor;
