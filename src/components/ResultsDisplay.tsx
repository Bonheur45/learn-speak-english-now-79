
import { AssessmentResult } from "@/types/assessment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, BookOpen, MessageCircle, Zap } from "lucide-react";

interface ResultsDisplayProps {
  result: AssessmentResult | null;
}

const ResultsDisplay = ({ result }: ResultsDisplayProps) => {
  if (!result) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getCEFRColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'A1': 'bg-red-100 text-red-800',
      'A2': 'bg-orange-100 text-orange-800',
      'B1': 'bg-yellow-100 text-yellow-800',
      'B2': 'bg-blue-100 text-blue-800',
      'C1': 'bg-green-100 text-green-800',
      'C2': 'bg-purple-100 text-purple-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Overall Score Card */}
      <Card className="border-l-4 border-l-amber-400">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            <CardTitle className="text-2xl">Assessment Results</CardTitle>
          </div>
          <div className="space-y-2">
            <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
              {result.score}%
            </div>
            <Badge className={`text-lg px-4 py-1 ${getCEFRColor(result.cefrLevel)}`}>
              CEFR Level: {result.cefrLevel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-700 text-lg">{result.feedback}</p>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
            <CardTitle className="text-lg">Vocabulary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={result.detailedAnalysis.vocabulary.score} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className={getScoreColor(result.detailedAnalysis.vocabulary.score)}>
                  {result.detailedAnalysis.vocabulary.score}%
                </span>
              </div>
              <p className="text-sm text-gray-600">{result.detailedAnalysis.vocabulary.feedback}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <MessageCircle className="h-5 w-5 text-green-600 mr-2" />
            <CardTitle className="text-lg">Grammar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={result.detailedAnalysis.grammar.score} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className={getScoreColor(result.detailedAnalysis.grammar.score)}>
                  {result.detailedAnalysis.grammar.score}%
                </span>
              </div>
              <p className="text-sm text-gray-600">{result.detailedAnalysis.grammar.feedback}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Zap className="h-5 w-5 text-purple-600 mr-2" />
            <CardTitle className="text-lg">Coherence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={result.detailedAnalysis.coherence.score} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className={getScoreColor(result.detailedAnalysis.coherence.score)}>
                  {result.detailedAnalysis.coherence.score}%
                </span>
              </div>
              <p className="text-sm text-gray-600">{result.detailedAnalysis.coherence.feedback}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Trophy className="h-5 w-5 text-amber-600 mr-2" />
            <CardTitle className="text-lg">Complexity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={result.detailedAnalysis.complexity.score} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className={getScoreColor(result.detailedAnalysis.complexity.score)}>
                  {result.detailedAnalysis.complexity.score}%
                </span>
              </div>
              <p className="text-sm text-gray-600">{result.detailedAnalysis.complexity.feedback}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsDisplay;
