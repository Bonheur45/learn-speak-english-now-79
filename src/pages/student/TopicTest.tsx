
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
    question: "Which tense is used to describe an action that started in the past and continues to the present?",
    options: ["Present Simple", "Present Continuous", "Present Perfect", "Present Perfect Continuous"],
    correctAnswer: "Present Perfect Continuous"
  },
  {
    id: 2,
    question: "Select the correct sentence using Present Perfect Continuous:",
    options: [
      "I work here for five years.",
      "I am working here for five years.",
      "I have worked here for five years.",
      "I have been working here for five years."
    ],
    correctAnswer: "I have been working here for five years."
  },
  {
    id: 3,
    question: "What is the structure of the Present Perfect Continuous tense?",
    options: [
      "subject + am/is/are + verb-ing",
      "subject + have/has + been + verb-ing",
      "subject + have/has + verb (past participle)",
      "subject + verb (base form)"
    ],
    correctAnswer: "subject + have/has + been + verb-ing"
  },
  {
    id: 4,
    question: "Which sentence shows the correct use of Present Perfect Continuous to express duration?",
    options: [
      "She lives in London since 2010.",
      "She is living in London since 2010.",
      "She has lived in London since 2010.",
      "She has been living in London since 2010."
    ],
    correctAnswer: "She has been living in London since 2010."
  },
  {
    id: 5,
    question: "When do we use 'for' with Present Perfect Continuous tense?",
    options: [
      "To indicate a specific point in time",
      "To indicate a period of time",
      "To indicate the future",
      "To indicate a single completed action"
    ],
    correctAnswer: "To indicate a period of time"
  }
];

interface FormValues {
  [key: string]: string;
}

const TopicTest = () => {
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
    localStorage.setItem(`day${dayId}-topic-score`, calculatedScore.toString());
    
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
            <h1 className="text-3xl font-bold">Topic Test: Present Tenses</h1>
            <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-lg">ASSESSMENT</span>
          </div>
          <p className="text-gray-500 mt-1">05/12/2025</p>
        </div>
        
        <p className="mb-6 text-lg">Test your understanding of Present Perfect Continuous tense.</p>
        
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
                  {score === 100 ? "Perfect! You've mastered this topic." :
                   score >= 70 ? "Great job! You've passed this assessment." :
                   "Keep studying! Review the materials and try again."}
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

export default TopicTest;
