import { useState, useEffect } from "react";
import TextEditor from "@/components/TextEditor";
import ResultsDisplay from "@/components/ResultsDisplay";
import { assessText } from "@/utils/assessmentService";
import { AssessmentResult } from "@/types/assessment";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, FileCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getAssignmentDetails } from "@/utils/assignmentService";

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
  const [assignment, setAssignment] = useState<AssignmentDetails | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { courseId, lessonId, assignmentId } = useParams();
  const [returnUrl, setReturnUrl] = useState("/");
  
  useEffect(() => {
    // Get the return URL from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("returnUrl")) {
      setReturnUrl(urlParams.get("returnUrl") || "/");
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
      
      // Here you would typically save the result to your database
      // This is where you'd integrate with your e-learning platform's API
      console.log("Assessment completed for:", {
        courseId,
        lessonId,
        assignmentId,
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
    navigate(returnUrl);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        {!showResults ? (
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl md:text-3xl mb-4 text-center tracking-tight font-bold">
              {assignment?.title || "Writing Assessment"}
            </h1>
            
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
                Start New Assessment
                </Button>
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
