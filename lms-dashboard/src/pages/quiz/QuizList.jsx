import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaClock, FaCheck, FaTrash, FaEdit, FaEye, FaEyeSlash, FaPlay } from 'react-icons/fa';
import Card from '../../components/common/Card';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

export default function QuizList() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch quizzes
        const quizParams = selectedCourse ? { courseId: selectedCourse } : {};
        const quizResponse = await api.getQuizzes(quizParams);
        setQuizzes(quizResponse.data.quizzes || []);

        // Fetch courses for filter
        let coursesData = [];
        if (user?.role === 'instructor') {
          const coursesResponse = await api.getMyCourses();
          coursesData = coursesResponse.data.courses || [];
        } else {
          const coursesResponse = await api.getEnrolledCourses();
          coursesData = coursesResponse.data.courses || [];
        }
        setCourses(coursesData);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load data';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCourse, user?.role]);

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    try {
      await api.deleteQuiz(quizId);
      toast.success('Quiz deleted successfully!');
      
      // Refresh quizzes
      const quizParams = selectedCourse ? { courseId: selectedCourse } : {};
      const quizResponse = await api.getQuizzes(quizParams);
      setQuizzes(quizResponse.data.quizzes || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete quiz';
      toast.error(errorMessage);
    }
  };

  const toggleQuizStatus = async (quizId, currentStatus) => {
    try {
      await api.updateQuiz(quizId, { isActive: !currentStatus });
      toast.success(`Quiz ${!currentStatus ? 'enabled' : 'disabled'} successfully!`);
      
      // Refresh quizzes
      const quizParams = selectedCourse ? { courseId: selectedCourse } : {};
      const quizResponse = await api.getQuizzes(quizParams);
      setQuizzes(quizResponse.data.quizzes || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update quiz';
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="p-4 md:p-6 text-center">Loading quizzes...</div>;
  if (error) return <div className="p-4 md:p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Quizzes</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {courses.length > 0 && (
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 border rounded focus:ring-primary focus:border-primary"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          )}
          {user?.role === 'instructor' && (
            <Link
              to="/quiz/create"
              className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              <FaPlus className="mr-2" />
              Create Quiz
            </Link>
          )}
        </div>
      </div>

      {quizzes.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">
              {user?.role === 'instructor' 
                ? 'No quizzes created yet.' 
                : 'No quizzes available. Enroll in courses to see quizzes.'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {quizzes.map(quiz => (
            <Card key={quiz.id}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold line-clamp-2">{quiz.title}</h3>
                  <span className={`px-2 py-1 text-sm rounded flex-shrink-0 ml-2 ${
                    quiz.isEnabled 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {quiz.isEnabled ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2">{quiz.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-gray-500 flex-shrink-0" />
                    <span>{quiz.duration} mins</span>
                  </div>
                  <div className="flex items-center">
                    <FaCheck className="mr-2 text-gray-500 flex-shrink-0" />
                    <span>{quiz.questions} questions</span>
                  </div>
                </div>

                {quiz.course && (
                  <div className="text-sm text-gray-600">
                    Course: <span className="line-clamp-1">{quiz.course.title}</span>
                  </div>
                )}

                {user?.role === 'instructor' ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <div>Total Attempts: {quiz.attempts}</div>
                      <div>Average Score: {Math.round(quiz.avgScore)}%</div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <button
                        onClick={() => toggleQuizStatus(quiz.id, quiz.isEnabled)}
                        className={`flex items-center px-3 py-1 rounded text-xs ${
                          quiz.isEnabled
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {quiz.isEnabled ? (
                          <>
                            <FaEyeSlash className="mr-1" />
                            Disable
                          </>
                        ) : (
                          <>
                            <FaEye className="mr-1" />
                            Enable
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        to={`/quiz/${quiz.id}`}
                        className="flex items-center justify-center py-2 text-primary border border-primary rounded hover:bg-primary/10"
                      >
                        <FaPlay className="mr-1" />
                        Test
                      </Link>
                      <div className="flex gap-2">
                        <Link
                          to={`/quiz/${quiz.id}/edit`}
                          className="flex-1 flex items-center justify-center py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          <FaEdit />
                        </Link>
                        <Link
                          to={`/quiz/${quiz.id}/results`}
                          className="flex-1 flex items-center justify-center py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Results
                        </Link>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="flex-1 flex items-center justify-center py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {quiz.userAttempts > 0 && (
                      <div className="text-sm text-gray-600">
                        <div>Your Attempts: {quiz.userAttempts}/{quiz.maxAttempts}</div>
                        {quiz.avgScore !== null && (
                          <div>Last Score: {Math.round(quiz.avgScore)}%</div>
                        )}
                      </div>
                    )}
                    {quiz.canAttempt ? (
                      <Link
                        to={`/quiz/${quiz.id}`}
                        className="block w-full text-center py-2 bg-primary text-white rounded hover:bg-primary/90"
                      >
                        {quiz.userAttempts > 0 ? 'Retake Quiz' : 'Start Quiz'}
                      </Link>
                    ) : (
                      <div className="text-center py-2 bg-gray-300 text-gray-600 rounded">
                        {quiz.allowMultipleAttempts 
                          ? 'Maximum attempts reached' 
                          : 'Already attempted'}
                      </div>
                    )}
                    {quiz.userAttempts > 0 && (
                      <Link
                        to={`/quiz/${quiz.id}/results`}
                        className="block w-full text-center py-2 border border-primary text-primary rounded hover:bg-primary/10"
                      >
                        View Results
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}