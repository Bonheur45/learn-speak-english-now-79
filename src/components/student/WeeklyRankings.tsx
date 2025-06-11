import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import api from '@/lib/api';

interface Student {
  id: string;
  name: string;
  username: string;
  score: number;
  avatar?: string;
  weeklyChange?: number;
}

const WeeklyRankings = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankings();
  }, []);
  
  const fetchRankings = async () => {
    try {
      const response = await api.analytics.getAnalytics();
      // Transform the analytics data into the format we need
      const rankings = response.data.map((student: any) => ({
        id: student.id,
        name: student.full_name,
        username: student.username,
        score: student.weekly_score,
        avatar: student.avatar_url,
        weeklyChange: student.weekly_change
      }));
      setStudents(rankings);
    } catch (error) {
      console.error('Failed to fetch rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-lg">Loading rankings...</div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Weekly Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students.map((student, index) => (
            <div key={student.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                  {index === 0 ? (
                    <Trophy className="h-4 w-4 text-yellow-500" />
                  ) : index === 1 ? (
                    <Medal className="h-4 w-4 text-gray-400" />
                  ) : index === 2 ? (
                    <Award className="h-4 w-4 text-amber-600" />
                      ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div>
                  <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">@{student.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                <span className="font-medium">{student.score} pts</span>
                {student.weeklyChange && (
                  <div className={`flex items-center ${student.weeklyChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">{Math.abs(student.weeklyChange)}</span>
                  </div>
                )}
              </div>
        </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyRankings;
