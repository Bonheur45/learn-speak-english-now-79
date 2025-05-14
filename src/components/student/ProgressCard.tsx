
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressCardProps {
  title: string;
  value: number;
  maxValue: number;
  label?: string;
}

const ProgressCard = ({ title, value, maxValue, label }: ProgressCardProps) => {
  const percentage = Math.round((value / maxValue) * 100);
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{label || `${value} / ${maxValue}`}</span>
            <span>{percentage}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
