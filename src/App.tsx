
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LearnMore from "./pages/LearnMore";
import StudentDashboard from "./pages/student/Dashboard";
import TutorDashboard from "./pages/tutor/Dashboard";
import Students from "./pages/tutor/Students";
import Materials from "./pages/tutor/Materials";
import NotFound from "./pages/NotFound";
import DayContent from "./pages/student/DayContent";
import Assessments from "./pages/student/Assessments";
import Lessons from "./pages/student/Lessons";
import VocabularyTest from "./pages/student/VocabularyTest";
import TopicTest from "./pages/student/TopicTest";
import WritingAssessment from "./pages/student/WritingAssessment";
import StudentCohorts from "./pages/student/Cohorts";
import StudentTrimesters from "./pages/student/Trimesters";
import TutorCohorts from "./pages/tutor/Cohorts";
import UploadPage from "./pages/tutor/Upload";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/FAQ";
import EmbeddedAssessment from "./pages/EmbeddedAssessment";

const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Student Routes */}
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/cohorts" element={<StudentCohorts />} />
              <Route path="/student/trimesters" element={<StudentTrimesters />} />
              <Route path="/student/lessons" element={<Lessons />} />
              <Route path="/student/days" element={<Lessons />} />
              <Route path="/student/days/:dayId" element={<DayContent />} />
              <Route path="/student/assessments" element={<Assessments />} />
              <Route path="/student/days/:dayId/vocabulary-test" element={<VocabularyTest />} />
              <Route path="/student/days/:dayId/topic-test" element={<TopicTest />} />
              <Route path="/student/writing-assessment/:dayId" element={<WritingAssessment />} />
              
              {/* Embedded Assessment Routes */}
              <Route path="/embedded-assessment" element={<EmbeddedAssessment />} />
              <Route path="/embedded-assessment/:courseId/:lessonId/:assignmentId" element={<EmbeddedAssessment />} />
              
              {/* Tutor Routes */}
              <Route path="/tutor/dashboard" element={<TutorDashboard />} />
              <Route path="/tutor/cohorts" element={<TutorCohorts />} />
              <Route path="/tutor/students" element={<Students />} />
              <Route path="/tutor/materials" element={<Materials />} />
              <Route path="/tutor/upload" element={<UploadPage />} />
              
              {/* Static Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/faq" element={<FAQ />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
