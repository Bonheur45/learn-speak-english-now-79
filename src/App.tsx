
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Public pages
import Index from '@/pages/Index';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import FAQ from '@/pages/FAQ';
import Privacy from '@/pages/Privacy';
import LearnMore from '@/pages/LearnMore';
import EmbeddedAssessment from '@/pages/EmbeddedAssessment';
import NotFound from '@/pages/NotFound';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import PendingApproval from '@/pages/auth/PendingApproval';

// Student pages
import StudentDashboard from '@/pages/student/Dashboard';
import StudentCohorts from '@/pages/student/Cohorts';
import StudentTrimesters from '@/pages/student/Trimesters';
import StudentLessons from '@/pages/student/Lessons';
import StudentDayContent from '@/pages/student/DayContent';
import StudentAssessments from '@/pages/student/Assessments';
import VocabularyTest from '@/pages/student/VocabularyTest';
import TopicTest from '@/pages/student/TopicTest';
import WritingAssessment from '@/pages/student/WritingAssessment';

// Tutor pages
import TutorDashboard from '@/pages/tutor/Dashboard';
import TutorStudents from '@/pages/tutor/Students';
import TutorCohorts from '@/pages/tutor/Cohorts';
import TutorUpload from '@/pages/tutor/Upload';
import StudentApproval from '@/pages/tutor/StudentApproval';

// Curriculum Template pages
import CurriculumMaterials from '@/pages/tutor/CurriculumMaterials';
import CurriculumTrimesters from '@/pages/tutor/CurriculumTrimesters';
import CurriculumDays from '@/pages/tutor/CurriculumDays';
import CurriculumDayEditor from '@/pages/tutor/CurriculumDayEditor';

// Cohort Management pages
import CohortMaterials from '@/pages/tutor/CohortMaterials';
import TrimesterMaterials from '@/pages/tutor/TrimesterMaterials';
import DaysList from '@/pages/tutor/DaysList';
import DayEditor from '@/pages/tutor/DayEditor';

// Question editor pages
import VocabularyQuestionEditor from '@/pages/tutor/VocabularyQuestionEditor';
import TopicQuestionEditor from '@/pages/tutor/TopicQuestionEditor';
import WritingPromptEditor from '@/pages/tutor/WritingPromptEditor';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/assessment" element={<EmbeddedAssessment />} />

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pending-approval" element={
              <ProtectedRoute requiredRole="student">
                <PendingApproval />
              </ProtectedRoute>
            } />

            {/* Student routes */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute requiredRole="student" requireApproval>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/cohorts" element={
              <ProtectedRoute requiredRole="student" requireApproval>
                <StudentCohorts />
              </ProtectedRoute>
            } />
            <Route path="/student/trimesters" element={
              <ProtectedRoute requiredRole="student" requireApproval>
                <StudentTrimesters />
              </ProtectedRoute>
            } />
            <Route path="/student/lessons" element={
              <ProtectedRoute requiredRole="student">
                <StudentLessons />
              </ProtectedRoute>
            } />
            <Route path="/student/days" element={
              <ProtectedRoute requiredRole="student">
                <StudentLessons />
              </ProtectedRoute>
            } />
            <Route path="/student/days/:dayId" element={
              <ProtectedRoute requiredRole="student">
                <StudentDayContent />
              </ProtectedRoute>
            } />
            <Route path="/student/day/:dayId" element={
              <ProtectedRoute requiredRole="student">
                <StudentDayContent />
              </ProtectedRoute>
            } />
            <Route path="/student/assessments" element={
              <ProtectedRoute requiredRole="student" requireApproval>
                <StudentAssessments />
              </ProtectedRoute>
            } />
            <Route path="/student/vocabulary-test/:dayId" element={
              <ProtectedRoute requiredRole="student">
                <VocabularyTest />
              </ProtectedRoute>
            } />
            <Route path="/student/topic-test/:dayId" element={
              <ProtectedRoute requiredRole="student">
                <TopicTest />
              </ProtectedRoute>
            } />
            <Route path="/student/writing-assessment/:dayId" element={
              <ProtectedRoute requiredRole="student">
                <WritingAssessment />
              </ProtectedRoute>
            } />

            {/* Tutor routes */}
            <Route path="/tutor/dashboard" element={
              <ProtectedRoute requiredRole="tutor">
                <TutorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/tutor/students" element={
              <ProtectedRoute requiredRole="tutor">
                <TutorStudents />
              </ProtectedRoute>
            } />
            <Route path="/tutor/student-approval" element={
              <ProtectedRoute requiredRole="tutor">
                <StudentApproval />
              </ProtectedRoute>
            } />
            <Route path="/tutor/cohorts" element={
              <ProtectedRoute requiredRole="tutor">
                <TutorCohorts />
              </ProtectedRoute>
            } />
            <Route path="/tutor/upload" element={
              <ProtectedRoute requiredRole="tutor">
                <TutorUpload />
              </ProtectedRoute>
            } />
            
            {/* Curriculum Template routes */}
            <Route path="/tutor/curriculum" element={
              <ProtectedRoute requiredRole="tutor">
                <CurriculumMaterials />
              </ProtectedRoute>
            } />
            <Route path="/tutor/curriculum/:curriculumId" element={
              <ProtectedRoute requiredRole="tutor">
                <CurriculumTrimesters />
              </ProtectedRoute>
            } />
            <Route path="/tutor/curriculum/:curriculumId/trimester/:trimesterId" element={
              <ProtectedRoute requiredRole="tutor">
                <CurriculumDays />
              </ProtectedRoute>
            } />
            <Route path="/tutor/curriculum/:curriculumId/trimester/:trimesterId/day/:dayId/edit" element={
              <ProtectedRoute requiredRole="tutor">
                <CurriculumDayEditor />
              </ProtectedRoute>
            } />
            
            {/* Curriculum Question editor routes */}
            <Route path="/tutor/curriculum/:curriculumId/trimester/:trimesterId/day/:dayId/vocabulary-questions" element={
              <ProtectedRoute requiredRole="tutor">
                <VocabularyQuestionEditor />
              </ProtectedRoute>
            } />
            <Route path="/tutor/curriculum/:curriculumId/trimester/:trimesterId/day/:dayId/topic-questions" element={
              <ProtectedRoute requiredRole="tutor">
                <TopicQuestionEditor />
              </ProtectedRoute>
            } />
            <Route path="/tutor/curriculum/:curriculumId/trimester/:trimesterId/day/:dayId/writing-prompts" element={
              <ProtectedRoute requiredRole="tutor">
                <WritingPromptEditor />
              </ProtectedRoute>
            } />
            
            {/* Cohort Management routes */}
            <Route path="/tutor/materials" element={
              <ProtectedRoute requiredRole="tutor">
                <CohortMaterials />
              </ProtectedRoute>
            } />
            <Route path="/tutor/materials/cohort/:cohortId" element={
              <ProtectedRoute requiredRole="tutor">
                <TrimesterMaterials />
              </ProtectedRoute>
            } />
            <Route path="/tutor/materials/cohort/:cohortId/trimester/:trimesterId" element={
              <ProtectedRoute requiredRole="tutor">
                <DaysList />
              </ProtectedRoute>
            } />
            <Route path="/tutor/materials/cohort/:cohortId/trimester/:trimesterId/day/:dayId/edit" element={
              <ProtectedRoute requiredRole="tutor">
                <DayEditor />
              </ProtectedRoute>
            } />
            
            {/* Cohort Question editor routes */}
            <Route path="/tutor/materials/cohort/:cohortId/trimester/:trimesterId/day/:dayId/questions/vocabulary" element={
              <ProtectedRoute requiredRole="tutor">
                <VocabularyQuestionEditor />
              </ProtectedRoute>
            } />
            <Route path="/tutor/materials/cohort/:cohortId/trimester/:trimesterId/day/:dayId/questions/topic" element={
              <ProtectedRoute requiredRole="tutor">
                <TopicQuestionEditor />
              </ProtectedRoute>
            } />
            <Route path="/tutor/materials/cohort/:cohortId/trimester/:trimesterId/day/:dayId/questions/writing" element={
              <ProtectedRoute requiredRole="tutor">
                <WritingPromptEditor />
              </ProtectedRoute>
            } />

            {/* 404 - This must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
