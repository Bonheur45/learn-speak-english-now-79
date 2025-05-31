import { useState } from "react";
import { CircularProgressIndicator } from "./CircularProgressIndicator";
import { AssessmentResult, CefrLevel } from "@/types/assessment";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface ResultsDisplayProps {
  result: AssessmentResult | null;
}

// Function to determine CEFR level based on percentage according to the specified ranges
const getCefrLevelFromPercentage = (percentage: number): CefrLevel => {
  if (percentage >= 90) return 'C2';
  if (percentage >= 80) return 'C1';
  if (percentage >= 70) return 'B2';
  if (percentage >= 60) return 'B1';
  if (percentage >= 40) return 'A2';
  return 'A1';
};

const ResultsDisplay = ({ result }: ResultsDisplayProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  if (!result) return null;

  // Calculate the average of the main components
  const calculateAverage = () => {
    const { vocabulary, complexity, coherence, grammar, taskAchievement } = result.details;
    const sum = vocabulary + complexity + coherence + grammar + taskAchievement;
    return Math.round(sum / 5); // Round to whole number
  };
  
  const averageScore = calculateAverage();
  const levelFromPercentage = getCefrLevelFromPercentage(averageScore);
  
  // Generate feedback based on scores
  const generateFeedback = () => {
    const { vocabulary, complexity, coherence, grammar, taskAchievement } = result.details;
    const feedback = [];
    
    if (vocabulary >= 80) {
      feedback.push("Excellent vocabulary range and usage");
    } else if (vocabulary >= 60) {
      feedback.push("Good vocabulary range with room for improvement");
    } else {
      feedback.push("Focus on expanding your vocabulary");
    }
    
    if (grammar >= 80) {
      feedback.push("Strong grammar control");
    } else if (grammar >= 60) {
      feedback.push("Generally accurate grammar with some errors");
    } else {
      feedback.push("Work on improving grammar accuracy");
    }
    
    if (coherence >= 80) {
      feedback.push("Well-organized and coherent writing");
    } else if (coherence >= 60) {
      feedback.push("Mostly coherent structure");
    } else {
      feedback.push("Focus on organizing your ideas better");
    }
    
    if (complexity >= 80) {
      feedback.push("Sophisticated language use");
    } else if (complexity >= 60) {
      feedback.push("Good sentence variety");
    } else {
      feedback.push("Try using more complex structures");
    }
    
    if (taskAchievement >= 80) {
      feedback.push("Excellent task completion");
    } else if (taskAchievement >= 60) {
      feedback.push("Good task completion");
    } else {
      feedback.push("Focus on addressing the task requirements");
    }
    
    return feedback;
  };
  
  const feedback = generateFeedback();
  
  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-3xl font-bold text-center mb-8">Assessment Completed</h2>
      
      <div className="flex flex-col items-center mb-8">
        <CircularProgressIndicator percentage={averageScore} />
        <div className="mt-6 text-center">
          <h3 className="text-2xl font-bold">
            {averageScore >= 60 ? "Great job! You've passed this assessment." : "Thank you for completing the assessment."}
          </h3>
          <p className="text-lg mt-2">
            Your CEFR level: <span className="font-bold">{levelFromPercentage}</span>
            <span className="text-sm text-gray-500 ml-2">
              (Confidence: 90%)
            </span>
          </p>
          <div className="mt-2 mb-3">
            <p className="text-sm text-gray-600 mb-2">Score interpretation scale:</p>
            <div className="flex justify-center items-center space-x-1">
              <span className="text-xs px-2 py-1 bg-red-100 rounded">A1: &lt;40%</span>
              <span className="text-xs px-2 py-1 bg-orange-100 rounded">A2: 40-59%</span>
              <span className="text-xs px-2 py-1 bg-yellow-100 rounded">B1: 60-69%</span>
              <span className="text-xs px-2 py-1 bg-green-100 rounded">B2: 70-79%</span>
              <span className="text-xs px-2 py-1 bg-blue-100 rounded">C1: 80-89%</span>
              <span className="text-xs px-2 py-1 bg-purple-100 rounded">C2: 90-100%</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Skill Details</TabsTrigger>
          <TabsTrigger value="grammar">Grammar</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">Assessment Overview</h4>
            <p className="mb-3">Overall Score: <span className="font-bold">{averageScore}%</span> (average of all skills)</p>
            <ul className="space-y-3">
              {feedback.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-3 mt-2"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
        
        <TabsContent value="details">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">Language Skills Breakdown</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Vocabulary Range</span>
                  <span>{Math.round(result.details.vocabulary)}%</span>
                </div>
                <Progress value={result.details.vocabulary} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Grammatical Accuracy</span>
                  <span>{Math.round(result.details.grammar)}%</span>
                </div>
                <Progress value={result.details.grammar} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Coherence & Cohesion</span>
                  <span>{Math.round(result.details.coherence)}%</span>
                </div>
                <Progress value={result.details.coherence} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Complexity</span>
                  <span>{Math.round(result.details.complexity)}%</span>
                </div>
                <Progress value={result.details.complexity} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Task Achievement</span>
                  <span>{Math.round(result.details.taskAchievement)}%</span>
                </div>
                <Progress value={result.details.taskAchievement} className="h-2" />
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-lg">Overall Average</span>
                  <span className="font-bold">{averageScore}%</span>
                </div>
                <Progress value={averageScore} className="h-3 bg-slate-100" />
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="grammar">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">Grammar Feedback</h4>
            {result.details.errors.length > 0 ? (
              <ul className="space-y-3">
                {result.details.errors.map((error, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-3 mt-2"></span>
                    <div>
                      <span className="font-medium">{error.description}</span>
                      <span className="text-sm text-gray-500 ml-2">(Level: {error.level})</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No significant grammar errors detected.</p>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="suggestions">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">Improvement Suggestions</h4>
            <ul className="space-y-3">
              {feedback.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-3 mt-2"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsDisplay;
