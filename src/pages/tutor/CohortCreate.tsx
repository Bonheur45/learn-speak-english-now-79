import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const CohortCreate: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [proficiency, setProficiency] = useState<'A1'|'A2'|'B1'|'B2'|'C1'|'C2'>('A1');
  const [curricula, setCurricula] = useState<any[]>([]);
  const [curriculumId, setCurriculumId] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxStudents, setMaxStudents] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurricula = async () => {
      try {
        const data = await api.curriculum.getCurriculumTemplates(0, 1000);
        setCurricula(data);
      } catch (err) {
        console.error('Failed to load curricula', err);
      }
    };
    fetchCurricula();
  }, []);

  const handleCreate = async () => {
    try {
      await api.cohorts.createCohort({
        name,
        description,
        proficiency_level: proficiency,
        curriculum_id: curriculumId,
        start_date: startDate,
        end_date: endDate,
        max_students: maxStudents,
      });
      navigate('/tutor/cohorts');
    } catch (err) {
      console.error('Failed to create cohort', err);
      alert('Failed to create cohort');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn userRole="tutor" />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Cohort</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
              <Label>Proficiency Level</Label>
              <Select value={proficiency} onValueChange={(v) => setProficiency(v as any)}>
                <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  {['A1','A2','B1','B2','C1','C2'].map(l => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Curriculum Template</Label>
              <Select value={curriculumId} onValueChange={(v) => setCurriculumId(v)}>
                <SelectTrigger><SelectValue placeholder="Select curriculum" /></SelectTrigger>
                <SelectContent>
                  {curricula.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="start">Start Date</Label>
              <Input type="date" id="start" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="end">End Date</Label>
              <Input type="date" id="end" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="maxStudents">Max Students</Label>
              <Input type="number" id="maxStudents" value={maxStudents} onChange={(e) => setMaxStudents(Number(e.target.value))} />
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={()=>navigate(-1)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Cohort</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default CohortCreate; 