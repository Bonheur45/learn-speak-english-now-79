
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

// Mock assessment data
const assessmentQuestions = [
  {
    id: 1,
    question: "What's the synonym for 'procrastination'?",
    options: ["Delay", "Speed", "Efficiency", "Planning"],
    correctAnswer: "Delay"
  },
  {
    id: 2,
    question: "Which word means 'to release from constraint'?",
    options: ["Lock", "Free", "Build", "Construct"],
    correctAnswer: "Free"
  },
  {
    id: 3,
    question: "What's the opposite of 'potential'?",
    options: ["Limitation", "Success", "Achievement", "Growth"],
    correctAnswer: "Limitation"
  },
  {
    id: 4,
    question: "Choose the correct definition of 'overcome':",
    options: [
      "To give up in the face of difficulty",
      "To succeed in dealing with a problem",
      "To create new challenges",
      "To avoid confrontation"
    ],
    correctAnswer: "To succeed in dealing with a problem"
  },
  {
    id: 5,
    question: "Which word is closest in meaning to 'unlock'?",
    options: ["Secure", "Release", "Fasten", "Prohibit"],
    correctAnswer: "Release"
  }
];

interface FormValues {
  [key: string]: string;
}

const VocabularyTest = () => {
  const navigate = useNavigate();
  const { dayId } = useParams<{ dayId: string }>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  const form = useForm<FormValues>({
    defaultValues: {}
  });
  
  const onSubmit = (data: FormValues) => {
    // Calculate score
    let correct = 0;
    assessmentQuestions.forEach(question => {
      if (data[`question-${question.id}`] === question.correctAnswer) {
        correct++;
      }
    });
    
    const calculatedScore = Math.round((correct / assessmentQuestions.length) * 100);
    setScore(calculatedScore);
    setIsSubmitted(true);
    
    // Save score in localStorage for demonstration
    localStorage.setItem(`day${dayId}-vocabulary-score`, calculatedScore.toString());
    
    toast({
      title: "Assessment Completed",
      description: `You scored ${calculatedScore}%!`,
    });
  };
  
  const returnToDashboard = () => {
    navigate('/student/days');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate(`/student/days/${dayId}`)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessments
          </Button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Vocabulary Test</h1>
            <span className="bg-red-100 text-red-800 px-4 py-1 rounded-lg">ASSESSMENT</span>
          </div>
          <p className="text-gray-500 mt-1">05/12/2025</p>
        </div>
        
        <p className="mb-6 text-lg">Test your understanding of vocabulary from the reading materials.</p>
        
        {!isSubmitted ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {assessmentQuestions.map((q, index) => (
                <Card key={q.id} className="bg-gray-50">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name={`question-${q.id}`}
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-lg font-medium">
                            {index + 1}. {q.question}
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-2"
                            >
                              {q.options.map((option) => (
                                <FormItem 
                                  key={option} 
                                  className="flex items-center space-x-3 space-y-0 bg-white p-3 rounded-md border hover:bg-gray-50 cursor-pointer"
                                >
                                  <FormControl>
                                    <RadioGroupItem value={option} className="border-yellow-400" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer w-full">
                                    {option}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}
              
              <Button 
                type="submit" 
                className="w-full bg-yellow-400 text-blue-900 hover:bg-yellow-500"
                size="lg"
              >
                Submit Assessment
              </Button>
            </form>
          </Form>
        ) : (
          <Card className="bg-gray-50">
            <CardContent className="py-10 px-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-6">Assessment Completed</h2>
                
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl font-bold">{score}%</div>
                  </div>
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
                      stroke={score > 70 ? "#4ade80" : score > 50 ? "#facc15" : "#f87171"} 
                      strokeWidth="10" 
                      strokeDasharray={`${score * 2.83} 283`} 
                      strokeDashoffset="0" 
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
                
                <p className="text-xl mb-8">
                  {score === 100 ? "Perfect! You've mastered this vocabulary." :
                   score >= 70 ? "Great job! You've passed this assessment." :
                   "Keep practicing! Review the materials and try again."}
                </p>
                
                <Button 
                  onClick={returnToDashboard}
                  className="bg-yellow-400 text-blue-900 hover:bg-yellow-500 w-full"
                  size="lg"
                >
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VocabularyTest;
