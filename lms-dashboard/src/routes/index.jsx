import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/auth/Login';
import InstructorDashboard from '../pages/dashboard/InstructorDashboard';
import StudentDashboard from '../pages/dashboard/StudentDashboard';
import CourseList from '../pages/courses/CourseList';
import CourseDetails from '../pages/courses/CourseDetails';
import CreateCourse from '../pages/courses/CreateCourse';
import EditCourse from '../pages/courses/EditCourse';
import ChapterList from '../pages/chapters/ChapterList';
import CreateChapter from '../pages/chapters/CreateChapter';
import EditChapter from '../pages/chapters/EditChapter';
import LessonPlayer from '../pages/lessons/LessonPlayer';
import CreateLesson from '../pages/lessons/CreateLesson';
import EditLesson from '../pages/lessons/EditLesson';
import QuizList from '../pages/quiz/QuizList';
import CreateQuiz from '../pages/quiz/CreateQuiz';
import EditQuiz from '../pages/quiz/EditQuiz';
import AttemptQuiz from '../pages/quiz/AttemptQuiz';
import QuizResults from '../pages/quiz/QuizResults';
import AssessmentList from '../pages/assessments/AssessmentList';
import CreateAssessment from '../pages/assessments/CreateAssessment';
import SubmitAssessment from '../pages/assessments/SubmitAssessment';
import AssessmentSubmissions from '../pages/assessments/AssessmentSubmissions';
import DiscussionForum from '../pages/discussions/DiscussionForum';
import DiscussionDetails from '../pages/discussions/DiscussionDetails';
import DoubtBox from '../pages/doubts/DoubtBox';
import ProgrammingEnv from '../pages/programming/ProgrammingEnv';
import Profile from '../pages/profile/Profile';
import NotFound from '../pages/NotFound';
import MainLayout from '../components/layout/MainLayout';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        user ? <Navigate to="/" /> : <Login />
      } />
      
      <Route path="/" element={
        <PrivateRoute>
          <MainLayout />
        </PrivateRoute>
      }>
        <Route index element={
          user?.role === 'instructor' ? 
            <InstructorDashboard /> : 
            <StudentDashboard />
        } />
        
        <Route path="courses">
          <Route index element={<CourseList />} />
          {user?.role === 'instructor' && (
            <>
              <Route path="create" element={<CreateCourse />} />
              <Route path=":id/edit" element={<EditCourse />} />
            </>
          )}
          <Route path=":id" element={<CourseDetails />} />
          
          {/* Chapter routes */}
          <Route path=":id/chapters">
            <Route index element={<ChapterList />} />
            {user?.role === 'instructor' && (
              <>
                <Route path="create" element={<CreateChapter />} />
                <Route path=":chapterId/edit" element={<EditChapter />} />
              </>
            )}
            
            {/* Lesson routes */}
            <Route path=":chapterId/lessons">
              {user?.role === 'instructor' && (
                <>
                  <Route path="create" element={<CreateLesson />} />
                  <Route path=":lessonId/edit" element={<EditLesson />} />
                </>
              )}
              <Route path=":lessonId" element={<LessonPlayer />} />
            </Route>
          </Route>
        </Route>
        
        <Route path="quiz">
          <Route index element={<QuizList />} />
          {user?.role === 'instructor' && (
            <>
              <Route path="create" element={<CreateQuiz />} />
              <Route path=":id/edit" element={<EditQuiz />} />
            </>
          )}
          <Route path=":id/results" element={<QuizResults />} />
          <Route path=":id" element={<AttemptQuiz />} />
        </Route>

        <Route path="assessments">
          <Route index element={<AssessmentList />} />
          {user?.role === 'instructor' && (
            <>
              <Route path="create" element={<CreateAssessment />} />
              <Route path=":id/submissions" element={<AssessmentSubmissions />} />
            </>
          )}
          <Route path=":id/submit" element={<SubmitAssessment />} />
        </Route>

        <Route path="discussions">
          <Route index element={<DiscussionForum />} />
          <Route path=":id" element={<DiscussionDetails />} />
        </Route>
        <Route path="doubts" element={<DoubtBox />} />
        <Route path="programming" element={<ProgrammingEnv />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;