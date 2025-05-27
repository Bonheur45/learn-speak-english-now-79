
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LearnMore from "./pages/LearnMore";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

// Student pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentCohorts from "./pages/student/Cohorts";
import StudentTrimesters from "./pages/student/Trimesters";
import StudentLessons from "./pages/student/Lessons";
import StudentDayContent from "./pages/student/DayContent";
import StudentAssessments from "./pages/student/Assessments";
import VocabularyTest from "./pages/student/VocabularyTest";
import TopicTest from "./pages/student/TopicTest";
import WritingAssessment from "./pages/student/WritingAssessment";

// Tutor pages
import TutorDashboard from "./pages/tutor/Dashboard";
import TutorCohorts from "./pages/tutor/Cohorts";
import TutorStudents from "./pages/tutor/Students";
import CohortMaterials from "./pages/tutor/CohortMaterials";
import TrimesterMaterials from "./pages/tutor/TrimesterMaterials";
import DaysList from "./pages/tutor/DaysList";
import Upload from "./pages/tutor/Upload";
import DayEditor from "./pages/tutor/DayEditor";
import VocabularyQuestionEditor from "./pages/tutor/VocabularyQuestionEditor";
import TopicQuestionEditor from "./pages/tutor/TopicQuestionEditor";
import WritingPromptEditor from "./pages/tutor/WritingPromptEditor";

// Assessment pages
import EmbeddedAssessment from "./pages/EmbeddedAssessment";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* Student routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/cohorts" element={<StudentCohorts />} />
            <Route path="/student/cohorts/:cohortId/trimesters" element={<StudentTrimesters />} />
            <Route path="/student/days" element={<StudentLessons />} />
            <Route path="/student/days/:dayId" element={<StudentDayContent />} />
            <Route path="/student/assessments" element={<StudentAssessments />} />
            <Route path="/student/vocabulary-test/:dayId" element={<VocabularyTest />} />
            <Route path="/student/topic-test/:dayId" element={<TopicTest />} />
            <Route path="/student/writing-assessment/:dayId" element={<WritingAssessment />} />
            
            {/* Tutor routes - hierarchical materials management */}
            <Route path="/tutor/dashboard" element={<TutorDashboard />} />
            <Route path="/tutor/cohorts" element={<TutorCohorts />} />
            <Route path="/tutor/students" element={<TutorStudents />} />
            <Route path="/tutor/materials" element={<CohortMaterials />} />
            <Route path="/tutor/materials/cohort/:cohortId" element={<TrimesterMaterials />} />
            <Route path="/tutor/materials/cohort/:cohortId/trimester/:trimesterId" element={<DaysList />} />
            <Route path="/tutor/materials/cohort/:cohortId/trimester/:trimesterId/day/:dayId/edit" element={<DayEditor />} />
            <Route path="/tutor/materials/cohort/:cohortId/trimester/:trimesterId/day/:dayId/questions/vocabulary" element={<VocabularyQuestionEditor />} />
            <Route path="/tutor/materials/cohort/:cohortId/trimester/:trimesterId/day/:dayId/questions/topic" element={<TopicQuestionEditor />} />
            <Route path="/tutor/materials/cohort/:cohortId/trimester/:trimesterId/day/:dayId/questions/writing" element={<WritingPromptEditor />} />
            <Route path="/tutor/upload" element={<Upload />} />
            <Route path="/tutor/day-editor/:dayId" element={<DayEditor />} />
            
            {/* Assessment routes */}
            <Route path="/assessment/:assessmentId" element={<EmbeddedAssessment />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
