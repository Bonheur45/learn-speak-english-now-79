
import { useState, useEffect } from "react";
import TextEditor from "@/components/TextEditor";
import ResultsDisplay from "@/components/ResultsDisplay";
import { assessText } from "@/utils/assessmentService";
import { AssessmentResult } from "@/types/assessment";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileCheck, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getAssignmentDetails } from "@/utils/assignmentService";
import { Progress } from "@/components/ui/progress";

const WritingAssessment = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignment, setAssignment] = useState<{
    title: string;
    prompt: string;
    promptDetails?: string;
    wordCount?: number;
    timeLimit?: number;
  } | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { dayId } = useParams();

  useEffect(() => {
    // Fetch assignment details based on dayId
    if (dayId) {
      // This would typically call a function that fetches from your database
      // For now, we're using the mock function
      const details = getAssignmentDetails("example-course", "day-1", "writing-assignment-1");
      setAssignment(details);
      
      // Set up timer if there's a time limit
      if (details.timeLimit) {
        setTimeRemaining(details.timeLimit * 60); // Convert to seconds
      }
    } else {
      // Default assignment details if not found
      setAssignment({
        title: "Writing Assessment",
        prompt: "Write an essay on a topic of your choice.",
        promptDetails: "Your response will be assessed based on vocabulary usage, grammar, coherence, and complexity.",
        wordCount: 150
      });
    }
  }, [dayId]);

  // Timer countdown effect
  useEffect(() => {
    let timer: number | undefined;
    if (timeRemaining !== null && timeRemaining > 0 && !showResults) {
      timer = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev !== null && prev > 0) {
            return prev - 1;
          }
          return 0;
        });
      }, 1000);
    } else if (timeRemaining === 0 && !showResults && text.length > 0) {
      // Auto-submit when time runs out
      handleSubmit();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeRemaining, showResults]);

  // Update word count when text changes
  useEffect(() => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;
    const plainText = tempDiv.textContent || "";
    
    const words = plainText.trim() 
      ? plainText.trim().split(/\s+/).length 
      : 0;
    
    setWordCount(words);
  }, [text]);

  const handleSubmit = () => {
    // Extract plain text from HTML content for assessment
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;
    const plainText = tempDiv.textContent || "";
    
    if (plainText.trim().length < 10) {
      toast({
        title: "Text too short",
        description: "Please write at least 10 characters to submit.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Perform the assessment
      const assessmentResult = assessText(plainText);
      setResult(assessmentResult);
      setShowResults(true);
      
      // Here we would typically save the result to the database
      // This is where you'd integrate with your e-learning platform's API
      console.log("Assessment completed for day:", {
        dayId,
        score: assessmentResult.score,
        cefrLevel: assessmentResult.cefrLevel
      });
      
      // Mock saving the assessment result
      setTimeout(() => {
        toast({
          title: "Assessment Saved",
          description: `Your score has been recorded: ${assessmentResult.score}%`,
        });
      }, 1000);
    } catch (error) {
      console.error("Assessment error:", error);
      toast({
        title: "Assessment Error",
        description: "There was a problem assessing your writing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnToDashboard = () => {
    navigate(`/student/lessons/${dayId}`);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        {!showResults ? (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReturnToDashboard}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <h1 className="text-2xl md:text-3xl tracking-tight font-bold">
                {assignment?.title || "Writing Assessment"}
              </h1>
            </div>
            
            {/* Essay Prompt Card */}
            <Card className="w-full max-w-[850px] mx-auto mb-6 p-4 sm:p-6 border-l-4 border-l-amber-400">
              <h2 className="font-bold text-lg mb-2">Essay Prompt:</h2>
              <p className="text-gray-800 mb-4">{assignment?.prompt}</p>
              {assignment?.promptDetails && (
                <p className="text-gray-600 text-sm">{assignment.promptDetails}</p>
              )}
              
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                {assignment?.wordCount && (
                  <div className="flex flex-col">
                    <span className="text-gray-600">Target word count: {assignment.wordCount} words</span>
                    <div className="flex items-center mt-1">
                      <Progress 
                        value={Math.min(100, (wordCount / assignment.wordCount) * 100)} 
                        className="h-2 w-32 mr-2" 
                      />
                      <span className={`text-xs ${wordCount >= assignment.wordCount ? "text-green-600" : "text-gray-500"}`}>
                        {wordCount}/{assignment.wordCount}
                      </span>
                    </div>
                  </div>
                )}
                
                {timeRemaining !== null && (
                  <div className="flex flex-col">
                    <span className="text-gray-600">Time remaining:</span>
                    <span className={`font-mono font-medium ${timeRemaining < 60 ? "text-red-500" : "text-gray-900"}`}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                )}
              </div>
            </Card>
            
            <div className="flex-1 flex flex-col items-center">
              <Card className="w-full max-w-[850px] flex-1 flex flex-col p-4 sm:p-6 shadow-md mb-8">
                <TextEditor text={text} setText={setText} />
              </Card>
            </div>
            <div className="flex justify-center">
              <Button 
                onClick={handleSubmit} 
                className="px-8 py-6 text-lg bg-amber-400 hover:bg-amber-500 text-black" 
                disabled={text.trim().length < 10 || isSubmitting}
              >
                <FileCheck className="mr-2 h-5 w-5" />
                {isSubmitting ? "Assessing..." : "Submit Assessment"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <ResultsDisplay result={result} />
            <div className="mt-8 flex gap-4">
              <Button 
                onClick={() => { setText(""); setResult(null); setShowResults(false); }} 
                variant="outline" 
                className="px-6 py-4"
              >
                Try Again
              </Button>
              <Button 
                onClick={handleReturnToDashboard} 
                className="px-6 py-4 bg-amber-400 hover:bg-amber-500 text-black"
              >
                Return to Lesson
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingAssessment;
