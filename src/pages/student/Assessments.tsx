import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { getMe, getMyProgress, getCohortDays } from '@/services/student';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileCheck } from 'lucide-react';

interface AssessmentRow {
  id: string;
  dayNumber: number;
  title: string;
  date: string;
  vocabularyLevel?: string;
  writingLevel?: string;
  score?: number; // topic / overall score
}

const cefrToPercent = (level?: string): number => {
  switch (level) {
    case 'A1':
    case 'A1-A2':
      return 20;
    case 'A2':
      return 35;
    case 'B1':
    case 'B1-B2':
      return 55;
    case 'B2':
      return 70;
    case 'C1':
      return 85;
    case 'C2':
    case 'C1-C2':
      return 100;
    default:
      return 0;
  }
};

const Assessments = () => {
  const [rows, setRows] = useState<AssessmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        const cohortId = me.cohort_id || me.enrollments?.[0]?.cohort_id;
        if (!cohortId) {
          setRows([]);
          return;
        }

        const [days, progress] = await Promise.all([
          getCohortDays(cohortId),
          getMyProgress(me.id, cohortId),
        ]);

        // Build table rows
        const mapped: AssessmentRow[] = progress.map((p: any) => {
          const dayInfo = days.find((d: any) => d.id === p.day.id) || p.day;
          return {
            id: p.id,
            dayNumber: dayInfo.number || dayInfo.day_number || dayInfo.id,
            title: dayInfo.title || `Day ${dayInfo.id}`,
            date: new Date(p.last_updated || p.day.date || dayInfo.date).toLocaleDateString(),
            vocabularyLevel: p.vocabulary_level,
            writingLevel: p.writing_level,
            score: p.score,
          };
        });

        setRows(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Navbar isLoggedIn={true} userRole="student" />
    );
  }

  if (rows.length === 0) {
    return (
      <>
        <Navbar isLoggedIn={true} userRole="student" />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">No assessments yet.</h1>
        </main>
      </>
    );
  }

  // Averages
  const avgVocab = rows.reduce((s, r) => s + cefrToPercent(r.vocabularyLevel), 0) / rows.length;
  const avgWriting = rows.reduce((s, r) => s + cefrToPercent(r.writingLevel), 0) / rows.length;
  const avgTopic = rows.reduce((s, r) => s + (r.score ?? 0), 0) / rows.length;
  const overall = (avgVocab + avgWriting + avgTopic) / 3;

  const radial = (val: number) => `${val * 2.83} 283`;

  return (
    <>
      <Navbar isLoggedIn={true} userRole="student" />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Assessment Scores</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-t-4 border-t-blue-500">
            <CardHeader>
              <CardTitle>Vocabulary Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="relative w-16 h-16 mr-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#e5e5e5" 
                      strokeWidth="10"
                    />
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="10" 
                      strokeDasharray={radial(avgVocab)} 
                      strokeDashoffset="0" 
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
                <p className="text-4xl font-bold text-blue-600">{avgVocab.toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-green-500">
            <CardHeader>
              <CardTitle>Topic Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="relative w-16 h-16 mr-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#e5e5e5" 
                      strokeWidth="10"
                    />
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#22c55e" 
                      strokeWidth="10" 
                      strokeDasharray={radial(avgTopic)} 
                      strokeDashoffset="0" 
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
                <p className="text-4xl font-bold text-green-600">{avgTopic.toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-amber-500">
            <CardHeader>
              <CardTitle>Writing Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="relative w-16 h-16 mr-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#e5e5e5" 
                      strokeWidth="10"
                    />
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#f59e0b" 
                      strokeWidth="10" 
                      strokeDasharray={radial(avgWriting)} 
                      strokeDashoffset="0" 
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
                <p className="text-4xl font-bold text-amber-600">{avgWriting.toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-purple-500">
            <CardHeader>
              <CardTitle>Overall Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="relative w-16 h-16 mr-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#e5e5e5" 
                      strokeWidth="10"
                    />
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#8b5cf6" 
                      strokeWidth="10" 
                      strokeDasharray={radial(overall)} 
                      strokeDashoffset="0" 
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
                <p className="text-4xl font-bold text-purple-600">{overall.toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Assessment History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Day</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Vocabulary</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Writing</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id} className="border-b last:border-0">
                    <TableCell className="font-medium">Day {r.dayNumber}</TableCell>
                    <TableCell>{r.title}</TableCell>
                    <TableCell>{cefrToPercent(r.vocabularyLevel)}%</TableCell>
                    <TableCell>{r.score ?? '—'}%</TableCell>
                    <TableCell>{cefrToPercent(r.writingLevel)}%</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600" 
                        asChild
                      >
                        <Link to={`/student/days/${r.dayNumber}`}>
                          View Day <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold">Upcoming Assessments</h2>
          
          <Card className="p-6 flex items-start gap-4">
            <div className="p-2 rounded-full bg-blue-100">
              <FileCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Day 5 - Past Tenses</h3>
                  <p className="text-gray-500">Available from May 20, 2025</p>
                </div>
                <Button asChild className="bg-yellow-400 text-blue-900 hover:bg-yellow-500">
                  <Link to="/student/days/5">
                    View Content
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 flex items-start gap-4">
            <div className="p-2 rounded-full bg-blue-100">
              <FileCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Day 6 - Future Tenses</h3>
                  <p className="text-gray-500">Available from May 27, 2025</p>
                </div>
                <Button asChild disabled className="bg-gray-200 text-gray-500 cursor-not-allowed">
                  <Link to="/student/days/6">
                    Not Available Yet
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Assessments;
