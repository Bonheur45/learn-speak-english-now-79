
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface WritingPrompt {
  id: string;
  title: string;
  prompt: string;
  instructions: string;
  minWords: number;
  maxWords: number;
}

const WritingPromptEditor = () => {
  const { cohortId, trimesterId, dayId } = useParams();
  const navigate = useNavigate();
  
  const [prompts, setPrompts] = useState<WritingPrompt[]>([
    {
      id: '1',
      title: 'Daily Routine Essay',
      prompt: 'Write about your daily routine using present tense verbs. Describe what you do from morning to evening.',
      instructions: 'Use at least 5 present tense verbs. Include time expressions like "every morning", "usually", "always".',
      minWords: 100,
      maxWords: 200
    }
  ]);

  const addPrompt = () => {
    const newPrompt: WritingPrompt = {
      id: Date.now().toString(),
      title: '',
      prompt: '',
      instructions: '',
      minWords: 50,
      maxWords: 150
    };
    setPrompts(prev => [...prev, newPrompt]);
  };

  const updatePrompt = (id: string, field: string, value: any) => {
    setPrompts(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const removePrompt = (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  };

  const handleSave = () => {
    toast({
      title: "Prompts Saved",
      description: "Writing prompts have been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} userRole="tutor" />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/tutor/materials" className="hover:text-brand-blue">Materials</Link>
            <span>/</span>
            <Link to={`/tutor/materials/cohort/${cohortId}/trimester/${trimesterId}/day/${dayId}/edit`} className="hover:text-brand-blue">Day Editor</Link>
            <span>/</span>
            <span className="font-medium">Writing Prompts</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-brand-blue">Writing Assessment Prompts</h1>
              <p className="text-gray-600 mt-1">Configure creative writing assignments and prompts</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm">
                <Link to={`/tutor/materials/cohort/${cohortId}/trimester/${trimesterId}/day/${dayId}/edit`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Editor
                </Link>
              </Button>
              <Button onClick={addPrompt} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Prompt
              </Button>
              <Button onClick={handleSave} className="bg-brand-yellow text-brand-blue hover:brightness-95">
                <Save className="h-4 w-4 mr-2" />
                Save Prompts
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {prompts.map((prompt, index) => (
            <Card key={prompt.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Writing Prompt {index + 1}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Creative Writing</Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removePrompt(prompt.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`title-${prompt.id}`}>Prompt Title</Label>
                  <Input
                    id={`title-${prompt.id}`}
                    value={prompt.title}
                    onChange={(e) => updatePrompt(prompt.id, 'title', e.target.value)}
                    placeholder="Enter prompt title..."
                  />
                </div>
                
                <div>
                  <Label htmlFor={`prompt-${prompt.id}`}>Writing Prompt</Label>
                  <Textarea
                    id={`prompt-${prompt.id}`}
                    value={prompt.prompt}
                    onChange={(e) => updatePrompt(prompt.id, 'prompt', e.target.value)}
                    placeholder="Enter the writing prompt or topic..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor={`instructions-${prompt.id}`}>Instructions</Label>
                  <Textarea
                    id={`instructions-${prompt.id}`}
                    value={prompt.instructions}
                    onChange={(e) => updatePrompt(prompt.id, 'instructions', e.target.value)}
                    placeholder="Enter specific instructions for students..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`minWords-${prompt.id}`}>Minimum Words</Label>
                    <Input
                      id={`minWords-${prompt.id}`}
                      type="number"
                      value={prompt.minWords}
                      onChange={(e) => updatePrompt(prompt.id, 'minWords', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`maxWords-${prompt.id}`}>Maximum Words</Label>
                    <Input
                      id={`maxWords-${prompt.id}`}
                      type="number"
                      value={prompt.maxWords}
                      onChange={(e) => updatePrompt(prompt.id, 'maxWords', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {prompts.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">No writing prompts created yet.</p>
                <Button onClick={addPrompt}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Prompt
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

export default WritingPromptEditor;
