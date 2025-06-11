import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const CurriculumCreate: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetLevel, setTargetLevel] = useState<'A1'|'A2'|'B1'|'B2'|'C1'|'C2'>('A1');
  const [durationWeeks, setDurationWeeks] = useState(12);
  const [maxStudents, setMaxStudents] = useState(20);
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      await api.curriculum.createCurriculumTemplate({
        name,
        description,
        target_level: targetLevel,
        duration_weeks: durationWeeks,
        max_students: maxStudents,
      });
      navigate('/tutor/curriculum');
    } catch (err) {
      console.error('Failed to create curriculum', err);
      alert('Creation failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn userRole="tutor" />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Create Curriculum Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={description} onChange={(e)=>setDescription(e.target.value)} />
            </div>
            <div>
              <Label>Target Level</Label>
              <Select value={targetLevel} onValueChange={(v)=>setTargetLevel(v as any)}>
                <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  {['A1','A2','B1','B2','C1','C2'].map(l=>(<SelectItem key={l} value={l}>{l}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Duration (weeks)</Label>
              <Input type="number" value={durationWeeks} onChange={(e)=>setDurationWeeks(Number(e.target.value))} />
            </div>
            <div>
              <Label>Max Students</Label>
              <Input type="number" value={maxStudents} onChange={(e)=>setMaxStudents(Number(e.target.value))} />
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={()=>navigate(-1)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Template</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default CurriculumCreate; 