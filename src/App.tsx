
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

// Public pages
import Index from '@/pages/Index';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import FAQ from '@/pages/FAQ';
import Privacy from '@/pages/Privacy';
import LearnMore from '@/pages/LearnMore';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import EmbeddedAssessment from '@/pages/EmbeddedAssessment';
import NotFound from '@/pages/NotFound';

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

const queryClient = new QueryClient();

function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Toaster />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/assessment" element={<EmbeddedAssessment />} />

            {/* Student routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/cohorts" element={<StudentCohorts />} />
            <Route path="/student/trimesters/:cohortId" element={<StudentTrimesters />} />
            <Route path="/student/lessons/:cohortId/:trimesterId" element={<StudentLessons />} />
            <Route path="/student/day/:dayId" element={<StudentDayContent />} />
            <Route path="/student/assessments" element={<StudentAssessments />} />
            <Route path="/student/vocabulary-test/:dayId" element={<VocabularyTest />} />
            <Route path="/student/topic-test/:dayId" element={<TopicTest />} />
            <Route path="/student/writing-assessment/:dayId" element={<WritingAssessment />} />

            {/* Tutor routes */}
            <Route path="/tutor/dashboard" element={<TutorDashboard />} />
            <Route path="/tutor/students" element={<TutorStudents />} />
            <Route path="/tutor/cohorts" element={<TutorCohorts />} />
            <Route path="/tutor/upload" element={<TutorUpload />} />
            
            {/* Curriculum Template routes */}
            <Route path="/tutor/curriculum" element={<CurriculumMaterials />} />
            <Route path="/tutor/curriculum/:curriculumId" element={<CurriculumTrimesters />} />
            <Route path="/tutor/curriculum/:curriculumId/trimester/:trimesterId" element={<CurriculumDays />} />
            <Route path="/tutor/curriculum/:curriculumId/trimester/:trimesterId/day/:dayId/edit" element={<CurriculumDayEditor />} />
            
            {/* Curriculum Question editor routes */}
            <Route path="/tutor/curriculum/:curriculumId/trimester/:trimesterId/day/:dayId/vocabulary-questions" element={<VocabularyQuestionEditor />} />
            <Route path="/tutor/curriculum/:curriculumId/trimester/:trimesterId/day/:dayId/topic-questions" element={<TopicQuestionEditor />} />
            <Route path="/tutor/curriculum/:curriculumId/trimester/:trimesterId/day/:dayId/writing-prompts" element={<WritingPromptEditor />} />
            
            {/* Cohort Management routes */}
            <Route path="/tutor/materials" element={<CohortMaterials />} />
            <Route path="/tutor/materials/cohort/:cohortId" element={<TrimesterMaterials />} />
            <Route path="/tutor/materials/cohort/:cohortId/trimester/:trimesterId" element={<DaysList />} />
            <Route path="/tutor/materials/cohort/:cohortId/trimester/:trimesterId/day/:dayId/edit" element={<DayEditor />} />
            
            {/* Cohort Question editor routes */}
            <Route path="/tutor/materials/cohort/:cohortId/trimester/:trimesterId/day/:dayId/questions/vocabulary" element={<VocabularyQuestionEditor />} />
            <Route path="/tutor/materials/cohort/:cohortId/trimester/:trimesterId/day/:dayId/questions/topic" element={<TopicQuestionEditor />} />
            <Route path="/tutor/materials/cohort/:cohortId/trimester/:trimesterId/day/:dayId/questions/writing" element={<WritingPromptEditor />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
