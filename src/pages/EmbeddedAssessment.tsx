
import { useState, useEffect } from "react";
import TextEditor from "@/components/TextEditor";
import ResultsDisplay from "@/components/ResultsDisplay";
import { assessText } from "@/utils/assessmentService";
import { AssessmentResult } from "@/types/assessment";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, FileCheck, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getAssignmentDetails } from "@/utils/assignmentService";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AssignmentDetails {
  title: string;
  prompt: string;
  promptDetails?: string;
  wordCount?: number;
  timeLimit?: number;
}

const EmbeddedAssessment = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [assignment, setAssignment] = useState<AssignmentDetails | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { courseId, lessonId, assignmentId } = useParams();
  const [returnUrl, setReturnUrl] = useState("/");

  const MAX_ATTEMPTS = 3;
  
  useEffect(() => {
    // Get the return URL from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("returnUrl")) {
      setReturnUrl(urlParams.get("returnUrl") || "/");
    }

    // Create a unique key for this embedded assessment
    const assessmentKey = `${courseId}-${lessonId}-${assignmentId}` || 'default-assessment';
    
    // Load attempts from localStorage
    const savedAttempts = localStorage.getItem(`embedded-writing-attempts-${assessmentKey}`);
    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts));
    }
    
    // Fetch assignment details based on courseId, lessonId, and assignmentId
    if (courseId && lessonId && assignmentId) {
      const details = getAssignmentDetails(courseId, lessonId, assignmentId);
      setAssignment(details);
    } else {
      // Default assignment details if not found
      setAssignment({
        title: "Writing Assessment",
        prompt: "Write an essay on a topic of your choice.",
        promptDetails: "Your response will be assessed based on vocabulary usage, grammar, coherence, and complexity."
      });
    }
  }, [courseId, lessonId, assignmentId]);
  
  const handleSubmit = () => {
    if (attempts >= MAX_ATTEMPTS) {
      toast({
        title: "Maximum attempts reached",
        description: "You have used all 3 attempts for this assessment.",
        variant: "destructive",
      });
      return;
    }

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

      // Update attempts count
      const assessmentKey = `${courseId}-${lessonId}-${assignmentId}` || 'default-assessment';
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem(`embedded-writing-attempts-${assessmentKey}`, newAttempts.toString());
      
      // Here you would typically save the result to your database
      console.log("Assessment completed for:", {
        courseId,
        lessonId,
        assignmentId,
        attempt: newAttempts,
        score: assessmentResult.score,
        cefrLevel: assessmentResult.cefrLevel
      });
      
      // Mock saving the assessment result
      setTimeout(() => {
        toast({
          title: "Assessment Saved",
          description: `Attempt ${newAttempts} saved. Score: ${assessmentResult.score}%`,
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
    navigate(returnUrl);
  };

  const handleStartNewAttempt = () => {
    if (attempts >= MAX_ATTEMPTS) {
      toast({
        title: "Maximum attempts reached",
        description: "You have used all 3 attempts for this assessment.",
        variant: "destructive",
      });
      return;
    }
    
    setText("");
    setResult(null);
    setShowResults(false);
  };

  const remainingAttempts = MAX_ATTEMPTS - attempts;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        {!showResults ? (
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl md:text-3xl mb-4 text-center tracking-tight font-bold">
              {assignment?.title || "Writing Assessment"}
            </h1>

            {/* Attempts Alert */}
            {attempts > 0 && (
              <Alert className="w-full max-w-[850px] mx-auto mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Attempt {attempts + 1} of {MAX_ATTEMPTS}. You have {remainingAttempts} attempts remaining.
                </AlertDescription>
              </Alert>
            )}
            
            {/* Essay Prompt Card */}
            <Card className="w-full max-w-[850px] mx-auto mb-6 p-4 sm:p-6 border-l-4 border-l-amber-400">
              <h2 className="font-bold text-lg mb-2">Essay Prompt:</h2>
              <p className="text-gray-800 mb-4">{assignment?.prompt}</p>
              {assignment?.promptDetails && (
                <p className="text-gray-600 text-sm">{assignment.promptDetails}</p>
              )}
              {assignment?.wordCount && (
                <p className="text-gray-600 text-sm mt-2">
                  Target word count: approximately {assignment.wordCount} words
                </p>
              )}
              {assignment?.timeLimit && (
                <p className="text-gray-600 text-sm mt-1">
                  Suggested time: {assignment.timeLimit} minutes
                </p>
              )}
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
                disabled={text.trim().length < 10 || isSubmitting || attempts >= MAX_ATTEMPTS}
              >
                <FileCheck className="mr-2 h-5 w-5" />
                {isSubmitting ? "Assessing..." : attempts >= MAX_ATTEMPTS ? "Max Attempts Reached" : "Submit Assessment"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <ResultsDisplay result={result} />
            <div className="mt-8 flex gap-4">
              {remainingAttempts > 0 && (
                <Button 
                  onClick={handleStartNewAttempt} 
                  variant="outline" 
                  className="px-6 py-4"
                >
                  Try Again ({remainingAttempts} left)
                </Button>
              )}
              <Button 
                onClick={handleReturnToDashboard} 
                className="px-6 py-4 bg-amber-400 hover:bg-amber-500 text-black"
              >
                <Trophy className="mr-2 h-5 w-5" />
                Return to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbeddedAssessment;
