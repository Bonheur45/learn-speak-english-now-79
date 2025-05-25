
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  username: string;
  score: number;
  avatar?: string;
  weeklyChange?: number;
}

interface WeeklyRankingsProps {
  students: Student[];
  currentUserId: string;
}

const WeeklyRankings = ({ students, currentUserId }: WeeklyRankingsProps) => {
  const sortedStudents = [...students].sort((a, b) => b.score - a.score);
  
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-gray-500">#{position}</span>;
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getChangeIndicator = (change?: number) => {
    if (!change) return null;
    
    const isPositive = change > 0;
    return (
      <div className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        <TrendingUp className={`h-3 w-3 mr-1 ${!isPositive ? 'rotate-180' : ''}`} />
        {Math.abs(change)}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-brand-yellow" />
          Weekly Cohort Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedStudents.map((student, index) => {
            const position = index + 1;
            const isCurrentUser = student.id === currentUserId;
            
            return (
              <div
                key={student.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${getPositionColor(position)} ${
                  isCurrentUser ? 'ring-2 ring-brand-blue shadow-md' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(position)}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center text-white font-semibold">
                      {student.avatar ? (
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        student.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    
                    <div>
                      <p className={`font-medium ${isCurrentUser ? 'text-brand-blue' : ''}`}>
                        {student.name} {isCurrentUser && '(You)'}
                      </p>
                      <p className="text-sm text-gray-500">@{student.username}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="font-bold text-lg">{student.score}</p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                    {getChangeIndicator(student.weeklyChange)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Rankings update weekly based on assessment scores and participation
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyRankings;
