import { useState } from "react";
import { CircularProgressIndicator } from "./CircularProgressIndicator";
import { AssessmentResult } from "@/types/assessment";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface ResultsDisplayProps {
  result: AssessmentResult | null;
}

// Map numeric average back to broad CEFR bands for the header
const getCefrLevelFromPercentage = (percentage: number): string => {
  if (percentage >= 80) return "C1-C2";
  if (percentage >= 75) return "B2";
  if (percentage >= 70) return "B1";
  if (percentage >= 65) return "A2";
  return "A1";
};

const ResultsDisplay = ({ result }: ResultsDisplayProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  if (!result) return null;

  // Compute average of main skills using the new `sublevels` field.
  const averageScore = Math.round(
    (result.sublevels.vocabulary +
      result.sublevels.grammar +
      result.sublevels.coherence +
      result.sublevels.complexity) /
      4
  );

  const levelFromPercentage = getCefrLevelFromPercentage(averageScore);

  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-3xl font-bold text-center mb-8">Assessment Completed</h2>

      <div className="flex flex-col items-center mb-8">
        <CircularProgressIndicator percentage={averageScore} />
        <div className="mt-6 text-center">
          <h3 className="text-2xl font-bold">
            {averageScore >= 60
              ? "Great job! You've passed this assessment."
              : "Thank you for completing the assessment."}
          </h3>
          <p className="text-lg mt-2">
            Your CEFR level: <span className="font-bold">{levelFromPercentage}</span>
            <span className="text-sm text-gray-500 ml-2">
              (Confidence: {Math.round(result.confidenceLevel * 100)}%)
            </span>
          </p>
          <div className="mt-2 mb-3">
            <p className="text-sm text-gray-600 mb-2">Score interpretation scale:</p>
            <div className="flex justify-center items-center space-x-1">
              <span className="text-xs px-2 py-1 bg-red-100 rounded">A1: &lt;65%</span>
              <span className="text-xs px-2 py-1 bg-orange-100 rounded">A2: 65-69%</span>
              <span className="text-xs px-2 py-1 bg-yellow-100 rounded">B1: 70-74%</span>
              <span className="text-xs px-2 py-1 bg-green-100 rounded">B2: 75-79%</span>
              <span className="text-xs px-2 py-1 bg-blue-100 rounded">C1-C2: 80-100%</span>
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

        {/* OVERVIEW */}
        <TabsContent value="overview">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">Assessment Overview</h4>
            <p className="mb-3">
              Overall Score: <span className="font-bold">{averageScore}%</span> (average of all
              skills)
            </p>
            <ul className="space-y-3">
              {result.overview.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-3 mt-2"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        {/* DETAILS */}
        <TabsContent value="details">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">Language Skills Breakdown</h4>
            <div className="space-y-4">
              {([
                ["Vocabulary Range", result.sublevels.vocabulary],
                ["Grammatical Accuracy", result.sublevels.grammar],
                ["Coherence & Cohesion", result.sublevels.coherence],
                ["Complexity", result.sublevels.complexity],
                result.sublevels.taskAchievement !== undefined && [
                  "Task Achievement",
                  result.sublevels.taskAchievement
                ]
              ] as (false | [string, number])[]).map(
                (entry, idx) =>
                  entry && (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{entry[0]}</span>
                        <span>{Math.round(entry[1])}%</span>
                      </div>
                      <Progress value={entry[1]} className="h-2" />
                    </div>
                  )
              )}

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

        {/* GRAMMAR */}
        <TabsContent value="grammar">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">Grammar Feedback</h4>
            {result.grammarErrors.length > 0 ? (
              <ul className="space-y-3">
                {result.grammarErrors.map((err, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-3 mt-2"></span>
                    <span>{err}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No significant grammar errors detected. Excellent work!</p>
            )}
          </Card>
        </TabsContent>

        {/* SUGGESTIONS */}
        <TabsContent value="suggestions">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">Improvement Suggestions</h4>
            <ul className="space-y-3">
              {result.suggestions.map((sug, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-3 mt-2"></span>
                  <span>{sug}</span>
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
