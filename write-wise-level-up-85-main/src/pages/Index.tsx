
import { useState } from "react";
import TextEditor from "@/components/TextEditor";
import ResultsDisplay from "@/components/ResultsDisplay";
import { assessText } from "@/utils/assessmentService";
import { AssessmentResult } from "@/types/assessment";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmbeddedAssessmentExample from "@/components/EmbeddedAssessmentExample";

const Index = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  const handleSubmit = () => {
    // Extract plain text from HTML content for assessment
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;
    const plainText = tempDiv.textContent || "";
    if (plainText.trim().length < 10) {
      return;
    }
    const assessmentResult = assessText(plainText);
    setResult(assessmentResult);
    setShowResults(true);
  };
  
  const handleReset = () => {
    setText("");
    setResult(null);
    setShowResults(false);
  };
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        <Tabs defaultValue="standalone" className="w-full mb-8">
          <TabsList className="mx-auto">
            <TabsTrigger value="standalone">Standalone Tool</TabsTrigger>
            <TabsTrigger value="integration">Integration Example</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standalone">
            {!showResults ? (
              <div className="flex-1 flex flex-col">
                <h1 className="text-4xl md:text-5xl mb-6 text-center tracking-tight font-bold">
                  CEFR-Aligned Writing Assessment Tool
                </h1>
                <p className="text-gray-600 mb-10 text-center max-w-2xl mx-auto text-lg">
                  Write or paste your text below to assess your Writing level according to the CEFR framework.
                </p>
                <div className="flex-1 flex flex-col items-center">
                  <Card className="w-full max-w-[850px] flex-1 flex flex-col p-4 sm:p-6 shadow-md mb-8">
                    <TextEditor text={text} setText={setText} />
                  </Card>
                </div>
                <div className="flex justify-center">
                  <Button 
                    onClick={handleSubmit} 
                    className="px-8 py-6 text-lg" 
                    disabled={text.trim().length < 10}
                  >
                    Submit for Assessment
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center">
                <ResultsDisplay result={result} />
                <div className="mt-8">
                  <Button 
                    onClick={handleReset} 
                    variant="outline" 
                    className="px-8 py-6 text-lg"
                  >
                    Start New Assessment
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="integration">
            <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-center">E-Learning Platform Integration</h2>
              <p className="text-gray-600 mb-6 text-center">
                This demonstrates how the writing assessment tool can be integrated into your e-learning platform.
                Click on "Start Assessment" for the Writing Assignment to see it in action.
              </p>
              <EmbeddedAssessmentExample />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
